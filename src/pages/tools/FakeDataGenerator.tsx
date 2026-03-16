import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FakeRecord {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  jobTitle?: string;
  username?: string;
  password?: string;
}

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const companies = ["TechCorp", "DataFlow Inc", "CloudNine", "InnovateLabs", "FutureTech", "DigitalEdge", "SmartSystems", "PrimeCode", "NetWorks", "ByteLogic"];
const jobTitles = ["Software Engineer", "Product Manager", "Designer", "Data Analyst", "Marketing Manager", "Sales Rep", "HR Manager", "DevOps Engineer", "QA Tester", "CEO"];
const streets = ["Main St", "Oak Ave", "Pine Rd", "Maple Dr", "Cedar Ln", "Elm St", "Park Ave", "Lake Blvd", "River Rd", "Hill St"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin"];

const tool = getToolById("fake-data-generator")!;

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function FakeDataGenerator() {
  const [count, setCount] = useState(10);
  const [fields, setFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    address: false,
    company: false,
    jobTitle: false,
    username: false,
    password: false,
  });
  const [data, setData] = useState<FakeRecord[]>([]);

  const generateData = () => {
    const records: FakeRecord[] = [];
    for (let i = 0; i < count; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const record: FakeRecord = { id: i + 1 };
      
      if (fields.firstName) record.firstName = firstName;
      if (fields.lastName) record.lastName = lastName;
      if (fields.email) record.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(1, 99)}@example.com`;
      if (fields.phone) record.phone = `+1 ${randomNumber(200, 999)} ${randomNumber(100, 999)} ${randomNumber(1000, 9999)}`;
      if (fields.address) record.address = `${randomNumber(100, 9999)} ${randomElement(streets)}, ${randomElement(cities)}`;
      if (fields.company) record.company = randomElement(companies);
      if (fields.jobTitle) record.jobTitle = randomElement(jobTitles);
      if (fields.username) record.username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber(1, 999)}`;
      if (fields.password) record.password = Math.random().toString(36).slice(-10);
      
      records.push(record);
    }
    setData(records);
    toast.success(`Generated ${count} fake records!`);
  };

  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success("JSON copied to clipboard!");
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h as keyof FakeRecord] || ""}"`).join(",")),
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fake-data.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const seoContent = {
    description: "Generate realistic fake data for testing and development. Names, emails, addresses, phone numbers, and more. Export as JSON or CSV instantly.",
    content: `<h3>Introduction</h3><p>Create realistic test data instantly for development and testing.</p><h3>Key Benefits</h3><ul><li>Multiple data fields available</li><li>Export as JSON or CSV</li><li>Customizable record count</li><li>Realistic looking data</li></ul>`,
    keywords: ["fake data generator", "test data", "mock data", "dummy data generator"],
    faqs: [
      { question: "Is this data real?", answer: "No, all data is randomly generated and fake." },
      { question: "Can I use this for testing?", answer: "Yes, perfect for development and testing purposes." },
    ],
    aboutTool: "Our Fake Data Generator creates realistic mock data for your testing needs.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Generator Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Number of Records</Label>
              <Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>

            <div>
              <Label className="mb-3 block">Select Fields</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(fields).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => setFields({ ...fields, [key]: checked as boolean })}
                    />
                    <label htmlFor={key} className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={generateData}>
              <RefreshCw className="w-4 h-4 mr-2" /> Generate Data
            </Button>

            <div className="flex gap-2">
              <Button className="flex-1" variant="outline" onClick={copyJSON} disabled={data.length === 0}>
                <Copy className="w-4 h-4 mr-2" /> Copy JSON
              </Button>
              <Button className="flex-1" variant="outline" onClick={downloadCSV} disabled={data.length === 0}>
                <Download className="w-4 h-4 mr-2" /> Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Generated Data ({data.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[500px]">
              <code>{data.length > 0 ? JSON.stringify(data, null, 2) : "Click 'Generate Data' to create fake records"}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
