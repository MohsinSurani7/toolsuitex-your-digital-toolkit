import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, XCircle, AlertCircle, Copy } from "lucide-react";
import { toast } from "sonner";

interface ValidationResult {
  email: string;
  isValid: boolean;
  reason: string;
}

const tool = getToolById("email-validator")!;

export default function EmailValidator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ValidationResult[]>([]);

  const validateEmail = (email: string): ValidationResult => {
    const trimmed = email.trim().toLowerCase();
    
    // Empty check
    if (!trimmed) {
      return { email: trimmed, isValid: false, reason: "Empty email" };
    }

    // Basic format check
    const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicRegex.test(trimmed)) {
      return { email: trimmed, isValid: false, reason: "Invalid format" };
    }

    // More strict validation
    const strictRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!strictRegex.test(trimmed)) {
      return { email: trimmed, isValid: false, reason: "Contains invalid characters" };
    }

    // Check for common typos
    const domain = trimmed.split("@")[1];
    const commonDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"];
    const typoPatterns = [
      { pattern: /gmai\.com$/, suggestion: "gmail.com" },
      { pattern: /gmial\.com$/, suggestion: "gmail.com" },
      { pattern: /gamil\.com$/, suggestion: "gmail.com" },
      { pattern: /yaho\.com$/, suggestion: "yahoo.com" },
      { pattern: /yahooo\.com$/, suggestion: "yahoo.com" },
      { pattern: /hotmal\.com$/, suggestion: "hotmail.com" },
      { pattern: /outlok\.com$/, suggestion: "outlook.com" },
    ];

    for (const { pattern, suggestion } of typoPatterns) {
      if (pattern.test(domain)) {
        return { email: trimmed, isValid: false, reason: `Possible typo - did you mean ${suggestion}?` };
      }
    }

    // Check TLD
    const tld = domain.split(".").pop();
    if (tld && tld.length < 2) {
      return { email: trimmed, isValid: false, reason: "Invalid TLD" };
    }

    // Length checks
    if (trimmed.length > 254) {
      return { email: trimmed, isValid: false, reason: "Email too long (max 254 chars)" };
    }

    const localPart = trimmed.split("@")[0];
    if (localPart.length > 64) {
      return { email: trimmed, isValid: false, reason: "Local part too long (max 64 chars)" };
    }

    return { email: trimmed, isValid: true, reason: "Valid email format" };
  };

  const handleValidate = () => {
    const emails = input.split(/[\n,;]+/).filter(Boolean);
    const validationResults = emails.map(validateEmail);
    setResults(validationResults);
    
    const validCount = validationResults.filter(r => r.isValid).length;
    toast.success(`Validated ${emails.length} emails: ${validCount} valid, ${emails.length - validCount} invalid`);
  };

  const copyValidEmails = () => {
    const validEmails = results.filter(r => r.isValid).map(r => r.email).join("\n");
    navigator.clipboard.writeText(validEmails);
    toast.success("Valid emails copied to clipboard!");
  };

  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

  const seoContent = {
    description: "Validate email addresses instantly with format checking, typo detection, and structure verification. Supports bulk validation. Free online tool.",
    content: `<h3>Introduction</h3><p>Quickly validate single or bulk email addresses for proper formatting.</p><h3>Key Benefits</h3><ul><li>Bulk validation support</li><li>Typo detection</li><li>Detailed error messages</li><li>Copy valid emails</li></ul>`,
    keywords: ["email validator", "email checker", "validate email", "email verification"],
    faqs: [
      { question: "Does this check if emails exist?", answer: "No, this validates format only. Actual delivery verification requires server checks." },
      { question: "How many emails can I validate?", answer: "No limit - validate as many as you need." },
    ],
    aboutTool: "Our Email Validator checks email format and detects common typos instantly.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Validator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Enter Emails (one per line, or comma/semicolon separated)</Label>
              <Textarea
                className="mt-2 min-h-[200px] font-mono"
                placeholder="john@example.com&#10;jane@gmail.com&#10;invalid-email&#10;test@test"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleValidate}>
              Validate Emails
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
                  <Button variant="ghost" size="sm" onClick={copyValidEmails}>
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
                <p>Enter emails and click Validate to see results</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${result.isValid ? "bg-green-500/10" : "bg-red-500/10"}`}
                  >
                    {result.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm truncate">{result.email}</p>
                      <p className={`text-xs ${result.isValid ? "text-green-500" : "text-red-500"}`}>
                        {result.reason}
                      </p>
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
