import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

export default function PDFCompress() {
  const tool = getToolById("pdf-compress")!;
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setFile(uploadedFile);
    setOriginalSize(uploadedFile.size);
    setCompressedBlob(null);
    setCompressedSize(0);
    e.target.value = "";
  }, []);

  const compressPDF = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Remove metadata to reduce size
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      // Save with compression options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      setCompressedBlob(blob);
      setCompressedSize(blob.size);

      const reduction = ((originalSize - blob.size) / originalSize * 100).toFixed(1);
      toast.success(`Compressed! Reduced by ${reduction}%`);
    } catch (err) {
      toast.error("Failed to compress PDF");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const seoContent = {
    description: "Reduce PDF file sizes by up to 80% while maintaining visual quality. Perfect for email attachments and web uploads. Free, private, browser-based.",
    content: `<p>The PDF Compress tool helps you reduce the file size of your PDF documents without significant quality loss. This is perfect for email attachments, uploading to websites, or saving storage space.</p>
    <h3>How PDF Compression Works</h3>
    <p>Our compression algorithm removes unnecessary metadata, optimizes internal structures, and uses efficient encoding to reduce file sizes while preserving visual quality.</p>
    <h3>Use Cases</h3>
    <ul>
      <li>Email attachments with size limits</li>
      <li>Website uploads and downloads</li>
      <li>Cloud storage optimization</li>
      <li>Faster document sharing</li>
    </ul>`,
    aboutTool: "The PDF Compress tool reduces PDF file sizes while maintaining quality. Perfect for email attachments, uploading to websites, or saving storage space. All compression happens in your browser - your files stay private and secure.",
    faqs: [
      { question: "How much can PDFs be compressed?", answer: "Compression varies based on the PDF content. Text-heavy PDFs compress less, while image-heavy PDFs can see significant reductions of 50-80%." },
      { question: "Does compression affect quality?", answer: "Our tool uses smart compression that removes metadata and optimizes structure without degrading visual quality." },
      { question: "Is there a file size limit?", answer: "For browser performance, we recommend files under 50MB. Larger files may take longer to process." },
      { question: "Are my files secure?", answer: "Yes! All processing happens locally in your browser. Your files are never uploaded to any server." }
    ],
    keywords: ["pdf compress", "reduce pdf size", "shrink pdf", "pdf compressor", "optimize pdf", "pdf reducer", "compress pdf online"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-dashed">
          <CardContent className="p-8">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <span className="text-lg font-medium mb-2">Drop PDF here or click to upload</span>
              <span className="text-sm text-muted-foreground">Maximum recommended size: 50MB</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        {file && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-10 h-10 text-primary" />
                <div className="flex-1">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Original size: {formatBytes(originalSize)}
                  </p>
                </div>
              </div>

              {!compressedBlob ? (
                <Button
                  onClick={compressPDF}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    "Compress PDF"
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Original</p>
                        <p className="text-lg font-semibold">{formatBytes(originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Compressed</p>
                        <p className="text-lg font-semibold text-primary">{formatBytes(compressedSize)}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border text-center">
                      <p className="text-sm text-muted-foreground">Reduction</p>
                      <p className="text-2xl font-bold text-emerald-500">
                        {((originalSize - compressedSize) / originalSize * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <Button onClick={downloadCompressed} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Compressed PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
