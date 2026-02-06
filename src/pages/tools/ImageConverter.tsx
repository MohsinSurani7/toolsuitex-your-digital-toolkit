import { useState, useRef } from "react";
import { FileImage, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("image-converter")!;

type OutputFormat = "png" | "jpeg" | "webp";

const formats: { id: OutputFormat; name: string; mime: string }[] = [
  { id: "png", name: "PNG", mime: "image/png" },
  { id: "jpeg", name: "JPG/JPEG", mime: "image/jpeg" },
  { id: "webp", name: "WebP", mime: "image/webp" },
];

export default function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState(0.9);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split(".")[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Image uploaded!");
  };

  const handleConvert = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const format = formats.find((f) => f.id === outputFormat)!;
      const qualityValue = outputFormat === "png" ? undefined : quality;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${fileName}.${outputFormat}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Converted to ${format.name}!`);
          }
        },
        format.mime,
        qualityValue
      );
    };
    img.src = image;
  };

  const seoContent = {
    description: "Convert images between PNG, JPG, and WEBP formats directly in your browser.",
    content: `
      <h3>Browser-Based Image Conversion</h3>
      <p>Convert your images between popular formats without uploading them to any server. Our Image Format Converter works entirely in your browser, ensuring your images remain private and secure.</p>
      
      <h3>Supported Formats</h3>
      <p>Convert to and from PNG (lossless compression), JPG/JPEG (lossy compression ideal for photographs), and WebP (modern format with excellent compression). Each format has its advantages depending on your use case.</p>
      
      <h3>Quality Control</h3>
      <p>For JPG and WebP formats, adjust the quality slider to balance file size and image quality. Higher quality means larger files but better-looking images.</p>
      
      <h3>When to Use Each Format</h3>
      <p>Use PNG for images with transparency or when lossless quality is needed. Use JPG for photographs and complex images. Use WebP for web optimization with smaller file sizes.</p>
    `,
    keywords: ["image converter", "convert png to jpg", "convert jpg to webp", "webp converter", "image format", "photo converter"],
    faqs: [
      {
        question: "Which format should I use for web images?",
        answer: "WebP offers the best compression for web images, with 25-35% smaller files than JPG at similar quality. Most modern browsers support WebP. Use PNG only when you need transparency.",
      },
      {
        question: "Does converting formats affect image quality?",
        answer: "Converting to PNG preserves quality as it's lossless. Converting to JPG or WebP may reduce quality slightly, but you can control this with the quality setting.",
      },
      {
        question: "Can I convert animated GIFs?",
        answer: "This tool is designed for static images. Animated GIFs will be converted as a single frame. For animated image conversion, specialized tools are recommended.",
      },
    ],
    aboutTool: "The Image Format Converter transforms images between PNG, JPG, and WebP formats. All conversion happens in your browser for complete privacy. Adjust quality settings for JPG and WebP to optimize file size.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Image Format Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload */}
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{fileName || "Click to upload an image"}</p>
              <p className="text-sm text-muted-foreground mt-2">Any image format supported</p>
            </label>
          </div>

          {image && (
            <>
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-64 object-contain rounded-lg border"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select
                    value={outputFormat}
                    onValueChange={(v) => setOutputFormat(v as OutputFormat)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {outputFormat !== "png" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Quality: {Math.round(quality * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <Button onClick={handleConvert} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Convert & Download
                </Button>
              </div>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
