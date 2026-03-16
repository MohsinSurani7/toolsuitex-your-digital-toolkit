import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Wand2, Code } from "lucide-react";
import { toast } from "sonner";
import { js_beautify, css_beautify, html_beautify } from "js-beautify";

type Language = "javascript" | "css" | "html";

const beautifyOptions = {
  indent_size: 2,
  indent_char: " ",
  max_preserve_newlines: 2,
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: "normal" as const,
  brace_style: "collapse" as const,
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: true,
  wrap_line_length: 0,
  indent_inner_html: true,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false
};

export default function CodeBeautifier() {
  const tool = getToolById("code-beautifier")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [indentSize, setIndentSize] = useState("2");

  const beautify = () => {
    if (!input.trim()) {
      toast.error("Please enter code to beautify");
      return;
    }

    try {
      const options = {
        ...beautifyOptions,
        indent_size: parseInt(indentSize)
      };

      let result: string;
      switch (language) {
        case "javascript":
          result = js_beautify(input, options);
          break;
        case "css":
          result = css_beautify(input, options);
          break;
        case "html":
          result = html_beautify(input, options);
          break;
        default:
          result = input;
      }

      setOutput(result);
      toast.success("Code beautified!");
    } catch (err) {
      toast.error("Failed to beautify code. Check your syntax.");
      console.error(err);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput("");
  };

  const sampleCode = {
    javascript: `function hello(name){if(name){console.log("Hello, "+name+"!")}else{console.log("Hello, World!")}}hello("Developer");const arr=[1,2,3,4,5];arr.forEach(function(item){console.log(item*2)});`,
    css: `.container{display:flex;flex-direction:column;align-items:center;padding:20px;background-color:#f5f5f5;}.header{font-size:24px;font-weight:bold;color:#333;margin-bottom:16px;}.button{padding:12px 24px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;}.button:hover{background:#0056b3;}`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Document</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph.</p><button onclick="alert('clicked')">Click me</button></div></body></html>`
  };

  const loadSample = () => {
    setInput(sampleCode[language]);
    setOutput("");
  };

  const seoContent = {
    description: "Format and beautify minified JavaScript, CSS, and HTML code for better readability. Free online code beautifier with proper indentation output.",
    content: `<p>The Code Beautifier transforms messy, minified, or compressed code into clean, readable format. Perfect for debugging, code review, or understanding obfuscated code.</p>
    <h3>Supported Languages</h3>
    <ul>
      <li><strong>JavaScript:</strong> Format minified JS with proper indentation</li>
      <li><strong>CSS:</strong> Beautify compressed stylesheets</li>
      <li><strong>HTML:</strong> Format condensed HTML markup</li>
    </ul>
    <h3>Features</h3>
    <ul>
      <li>Customizable indentation (2 or 4 spaces)</li>
      <li>Preserves code functionality</li>
      <li>Handles complex nested structures</li>
    </ul>`,
    aboutTool: "The Code De-Obfuscator & Beautifier takes messy, minified, or compressed JS/HTML/CSS code and formats it into clean, readable structure. Powered by the js-beautify library for reliable formatting.",
    faqs: [
      { question: "Does beautifying change how my code works?", answer: "No, beautifying only changes formatting (whitespace, indentation). The code functionality remains exactly the same." },
      { question: "Can it de-obfuscate heavily encrypted code?", answer: "This tool formats and indents code. For heavily obfuscated code with variable renaming, you may need specialized de-obfuscation tools." },
      { question: "What indent sizes are supported?", answer: "You can choose between 2 spaces (more compact) or 4 spaces (more readable)." },
      { question: "Is my code secure?", answer: "Yes, all processing happens in your browser. Your code is never sent to any server." }
    ],
    keywords: ["code beautifier", "js beautify", "css formatter", "html formatter", "code formatter", "minified code", "prettify code"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Label>Language:</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label>Indent:</Label>
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm" onClick={loadSample}>
                Load Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Input (Minified/Messy)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={`Paste your minified ${language.toUpperCase()} code here...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <Button onClick={beautify} className="w-full mt-4">
                <Wand2 className="w-4 h-4 mr-2" />
                Beautify Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Output (Beautified)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                placeholder="Beautified code will appear here..."
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={copyOutput} variant="outline" className="flex-1" disabled={!output}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={swapInputOutput} variant="outline" className="flex-1" disabled={!output}>
                  Use as Input
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
