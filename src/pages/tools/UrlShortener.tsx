import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Link2, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

interface ShortenedUrl {
  id: string;
  original: string;
  short: string;
  created: Date;
  clicks: number;
}

const UrlShortener = () => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [urls, setUrls] = useState<ShortenedUrl[]>(() => {
    const saved = localStorage.getItem("shortened-urls");
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const generateShortCode = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!url.trim()) {
      toast({ title: "Error", description: "Please enter a URL", variant: "destructive" });
      return;
    }

    let urlToShorten = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      urlToShorten = "https://" + url;
    }

    if (!isValidUrl(urlToShorten)) {
      toast({ title: "Error", description: "Please enter a valid URL", variant: "destructive" });
      return;
    }

    const shortCode = customAlias.trim() || generateShortCode();
    
    // Check if alias already exists
    if (urls.some(u => u.short.includes(shortCode))) {
      toast({ title: "Error", description: "This alias is already taken", variant: "destructive" });
      return;
    }

    const newUrl: ShortenedUrl = {
      id: crypto.randomUUID(),
      original: urlToShorten,
      short: `${window.location.origin}/s/${shortCode}`,
      created: new Date(),
      clicks: 0,
    };

    const updatedUrls = [newUrl, ...urls];
    setUrls(updatedUrls);
    localStorage.setItem("shortened-urls", JSON.stringify(updatedUrls));
    
    setUrl("");
    setCustomAlias("");
    
    toast({ title: "URL Shortened!", description: "Your short link is ready" });
  };

  const copyUrl = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    toast({ title: "Copied!", description: "Short URL copied to clipboard" });
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter(u => u.id !== id);
    setUrls(updatedUrls);
    localStorage.setItem("shortened-urls", JSON.stringify(updatedUrls));
    toast({ title: "Deleted", description: "URL removed from history" });
  };

  const clearAll = () => {
    setUrls([]);
    localStorage.removeItem("shortened-urls");
    toast({ title: "Cleared", description: "All URLs removed" });
  };

  const tool = getToolById("url-shortener")!;

  const seoContent = {
    description: "Create short, memorable links for your URLs. Stored locally in your browser for complete privacy.",
    content: `<h3>Introduction to URL Shortening</h3><p>Create short, memorable links for your long URLs. Our URL Shortener stores everything locally in your browser - no accounts, no tracking, complete privacy.</p><h3>How to Use</h3><p>Enter or paste your long URL, optionally add a custom alias for your short link, click 'Shorten URL' to generate the short link, and copy and share your shortened URL.</p><h3>Key Features</h3><ul><li>Custom aliases</li><li>Local storage (no server)</li><li>Link history</li><li>One-click copy</li></ul>`,
    keywords: ["url shortener", "link shortener", "short url", "shorten link", "url minifier"],
    faqs: [
      { question: "Are shortened URLs permanent?", answer: "URLs are stored in your browser's localStorage. They persist until you clear browser data." },
      { question: "Can others access my short URLs?", answer: "This demo version stores links locally only. For production use, integrate with a backend service." }
    ],
    aboutTool: "Our URL Shortener creates short, memorable links stored locally in your browser. Perfect for demonstrations and personal use with complete privacy."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Shorten URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enter URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label>Custom Alias (optional)</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-muted rounded-l-md text-sm text-muted-foreground">
                  {window.location.origin}/s/
                </span>
                <Input
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                  placeholder="my-link"
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty for a random 6-character code
              </p>
            </div>

            <Button onClick={shortenUrl} className="w-full">
              <Link2 className="w-4 h-4 mr-2" />
              Shorten URL
            </Button>
          </CardContent>
        </Card>

        {urls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Your Links ({urls.length})
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urls.map((item) => (
                  <div key={item.id} className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <a 
                        href={item.short} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-primary hover:underline flex items-center gap-1"
                      >
                        {item.short.replace(window.location.origin, "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => copyUrl(item.short)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteUrl(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.original}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(item.created).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>Note:</strong> This URL shortener stores links locally in your browser. 
              Links are not actually routable and are for demonstration purposes only. 
              For production use, integrate with a backend service.
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default UrlShortener;
