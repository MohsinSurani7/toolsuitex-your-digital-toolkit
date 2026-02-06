import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CreditCard, Palette } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface CardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

const templates = [
  { id: "modern", name: "Modern", bg: "bg-gradient-to-br from-slate-900 to-slate-700", text: "text-white" },
  { id: "minimal", name: "Minimal", bg: "bg-white", text: "text-gray-900" },
  { id: "bold", name: "Bold", bg: "bg-gradient-to-r from-purple-600 to-pink-600", text: "text-white" },
  { id: "nature", name: "Nature", bg: "bg-gradient-to-br from-green-600 to-teal-500", text: "text-white" },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-r from-orange-500 to-red-500", text: "text-white" },
  { id: "ocean", name: "Ocean", bg: "bg-gradient-to-br from-blue-600 to-cyan-500", text: "text-white" },
];

const tool = getToolById("business-card-generator")!;

export default function BusinessCardGenerator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState(templates[0]);
  const [cardData, setCardData] = useState<CardData>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  });

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `business-card-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Business card downloaded!");
    } catch {
      toast.error("Failed to download card");
    }
  };

  const seoContent = {
    description: "Design professional business cards online for free. Multiple templates, instant download.",
    content: `<h3>Introduction</h3><p>Create stunning business cards in minutes with our free online generator.</p><h3>Key Benefits</h3><ul><li>Multiple professional templates</li><li>Instant PNG download</li><li>No design skills needed</li><li>Print-ready quality</li></ul>`,
    keywords: ["business card generator", "free business card maker", "online business card"],
    faqs: [
      { question: "What format are the cards?", answer: "Cards are downloaded as high-resolution PNG files." },
      { question: "Can I print these cards?", answer: "Yes, they are print-ready at 300 DPI." },
    ],
    aboutTool: "Our Business Card Generator helps you create professional cards in seconds.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Card Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input placeholder="Software Engineer" value={cardData.title} onChange={(e) => setCardData({ ...cardData, title: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Company</Label>
              <Input placeholder="Acme Inc." value={cardData.company} onChange={(e) => setCardData({ ...cardData, company: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input placeholder="john@example.com" value={cardData.email} onChange={(e) => setCardData({ ...cardData, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="+1 234 567 890" value={cardData.phone} onChange={(e) => setCardData({ ...cardData, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Website</Label>
              <Input placeholder="www.example.com" value={cardData.website} onChange={(e) => setCardData({ ...cardData, website: e.target.value })} />
            </div>
            <div>
              <Label>Address</Label>
              <Input placeholder="123 Main St, City" value={cardData.address} onChange={(e) => setCardData({ ...cardData, address: e.target.value })} />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4" /> Template
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    className={`h-12 rounded-lg ${t.bg} border-2 transition-all ${template.id === t.id ? "border-primary ring-2 ring-primary/50" : "border-transparent"}`}
                    onClick={() => setTemplate(t)}
                  >
                    <span className={`text-xs font-medium ${t.text}`}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={downloadCard}>
              <Download className="w-4 h-4 mr-2" /> Download Card
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div
              ref={cardRef}
              className={`w-[350px] h-[200px] rounded-xl ${template.bg} ${template.text} p-6 shadow-2xl flex flex-col justify-between`}
              style={{ aspectRatio: "3.5/2" }}
            >
              <div>
                <h2 className="text-xl font-bold">{cardData.name || "Your Name"}</h2>
                <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
                {cardData.company && <p className="text-sm font-medium mt-1">{cardData.company}</p>}
              </div>
              <div className="space-y-1 text-xs opacity-90">
                {cardData.email && <p>{cardData.email}</p>}
                {cardData.phone && <p>{cardData.phone}</p>}
                {cardData.website && <p>{cardData.website}</p>}
                {cardData.address && <p>{cardData.address}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
