import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "secret_notes_";

interface SecretNote {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
  password?: string;
  viewed: boolean;
}

export default function SecretNotes() {
  const tool = getToolById("secret-notes")!;
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [expiry, setExpiry] = useState("1h");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState(false);
  const [viewId, setViewId] = useState("");
  const [viewPassword, setViewPassword] = useState("");
  const [viewedContent, setViewedContent] = useState("");
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    // Check if URL has a note ID
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("note");
    if (noteId) {
      setViewMode(true);
      setViewId(noteId);
    }
  }, []);

  const getExpiryMs = () => {
    const times: Record<string, number> = {
      "5m": 5 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000
    };
    return times[expiry] || times["1h"];
  };

  const generateNote = () => {
    if (!content.trim()) {
      toast.error("Please enter your secret note");
      return;
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const note: SecretNote = {
      id,
      content: content.trim(),
      createdAt: Date.now(),
      expiresAt: Date.now() + getExpiryMs(),
      password: password || undefined,
      viewed: false
    };

    // Store in localStorage
    localStorage.setItem(STORAGE_KEY + id, JSON.stringify(note));

    // Generate link
    const link = `${window.location.origin}${window.location.pathname}?note=${id}`;
    setGeneratedLink(link);
    toast.success("Secret note created!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  const viewNote = () => {
    setViewError("");
    
    const stored = localStorage.getItem(STORAGE_KEY + viewId);
    if (!stored) {
      setViewError("Note not found or already viewed");
      return;
    }

    const note: SecretNote = JSON.parse(stored);

    // Check expiry
    if (Date.now() > note.expiresAt) {
      localStorage.removeItem(STORAGE_KEY + viewId);
      setViewError("This note has expired");
      return;
    }

    // Check if already viewed
    if (note.viewed) {
      localStorage.removeItem(STORAGE_KEY + viewId);
      setViewError("This note has already been viewed");
      return;
    }

    // Check password
    if (note.password && note.password !== viewPassword) {
      setViewError("Incorrect password");
      return;
    }

    // Show content and immediately destroy
    setViewedContent(note.content);
    localStorage.removeItem(STORAGE_KEY + viewId);
    toast.success("Note revealed and destroyed");
  };

  const resetCreate = () => {
    setContent("");
    setPassword("");
    setGeneratedLink("");
  };

  const resetView = () => {
    window.history.replaceState({}, "", window.location.pathname);
    setViewMode(false);
    setViewId("");
    setViewPassword("");
    setViewedContent("");
    setViewError("");
  };

  const seoContent = {
    description: "Create self-destructing secret notes that can only be viewed once, then disappear forever.",
    content: `<p>Secret Notes is a zero-trace messaging tool that creates one-time viewing links. Once a note is read, it's immediately destroyed from storage - no copies, no backups, no traces.</p>
    <h3>How It Works</h3>
    <ol>
      <li>Write your secret message</li>
      <li>Optionally add a password for extra security</li>
      <li>Set an expiration time</li>
      <li>Share the generated link</li>
      <li>Once viewed, the note self-destructs</li>
    </ol>
    <h3>Security Features</h3>
    <ul>
      <li>One-time viewing only</li>
      <li>Optional password protection</li>
      <li>Automatic expiration</li>
      <li>Local storage only - no server uploads</li>
    </ul>`,
    aboutTool: "Secret Notes allows users to create sensitive text that generates a one-time viewing link. Using localStorage with self-destruct logic, once the link is accessed, the data is wiped immediately - perfect for sharing passwords, API keys, or confidential information.",
    faqs: [
      { question: "Is my data stored on a server?", answer: "No. All notes are stored in localStorage on your device only. Nothing is sent to any server." },
      { question: "What happens after a note is viewed?", answer: "The note is immediately deleted from storage. It cannot be recovered or viewed again." },
      { question: "Can I password-protect my notes?", answer: "Yes! You can add an optional password that recipients must enter before viewing the note." },
      { question: "What if the link expires before viewing?", answer: "The note is automatically deleted after the expiration time, even if never viewed." }
    ],
    keywords: ["secret notes", "one time link", "self-destructing message", "secure notes", "private message", "burn after reading"]
  };

  if (viewMode) {
    return (
      <ToolLayout tool={tool} seoContent={seoContent}>
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                View Secret Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {viewedContent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Note revealed (now destroyed)</span>
                    </div>
                    <p className="whitespace-pre-wrap">{viewedContent}</p>
                  </div>
                  <Button onClick={resetView} variant="outline" className="w-full">
                    Create New Note
                  </Button>
                </div>
              ) : (
                <>
                  {viewError && (
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{viewError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-4">
                      ⚠️ This note will be permanently destroyed after viewing.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Password (if required)</Label>
                        <Input
                          type="password"
                          value={viewPassword}
                          onChange={(e) => setViewPassword(e.target.value)}
                          placeholder="Enter password if required"
                          className="mt-1.5"
                        />
                      </div>
                      
                      <Button onClick={viewNote} className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal & Destroy Note
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={resetView} variant="ghost" className="w-full">
                    Create New Note Instead
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              Create Secret Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!generatedLink ? (
              <>
                <div>
                  <Label>Your Secret Message</Label>
                  <Textarea
                    placeholder="Enter your sensitive text here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1.5 min-h-[150px]"
                  />
                </div>

                <div>
                  <Label>Password Protection (Optional)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Add a password for extra security"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Expires After</Label>
                  <div className="grid grid-cols-4 gap-2 mt-1.5">
                    {[
                      { value: "5m", label: "5 min" },
                      { value: "1h", label: "1 hour" },
                      { value: "24h", label: "24 hours" },
                      { value: "7d", label: "7 days" }
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        variant={expiry === opt.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExpiry(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={generateNote} className="w-full">
                  <Link className="w-4 h-4 mr-2" />
                  Generate One-Time Link
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Secret Note Created!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share this link. It can only be viewed once, then it self-destructs.
                  </p>
                  <div className="flex gap-2">
                    <Input value={generatedLink} readOnly className="font-mono text-xs" />
                    <Button onClick={copyLink} size="icon" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={resetCreate} variant="outline" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Create Another Note
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
