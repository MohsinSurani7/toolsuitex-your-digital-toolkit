import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: number;
}

const TextDiff = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });
  const { toast } = useToast();

  const computeDiff = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    
    const result: DiffLine[] = [];
    let added = 0, removed = 0, unchanged = 0;
    
    // Simple line-by-line diff using LCS concept
    const maxLen = Math.max(lines1.length, lines2.length);
    const set1 = new Set(lines1);
    const set2 = new Set(lines2);
    
    let i = 0, j = 0;
    let lineNum = 1;
    
    while (i < lines1.length || j < lines2.length) {
      if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
        result.push({ type: "unchanged", content: lines1[i], lineNumber: lineNum++ });
        unchanged++;
        i++;
        j++;
      } else if (i < lines1.length && !set2.has(lines1[i])) {
        result.push({ type: "removed", content: lines1[i], lineNumber: lineNum++ });
        removed++;
        i++;
      } else if (j < lines2.length && !set1.has(lines2[j])) {
        result.push({ type: "added", content: lines2[j], lineNumber: lineNum++ });
        added++;
        j++;
      } else if (i < lines1.length) {
        result.push({ type: "removed", content: lines1[i], lineNumber: lineNum++ });
        removed++;
        i++;
      } else if (j < lines2.length) {
        result.push({ type: "added", content: lines2[j], lineNumber: lineNum++ });
        added++;
        j++;
      }
    }
    
    setDiff(result);
    setStats({ added, removed, unchanged });
    
    toast({
      title: "Comparison Complete",
      description: `Found ${added} additions, ${removed} removals, ${unchanged} unchanged lines`,
    });
  };

  const copyDiff = () => {
    const diffText = diff.map(line => {
      const prefix = line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
      return prefix + line.content;
    }).join("\n");
    
    navigator.clipboard.writeText(diffText);
    toast({ title: "Copied!", description: "Diff copied to clipboard" });
  };

  const clearAll = () => {
    setText1("");
    setText2("");
    setDiff([]);
    setStats({ added: 0, removed: 0, unchanged: 0 });
  };

  const tool = getToolById("text-diff")!;

  const seoContent = {
    description: "Compare two text blocks and highlight additions, removals, and unchanged lines with color coding. Free online text diff tool for code review.",
    content: `<h3>Introduction to Text Diff</h3><p>Text comparison is essential for developers, writers, and anyone who needs to track changes between document versions. Our Text Diff tool provides instant, visual comparison of two text blocks with clear highlighting of additions, removals, and unchanged content.</p><h3>How It Works</h3><p>Simply paste your original text in the left panel and the modified text in the right panel. Click 'Compare Texts' to generate the diff and view highlighted differences with line-by-line breakdown.</p><h3>Key Features</h3><ul><li>Line-by-line comparison</li><li>Color-coded differences (green for additions, red for removals)</li><li>Copy diff output</li><li>Statistics on changes</li></ul>`,
    keywords: ["text diff", "compare text", "text comparison", "diff tool", "find differences", "code diff"],
    faqs: [
      { question: "How does the diff algorithm work?", answer: "Our tool uses a line-by-line comparison algorithm that identifies additions, removals, and unchanged lines between the two text inputs." },
      { question: "Can I compare code files?", answer: "Yes, the tool works with any text including source code, configuration files, and documentation." }
    ],
    aboutTool: "Our Text Diff tool provides instant, visual comparison of two text blocks. Perfect for code review, document editing, and content verification. All processing happens in your browser for complete privacy."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Original Text</label>
            <Textarea
              placeholder="Paste your original text here..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Modified Text</label>
            <Textarea
              placeholder="Paste your modified text here..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={computeDiff} disabled={!text1 && !text2}>
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Texts
          </Button>
          <Button variant="outline" onClick={copyDiff} disabled={diff.length === 0}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Diff
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {diff.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-4 flex-wrap">
                <Badge variant="default" className="bg-green-600">
                  +{stats.added} Added
                </Badge>
                <Badge variant="destructive">
                  -{stats.removed} Removed
                </Badge>
                <Badge variant="secondary">
                  {stats.unchanged} Unchanged
                </Badge>
              </div>
              
              <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-[400px] overflow-y-auto">
                {diff.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-2 py-0.5 ${
                      line.type === "added" 
                        ? "bg-green-500/20 text-green-400" 
                        : line.type === "removed" 
                        ? "bg-red-500/20 text-red-400" 
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="inline-block w-8 text-muted-foreground/60">{line.lineNumber}</span>
                    <span className="inline-block w-4">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    </span>
                    {line.content || " "}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default TextDiff;
