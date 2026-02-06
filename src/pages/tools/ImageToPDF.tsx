import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, GripVertical, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  preview: string;
}

export default function ImageToPDF() {
  const tool = getToolById("image-to-pdf")!;
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "fit">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    for (const file of uploadedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      setImages(prev => [...prev, {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        preview
      }]);
    }
    
    e.target.value = "";
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsProcessing(true);

    try {
      const pdf = new jsPDF({
        orientation: orientation,
        unit: "mm",
        format: pageSize === "fit" ? "a4" : pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();

        const img = images[i];
        const imgElement = new Image();
        imgElement.src = img.preview;

        await new Promise<void>((resolve, reject) => {
          imgElement.onload = () => {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgRatio = imgElement.width / imgElement.height;
            const pageRatio = pageWidth / pageHeight;

            let imgWidth: number, imgHeight: number, x: number, y: number;

            if (pageSize === "fit") {
              // Fit image to page
              if (imgRatio > pageRatio) {
                imgWidth = pageWidth - 20;
                imgHeight = imgWidth / imgRatio;
              } else {
                imgHeight = pageHeight - 20;
                imgWidth = imgHeight * imgRatio;
              }
            } else {
              // Center image on page
              const maxWidth = pageWidth - 20;
              const maxHeight = pageHeight - 20;

              if (imgRatio > maxWidth / maxHeight) {
                imgWidth = maxWidth;
                imgHeight = imgWidth / imgRatio;
              } else {
                imgHeight = maxHeight;
                imgWidth = imgHeight * imgRatio;
              }
            }

            x = (pageWidth - imgWidth) / 2;
            y = (pageHeight - imgHeight) / 2;

            pdf.addImage(imgElement, "JPEG", x, y, imgWidth, imgHeight);
            resolve();
          };
          imgElement.onerror = reject;
        });
      }

      pdf.save("images-to-pdf.pdf");
      toast.success("PDF created successfully!");
    } catch (err) {
      toast.error("Failed to create PDF");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const seoContent = {
    description: "Convert your images to PDF documents with customizable page sizes and orientations.",
    content: `<p>Convert images to PDF with our free online tool. Combine multiple images into a single PDF document, perfect for creating photo albums, presentations, or document archives.</p>
    <h3>Supported Formats</h3>
    <p>Our tool supports all common image formats including JPG, PNG, WEBP, GIF, and BMP. Simply upload your images and convert them to a professional PDF document.</p>
    <h3>Page Options</h3>
    <ul>
      <li><strong>A4:</strong> Standard document size</li>
      <li><strong>Letter:</strong> US letter size</li>
      <li><strong>Fit to Image:</strong> Adapts page size to each image</li>
    </ul>`,
    aboutTool: "Convert images to PDF with our free online tool. Combine multiple images into a single PDF document, perfect for creating photo albums, presentations, or document archives. Supports JPG, PNG, WEBP, and more. All processing happens in your browser for complete privacy.",
    faqs: [
      { question: "What image formats are supported?", answer: "We support all common image formats including JPG, PNG, WEBP, GIF, and BMP." },
      { question: "Can I reorder images before converting?", answer: "Yes! Simply drag and drop images in the list to arrange them in your preferred order." },
      { question: "What page sizes are available?", answer: "You can choose between A4, Letter, or 'Fit to Image' which adapts the page size to each image." },
      { question: "Is there a limit to how many images I can convert?", answer: "There's no hard limit, but for best performance, we recommend keeping the total under 50 images." }
    ],
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert images", "photo to pdf", "picture to pdf", "images to pdf converter"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-dashed">
          <CardContent className="p-8">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <span className="text-lg font-medium mb-2">Drop images here or click to upload</span>
              <span className="text-sm text-muted-foreground">JPG, PNG, WEBP, GIF supported</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Page Size</label>
                    <Select value={pageSize} onValueChange={(v) => setPageSize(v as typeof pageSize)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="fit">Fit to Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Orientation</label>
                    <Select value={orientation} onValueChange={(v) => setOrientation(v as typeof orientation)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Images ({images.length})</h3>
                <div className="space-y-2">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-move ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                    >
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{image.name}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={convertToPDF}
                  disabled={isProcessing}
                  className="w-full mt-4"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Convert to PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
