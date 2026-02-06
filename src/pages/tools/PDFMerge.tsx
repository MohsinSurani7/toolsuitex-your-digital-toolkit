import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, GripVertical, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  pages: number;
}

export default function PDFMerge() {
  const tool = getToolById("pdf-merge")!;
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    for (const file of uploadedFiles) {
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPageCount();

        setFiles(prev => [...prev, {
          id: crypto.randomUUID(),
          file,
          name: file.name,
          pages
        }]);
      } catch {
        toast.error(`Failed to read ${file.name}`);
      }
    }
    
    e.target.value = "";
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);
    setFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-document.pdf";
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PDFs merged successfully!");
    } catch {
      toast.error("Failed to merge PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  const seoContent = {
    description: "Learn how to merge multiple PDF files into one document quickly and securely.",
    content: `<p>The PDF Merge tool allows you to combine multiple PDF documents into a single file with ease. Whether you're consolidating reports, combining chapters of a book, or organizing receipts, our tool makes the process simple and efficient.</p>
    <h3>How to Merge PDFs</h3>
    <ol>
      <li>Upload your PDF files by clicking or dragging them into the upload area</li>
      <li>Rearrange the order by dragging files up or down in the list</li>
      <li>Click "Merge & Download" to combine all PDFs into one document</li>
    </ol>
    <h3>Privacy & Security</h3>
    <p>Your files are processed entirely in your browser. No data is ever uploaded to our servers, ensuring complete privacy and security for sensitive documents.</p>`,
    aboutTool: "The PDF Merge tool allows you to combine multiple PDF documents into a single file. All processing happens in your browser - your files are never uploaded to any server, ensuring complete privacy. Simply drag and drop your PDFs, arrange them in your preferred order, and download the merged result.",
    faqs: [
      { question: "Is there a limit to how many PDFs I can merge?", answer: "There's no hard limit, but very large files may slow down your browser. We recommend keeping the total size under 100MB for best performance." },
      { question: "Are my files uploaded to a server?", answer: "No! All processing happens locally in your browser. Your files never leave your device." },
      { question: "Can I reorder the PDFs before merging?", answer: "Yes! Simply drag and drop the files in the list to arrange them in your preferred order." },
      { question: "What's the quality of the merged PDF?", answer: "The merged PDF maintains the original quality of all source documents with no compression or quality loss." }
    ],
    keywords: ["pdf merge", "combine pdf", "join pdf", "merge documents", "pdf combiner", "pdf joiner", "merge pdf online", "free pdf merger"]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-dashed">
          <CardContent className="p-8">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <span className="text-lg font-medium mb-2">Drop PDF files here or click to upload</span>
              <span className="text-sm text-muted-foreground">Select multiple PDFs to merge</span>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Files to Merge ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-move ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.pages} pages</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={mergePDFs}
                disabled={files.length < 2 || isProcessing}
                className="w-full mt-4"
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? "Merging..." : "Merge & Download PDF"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
}
