import { useState } from "react";
import { motion } from "framer-motion";
import { CaseSensitive, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("case-converter")!;

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "toggle";

const conversions: { id: CaseType; name: string; description: string }[] = [
  { id: "upper", name: "UPPERCASE", description: "ALL LETTERS UPPERCASE" },
  { id: "lower", name: "lowercase", description: "all letters lowercase" },
  { id: "title", name: "Title Case", description: "First Letter Of Each Word Capitalized" },
  { id: "sentence", name: "Sentence case", description: "First letter of each sentence capitalized" },
  { id: "camel", name: "camelCase", description: "First word lowercase, rest capitalized" },
  { id: "pascal", name: "PascalCase", description: "Every word capitalized, no spaces" },
  { id: "snake", name: "snake_case", description: "Words separated by underscores" },
  { id: "kebab", name: "kebab-case", description: "Words separated by hyphens" },
  { id: "toggle", name: "tOGGLE cASE", description: "Invert the case of each letter" },
];

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    case "sentence":
      return text.toLowerCase().replace(/(^\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    case "camel":
      return text.toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^[A-Z]/, c => c.toLowerCase());
    case "pascal":
      return text.toLowerCase()
        .replace(/(?:^|\s|[^a-zA-Z0-9])+(.)/g, (_, c) => c.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, "");
    case "snake":
      return text.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    case "kebab":
      return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
    case "toggle":
      return text.split("").map(c => 
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      ).join("");
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeType, setActiveType] = useState<CaseType | null>(null);

  const handleConvert = (type: CaseType) => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }
    const converted = convertCase(input, type);
    setOutput(converted);
    setActiveType(type);
    toast.success(`Converted to ${conversions.find(c => c.id === type)?.name}!`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setActiveType(null);
  };

  const seoContent = {
    description: "Convert text between uppercase, lowercase, title case, camelCase, and more.",
    content: `<h3>Text Case Conversion</h3><p>Transform text between 9 different case formats instantly.</p>`,
    keywords: ["case converter", "uppercase", "lowercase", "title case", "camelCase", "snake_case"],
    faqs: [
      { question: "What is camelCase?", answer: "First word lowercase, subsequent words capitalized - used in programming." },
      { question: "When should I use snake_case?", answer: "Popular in Python and database column names." },
    ],
    aboutTool: "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CaseSensitive className="w-5 h-5" />
              Case Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Text</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to convert..."
                rows={4}
                className="text-lg"
              />
            </div>

            {/* Conversion Buttons */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {conversions.map((conv) => (
                <Button
                  key={conv.id}
                  variant={activeType === conv.id ? "default" : "outline"}
                  onClick={() => handleConvert(conv.id)}
                  className="h-auto py-3 flex flex-col"
                  title={conv.description}
                >
                  <span className="text-xs font-medium">{conv.name}</span>
                </Button>
              ))}
            </div>

            {/* Output */}
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Result</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg min-h-[100px]">
                  <p className="whitespace-pre-wrap break-words">{output}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
