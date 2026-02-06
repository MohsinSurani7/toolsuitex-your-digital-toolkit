import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";

const tool = getToolById("unit-converter")!;

type UnitCategory = {
  name: string;
  units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
};

const categories: UnitCategory[] = [
  {
    name: "Length",
    units: [
      { id: "m", name: "Meters", toBase: v => v, fromBase: v => v },
      { id: "km", name: "Kilometers", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "cm", name: "Centimeters", toBase: v => v / 100, fromBase: v => v * 100 },
      { id: "mm", name: "Millimeters", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "mi", name: "Miles", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: "yd", name: "Yards", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: "ft", name: "Feet", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: "in", name: "Inches", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ],
  },
  {
    name: "Weight",
    units: [
      { id: "kg", name: "Kilograms", toBase: v => v, fromBase: v => v },
      { id: "g", name: "Grams", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "mg", name: "Milligrams", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: "lb", name: "Pounds", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: "oz", name: "Ounces", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: "t", name: "Metric Tons", toBase: v => v * 1000, fromBase: v => v / 1000 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { id: "c", name: "Celsius", toBase: v => v, fromBase: v => v },
      { id: "f", name: "Fahrenheit", toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
      { id: "k", name: "Kelvin", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    name: "Data",
    units: [
      { id: "b", name: "Bytes", toBase: v => v, fromBase: v => v },
      { id: "kb", name: "Kilobytes", toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: "mb", name: "Megabytes", toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { id: "gb", name: "Gigabytes", toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
      { id: "tb", name: "Terabytes", toBase: v => v * 1024 * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024 * 1024) },
    ],
  },
  {
    name: "Time",
    units: [
      { id: "s", name: "Seconds", toBase: v => v, fromBase: v => v },
      { id: "ms", name: "Milliseconds", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "min", name: "Minutes", toBase: v => v * 60, fromBase: v => v / 60 },
      { id: "h", name: "Hours", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: "d", name: "Days", toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: "w", name: "Weeks", toBase: v => v * 604800, fromBase: v => v / 604800 },
    ],
  },
];

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState("Length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");

  const currentCategory = useMemo(
    () => categories.find(c => c.name === activeCategory)!,
    [activeCategory]
  );

  // Set default units when category changes
  useMemo(() => {
    if (currentCategory && currentCategory.units.length >= 2) {
      setFromUnit(currentCategory.units[0].id);
      setToUnit(currentCategory.units[1].id);
    }
  }, [activeCategory]);

  const result = useMemo(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || !fromUnit || !toUnit) return "";

    const from = currentCategory.units.find(u => u.id === fromUnit);
    const to = currentCategory.units.find(u => u.id === toUnit);

    if (!from || !to) return "";

    const baseValue = from.toBase(numValue);
    const converted = to.fromBase(baseValue);

    return converted.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }, [value, fromUnit, toUnit, currentCategory]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const seoContent = {
    description: "Convert between length, weight, temperature, data, and time units.",
    content: `<h3>Universal Unit Converter</h3><p>Instant conversion between various unit types.</p>`,
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter"],
    faqs: [
      { question: "How accurate are conversions?", answer: "Uses standard conversion factors with high precision." },
      { question: "Does temperature conversion work correctly?", answer: "Yes, handles Fahrenheit and Kelvin offsets properly." },
    ],
    aboutTool: "Convert between length, weight, temperature, data storage, and time units with real-time results.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Unit Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              {categories.map(cat => (
                <TabsTrigger key={cat.name} value={cat.name} className="text-xs sm:text-sm">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat.name} value={cat.name} className="space-y-6">
                <div className="grid gap-4">
                  {/* From */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {cat.units.map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button variant="outline" size="icon" onClick={swapUnits}>
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* To */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={result}
                        readOnly
                        placeholder="Result"
                        className="flex-1 bg-muted"
                      />
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {cat.units.map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Result</p>
                    <p className="text-3xl font-bold text-primary">
                      {value} {cat.units.find(u => u.id === fromUnit)?.name} = {result} {cat.units.find(u => u.id === toUnit)?.name}
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
