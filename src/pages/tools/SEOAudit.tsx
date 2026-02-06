import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SEOCheck {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  weight: number;
}

export default function SEOAudit() {
  const tool = getToolById("seo-audit")!;
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState<"html" | "url">("html");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checks, setChecks] = useState<SEOCheck[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const analyzeHTML = (html: string): SEOCheck[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const results: SEOCheck[] = [];

    // Title tag
    const title = doc.querySelector("title");
    if (!title || !title.textContent?.trim()) {
      results.push({ name: "Title Tag", status: "fail", message: "Missing title tag", weight: 15 });
    } else if (title.textContent.length < 30) {
      results.push({ name: "Title Tag", status: "warning", message: `Title too short (${title.textContent.length} chars). Aim for 50-60 chars.`, weight: 15 });
    } else if (title.textContent.length > 60) {
      results.push({ name: "Title Tag", status: "warning", message: `Title too long (${title.textContent.length} chars). May be truncated in SERPs.`, weight: 15 });
    } else {
      results.push({ name: "Title Tag", status: "pass", message: `Good title length (${title.textContent.length} chars)`, weight: 15 });
    }

    // Meta description
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (!metaDesc || !metaDesc.getAttribute("content")?.trim()) {
      results.push({ name: "Meta Description", status: "fail", message: "Missing meta description", weight: 15 });
    } else {
      const descLength = metaDesc.getAttribute("content")!.length;
      if (descLength < 120) {
        results.push({ name: "Meta Description", status: "warning", message: `Description too short (${descLength} chars). Aim for 150-160 chars.`, weight: 15 });
      } else if (descLength > 160) {
        results.push({ name: "Meta Description", status: "warning", message: `Description too long (${descLength} chars). May be truncated.`, weight: 15 });
      } else {
        results.push({ name: "Meta Description", status: "pass", message: `Good description length (${descLength} chars)`, weight: 15 });
      }
    }

    // H1 tag
    const h1Tags = doc.querySelectorAll("h1");
    if (h1Tags.length === 0) {
      results.push({ name: "H1 Tag", status: "fail", message: "No H1 tag found", weight: 15 });
    } else if (h1Tags.length > 1) {
      results.push({ name: "H1 Tag", status: "warning", message: `Multiple H1 tags found (${h1Tags.length}). Use only one.`, weight: 15 });
    } else {
      results.push({ name: "H1 Tag", status: "pass", message: "Single H1 tag found", weight: 15 });
    }

    // Heading hierarchy
    const h2Tags = doc.querySelectorAll("h2");
    const h3Tags = doc.querySelectorAll("h3");
    if (h2Tags.length === 0 && h3Tags.length > 0) {
      results.push({ name: "Heading Hierarchy", status: "warning", message: "H3 tags found without H2 tags. Check heading structure.", weight: 10 });
    } else if (h2Tags.length > 0) {
      results.push({ name: "Heading Hierarchy", status: "pass", message: `Good structure: ${h2Tags.length} H2s, ${h3Tags.length} H3s`, weight: 10 });
    } else {
      results.push({ name: "Heading Hierarchy", status: "warning", message: "No subheadings found. Consider adding H2/H3 tags.", weight: 10 });
    }

    // Image alt tags
    const images = doc.querySelectorAll("img");
    const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute("alt")?.trim());
    if (images.length === 0) {
      results.push({ name: "Image Alt Tags", status: "warning", message: "No images found", weight: 10 });
    } else if (imagesWithoutAlt.length > 0) {
      results.push({ name: "Image Alt Tags", status: "fail", message: `${imagesWithoutAlt.length}/${images.length} images missing alt text`, weight: 10 });
    } else {
      results.push({ name: "Image Alt Tags", status: "pass", message: `All ${images.length} images have alt text`, weight: 10 });
    }

    // Meta viewport
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (!viewport) {
      results.push({ name: "Mobile Viewport", status: "fail", message: "Missing viewport meta tag", weight: 10 });
    } else {
      results.push({ name: "Mobile Viewport", status: "pass", message: "Viewport meta tag present", weight: 10 });
    }

    // Canonical URL
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
      results.push({ name: "Canonical URL", status: "warning", message: "No canonical URL specified", weight: 5 });
    } else {
      results.push({ name: "Canonical URL", status: "pass", message: "Canonical URL defined", weight: 5 });
    }

    // Open Graph tags
    const ogTitle = doc.querySelector('meta[property="og:title"]');
    const ogDesc = doc.querySelector('meta[property="og:description"]');
    const ogImage = doc.querySelector('meta[property="og:image"]');
    const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
    if (ogCount === 0) {
      results.push({ name: "Open Graph Tags", status: "warning", message: "No Open Graph tags found", weight: 5 });
    } else if (ogCount < 3) {
      results.push({ name: "Open Graph Tags", status: "warning", message: `Incomplete OG tags (${ogCount}/3)`, weight: 5 });
    } else {
      results.push({ name: "Open Graph Tags", status: "pass", message: "All essential OG tags present", weight: 5 });
    }

    // Language attribute
    const htmlLang = doc.documentElement.getAttribute("lang");
    if (!htmlLang) {
      results.push({ name: "Language Attribute", status: "warning", message: "No lang attribute on HTML tag", weight: 5 });
    } else {
      results.push({ name: "Language Attribute", status: "pass", message: `Language set to "${htmlLang}"`, weight: 5 });
    }

    return results;
  };

  const calculateScore = (checks: SEOCheck[]): number => {
    const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
    const earnedWeight = checks.reduce((sum, c) => {
      if (c.status === "pass") return sum + c.weight;
      if (c.status === "warning") return sum + c.weight * 0.5;
      return sum;
    }, 0);
    return Math.round((earnedWeight / totalWeight) * 100);
  };

  const analyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter HTML or URL to analyze");
      return;
    }

    setIsAnalyzing(true);
    setChecks([]);
    setScore(null);

    try {
      let html = input;

      if (inputType === "url") {
        toast.error("URL fetching requires a backend. Please paste the HTML directly.");
        setIsAnalyzing(false);
        return;
      }

      const results = analyzeHTML(html);
      setChecks(results);
      setScore(calculateScore(results));
      toast.success("Analysis complete!");
    } catch {
      toast.error("Failed to analyze. Please check your input.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getStatusIcon = (status: SEOCheck["status"]) => {
    switch (status) {
      case "pass": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "fail": return <XCircle className="w-5 h-5 text-destructive" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const seoContent = {
    description: "Analyze HTML for on-page SEO issues and get actionable recommendations.",
    content: `<p>The Frontend SEO Audit Tool helps you identify on-page SEO issues before publishing. Analyze your HTML to ensure optimal search engine visibility.</p>
    <h3>What We Check</h3>
    <ul>
      <li>Title tag presence and length</li>
      <li>Meta description optimization</li>
      <li>Heading hierarchy (H1, H2, H3)</li>
      <li>Image alt attributes</li>
      <li>Mobile viewport settings</li>
      <li>Open Graph tags</li>
      <li>Canonical URLs</li>
    </ul>`,
    aboutTool: "The Frontend SEO Audit Tool analyzes HTML for on-page SEO factors. It checks title tags, meta descriptions, heading structure, image alt tags, and more, providing a 0-100 score with actionable recommendations.",
    faqs: [
      { question: "Can I analyze a live URL?", answer: "Currently, you need to paste the HTML directly. URL fetching requires a backend which we avoid for privacy." },
      { question: "What's a good SEO score?", answer: "Aim for 80+ for well-optimized pages. 60-80 is acceptable but has room for improvement." },
      { question: "Does this check page speed?", answer: "This tool focuses on on-page SEO elements. For speed testing, use tools like Lighthouse or PageSpeed Insights." },
      { question: "Is my HTML stored?", answer: "No, all analysis happens in your browser. Nothing is sent to any server." }
    ],
    keywords: ["seo audit", "seo checker", "on-page seo", "seo analysis", "meta tags", "seo tool", "website audit"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={inputType === "html" ? "default" : "outline"}
                onClick={() => setInputType("html")}
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Paste HTML
              </Button>
            </div>

            <div>
              <Label>Paste your HTML code</Label>
              <Textarea
                placeholder="<!DOCTYPE html><html>..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-1.5 min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button onClick={analyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze SEO
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {score !== null && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </div>
                <p className="text-muted-foreground">out of 100</p>
                <Progress value={score} className="mt-4 h-3" />
              </div>

              <div className="space-y-3">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{check.name}</span>
                        <Badge variant={check.status === "pass" ? "default" : check.status === "warning" ? "secondary" : "destructive"}>
                          {check.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{check.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
