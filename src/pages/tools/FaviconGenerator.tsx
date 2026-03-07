import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

const FaviconGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [padding, setPadding] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const generateFavicon = async (size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      
      if (!ctx || !image) {
        reject(new Error("Canvas or image not available"));
        return;
      }

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);

      const img = new window.Image();
      img.onload = () => {
        const paddingPx = (size * padding) / 100;
        const availableSize = size - paddingPx * 2;
        
        // Calculate aspect ratio
        const scale = Math.min(availableSize / img.width, availableSize / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (size - width) / 2;
        const y = (size - height) / 2;
        
        ctx.drawImage(img, x, y, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate blob"));
        }, "image/png");
      };
      img.onerror = reject;
      img.src = image;
    });
  };

  const downloadSingleSize = async (size: number) => {
    try {
      const blob = await generateFavicon(size);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Error", description: "Failed to generate favicon", variant: "destructive" });
    }
  };

  const downloadAll = async () => {
    try {
      for (const size of sizes) {
        await downloadSingleSize(size);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      toast({ title: "Success!", description: `Downloaded ${sizes.length} favicon sizes` });
    } catch {
      toast({ title: "Error", description: "Failed to generate favicons", variant: "destructive" });
    }
  };

  const tool = getToolById("favicon-generator")!;

  const seoContent = {
    description: "Generate all favicon sizes from a single image. Create icons for browsers, PWAs, and mobile devices.",
    content: `<h3>Introduction to Favicons</h3><p>Generate all the favicon sizes your website needs from a single image. Our Favicon Generator creates icons for browsers, mobile devices, PWAs, and more - all processed locally in your browser.</p><h3>How to Use</h3><p>Upload your logo or icon image, adjust background color and padding as needed, preview the result and download individual sizes or all at once.</p><h3>Key Features</h3><ul><li>All required sizes (16x16 to 512x512)</li><li>Apple Touch Icon support</li><li>PWA icon generation</li><li>Custom background color</li></ul>`,
    keywords: ["favicon generator", "website icon", "favicon maker", "pwa icon", "apple touch icon"],
    faqs: [
      { question: "What sizes are generated?", answer: "We generate 16x16, 32x32, 48x48, 64x64, 128x128, 180x180 (Apple Touch), 192x192, and 512x512 (PWA) icons." },
      { question: "What image format should I use?", answer: "PNG or SVG work best. Use a square image for the best results across all sizes." }
    ],
    aboutTool: "Our Favicon Generator creates all the icon sizes your website needs from a single image. Everything runs in your browser for complete privacy."
  };

  const downloadICO = async () => {
    try {
      // Generate 16x16 and 32x32 for ICO
      const blob16 = await generateFavicon(16);
      const blob32 = await generateFavicon(32);
      
      // For simplicity, just download as PNG (true ICO requires binary manipulation)
      const url = URL.createObjectURL(blob32);
      const link = document.createElement("a");
      link.href = url;
      link.download = "favicon.ico";
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ 
        title: "Downloaded!", 
        description: "Note: For true .ico format, use a dedicated converter" 
      });
    } catch {
      toast({ title: "Error", description: "Failed to generate ICO", variant: "destructive" });
    }
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="space-y-6">
        {!image ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-8">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-2">Upload Image</span>
                <span className="text-sm text-muted-foreground">PNG, JPG, SVG recommended</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-square max-w-[200px] mx-auto rounded-lg border overflow-hidden" style={{ backgroundColor }}>
                      <img src={image} alt="Favicon source image preview" className="w-full h-full object-contain" style={{ padding: `${padding}%` }} />
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setImage(null)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Padding: {padding}%</Label>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={padding}
                        onChange={(e) => setPadding(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Generated Sizes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      onClick={() => downloadSingleSize(size)}
                      className="flex flex-col h-auto py-3"
                    >
                      <span className="text-lg font-bold">{size}x{size}</span>
                      <span className="text-xs text-muted-foreground">
                        {size === 180 ? "Apple Touch" : size === 192 ? "Android" : size === 512 ? "PWA" : "Favicon"}
                      </span>
                    </Button>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button onClick={downloadAll}>
                    <Download className="w-4 h-4 mr-2" />
                    Download All Sizes
                  </Button>
                  <Button variant="outline" onClick={downloadICO}>
                    <Image className="w-4 h-4 mr-2" />
                    Download as ICO
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default FaviconGenerator;
