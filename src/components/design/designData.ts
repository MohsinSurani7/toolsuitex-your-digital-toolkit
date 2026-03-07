// ─── Shared Design Data ──────────────────────────────────────────────────────

export interface DesignSettings {
  headerBg1: string;
  headerBg2: string;
  headerText: string;
  headerAccent: string;
  bodyBg: string;
  bodyText: string;
  accentColor: string;
  mutedText: string;
  borderColor: string;
  useGradient: boolean;
  gradientAngle: number;
}

export interface DesignTheme {
  id: string;
  name: string;
  preview: string;
  settings: DesignSettings;
}

// ─── Color Palette (500+ colors) ─────────────────────────────────────────────

export const colorCategories = [
  {
    name: "Reds", colors: [
      "#FF0000","#FF1A1A","#FF3333","#FF4D4D","#FF6666","#FF8080","#FF9999","#FFB3B3","#FFCCCC","#FFE6E6",
      "#E60000","#CC0000","#B30000","#990000","#800000","#660000","#4D0000","#330000","#DC143C","#B22222",
      "#CD5C5C","#F08080","#FA8072","#E9967A","#FFA07A","#FF6347","#FF4500","#FF7F7F","#D32F2F","#C62828",
    ]
  },
  {
    name: "Pinks", colors: [
      "#FF00FF","#FF1493","#FF69B4","#FFB6C1","#FFC0CB","#DB7093","#C71585","#FF007F","#E91E63","#F50057",
      "#AD1457","#880E4F","#EC407A","#F06292","#F48FB1","#F8BBD0","#FCE4EC","#D81B60","#C2185B","#FF80AB",
      "#FF4081","#F50057","#C51162","#FF6090","#FF80AB","#F48FB1","#F8BBD0","#FCE4EC","#FFD6E0","#FFECF1",
    ]
  },
  {
    name: "Oranges", colors: [
      "#FF8C00","#FF7F00","#FF6600","#FF5500","#FFA500","#FFB347","#FFCC80","#FFE0B2","#FFF3E0","#E65100",
      "#EF6C00","#F57C00","#FB8C00","#FF9800","#FFA726","#FFB74D","#FFCC80","#FFE0B2","#FFF3E0","#BF360C",
      "#D84315","#E64A19","#F4511E","#FF5722","#FF6E40","#FF8A65","#FFAB91","#FFCCBC","#FBE9E7","#DD2C00",
    ]
  },
  {
    name: "Yellows", colors: [
      "#FFFF00","#FFEB3B","#FFC107","#FFD600","#FFD740","#FFEA00","#FFF176","#FFF59D","#FFF9C4","#FFFDE7",
      "#F57F17","#F9A825","#FBC02D","#FDD835","#FFEE58","#FFF176","#FFF59D","#FFF9C4","#FFFDE7","#FFD700",
      "#DAA520","#B8860B","#FFD54F","#FFE082","#FFECB3","#FFF8E1","#F5F5DC","#FFFACD","#FAFAD2","#FFE4B5",
    ]
  },
  {
    name: "Greens", colors: [
      "#00FF00","#00E676","#00C853","#00BFA5","#009688","#4CAF50","#8BC34A","#CDDC39","#66BB6A","#81C784",
      "#A5D6A7","#C8E6C9","#E8F5E9","#1B5E20","#2E7D32","#388E3C","#43A047","#4CAF50","#66BB6A","#81C784",
      "#006400","#008000","#228B22","#2E8B57","#3CB371","#20B2AA","#00FA9A","#00FF7F","#7CFC00","#32CD32",
    ]
  },
  {
    name: "Teals", colors: [
      "#008080","#009688","#00897B","#00796B","#00695C","#004D40","#26A69A","#4DB6AC","#80CBC4","#B2DFDB",
      "#E0F2F1","#00BCD4","#00ACC1","#0097A7","#00838F","#006064","#26C6DA","#4DD0E1","#80DEEA","#B2EBF2",
      "#E0F7FA","#18FFFF","#00E5FF","#00B8D4","#84FFFF","#A7FFEB","#64FFDA","#1DE9B6","#00E676","#69F0AE",
    ]
  },
  {
    name: "Blues", colors: [
      "#0000FF","#0D47A1","#1565C0","#1976D2","#1E88E5","#2196F3","#42A5F5","#64B5F6","#90CAF9","#BBDEFB",
      "#E3F2FD","#0A1929","#0D47A1","#1565C0","#1976D2","#1E88E5","#2196F3","#42A5F5","#64B5F6","#90CAF9",
      "#000080","#00008B","#0000CD","#4169E1","#6495ED","#1E90FF","#00BFFF","#87CEEB","#87CEFA","#ADD8E6",
    ]
  },
  {
    name: "Purples", colors: [
      "#800080","#9C27B0","#8E24AA","#7B1FA2","#6A1B9A","#4A148C","#AB47BC","#BA68C8","#CE93D8","#E1BEE7",
      "#F3E5F5","#AA00FF","#D500F9","#E040FB","#EA80FC","#B388FF","#7C4DFF","#651FFF","#6200EA","#311B92",
      "#4A0072","#9575CD","#7E57C2","#673AB7","#5E35B1","#512DA8","#4527A0","#B39DDB","#D1C4E9","#EDE7F6",
    ]
  },
  {
    name: "Browns", colors: [
      "#8B4513","#A0522D","#A52A2A","#D2691E","#CD853F","#DEB887","#F4A460","#D2B48C","#BC8F8F","#C4A882",
      "#3E2723","#4E342E","#5D4037","#6D4C41","#795548","#8D6E63","#A1887F","#BCAAA4","#D7CCC8","#EFEBE9",
      "#BF360C","#8D6E63","#A1887F","#C8AD7F","#B08D57","#8B7355","#704214","#5C3317","#4B2709","#3B1F00",
    ]
  },
  {
    name: "Grays", colors: [
      "#000000","#111111","#1A1A1A","#222222","#2D2D2D","#333333","#3D3D3D","#444444","#4F4F4F","#555555",
      "#666666","#777777","#888888","#999999","#AAAAAA","#BBBBBB","#CCCCCC","#D5D5D5","#DDDDDD","#E8E8E8",
      "#EEEEEE","#F2F2F2","#F5F5F5","#F8F8F8","#FAFAFA","#FCFCFC","#FFFFFF","#263238","#37474F","#455A64",
    ]
  },
  {
    name: "Neutrals", colors: [
      "#0F172A","#1E293B","#334155","#475569","#64748B","#94A3B8","#CBD5E1","#E2E8F0","#F1F5F9","#F8FAFC",
      "#18181B","#27272A","#3F3F46","#52525B","#71717A","#A1A1AA","#D4D4D8","#E4E4E7","#F4F4F5","#FAFAFA",
      "#171717","#262626","#404040","#525252","#737373","#A3A3A3","#D4D4D4","#E5E5E5","#F5F5F5","#FAFAFA",
    ]
  },
];

// ─── Gradient Presets ────────────────────────────────────────────────────────

export const gradientPresets = [
  { name: "Sunset", from: "#FF512F", to: "#DD2476" },
  { name: "Ocean", from: "#2193b0", to: "#6dd5ed" },
  { name: "Purple Rain", from: "#7B2FF7", to: "#C850C0" },
  { name: "Forest", from: "#134E5E", to: "#71B280" },
  { name: "Fire", from: "#f12711", to: "#f5af19" },
  { name: "Night Sky", from: "#0f0c29", to: "#302b63" },
  { name: "Peach", from: "#ED4264", to: "#FFEDBC" },
  { name: "Mint", from: "#00b09b", to: "#96c93d" },
  { name: "Berry", from: "#4568DC", to: "#B06AB3" },
  { name: "Gold Rush", from: "#F09819", to: "#EDDE5D" },
  { name: "Arctic", from: "#2BC0E4", to: "#EAECC6" },
  { name: "Cherry", from: "#EB3349", to: "#F45C43" },
  { name: "Midnight", from: "#0f2027", to: "#2C5364" },
  { name: "Lavender", from: "#C9D6FF", to: "#E2E2E2" },
  { name: "Neon", from: "#00f260", to: "#0575E6" },
  { name: "Cosmic", from: "#ff00cc", to: "#333399" },
  { name: "Emerald", from: "#348F50", to: "#56B4D3" },
  { name: "Royal", from: "#141E30", to: "#243B55" },
  { name: "Rose", from: "#FFB6C1", to: "#FF69B4" },
  { name: "Slate", from: "#373B44", to: "#4286f4" },
  { name: "Copper", from: "#B79891", to: "#94716B" },
  { name: "Ice", from: "#E6DADA", to: "#274046" },
  { name: "Flame", from: "#ff9a9e", to: "#fecfef" },
  { name: "Deep Sea", from: "#4CA1AF", to: "#C4E0E5" },
];

// ─── Resume Themes ───────────────────────────────────────────────────────────

export const resumeThemes: DesignTheme[] = [
  {
    id: "modern-dark", name: "Modern Dark", preview: "🌙",
    settings: { headerBg1: "#1e293b", headerBg2: "#334155", headerText: "#f8fafc", headerAccent: "#22d3ee", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#0891b2", mutedText: "#64748b", borderColor: "#e2e8f0", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "minimal-white", name: "Minimal White", preview: "☀️",
    settings: { headerBg1: "#ffffff", headerBg2: "#f1f5f9", headerText: "#0f172a", headerAccent: "#6366f1", bodyBg: "#ffffff", bodyText: "#0f172a", accentColor: "#6366f1", mutedText: "#64748b", borderColor: "#e2e8f0", useGradient: false, gradientAngle: 135 },
  },
  {
    id: "bold-purple", name: "Bold Purple", preview: "💜",
    settings: { headerBg1: "#7c3aed", headerBg2: "#a855f7", headerText: "#ffffff", headerAccent: "#fbbf24", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#7c3aed", mutedText: "#6b7280", borderColor: "#e5e7eb", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "nature-green", name: "Nature Green", preview: "🌿",
    settings: { headerBg1: "#064e3b", headerBg2: "#065f46", headerText: "#ecfdf5", headerAccent: "#34d399", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#059669", mutedText: "#6b7280", borderColor: "#d1fae5", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "sunset-fire", name: "Sunset Fire", preview: "🌅",
    settings: { headerBg1: "#ea580c", headerBg2: "#dc2626", headerText: "#ffffff", headerAccent: "#fbbf24", bodyBg: "#ffffff", bodyText: "#1c1917", accentColor: "#ea580c", mutedText: "#78716c", borderColor: "#fed7aa", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "ocean-blue", name: "Ocean Blue", preview: "🌊",
    settings: { headerBg1: "#1e40af", headerBg2: "#0891b2", headerText: "#ffffff", headerAccent: "#38bdf8", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#1e40af", mutedText: "#64748b", borderColor: "#bfdbfe", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "rose-gold", name: "Rose Gold", preview: "🌹",
    settings: { headerBg1: "#1c1917", headerBg2: "#44403c", headerText: "#fecdd3", headerAccent: "#fb7185", bodyBg: "#fff1f2", bodyText: "#1c1917", accentColor: "#be123c", mutedText: "#78716c", borderColor: "#fecdd3", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "glassmorphism", name: "Glassmorphism", preview: "✨",
    settings: { headerBg1: "#667eea", headerBg2: "#764ba2", headerText: "#ffffff", headerAccent: "#a5b4fc", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#667eea", mutedText: "#6b7280", borderColor: "#c4b5fd", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "brutalist", name: "Brutalist", preview: "🏗️",
    settings: { headerBg1: "#000000", headerBg2: "#000000", headerText: "#ffffff", headerAccent: "#ff0000", bodyBg: "#f5f5dc", bodyText: "#000000", accentColor: "#ff0000", mutedText: "#555555", borderColor: "#000000", useGradient: false, gradientAngle: 0 },
  },
  {
    id: "neon-glow", name: "Neon Glow", preview: "⚡",
    settings: { headerBg1: "#0d0d0d", headerBg2: "#1a0033", headerText: "#39ff14", headerAccent: "#ff073a", bodyBg: "#0a0a0a", bodyText: "#e0e0e0", accentColor: "#39ff14", mutedText: "#888888", borderColor: "#333333", useGradient: true, gradientAngle: 160 },
  },
  {
    id: "retro-80s", name: "Retro 80s", preview: "🕹️",
    settings: { headerBg1: "#ff6ec7", headerBg2: "#7873f5", headerText: "#ffffff", headerAccent: "#ffd319", bodyBg: "#ffffff", bodyText: "#1a1a2e", accentColor: "#ff6ec7", mutedText: "#6b7280", borderColor: "#ffd319", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "art-deco", name: "Art Deco", preview: "🎭",
    settings: { headerBg1: "#1b1b2f", headerBg2: "#162447", headerText: "#e8d5b7", headerAccent: "#c9a96e", bodyBg: "#faf8f5", bodyText: "#1b1b2f", accentColor: "#c9a96e", mutedText: "#6b7280", borderColor: "#c9a96e", useGradient: true, gradientAngle: 180 },
  },
];

// ─── CV Themes ───────────────────────────────────────────────────────────────

export const cvThemes: DesignTheme[] = [
  {
    id: "academic-emerald", name: "Academic Emerald", preview: "🎓",
    settings: { headerBg1: "#064e3b", headerBg2: "#065f46", headerText: "#ecfdf5", headerAccent: "#6ee7b7", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#064e3b", mutedText: "#6b7280", borderColor: "#d1fae5", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "classic-navy", name: "Classic Navy", preview: "⚓",
    settings: { headerBg1: "#1e3a5f", headerBg2: "#0f172a", headerText: "#f8fafc", headerAccent: "#60a5fa", bodyBg: "#ffffff", bodyText: "#0f172a", accentColor: "#1e3a5f", mutedText: "#64748b", borderColor: "#bfdbfe", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "wine-elegant", name: "Wine Elegant", preview: "🍷",
    settings: { headerBg1: "#7f1d1d", headerBg2: "#991b1b", headerText: "#fef2f2", headerAccent: "#fca5a5", bodyBg: "#ffffff", bodyText: "#1c1917", accentColor: "#7f1d1d", mutedText: "#78716c", borderColor: "#fecaca", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "royal-purple", name: "Royal Purple", preview: "👑",
    settings: { headerBg1: "#4c1d95", headerBg2: "#5b21b6", headerText: "#f5f3ff", headerAccent: "#c4b5fd", bodyBg: "#ffffff", bodyText: "#1e293b", accentColor: "#4c1d95", mutedText: "#6b7280", borderColor: "#ddd6fe", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "steel-modern", name: "Steel Modern", preview: "🔩",
    settings: { headerBg1: "#374151", headerBg2: "#4b5563", headerText: "#f9fafb", headerAccent: "#9ca3af", bodyBg: "#ffffff", bodyText: "#111827", accentColor: "#374151", mutedText: "#6b7280", borderColor: "#d1d5db", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "teal-fresh", name: "Teal Fresh", preview: "🌊",
    settings: { headerBg1: "#0d9488", headerBg2: "#0f766e", headerText: "#f0fdfa", headerAccent: "#5eead4", bodyBg: "#ffffff", bodyText: "#134e4a", accentColor: "#0d9488", mutedText: "#6b7280", borderColor: "#99f6e4", useGradient: true, gradientAngle: 135 },
  },
  ...resumeThemes.filter(t => ["glassmorphism", "brutalist", "neon-glow", "art-deco", "retro-80s", "rose-gold"].includes(t.id)),
];

// ─── Portfolio Themes ────────────────────────────────────────────────────────

export const portfolioThemes: DesignTheme[] = [
  {
    id: "modern-dark", name: "Modern Dark", preview: "🌙",
    settings: { headerBg1: "#0f172a", headerBg2: "#1e293b", headerText: "#e2e8f0", headerAccent: "#60a5fa", bodyBg: "#0f172a", bodyText: "#e2e8f0", accentColor: "#60a5fa", mutedText: "#94a3b8", borderColor: "#334155", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "minimal-light", name: "Minimal Light", preview: "☀️",
    settings: { headerBg1: "#ffffff", headerBg2: "#f8fafc", headerText: "#0f172a", headerAccent: "#0f172a", bodyBg: "#ffffff", bodyText: "#0f172a", accentColor: "#0f172a", mutedText: "#64748b", borderColor: "#e2e8f0", useGradient: false, gradientAngle: 135 },
  },
  {
    id: "creative-gradient", name: "Creative Gradient", preview: "🎨",
    settings: { headerBg1: "#1a1a2e", headerBg2: "#16213e", headerText: "#eaeaea", headerAccent: "#e94560", bodyBg: "#1a1a2e", bodyText: "#eaeaea", accentColor: "#e94560", mutedText: "#a0a0b0", borderColor: "#2a2a4e", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "corporate-blue", name: "Corporate Blue", preview: "💼",
    settings: { headerBg1: "#f0f4f8", headerBg2: "#ffffff", headerText: "#1e293b", headerAccent: "#1e40af", bodyBg: "#f0f4f8", bodyText: "#1e293b", accentColor: "#1e40af", mutedText: "#64748b", borderColor: "#cbd5e1", useGradient: false, gradientAngle: 135 },
  },
  {
    id: "warm-sunset", name: "Warm Sunset", preview: "🌅",
    settings: { headerBg1: "#1c1917", headerBg2: "#292524", headerText: "#fafaf9", headerAccent: "#f59e0b", bodyBg: "#1c1917", bodyText: "#fafaf9", accentColor: "#f59e0b", mutedText: "#a8a29e", borderColor: "#44403c", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "forest-green", name: "Forest Green", preview: "🌿",
    settings: { headerBg1: "#f0fdf4", headerBg2: "#ffffff", headerText: "#14532d", headerAccent: "#166534", bodyBg: "#f0fdf4", bodyText: "#14532d", accentColor: "#166534", mutedText: "#4b5563", borderColor: "#bbf7d0", useGradient: false, gradientAngle: 135 },
  },
  {
    id: "neon-cyber", name: "Neon Cyber", preview: "⚡",
    settings: { headerBg1: "#09090b", headerBg2: "#18181b", headerText: "#fafafa", headerAccent: "#22d3ee", bodyBg: "#09090b", bodyText: "#fafafa", accentColor: "#22d3ee", mutedText: "#71717a", borderColor: "#27272a", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "rose-elegant", name: "Rose Elegant", preview: "🌹",
    settings: { headerBg1: "#fff1f2", headerBg2: "#ffffff", headerText: "#1c1917", headerAccent: "#be123c", bodyBg: "#fff1f2", bodyText: "#1c1917", accentColor: "#be123c", mutedText: "#78716c", borderColor: "#fecdd3", useGradient: false, gradientAngle: 135 },
  },
  {
    id: "glassmorphism", name: "Glassmorphism", preview: "✨",
    settings: { headerBg1: "#667eea", headerBg2: "#764ba2", headerText: "#ffffff", headerAccent: "#a5b4fc", bodyBg: "#1a1a2e", bodyText: "#e0e0f0", accentColor: "#a5b4fc", mutedText: "#9090b0", borderColor: "#3a3a6e", useGradient: true, gradientAngle: 135 },
  },
  {
    id: "brutalist", name: "Brutalist", preview: "🏗️",
    settings: { headerBg1: "#000000", headerBg2: "#000000", headerText: "#ffffff", headerAccent: "#ff0000", bodyBg: "#f5f5dc", bodyText: "#000000", accentColor: "#ff0000", mutedText: "#555555", borderColor: "#000000", useGradient: false, gradientAngle: 0 },
  },
  {
    id: "neon-glow", name: "Neon Glow", preview: "🔮",
    settings: { headerBg1: "#0d0d0d", headerBg2: "#1a0033", headerText: "#39ff14", headerAccent: "#ff073a", bodyBg: "#0a0a0a", bodyText: "#e0e0e0", accentColor: "#39ff14", mutedText: "#888888", borderColor: "#333333", useGradient: true, gradientAngle: 160 },
  },
  {
    id: "retro-80s", name: "Retro 80s", preview: "🕹️",
    settings: { headerBg1: "#ff6ec7", headerBg2: "#7873f5", headerText: "#ffffff", headerAccent: "#ffd319", bodyBg: "#1a0a2e", bodyText: "#ffffff", accentColor: "#ff6ec7", mutedText: "#c0c0c0", borderColor: "#7873f5", useGradient: true, gradientAngle: 135 },
  },
];

// ─── Helper ──────────────────────────────────────────────────────────────────

export function getHeaderBackground(settings: DesignSettings): string {
  if (settings.useGradient) {
    return `linear-gradient(${settings.gradientAngle}deg, ${settings.headerBg1}, ${settings.headerBg2})`;
  }
  return settings.headerBg1;
}
