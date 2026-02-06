import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Binary, Copy, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("base-converter")!;

export default function BaseConverter() {
  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hex, setHex] = useState("");
  const [lastEdited, setLastEdited] = useState<"decimal" | "binary" | "octal" | "hex">("decimal");

  const updateAllFromDecimal = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setDecimal(value);
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } else if (value === "") {
      setDecimal("");
      setBinary("");
      setOctal("");
      setHex("");
    }
  };

  const updateAllFromBinary = (value: string) => {
    if (/^[01]*$/.test(value)) {
      setBinary(value);
      if (value) {
        const num = parseInt(value, 2);
        setDecimal(num.toString());
        setOctal(num.toString(8));
        setHex(num.toString(16).toUpperCase());
      } else {
        setDecimal("");
        setOctal("");
        setHex("");
      }
    }
  };

  const updateAllFromOctal = (value: string) => {
    if (/^[0-7]*$/.test(value)) {
      setOctal(value);
      if (value) {
        const num = parseInt(value, 8);
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setHex(num.toString(16).toUpperCase());
      } else {
        setDecimal("");
        setBinary("");
        setHex("");
      }
    }
  };

  const updateAllFromHex = (value: string) => {
    if (/^[0-9A-Fa-f]*$/.test(value)) {
      setHex(value.toUpperCase());
      if (value) {
        const num = parseInt(value, 16);
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setOctal(num.toString(8));
      } else {
        setDecimal("");
        setBinary("");
        setOctal("");
      }
    }
  };

  const copyValue = async (value: string, base: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${base} value copied!`);
  };

  const seoContent = {
    description: "Convert between binary, octal, decimal, and hexadecimal number systems.",
    content: `<h3>Number Base Conversion</h3><p>Real-time conversion between different number bases.</p>`,
    keywords: ["binary converter", "hex converter", "octal", "decimal", "number systems"],
    faqs: [
      { question: "What is a number base?", answer: "The number of unique digits used to represent numbers (e.g., binary uses 2, decimal uses 10)." },
      { question: "Why is hex used in programming?", answer: "It's compact - 4 binary digits equal 1 hex digit, making it easier to read." },
    ],
    aboutTool: "Convert numbers between binary, octal, decimal, and hexadecimal systems instantly.",
  };

  const bases = [
    { name: "Decimal", base: 10, value: decimal, onChange: updateAllFromDecimal, prefix: "" },
    { name: "Binary", base: 2, value: binary, onChange: updateAllFromBinary, prefix: "0b" },
    { name: "Octal", base: 8, value: octal, onChange: updateAllFromOctal, prefix: "0o" },
    { name: "Hexadecimal", base: 16, value: hex, onChange: updateAllFromHex, prefix: "0x" },
  ];

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="w-5 h-5" />
            Number Base Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center">
            Enter a number in any field and all others will update automatically
          </p>

          <div className="space-y-4">
            {bases.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {item.name}
                    <span className="text-xs text-muted-foreground">(Base {item.base})</span>
                  </Label>
                  <div className="flex gap-2">
                    {item.prefix && (
                      <span className="flex items-center px-3 bg-muted rounded-md text-muted-foreground font-mono">
                        {item.prefix}
                      </span>
                    )}
                    <Input
                      type="text"
                      value={item.value}
                      onChange={(e) => item.onChange(e.target.value)}
                      placeholder={`Enter ${item.name.toLowerCase()} number`}
                      className="flex-1 font-mono text-lg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyValue(item.value, item.name)}
                      disabled={!item.value}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < bases.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick Reference */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Quick Reference</h3>
            <div className="grid grid-cols-4 gap-2 text-sm font-mono">
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Dec</p>
                <p>15</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Bin</p>
                <p>1111</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Oct</p>
                <p>17</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-xs mb-1">Hex</p>
                <p>F</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
