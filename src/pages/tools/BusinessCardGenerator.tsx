import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Download, CreditCard, Palette, Upload, RotateCw, Type, Sparkles, Image as ImageIcon, Paintbrush, X, Eye, QrCode } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FrontData {
  name: string;
  title: string;
  company: string;
  tagline: string;
}

interface BackData {
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}

interface SideColors {
  bg1: string;
  bg2: string;
  text: string;
  accent: string;
  useGradient: boolean;
  gradientAngle: number;
}

// ─── Color Palette (500+ colors) ─────────────────────────────────────────────

const colorCategories = [
  {
    name: "Reds", colors: [
      "#FF0000","#FF1A1A","#FF3333","#FF4D4D","#FF6666","#FF8080","#FF9999","#FFB3B3","#FFCCCC","#FFE6E6",
      "#E60000","#CC0000","#B30000","#990000","#800000","#660000","#4D0000","#330000","#DC143C","#B22222",
      "#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A","#FF6347","#FF4500","#FF7F7F","#D32F2F","#C62828",
    ]
  },
  {
    name: "Pinks", colors: [
      "#FF00FF","#FF1493","#FF69B4","#FFB6C1","#FFC0CB","#DB7093","#C71585","#FF007F","#E91E63","#F50057",
      "#AD1457","#880E4F","#EC407A","#F06292","#F48FB1","#F8BBD0","#FCE4EC","#D81B60","#C2185B","#FF80AB",
      "#FF4081","#F50057","#C51162","#FF6090","#FF80AB","#F48FB1","#F8BBD0","#FCE4EC","#FFD6E0","#FFECF1",
    ]
  },
  {
    name: "Oranges", colors: [
      "#FF8C00","#FF7F00","#FF6600","#FF5500","#FFA500","#FFB347","#FFCC80","#FFE0B2","#FFF3E0","#E65100",
      "#EF6C00","#F57C00","#FB8C00","#FF9800","#FFA726","#FFB74D","#FFCC80","#FFE0B2","#FFF3E0","#BF360C",
      "#D84315","#E64A19","#F4511E","#FF5722","#FF6E40","#FF8A65","#FFAB91","#FFCCBC","#FBE9E7","#DD2C00",
    ]
  },
  {
    name: "Yellows", colors: [
      "#FFFF00","#FFEB3B","#FFC107","#FFD600","#FFD740","#FFEA00","#FFF176","#FFF59D","#FFF9C4","#FFFDE7",
      "#F57F17","#F9A825","#FBC02D","#FDD835","#FFEE58","#FFF176","#FFF59D","#FFF9C4","#FFFDE7","#FFD700",
      "#DAA520","#B8860B","#FFD54F","#FFE082","#FFECB3","#FFF8E1","#F5F5DC","#FFFACD","#FAFAD2","#FFE4B5",
    ]
  },
  {
    name: "Greens", colors: [
      "#00FF00","#00E676","#00C853","#00BFA5","#009688","#4CAF50","#8BC34A","#CDDC39","#66BB6A","#81C784",
      "#A5D6A7","#C8E6C9","#E8F5E9","#1B5E20","#2E7D32","#388E3C","#43A047","#4CAF50","#66BB6A","#81C784",
      "#006400","#008000","#228B22","#2E8B57","#3CB371","#20B2AA","#00FA9A","#00FF7F","#7CFC00","#32CD32",
    ]
  },
  {
    name: "Teals", colors: [
      "#008080","#009688","#00897B","#00796B","#00695C","#004D40","#26A69A","#4DB6AC","#80CBC4","#B2DFDB",
      "#E0F2F1","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#26C6DA","#4DD0E1","#80DEEA","#B2EBF2",
      "#E0F7FA","#18FFFF","#00E5FF","#00B8D4","#84FFFF","#A7FFEB","#64FFDA","#1DE9B6","#00E676","#69F0AE",
    ]
  },
  {
    name: "Blues", colors: [
      "#0000FF","#0D47A1","#1565C0","#1976D2","#1E88E5","#2196F3","#42A5F5","#64B5F6","#90CAF9","#BBDEFB",
      "#E3F2FD","#0A1929","#0D47A1","#1565C0","#1976D2","#1E88E5","#2196F3","#42A5F5","#64B5F6","#90CAF9",
      "#000080","#00008B","#0000CD","#4169E1","#6495ED","#1E90FF","#00BFFF","#87CEEB","#87CEFA","#ADD8E6",
    ]
  },
  {
    name: "Purples", colors: [
      "#800080","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#AB47BC","#BA68C8","#CE93D8","#E1BEE7",
      "#F3E5F5","#AA00FF","#D500F9","#E040FB","#EA80FC","#B388FF","#7C4DFF","#651FFF","#6200EA","#311B92",
      "#4A0072","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#B39DDB","#D1C4E9","#EDE7F6",
    ]
  },
  {
    name: "Browns", colors: [
      "#8B4513","#A0522D","#A52A2A","#D2691E","#CD853F","#DEB887","#F4A460","#D2B48C","#BC8F8F","#C4A882",
      "#3E2723","#4E342E","#5D4037","#6D4C41","#795548","#8D6E63","#A1887F","#BCAAA4","#D7CCC8","#EFEBE9",
      "#BF360C","#8D6E63","#A1887F","#C8AD7F","#B08D57","#8B7355","#704214","#5C3317","#4B2709","#3B1F00",
    ]
  },
  {
    name: "Grays", colors: [
      "#000000","#111111","#1A1A1A","#222222","#2D2D2D","#333333","#3D3D3D","#444444","#4F4F4F","#555555",
      "#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB","#CCCCCC","#D5D5D5","#DDDDDD","#E8E8E8",
      "#EEEEEE","#F2F2F2","#F5F5F5","#F8F8F8","#FAFAFA","#FCFCFC","#FFFFFF","#263238","#37474F","#455A64",
    ]
  },
  {
    name: "Neutrals", colors: [
      "#0F172A","#1E293B","#334155","#475569","#64748B","#94A3B8","#CBD5E1","#E2E8F0","#F1F5F9","#F8FAFC",
      "#18181B","#27272A","#3F3F46","#52525B","#71717A","#A1A1AA","#D4D4D8","#E4E4E7","#F4F4F5","#FAFAFA",
      "#171717","#262626","#404040","#525252","#737373","#A3A3A3","#D4D4D4","#E5E5E5","#F5F5F5","#FAFAFA",
    ]
  },
];

const gradientPresets = [
  { name: "Sunset", from: "#FF512F", to: "#DD2476" },
  { name: "Ocean", from: "#2193b0", to: "#6dd5ed" },
  { name: "Purple Rain", from: "#7B2FF7", to: "#C850C0" },
  { name: "Forest", from: "#134E5E", to: "#71B280" },
  { name: "Fire", from: "#f12711", to: "#f5af19" },
  { name: "Night Sky", from: "#0f0c29", to: "#302b63" },
  { name: "Peach", from: "#ED4264", to: "#FFEDBC" },
  { name: "Mint", from: "#00b09b", to: "#96c93d" },
  { name: "Berry", from: "#4568DC", to: "#B06AB3" },
  { name: "Gold Rush", from: "#F09819", to: "#EDDE5D" },
  { name: "Arctic", from: "#2BC0E4", to: "#EAECC6" },
  { name: "Cherry", from: "#EB3349", to: "#F45C43" },
  { name: "Midnight", from: "#0f2027", to: "#2C5364" },
  { name: "Lavender", from: "#C9D6FF", to: "#E2E2E2" },
  { name: "Neon", from: "#00f260", to: "#0575E6" },
  { name: "Cosmic", from: "#ff00cc", to: "#333399" },
  { name: "Emerald", from: "#348F50", to: "#56B4D3" },
  { name: "Royal", from: "#141E30", to: "#243B55" },
  { name: "Rose", from: "#FFB6C1", to: "#FF69B4" },
  { name: "Slate", from: "#373B44", to: "#4286f4" },
  { name: "Copper", from: "#B79891", to: "#94716B" },
  { name: "Ice", from: "#C9D6FF", to: "#E2E2E2" },
  { name: "Flame", from: "#ff9a9e", to: "#fecfef" },
  { name: "Deep Sea", from: "#4CA1AF", to: "#C4E0E5" },
];

const templates = [
  { id: "modern-dark", name: "Modern Dark", front: { bg1: "#0f172a", bg2: "#1e3a5f", text: "#f8fafc", accent: "#0ea5e9", useGradient: true, gradientAngle: 135 }, back: { bg1: "#1e293b", bg2: "#0f172a", text: "#e2e8f0", accent: "#0ea5e9", useGradient: true, gradientAngle: 315 } },
  { id: "minimal-white", name: "Minimal White", front: { bg1: "#ffffff", bg2: "#f1f5f9", text: "#1a1a2e", accent: "#6366f1", useGradient: false, gradientAngle: 135 }, back: { bg1: "#f8f9fa", bg2: "#ffffff", text: "#1a1a2e", accent: "#6366f1", useGradient: false, gradientAngle: 135 } },
  { id: "bold-purple", name: "Bold Purple", front: { bg1: "#7c3aed", bg2: "#ec4899", text: "#ffffff", accent: "#fbbf24", useGradient: true, gradientAngle: 135 }, back: { bg1: "#6d28d9", bg2: "#7c3aed", text: "#f5f3ff", accent: "#fbbf24", useGradient: true, gradientAngle: 315 } },
  { id: "nature", name: "Nature Green", front: { bg1: "#064e3b", bg2: "#065f46", text: "#ecfdf5", accent: "#34d399", useGradient: true, gradientAngle: 135 }, back: { bg1: "#065f46", bg2: "#047857", text: "#d1fae5", accent: "#34d399", useGradient: true, gradientAngle: 315 } },
  { id: "sunset", name: "Sunset Fire", front: { bg1: "#ea580c", bg2: "#dc2626", text: "#ffffff", accent: "#fbbf24", useGradient: true, gradientAngle: 135 }, back: { bg1: "#c2410c", bg2: "#ea580c", text: "#fff7ed", accent: "#fbbf24", useGradient: true, gradientAngle: 315 } },
  { id: "ocean", name: "Ocean Blue", front: { bg1: "#1e40af", bg2: "#0891b2", text: "#ffffff", accent: "#38bdf8", useGradient: true, gradientAngle: 135 }, back: { bg1: "#1d4ed8", bg2: "#1e40af", text: "#dbeafe", accent: "#38bdf8", useGradient: true, gradientAngle: 315 } },
  { id: "rose-gold", name: "Rose Gold", front: { bg1: "#1c1917", bg2: "#44403c", text: "#fecdd3", accent: "#fb7185", useGradient: true, gradientAngle: 135 }, back: { bg1: "#292524", bg2: "#1c1917", text: "#fda4af", accent: "#fb7185", useGradient: true, gradientAngle: 315 } },
  { id: "charcoal", name: "Charcoal", front: { bg1: "#18181b", bg2: "#27272a", text: "#d4d4d8", accent: "#a1a1aa", useGradient: false, gradientAngle: 135 }, back: { bg1: "#27272a", bg2: "#18181b", text: "#a1a1aa", accent: "#71717a", useGradient: false, gradientAngle: 135 } },
  { id: "neon", name: "Neon Cyber", front: { bg1: "#0a0a0a", bg2: "#1a0a2e", text: "#00ff88", accent: "#ff00ff", useGradient: true, gradientAngle: 135 }, back: { bg1: "#1a0a2e", bg2: "#0a0a0a", text: "#00ff88", accent: "#ff00ff", useGradient: true, gradientAngle: 315 } },
  { id: "gold-luxury", name: "Gold Luxury", front: { bg1: "#1a1a2e", bg2: "#16213e", text: "#ffd700", accent: "#daa520", useGradient: true, gradientAngle: 135 }, back: { bg1: "#16213e", bg2: "#1a1a2e", text: "#ffd700", accent: "#daa520", useGradient: true, gradientAngle: 315 } },
  { id: "coral", name: "Coral Blush", front: { bg1: "#fff1f2", bg2: "#ffe4e6", text: "#9f1239", accent: "#fb7185", useGradient: true, gradientAngle: 135 }, back: { bg1: "#ffe4e6", bg2: "#fecdd3", text: "#881337", accent: "#fb7185", useGradient: true, gradientAngle: 315 } },
  { id: "midnight", name: "Midnight", front: { bg1: "#020617", bg2: "#0f172a", text: "#e0f2fe", accent: "#0284c7", useGradient: true, gradientAngle: 135 }, back: { bg1: "#0c1528", bg2: "#020617", text: "#bae6fd", accent: "#0284c7", useGradient: true, gradientAngle: 315 } },
  // Premium Templates
  { id: "glassmorphism", name: "Glassmorphism", front: { bg1: "#667eea", bg2: "#764ba2", text: "#ffffff", accent: "#a5b4fc", useGradient: true, gradientAngle: 135 }, back: { bg1: "#764ba2", bg2: "#667eea", text: "#f0f0ff", accent: "#c4b5fd", useGradient: true, gradientAngle: 315 } },
  { id: "brutalist", name: "Brutalist", front: { bg1: "#f5f5dc", bg2: "#f5f5dc", text: "#000000", accent: "#ff0000", useGradient: false, gradientAngle: 0 }, back: { bg1: "#000000", bg2: "#000000", text: "#f5f5dc", accent: "#ff0000", useGradient: false, gradientAngle: 0 } },
  { id: "neon-glow", name: "Neon Glow", front: { bg1: "#0d0d0d", bg2: "#1a0033", text: "#39ff14", accent: "#ff073a", useGradient: true, gradientAngle: 160 }, back: { bg1: "#1a0033", bg2: "#0d0d0d", text: "#00f0ff", accent: "#ff073a", useGradient: true, gradientAngle: 340 } },
  { id: "retro-80s", name: "Retro 80s", front: { bg1: "#ff6ec7", bg2: "#7873f5", text: "#ffffff", accent: "#ffd319", useGradient: true, gradientAngle: 135 }, back: { bg1: "#7873f5", bg2: "#ff6ec7", text: "#ffffff", accent: "#ffd319", useGradient: true, gradientAngle: 315 } },
  { id: "art-deco", name: "Art Deco", front: { bg1: "#1b1b2f", bg2: "#162447", text: "#e8d5b7", accent: "#c9a96e", useGradient: true, gradientAngle: 180 }, back: { bg1: "#162447", bg2: "#1b1b2f", text: "#e8d5b7", accent: "#c9a96e", useGradient: true, gradientAngle: 0 } },
  { id: "pastel-dream", name: "Pastel Dream", front: { bg1: "#ffecd2", bg2: "#fcb69f", text: "#4a3728", accent: "#e17055", useGradient: true, gradientAngle: 135 }, back: { bg1: "#a29bfe", bg2: "#dfe6e9", text: "#2d3436", accent: "#6c5ce7", useGradient: true, gradientAngle: 315 } },
];

const fontOptions = [
  { id: "inter", name: "Inter", family: "'Inter', sans-serif" },
  { id: "georgia", name: "Georgia", family: "'Georgia', serif" },
  { id: "courier", name: "Courier New", family: "'Courier New', monospace" },
  { id: "arial", name: "Arial", family: "'Arial', sans-serif" },
  { id: "palatino", name: "Palatino", family: "'Palatino Linotype', serif" },
  { id: "verdana", name: "Verdana", family: "'Verdana', sans-serif" },
  { id: "trebuchet", name: "Trebuchet MS", family: "'Trebuchet MS', sans-serif" },
  { id: "impact", name: "Impact", family: "'Impact', sans-serif" },
];

const layoutOptions = [
  { id: "classic", name: "Classic" },
  { id: "centered", name: "Centered" },
  { id: "left-accent", name: "Left Accent" },
  { id: "split", name: "Split" },
  { id: "minimal", name: "Minimal" },
];

const tool = getToolById("business-card-generator")!;

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BusinessCardGenerator() {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [showBack, setShowBack] = useState(false);
  const [layout, setLayout] = useState("classic");
  const [font, setFont] = useState(fontOptions[0]);
  const [activeColorCategory, setActiveColorCategory] = useState(0);

  const [frontLogo, setFrontLogo] = useState<string | null>(null);
  const [backLogo, setBackLogo] = useState<string | null>(null);
  const [showFrontLogo, setShowFrontLogo] = useState(true);
  const [showBackLogo, setShowBackLogo] = useState(true);
  const [showQR, setShowQR] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const [frontData, setFrontData] = useState<FrontData>({
    name: "", title: "", company: "", tagline: "",
  });

  const [backData, setBackData] = useState<BackData>({
    email: "", phone: "", website: "", address: "", linkedin: "", twitter: "", instagram: "", whatsapp: "",
  });

  const [frontColors, setFrontColors] = useState<SideColors>({
    bg1: "#0f172a", bg2: "#1e3a5f", text: "#f8fafc", accent: "#0ea5e9", useGradient: true, gradientAngle: 135,
  });

  const [backColors, setBackColors] = useState<SideColors>({
    bg1: "#1e293b", bg2: "#0f172a", text: "#e2e8f0", accent: "#0ea5e9", useGradient: true, gradientAngle: 315,
  });

  const applyTemplate = (t: typeof templates[0]) => {
    setFrontColors(t.front);
    setBackColors(t.back);
  };

  // Generate QR code from contact info
  useEffect(() => {
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      frontData.name ? `FN:${frontData.name}` : "",
      frontData.title ? `TITLE:${frontData.title}` : "",
      frontData.company ? `ORG:${frontData.company}` : "",
      backData.email ? `EMAIL:${backData.email}` : "",
      backData.phone ? `TEL:${backData.phone}` : "",
      backData.website ? `URL:${backData.website}` : "",
      backData.address ? `ADR:;;${backData.address};;;;` : "",
      backData.linkedin ? `X-SOCIALPROFILE;type=linkedin:${backData.linkedin}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");

    if (vcard.split("\n").length <= 3) { setQrDataUrl(null); return; }

    QRCode.toDataURL(vcard, { width: 120, margin: 1, color: { dark: backColors.text, light: "#00000000" } })
      .then(url => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null));
  }, [frontData, backData, backColors.text]);

  const applyGradientPreset = (preset: typeof gradientPresets[0], side: "front" | "back") => {
    const setter = side === "front" ? setFrontColors : setBackColors;
    setter(prev => ({ ...prev, bg1: preset.from, bg2: preset.to, useGradient: true }));
  };

  const handleLogoUpload = useCallback((side: "front" | "back") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Logo must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (side === "front") setFrontLogo(result);
      else setBackLogo(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const getBgStyle = (colors: SideColors) => {
    if (colors.useGradient) {
      return { background: `linear-gradient(${colors.gradientAngle}deg, ${colors.bg1}, ${colors.bg2})` };
    }
    return { backgroundColor: colors.bg1 };
  };

  const downloadCard = async (side: "front" | "back" | "both") => {
    try {
      const refs = side === "both"
        ? [{ ref: frontRef, name: "front" }, { ref: backRef, name: "back" }]
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
      toast.error("Download failed");
    }
  };

  // ─── Card Renderers ─────────────────────────────────────────────────────────

  const renderFront = (isRef = false) => {
    const style = { ...getBgStyle(frontColors), color: frontColors.text, fontFamily: font.family };
    const logo = showFrontLogo && frontLogo ? frontLogo : null;

    const content = () => {
      switch (layout) {
        case "centered":
          return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
              {logo && <img src={logo} alt="" className="w-14 h-14 object-contain mb-3 rounded-lg" />}
              <h2 className="text-xl font-bold tracking-tight leading-tight">{frontData.name || "Your Name"}</h2>
              <p className="text-sm opacity-75 mt-0.5">{frontData.title || "Job Title"}</p>
              {frontData.company && <p className="text-xs font-semibold mt-2" style={{ color: frontColors.accent }}>{frontData.company}</p>}
              {frontData.tagline && <p className="text-[10px] opacity-50 mt-2 italic max-w-[80%]">{frontData.tagline}</p>}
            </div>
          );
        case "left-accent":
          return (
            <div className="w-full h-full flex overflow-hidden">
              <div className="w-2 shrink-0" style={{ backgroundColor: frontColors.accent }} />
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex items-start gap-3">
                  {logo && <img src={logo} alt="" className="w-11 h-11 object-contain rounded-lg shrink-0" />}
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold tracking-tight truncate">{frontData.name || "Your Name"}</h2>
                    <p className="text-sm opacity-75 truncate">{frontData.title || "Job Title"}</p>
                  </div>
                </div>
                <div>
                  {frontData.company && <p className="text-xs font-semibold" style={{ color: frontColors.accent }}>{frontData.company}</p>}
                  {frontData.tagline && <p className="text-[10px] opacity-50 italic mt-1">{frontData.tagline}</p>}
                </div>
              </div>
            </div>
          );
        case "split":
          return (
            <div className="w-full h-full flex overflow-hidden">
              <div className="w-[38%] flex flex-col items-center justify-center p-4" style={{ backgroundColor: frontColors.accent }}>
                {logo && <img src={logo} alt="" className="w-14 h-14 object-contain mb-2 rounded-lg" />}
                <p className="text-[11px] font-bold text-center leading-tight" style={{ color: frontColors.bg1 }}>{frontData.company || "Company"}</p>
              </div>
              <div className="w-[62%] flex flex-col justify-center p-5">
                <h2 className="text-lg font-bold tracking-tight">{frontData.name || "Your Name"}</h2>
                <p className="text-sm opacity-75">{frontData.title || "Job Title"}</p>
                {frontData.tagline && <p className="text-[10px] opacity-50 mt-3 italic">{frontData.tagline}</p>}
              </div>
            </div>
          );
        case "minimal":
          return (
            <div className="w-full h-full p-6 flex flex-col justify-end">
              <h2 className="text-2xl font-light tracking-wide">{frontData.name || "Your Name"}</h2>
              <div className="w-8 h-[2px] my-2" style={{ backgroundColor: frontColors.accent }} />
              <p className="text-sm opacity-70">{frontData.title || "Job Title"}</p>
              {frontData.company && <p className="text-xs font-medium mt-1 opacity-50">{frontData.company}</p>}
              {logo && <img src={logo} alt="" className="w-8 h-8 object-contain rounded absolute top-5 right-5 opacity-60" />}
            </div>
          );
        default: // classic
          return (
            <div className="w-full h-full p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold tracking-tight truncate">{frontData.name || "Your Name"}</h2>
                  <p className="text-sm opacity-75 truncate">{frontData.title || "Job Title"}</p>
                  {frontData.company && <p className="text-xs font-semibold mt-1.5" style={{ color: frontColors.accent }}>{frontData.company}</p>}
                </div>
                {logo && <img src={logo} alt="" className="w-12 h-12 object-contain rounded-lg shrink-0" />}
              </div>
              <div>
                {frontData.tagline && <p className="text-[10px] opacity-50 italic">{frontData.tagline}</p>}
                <div className="w-10 h-[2px] mt-2 rounded-full" style={{ backgroundColor: frontColors.accent }} />
              </div>
            </div>
          );
      }
    };

    return (
      <div
        ref={isRef ? frontRef : undefined}
        className="w-[400px] h-[230px] rounded-xl shadow-2xl overflow-hidden relative"
        style={style}
      >
        {content()}
      </div>
    );
  };

  const renderBack = (isRef = false) => {
    const style = { ...getBgStyle(backColors), color: backColors.text, fontFamily: font.family };
    const logo = showBackLogo && backLogo ? backLogo : null;

    const contactItems = [
      { icon: "✉", label: "Email", value: backData.email },
      { icon: "☎", label: "Phone", value: backData.phone },
      { icon: "🌐", label: "Web", value: backData.website },
      { icon: "📍", label: "Address", value: backData.address },
      { icon: "in", label: "LinkedIn", value: backData.linkedin },
      { icon: "𝕏", label: "Twitter", value: backData.twitter },
      { icon: "📷", label: "Instagram", value: backData.instagram },
      { icon: "💬", label: "WhatsApp", value: backData.whatsapp },
    ].filter(i => i.value);

    return (
      <div
        ref={isRef ? backRef : undefined}
        className="w-[400px] h-[230px] rounded-xl shadow-2xl overflow-hidden"
        style={style}
      >
        <div className="w-full h-full p-5 flex gap-3">
          {/* Contact info section */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="flex items-center justify-between">
              {logo && <img src={logo} alt="" className="w-9 h-9 object-contain rounded-lg opacity-70" />}
              {frontData.company && (
                <p className="text-sm font-bold tracking-wide truncate" style={{ color: backColors.accent }}>
                  {frontData.company}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              {contactItems.length > 0 ? contactItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-center shrink-0 text-[10px]" style={{ color: backColors.accent }}>{item.icon}</span>
                  <span className="truncate">{item.value}</span>
                </div>
              )) : (
                <p className="text-xs opacity-40 text-center py-4">Add contact details</p>
              )}
            </div>
            <div className="w-full h-[1px] rounded-full opacity-20" style={{ backgroundColor: backColors.accent }} />
          </div>

          {/* QR Code section */}
          {showQR && qrDataUrl && (
            <div className="flex flex-col items-center justify-center shrink-0">
              <img src={qrDataUrl} alt="QR Code" className="w-[90px] h-[90px] rounded-md" />
              <p className="text-[8px] opacity-40 mt-1">Scan for contact</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── SEO ─────────────────────────────────────────────────────────────────────

  const seoContent = {
    description: "Design professional double-sided business cards online for free. 500+ colors, gradient presets, custom logos, multiple layouts, and instant HD download.",
    content: `<h3>Professional Business Card Generator</h3><p>Create stunning double-sided business cards with our free online tool. Choose from 500+ colors, 24 gradient presets, 12 professional templates, and 5 unique layouts.</p><h3>Features</h3><ul><li>Separate front & back side customization</li><li>500+ color palette with gradient support</li><li>Independent logo upload for each side</li><li>5 professional layouts</li><li>Print-ready high-resolution PNG export</li></ul>`,
    keywords: ["business card generator", "business card maker online", "business card generator online", "business card builder free", "business card generator free", "online business card generator", "business card maker online free", "business card creator online", "business card generator online free", "business card creator online free", "online visiting card generator", "free business card maker", "professional business card", "double sided business card", "custom business card design", "print ready business card"],
    faqs: [
      { question: "Can I customize front and back separately?", answer: "Yes! Each side has its own data fields, colors, gradient settings, and optional logo." },
      { question: "How many colors are available?", answer: "Over 500 colors organized in 11 categories, plus 24 gradient presets." },
      { question: "Can I add a logo to both sides?", answer: "Yes, you can upload separate logos for front and back, and toggle them on/off independently." },
      { question: "What format are downloads?", answer: "Cards download as high-resolution PNG files suitable for professional printing." },
    ],
    aboutTool: "Our Business Card Generator helps you create professional double-sided cards with 500+ colors, gradient presets, independent logos, and multiple layouts.",
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── Editor ─────────────────────────────────────────── */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5" /> Card Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="front" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="front" className="text-xs">Front</TabsTrigger>
                <TabsTrigger value="back" className="text-xs">Back</TabsTrigger>
                <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
                <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
                <TabsTrigger value="logo" className="text-xs">Logo</TabsTrigger>
              </TabsList>

              {/* ── Front Info ── */}
              <TabsContent value="front" className="space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Front Side Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Full Name *</Label><Input placeholder="John Doe" value={frontData.name} onChange={e => setFrontData(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Job Title *</Label><Input placeholder="Software Engineer" value={frontData.title} onChange={e => setFrontData(p => ({ ...p, title: e.target.value }))} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Company</Label><Input placeholder="Acme Inc." value={frontData.company} onChange={e => setFrontData(p => ({ ...p, company: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Tagline</Label><Input placeholder="Building the future..." value={frontData.tagline} onChange={e => setFrontData(p => ({ ...p, tagline: e.target.value }))} className="h-9 text-sm" /></div>
                </div>
              </TabsContent>

              {/* ── Back Info ── */}
              <TabsContent value="back" className="space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5"><RotateCw className="w-3.5 h-3.5" /> Back Side Contact Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Email</Label><Input placeholder="john@example.com" value={backData.email} onChange={e => setBackData(p => ({ ...p, email: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Phone</Label><Input placeholder="+1 234 567 890" value={backData.phone} onChange={e => setBackData(p => ({ ...p, phone: e.target.value }))} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Website</Label><Input placeholder="www.example.com" value={backData.website} onChange={e => setBackData(p => ({ ...p, website: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Address</Label><Input placeholder="123 Main St, City" value={backData.address} onChange={e => setBackData(p => ({ ...p, address: e.target.value }))} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">LinkedIn</Label><Input placeholder="linkedin.com/in/john" value={backData.linkedin} onChange={e => setBackData(p => ({ ...p, linkedin: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">Twitter / X</Label><Input placeholder="@johndoe" value={backData.twitter} onChange={e => setBackData(p => ({ ...p, twitter: e.target.value }))} className="h-9 text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Instagram</Label><Input placeholder="@john.doe" value={backData.instagram} onChange={e => setBackData(p => ({ ...p, instagram: e.target.value }))} className="h-9 text-sm" /></div>
                  <div><Label className="text-xs">WhatsApp</Label><Input placeholder="+1 234 567 890" value={backData.whatsapp} onChange={e => setBackData(p => ({ ...p, whatsapp: e.target.value }))} className="h-9 text-sm" /></div>
                </div>

                {/* QR Code Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border mt-2">
                  <Label className="text-xs cursor-pointer flex items-center gap-2"><QrCode className="w-3.5 h-3.5" /> Show QR Code on Back</Label>
                  <Switch checked={showQR} onCheckedChange={setShowQR} />
                </div>
                {showQR && (
                  <p className="text-[10px] text-muted-foreground">QR code auto-generates vCard from your contact info. Scannable by any phone camera.</p>
                )}
              </TabsContent>

              {/* ── Design ── */}
              <TabsContent value="design" className="space-y-4 animate-fade-in">
                <div>
                  <Label className="flex items-center gap-2 mb-3 text-xs"><Palette className="w-4 h-4" /> Templates</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        className="h-12 rounded-lg border-2 transition-all flex items-center justify-center border-transparent hover:border-primary/40 hover:scale-[1.03]"
                        style={t.front.useGradient ? { background: `linear-gradient(135deg, ${t.front.bg1}, ${t.front.bg2})` } : { backgroundColor: t.front.bg1 }}
                        onClick={() => applyTemplate(t)}
                      >
                        <span className="text-[10px] font-medium px-1 drop-shadow-sm" style={{ color: t.front.text }}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-xs"><Type className="w-4 h-4" /> Font</Label>
                  <Select value={font.id} onValueChange={v => setFont(fontOptions.find(f => f.id === v) || fontOptions[0])}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(f => <SelectItem key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2 text-xs"><Sparkles className="w-4 h-4" /> Layout</Label>
                  <div className="grid grid-cols-3 gap-2">
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

              {/* ── Colors ── */}
              <TabsContent value="colors" className="space-y-4 animate-fade-in max-h-[500px] overflow-y-auto pr-1">
                {/* Side selector for colors */}
                {["front", "back"].map(side => {
                  const sc = side === "front" ? frontColors : backColors;
                  const setSc = side === "front" ? setFrontColors : setBackColors;
                  return (
                    <div key={side} className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{side === "front" ? "🎨 Front Side" : "🔄 Back Side"}</p>

                      {/* Gradient toggle */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                        <Label className="text-xs cursor-pointer flex items-center gap-2"><Paintbrush className="w-3.5 h-3.5" />Gradient</Label>
                        <Switch checked={sc.useGradient} onCheckedChange={v => setSc(p => ({ ...p, useGradient: v }))} />
                      </div>

                      {sc.useGradient && (
                        <div>
                          <Label className="text-xs">Angle: {sc.gradientAngle}°</Label>
                          <Slider
                            min={0} max={360} step={5}
                            value={[sc.gradientAngle]}
                            onValueChange={([v]) => setSc(p => ({ ...p, gradientAngle: v }))}
                            className="mt-1"
                          />
                        </div>
                      )}

                      {/* Quick color pickers */}
                      <div className="grid grid-cols-2 gap-2">
                        <ColorPicker label={sc.useGradient ? "BG 1" : "Background"} value={sc.bg1} onChange={v => setSc(p => ({ ...p, bg1: v }))} />
                        {sc.useGradient && <ColorPicker label="BG 2" value={sc.bg2} onChange={v => setSc(p => ({ ...p, bg2: v }))} />}
                        <ColorPicker label="Text" value={sc.text} onChange={v => setSc(p => ({ ...p, text: v }))} />
                        <ColorPicker label="Accent" value={sc.accent} onChange={v => setSc(p => ({ ...p, accent: v }))} />
                      </div>

                      {/* Gradient presets */}
                      {sc.useGradient && (
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1.5">Gradient Presets</p>
                          <div className="flex flex-wrap gap-1.5">
                            {gradientPresets.map(gp => (
                              <button
                                key={gp.name}
                                className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform"
                                style={{ background: `linear-gradient(135deg, ${gp.from}, ${gp.to})` }}
                                title={gp.name}
                                onClick={() => applyGradientPreset(gp, side as "front" | "back")}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Full Color Palette */}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-semibold mb-2">🎨 Color Palette (500+)</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {colorCategories.map((cat, i) => (
                      <button
                        key={cat.name}
                        className={`text-[9px] px-2 py-1 rounded-full border transition-all ${activeColorCategory === i ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground/50"}`}
                        onClick={() => setActiveColorCategory(i)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {colorCategories[activeColorCategory].colors.map((color, i) => (
                      <button
                        key={i}
                        className="w-6 h-6 rounded border border-border/50 hover:scale-125 transition-transform cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                        onClick={() => {
                          navigator.clipboard.writeText(color);
                          toast.success(`Copied ${color}`);
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">Click to copy, then paste in color picker above</p>
                </div>
              </TabsContent>

              {/* ── Logo ── */}
              <TabsContent value="logo" className="space-y-4 animate-fade-in">
                {/* Front Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Front Side Logo</Label>
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] text-muted-foreground">Show</Label>
                      <Switch checked={showFrontLogo} onCheckedChange={setShowFrontLogo} />
                    </div>
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/20">
                    {frontLogo ? (
                      <img src={frontLogo} alt="" className="w-14 h-14 object-contain rounded" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                        <p className="text-[10px] text-muted-foreground">Upload front logo</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload("front")} className="hidden" />
                  </label>
                  {frontLogo && (
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => setFrontLogo(null)}>
                      <X className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                {/* Back Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Back Side Logo</Label>
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] text-muted-foreground">Show</Label>
                      <Switch checked={showBackLogo} onCheckedChange={setShowBackLogo} />
                    </div>
                  </div>
                  <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/20">
                    {backLogo ? (
                      <img src={backLogo} alt="" className="w-14 h-14 object-contain rounded" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                        <p className="text-[10px] text-muted-foreground">Upload back logo</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload("back")} className="hidden" />
                  </label>
                  {backLogo && (
                    <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => setBackLogo(null)}>
                      <X className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground text-center">Logos are optional. Toggle show/hide independently for each side.</p>
              </TabsContent>
            </Tabs>

            {/* Download buttons */}
            <div className="flex gap-2 mt-5">
              <Button className="flex-1 h-9" onClick={() => downloadCard("front")} size="sm">
                <Download className="w-4 h-4 mr-1" /> Front
              </Button>
              <Button className="flex-1 h-9" onClick={() => downloadCard("back")} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button className="flex-1 h-9" onClick={() => downloadCard("both")} variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-1" /> Both
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ─── Preview ────────────────────────────────────────── */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2"><Eye className="w-5 h-5" /> Preview</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowBack(!showBack)} className="gap-1.5">
                  <RotateCw className={`w-4 h-4 transition-transform duration-500 ${showBack ? "rotate-180" : ""}`} />
                  {showBack ? "Front" : "Back"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div className="relative w-[400px] h-[230px]" style={{ perspective: "1000px" }}>
                <div
                  className="absolute inset-0 transition-all duration-600 ease-in-out"
                  style={{
                    opacity: showBack ? 0 : 1,
                    transform: showBack ? "rotateY(90deg) scale(0.95)" : "rotateY(0deg) scale(1)",
                    pointerEvents: showBack ? "none" : "auto",
                  }}
                >
                  {renderFront()}
                </div>
                <div
                  className="absolute inset-0 transition-all duration-600 ease-in-out"
                  style={{
                    opacity: showBack ? 1 : 0,
                    transform: showBack ? "rotateY(0deg) scale(1)" : "rotateY(-90deg) scale(0.95)",
                    pointerEvents: showBack ? "auto" : "none",
                  }}
                >
                  {renderBack()}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium transition-colors ${!showBack ? "text-primary" : "text-muted-foreground"}`}>Front</span>
                <div className="flex gap-1.5">
                  <div className={`w-2 h-2 rounded-full transition-colors ${!showBack ? "bg-primary" : "bg-muted"}`} />
                  <div className={`w-2 h-2 rounded-full transition-colors ${showBack ? "bg-primary" : "bg-muted"}`} />
                </div>
                <span className={`text-xs font-medium transition-colors ${showBack ? "text-primary" : "text-muted-foreground"}`}>Back</span>
              </div>
            </CardContent>
          </Card>

          {/* Hidden refs for html2canvas download */}
          <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden="true">
            {renderFront(true)}
            {renderBack(true)}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

// ─── Color Picker Component ──────────────────────────────────────────────────

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-md border border-border/50 bg-muted/20">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
      />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
        <Input
          value={value}
          onChange={e => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="h-5 text-[10px] font-mono border-0 bg-transparent p-0 focus-visible:ring-0 w-16"
        />
      </div>
    </div>
  );
}
