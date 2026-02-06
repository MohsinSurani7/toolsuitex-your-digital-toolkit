import { useState } from "react";
import { Wand2, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("lorem-generator")!;

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
];

function generateWord(): string {
  return loremWords[Math.floor(Math.random() * loremWords.length)];
}

function generateSentence(minWords: number = 5, maxWords: number = 15): string {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = Array.from({ length: wordCount }, generateWord);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentences: number = 5): string {
  return Array.from({ length: sentences }, () => generateSentence()).join(" ");
}

export default function LoremGenerator() {
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [count, setCount] = useState("3");
  const [output, setOutput] = useState("");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const handleGenerate = () => {
    const num = parseInt(count) || 1;
    let result = "";

    switch (type) {
      case "words":
        const words = Array.from({ length: num }, generateWord);
        if (startWithLorem && words.length > 0) {
          words[0] = "Lorem";
          if (words.length > 1) words[1] = "ipsum";
        }
        result = words.join(" ");
        break;
      case "sentences":
        const sentences = Array.from({ length: num }, () => generateSentence());
        if (startWithLorem && sentences.length > 0) {
          sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        }
        result = sentences.join(" ");
        break;
      case "paragraphs":
        const paragraphs = Array.from({ length: num }, () => generateParagraph());
        if (startWithLorem && paragraphs.length > 0) {
          paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0];
        }
        result = paragraphs.join("\n\n");
        break;
    }

    setOutput(result);
    toast.success("Lorem ipsum generated!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const seoContent = {
    description: "Generate placeholder text for your designs, mockups, and prototypes with our free Lorem Ipsum Generator.",
    content: `
      <h3>What is Lorem Ipsum?</h3>
      <p>Lorem Ipsum is dummy text used in the printing and typesetting industry. It has been the industry's standard placeholder text since the 1500s, when an unknown printer scrambled a galley of type to make a specimen book.</p>
      
      <h3>Why Use Lorem Ipsum?</h3>
      <p>Designers and developers use Lorem Ipsum because it allows them to focus on the visual aspects of a layout without being distracted by readable content. The text has a more-or-less normal distribution of letters, making it look like readable English.</p>
      
      <h3>Features of Our Generator</h3>
      <p>Our Lorem Ipsum Generator offers flexible options to suit your needs. Generate specific numbers of words, sentences, or paragraphs. Choose whether to start with the classic "Lorem ipsum" opening or use randomized text throughout.</p>
      
      <h3>Perfect for Designers and Developers</h3>
      <p>Whether you're designing a website mockup, creating a presentation, or building a prototype, placeholder text helps visualize how the final content will look. Our tool makes it easy to generate exactly the amount of text you need.</p>
    `,
    keywords: ["lorem ipsum", "placeholder text", "dummy text", "filler text", "design mockup", "prototype", "typography"],
    faqs: [
      {
        question: "What does Lorem Ipsum mean?",
        answer: "Lorem Ipsum comes from a Latin text by Cicero from 45 BC. The phrase 'Lorem ipsum dolor sit amet' doesn't have a direct translation - it's actually scrambled Latin that has been used as placeholder text for centuries.",
      },
      {
        question: "Why not just use random text?",
        answer: "Lorem Ipsum has a natural-looking letter distribution similar to English, making layouts appear more realistic. Random characters or repeated words would be distracting and not representative of actual content.",
      },
      {
        question: "How much Lorem Ipsum do I need?",
        answer: "It depends on your design. For body text, try to match the expected word count. For titles and headers, just a few words usually suffice. Our generator lets you specify exactly how much you need.",
      },
    ],
    aboutTool: "The Lorem Ipsum Generator creates placeholder text for designers and developers. Generate words, sentences, or paragraphs of classic Lorem Ipsum text for your mockups, wireframes, and prototypes. Works entirely in your browser with instant results.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Lorem Ipsum Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Count</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                max="100"
                className="w-24"
              />
            </div>
            <Button onClick={handleGenerate}>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>

          {output && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Generated Text</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setOutput("")}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
              <Textarea
                value={output}
                readOnly
                rows={10}
                className="font-serif"
              />
              <p className="text-sm text-muted-foreground">
                {output.split(/\s+/).filter(Boolean).length} words • {output.length} characters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
