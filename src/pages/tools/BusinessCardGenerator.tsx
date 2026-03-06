import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, CreditCard, Palette, Upload, RotateCw, Type, Sparkles, Image as ImageIcon } from "lucide-react";
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
  tagline: string;
  linkedin: string;
  twitter: string;
}

interface CardColors {
  frontBg: string;
  frontText: string;
  frontAccent: string;
  backBg: string;
  backText: string;
  backAccent: string;
}

const templates = [
  { id: "modern-dark", name: "Modern Dark", frontBg: "#0f172a", frontText: "#f8fafc", frontAccent: "#0ea5e9", backBg: "#1e293b", backText: "#e2e8f0", backAccent: "#0ea5e9" },
  { id: "minimal-white", name: "Minimal White", frontBg: "#ffffff", frontText: "#1a1a2e", frontAccent: "#6366f1", backBg: "#f8f9fa", backText: "#1a1a2e", backAccent: "#6366f1" },
  { id: "bold-gradient", name: "Bold Purple", frontBg: "#7c3aed", frontText: "#ffffff", frontAccent: "#c084fc", backBg: "#6d28d9", backText: "#f5f3ff", backAccent: "#c084fc" },
  { id: "nature", name: "Nature Green", frontBg: "#064e3b", frontText: "#ecfdf5", frontAccent: "#34d399", backBg: "#065f46", backText: "#d1fae5", backAccent: "#34d399" },
  { id: "sunset", name: "Sunset", frontBg: "#ea580c", frontText: "#ffffff", frontAccent: "#fbbf24", backBg: "#c2410c", backText: "#fff7ed", backAccent: "#fbbf24" },
  { id: "ocean", name: "Ocean Blue", frontBg: "#1e40af", frontText: "#ffffff", frontAccent: "#38bdf8", backBg: "#1d4ed8", backText: "#dbeafe", backAccent: "#38bdf8" },
  { id: "rose-gold", name: "Rose Gold", frontBg: "#1c1917", frontText: "#fecdd3", frontAccent: "#fb7185", backBg: "#292524", backText: "#fda4af", backAccent: "#fb7185" },
  { id: "charcoal", name: "Charcoal", frontBg: "#18181b", frontText: "#d4d4d8", frontAccent: "#a1a1aa", backBg: "#27272a", backText: "#a1a1aa", backAccent: "#71717a" },
  { id: "forest", name: "Forest", frontBg: "#14532d", frontText: "#bbf7d0", frontAccent: "#86efac", backBg: "#166534", backText: "#a7f3d0", backAccent: "#86efac" },
  { id: "coral", name: "Coral", frontBg: "#fff1f2", frontText: "#9f1239", frontAccent: "#fb7185", backBg: "#ffe4e6", backText: "#881337", backAccent: "#fb7185" },
  { id: "midnight", name: "Midnight", frontBg: "#020617", frontText: "#e0f2fe", frontAccent: "#0284c7", backBg: "#0c1528", backText: "#bae6fd", backAccent: "#0284c7" },
  { id: "cream", name: "Cream Classic", frontBg: "#fefce8", frontText: "#422006", frontAccent: "#ca8a04", backBg: "#fef9c3", backText: "#713f12", backAccent: "#ca8a04" },
];

const fontOptions = [
  { id: "inter", name: "Inter", family: "'Inter', sans-serif" },
  { id: "georgia", name: "Georgia", family: "'Georgia', serif" },
  { id: "courier", name: "Courier", family: "'Courier New', monospace" },
  { id: "arial", name: "Arial", family: "'Arial', sans-serif" },
  { id: "palatino", name: "Palatino", family: "'Palatino Linotype', serif" },
  { id: "verdana", name: "Verdana", family: "'Verdana', sans-serif" },
];

const layoutOptions = [
  { id: "classic", name: "Classic" },
  { id: "centered", name: "Centered" },
  { id: "left-accent", name: "Left Accent" },
  { id: "split", name: "Split" },
];

const tool = getToolById("business-card-generator")!;

export default function BusinessCardGenerator() {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [showBack, setShowBack] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [layout, setLayout] = useState("classic");
  const [font, setFont] = useState(fontOptions[0]);
  const [logo, setLogo] = useState<string | null>(null);
  const [colors, setColors] = useState<CardColors>({
    frontBg: templates[0].frontBg,
    frontText: templates[0].frontText,
    frontAccent: templates[0].frontAccent,
    backBg: templates[0].backBg,
    backText: templates[0].backText,
    backAccent: templates[0].backAccent,
  });
  const [cardData, setCardData] = useState<CardData>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    tagline: "",
    linkedin: "",
    twitter: "",
  });

  const applyTemplate = (t: typeof templates[0]) => {
    setSelectedTemplate(t);
    setColors({
      frontBg: t.frontBg,
      frontText: t.frontText,
      frontAccent: t.frontAccent,
      backBg: t.backBg,
      backText: t.backText,
      backAccent: t.backAccent,
    });
  };

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const downloadCard = async (side: "front" | "back" | "both") => {
    try {
      const refs = side === "both" ? [frontRef, backRef] : side === "front" ? [frontRef] : [backRef];
      for (const ref of refs) {
        if (!ref.current) continue;
        const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: null, useCORS: true });
        const link = document.createElement("a");
        link.download = `business-card-${side === "both" ? (ref === frontRef ? "front" : "back") : side}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      toast.success(side === "both" ? "Both sides downloaded!" : "Card downloaded!");
    } catch {
      toast.error("Failed to download card");
    }
  };

  const renderFrontCard = () => {
    const baseStyle = { backgroundColor: colors.frontBg, color: colors.frontText, fontFamily: font.family };

    if (layout === "centered") {
      return (
        <div ref={frontRef} className="w-[400px] h-[230px] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-2xl" style={baseStyle}>
          {logo && <img src={logo} alt="Logo" className="w-12 h-12 object-contain mb-2 rounded" />}
          <h2 className="text-xl font-bold">{cardData.name || "Your Name"}</h2>
          <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
          {cardData.company && <p className="text-sm font-semibold mt-1" style={{ color: colors.frontAccent }}>{cardData.company}</p>}
          {cardData.tagline && <p className="text-[10px] opacity-60 mt-2 italic">{cardData.tagline}</p>}
        </div>
      );
    }

    if (layout === "left-accent") {
      return (
        <div ref={frontRef} className="w-[400px] h-[230px] rounded-xl shadow-2xl flex overflow-hidden" style={baseStyle}>
          <div className="w-2 shrink-0" style={{ backgroundColor: colors.frontAccent }} />
          <div className="p-6 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-3">
              {logo && <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded" />}
              <div>
                <h2 className="text-xl font-bold">{cardData.name || "Your Name"}</h2>
                <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
              </div>
            </div>
            <div>
              {cardData.company && <p className="text-sm font-semibold" style={{ color: colors.frontAccent }}>{cardData.company}</p>}
              {cardData.tagline && <p className="text-[10px] opacity-60 italic">{cardData.tagline}</p>}
            </div>
          </div>
        </div>
      );
    }

    if (layout === "split") {
      return (
        <div ref={frontRef} className="w-[400px] h-[230px] rounded-xl shadow-2xl flex overflow-hidden" style={{ fontFamily: font.family }}>
          <div className="w-2/5 flex flex-col items-center justify-center p-4" style={{ backgroundColor: colors.frontAccent }}>
            {logo && <img src={logo} alt="Logo" className="w-14 h-14 object-contain mb-2 rounded" />}
            <p className="text-xs font-bold text-center" style={{ color: colors.frontBg }}>{cardData.company || "Company"}</p>
          </div>
          <div className="w-3/5 flex flex-col justify-center p-5" style={{ backgroundColor: colors.frontBg, color: colors.frontText }}>
            <h2 className="text-lg font-bold">{cardData.name || "Your Name"}</h2>
            <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
            {cardData.tagline && <p className="text-[10px] opacity-60 mt-2 italic">{cardData.tagline}</p>}
          </div>
        </div>
      );
    }

    // Classic
    return (
      <div ref={frontRef} className="w-[400px] h-[230px] rounded-xl p-6 shadow-2xl flex flex-col justify-between" style={baseStyle}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{cardData.name || "Your Name"}</h2>
            <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
            {cardData.company && <p className="text-sm font-semibold mt-1" style={{ color: colors.frontAccent }}>{cardData.company}</p>}
          </div>
          {logo && <img src={logo} alt="Logo" className="w-12 h-12 object-contain rounded" />}
        </div>
        <div>
          {cardData.tagline && <p className="text-[10px] opacity-60 italic">{cardData.tagline}</p>}
          <div className="w-12 h-0.5 mt-2" style={{ backgroundColor: colors.frontAccent }} />
        </div>
      </div>
    );
  };

  const renderBackCard = () => {
    const baseStyle = { backgroundColor: colors.backBg, color: colors.backText, fontFamily: font.family };
    return (
      <div ref={backRef} className="w-[400px] h-[230px] rounded-xl p-6 shadow-2xl flex flex-col justify-between" style={baseStyle}>
        <div className="flex items-start justify-between">
          {logo && <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded opacity-60" />}
          {cardData.company && <p className="text-sm font-bold" style={{ color: colors.backAccent }}>{cardData.company}</p>}
        </div>
        <div className="space-y-1 text-xs">
          {cardData.email && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>✉</span>
              <span>{cardData.email}</span>
            </div>
          )}
          {cardData.phone && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>✆</span>
              <span>{cardData.phone}</span>
            </div>
          )}
          {cardData.website && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>⌂</span>
              <span>{cardData.website}</span>
            </div>
          )}
          {cardData.address && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>⊕</span>
              <span>{cardData.address}</span>
            </div>
          )}
          {cardData.linkedin && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>in</span>
              <span>{cardData.linkedin}</span>
            </div>
          )}
          {cardData.twitter && (
            <div className="flex items-center gap-2">
              <span style={{ color: colors.backAccent }}>𝕏</span>
              <span>{cardData.twitter}</span>
            </div>
          )}
        </div>
        <div className="w-full h-0.5 opacity-30" style={{ backgroundColor: colors.backAccent }} />
      </div>
    );
  };

  const seoContent = {
    description: "Design professional double-sided business cards online for free. Multiple templates, custom colors, logo upload, and instant download.",
    content: `<h3>Introduction</h3><p>Create stunning double-sided business cards with our free online generator. Choose from 12+ professional templates, customize colors, upload your logo, and download print-ready cards instantly.</p><h3>Key Benefits</h3><ul><li>Double-sided card design (front & back)</li><li>12+ professional templates</li><li>Custom colors, fonts & layouts</li><li>Logo upload support</li><li>Print-ready high-resolution PNG</li><li>No design skills needed</li></ul>`,
    keywords: ["business card generator", "business card maker online", "business card generator online", "business card builder free", "business card generator free", "online business card generator", "business card maker online free", "business card creator online", "business card generator online free", "business card creator online free", "online visiting card generator", "free business card maker", "professional business card", "double sided business card", "custom business card design", "print ready business card"],
    faqs: [
      { question: "What format are the cards?", answer: "Cards are downloaded as high-resolution PNG files at 300 DPI." },
      { question: "Can I print these cards?", answer: "Yes, they are print-ready. Download both front and back sides." },
      { question: "Can I add my logo?", answer: "Yes, upload any image as your logo and it will appear on the card." },
      { question: "Can I customize colors?", answer: "Yes, every color on the card is fully customizable." },
    ],
    aboutTool: "Our Business Card Generator helps you create professional double-sided cards with custom templates, colors, fonts, and logos.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5" />
              Card Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
                <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
                <TabsTrigger value="logo" className="text-xs">Logo</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Full Name</Label><Input placeholder="John Doe" value={cardData.name} onChange={(e) => setCardData({ ...cardData, name: e.target.value })} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Job Title</Label><Input placeholder="Software Engineer" value={cardData.title} onChange={(e) => setCardData({ ...cardData, title: e.target.value })} className="h-9 text-sm" /></div>
                </div>
                <div><Label className="text-xs">Company</Label><Input placeholder="Acme Inc." value={cardData.company} onChange={(e) => setCardData({ ...cardData, company: e.target.value })} className="h-9 text-sm" /></div>
                <div><Label className="text-xs">Tagline</Label><Input placeholder="Building the future..." value={cardData.tagline} onChange={(e) => setCardData({ ...cardData, tagline: e.target.value })} className="h-9 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Email</Label><Input placeholder="john@example.com" value={cardData.email} onChange={(e) => setCardData({ ...cardData, email: e.target.value })} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Phone</Label><Input placeholder="+1 234 567 890" value={cardData.phone} onChange={(e) => setCardData({ ...cardData, phone: e.target.value })} className="h-9 text-sm" /></div>
                </div>
                <div><Label className="text-xs">Website</Label><Input placeholder="www.example.com" value={cardData.website} onChange={(e) => setCardData({ ...cardData, website: e.target.value })} className="h-9 text-sm" /></div>
                <div><Label className="text-xs">Address</Label><Input placeholder="123 Main St, City" value={cardData.address} onChange={(e) => setCardData({ ...cardData, address: e.target.value })} className="h-9 text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">LinkedIn</Label><Input placeholder="linkedin.com/in/john" value={cardData.linkedin} onChange={(e) => setCardData({ ...cardData, linkedin: e.target.value })} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Twitter / X</Label><Input placeholder="@johndoe" value={cardData.twitter} onChange={(e) => setCardData({ ...cardData, twitter: e.target.value })} className="h-9 text-sm" /></div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-xs"><Palette className="w-4 h-4" /> Template</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        className={`h-14 rounded-lg border-2 transition-all flex items-center justify-center ${selectedTemplate.id === t.id ? "border-primary ring-2 ring-primary/50 scale-105" : "border-transparent hover:border-muted-foreground/30"}`}
                        style={{ backgroundColor: t.frontBg }}
                        onClick={() => applyTemplate(t)}
                      >
                        <span className="text-[10px] font-medium px-1" style={{ color: t.frontText }}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-xs"><Type className="w-4 h-4" /> Font</Label>
                  <Select value={font.id} onValueChange={(v) => setFont(fontOptions.find(f => f.id === v) || fontOptions[0])}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(f => (
                        <SelectItem key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-xs"><Sparkles className="w-4 h-4" /> Layout</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {layoutOptions.map(l => (
                      <button
                        key={l.id}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${layout === l.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-muted-foreground/40"}`}
                        onClick={() => setLayout(l.id)}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-4">
                <p className="text-xs text-muted-foreground">Customize every color on your card.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Front Background</Label><div className="flex gap-2 items-center"><input type="color" value={colors.frontBg} onChange={e => setColors({...colors, frontBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.frontBg}</span></div></div>
                  <div><Label className="text-xs">Front Text</Label><div className="flex gap-2 items-center"><input type="color" value={colors.frontText} onChange={e => setColors({...colors, frontText: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.frontText}</span></div></div>
                  <div><Label className="text-xs">Front Accent</Label><div className="flex gap-2 items-center"><input type="color" value={colors.frontAccent} onChange={e => setColors({...colors, frontAccent: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.frontAccent}</span></div></div>
                  <div><Label className="text-xs">Back Background</Label><div className="flex gap-2 items-center"><input type="color" value={colors.backBg} onChange={e => setColors({...colors, backBg: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.backBg}</span></div></div>
                  <div><Label className="text-xs">Back Text</Label><div className="flex gap-2 items-center"><input type="color" value={colors.backText} onChange={e => setColors({...colors, backText: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.backText}</span></div></div>
                  <div><Label className="text-xs">Back Accent</Label><div className="flex gap-2 items-center"><input type="color" value={colors.backAccent} onChange={e => setColors({...colors, backAccent: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-xs text-muted-foreground">{colors.backAccent}</span></div></div>
                </div>
              </TabsContent>

              <TabsContent value="logo" className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-xs"><ImageIcon className="w-4 h-4" /> Upload Logo</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Click to upload logo</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {logo && (
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setLogo(null)}>
                      Remove Logo
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1" onClick={() => downloadCard("front")} size="sm">
                <Download className="w-4 h-4 mr-1" /> Front
              </Button>
              <Button className="flex-1" onClick={() => downloadCard("back")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button className="flex-1" onClick={() => downloadCard("both")} variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-1" /> Both
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Preview</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowBack(!showBack)}>
                <RotateCw className="w-4 h-4 mr-1" />
                {showBack ? "Front" : "Back"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6 p-6">
            <div className="relative" style={{ perspective: "1000px" }}>
              <div
                className="transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div style={{ backfaceVisibility: "hidden" }} className={showBack ? "hidden" : ""}>
                  {renderFrontCard()}
                </div>
                <div style={{ backfaceVisibility: "hidden" }} className={!showBack ? "hidden" : ""}>
                  {renderBackCard()}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {showBack ? "Back Side" : "Front Side"} — Click flip to see other side
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
