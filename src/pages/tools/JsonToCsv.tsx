import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

const JsonToCsv = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const flattenObject = (obj: any, prefix = ""): Record<string, any> => {
    const result: Record<string, any> = {};
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], fullKey));
      } else if (Array.isArray(obj[key])) {
        result[fullKey] = JSON.stringify(obj[key]);
      } else {
        result[fullKey] = obj[key];
      }
    }
    
    return result;
  };

  const convertToCSV = () => {
    setError("");
    
    try {
      let data = JSON.parse(jsonInput);
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      if (data.length === 0) {
        throw new Error("Empty array");
      }
      
      // Flatten objects
      const flatData = data.map((item: any) => flattenObject(item));
      
      // Get all unique headers
      const headers = [...new Set(flatData.flatMap((item: any) => Object.keys(item)))];
      
      // Build CSV
      const rows: string[] = [];
      
      if (includeHeaders) {
        rows.push(headers.map(h => `"${h}"`).join(delimiter));
      }
      
      for (const item of flatData) {
        const row = headers.map((header: string) => {
          const value = item[header as keyof typeof item];
          if (value === null || value === undefined) return "";
          if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`;
          return String(value);
        });
        rows.push(row.join(delimiter));
      }
      
      setCsvOutput(rows.join("\n"));
      toast({ title: "Converted!", description: `${flatData.length} rows generated` });
    } catch (e) {
      setError((e as Error).message);
      setCsvOutput("");
    }
  };

  const convertToJSON = () => {
    setError("");
    
    try {
      const lines = csvOutput.trim().split("\n");
      if (lines.length === 0) throw new Error("Empty CSV");
      
      const headers = parseCSVLine(lines[0], delimiter);
      const result: Record<string, string>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i], delimiter);
        const obj: Record<string, string> = {};
        
        headers.forEach((header, idx) => {
          obj[header] = values[idx] || "";
        });
        
        result.push(obj);
      }
      
      setJsonInput(JSON.stringify(result, null, 2));
      toast({ title: "Converted!", description: `${result.length} objects parsed` });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const parseCSVLine = (line: string, delim: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delim && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(csvOutput);
    toast({ title: "Copied!", description: "CSV copied to clipboard" });
  };

  const downloadCSV = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setJsonInput("");
    setCsvOutput("");
    setError("");
  };

  const tool = getToolById("json-to-csv")!;

  const seoContent = {
    description: "Convert JSON to CSV and vice versa. Handles nested objects, arrays, and custom delimiters.",
    content: `<h3>Introduction to JSON/CSV Conversion</h3><p>Convert between JSON and CSV formats with ease. Our converter handles nested objects, arrays, and supports custom delimiters for maximum flexibility in data transformation.</p><h3>How to Use</h3><p>Paste JSON data in the left panel or CSV in the right panel. Choose whether to include headers and set your delimiter. Click the appropriate conversion button and copy or download the converted output.</p><h3>Key Features</h3><ul><li>Bidirectional conversion</li><li>Nested object support</li><li>Custom delimiters</li><li>Download as file</li></ul>`,
    keywords: ["json to csv", "csv to json", "json converter", "csv converter", "data conversion"],
    faqs: [
      { question: "How are nested objects handled?", answer: "Nested objects are flattened using dot notation (e.g., user.name). Arrays are JSON-stringified." },
      { question: "What delimiter options are available?", answer: "You can use any single character as a delimiter, including comma, semicolon, tab, or pipe." }
    ],
    aboutTool: "Our JSON to CSV Converter transforms data between formats instantly. Perfect for data analysis, import/export tasks, and API integrations."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id="headers"
              checked={includeHeaders}
              onCheckedChange={(checked) => setIncludeHeaders(!!checked)}
            />
            <Label htmlFor="headers">Include Headers</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Label>Delimiter:</Label>
            <Input
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value || ",")}
              className="w-16 text-center"
              maxLength={1}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">JSON</label>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">CSV</label>
            <Textarea
              value={csvOutput}
              onChange={(e) => setCsvOutput(e.target.value)}
              placeholder='"name","age"&#10;"John",30&#10;"Jane",25'
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-3 text-destructive text-sm">
              Error: {error}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={convertToCSV} disabled={!jsonInput}>
            JSON → CSV
          </Button>
          <Button onClick={convertToJSON} disabled={!csvOutput}>
            CSV → JSON
          </Button>
          <Button variant="outline" onClick={copyOutput} disabled={!csvOutput}>
            <Copy className="w-4 h-4 mr-2" />
            Copy CSV
          </Button>
          <Button variant="outline" onClick={downloadCSV} disabled={!csvOutput}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default JsonToCsv;
