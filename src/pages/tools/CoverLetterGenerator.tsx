import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Wand2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("cover-letter-generator")!;

const templates = [
  {
    id: "professional",
    name: "Professional",
    template: `Dear {hiringManager},

I am writing to express my strong interest in the {position} position at {company}. With my background in {field} and passion for {industry}, I am confident that I would be a valuable addition to your team.

{body}

I am excited about the opportunity to contribute to {company}'s continued success. I look forward to discussing how my skills and experiences align with your needs.

Thank you for considering my application.

Sincerely,
{name}`,
  },
  {
    id: "creative",
    name: "Creative",
    template: `Hello {hiringManager},

When I discovered the {position} opening at {company}, I knew I had to reach out. As someone who thrives in {field}, I've been following {company}'s innovative work in {industry} with great enthusiasm.

{body}

I'd love the chance to bring my unique perspective and skills to your team. Let's create something amazing together!

Best regards,
{name}`,
  },
  {
    id: "formal",
    name: "Formal",
    template: `Dear {hiringManager},

I respectfully submit my application for the {position} position at {company}, as advertised. My qualifications in {field} make me an ideal candidate for this role.

{body}

I am available for an interview at your earliest convenience and can be reached at the contact information provided above.

Respectfully yours,
{name}`,
  },
];

export default function CoverLetterGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    hiringManager: "Hiring Manager",
    field: "",
    industry: "",
    body: "",
  });
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [generatedLetter, setGeneratedLetter] = useState("");

  const generateLetter = () => {
    let letter = selectedTemplate.template;
    Object.entries(formData).forEach(([key, value]) => {
      letter = letter.replace(new RegExp(`{${key}}`, "g"), value || `[${key}]`);
    });
    setGeneratedLetter(letter);
    toast.success("Cover letter generated!");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    toast.success("Copied to clipboard!");
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${formData.company || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Cover letter downloaded!");
  };

  const seoContent = {
    description: "Generate compelling cover letters tailored to job descriptions.",
    content: `<h3>Professional Cover Letters</h3><p>Create personalized cover letters in seconds with multiple templates.</p>`,
    keywords: ["cover letter", "job application", "cover letter generator", "job search"],
    faqs: [
      { question: "Should I customize for each job?", answer: "Yes! Tailoring shows genuine interest and helps address specific requirements." },
      { question: "How long should a cover letter be?", answer: "Keep it concise - 3-4 paragraphs or about 250-400 words." },
    ],
    aboutTool: "Generate professional cover letters with multiple templates. Personalize every aspect for your job applications.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Your Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@email.com"
                  />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Tech Corp Inc."
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hiring Manager (if known)</Label>
                  <Input
                    value={formData.hiringManager}
                    onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                    placeholder="Hiring Manager"
                  />
                </div>
                <div>
                  <Label>Your Field</Label>
                  <Input
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    placeholder="Software Development"
                  />
                </div>
              </div>
              <div>
                <Label>Industry</Label>
                <Input
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Technology"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Choose Template</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate.id === template.id ? "default" : "outline"}
                      onClick={() => setSelectedTemplate(template)}
                      className="w-full"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Main Body Content</Label>
                <Textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Describe your relevant experience, achievements, and why you're excited about this opportunity..."
                  rows={6}
                />
              </div>
              <Button onClick={generateLetter} className="w-full" size="lg">
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Cover Letter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8">
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Letter</CardTitle>
              {generatedLetter && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsText}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-8 rounded-lg min-h-[500px] whitespace-pre-wrap font-serif">
                {generatedLetter || (
                  <p className="text-gray-400 italic">
                    Fill in the form and click "Generate Cover Letter" to see your personalized
                    letter here...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
