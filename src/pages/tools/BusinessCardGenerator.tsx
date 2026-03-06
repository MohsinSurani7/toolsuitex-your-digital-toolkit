import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Download, CreditCard, Palette, Upload, RotateCw, Type, Sparkles, Image as ImageIcon, Paintbrush } from "lucide-react";
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
  frontBg1: string;
  frontBg2: string;
  frontText: string;
  frontAccent: string;
  backBg1: string;
  backBg2: string;
  backText: string;
  backAccent: string;
  useGradient: boolean;
  gradientAngle: number;
}

const templates = [
  { id: "modern-dark", name: "Modern Dark", frontBg1: "#0f172a", frontBg2: "#1e3a5f", frontText: "#f8fafc", frontAccent: "#0ea5e9", backBg1: "#1e293b", backBg2: "#0f172a", backText: "#e2e8f0", backAccent: "#0ea5e9", useGradient: true },
  { id: "minimal-white", name: "Minimal White", frontBg1: "#ffffff", frontBg2: "#f1f5f9", frontText: "#1a1a2e", frontAccent: "#6366f1", backBg1: "#f8f9fa", backBg2: "#ffffff", backText: "#1a1a2e", backAccent: "#6366f1", useGradient: false },
  { id: "bold-purple", name: "Bold Purple", frontBg1: "#7c3aed", frontBg2: "#ec4899", frontText: "#ffffff", frontAccent: "#fbbf24", backBg1: "#6d28d9", backBg2: "#7c3aed", backText: "#f5f3ff", backAccent: "#fbbf24", useGradient: true },
  { id: "nature", name: "Nature Green", frontBg1: "#064e3b", frontBg2: "#065f46", frontText: "#ecfdf5", frontAccent: "#34d399", backBg1: "#065f46", backBg2: "#047857", backText: "#d1fae5", backAccent: "#34d399", useGradient: true },
  { id: "sunset", name: "Sunset Fire", frontBg1: "#ea580c", frontBg2: "#dc2626", frontText: "#ffffff", frontAccent: "#fbbf24", backBg1: "#c2410c", backBg2: "#ea580c", backText: "#fff7ed", backAccent: "#fbbf24", useGradient: true },
  { id: "ocean", name: "Ocean Blue", frontBg1: "#1e40af", frontBg2: "#0891b2", frontText: "#ffffff", frontAccent: "#38bdf8", backBg1: "#1d4ed8", backBg2: "#1e40af", backText: "#dbeafe", backAccent: "#38bdf8", useGradient: true },
  { id: "rose-gold", name: "Rose Gold", frontBg1: "#1c1917", frontBg2: "#44403c", frontText: "#fecdd3", frontAccent: "#fb7185", backBg1: "#292524", backBg2: "#1c1917", backText: "#fda4af", backAccent: "#fb7185", useGradient: true },
  { id: "charcoal", name: "Charcoal", frontBg1: "#18181b", frontBg2: "#27272a", frontText: "#d4d4d8", frontAccent: "#a1a1aa", backBg1: "#27272a", backBg2: "#18181b", backText: "#a1a1aa", backAccent: "#71717a", useGradient: false },
  { id: "neon", name: "Neon Cyber", frontBg1: "#0a0a0a", frontBg2: "#1a0a2e", frontText: "#00ff88", frontAccent: "#ff00ff", backBg1: "#1a0a2e", backBg2: "#0a0a0a", backText: "#00ff88", backAccent: "#ff00ff", useGradient: true },
  { id: "coral", name: "Coral", frontBg1: "#fff1f2", frontBg2: "#ffe4e6", frontText: "#9f1239", frontAccent: "#fb7185", backBg1: "#ffe4e6", backBg2: "#fecdd3", backText: "#881337", backAccent: "#fb7185", useGradient: true },
  { id: "midnight", name: "Midnight", frontBg1: "#020617", frontBg2: "#0f172a", frontText: "#e0f2fe", frontAccent: "#0284c7", backBg1: "#0c1528", backBg2: "#020617", backText: "#bae6fd", backAccent: "#0284c7", useGradient: true },
  { id: "gold-luxury", name: "Gold Luxury", frontBg1: "#1a1a2e", frontBg2: "#16213e", frontText: "#ffd700", frontAccent: "#daa520", backBg1: "#16213e", backBg2: "#1a1a2e", backText: "#ffd700", backAccent: "#daa520", useGradient: true },
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
  { id: "classic", name: "Classic", desc: "Name top-left, logo top-right" },
  { id: "centered", name: "Centered", desc: "Everything centered" },
  { id: "left-accent", name: "Left Accent", desc: "Color bar on left" },
  { id: "split", name: "Split", desc: "Two-column layout" },
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
    frontBg1: templates[0].frontBg1,
    frontBg2: templates[0].frontBg2,
    frontText: templates[0].frontText,
    frontAccent: templates[0].frontAccent,
    backBg1: templates[0].backBg1,
    backBg2: templates[0].backBg2,
    backText: templates[0].backText,
    backAccent: templates[0].backAccent,
    useGradient: templates[0].useGradient,
    gradientAngle: 135,
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
    setColors(prev => ({
      ...prev,
      frontBg1: t.frontBg1,
      frontBg2: t.frontBg2,
      frontText: t.frontText,
      frontAccent: t.frontAccent,
      backBg1: t.backBg1,
      backBg2: t.backBg2,
      backText: t.backText,
      backAccent: t.backAccent,
      useGradient: t.useGradient,
    }));
  };

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const getBgStyle = (bg1: string, bg2: string, isGradient: boolean, angle: number) => {
    if (isGradient) {
      return { background: `linear-gradient(${angle}deg, ${bg1}, ${bg2})` };
    }
    return { backgroundColor: bg1 };
  };

  const downloadCard = async (side: "front" | "back" | "both") => {
    try {
      const refs = side === "both" ? [{ ref: frontRef, name: "front" }, { ref: backRef, name: "back" }]
        : side === "front" ? [{ ref: frontRef, name: "front" }]
        : [{ ref: backRef, name: "back" }];

      for (const { ref, name } of refs) {
        if (!ref.current) continue;
        const canvas = await html2canvas(ref.current, { scale: 3, backgroundColor: null, useCORS: true });
        const link = document.createElement("a");
        link.download = `business-card-${name}-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
      toast.success(side === "both" ? "Both sides downloaded!" : "Card downloaded!");
    } catch {
      toast.error("Failed to download card");
    }
  };

  const updateField = (field: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const renderFrontCard = (ref?: React.RefObject<HTMLDivElement>) => {
    const bgStyle = getBgStyle(colors.frontBg1, colors.frontBg2, colors.useGradient, colors.gradientAngle);
    const baseStyle = { ...bgStyle, color: colors.frontText, fontFamily: font.family };

    if (layout === "centered") {
      return (
        <div ref={ref?.current ? ref : undefined} className="w-[400px] h-[230px] rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-2xl" style={baseStyle}>
          {logo && <img src={logo} alt="Logo" className="w-12 h-12 object-contain mb-2 rounded" />}
          <h2 className="text-xl font-bold tracking-tight">{cardData.name || "Your Name"}</h2>
          <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
          {cardData.company && <p className="text-sm font-semibold mt-1" style={{ color: colors.frontAccent }}>{cardData.company}</p>}
          {cardData.tagline && <p className="text-[10px] opacity-60 mt-2 italic">{cardData.tagline}</p>}
        </div>
      );
    }

    if (layout === "left-accent") {
      return (
        <div ref={ref?.current ? ref : undefined} className="w-[400px] h-[230px] rounded-xl shadow-2xl flex overflow-hidden" style={baseStyle}>
          <div className="w-2 shrink-0" style={{ backgroundColor: colors.frontAccent }} />
          <div className="p-6 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-3">
              {logo && <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded" />}
              <div>
                <h2 className="text-xl font-bold tracking-tight">{cardData.name || "Your Name"}</h2>
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
        <div ref={ref?.current ? ref : undefined} className="w-[400px] h-[230px] rounded-xl shadow-2xl flex overflow-hidden" style={{ fontFamily: font.family }}>
          <div className="w-2/5 flex flex-col items-center justify-center p-4" style={{ backgroundColor: colors.frontAccent }}>
            {logo && <img src={logo} alt="Logo" className="w-14 h-14 object-contain mb-2 rounded" />}
            <p className="text-xs font-bold text-center" style={{ color: colors.frontBg1 }}>{cardData.company || "Company"}</p>
          </div>
          <div className="w-3/5 flex flex-col justify-center p-5" style={{ ...bgStyle, color: colors.frontText }}>
            <h2 className="text-lg font-bold tracking-tight">{cardData.name || "Your Name"}</h2>
            <p className="text-sm opacity-80">{cardData.title || "Job Title"}</p>
            {cardData.tagline && <p className="text-[10px] opacity-60 mt-2 italic">{cardData.tagline}</p>}
          </div>
        </div>
      );
    }

    // Classic
    return (
      <div ref={ref?.current ? ref : undefined} className="w-[400px] h-[230px] rounded-xl p-6 shadow-2xl flex flex-col justify-between" style={baseStyle}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{cardData.name || "Your Name"}</h2>
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

  const renderBackCard = (ref?: React.RefObject<HTMLDivElement>) => {
    const bgStyle = getBgStyle(colors.backBg1, colors.backBg2, colors.useGradient, (colors.gradientAngle + 180) % 360);
    const baseStyle = { ...bgStyle, color: colors.backText, fontFamily: font.family };

    const contactItems = [
      { icon: "✉", value: cardData.email },
      { icon: "☎", value: cardData.phone },
      { icon: "🌐", value: cardData.website },
      { icon: "📍", value: cardData.address },
      { icon: "in", value: cardData.linkedin },
      { icon: "𝕏", value: cardData.twitter },
    ].filter(item => item.value);

    return (
      <div ref={ref?.current ? ref : undefined} className="w-[400px] h-[230px] rounded-xl p-6 shadow-2xl flex flex-col justify-between" style={baseStyle}>
        <div className="flex items-start justify-between">
          {logo && <img src={logo} alt="Logo" className="w-10 h-10 object-contain rounded opacity-70" />}
          {cardData.company && <p className="text-sm font-bold" style={{ color: colors.backAccent }}>{cardData.company}</p>}
        </div>
        <div className="space-y-1.5 text-xs">
          {contactItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 text-center" style={{ color: colors.backAccent }}>{item.icon}</span>
              <span>{item.value}</span>
            </div>
          ))}
          {contactItems.length === 0 && (
            <p className="opacity-50 text-center">Add contact info to see it here</p>
          )}
        </div>
        <div className="w-full h-0.5 opacity-30 rounded-full" style={{ backgroundColor: colors.backAccent }} />
      </div>
    );
  };

  const seoContent = {
    description: "Design professional double-sided business cards online for free. Multiple templates, gradient colors, custom logo upload, and instant download.",
    content: `<h3>Introduction</h3><p>Create stunning double-sided business cards with our free online generator. Choose from 12+ professional templates with gradient support, customize every color, upload your logo, and download print-ready cards instantly.</p><h3>Key Benefits</h3><ul><li>Double-sided card design (front & back)</li><li>12+ professional templates with gradients</li><li>Custom colors, gradients, fonts & layouts</li><li>Logo upload support</li><li>Print-ready high-resolution PNG</li><li>No design skills needed</li></ul>`,
    keywords: ["business card generator", "business card maker online", "business card generator online", "business card builder free", "business card generator free", "online business card generator", "business card maker online free", "business card creator online", "business card generator online free", "business card creator online free", "online visiting card generator", "free business card maker", "professional business card", "double sided business card", "custom business card design", "print ready business card"],
    faqs: [
      { question: "What format are the cards?", answer: "Cards are downloaded as high-resolution PNG files at 300 DPI." },
      { question: "Can I print these cards?", answer: "Yes, they are print-ready. Download both front and back sides." },
      { question: "Can I add my logo?", answer: "Yes, upload any image as your logo and it will appear on the card." },
      { question: "Can I customize colors?", answer: "Yes, every color is fully customizable including gradient backgrounds." },
    ],
    aboutTool: "Our Business Card Generator helps you create professional double-sided cards with custom templates, gradient colors, fonts, and logos.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
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

              <TabsContent value="info" className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Full Name</Label><Input placeholder="John Doe" value={cardData.name} onChange={updateField("name")} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Job Title</Label><Input placeholder="Software Engineer" value={cardData.title} onChange={updateField("title")} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Company</Label><Input placeholder="Acme Inc." value={cardData.company} onChange={updateField("company")} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Tagline</Label><Input placeholder="Building the future..." value={cardData.tagline} onChange={updateField("tagline")} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Email</Label><Input placeholder="john@example.com" value={cardData.email} onChange={updateField("email")} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Phone</Label><Input placeholder="+1 234 567 890" value={cardData.phone} onChange={updateField("phone")} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Website</Label><Input placeholder="www.example.com" value={cardData.website} onChange={updateField("website")} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Address</Label><Input placeholder="123 Main St, City" value={cardData.address} onChange={updateField("address")} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">LinkedIn</Label><Input placeholder="linkedin.com/in/john" value={cardData.linkedin} onChange={updateField("linkedin")} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Twitter / X</Label><Input placeholder="@johndoe" value={cardData.twitter} onChange={updateField("twitter")} className="h-9 text-sm" /></div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="space-y-4 animate-fade-in">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-xs"><Palette className="w-4 h-4" /> Template</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        className={`h-14 rounded-lg border-2 transition-all flex items-center justify-center ${selectedTemplate.id === t.id ? "border-primary ring-2 ring-primary/50 scale-105" : "border-transparent hover:border-muted-foreground/30"}`}
                        style={t.useGradient ? { background: `linear-gradient(135deg, ${t.frontBg1}, ${t.frontBg2})` } : { backgroundColor: t.frontBg1 }}
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
                        className={`py-2.5 px-3 rounded-lg border text-left transition-all ${layout === l.id ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/40"}`}
                        onClick={() => setLayout(l.id)}
                      >
                        <span className={`text-xs font-medium block ${layout === l.id ? "text-primary" : ""}`}>{l.name}</span>
                        <span className="text-[10px] text-muted-foreground">{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-4 animate-fade-in">
                {/* Gradient toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Paintbrush className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-xs cursor-pointer">Enable Gradient Background</Label>
                  </div>
                  <Switch checked={colors.useGradient} onCheckedChange={(v) => setColors(prev => ({ ...prev, useGradient: v }))} />
                </div>

                {colors.useGradient && (
                  <div>
                    <Label className="text-xs">Gradient Angle: {colors.gradientAngle}°</Label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={colors.gradientAngle}
                      onChange={e => setColors(prev => ({ ...prev, gradientAngle: Number(e.target.value) }))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-1"
                      style={{ background: `linear-gradient(90deg, ${colors.frontBg1}, ${colors.frontBg2})` }}
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Front Side Colors</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker label={colors.useGradient ? "BG Color 1" : "Background"} value={colors.frontBg1} onChange={v => setColors(prev => ({ ...prev, frontBg1: v }))} />
                    {colors.useGradient && <ColorPicker label="BG Color 2" value={colors.frontBg2} onChange={v => setColors(prev => ({ ...prev, frontBg2: v }))} />}
                    <ColorPicker label="Text Color" value={colors.frontText} onChange={v => setColors(prev => ({ ...prev, frontText: v }))} />
                    <ColorPicker label="Accent Color" value={colors.frontAccent} onChange={v => setColors(prev => ({ ...prev, frontAccent: v }))} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Back Side Colors</p>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorPicker label={colors.useGradient ? "BG Color 1" : "Background"} value={colors.backBg1} onChange={v => setColors(prev => ({ ...prev, backBg1: v }))} />
                    {colors.useGradient && <ColorPicker label="BG Color 2" value={colors.backBg2} onChange={v => setColors(prev => ({ ...prev, backBg2: v }))} />}
                    <ColorPicker label="Text Color" value={colors.backText} onChange={v => setColors(prev => ({ ...prev, backText: v }))} />
                    <ColorPicker label="Accent Color" value={colors.backAccent} onChange={v => setColors(prev => ({ ...prev, backAccent: v }))} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logo" className="space-y-4 animate-fade-in">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-xs"><ImageIcon className="w-4 h-4" /> Upload Logo</Label>
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-16 h-16 object-contain rounded" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">Click to upload logo (PNG, SVG, JPG)</p>
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

        {/* Preview - both cards always rendered */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Preview</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowBack(!showBack)} className="gap-1.5">
                  <RotateCw className={`w-4 h-4 transition-transform duration-500 ${showBack ? "rotate-180" : ""}`} />
                  {showBack ? "Show Front" : "Show Back"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 p-6">
              {/* Visible preview card */}
              <div className="relative w-[400px] h-[230px]">
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    opacity: showBack ? 0 : 1,
                    transform: showBack ? "scale(0.95) rotateY(90deg)" : "scale(1) rotateY(0deg)",
                    pointerEvents: showBack ? "none" : "auto",
                  }}
                >
                  {renderFrontCard()}
                </div>
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    opacity: showBack ? 1 : 0,
                    transform: showBack ? "scale(1) rotateY(0deg)" : "scale(0.95) rotateY(-90deg)",
                    pointerEvents: showBack ? "auto" : "none",
                  }}
                >
                  {renderBackCard()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium transition-colors ${!showBack ? "text-primary" : "text-muted-foreground"}`}>Front</span>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full transition-colors ${!showBack ? "bg-primary" : "bg-muted-foreground/30"}`} />
                  <div className={`w-2 h-2 rounded-full transition-colors ${showBack ? "bg-primary" : "bg-muted-foreground/30"}`} />
                </div>
                <span className={`text-xs font-medium transition-colors ${showBack ? "text-primary" : "text-muted-foreground"}`}>Back</span>
              </div>
            </CardContent>
          </Card>

          {/* Hidden refs for download - always rendered */}
          <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden="true">
            <div ref={frontRef}>
              {renderFrontCard()}
            </div>
            <div ref={backRef}>
              {renderBackCard()}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-border"
        style={{ padding: 0 }}
      />
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[10px] font-mono">{value}</p>
      </div>
    </div>
  );
}
