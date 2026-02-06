import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: InvoiceItem[];
  notes: string;
  taxRate: number;
}

const tool = getToolById("invoice-generator")!;

export default function InvoiceGenerator() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    items: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }],
    notes: "",
    taxRate: 0,
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }],
    });
  };

  const removeItem = (id: string) => {
    if (invoice.items.length > 1) {
      setInvoice({ ...invoice, items: invoice.items.filter((item) => item.id !== id) });
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
      toast.success("Invoice downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  const seoContent = {
    description: "Create professional invoices offline with our free Invoice Generator. No signup required.",
    content: `<h3>Introduction</h3><p>Generate professional invoices instantly without any internet connection.</p><h3>Key Benefits</h3><ul><li>Works completely offline</li><li>Professional PDF export</li><li>Automatic calculations</li><li>No data stored on servers</li></ul>`,
    keywords: ["invoice generator", "free invoice maker", "offline invoice", "PDF invoice"],
    faqs: [
      { question: "Is this invoice generator free?", answer: "Yes, completely free with no hidden charges." },
      { question: "Do I need to sign up?", answer: "No signup or account required." },
    ],
    aboutTool: "Our Invoice Generator creates professional invoices entirely in your browser.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Invoice #</Label>
                <Input value={invoice.invoiceNumber} onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })} />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={invoice.date} onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">From</h4>
                <Input placeholder="Your Name/Company" value={invoice.fromName} onChange={(e) => setInvoice({ ...invoice, fromName: e.target.value })} />
                <Input placeholder="Email" value={invoice.fromEmail} onChange={(e) => setInvoice({ ...invoice, fromEmail: e.target.value })} />
                <Textarea placeholder="Address" value={invoice.fromAddress} onChange={(e) => setInvoice({ ...invoice, fromAddress: e.target.value })} />
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Bill To</h4>
                <Input placeholder="Client Name/Company" value={invoice.toName} onChange={(e) => setInvoice({ ...invoice, toName: e.target.value })} />
                <Input placeholder="Email" value={invoice.toEmail} onChange={(e) => setInvoice({ ...invoice, toEmail: e.target.value })} />
                <Textarea placeholder="Address" value={invoice.toAddress} onChange={(e) => setInvoice({ ...invoice, toAddress: e.target.value })} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Items</h4>
                <Button size="sm" variant="outline" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
              </div>
              {invoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-6" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
                  <Input className="col-span-3" type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} />
                  <Button variant="ghost" size="icon" className="col-span-1" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tax Rate (%)</Label>
                <Input type="number" value={invoice.taxRate} onChange={(e) => setInvoice({ ...invoice, taxRate: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Payment terms, thank you note..." value={invoice.notes} onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })} />
              </div>
            </div>

            <Button className="w-full" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={invoiceRef} className="bg-white text-black p-8 rounded-lg text-sm">
              <div className="flex justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                  <p className="text-gray-600">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {invoice.date}</p>
                  <p><strong>Due:</strong> {invoice.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">From</h3>
                  <p className="font-medium">{invoice.fromName || "Your Name"}</p>
                  <p className="text-gray-600">{invoice.fromEmail}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.fromAddress}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Bill To</h3>
                  <p className="font-medium">{invoice.toName || "Client Name"}</p>
                  <p className="text-gray-600">{invoice.toEmail}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.toAddress}</p>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-2">{item.description || "Item"}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.rate.toFixed(2)}</td>
                      <td className="text-right py-2">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-48">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {invoice.taxRate > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">{invoice.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
