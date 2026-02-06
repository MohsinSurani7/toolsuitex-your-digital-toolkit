import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Copy, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("sql-formatter")!;

const keywords = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "ADD",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY",
  "ORDER", "ASC", "DESC", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL",
  "DISTINCT", "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN",
  "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "COUNT", "SUM",
  "AVG", "MIN", "MAX", "PRIMARY", "KEY", "FOREIGN", "REFERENCES",
  "INDEX", "UNIQUE", "CONSTRAINT", "DEFAULT", "CHECK", "CASCADE"
];

function formatSQL(sql: string, indent: number = 2): string {
  const indentStr = " ".repeat(indent);
  let formatted = sql.trim();
  
  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, " ");
  
  // Uppercase keywords
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(regex, keyword);
  });
  
  // Add newlines after major clauses
  formatted = formatted
    .replace(/\bSELECT\b/gi, "\nSELECT")
    .replace(/\bFROM\b/gi, "\nFROM")
    .replace(/\bWHERE\b/gi, "\nWHERE")
    .replace(/\bAND\b/gi, "\n" + indentStr + "AND")
    .replace(/\bOR\b/gi, "\n" + indentStr + "OR")
    .replace(/\bJOIN\b/gi, "\nJOIN")
    .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN")
    .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN")
    .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN")
    .replace(/\bOUTER JOIN\b/gi, "\nOUTER JOIN")
    .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
    .replace(/\bORDER BY\b/gi, "\nORDER BY")
    .replace(/\bHAVING\b/gi, "\nHAVING")
    .replace(/\bLIMIT\b/gi, "\nLIMIT")
    .replace(/\bUNION\b/gi, "\n\nUNION")
    .replace(/\bINSERT INTO\b/gi, "\nINSERT INTO")
    .replace(/\bVALUES\b/gi, "\nVALUES")
    .replace(/\bUPDATE\b/gi, "\nUPDATE")
    .replace(/\bSET\b/gi, "\nSET")
    .replace(/\bDELETE\b/gi, "\nDELETE")
    .replace(/\bCREATE TABLE\b/gi, "\nCREATE TABLE")
    .replace(/\bALTER TABLE\b/gi, "\nALTER TABLE");
  
  // Handle commas - add newline after each column in SELECT
  const selectMatch = formatted.match(/SELECT\s+([\s\S]*?)(?=\nFROM)/i);
  if (selectMatch) {
    const columns = selectMatch[1].split(",").map(c => c.trim()).join(",\n" + indentStr);
    formatted = formatted.replace(selectMatch[1], "\n" + indentStr + columns);
  }
  
  return formatted.trim();
}

export default function SQLFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");

  const handleFormat = () => {
    if (!input.trim()) {
      toast.error("Please enter some SQL code");
      return;
    }
    const formatted = formatSQL(input, parseInt(indentSize));
    setOutput(formatted);
    toast.success("SQL formatted successfully!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Formatted SQL copied!");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const seoContent = {
    description: "Format and beautify SQL queries with proper indentation.",
    content: `<h3>SQL Query Formatting</h3><p>Make complex queries readable with automatic formatting.</p>`,
    keywords: ["SQL formatter", "SQL beautifier", "format SQL", "database query"],
    faqs: [
      { question: "Does it support all SQL dialects?", answer: "Handles standard SQL syntax for MySQL, PostgreSQL, SQLite, and SQL Server." },
      { question: "Will formatting change my query?", answer: "No, only whitespace and capitalization change." },
    ],
    aboutTool: "Format SQL queries with proper indentation and keyword highlighting for better readability.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            SQL Formatter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Indent Size:</span>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input SQL</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="SELECT * FROM users WHERE id = 1 AND status = 'active'"
                rows={15}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Format SQL
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Formatted Output</label>
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted SQL will appear here..."
                rows={15}
                className="font-mono text-sm bg-muted"
              />
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!output}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Formatted SQL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
