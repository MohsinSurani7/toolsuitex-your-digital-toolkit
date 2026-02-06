import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Plus, Trash2, Shuffle } from "lucide-react";
import { getToolById } from "@/lib/tools-data";
import { useToast } from "@/hooks/use-toast";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const presets = [
  { name: "Sunset", colors: ["#ff6b6b", "#feca57", "#ff9ff3"] },
  { name: "Ocean", colors: ["#667eea", "#764ba2"] },
  { name: "Forest", colors: ["#11998e", "#38ef7d"] },
  { name: "Purple Haze", colors: ["#7f00ff", "#e100ff"] },
  { name: "Midnight", colors: ["#232526", "#414345"] },
  { name: "Cool Blues", colors: ["#2193b0", "#6dd5ed"] },
  { name: "Warm Flame", colors: ["#ff9a9e", "#fecfef", "#fecfef"] },
  { name: "Cosmic", colors: ["#ff00cc", "#333399"] },
];

const CssGradientGenerator = () => {
  const [gradientType, setGradientType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#667eea", position: 0 },
    { id: "2", color: "#764ba2", position: 100 },
  ]);
  const { toast } = useToast();

  const addColorStop = () => {
    const newStop: ColorStop = {
      id: crypto.randomUUID(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
      position: 50,
    };
    setColorStops([...colorStops, newStop].sort((a, b) => a.position - b.position));
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) {
      toast({ title: "Error", description: "Need at least 2 color stops", variant: "destructive" });
      return;
    }
    setColorStops(colorStops.filter(s => s.id !== id));
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(
      colorStops.map(s => (s.id === id ? { ...s, ...updates } : s))
        .sort((a, b) => a.position - b.position)
    );
  };

  const generateCSS = () => {
    const stops = colorStops.map(s => `${s.color} ${s.position}%`).join(", ");
    
    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stops})`;
      case "radial":
        return `radial-gradient(circle, ${stops})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stops})`;
      default:
        return `linear-gradient(${angle}deg, ${stops})`;
    }
  };

  const cssCode = generateCSS();

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${cssCode};`);
    toast({ title: "Copied!", description: "CSS copied to clipboard" });
  };

  const applyPreset = (preset: typeof presets[0]) => {
    const stops = preset.colors.map((color, i) => ({
      id: crypto.randomUUID(),
      color,
      position: Math.round((i / (preset.colors.length - 1)) * 100),
    }));
    setColorStops(stops);
  };

  const randomize = () => {
    const count = 2 + Math.floor(Math.random() * 3);
    const stops: ColorStop[] = [];
    for (let i = 0; i < count; i++) {
      stops.push({
        id: crypto.randomUUID(),
        color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
        position: Math.round((i / (count - 1)) * 100),
      });
    }
    setColorStops(stops);
    setAngle(Math.floor(Math.random() * 360));
  };

  const tool = getToolById("css-gradient-generator")!;

  const seoContent = {
    description: "Create beautiful CSS gradients with a visual editor. Linear, radial, and conic gradients with instant CSS code.",
    content: `<h3>Introduction to CSS Gradients</h3><p>Beautiful gradients can transform any design. Our CSS Gradient Generator provides a visual editor for creating linear, radial, and conic gradients with unlimited color stops, preset templates, and instant CSS code generation.</p><h3>How to Use</h3><p>Choose your gradient type, add and customize color stops with positions, adjust the angle for directional gradients, and copy the generated CSS code to your stylesheet.</p><h3>Key Features</h3><ul><li>Linear, radial, and conic gradients</li><li>Unlimited color stops</li><li>Preset gradient templates</li><li>Random gradient generator</li></ul>`,
    keywords: ["css gradient", "gradient generator", "css background", "linear gradient", "radial gradient"],
    faqs: [
      { question: "What gradient types are supported?", answer: "We support linear (directional), radial (circular from center), and conic (angular sweep) gradients." },
      { question: "How many color stops can I add?", answer: "You can add as many color stops as you need. The minimum is 2 colors." }
    ],
    aboutTool: "Our CSS Gradient Generator helps you create stunning gradient backgrounds with a visual interface. Perfect for web designers and developers looking to add beautiful color transitions to their projects."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gradient Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={gradientType} onValueChange={(v) => setGradientType(v as typeof gradientType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(gradientType === "linear" || gradientType === "conic") && (
                <div className="space-y-2">
                  <Label>Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={([v]) => setAngle(v)}
                    max={360}
                    step={1}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Color Stops
                <Button size="sm" onClick={addColorStop}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {colorStops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={stop.color}
                    onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                    className="w-24 font-mono text-sm"
                  />
                  <div className="flex-1">
                    <Slider
                      value={[stop.position]}
                      onValueChange={([v]) => updateColorStop(stop.id, { position: v })}
                      max={100}
                      step={1}
                    />
                  </div>
                  <span className="text-sm w-10 text-right">{stop.position}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColorStop(stop.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="h-12 rounded-lg border-2 border-transparent hover:border-primary transition-colors"
                    style={{
                      background: `linear-gradient(135deg, ${preset.colors.join(", ")})`,
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3" onClick={randomize}>
                <Shuffle className="w-4 h-4 mr-2" />
                Random Gradient
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full aspect-video rounded-lg border"
                style={{ background: cssCode }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                CSS Code
                <Button size="sm" onClick={copyCSS}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`background: ${cssCode};`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Previews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end justify-center">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border mx-auto"
                    style={{ background: cssCode }}
                  />
                  <span className="text-xs text-muted-foreground">64px</span>
                </div>
                <div className="text-center">
                  <div
                    className="w-24 h-24 rounded-lg border mx-auto"
                    style={{ background: cssCode }}
                  />
                  <span className="text-xs text-muted-foreground">96px</span>
                </div>
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-lg border mx-auto"
                    style={{ background: cssCode }}
                  />
                  <span className="text-xs text-muted-foreground">128px</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default CssGradientGenerator;
