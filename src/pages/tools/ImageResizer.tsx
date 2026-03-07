import { useState, useRef } from "react";
import { Crop, Download, RotateCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("image-resizer")!;

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(parseInt(newWidth || "0") * ratio).toString());
    }
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(parseInt(newHeight || "0") * ratio).toString());
    }
  };

  const handleResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newWidth = parseInt(width) || originalDimensions.width;
    const newHeight = parseInt(height) || originalDimensions.height;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `resized-${fileName}`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success("Image resized and downloaded!");
        }
      }, "image/png");
    };
    img.src = image;
  };

  const seoContent = {
    description: "Resize images to exact dimensions or scale by percentage while maintaining aspect ratio.",
    content: `
      <h3>Easy Image Resizing</h3>
      <p>Our Image Resizer tool allows you to quickly resize any image to your desired dimensions. Whether you need to resize for social media, email, or web optimization, we've got you covered.</p>
      
      <h3>Maintain Aspect Ratio</h3>
      <p>Enable the aspect ratio lock to ensure your images don't become stretched or distorted. When you change one dimension, the other automatically adjusts to maintain the original proportions.</p>
      
      <h3>Browser-Based Processing</h3>
      <p>All image processing happens directly in your browser. Your images are never uploaded to any server, ensuring complete privacy and instant results without waiting for uploads or downloads.</p>
      
      <h3>Supported Formats</h3>
      <p>Upload images in PNG, JPG, WEBP, GIF, and other common formats. Resized images are exported as PNG for maximum quality and compatibility.</p>
    `,
    keywords: ["image resizer", "resize image", "scale image", "image dimensions", "aspect ratio", "photo resizer", "resize photos online"],
    faqs: [
      {
        question: "Will resizing reduce image quality?",
        answer: "Enlarging images can reduce quality as the software must interpolate new pixels. Reducing size generally maintains quality. For best results, start with high-resolution source images.",
      },
      {
        question: "What's the maximum image size I can resize?",
        answer: "The limit depends on your browser's memory. Most modern browsers can handle images up to 4000x4000 pixels comfortably. Very large images may take longer to process.",
      },
      {
        question: "Can I resize multiple images at once?",
        answer: "Currently this tool processes one image at a time for optimal quality control. Upload and resize each image individually.",
      },
    ],
    aboutTool: "The Image Resizer tool lets you change image dimensions to exact pixel values while optionally maintaining the original aspect ratio. All processing happens in your browser - your images are never uploaded to any server, ensuring complete privacy.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            Image Resizer
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
              <p className="text-sm text-muted-foreground mt-2">PNG, JPG, WEBP supported</p>
            </label>
          </div>

          {image && (
            <>
              {/* Preview */}
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Uploaded image for resizing"
                  className="max-w-full max-h-64 object-contain rounded-lg border"
                />
              </div>

              {/* Original Dimensions */}
              <p className="text-center text-sm text-muted-foreground">
                Original: {originalDimensions.width} × {originalDimensions.height} pixels
              </p>

              {/* Resize Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Switch
                    id="aspect-ratio"
                    checked={maintainAspectRatio}
                    onCheckedChange={setMaintainAspectRatio}
                  />
                  <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="space-y-1">
                    <Label>Width (px)</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <span className="text-2xl text-muted-foreground mt-6">×</span>
                  <div className="space-y-1">
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>

                <Button onClick={handleResize} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Resize & Download
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
