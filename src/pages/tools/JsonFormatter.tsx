import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

export default function JsonFormatterPage() {
  const tool = getToolById("json-formatter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  useEffect(() => {
    if (!input.trim()) {
      setIsValid(null);
      setError(null);
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setError(null);
      setOutput(JSON.stringify(parsed, null, indentSize));
    } catch (e) {
      setIsValid(false);
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, indentSize]);

  const handleFormat = () => {
    if (!input.trim()) {
      toast.error("Please enter JSON to format");
      return;
    }
    if (isValid) {
      toast.success("JSON formatted successfully!");
    }
  };

  const handleMinify = () => {
    if (!input.trim() || !isValid) {
      toast.error("Please enter valid JSON first");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      toast.success("JSON minified!");
    } catch (e) {
      toast.error("Failed to minify JSON");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    toast.success("Copied to clipboard!");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError(null);
  };

  const loadSample = () => {
    const sample = {
      "name": "ToolSuiteX",
      "version": "1.0.0",
      "description": "Multi-functional SaaS platform",
      "features": [
        "Resume Builder",
        "JSON Formatter",
        "Image Compressor"
      ],
      "config": {
        "theme": "dark",
        "language": "en",
        "analytics": true
      },
      "stats": {
        "users": 50000,
        "tools": 50,
        "satisfaction": 4.9
      }
    };
    setInput(JSON.stringify(sample));
  };

  const seoContent = {
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection. Perfect for developers working with APIs and configuration files.",
    content: `
      <h3>JSON Formatter: Your Essential Development Tool</h3>
      <p>Working with JSON data is a daily task for developers. Whether you're debugging API responses, creating configuration files, or analyzing data structures, a reliable JSON formatter is indispensable. Our tool provides instant formatting with real-time validation.</p>
      
      <h4>Why Format JSON?</h4>
      <p>Raw JSON from APIs often comes minified to reduce bandwidth. While efficient for transmission, minified JSON is nearly impossible for humans to read. Proper formatting with indentation and line breaks makes the structure immediately clear and errors easy to spot.</p>
      
      <h4>Real-Time Validation</h4>
      <p>Our formatter validates your JSON as you type, instantly highlighting syntax errors with specific error messages. This saves time compared to submitting invalid JSON to an API and waiting for error responses.</p>
      
      <h4>Common JSON Errors</h4>
      <p>The most frequent JSON mistakes include: missing quotes around keys, trailing commas after the last element, using single quotes instead of double quotes, and unescaped special characters. Our validator catches all these instantly.</p>
      
      <h4>Browser-Based Privacy</h4>
      <p>Your JSON data never leaves your browser. This is crucial when working with sensitive data like API keys, user information, or proprietary configurations. Format with confidence knowing your data stays private.</p>
    `,
    keywords: [
      "JSON Formatter Online",
      "JSON Validator",
      "JSON Beautifier",
      "Pretty Print JSON",
      "JSON Parser",
      "JSON Minifier",
      "API JSON Formatter",
      "JSON Syntax Checker",
      "Format JSON Online",
      "JSON Editor"
    ],
    faqs: [
      {
        question: "What is JSON and why do I need to format it?",
        answer: "JSON (JavaScript Object Notation) is a lightweight data format used for storing and transmitting data. Formatting adds proper indentation and line breaks, making complex nested structures readable and easier to debug."
      },
      {
        question: "Does this tool upload my JSON data anywhere?",
        answer: "No. All processing happens locally in your browser using JavaScript. Your JSON data never leaves your device, ensuring complete privacy for sensitive information."
      },
      {
        question: "Can I minify JSON as well as format it?",
        answer: "Yes! Click the 'Minify' button to compress your JSON by removing all whitespace. This is useful when preparing JSON for production APIs where smaller payloads improve performance."
      },
      {
        question: "What types of JSON errors does this tool detect?",
        answer: "The validator detects all JSON syntax errors including: missing or extra commas, unmatched brackets, improper quote usage, invalid escape sequences, and malformed values like undefined."
      },
      {
        question: "Can I change the indentation size?",
        answer: "Yes, you can switch between 2-space and 4-space indentation using the indent selector. Choose based on your team's coding standards or personal preference."
      },
      {
        question: "What's the maximum JSON size I can format?",
        answer: "Since processing happens in your browser, the limit depends on your device's memory. Modern browsers can typically handle JSON files up to several megabytes without issues."
      }
    ],
    aboutTool: "The ToolSuiteX JSON Formatter is a powerful browser-based tool for developers. It provides real-time JSON validation, beautiful formatting with customizable indentation, and one-click minification. Perfect for working with API responses, configuration files, and data analysis. All processing happens locally in your browser, ensuring your sensitive data never leaves your device."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Validation Status */}
            {isValid !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  isValid
                    ? "bg-green-500/10 text-green-500"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isValid ? (
                  <>
                    <Check className="w-4 h-4" />
                    Valid JSON
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Invalid JSON
                  </>
                )}
              </motion.div>
            )}

            {/* Indent Size */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Indent:</span>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-muted rounded px-2 py-1 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              <Wand2 className="w-4 h-4 mr-2" />
              Load Sample
            </Button>
            <Button variant="outline" size="sm" onClick={handleMinify} disabled={!isValid}>
              Minify
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output && !input}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-mono"
          >
            {error}
          </motion.div>
        )}

        {/* Editor Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Input JSON</span>
              <span className="text-muted-foreground font-normal">
                {input.length} characters
              </span>
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here... e.g., {"name": "value"}'
              className="h-[500px] font-mono text-sm resize-none"
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              <span>Formatted Output</span>
              <span className="text-muted-foreground font-normal">
                {output.length} characters
              </span>
            </label>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="h-[500px] font-mono text-sm resize-none bg-muted/50"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
