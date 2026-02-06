import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Download, Trash2, Settings, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface CompressedImage {
  originalFile: File;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
}

export default function ImageCompressorPage() {
  const tool = getToolById("image-compressor")!;
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState([80]);
  const [maxWidth, setMaxWidth] = useState([1920]);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const calculateSavings = (original: number, compressed: number) => {
    const savings = ((original - compressed) / original) * 100;
    return savings.toFixed(1);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    toast.info(`Processing ${files.length} image(s)...`);

    try {
      const newImages: CompressedImage[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxWidth[0],
          useWebWorker: true,
          initialQuality: quality[0] / 100,
        };

        const compressedFile = await imageCompression(file, options);
        
        newImages.push({
          originalFile: file,
          compressedFile,
          originalSize: file.size,
          compressedSize: compressedFile.size,
          originalUrl: URL.createObjectURL(file),
          compressedUrl: URL.createObjectURL(compressedFile),
        });
      }

      setImages(prev => [...prev, ...newImages]);
      toast.success(`Successfully compressed ${newImages.length} image(s)!`);
    } catch (error) {
      toast.error("Failed to compress some images");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  }, [quality, maxWidth]);

  const handleDownload = (image: CompressedImage) => {
    const link = document.createElement("a");
    link.href = image.compressedUrl;
    link.download = `compressed-${image.originalFile.name}`;
    link.click();
  };

  const handleDownloadAll = () => {
    images.forEach(handleDownload);
    toast.success("All images downloaded!");
  };

  const handleRemove = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].originalUrl);
      URL.revokeObjectURL(newImages[index].compressedUrl);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleClear = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
  };

  const totalOriginal = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressed = images.reduce((acc, img) => acc + img.compressedSize, 0);

  const seoContent = {
    description: "Compress images without losing quality. Reduce file sizes by up to 80% for faster website loading. All processing happens in your browser.",
    content: `
      <h3>Fast, Secure Image Compression</h3>
      <p>Large image files slow down websites and consume storage space. Our browser-based image compressor reduces file sizes dramatically while maintaining visual quality. Perfect for web developers, bloggers, and anyone who needs optimized images.</p>
      
      <h4>How Image Compression Works</h4>
      <p>Modern compression algorithms analyze images and remove redundant data while preserving visual quality. Our tool uses advanced encoding techniques that can reduce file sizes by 50-80% with minimal visible quality loss.</p>
      
      <h4>Why Compress Images for Web?</h4>
      <p>Website loading speed directly impacts user experience and SEO rankings. A page that loads in 2 seconds has an average bounce rate of 9%, while a page that loads in 5 seconds sees bounce rates of 38%. Optimized images are key to fast loading.</p>
      
      <h4>Supported Formats</h4>
      <p>Our compressor works with all common image formats including JPEG, PNG, and WebP. JPEG compression is lossy but achieves the best file size reduction. PNG compression is lossless, preserving transparency and exact colors.</p>
      
      <h4>Complete Privacy</h4>
      <p>Unlike cloud-based compressors, your images never leave your browser. Processing happens entirely on your device using WebAssembly technology. This ensures complete privacy for sensitive images.</p>
    `,
    keywords: [
      "Image Compressor Online",
      "Compress Images Free",
      "JPEG Compression Tool",
      "PNG Compressor",
      "Reduce Image Size",
      "Photo Optimizer",
      "Web Image Optimization",
      "Bulk Image Compressor",
      "Lossless Compression",
      "Image Size Reducer"
    ],
    faqs: [
      {
        question: "Will compressing images reduce their quality?",
        answer: "Our default settings maintain excellent visual quality while significantly reducing file size. At 80% quality, most viewers cannot distinguish between the original and compressed image. You can adjust the quality slider based on your needs."
      },
      {
        question: "What image formats are supported?",
        answer: "The compressor supports JPEG, PNG, GIF, BMP, and WebP formats. For best results with photos, JPEG compression typically achieves the highest size reduction while maintaining quality."
      },
      {
        question: "Are my images uploaded to a server?",
        answer: "No. All image processing happens locally in your browser using JavaScript and WebAssembly. Your images never leave your device, ensuring complete privacy and security."
      },
      {
        question: "Can I compress multiple images at once?",
        answer: "Yes! Simply select multiple files when uploading, or drag and drop multiple images. All selected images will be processed with your chosen settings."
      },
      {
        question: "What's the maximum file size I can compress?",
        answer: "You can compress images up to 50MB. However, for best performance, we recommend images under 20MB. Larger files may take longer to process depending on your device."
      },
      {
        question: "How much can I reduce image file sizes?",
        answer: "Typical compression achieves 40-80% size reduction depending on the image content and quality settings. Photos usually compress better than graphics with sharp edges or text."
      }
    ],
    aboutTool: "The ToolSuiteX Image Compressor is a powerful browser-based tool for reducing image file sizes without sacrificing quality. Using advanced compression algorithms, it can reduce image sizes by up to 80% while maintaining visual fidelity. Perfect for web developers, content creators, and anyone who needs optimized images. All processing happens locally in your browser, ensuring complete privacy of your images."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Settings Panel */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Compression Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Quality</label>
                <span className="text-sm text-muted-foreground">{quality[0]}%</span>
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Higher quality = larger file size. 80% is recommended for web.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Max Width</label>
                <span className="text-sm text-muted-foreground">{maxWidth[0]}px</span>
              </div>
              <Slider
                value={maxWidth}
                onValueChange={setMaxWidth}
                min={320}
                max={4096}
                step={64}
              />
              <p className="text-xs text-muted-foreground">
                Images wider than this will be resized down.
              </p>
            </div>
          </div>
        </Card>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          <div className={`glass-card p-12 text-center border-2 border-dashed transition-colors ${
            isProcessing ? "border-primary" : "border-border hover:border-primary"
          }`}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FileImage className="w-8 h-8 text-primary" />
                </motion.div>
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isProcessing ? "Processing..." : "Drop images here or click to upload"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Supports JPEG, PNG, GIF, WebP • Max 50MB per image
            </p>
          </div>
        </motion.div>

        {/* Results Summary */}
        {images.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Original</p>
                  <p className="text-lg font-semibold">{formatSize(totalOriginal)}</p>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Compressed</p>
                  <p className="text-lg font-semibold text-primary">{formatSize(totalCompressed)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-lg font-semibold text-green-500">
                    {calculateSavings(totalOriginal, totalCompressed)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleDownloadAll} variant="default">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button onClick={handleClear} variant="outline">
                  Clear All
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Image Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={image.compressedUrl}
                    alt="Compressed"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium truncate mb-2">{image.originalFile.name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{formatSize(image.originalSize)}</span>
                      <span className="mx-2">→</span>
                      <span className="text-primary font-medium">{formatSize(image.compressedSize)}</span>
                    </div>
                    <span className="text-green-500 font-medium">
                      -{calculateSavings(image.originalSize, image.compressedSize)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" onClick={() => handleDownload(image)} className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleRemove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
