import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Copy, Download, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("markdown-editor")!;

// Simple markdown to HTML converter
function parseMarkdown(md: string): string {
  let html = md;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
  
  // Horizontal rule
  html = html.replace(/^---$/gim, "<hr />");
  
  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");
  
  return html;
}

const defaultMarkdown = `# Welcome to Markdown Editor

## Introduction
This is a **live preview** markdown editor. Start typing on the left to see the preview on the right!

### Features
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks and \`inline code\`
- Lists and headers
- And much more!

> This is a blockquote. Great for highlighting important information.

\`\`\`javascript
// Code blocks are supported too!
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

---

Start editing to see the magic happen!
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    toast.success("Markdown copied!");
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  };

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    a { color: #0066cc; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${parseMarkdown(markdown)}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded!");
  };

  const seoContent = {
    description: "Write and preview Markdown with live rendering, syntax highlighting, and export to .md or .html. Free online Markdown editor for developers.",
    content: `<h3>Live Markdown Editor</h3><p>Real-time preview as you type with export to .md and .html.</p>`,
    keywords: ["markdown editor", "markdown preview", "markdown to html", "README editor"],
    faqs: [
      { question: "What syntax is supported?", answer: "Headers, bold, italic, links, images, code blocks, lists, and more." },
      { question: "Is content saved?", answer: "No automatic saving - download your work before leaving." },
    ],
    aboutTool: "Write and preview Markdown in real-time with split view, edit-only, and preview-only modes. Export to .md or .html.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Markdown Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "edit" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("edit")}
                className="rounded-none"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "split" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("split")}
                className="rounded-none"
              >
                Split
              </Button>
              <Button
                variant={viewMode === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
                className="rounded-none"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              .md
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
              <Download className="w-4 h-4 mr-1" />
              .html
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"}`}>
            {(viewMode === "edit" || viewMode === "split") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Markdown</label>
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="font-mono text-sm min-h-[500px] resize-none"
                  placeholder="Write your markdown here..."
                />
              </div>
            )}
            {(viewMode === "preview" || viewMode === "split") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md min-h-[500px] bg-background overflow-auto"
                  style={{
                    maxHeight: "500px",
                  }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
