import { 
  FileText, Shield, Code, Type, Image, 
  FileJson, Hash, Lock, KeyRound, Minimize2,
  Calculator, Binary, AlignLeft, CaseSensitive,
  Scaling, FileImage, Palette, Crop, RotateCw,
  Briefcase, FileCheck, Mail, Wand2, BookOpen,
  Zap, Database, Terminal, Globe, Layers
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: typeof FileText;
  category: ToolCategory;
  path: string;
  keywords: string[];
  featured?: boolean;
}

export type ToolCategory = 
  | "professional" 
  | "security" 
  | "developer" 
  | "content" 
  | "image";

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: typeof FileText;
  gradient: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "professional",
    name: "Professional Suite",
    description: "Career-focused tools for resumes, CVs, and cover letters",
    icon: Briefcase,
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    id: "security",
    name: "Security Suite",
    description: "Encryption, password tools, and secure hash generators",
    icon: Shield,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: "developer",
    name: "Developer Suite",
    description: "Code formatters, converters, and development utilities",
    icon: Code,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    id: "content",
    name: "Content Suite",
    description: "Writing tools, text analyzers, and content utilities",
    icon: Type,
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: "image",
    name: "Image Suite",
    description: "Image compression, conversion, and editing tools",
    icon: Image,
    gradient: "from-indigo-500 to-violet-600"
  }
];

export const tools: Tool[] = [
  // Professional Suite
  {
    id: "resume-builder",
    name: "AI Resume Builder",
    description: "Create professional, ATS-friendly resumes with our intelligent builder. Export to PDF with modern templates.",
    shortDescription: "Build ATS-optimized resumes instantly",
    icon: FileText,
    category: "professional",
    path: "/tools/resume-builder",
    keywords: ["resume", "CV", "job", "career", "ATS", "professional"],
    featured: true
  },
  {
    id: "cv-maker",
    name: "CV Maker",
    description: "Design comprehensive curriculum vitae with detailed sections for academics and professionals.",
    shortDescription: "Create detailed academic CVs",
    icon: FileCheck,
    category: "professional",
    path: "/tools/cv-maker",
    keywords: ["CV", "curriculum vitae", "academic", "portfolio"]
  },
  {
    id: "cover-letter-generator",
    name: "Cover Letter Generator",
    description: "Generate compelling cover letters tailored to job descriptions and company culture.",
    shortDescription: "Craft persuasive cover letters",
    icon: Mail,
    category: "professional",
    path: "/tools/cover-letter-generator",
    keywords: ["cover letter", "job application", "hiring"]
  },

  // Security Suite
  {
    id: "custom-encoder",
    name: "ToolSuiteX Encoder/Decoder",
    description: "Encode and decode text using our proprietary multi-layer cipher system. More secure than standard Base64.",
    shortDescription: "Proprietary encryption system",
    icon: Lock,
    category: "security",
    path: "/tools/custom-encoder",
    keywords: ["encode", "decode", "cipher", "encryption", "security"],
    featured: true
  },
  {
    id: "password-strength",
    name: "Password Strength Meter",
    description: "Analyze password security with detailed strength metrics and improvement suggestions.",
    shortDescription: "Check password security levels",
    icon: KeyRound,
    category: "security",
    path: "/tools/password-strength",
    keywords: ["password", "security", "strength", "checker"]
  },
  {
    id: "hash-generator",
    name: "Secure Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for text and files.",
    shortDescription: "Create cryptographic hashes",
    icon: Hash,
    category: "security",
    path: "/tools/hash-generator",
    keywords: ["hash", "MD5", "SHA", "checksum", "cryptography"]
  },

  // Developer Suite
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.",
    shortDescription: "Format and validate JSON",
    icon: FileJson,
    category: "developer",
    path: "/tools/json-formatter",
    keywords: ["JSON", "format", "validate", "beautify", "API"],
    featured: true
  },
  {
    id: "code-minifier",
    name: "HTML/CSS/JS Minifier",
    description: "Minify your code to reduce file size and improve website loading speed.",
    shortDescription: "Compress code for production",
    icon: Minimize2,
    category: "developer",
    path: "/tools/code-minifier",
    keywords: ["minify", "compress", "HTML", "CSS", "JavaScript"]
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries with proper indentation and syntax highlighting.",
    shortDescription: "Beautify SQL queries",
    icon: Database,
    category: "developer",
    path: "/tools/sql-formatter",
    keywords: ["SQL", "database", "query", "format"]
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between various units including length, weight, temperature, and data sizes.",
    shortDescription: "Convert between units",
    icon: Calculator,
    category: "developer",
    path: "/tools/unit-converter",
    keywords: ["convert", "units", "measurement", "calculator"]
  },
  {
    id: "base-converter",
    name: "Number Base Converter",
    description: "Convert numbers between binary, octal, decimal, and hexadecimal systems.",
    shortDescription: "Convert number systems",
    icon: Binary,
    category: "developer",
    path: "/tools/base-converter",
    keywords: ["binary", "hex", "octal", "decimal", "convert"]
  },

  // Content Suite
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs with reading time estimation.",
    shortDescription: "Analyze text statistics",
    icon: AlignLeft,
    category: "content",
    path: "/tools/word-counter",
    keywords: ["word count", "character count", "text analysis"],
    featured: true
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between uppercase, lowercase, title case, sentence case, and more.",
    shortDescription: "Transform text case",
    icon: CaseSensitive,
    category: "content",
    path: "/tools/case-converter",
    keywords: ["uppercase", "lowercase", "title case", "text"]
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview Markdown with live rendering and export options.",
    shortDescription: "Edit Markdown with preview",
    icon: BookOpen,
    category: "content",
    path: "/tools/markdown-editor",
    keywords: ["markdown", "editor", "preview", "writing"]
  },
  {
    id: "lorem-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for design mockups and content layouts.",
    shortDescription: "Generate placeholder text",
    icon: Wand2,
    category: "content",
    path: "/tools/lorem-generator",
    keywords: ["lorem ipsum", "placeholder", "dummy text"]
  },

  // Image Suite
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images without losing quality. Reduce file sizes for faster web loading.",
    shortDescription: "Optimize image file sizes",
    icon: Scaling,
    category: "image",
    path: "/tools/image-compressor",
    keywords: ["compress", "optimize", "reduce size", "image"],
    featured: true
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact dimensions or scale by percentage while maintaining aspect ratio.",
    shortDescription: "Resize images to any size",
    icon: Crop,
    category: "image",
    path: "/tools/image-resizer",
    keywords: ["resize", "scale", "dimensions", "image"]
  },
  {
    id: "image-converter",
    name: "Image Format Converter",
    description: "Convert images between PNG, JPG, WEBP, and other formats directly in your browser.",
    shortDescription: "Convert image formats",
    icon: FileImage,
    category: "image",
    path: "/tools/image-converter",
    keywords: ["convert", "PNG", "JPG", "WEBP", "format"]
  },
  {
    id: "color-picker",
    name: "Color Picker & Palette",
    description: "Pick colors from images, generate palettes, and convert between color formats.",
    shortDescription: "Pick and convert colors",
    icon: Palette,
    category: "image",
    path: "/tools/color-picker",
    keywords: ["color", "picker", "palette", "hex", "RGB"]
  },
  {
    id: "image-rotator",
    name: "Image Rotator & Flipper",
    description: "Rotate images by any angle or flip horizontally and vertically.",
    shortDescription: "Rotate and flip images",
    icon: RotateCw,
    category: "image",
    path: "/tools/image-rotator",
    keywords: ["rotate", "flip", "mirror", "image"]
  }
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter(tool => tool.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter(tool => tool.featured);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoryById(id: ToolCategory): CategoryInfo | undefined {
  return categories.find(cat => cat.id === id);
}
