import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Download, Barcode } from "lucide-react";
import { toast } from "sonner";
import JsBarcode from "jsbarcode";

const barcodeFormats = [
  { id: "CODE128", name: "Code 128", description: "Alphanumeric, variable length" },
  { id: "CODE39", name: "Code 39", description: "Alphanumeric, uppercase only" },
  { id: "EAN13", name: "EAN-13", description: "13 digits, retail products" },
  { id: "EAN8", name: "EAN-8", description: "8 digits, small products" },
  { id: "UPC", name: "UPC-A", description: "12 digits, North America retail" },
  { id: "ITF14", name: "ITF-14", description: "14 digits, shipping containers" },
  { id: "pharmacode", name: "Pharmacode", description: "Pharmaceutical packaging" },
];

const tool = getToolById("barcode-generator")!;

export default function BarcodeGenerator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [showText, setShowText] = useState(true);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: format,
          displayValue: showText,
          width: width,
          height: height,
          lineColor: lineColor,
          background: background,
          margin: 10,
          fontSize: 16,
          font: "monospace",
        });
        setError(null);
      } catch (err) {
        setError("Invalid value for selected barcode format");
      }
    }
  }, [value, format, showText, width, height, lineColor, background]);

  const downloadBarcode = () => {
    if (!svgRef.current) return;
    
    // Create canvas from SVG
    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.scale(2, 2);
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement("a");
      link.download = `barcode-${format}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Barcode downloaded!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const getPlaceholder = () => {
    switch (format) {
      case "EAN13": return "Enter 12-13 digits";
      case "EAN8": return "Enter 7-8 digits";
      case "UPC": return "Enter 11-12 digits";
      case "ITF14": return "Enter 14 digits";
      case "CODE39": return "Uppercase letters & numbers";
      default: return "Enter barcode value";
    }
  };

  const seoContent = {
    description: "Generate barcodes in multiple formats. Code 128, EAN-13, UPC, Code 39 and more.",
    content: `<h3>Introduction</h3><p>Create professional barcodes for products, inventory, and shipping.</p><h3>Key Benefits</h3><ul><li>Multiple barcode formats</li><li>Customizable appearance</li><li>High-resolution PNG export</li><li>Instant preview</li></ul>`,
    keywords: ["barcode generator", "create barcode", "EAN barcode", "UPC code generator"],
    faqs: [
      { question: "Which format should I use?", answer: "EAN-13 for European retail, UPC for North America, Code 128 for general alphanumeric." },
      { question: "Can I use these commercially?", answer: "Yes, generated barcodes are free for any use." },
    ],
    aboutTool: "Our Barcode Generator creates scannable barcodes in all major formats.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Barcode className="w-5 h-5" />
              Barcode Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Barcode Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {barcodeFormats.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      <div>
                        <span className="font-medium">{f.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{f.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              <Input
                className="mt-1 font-mono"
                placeholder={getPlaceholder()}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Text</Label>
              <Switch checked={showText} onCheckedChange={setShowText} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bar Width</Label>
                <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} max={5} className="mt-1" />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={50} max={200} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Line Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="font-mono" />
                </div>
              </div>
              <div>
                <Label>Background</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={background} onChange={(e) => setBackground(e.target.value)} className="font-mono" />
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={downloadBarcode} disabled={!!error}>
              <Download className="w-4 h-4 mr-2" /> Download Barcode
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <svg ref={svgRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
