import { useState, useRef } from "react";
import { RotateCw, Download, Upload, FlipHorizontal, FlipVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";

const tool = getToolById("image-rotator")!;

export default function ImageRotator() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleDownload = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    canvas.width = img.width * cos + img.height * sin;
    canvas.height = img.width * sin + img.height * cos;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rotated-${fileName}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Image downloaded!");
      }
    }, "image/png");
  };

  const rotateBy = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const seoContent = {
    description: "Rotate images by any angle or flip horizontally and vertically with our free online tool.",
    content: `
      <h3>Rotate Images with Precision</h3>
      <p>Our Image Rotator tool allows you to rotate images to any angle. Use the slider for fine-tuned rotation or quick buttons for common 90-degree rotations.</p>
      
      <h3>Flip and Mirror</h3>
      <p>Flip your images horizontally or vertically with one click. Perfect for creating mirror effects, correcting orientation, or preparing images for specific layouts.</p>
      
      <h3>Live Preview</h3>
      <p>See your changes in real-time as you adjust the rotation and flip settings. This allows you to get the exact orientation you need before downloading.</p>
      
      <h3>Privacy First</h3>
      <p>All image processing happens in your browser. Your images are never uploaded to any server, ensuring complete privacy and instant results.</p>
    `,
    keywords: ["rotate image", "image rotator", "flip image", "mirror image", "image orientation", "rotate photo online"],
    faqs: [
      {
        question: "Can I rotate by specific degrees?",
        answer: "Yes! Use the rotation slider to set any angle from 0 to 360 degrees. For common rotations, use the 90° buttons for quick adjustments.",
      },
      {
        question: "Does rotation affect image quality?",
        answer: "Our tool uses high-quality image processing to minimize quality loss. For best results, work with high-resolution source images.",
      },
      {
        question: "What's the difference between flip and rotate?",
        answer: "Rotation turns the image around its center point. Flipping creates a mirror image - horizontal flip mirrors left/right, vertical flip mirrors top/bottom.",
      },
    ],
    aboutTool: "The Image Rotator & Flipper lets you rotate images by any angle and flip them horizontally or vertically. Features live preview and browser-based processing for complete privacy.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="w-5 h-5" />
            Image Rotator & Flipper
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
              <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                <img
                  src={image}
                  alt="Image being rotated and flipped"
                  className="max-w-full max-h-64 object-contain rounded"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Rotation Slider */}
                <div className="space-y-2">
                  <Label>Rotation: {rotation}°</Label>
                  <Slider
                    value={[rotation]}
                    onValueChange={(v) => setRotation(v[0])}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>

                {/* Quick Rotate Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => rotateBy(-90)}>
                    <RotateCw className="w-4 h-4 mr-2 scale-x-[-1]" />
                    Rotate Left 90°
                  </Button>
                  <Button variant="outline" onClick={() => rotateBy(90)}>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Rotate Right 90°
                  </Button>
                  <Button
                    variant={flipH ? "default" : "outline"}
                    onClick={() => setFlipH(!flipH)}
                  >
                    <FlipHorizontal className="w-4 h-4 mr-2" />
                    Flip Horizontal
                  </Button>
                  <Button
                    variant={flipV ? "default" : "outline"}
                    onClick={() => setFlipV(!flipV)}
                  >
                    <FlipVertical className="w-4 h-4 mr-2" />
                    Flip Vertical
                  </Button>
                </div>

                <Button onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Transformed Image
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
