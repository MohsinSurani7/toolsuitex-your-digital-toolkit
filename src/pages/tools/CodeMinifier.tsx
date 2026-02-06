import { useState } from "react";
import { motion } from "framer-motion";
import { Minimize2, Copy, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("code-minifier")!;

function minifyHTML(code: string): string {
  return code
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .replace(/\s*=\s*/g, "=")
    .trim();
}

function minifyCSS(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*;\s*/g, ";")
    .replace(/;}/g, "}")
    .trim();
}

function minifyJS(code: string): string {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,=:+\-*/<>!&|])\s*/g, "$1")
    .trim();
}

export default function CodeMinifier() {
  const [htmlInput, setHtmlInput] = useState("");
  const [cssInput, setCssInput] = useState("");
  const [jsInput, setJsInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [cssOutput, setCssOutput] = useState("");
  const [jsOutput, setJsOutput] = useState("");

  const handleMinifyHTML = () => {
    if (!htmlInput.trim()) {
      toast.error("Please enter some HTML code");
      return;
    }
    const minified = minifyHTML(htmlInput);
    setHtmlOutput(minified);
    const savings = ((1 - minified.length / htmlInput.length) * 100).toFixed(1);
    toast.success(`HTML minified! ${savings}% size reduction`);
  };

  const handleMinifyCSS = () => {
    if (!cssInput.trim()) {
      toast.error("Please enter some CSS code");
      return;
    }
    const minified = minifyCSS(cssInput);
    setCssOutput(minified);
    const savings = ((1 - minified.length / cssInput.length) * 100).toFixed(1);
    toast.success(`CSS minified! ${savings}% size reduction`);
  };

  const handleMinifyJS = () => {
    if (!jsInput.trim()) {
      toast.error("Please enter some JavaScript code");
      return;
    }
    const minified = minifyJS(jsInput);
    setJsOutput(minified);
    const savings = ((1 - minified.length / jsInput.length) * 100).toFixed(1);
    toast.success(`JavaScript minified! ${savings}% size reduction`);
  };

  const copyOutput = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`Minified ${type} copied!`);
  };

  const downloadOutput = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const seoContent = {
    description: "Minify HTML, CSS, and JavaScript for faster page loading.",
    content: `<h3>Code Minification</h3><p>Reduce file sizes by removing whitespace and comments.</p>`,
    keywords: ["minify", "compress", "HTML minifier", "CSS minifier", "JavaScript minifier"],
    faqs: [
      { question: "What does minification do?", answer: "Removes unnecessary characters without changing functionality." },
      { question: "Will it break my code?", answer: "Minification preserves functionality. Always test before deploying." },
    ],
    aboutTool: "Minify HTML, CSS, and JavaScript code to reduce file sizes and improve website performance.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minimize2 className="w-5 h-5" />
            HTML/CSS/JS Minifier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input HTML</label>
                  <Textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="Paste your HTML code here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleMinifyHTML} className="flex-1">
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minify HTML
                    </Button>
                    <Button variant="outline" onClick={() => setHtmlInput("")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minified Output</label>
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    placeholder="Minified HTML will appear here..."
                    rows={12}
                    className="font-mono text-sm bg-muted"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyOutput(htmlOutput, "HTML")}
                      disabled={!htmlOutput}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadOutput(htmlOutput, "minified.html")}
                      disabled={!htmlOutput}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input CSS</label>
                  <Textarea
                    value={cssInput}
                    onChange={(e) => setCssInput(e.target.value)}
                    placeholder="Paste your CSS code here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleMinifyCSS} className="flex-1">
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minify CSS
                    </Button>
                    <Button variant="outline" onClick={() => setCssInput("")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minified Output</label>
                  <Textarea
                    value={cssOutput}
                    readOnly
                    placeholder="Minified CSS will appear here..."
                    rows={12}
                    className="font-mono text-sm bg-muted"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyOutput(cssOutput, "CSS")}
                      disabled={!cssOutput}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadOutput(cssOutput, "minified.css")}
                      disabled={!cssOutput}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="js" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input JavaScript</label>
                  <Textarea
                    value={jsInput}
                    onChange={(e) => setJsInput(e.target.value)}
                    placeholder="Paste your JavaScript code here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleMinifyJS} className="flex-1">
                      <Minimize2 className="w-4 h-4 mr-2" />
                      Minify JS
                    </Button>
                    <Button variant="outline" onClick={() => setJsInput("")}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minified Output</label>
                  <Textarea
                    value={jsOutput}
                    readOnly
                    placeholder="Minified JavaScript will appear here..."
                    rows={12}
                    className="font-mono text-sm bg-muted"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyOutput(jsOutput, "JavaScript")}
                      disabled={!jsOutput}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadOutput(jsOutput, "minified.js")}
                      disabled={!jsOutput}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
