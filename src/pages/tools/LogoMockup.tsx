import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Image, Upload } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const mockups = [
  { id: "tshirt", name: "T-Shirt", bg: "bg-gray-200", area: "w-32 h-32 top-1/3 left-1/2 -translate-x-1/2" },
  { id: "mug", name: "Coffee Mug", bg: "bg-amber-100", area: "w-24 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "phone", name: "Phone Case", bg: "bg-slate-800", area: "w-20 h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "bag", name: "Tote Bag", bg: "bg-amber-200", area: "w-28 h-28 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { id: "cap", name: "Baseball Cap", bg: "bg-blue-900", area: "w-20 h-16 top-1/3 left-1/2 -translate-x-1/2" },
  { id: "billboard", name: "Billboard", bg: "bg-sky-300", area: "w-48 h-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
];

const tool = getToolById("logo-mockup")!;

export default function LogoMockup() {
  const mockupRef = useRef<HTMLDivElement>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedMockup, setSelectedMockup] = useState(mockups[0]);
  const [scale, setScale] = useState([100]);
  const [opacity, setOpacity] = useState([100]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const downloadMockup = async () => {
    if (!mockupRef.current) return;
    try {
      const canvas = await html2canvas(mockupRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = `logo-mockup-${selectedMockup.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Mockup downloaded!");
    } catch {
      toast.error("Failed to download mockup");
    }
  };

  const seoContent = {
    description: "Preview your logo on realistic product mockups. T-shirts, mugs, phone cases and more.",
    content: `<h3>Introduction</h3><p>See how your logo looks on real-world products before printing.</p><h3>Key Benefits</h3><ul><li>Multiple mockup templates</li><li>Adjustable size and opacity</li><li>High-resolution downloads</li><li>No design skills needed</li></ul>`,
    keywords: ["logo mockup", "mockup generator", "product mockup", "brand mockup"],
    faqs: [
      { question: "What file types can I upload?", answer: "PNG, JPG, SVG, and other common image formats." },
      { question: "Can I use these for commercial purposes?", answer: "Yes, download and use for any purpose." },
    ],
    aboutTool: "Our Logo Mockup Generator helps you visualize your brand on products.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Mockup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Upload Logo</Label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload logo</span>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            <div>
              <Label>Select Mockup</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {mockups.map((m) => (
                  <button
                    key={m.id}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${selectedMockup.id === m.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                    onClick={() => setSelectedMockup(m)}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Logo Size: {scale[0]}%</Label>
              <Slider value={scale} onValueChange={setScale} min={20} max={200} step={5} className="mt-2" />
            </div>

            <div>
              <Label>Logo Opacity: {opacity[0]}%</Label>
              <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={5} className="mt-2" />
            </div>

            <Button className="w-full" onClick={downloadMockup} disabled={!logo}>
              <Download className="w-4 h-4 mr-2" /> Download Mockup
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div
              ref={mockupRef}
              className={`relative w-80 h-80 rounded-2xl ${selectedMockup.bg} flex items-center justify-center overflow-hidden shadow-xl`}
            >
              {/* Mockup shape overlay */}
              {selectedMockup.id === "tshirt" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-56 bg-white rounded-t-3xl relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-gray-200 rounded-b-full" />
                  </div>
                </div>
              )}
              {selectedMockup.id === "mug" && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-16 border-4 border-gray-400 rounded-r-full" />
                </div>
              )}

              {/* Logo placement */}
              {logo && (
                <div className={`absolute ${selectedMockup.area} flex items-center justify-center`}>
                  <img
                    src={logo}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${scale[0] / 100})`, opacity: opacity[0] / 100 }}
                  />
                </div>
              )}

              {!logo && (
                <span className="text-gray-500 text-sm z-10">Upload a logo to preview</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
