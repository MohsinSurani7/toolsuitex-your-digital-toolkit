import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, Copy, Shield, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toolSuiteXEncode, toolSuiteXDecode, getCipherInfo, isToolSuiteXEncoded } from "@/lib/cipher";
import { toast } from "sonner";

export default function CustomEncoderPage() {
  const tool = getToolById("custom-encoder")!;
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const cipherInfo = getCipherInfo();

  const handleProcess = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    if (mode === "encode") {
      const encoded = toolSuiteXEncode(inputText);
      setOutputText(encoded);
      toast.success("Text encoded successfully!");
    } else {
      if (!isToolSuiteXEncoded(inputText)) {
        toast.error("Invalid ToolSuiteX encoded string. Must start with 'TX'");
        return;
      }
      const decoded = toolSuiteXDecode(inputText);
      if (decoded === null) {
        toast.error("Failed to decode. The encoded string may be corrupted.");
        return;
      }
      setOutputText(decoded);
      toast.success("Text decoded successfully!");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard!");
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const seoContent = {
    description: "Learn about the ToolSuiteX proprietary encryption system - a multi-layer cipher that goes beyond standard Base64 encoding for enhanced security.",
    content: `
      <h3>Understanding ToolSuiteX Custom Encryption</h3>
      <p>Unlike standard Base64 encoding that can be easily recognized and decoded by AI systems and online tools, the ToolSuiteX encoder uses a proprietary multi-layer cipher system. This makes your encoded content virtually unrecognizable to automated decoding attempts.</p>
      
      <h4>How Our Cipher Works</h4>
      <p>The ToolSuiteX cipher applies five distinct transformation layers to your text: custom symbol substitution, position-based shifting, salt interleaving, segment reversal, and checksum validation. Each layer adds complexity that makes pattern recognition extremely difficult.</p>
      
      <h4>Why Not Just Use Base64?</h4>
      <p>Base64 is widely recognized and can be decoded instantly by any developer or AI assistant. Our custom cipher uses non-standard character mappings and multiple transformation algorithms that create output unrecognizable to standard decoders. The result looks nothing like Base64 or any common encoding scheme.</p>
      
      <h4>Security Applications</h4>
      <p>This encoder is perfect for protecting sensitive configuration values, creating obfuscated identifiers, or adding an extra layer of privacy to data that shouldn't be casually readable. While not a replacement for strong cryptographic encryption, it provides excellent obfuscation.</p>
      
      <h4>Complete Privacy</h4>
      <p>All encoding and decoding happens entirely in your browser. Your text is never sent to any server, ensuring complete privacy and security of your sensitive information.</p>
    `,
    keywords: [
      "Custom Text Encoder",
      "Non-Base64 Encryption",
      "Text Obfuscation Tool",
      "Secure Text Encoding",
      "Multi-Layer Cipher",
      "Browser-Based Encryption",
      "Text Security Tool",
      "Private Encoding",
      "Custom Cipher System",
      "Text Transformation"
    ],
    faqs: [
      {
        question: "How is this different from Base64 encoding?",
        answer: "Base64 uses a standardized algorithm that any tool or AI can decode instantly. Our cipher uses custom character mappings, position-based transformations, and multiple obfuscation layers that create output unrecognizable to standard decoders."
      },
      {
        question: "Is this encryption secure enough for passwords?",
        answer: "This tool is designed for obfuscation, not cryptographic security. For passwords and highly sensitive data, use proper encryption methods like AES. Our encoder is ideal for light obfuscation where you want to prevent casual reading or AI pattern recognition."
      },
      {
        question: "Can AI systems decode ToolSuiteX encrypted text?",
        answer: "The cipher is specifically designed to be unrecognizable to AI systems. Without knowledge of our specific character mapping and transformation algorithms, AI models cannot determine the decoding pattern."
      },
      {
        question: "Why does the encoded text start with 'TX'?",
        answer: "The 'TX' prefix indicates a valid ToolSuiteX encoded string. It's followed by a 4-digit checksum that validates the integrity of the encoded data. This helps identify corrupted or modified encoded strings."
      },
      {
        question: "Will my data be uploaded to any server?",
        answer: "No. All encoding and decoding operations happen entirely in your browser using JavaScript. Your text never leaves your device, ensuring complete privacy."
      },
      {
        question: "Can I decode text encoded on another device?",
        answer: "Yes! As long as the text was encoded using ToolSuiteX, you can decode it on any device using our decoder. The algorithm is consistent across all uses."
      }
    ],
    aboutTool: "The ToolSuiteX Encoder/Decoder is a proprietary text obfuscation system that goes beyond standard encoding methods like Base64. Using a five-layer transformation process including custom symbol substitution, position-based shifting, salt interleaving, segment reversal, and checksum validation, it creates encoded output that is virtually unrecognizable to AI systems and automated decoders. Perfect for protecting sensitive strings, creating obfuscated identifiers, or adding privacy layers to any text content."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cipher Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{cipherInfo.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{cipherInfo.description}</p>
              <div className="flex flex-wrap gap-2">
                {cipherInfo.layers.map((layer, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                    {layer}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mode Selector */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
          <TabsList className="grid grid-cols-2 w-full max-w-xs mx-auto">
            <TabsTrigger value="encode" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Encode
            </TabsTrigger>
            <TabsTrigger value="decode" className="flex items-center gap-2">
              <Unlock className="w-4 h-4" />
              Decode
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Input/Output Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "Plain Text" : "Encoded Text"}
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === "encode" 
                ? "Enter text to encode..." 
                : "Paste encoded text starting with TX..."
              }
              className="h-64 font-mono text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {inputText.length} characters
            </p>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </label>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Result will appear here..."
              className="h-64 font-mono text-sm resize-none bg-muted/50"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {outputText.length} characters
              </p>
              {outputText && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button onClick={handleProcess} size="lg" className="min-w-32">
            {mode === "encode" ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Encode
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Decode
              </>
            )}
          </Button>
          
          {outputText && (
            <Button variant="outline" onClick={handleSwap}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Swap & Switch Mode
            </Button>
          )}
          
          <Button variant="ghost" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Privacy Notice</p>
            <p>All encoding and decoding happens locally in your browser. Your text is never sent to any server or stored anywhere except your current browser session.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
