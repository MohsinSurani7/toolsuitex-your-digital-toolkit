import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

const commonPatterns = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}" },
  { name: "IP Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Time (HH:MM)", pattern: "([01]?\\d|2[0-3]):[0-5]\\d" },
  { name: "Hex Color", pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})" },
  { name: "HTML Tag", pattern: "<([a-z]+)[^>]*>(.*?)<\\/\\1>" },
  { name: "Credit Card", pattern: "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b" },
  { name: "ZIP Code", pattern: "\\b\\d{5}(-\\d{4})?\\b" },
];

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const { toast } = useToast();

  const flagString = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join("");

  const result = useMemo(() => {
    if (!pattern || !testString) return null;

    try {
      const regex = new RegExp(pattern, flagString);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      
      let match;
      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, testString, flagString, flags.g]);

  const highlightedText = useMemo(() => {
    if (!result?.matches.length || !testString) return testString;

    let lastIndex = 0;
    const parts: { text: string; isMatch: boolean }[] = [];

    for (const match of result.matches) {
      if (match.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
      }
      parts.push({ text: match.match, isMatch: true });
      lastIndex = match.index + match.match.length;
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }

    return parts;
  }, [result, testString]);

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagString}`);
    toast({ title: "Copied!", description: "Regex pattern copied to clipboard" });
  };

  const applyPreset = (preset: string) => {
    setPattern(preset);
  };

  const tool = getToolById("regex-tester")!;

  const seoContent = {
    description: "Test and debug regular expressions with real-time matching, group highlighting, and common pattern library.",
    content: `<h3>Introduction to Regex Testing</h3><p>Regular expressions are powerful pattern matching tools used in programming and text processing. Our Regex Tester provides real-time matching, group highlighting, and a library of common patterns to help you build and debug regex patterns efficiently.</p><h3>How to Use</h3><p>Enter your regex pattern, select flags (global, case-insensitive, multiline, dotAll), and paste your test string to view real-time matches and capture groups.</p><h3>Key Features</h3><ul><li>Real-time pattern matching</li><li>Capture group highlighting</li><li>Multiple flag options</li><li>Common pattern presets</li></ul>`,
    keywords: ["regex tester", "regular expression", "pattern matching", "regex debugger", "regex online"],
    faqs: [
      { question: "What regex flavor does this use?", answer: "This tool uses JavaScript's built-in RegExp engine, which follows ECMAScript standards." },
      { question: "Can I test multiline patterns?", answer: "Yes, enable the 'm' flag for multiline matching where ^ and $ match line boundaries." }
    ],
    aboutTool: "Our Regex Tester helps you build, test, and debug regular expressions with real-time feedback. Perfect for developers working with form validation, data extraction, or text processing."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Regular Expression</label>
            <div className="flex gap-2">
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className="font-mono"
              />
              <Button variant="outline" onClick={copyPattern} disabled={!pattern}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {result?.error && (
              <p className="text-sm text-destructive">{result.error}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {Object.entries(flags).map(([flag, enabled]) => (
              <div key={flag} className="flex items-center gap-2">
                <Checkbox
                  id={flag}
                  checked={enabled}
                  onCheckedChange={(checked) => setFlags(prev => ({ ...prev, [flag]: !!checked }))}
                />
                <label htmlFor={flag} className="text-sm font-mono">
                  {flag} - {flag === "g" ? "global" : flag === "i" ? "case-insensitive" : flag === "m" ? "multiline" : "dotAll"}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Test String</label>
            <Textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              className="min-h-[150px] font-mono"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Matches
                {result?.matches && (
                  <Badge variant="secondary">{result.matches.length} found</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result?.matches.length ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {result.matches.map((match, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded-lg font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-primary">{match.match}</span>
                        <span className="text-muted-foreground">index: {match.index}</span>
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Groups: {match.groups.map((g, i) => (
                            <Badge key={i} variant="outline" className="ml-1">{g || "(empty)"}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No matches found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Highlighted Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                {Array.isArray(highlightedText) ? (
                  highlightedText.map((part, idx) => (
                    <span
                      key={idx}
                      className={part.isMatch ? "bg-primary/30 text-primary px-0.5 rounded" : ""}
                    >
                      {part.text}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">{highlightedText || "Enter text to see highlights..."}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Common Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {commonPatterns.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset.pattern)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default RegexTester;
