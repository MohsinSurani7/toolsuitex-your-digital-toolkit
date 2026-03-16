import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Check, X, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("password-strength")!;

interface PasswordAnalysis {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    noCommon: boolean;
  };
  crackTime: string;
}

const commonPasswords = [
  "password", "123456", "qwerty", "admin", "letmein", "welcome", 
  "monkey", "dragon", "master", "password1", "123456789", "12345678"
];

function analyzePassword(password: string): PasswordAnalysis {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommon: !commonPasswords.some(p => password.toLowerCase().includes(p)),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  let score = (passedChecks / 6) * 100;
  
  // Bonus for extra length
  if (password.length >= 16) score = Math.min(100, score + 10);
  if (password.length >= 20) score = Math.min(100, score + 10);
  
  // Penalty for short passwords
  if (password.length < 8) score = Math.min(30, score);

  let label: string;
  let color: string;
  if (score >= 90) { label = "Excellent"; color = "text-green-500"; }
  else if (score >= 70) { label = "Strong"; color = "text-emerald-500"; }
  else if (score >= 50) { label = "Moderate"; color = "text-yellow-500"; }
  else if (score >= 30) { label = "Weak"; color = "text-orange-500"; }
  else { label = "Very Weak"; color = "text-red-500"; }

  const suggestions: string[] = [];
  if (!checks.length) suggestions.push("Use at least 12 characters");
  if (!checks.uppercase) suggestions.push("Add uppercase letters (A-Z)");
  if (!checks.lowercase) suggestions.push("Add lowercase letters (a-z)");
  if (!checks.numbers) suggestions.push("Include numbers (0-9)");
  if (!checks.symbols) suggestions.push("Add special characters (!@#$%^&*)");
  if (!checks.noCommon) suggestions.push("Avoid common words and patterns");

  // Estimate crack time (simplified calculation)
  const charset = 
    (checks.lowercase ? 26 : 0) +
    (checks.uppercase ? 26 : 0) +
    (checks.numbers ? 10 : 0) +
    (checks.symbols ? 32 : 0);
  
  const combinations = Math.pow(charset || 1, password.length);
  const guessesPerSecond = 1e10; // 10 billion guesses/sec
  const seconds = combinations / guessesPerSecond;
  
  let crackTime: string;
  if (seconds < 1) crackTime = "Instantly";
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 3153600000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = "Centuries+";

  return { score, label, color, suggestions, checks, crackTime };
}

function generateStrongPassword(length: number = 16): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = uppercase + lowercase + numbers + symbols;
  
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split("").sort(() => Math.random() - 0.5).join("");
}

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const analysis = useMemo(() => analyzePassword(password), [password]);

  const handleGenerate = () => {
    const newPassword = generateStrongPassword(16);
    setPassword(newPassword);
    setShowPassword(true);
    toast.success("Strong password generated!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const seoContent = {
    description: "Check password strength with detailed security analysis, crack time estimates, and improvement tips. Generate strong passwords instantly.",
    content: `<h3>Password Security</h3><p>Analyze password strength with real-time metrics and recommendations.</p>`,
    keywords: ["password strength", "password checker", "security", "password generator"],
    faqs: [
      { question: "Is it safe to check my password here?", answer: "Yes! Your password is analyzed in your browser and never sent to any server." },
      { question: "What makes a password strong?", answer: "At least 12 characters with uppercase, lowercase, numbers, and special characters." },
    ],
    aboutTool: "Check password strength with detailed analysis and generate strong passwords. 100% client-side processing.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password Strength Checker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to analyze..."
                className="pr-24 text-lg h-14"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!password}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Strength Meter */}
            {password && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-lg ${analysis.color}`}>
                      {analysis.label}
                    </span>
                    <span className="text-muted-foreground">
                      Score: {Math.round(analysis.score)}%
                    </span>
                  </div>
                  <Progress value={analysis.score} className="h-3" />
                </div>

                {/* Crack Time */}
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Estimated time to crack:</p>
                  <p className={`text-2xl font-bold ${analysis.color}`}>{analysis.crackTime}</p>
                </div>

                {/* Security Checks */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "length", label: "12+ characters" },
                    { key: "uppercase", label: "Uppercase letters" },
                    { key: "lowercase", label: "Lowercase letters" },
                    { key: "numbers", label: "Numbers" },
                    { key: "symbols", label: "Special characters" },
                    { key: "noCommon", label: "No common patterns" },
                  ].map((check) => (
                    <div
                      key={check.key}
                      className={`flex items-center gap-2 p-2 rounded ${
                        analysis.checks[check.key as keyof typeof analysis.checks]
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {analysis.checks[check.key as keyof typeof analysis.checks] ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="text-sm">{check.label}</span>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="font-medium text-yellow-500 mb-2">Suggestions:</p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Generate Button */}
            <Button onClick={handleGenerate} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Strong Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
