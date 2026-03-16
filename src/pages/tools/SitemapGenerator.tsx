import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Download, Map, Copy } from "lucide-react";
import { toast } from "sonner";

interface SitemapUrl {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const tool = getToolById("sitemap-generator")!;

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { id: crypto.randomUUID(), loc: "/", lastmod: new Date().toISOString().split("T")[0], changefreq: "weekly", priority: "1.0" },
  ]);

  const addUrl = () => {
    setUrls([...urls, { id: crypto.randomUUID(), loc: "/new-page", lastmod: new Date().toISOString().split("T")[0], changefreq: "monthly", priority: "0.5" }]);
  };

  const removeUrl = (id: string) => {
    if (urls.length > 1) {
      setUrls(urls.filter((u) => u.id !== id));
    }
  };

  const updateUrl = (id: string, field: keyof SitemapUrl, value: string) => {
    setUrls(urls.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const generateSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
    return xml;
  };

  const downloadSitemap = () => {
    const xml = generateSitemap();
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Sitemap downloaded!");
  };

  const copySitemap = () => {
    navigator.clipboard.writeText(generateSitemap());
    toast.success("Sitemap copied to clipboard!");
  };

  const seoContent = {
    description: "Generate SEO-friendly XML sitemaps for your website with customizable priority and crawl frequency. Free sitemap generator, no signup required.",
    content: `<h3>Introduction</h3><p>Create properly formatted XML sitemaps to help search engines crawl your website efficiently.</p><h3>Key Benefits</h3><ul><li>Standard XML format</li><li>Customizable priority and frequency</li><li>Instant download</li><li>SEO-compliant structure</li></ul>`,
    keywords: ["sitemap generator", "XML sitemap", "SEO sitemap", "website sitemap"],
    faqs: [
      { question: "What is a sitemap?", answer: "A sitemap helps search engines discover and index your website pages." },
      { question: "Where do I put the sitemap?", answer: "Upload it to your website root (e.g., example.com/sitemap.xml)." },
    ],
    aboutTool: "Our Sitemap Generator creates SEO-friendly XML sitemaps for any website.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Sitemap Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Base URL</Label>
              <Input placeholder="https://example.com" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>URLs</Label>
                <Button size="sm" variant="outline" onClick={addUrl}>
                  <Plus className="w-4 h-4 mr-1" /> Add URL
                </Button>
              </div>

              {urls.map((url) => (
                <div key={url.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Input className="flex-1" placeholder="/page-path" value={url.loc} onChange={(e) => updateUrl(url.id, "loc", e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeUrl(url.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Last Modified</Label>
                      <Input type="date" value={url.lastmod} onChange={(e) => updateUrl(url.id, "lastmod", e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-xs">Change Freq</Label>
                      <Select value={url.changefreq} onValueChange={(v) => updateUrl(url.id, "changefreq", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Select value={url.priority} onValueChange={(v) => updateUrl(url.id, "priority", v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">1.0</SelectItem>
                          <SelectItem value="0.9">0.9</SelectItem>
                          <SelectItem value="0.8">0.8</SelectItem>
                          <SelectItem value="0.7">0.7</SelectItem>
                          <SelectItem value="0.6">0.6</SelectItem>
                          <SelectItem value="0.5">0.5</SelectItem>
                          <SelectItem value="0.4">0.4</SelectItem>
                          <SelectItem value="0.3">0.3</SelectItem>
                          <SelectItem value="0.2">0.2</SelectItem>
                          <SelectItem value="0.1">0.1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={downloadSitemap}>
                <Download className="w-4 h-4 mr-2" /> Download XML
              </Button>
              <Button variant="outline" onClick={copySitemap}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>XML Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[500px]">
              <code>{generateSitemap()}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
