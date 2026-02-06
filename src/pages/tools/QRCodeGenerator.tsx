import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, QrCode, Link, Mail, Phone, Wifi, MapPin } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";

const tool = getToolById("qr-code-generator")!;

export default function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrType, setQrType] = useState("text");
  const [qrData, setQrData] = useState({
    text: "Hello World!",
    url: "https://example.com",
    email: { to: "", subject: "", body: "" },
    phone: "",
    wifi: { ssid: "", password: "", encryption: "WPA" },
    location: { lat: "", lng: "" },
  });
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);

  const generateQRData = (): string => {
    switch (qrType) {
      case "url":
        return qrData.url;
      case "email":
        return `mailto:${qrData.email.to}?subject=${encodeURIComponent(qrData.email.subject)}&body=${encodeURIComponent(qrData.email.body)}`;
      case "phone":
        return `tel:${qrData.phone}`;
      case "wifi":
        return `WIFI:T:${qrData.wifi.encryption};S:${qrData.wifi.ssid};P:${qrData.wifi.password};;`;
      case "location":
        return `geo:${qrData.location.lat},${qrData.location.lng}`;
      default:
        return qrData.text;
    }
  };

  useEffect(() => {
    const data = generateQRData();
    if (data && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      }).catch(() => {
        // Handle error silently
      });
    }
  }, [qrType, qrData, fgColor, bgColor, size]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    toast.success("QR Code downloaded!");
  };

  const seoContent = {
    description: "Generate QR codes for URLs, text, WiFi, email, phone, and locations. Free, no signup.",
    content: `<h3>Introduction</h3><p>Create custom QR codes for any purpose in seconds.</p><h3>Key Benefits</h3><ul><li>Multiple QR types (URL, WiFi, Email, etc.)</li><li>Custom colors</li><li>High-resolution download</li><li>Instant generation</li></ul>`,
    keywords: ["QR code generator", "create QR code", "free QR maker", "WiFi QR code"],
    faqs: [
      { question: "Are the QR codes free to use?", answer: "Yes, completely free for personal and commercial use." },
      { question: "What can I encode in a QR code?", answer: "URLs, text, WiFi credentials, emails, phone numbers, and locations." },
    ],
    aboutTool: "Our QR Code Generator creates scannable codes for multiple data types.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={qrType} onValueChange={setQrType}>
              <TabsList className="grid grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="url"><Link className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="email"><Mail className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="phone"><Phone className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="wifi"><Wifi className="w-4 h-4" /></TabsTrigger>
                <TabsTrigger value="location"><MapPin className="w-4 h-4" /></TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-3 mt-4">
                <Label>Text Content</Label>
                <Textarea
                  placeholder="Enter text to encode..."
                  value={qrData.text}
                  onChange={(e) => setQrData({ ...qrData, text: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="url" className="space-y-3 mt-4">
                <Label>URL</Label>
                <Input
                  placeholder="https://example.com"
                  value={qrData.url}
                  onChange={(e) => setQrData({ ...qrData, url: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="email" className="space-y-3 mt-4">
                <div>
                  <Label>Email Address</Label>
                  <Input
                    placeholder="email@example.com"
                    value={qrData.email.to}
                    onChange={(e) => setQrData({ ...qrData, email: { ...qrData.email, to: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input
                    placeholder="Email subject"
                    value={qrData.email.subject}
                    onChange={(e) => setQrData({ ...qrData, email: { ...qrData.email, subject: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Body</Label>
                  <Textarea
                    placeholder="Email body..."
                    value={qrData.email.body}
                    onChange={(e) => setQrData({ ...qrData, email: { ...qrData.email, body: e.target.value } })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-3 mt-4">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1 234 567 8900"
                  value={qrData.phone}
                  onChange={(e) => setQrData({ ...qrData, phone: e.target.value })}
                />
              </TabsContent>

              <TabsContent value="wifi" className="space-y-3 mt-4">
                <div>
                  <Label>Network Name (SSID)</Label>
                  <Input
                    placeholder="MyWiFi"
                    value={qrData.wifi.ssid}
                    onChange={(e) => setQrData({ ...qrData, wifi: { ...qrData.wifi, ssid: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="WiFi password"
                    value={qrData.wifi.password}
                    onChange={(e) => setQrData({ ...qrData, wifi: { ...qrData.wifi, password: e.target.value } })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-3 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      placeholder="40.7128"
                      value={qrData.location.lat}
                      onChange={(e) => setQrData({ ...qrData, location: { ...qrData.location, lat: e.target.value } })}
                    />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      placeholder="-74.0060"
                      value={qrData.location.lng}
                      onChange={(e) => setQrData({ ...qrData, location: { ...qrData.location, lng: e.target.value } })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <Label>Foreground</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="font-mono" />
                </div>
              </div>
              <div>
                <Label>Background</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="font-mono" />
                </div>
              </div>
              <div>
                <Label>Size (px)</Label>
                <Input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} min={128} max={1024} step={64} className="mt-1" />
              </div>
            </div>

            <Button className="w-full" onClick={downloadQR}>
              <Download className="w-4 h-4 mr-2" /> Download QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <canvas ref={canvasRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
