import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getToolById } from "@/lib/tools-data";
import { Upload, Download, Copy, Trash2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SvgOptimizer = () => {
  const [inputSvg, setInputSvg] = useState("");
  const [outputSvg, setOutputSvg] = useState("");
  const [options, setOptions] = useState({
    removeComments: true,
    removeMetadata: true,
    removeXmlDeclaration: true,
    removeEmptyAttributes: true,
    collapseWhitespace: true,
    removeUnusedDefs: true,
    minifyColors: true,
    removeDoctype: true,
  });
  const [stats, setStats] = useState<{ original: number; optimized: number } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.endsWith(".svg")) {
      toast({ title: "Error", description: "Please upload an SVG file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputSvg(event.target?.result as string);
    };
    reader.readAsText(file);
  }, [toast]);

  const optimizeSvg = () => {
    if (!inputSvg.trim()) {
      toast({ title: "Error", description: "Please provide SVG content", variant: "destructive" });
      return;
    }

    let optimized = inputSvg;

    // Remove XML declaration
    if (options.removeXmlDeclaration) {
      optimized = optimized.replace(/<\?xml[^?]*\?>/gi, "");
    }

    // Remove DOCTYPE
    if (options.removeDoctype) {
      optimized = optimized.replace(/<!DOCTYPE[^>]*>/gi, "");
    }

    // Remove comments
    if (options.removeComments) {
      optimized = optimized.replace(/<!--[\s\S]*?-->/g, "");
    }

    // Remove metadata
    if (options.removeMetadata) {
      optimized = optimized.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
      optimized = optimized.replace(/<title>[\s\S]*?<\/title>/gi, "");
      optimized = optimized.replace(/<desc>[\s\S]*?<\/desc>/gi, "");
    }

    // Remove empty attributes
    if (options.removeEmptyAttributes) {
      optimized = optimized.replace(/\s+\w+=""/g, "");
    }

    // Minify colors (simple hex shortening)
    if (options.minifyColors) {
      optimized = optimized.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/gi, "#$1$2$3");
    }

    // Collapse whitespace
    if (options.collapseWhitespace) {
      optimized = optimized.replace(/>\s+</g, "><");
      optimized = optimized.replace(/\s{2,}/g, " ");
      optimized = optimized.trim();
    }

    // Remove empty defs
    if (options.removeUnusedDefs) {
      optimized = optimized.replace(/<defs>\s*<\/defs>/gi, "");
    }

    setOutputSvg(optimized);
    setStats({
      original: new Blob([inputSvg]).size,
      optimized: new Blob([optimized]).size,
    });

    toast({ title: "Optimized!", description: "SVG has been optimized" });
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(outputSvg);
    toast({ title: "Copied!", description: "Optimized SVG copied to clipboard" });
  };

  const downloadSvg = () => {
    const blob = new Blob([outputSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optimized.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputSvg("");
    setOutputSvg("");
    setStats(null);
  };

  const savings = stats ? Math.round((1 - stats.optimized / stats.original) * 100) : 0;

  const tool = getToolById("svg-optimizer")!;

  const seoContent = {
    description: "Optimize and minify SVG files to reduce file size while preserving visual quality.",
    content: `<h3>Introduction to SVG Optimization</h3><p>SVG files often contain unnecessary data like metadata, comments, and verbose formatting. Our SVG Optimizer removes bloat while preserving visual quality, reducing file sizes by up to 50% or more.</p><h3>How to Use</h3><p>Upload an SVG file or paste SVG code, select optimization options, click 'Optimize SVG' to process, and preview the result before downloading.</p><h3>Key Features</h3><ul><li>Remove comments and metadata</li><li>Collapse whitespace</li><li>Minify colors</li><li>Preview before/after</li></ul>`,
    keywords: ["svg optimizer", "svg minifier", "optimize svg", "reduce svg size", "svg compression"],
    faqs: [
      { question: "Will optimization change how my SVG looks?", answer: "No, our optimizer only removes non-visual data. The rendered appearance remains identical." },
      { question: "What gets removed?", answer: "Comments, metadata, empty elements, unnecessary whitespace, and other non-essential data." }
    ],
    aboutTool: "Our SVG Optimizer reduces file sizes by removing unnecessary data while preserving visual quality. Perfect for web performance optimization."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(options).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: !!checked }))}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Input SVG</label>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <Textarea
              value={inputSvg}
              onChange={(e) => setInputSvg(e.target.value)}
              placeholder="Paste your SVG code here or upload a file..."
              className="min-h-[300px] font-mono text-xs"
            />
            {inputSvg && (
              <p className="text-xs text-muted-foreground">
                Size: {(new Blob([inputSvg]).size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Optimized SVG</label>
            <Textarea
              value={outputSvg}
              readOnly
              placeholder="Optimized SVG will appear here..."
              className="min-h-[300px] font-mono text-xs"
            />
            {outputSvg && stats && (
              <p className="text-xs text-green-600">
                Size: {(stats.optimized / 1024).toFixed(2)} KB ({savings}% smaller)
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={optimizeSvg} disabled={!inputSvg}>
            <Wand2 className="w-4 h-4 mr-2" />
            Optimize SVG
          </Button>
          <Button variant="outline" onClick={copyOutput} disabled={!outputSvg}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={downloadSvg} disabled={!outputSvg}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        {stats && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{(stats.original / 1024).toFixed(2)} KB</p>
                  <p className="text-sm text-muted-foreground">Original</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{savings}%</p>
                  <p className="text-sm text-muted-foreground">Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{(stats.optimized / 1024).toFixed(2)} KB</p>
                  <p className="text-sm text-muted-foreground">Optimized</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {outputSvg && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="flex items-center justify-center p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3QgZmlsbD0iI2YwZjBmMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgZmlsbD0iI2ZmZmZmZiIgeD0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IGZpbGw9IiNmZmZmZmYiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZjBmMGYwIiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] rounded-lg"
                dangerouslySetInnerHTML={{ __html: outputSvg }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default SvgOptimizer;
