import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy, Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const promptTemplates = {
  general: {
    role: "an expert assistant",
    structure: (input: string, context: string, length: string) => 
      `Act as ${context || "an expert assistant"}. ${input}. Provide a ${length} response that is clear, well-structured, and actionable. Include specific examples where relevant.`
  },
  creative: {
    role: "a professional creative writer",
    structure: (input: string, context: string, length: string) =>
      `Act as a professional creative writer with expertise in ${context || "storytelling"}. ${input}. Create a ${length} piece that is engaging, original, and emotionally resonant. Avoid clichés and ensure vivid descriptions.`
  },
  technical: {
    role: "a senior software engineer",
    structure: (input: string, context: string, length: string) =>
      `Act as a senior software engineer with expertise in ${context || "full-stack development"}. ${input}. Provide ${length} technical guidance including best practices, potential pitfalls, and code examples where appropriate.`
  },
  business: {
    role: "a business strategy consultant",
    structure: (input: string, context: string, length: string) =>
      `Act as a business strategy consultant with experience in ${context || "startup growth"}. ${input}. Deliver a ${length} analysis with actionable recommendations, market considerations, and measurable outcomes.`
  },
  academic: {
    role: "a research professor",
    structure: (input: string, context: string, length: string) =>
      `Act as a research professor specializing in ${context || "the relevant field"}. ${input}. Provide a ${length} scholarly response with proper citations, balanced perspectives, and rigorous methodology.`
  },
  marketing: {
    role: "a senior marketing strategist",
    structure: (input: string, context: string, length: string) =>
      `Act as a senior marketing strategist with expertise in ${context || "digital marketing"}. ${input}. Create a ${length} strategy including target audience insights, messaging frameworks, and KPI recommendations.`
  }
};

const lengthOptions = {
  brief: "brief and concise",
  moderate: "moderately detailed",
  comprehensive: "comprehensive and thorough",
  extensive: "extensive and in-depth"
};

export default function PromptOptimizer() {
  const tool = getToolById("prompt-optimizer")!;
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<keyof typeof promptTemplates>("general");
  const [context, setContext] = useState("");
  const [length, setLength] = useState<keyof typeof lengthOptions>("moderate");
  const [creativity, setCreativity] = useState([50]);
  const [output, setOutput] = useState("");

  const generatePrompt = () => {
    if (!input.trim()) {
      toast.error("Please enter your basic prompt idea");
      return;
    }

    const selectedTemplate = promptTemplates[template];
    let optimized = selectedTemplate.structure(input.trim(), context, lengthOptions[length]);

    // Add creativity modifiers
    if (creativity[0] > 70) {
      optimized += " Be creative and think outside the box. Surprise me with unexpected angles.";
    } else if (creativity[0] < 30) {
      optimized += " Stay factual and conservative. Prioritize accuracy over creativity.";
    }

    // Add output format based on template
    if (template === "technical") {
      optimized += "\n\nFormat the response with clear sections: Overview, Implementation Details, Code Examples, and Best Practices.";
    } else if (template === "business") {
      optimized += "\n\nStructure the response with: Executive Summary, Analysis, Recommendations, and Next Steps.";
    } else if (template === "academic") {
      optimized += "\n\nOrganize with: Introduction, Literature Context, Main Arguments, and Conclusion.";
    }

    setOutput(optimized);
    toast.success("Prompt optimized!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const seoContent = {
    description: "Transform simple prompts into powerful, structured AI prompts using our template-based optimizer.",
    content: `<p>The AI Prompt Optimizer helps you craft better prompts for AI systems like ChatGPT, Claude, and Gemini. Our template-based engine automatically enhances your basic ideas into well-structured prompts.</p>
    <h3>How It Works</h3>
    <ol>
      <li>Enter your basic prompt idea</li>
      <li>Select a template (creative, technical, business, etc.)</li>
      <li>Customize context and response length</li>
      <li>Generate your optimized prompt</li>
    </ol>
    <h3>Prompt Engineering Best Practices</h3>
    <p>Our optimizer automatically applies key prompt engineering principles: role assignment, specific task definition, constraints, and output format specifications.</p>`,
    aboutTool: "The AI Prompt Optimizer transforms simple user input into high-quality engineering prompts. It automatically wraps your input into a structured format containing role assignment, specific task, constraints, and desired output format for better AI responses.",
    faqs: [
      { question: "What AI systems work with these prompts?", answer: "Our optimized prompts work with any AI system including ChatGPT, Claude, Gemini, and other LLMs." },
      { question: "How does the creativity slider work?", answer: "Higher creativity encourages the AI to think outside the box, while lower values prioritize accuracy and conservative responses." },
      { question: "Can I use custom contexts?", answer: "Yes! Add specific context like industry, topic, or expertise area to make prompts more targeted." },
      { question: "Is my data stored anywhere?", answer: "No, all processing happens in your browser. Nothing is stored or sent to any server." }
    ],
    keywords: ["prompt optimizer", "ai prompt", "prompt engineering", "chatgpt prompts", "llm prompts", "prompt generator"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Your Basic Prompt Idea</Label>
              <Textarea
                placeholder="e.g., Write a story about a robot"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            <div>
              <Label>Template</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v as keyof typeof promptTemplates)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Purpose</SelectItem>
                  <SelectItem value="creative">Creative Writing</SelectItem>
                  <SelectItem value="technical">Technical/Coding</SelectItem>
                  <SelectItem value="business">Business Strategy</SelectItem>
                  <SelectItem value="academic">Academic/Research</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Context (Optional)</Label>
              <Input
                placeholder="e.g., science fiction, React development, e-commerce"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Response Length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as keyof typeof lengthOptions)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="extensive">Extensive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Creativity Level: {creativity[0]}%</Label>
              <Slider
                value={creativity}
                onValueChange={setCreativity}
                max={100}
                step={10}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            <Button onClick={generatePrompt} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Optimize Prompt
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Optimized Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg min-h-[300px] whitespace-pre-wrap text-sm">
                  {output}
                </div>
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                Enter your prompt and click "Optimize" to generate
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
