import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Palette, Check, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { DesignSettings, DesignTheme, colorCategories, gradientPresets } from "./designData";

interface DesignCustomizerProps {
  themes: DesignTheme[];
  settings: DesignSettings;
  selectedThemeId: string;
  onThemeSelect: (theme: DesignTheme) => void;
  onSettingsChange: (settings: DesignSettings) => void;
  textColorFields?: { key: string; label: string; value: string; onChange: (color: string) => void }[];
}

export function DesignCustomizer({
  themes, settings, selectedThemeId, onThemeSelect, onSettingsChange, textColorFields,
}: DesignCustomizerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeColorCategory, setActiveColorCategory] = useState(0);
  const [colorTarget, setColorTarget] = useState<keyof DesignSettings>("accentColor");

  const updateSetting = <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const colorFields: { key: keyof DesignSettings; label: string }[] = [
    { key: "headerBg1", label: "Header BG 1" },
    { key: "headerBg2", label: "Header BG 2" },
    { key: "headerText", label: "Header Text" },
    { key: "headerAccent", label: "Header Accent" },
    { key: "bodyBg", label: "Body BG" },
    { key: "bodyText", label: "Body Text" },
    { key: "accentColor", label: "Accent" },
    { key: "mutedText", label: "Muted Text" },
    { key: "borderColor", label: "Border" },
  ];

  return (
    <div className="space-y-4">
      {/* Theme Selector */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">🎨 Choose a Theme</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeSelect(t)}
              className={`relative p-2 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                selectedThemeId === t.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ background: t.settings.headerBg1 }}
            >
              {selectedThemeId === t.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
              <div className="text-lg">{t.preview}</div>
              <div className="text-[10px] font-medium truncate" style={{ color: t.settings.headerText }}>
                {t.name}
              </div>
              <div className="flex gap-0.5 justify-center mt-1">
                <span className="w-2 h-2 rounded-full" style={{ background: t.settings.accentColor }} />
                <span className="w-2 h-2 rounded-full" style={{ background: t.settings.headerAccent }} />
                <span className="w-2 h-2 rounded-full" style={{ background: t.settings.bodyBg, border: `1px solid ${t.settings.borderColor}` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gradient Presets */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">🌈 Gradient Presets (Header)</Label>
        <div className="flex flex-wrap gap-1.5">
          {gradientPresets.map((g) => (
            <button
              key={g.name}
              onClick={() => onSettingsChange({ ...settings, headerBg1: g.from, headerBg2: g.to, useGradient: true })}
              className="w-8 h-8 rounded-lg border border-border hover:scale-110 transition-transform"
              style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
              title={g.name}
            />
          ))}
        </div>
      </div>

      {/* Gradient Toggle + Angle */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={settings.useGradient}
            onCheckedChange={(v) => updateSetting("useGradient", v)}
          />
          <Label className="text-xs">Gradient</Label>
        </div>
        {settings.useGradient && (
          <div className="flex items-center gap-2 flex-1">
            <Label className="text-xs whitespace-nowrap">Angle: {settings.gradientAngle}°</Label>
            <Slider
              value={[settings.gradientAngle]}
              onValueChange={([v]) => updateSetting("gradientAngle", v)}
              min={0} max={360} step={5}
              className="flex-1"
            />
          </div>
        )}
      </div>

      {/* Advanced Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="gap-2 w-full"
      >
        <Palette className="w-4 h-4" />
        {showAdvanced ? "Hide" : "Show"} Advanced Colors
        {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </Button>

      {showAdvanced && (
        <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
          {/* Color Input Fields */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {colorFields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-[10px] mb-1 block">{label}</Label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={settings[key] as string}
                    onChange={(e) => updateSetting(key, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0"
                  />
                  <button
                    onClick={() => setColorTarget(key)}
                    className={`text-[9px] font-mono px-1 py-0.5 rounded ${colorTarget === key ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {(settings[key] as string).slice(0, 7)}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Individual Text Colors */}
          {textColorFields && textColorFields.length > 0 && (
            <div>
              <Label className="text-xs font-semibold mb-2 block">✏️ Individual Text Colors</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {textColorFields.map((field) => (
                  <div key={field.key}>
                    <Label className="text-[10px] mb-1 block">{field.label}</Label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={field.value || settings.headerText}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0"
                      />
                      <span className="text-[9px] font-mono">{(field.value || "auto").slice(0, 7)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Palette */}
          <div>
            <Label className="text-xs font-semibold mb-2 block">🎨 Color Palette → {colorFields.find(f => f.key === colorTarget)?.label}</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {colorCategories.map((cat, i) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveColorCategory(i)}
                  className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
                    activeColorCategory === i ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {colorCategories[activeColorCategory].colors.map((color, i) => (
                <button
                  key={`${color}-${i}`}
                  onClick={() => updateSetting(colorTarget, color)}
                  className={`w-5 h-5 rounded border transition-transform hover:scale-125 ${
                    settings[colorTarget] === color ? "ring-2 ring-primary scale-110" : "border-border"
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={() => {
            const theme = themes.find(t => t.id === selectedThemeId);
            if (theme) onSettingsChange(theme.settings);
          }} className="gap-1">
            <RotateCcw className="w-3 h-3" /> Reset to Theme
          </Button>
        </div>
      )}
    </div>
  );
}
