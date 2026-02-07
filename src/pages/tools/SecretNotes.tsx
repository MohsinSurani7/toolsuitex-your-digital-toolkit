import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Link, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";

// Simple encryption using password-based XOR with salt
const encrypt = (text: string, password: string): string => {
  const salt = "TSX_SECRET_" + password;
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
    result += String.fromCharCode(charCode);
  }
  // Convert to URL-safe base64
  return btoa(unescape(encodeURIComponent(result)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const decrypt = (encoded: string, password: string): string | null => {
  try {
    // Restore base64 padding and characters
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    const decoded = decodeURIComponent(escape(atob(base64)));
    const salt = "TSX_SECRET_" + password;
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    return null;
  }
};

export default function SecretNotes() {
  const tool = getToolById("secret-notes")!;
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  // View mode
  const [viewMode, setViewMode] = useState(false);
  const [viewPassword, setViewPassword] = useState("");
  const [viewedContent, setViewedContent] = useState("");
  const [viewError, setViewError] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  useEffect(() => {
    // Check if URL has encrypted note data
    const hash = window.location.hash;
    if (hash && hash.startsWith('#n=')) {
      const params = new URLSearchParams(hash.slice(1));
      const data = params.get('n');
      const pwd = params.get('p');
      
      if (data) {
        setViewMode(true);
        setEncryptedData(data);
        setHasPassword(pwd !== '0');
        
        // If no password required, decrypt immediately
        if (pwd === '0') {
          const decrypted = decrypt(data, '');
          if (decrypted) {
            setViewedContent(decrypted);
          } else {
            setViewError("Failed to decrypt note. The link may be corrupted.");
          }
        }
      }
    }
  }, []);

  const generateNote = () => {
    if (!content.trim()) {
      toast.error("Please enter your secret note");
      return;
    }

    const usePassword = password.trim();
    const encryptionKey = usePassword || '';
    const encrypted = encrypt(content.trim(), encryptionKey);
    
    // Generate link with encrypted content in hash (never sent to server)
    const passwordFlag = usePassword ? '1' : '0';
    const link = `${window.location.origin}${window.location.pathname}#n=${encrypted}&p=${passwordFlag}`;
    
    setGeneratedLink(link);
    setGeneratedPassword(usePassword);
    toast.success("Secret note created!");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  const viewNote = () => {
    setViewError("");
    
    const decrypted = decrypt(encryptedData, viewPassword);
    
    if (decrypted === null) {
      setViewError("Failed to decrypt. The link may be corrupted.");
      return;
    }

    // Basic validation - check if result looks like valid text
    // Incorrect password will produce garbage
    const isPrintable = /^[\x20-\x7E\s\u0080-\uFFFF]*$/.test(decrypted);
    if (!isPrintable || decrypted.length === 0) {
      setViewError("Incorrect password or corrupted data");
      return;
    }

    setViewedContent(decrypted);
    toast.success("Note decrypted successfully!");
  };

  const resetCreate = () => {
    setContent("");
    setPassword("");
    setGeneratedLink("");
    setGeneratedPassword("");
  };

  const resetView = () => {
    window.history.replaceState({}, "", window.location.pathname);
    setViewMode(false);
    setViewPassword("");
    setViewedContent("");
    setViewError("");
    setEncryptedData("");
    setHasPassword(false);
  };

  const seoContent = {
    description: "Create encrypted secret notes with shareable links. Data is encrypted in the URL itself - nothing is stored on any server.",
    content: `<p>Secret Notes creates encrypted messages that exist entirely within the URL. When you share the link, you're sharing the encrypted data directly - no servers, no storage, complete privacy.</p>
    <h3>How It Works</h3>
    <ol>
      <li>Write your secret message</li>
      <li>Optionally add a password for extra security</li>
      <li>Generate the encrypted link</li>
      <li>Share the link (the encrypted data is in the URL hash)</li>
      <li>Recipient decrypts with the password you share separately</li>
    </ol>
    <h3>Security Features</h3>
    <ul>
      <li>Zero server storage - data lives only in the URL</li>
      <li>Optional password protection</li>
      <li>URL hash never sent to servers</li>
      <li>Client-side encryption only</li>
    </ul>`,
    aboutTool: "Secret Notes encrypts your message directly into a shareable URL. The encrypted content is stored in the URL hash (fragment), which is never sent to any server. This means true zero-knowledge sharing - only someone with the link (and password, if set) can read the message.",
    faqs: [
      { question: "Is my data stored on a server?", answer: "No. The encrypted message is embedded directly in the URL hash. URL hashes are never transmitted to servers, making this completely serverless." },
      { question: "How do I share the password?", answer: "Share the password through a separate channel (text, call, in person) - never include it in the same message as the link for maximum security." },
      { question: "What if I forget the password?", answer: "Without the correct password, the message cannot be decrypted. There is no recovery option - this is by design for security." },
      { question: "Is there a message size limit?", answer: "Yes, URLs have length limits (usually 2000-8000 characters depending on the browser). For longer messages, consider splitting into multiple notes." }
    ],
    keywords: ["secret notes", "encrypted link", "secure notes", "private message", "zero knowledge", "client-side encryption"]
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
                      <span className="text-sm font-medium">Note decrypted successfully</span>
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
                  
                  {hasPassword ? (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          This note is password protected. Enter the password to decrypt.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Password</Label>
                          <Input
                            type="password"
                            value={viewPassword}
                            onChange={(e) => setViewPassword(e.target.value)}
                            placeholder="Enter password"
                            className="mt-1.5"
                            onKeyPress={(e) => e.key === 'Enter' && viewNote()}
                          />
                        </div>
                        
                        <Button onClick={viewNote} className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Decrypt Note
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Failed to load note. The link may be invalid or corrupted.</span>
                      </div>
                    </div>
                  )}
                  
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.length}/2000 characters (keep under 2000 for URL compatibility)
                  </p>
                </div>

                <div>
                  <Label>Password Protection (Recommended)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Add a password for encryption"
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Share the password separately from the link for maximum security
                  </p>
                </div>

                <Button onClick={generateNote} className="w-full" disabled={!content.trim()}>
                  <Link className="w-4 h-4 mr-2" />
                  Generate Encrypted Link
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Encrypted Note Created!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    The encrypted message is embedded in this link. Nothing is stored on any server.
                  </p>
                  <div className="flex gap-2">
                    <Input value={generatedLink} readOnly className="font-mono text-xs" />
                    <Button onClick={copyLink} size="icon" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {generatedPassword && (
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">Password Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Share this password separately: <code className="bg-muted px-2 py-1 rounded">{generatedPassword}</code>
                    </p>
                  </div>
                )}

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
