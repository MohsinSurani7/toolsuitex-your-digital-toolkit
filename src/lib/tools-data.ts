import { 
  FileText, Shield, Code, Type, Image, 
  FileJson, Hash, Lock, KeyRound, Minimize2,
  Calculator, Binary, AlignLeft, CaseSensitive,
  Scaling, FileImage, Palette, Crop, RotateCw,
  Briefcase, FileCheck, Mail, Wand2, BookOpen,
  Database, Receipt, CreditCard,
  FolderOpen, Map, ImageIcon, TestTube, AtSign,
  Phone, QrCode, Barcode, Merge, FileArchive, Images,
  Sparkles, EyeOff, Search, CodeIcon, GitCompare,
  Scissors, Regex, FileSpreadsheet, Image as ImageLucide,
  Tags, Clock, Key, Link2, Timer, PaintBucket, FileCode
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
  { id: "professional", name: "Professional Suite", description: "Career-focused tools for resumes, CVs, and cover letters", icon: Briefcase, gradient: "from-cyan-500 to-blue-600" },
  { id: "security", name: "Security Suite", description: "Encryption, password tools, and secure hash generators", icon: Shield, gradient: "from-purple-500 to-pink-600" },
  { id: "developer", name: "Developer Suite", description: "Code formatters, converters, and development utilities", icon: Code, gradient: "from-green-500 to-emerald-600" },
  { id: "content", name: "Content Suite", description: "Writing tools, text analyzers, and content utilities", icon: Type, gradient: "from-orange-500 to-red-600" },
  { id: "image", name: "Image Suite", description: "Image compression, conversion, and editing tools", icon: Image, gradient: "from-indigo-500 to-violet-600" }
];

export const tools: Tool[] = [
  // Professional Suite
  { id: "resume-builder", name: "AI Resume Builder", description: "Create professional, ATS-friendly resumes with our intelligent builder. Export to PDF with modern templates.", shortDescription: "Build ATS-optimized resumes instantly", icon: FileText, category: "professional", path: "/tools/resume-builder", keywords: ["resume", "CV", "job", "career", "ATS", "professional"], featured: true },
  { id: "cv-maker", name: "CV Maker", description: "Design comprehensive curriculum vitae with detailed sections for academics and professionals.", shortDescription: "Create detailed academic CVs", icon: FileCheck, category: "professional", path: "/tools/cv-maker", keywords: ["CV", "curriculum vitae", "academic", "portfolio"] },
  { id: "cover-letter-generator", name: "Cover Letter Generator", description: "Generate compelling cover letters tailored to job descriptions and company culture.", shortDescription: "Craft persuasive cover letters", icon: Mail, category: "professional", path: "/tools/cover-letter-generator", keywords: ["cover letter", "job application", "hiring"] },
  { id: "invoice-generator", name: "Invoice Generator", description: "Create professional invoices offline with automatic calculations. Export to PDF instantly.", shortDescription: "Create invoices offline", icon: Receipt, category: "professional", path: "/tools/invoice-generator", keywords: ["invoice", "billing", "receipt", "business"] },
  { id: "business-card-generator", name: "Business Card Generator", description: "Design stunning business cards with multiple templates. Download print-ready PNG.", shortDescription: "Design business cards", icon: CreditCard, category: "professional", path: "/tools/business-card-generator", keywords: ["business card", "card maker", "professional", "design"] },
  { id: "portfolio-builder", name: "Portfolio Builder", description: "Build a professional portfolio website in minutes. Export as standalone HTML.", shortDescription: "Create portfolio websites", icon: FolderOpen, category: "professional", path: "/tools/portfolio-builder", keywords: ["portfolio", "website", "showcase", "projects"] },

  // Security Suite
  { id: "custom-encoder", name: "ToolSuiteX Encoder/Decoder", description: "Encode and decode text using our proprietary multi-layer cipher system. More secure than standard Base64.", shortDescription: "Proprietary encryption system", icon: Lock, category: "security", path: "/tools/custom-encoder", keywords: ["encode", "decode", "cipher", "encryption", "security"], featured: true },
  { id: "password-strength", name: "Password Strength Meter", description: "Analyze password security with detailed strength metrics and improvement suggestions.", shortDescription: "Check password security levels", icon: KeyRound, category: "security", path: "/tools/password-strength", keywords: ["password", "security", "strength", "checker"] },
  { id: "hash-generator", name: "Secure Hash Generator", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for text and files.", shortDescription: "Create cryptographic hashes", icon: Hash, category: "security", path: "/tools/hash-generator", keywords: ["hash", "MD5", "SHA", "checksum", "cryptography"] },
  
  { id: "secret-notes", name: "Secret Notes", description: "Create one-time viewing links for sensitive text. Self-destructs after reading.", shortDescription: "One-time secret messages", icon: EyeOff, category: "security", path: "/tools/secret-notes", keywords: ["secret", "one-time", "private", "self-destruct", "secure"] },

  // Developer Suite
  { id: "json-formatter", name: "JSON Formatter", description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.", shortDescription: "Format and validate JSON", icon: FileJson, category: "developer", path: "/tools/json-formatter", keywords: ["JSON", "format", "validate", "beautify", "API"], featured: true },
  { id: "code-minifier", name: "HTML/CSS/JS Minifier", description: "Minify your code to reduce file size and improve website loading speed.", shortDescription: "Compress code for production", icon: Minimize2, category: "developer", path: "/tools/code-minifier", keywords: ["minify", "compress", "HTML", "CSS", "JavaScript"] },
  { id: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries with proper indentation and syntax highlighting.", shortDescription: "Beautify SQL queries", icon: Database, category: "developer", path: "/tools/sql-formatter", keywords: ["SQL", "database", "query", "format"] },
  { id: "unit-converter", name: "Unit Converter", description: "Convert between various units including length, weight, temperature, and data sizes.", shortDescription: "Convert between units", icon: Calculator, category: "developer", path: "/tools/unit-converter", keywords: ["convert", "units", "measurement", "calculator"] },
  { id: "base-converter", name: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal systems.", shortDescription: "Convert number systems", icon: Binary, category: "developer", path: "/tools/base-converter", keywords: ["binary", "hex", "octal", "decimal", "convert"] },
  { id: "sitemap-generator", name: "Sitemap Generator", description: "Generate XML sitemaps for your website. Improve SEO with proper sitemap structure.", shortDescription: "Create XML sitemaps", icon: Map, category: "developer", path: "/tools/sitemap-generator", keywords: ["sitemap", "XML", "SEO", "website"] },
  { id: "fake-data-generator", name: "Fake Data Generator", description: "Generate realistic fake data for testing. Names, emails, addresses, and more.", shortDescription: "Generate test data", icon: TestTube, category: "developer", path: "/tools/fake-data-generator", keywords: ["fake data", "test data", "mock", "dummy"] },
  { id: "email-validator", name: "Email Validator", description: "Validate email addresses instantly. Check format, detect typos, and verify structure.", shortDescription: "Validate email format", icon: AtSign, category: "developer", path: "/tools/email-validator", keywords: ["email", "validate", "checker", "verify"] },
  { id: "phone-validator", name: "Phone Validator", description: "Validate phone numbers with country code detection. Format international numbers correctly.", shortDescription: "Validate phone numbers", icon: Phone, category: "developer", path: "/tools/phone-validator", keywords: ["phone", "validate", "format", "international"] },
  { id: "qr-code-generator", name: "QR Code Generator", description: "Generate QR codes for URLs, text, WiFi, email, phone, and locations. Free, no signup.", shortDescription: "Create QR codes", icon: QrCode, category: "developer", path: "/tools/qr-code-generator", keywords: ["QR code", "barcode", "scan", "generate"], featured: true },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes in multiple formats. Code 128, EAN-13, UPC, Code 39 and more.", shortDescription: "Create barcodes", icon: Barcode, category: "developer", path: "/tools/barcode-generator", keywords: ["barcode", "EAN", "UPC", "Code 128"] },
  { id: "seo-audit", name: "SEO Audit Tool", description: "Analyze HTML for on-page SEO issues. Check titles, meta tags, headings, and more.", shortDescription: "Audit SEO factors", icon: Search, category: "developer", path: "/tools/seo-audit", keywords: ["seo", "audit", "meta tags", "optimization"] },
  { id: "code-beautifier", name: "Code Beautifier", description: "Format and beautify minified JavaScript, CSS, and HTML code for better readability.", shortDescription: "Beautify minified code", icon: CodeIcon, category: "developer", path: "/tools/code-beautifier", keywords: ["beautify", "format", "minified", "js", "css", "html"], featured: true },

  // Content Suite
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and paragraphs with reading time estimation.", shortDescription: "Analyze text statistics", icon: AlignLeft, category: "content", path: "/tools/word-counter", keywords: ["word count", "character count", "text analysis"], featured: true },
  { id: "case-converter", name: "Case Converter", description: "Convert text between uppercase, lowercase, title case, sentence case, and more.", shortDescription: "Transform text case", icon: CaseSensitive, category: "content", path: "/tools/case-converter", keywords: ["uppercase", "lowercase", "title case", "text"] },
  { id: "markdown-editor", name: "Markdown Editor", description: "Write and preview Markdown with live rendering and export options.", shortDescription: "Edit Markdown with preview", icon: BookOpen, category: "content", path: "/tools/markdown-editor", keywords: ["markdown", "editor", "preview", "writing"] },
  { id: "lorem-generator", name: "Lorem Ipsum Generator", description: "Generate placeholder text for design mockups and content layouts.", shortDescription: "Generate placeholder text", icon: Wand2, category: "content", path: "/tools/lorem-generator", keywords: ["lorem ipsum", "placeholder", "dummy text"] },
  { id: "prompt-optimizer", name: "AI Prompt Optimizer", description: "Transform simple prompts into powerful, structured AI prompts using templates.", shortDescription: "Optimize AI prompts", icon: Sparkles, category: "content", path: "/tools/prompt-optimizer", keywords: ["prompt", "ai", "chatgpt", "llm", "prompt engineering"], featured: true },

  // Image Suite
  { id: "image-compressor", name: "Image Compressor", description: "Compress images without losing quality. Reduce file sizes for faster web loading.", shortDescription: "Optimize image file sizes", icon: Scaling, category: "image", path: "/tools/image-compressor", keywords: ["compress", "optimize", "reduce size", "image"], featured: true },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact dimensions or scale by percentage while maintaining aspect ratio.", shortDescription: "Resize images to any size", icon: Crop, category: "image", path: "/tools/image-resizer", keywords: ["resize", "scale", "dimensions", "image"] },
  { id: "image-converter", name: "Image Format Converter", description: "Convert images between PNG, JPG, WEBP, and other formats directly in your browser.", shortDescription: "Convert image formats", icon: FileImage, category: "image", path: "/tools/image-converter", keywords: ["convert", "PNG", "JPG", "WEBP", "format"] },
  { id: "color-picker", name: "Color Picker & Palette", description: "Pick colors from images, generate palettes, and convert between color formats.", shortDescription: "Pick and convert colors", icon: Palette, category: "image", path: "/tools/color-picker", keywords: ["color", "picker", "palette", "hex", "RGB"] },
  { id: "image-rotator", name: "Image Rotator & Flipper", description: "Rotate images by any angle or flip horizontally and vertically.", shortDescription: "Rotate and flip images", icon: RotateCw, category: "image", path: "/tools/image-rotator", keywords: ["rotate", "flip", "mirror", "image"] },
  { id: "logo-mockup", name: "Logo Mockup Generator", description: "Preview your logo on realistic product mockups. T-shirts, mugs, phone cases and more.", shortDescription: "Preview logos on products", icon: ImageIcon, category: "image", path: "/tools/logo-mockup", keywords: ["mockup", "logo", "brand", "preview"] },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert images to PDF documents. Combine multiple images into a single PDF file.", shortDescription: "Convert images to PDF", icon: Images, category: "image", path: "/tools/image-to-pdf", keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert"] },

  // PDF Suite (part of Developer)
  { id: "pdf-merge", name: "PDF Merge", description: "Combine multiple PDF files into a single document. Drag and drop to reorder pages.", shortDescription: "Merge PDF files", icon: Merge, category: "developer", path: "/tools/pdf-merge", keywords: ["pdf merge", "combine pdf", "join pdf"], featured: true },
  { id: "pdf-compress", name: "PDF Compress", description: "Reduce PDF file size without losing quality. Perfect for email and web uploads.", shortDescription: "Compress PDF files", icon: FileArchive, category: "developer", path: "/tools/pdf-compress", keywords: ["pdf compress", "reduce pdf", "shrink pdf"] },
  { id: "pdf-split", name: "PDF Split", description: "Extract specific pages or split a PDF into individual page files.", shortDescription: "Split PDF pages", icon: Scissors, category: "developer", path: "/tools/pdf-split", keywords: ["pdf split", "extract pages", "separate pdf"] },

  // New Developer Tools
  { id: "text-diff", name: "Text Diff", description: "Compare two blocks of text and highlight differences line by line.", shortDescription: "Compare text differences", icon: GitCompare, category: "developer", path: "/tools/text-diff", keywords: ["diff", "compare", "text comparison", "changes"] },
  { id: "regex-tester", name: "Regex Tester", description: "Test and debug regular expressions with real-time matching and group highlighting.", shortDescription: "Test regex patterns", icon: Regex, category: "developer", path: "/tools/regex-tester", keywords: ["regex", "regular expression", "pattern matching"], featured: true },
  { id: "json-to-csv", name: "JSON to CSV Converter", description: "Convert JSON data to CSV format and vice versa with nested object support.", shortDescription: "Convert JSON ↔ CSV", icon: FileSpreadsheet, category: "developer", path: "/tools/json-to-csv", keywords: ["json", "csv", "convert", "spreadsheet"] },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO-optimized meta tags, Open Graph, and Twitter Card tags.", shortDescription: "Generate meta tags", icon: Tags, category: "developer", path: "/tools/meta-tag-generator", keywords: ["meta tags", "seo", "open graph", "twitter cards"] },
  { id: "cron-builder", name: "Cron Expression Builder", description: "Build and understand cron expressions with a visual editor.", shortDescription: "Build cron schedules", icon: Clock, category: "developer", path: "/tools/cron-builder", keywords: ["cron", "schedule", "automation", "jobs"] },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens to view header and payload data.", shortDescription: "Decode JWT tokens", icon: Key, category: "developer", path: "/tools/jwt-decoder", keywords: ["jwt", "token", "authentication", "decode"] },
  { id: "url-shortener", name: "URL Shortener", description: "Create short, memorable links for your URLs (stored locally).", shortDescription: "Shorten URLs", icon: Link2, category: "developer", path: "/tools/url-shortener", keywords: ["url", "shortener", "links", "short link"] },
  { id: "timestamp-converter", name: "Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates.", shortDescription: "Convert timestamps", icon: Timer, category: "developer", path: "/tools/timestamp-converter", keywords: ["timestamp", "unix", "date", "epoch"] },

  // New Image Tools
  { id: "favicon-generator", name: "Favicon Generator", description: "Generate favicons in all required sizes from a single image.", shortDescription: "Create favicons", icon: ImageLucide, category: "image", path: "/tools/favicon-generator", keywords: ["favicon", "icon", "website icon", "pwa"] },
  { id: "css-gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients with a visual editor.", shortDescription: "Create CSS gradients", icon: PaintBucket, category: "image", path: "/tools/css-gradient-generator", keywords: ["gradient", "css", "background", "colors"], featured: true },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Optimize and minify SVG files to reduce file size.", shortDescription: "Optimize SVG files", icon: FileCode, category: "image", path: "/tools/svg-optimizer", keywords: ["svg", "optimize", "minify", "vector"] }
];

export function getToolsByCategory(category: ToolCategory): Tool[] { return tools.filter(tool => tool.category === category); }
export function getToolById(id: string): Tool | undefined { return tools.find(tool => tool.id === id); }
export function getFeaturedTools(): Tool[] { return tools.filter(tool => tool.featured); }
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool => tool.name.toLowerCase().includes(lowerQuery) || tool.description.toLowerCase().includes(lowerQuery) || tool.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
}
export function getCategoryById(id: ToolCategory): CategoryInfo | undefined { return categories.find(cat => cat.id === id); }

export function getRelatedTools(toolId: string, count: number = 5): Tool[] {
  const currentTool = getToolById(toolId);
  if (!currentTool) return [];
  
  // First: same category tools
  const sameCat = tools.filter(t => t.id !== toolId && t.category === currentTool.category);
  
  // Then: tools with overlapping keywords
  const otherTools = tools.filter(t => t.id !== toolId && t.category !== currentTool.category);
  const scored = otherTools.map(t => {
    const overlap = t.keywords.filter(k => 
      currentTool.keywords.some(ck => ck.toLowerCase() === k.toLowerCase())
    ).length;
    return { tool: t, score: overlap };
  }).sort((a, b) => b.score - a.score);
  
  const result = [...sameCat, ...scored.map(s => s.tool)];
  return result.slice(0, count);
}
