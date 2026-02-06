import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Scissors, Download, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";
import { PDFDocument } from "pdf-lib";

const PDFSplit = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [splitRange, setSplitRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      toast({ title: "Error", description: "Please upload a valid PDF file", variant: "destructive" });
      return;
    }

    try {
      const bytes = new Uint8Array(await uploadedFile.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPageCount();
      
      setFile(uploadedFile);
      setPdfBytes(bytes);
      setTotalPages(pages);
      setSplitRange(`1-${pages}`);
      
      toast({ title: "PDF Loaded", description: `${pages} pages detected` });
    } catch {
      toast({ title: "Error", description: "Failed to load PDF", variant: "destructive" });
    }
  }, [toast]);

  const parseRange = (range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(",").map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages && !pages.includes(i)) {
            pages.push(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (num >= 1 && num <= totalPages && !pages.includes(num)) {
          pages.push(num);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!pdfBytes) return;

    setIsProcessing(true);
    try {
      const pages = parseRange(splitRange);
      if (pages.length === 0) {
        toast({ title: "Error", description: "Invalid page range", variant: "destructive" });
        return;
      }

      const sourcePdf = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const copiedPages = await newPdf.copyPages(sourcePdf, pages.map(p => p - 1));
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const newPdfBytes = await newPdf.save();
      
      const blob = new Blob([newPdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `split_${file?.name || "document.pdf"}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "Success!", description: `Extracted ${pages.length} pages` });
    } catch {
      toast({ title: "Error", description: "Failed to split PDF", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const splitByPage = async () => {
    if (!pdfBytes) return;

    setIsProcessing(true);
    try {
      const sourcePdf = await PDFDocument.load(pdfBytes);
      
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(sourcePdf, [i]);
        newPdf.addPage(page);
        
        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `page_${i + 1}_${file?.name || "document.pdf"}`;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      toast({ title: "Success!", description: `Split into ${totalPages} individual files` });
    } catch {
      toast({ title: "Error", description: "Failed to split PDF", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const tool = getToolById("pdf-split")!;

  const seoContent = {
    description: "Split PDF documents into individual pages or extract specific page ranges. Free, no uploads to servers.",
    content: `<h3>Introduction to PDF Splitting</h3><p>Split PDF documents into individual pages or extract specific page ranges with our free online PDF Splitter. No file uploads to servers - everything runs in your browser for complete privacy.</p><h3>How to Use</h3><p>Upload your PDF file, enter the page range you want to extract (e.g., 1-3, 5, 7-10), and click 'Extract Pages' to download the selected pages as a new PDF. Or click 'Split All Pages' to download each page as a separate file.</p><h3>Key Features</h3><ul><li>Extract specific page ranges</li><li>Split into individual page files</li><li>Client-side processing</li><li>No file size limits</li></ul>`,
    keywords: ["pdf split", "extract pdf pages", "split pdf online", "pdf page extractor", "separate pdf pages"],
    faqs: [
      { question: "Is my PDF uploaded to any server?", answer: "No, all processing happens in your browser. Your files never leave your device." },
      { question: "What's the maximum file size?", answer: "Since processing is done locally, size is limited by your browser's memory. Most PDFs work fine." }
    ],
    aboutTool: "Our PDF Splitter lets you extract specific pages or split a PDF into individual page files. All processing happens locally in your browser for complete privacy and security."
  };

  const clearFile = () => {
    setFile(null);
    setPdfBytes(null);
    setTotalPages(0);
    setSplitRange("");
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}
    >
      <div className="space-y-6">
        {!file ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-8">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <span className="text-lg font-medium mb-2">Upload PDF File</span>
                <span className="text-sm text-muted-foreground">Click to select or drag and drop</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{totalPages} pages</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Page Range</Label>
                <Input
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  placeholder="e.g., 1-3, 5, 7-10"
                />
                <p className="text-xs text-muted-foreground">
                  Enter page numbers or ranges separated by commas
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={splitPDF} disabled={isProcessing}>
                  <Scissors className="w-4 h-4 mr-2" />
                  Extract Pages
                </Button>
                <Button variant="outline" onClick={splitByPage} disabled={isProcessing}>
                  <Download className="w-4 h-4 mr-2" />
                  Split All Pages
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  );
};

export default PDFSplit;
