import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, CheckCircle, XCircle, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";

interface ValidationResult {
  phone: string;
  isValid: boolean;
  formatted: string;
  reason: string;
  countryCode?: string;
}

const countryPatterns = [
  { code: "+1", name: "US/Canada", pattern: /^\+1[2-9]\d{2}[2-9]\d{6}$/, format: (n: string) => `+1 (${n.slice(2, 5)}) ${n.slice(5, 8)}-${n.slice(8)}` },
  { code: "+44", name: "UK", pattern: /^\+44[1-9]\d{9,10}$/, format: (n: string) => `+44 ${n.slice(3, 7)} ${n.slice(7)}` },
  { code: "+91", name: "India", pattern: /^\+91[6-9]\d{9}$/, format: (n: string) => `+91 ${n.slice(3, 8)} ${n.slice(8)}` },
  { code: "+86", name: "China", pattern: /^\+86[1][3-9]\d{9}$/, format: (n: string) => `+86 ${n.slice(3, 6)} ${n.slice(6, 10)} ${n.slice(10)}` },
  { code: "+49", name: "Germany", pattern: /^\+49[1-9]\d{7,14}$/, format: (n: string) => `+49 ${n.slice(3)}` },
  { code: "+33", name: "France", pattern: /^\+33[1-9]\d{8}$/, format: (n: string) => `+33 ${n.slice(3, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)} ${n.slice(8, 10)} ${n.slice(10)}` },
  { code: "+81", name: "Japan", pattern: /^\+81[1-9]\d{8,9}$/, format: (n: string) => `+81 ${n.slice(3)}` },
  { code: "+61", name: "Australia", pattern: /^\+61[4]\d{8}$/, format: (n: string) => `+61 ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}` },
];

const tool = getToolById("phone-validator")!;

export default function PhoneValidator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ValidationResult[]>([]);

  const validatePhone = (phone: string): ValidationResult => {
    // Clean the number - remove spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, "").trim();
    
    if (!cleaned) {
      return { phone, isValid: false, formatted: "", reason: "Empty number" };
    }

    // Add + if missing and starts with a digit
    const normalized = cleaned.startsWith("+") ? cleaned : (cleaned.startsWith("00") ? "+" + cleaned.slice(2) : cleaned);

    // Basic length check
    if (normalized.length < 8 || normalized.length > 16) {
      return { phone, isValid: false, formatted: normalized, reason: "Invalid length (8-16 digits expected)" };
    }

    // Check against country patterns
    for (const country of countryPatterns) {
      if (normalized.startsWith(country.code)) {
        if (country.pattern.test(normalized)) {
          return {
            phone,
            isValid: true,
            formatted: country.format(normalized),
            reason: `Valid ${country.name} number`,
            countryCode: country.code,
          };
        } else {
          return {
            phone,
            isValid: false,
            formatted: normalized,
            reason: `Invalid ${country.name} number format`,
            countryCode: country.code,
          };
        }
      }
    }

    // Generic international format check
    if (/^\+[1-9]\d{7,14}$/.test(normalized)) {
      return {
        phone,
        isValid: true,
        formatted: normalized,
        reason: "Valid international format",
      };
    }

    // Check for US number without country code
    if (/^[2-9]\d{2}[2-9]\d{6}$/.test(normalized)) {
      const withCode = "+1" + normalized;
      return {
        phone,
        isValid: true,
        formatted: `+1 (${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`,
        reason: "Valid US number (country code added)",
        countryCode: "+1",
      };
    }

    return { phone, isValid: false, formatted: normalized, reason: "Invalid phone number format" };
  };

  const handleValidate = () => {
    const phones = input.split(/[\n,;]+/).filter(Boolean);
    const validationResults = phones.map(validatePhone);
    setResults(validationResults);
    
    const validCount = validationResults.filter(r => r.isValid).length;
    toast.success(`Validated ${phones.length} numbers: ${validCount} valid`);
  };

  const copyValidPhones = () => {
    const validPhones = results.filter(r => r.isValid).map(r => r.formatted).join("\n");
    navigator.clipboard.writeText(validPhones);
    toast.success("Valid phone numbers copied!");
  };

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

  const seoContent = {
    description: "Validate phone numbers with automatic country code detection and international formatting. Supports bulk validation for US, UK, India, and more.",
    content: `<h3>Introduction</h3><p>Validate and format phone numbers from around the world.</p><h3>Key Benefits</h3><ul><li>Country code detection</li><li>Automatic formatting</li><li>Bulk validation</li><li>International support</li></ul>`,
    keywords: ["phone validator", "phone number checker", "validate phone", "international phone format"],
    faqs: [
      { question: "Which countries are supported?", answer: "US, UK, India, China, Germany, France, Japan, Australia, and general international formats." },
      { question: "Does this verify if numbers are active?", answer: "No, this validates format only. Carrier verification requires external services." },
    ],
    aboutTool: "Our Phone Validator checks number formats and auto-detects country codes.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone Validator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Enter Phone Numbers (one per line)</Label>
              <Textarea
                className="mt-2 min-h-[200px] font-mono"
                placeholder="+1 234 567 8901&#10;+44 7911 123456&#10;(555) 123-4567&#10;+91 98765 43210"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleValidate}>
              Validate Phone Numbers
            </Button>

            {results.length > 0 && (
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  {validCount} valid
                </div>
                <div className="flex items-center gap-2 text-red-500">
                  <XCircle className="w-4 h-4" />
                  {invalidCount} invalid
                </div>
                {validCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={copyValidPhones}>
                    <Copy className="w-4 h-4 mr-1" /> Copy Valid
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter phone numbers and click Validate</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${result.isValid ? "bg-green-500/10" : "bg-red-500/10"}`}
                  >
                    <div className="flex items-center gap-3">
                      {result.isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm">{result.formatted || result.phone}</p>
                        <p className={`text-xs ${result.isValid ? "text-green-500" : "text-red-500"}`}>
                          {result.reason}
                        </p>
                      </div>
                      {result.countryCode && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">{result.countryCode}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
