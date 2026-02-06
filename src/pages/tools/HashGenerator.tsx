import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Copy, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("hash-generator")!;

async function generateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function generateFileHash(file: File, algorithm: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const algorithms = [
    { name: "SHA-256", id: "SHA-256" },
    { name: "SHA-384", id: "SHA-384" },
    { name: "SHA-512", id: "SHA-512" },
    { name: "SHA-1", id: "SHA-1" },
  ];

  const handleGenerateTextHash = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }
    
    setIsGenerating(true);
    const newHashes: Record<string, string> = {};
    
    for (const algo of algorithms) {
      newHashes[algo.id] = await generateHash(text, algo.id);
    }
    
    setHashes(newHashes);
    setIsGenerating(false);
    toast.success("Hashes generated!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsGenerating(true);
    const newHashes: Record<string, string> = {};

    for (const algo of algorithms) {
      newHashes[algo.id] = await generateFileHash(file, algo.id);
    }

    setFileHashes(newHashes);
    setIsGenerating(false);
    toast.success("File hashes generated!");
  };

  const copyHash = async (hash: string, name: string) => {
    await navigator.clipboard.writeText(hash);
    toast.success(`${name} hash copied!`);
  };

  const seoContent = {
    description: "Generate SHA-256, SHA-384, SHA-512, and SHA-1 hashes for text and files.",
    content: `<h3>Cryptographic Hash Generator</h3><p>Create secure hashes for text and files with multiple algorithms.</p>`,
    keywords: ["hash generator", "SHA-256", "SHA-512", "MD5", "cryptography", "checksum"],
    faqs: [
      { question: "What is a cryptographic hash?", answer: "A fixed-size string generated from input data - like a digital fingerprint." },
      { question: "Which algorithm should I use?", answer: "SHA-256 is recommended for most purposes." },
    ],
    aboutTool: "Generate cryptographic hashes using SHA-256, SHA-384, SHA-512, and SHA-1. All processing happens in your browser.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Secure Hash Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text">
                  <FileText className="w-4 h-4 mr-2" />
                  Text Hash
                </TabsTrigger>
                <TabsTrigger value="file">
                  <Upload className="w-4 h-4 mr-2" />
                  File Hash
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to hash..."
                  rows={6}
                  className="font-mono"
                />
                <Button
                  onClick={handleGenerateTextHash}
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Hashes"}
                </Button>

                {Object.keys(hashes).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {algorithms.map((algo) => (
                      <div key={algo.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-primary">{algo.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHash(hashes[algo.id], algo.name)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <code className="text-xs break-all text-muted-foreground">
                          {hashes[algo.id]}
                        </code>
                      </div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">
                      {fileName || "Click to upload a file"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Any file type supported
                    </p>
                  </label>
                </div>

                {Object.keys(fileHashes).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground">
                      Hashes for: <strong>{fileName}</strong>
                    </p>
                    {algorithms.map((algo) => (
                      <div key={algo.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-primary">{algo.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyHash(fileHashes[algo.id], algo.name)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <code className="text-xs break-all text-muted-foreground">
                          {fileHashes[algo.id]}
                        </code>
                      </div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
