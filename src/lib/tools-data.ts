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
  { id: "resume-builder", name: "AI Resume Builder", description: "Create professional, ATS-friendly resumes with 12+ themes, 500+ colors, and PDF export. Free online resume builder with no signup required.", shortDescription: "Build ATS-optimized resumes instantly", icon: FileText, category: "professional", path: "/tools/resume-builder", keywords: ["resume", "CV", "job", "career", "ATS", "professional"], featured: true },
  { id: "cv-maker", name: "CV Maker", description: "Design comprehensive academic CVs with detailed sections for education, publications, awards, and skills. 12+ themes with PDF export.", shortDescription: "Create detailed academic CVs", icon: FileCheck, category: "professional", path: "/tools/cv-maker", keywords: ["CV", "curriculum vitae", "academic", "portfolio"] },
  { id: "cover-letter-generator", name: "Cover Letter Generator", description: "Generate compelling, professional cover letters tailored to job descriptions and company culture. Free online cover letter builder with templates.", shortDescription: "Craft persuasive cover letters", icon: Mail, category: "professional", path: "/tools/cover-letter-generator", keywords: ["cover letter", "job application", "hiring"] },
  { id: "invoice-generator", name: "Invoice Generator", description: "Create professional invoices offline with automatic calculations and PDF export. Free invoice generator, no signup needed. Data stays in your browser.", shortDescription: "Create invoices offline", icon: Receipt, category: "professional", path: "/tools/invoice-generator", keywords: ["invoice", "billing", "receipt", "business"] },
  { id: "business-card-generator", name: "Business Card Generator", description: "Design professional double-sided business cards online for free. 500+ colors, gradient presets, custom logos, multiple layouts, and PDF export.", shortDescription: "Design business cards", icon: CreditCard, category: "professional", path: "/tools/business-card-generator", keywords: ["business card", "card maker", "professional", "design"] },
  { id: "portfolio-builder", name: "Portfolio Builder", description: "Build a professional portfolio website in minutes with 12+ templates. Customize colors, gradients, and text. Export as standalone HTML, no coding.", shortDescription: "Create portfolio websites", icon: FolderOpen, category: "professional", path: "/tools/portfolio-builder", keywords: ["portfolio", "website", "showcase", "projects"] },

  // Security Suite
  { id: "custom-encoder", name: "ToolSuiteX Encoder/Decoder", description: "Encode and decode text using our proprietary multi-layer cipher system. More secure than standard Base64 with custom character mappings.", shortDescription: "Proprietary encryption system", icon: Lock, category: "security", path: "/tools/custom-encoder", keywords: ["encode", "decode", "cipher", "encryption", "security"], featured: true },
  { id: "password-strength", name: "Password Strength Meter", description: "Check password strength with detailed security analysis, crack time estimates, and improvement tips. Generate strong passwords instantly.", shortDescription: "Check password security levels", icon: KeyRound, category: "security", path: "/tools/password-strength", keywords: ["password", "security", "strength", "checker"] },
  { id: "hash-generator", name: "Secure Hash Generator", description: "Generate SHA-256, SHA-384, SHA-512, and SHA-1 cryptographic hashes for text and files. Free browser-based hash generator, no data sent to servers.", shortDescription: "Create cryptographic hashes", icon: Hash, category: "security", path: "/tools/hash-generator", keywords: ["hash", "MD5", "SHA", "checksum", "cryptography"] },
  
  { id: "secret-notes", name: "Secret Notes", description: "Create encrypted secret notes with shareable links. Data is encrypted in the URL itself - nothing is stored on any server. Complete privacy guaranteed.", shortDescription: "One-time secret messages", icon: EyeOff, category: "security", path: "/tools/secret-notes", keywords: ["secret", "one-time", "private", "self-destruct", "secure"] },

  // Developer Suite
  { id: "json-formatter", name: "JSON Formatter", description: "Format, validate, and beautify JSON data with syntax highlighting and error detection. Perfect for developers working with APIs and configuration files.", shortDescription: "Format and validate JSON", icon: FileJson, category: "developer", path: "/tools/json-formatter", keywords: ["JSON", "format", "validate", "beautify", "API"], featured: true },
  { id: "code-minifier", name: "HTML/CSS/JS Minifier", description: "Minify HTML, CSS, and JavaScript code to reduce file sizes and boost website loading speed. Free browser-based minifier with instant results.", shortDescription: "Compress code for production", icon: Minimize2, category: "developer", path: "/tools/code-minifier", keywords: ["minify", "compress", "HTML", "CSS", "JavaScript"] },
  { id: "sql-formatter", name: "SQL Formatter", description: "Format and beautify SQL queries with proper indentation and syntax highlighting. Free online SQL formatter for cleaner, readable database queries.", shortDescription: "Beautify SQL queries", icon: Database, category: "developer", path: "/tools/sql-formatter", keywords: ["SQL", "database", "query", "format"] },
  { id: "unit-converter", name: "Unit Converter", description: "Free online unit converter for length, weight, temperature, data storage, and time. Instant results with high-precision calculations in your browser.", shortDescription: "Convert between units", icon: Calculator, category: "developer", path: "/tools/unit-converter", keywords: ["convert", "units", "measurement", "calculator"] },
  { id: "base-converter", name: "Number Base Converter", description: "Convert numbers between binary, octal, decimal, and hexadecimal systems instantly. Free online number base converter for developers and students.", shortDescription: "Convert number systems", icon: Binary, category: "developer", path: "/tools/base-converter", keywords: ["binary", "hex", "octal", "decimal", "convert"] },
  { id: "sitemap-generator", name: "Sitemap Generator", description: "Generate SEO-friendly XML sitemaps for your website with customizable priority and crawl frequency. Free sitemap generator, no signup required.", shortDescription: "Create XML sitemaps", icon: Map, category: "developer", path: "/tools/sitemap-generator", keywords: ["sitemap", "XML", "SEO", "website"] },
  { id: "fake-data-generator", name: "Fake Data Generator", description: "Generate realistic fake data for testing and development. Names, emails, addresses, phone numbers, and more. Export as JSON or CSV instantly.", shortDescription: "Generate test data", icon: TestTube, category: "developer", path: "/tools/fake-data-generator", keywords: ["fake data", "test data", "mock", "dummy"] },
  { id: "email-validator", name: "Email Validator", description: "Validate email addresses instantly with format checking, typo detection, and structure verification. Supports bulk validation. Free online tool.", shortDescription: "Validate email format", icon: AtSign, category: "developer", path: "/tools/email-validator", keywords: ["email", "validate", "checker", "verify"] },
  { id: "phone-validator", name: "Phone Validator", description: "Validate phone numbers with automatic country code detection and international formatting. Supports bulk validation for US, UK, India, and more.", shortDescription: "Validate phone numbers", icon: Phone, category: "developer", path: "/tools/phone-validator", keywords: ["phone", "validate", "format", "international"] },
  { id: "qr-code-generator", name: "QR Code Generator", description: "Generate custom QR codes for URLs, text, WiFi credentials, email, phone numbers, and locations. Free online QR code maker with color options.", shortDescription: "Create QR codes", icon: QrCode, category: "developer", path: "/tools/qr-code-generator", keywords: ["QR code", "barcode", "scan", "generate"], featured: true },
  { id: "barcode-generator", name: "Barcode Generator", description: "Generate barcodes in Code 128, EAN-13, UPC, Code 39, and more formats. Customizable appearance with high-resolution PNG export. Free online tool.", shortDescription: "Create barcodes", icon: Barcode, category: "developer", path: "/tools/barcode-generator", keywords: ["barcode", "EAN", "UPC", "Code 128"] },
  { id: "seo-audit", name: "SEO Audit Tool", description: "Analyze your HTML for on-page SEO issues including title tags, meta descriptions, heading hierarchy, and image alt text. Get a 0-100 SEO score.", shortDescription: "Audit SEO factors", icon: Search, category: "developer", path: "/tools/seo-audit", keywords: ["seo", "audit", "meta tags", "optimization"] },
  { id: "code-beautifier", name: "Code Beautifier", description: "Format and beautify minified JavaScript, CSS, and HTML code for better readability. Free online code beautifier with proper indentation output.", shortDescription: "Beautify minified code", icon: CodeIcon, category: "developer", path: "/tools/code-beautifier", keywords: ["beautify", "format", "minified", "js", "css", "html"], featured: true },

  // Content Suite
  { id: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and paragraphs instantly. Get reading and speaking time estimates for your content. Free online text analyzer.", shortDescription: "Analyze text statistics", icon: AlignLeft, category: "content", path: "/tools/word-counter", keywords: ["word count", "character count", "text analysis"], featured: true },
  { id: "case-converter", name: "Case Converter", description: "Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, and more. Free online text case transformation tool.", shortDescription: "Transform text case", icon: CaseSensitive, category: "content", path: "/tools/case-converter", keywords: ["uppercase", "lowercase", "title case", "text"] },
  { id: "markdown-editor", name: "Markdown Editor", description: "Write and preview Markdown with live rendering, syntax highlighting, and export to .md or .html. Free online Markdown editor for developers.", shortDescription: "Edit Markdown with preview", icon: BookOpen, category: "content", path: "/tools/markdown-editor", keywords: ["markdown", "editor", "preview", "writing"] },
  { id: "lorem-generator", name: "Lorem Ipsum Generator", description: "Generate Lorem Ipsum placeholder text for designs, mockups, and prototypes. Choose words, sentences, or paragraphs. Free online Lorem Ipsum generator.", shortDescription: "Generate placeholder text", icon: Wand2, category: "content", path: "/tools/lorem-generator", keywords: ["lorem ipsum", "placeholder", "dummy text"] },
  { id: "prompt-optimizer", name: "AI Prompt Optimizer", description: "Transform simple prompts into powerful, structured AI prompts for ChatGPT, Claude, and Gemini. Free template-based prompt optimizer for better results.", shortDescription: "Optimize AI prompts", icon: Sparkles, category: "content", path: "/tools/prompt-optimizer", keywords: ["prompt", "ai", "chatgpt", "llm", "prompt engineering"], featured: true },

  // Image Suite
  { id: "image-compressor", name: "Image Compressor", description: "Compress images without losing quality. Reduce file sizes by up to 80% for faster website loading. All processing happens in your browser.", shortDescription: "Optimize image file sizes", icon: Scaling, category: "image", path: "/tools/image-compressor", keywords: ["compress", "optimize", "reduce size", "image"], featured: true },
  { id: "image-resizer", name: "Image Resizer", description: "Resize images to exact pixel dimensions or scale by percentage while maintaining aspect ratio. Free browser-based tool, no uploads to servers.", shortDescription: "Resize images to any size", icon: Crop, category: "image", path: "/tools/image-resizer", keywords: ["resize", "scale", "dimensions", "image"] },
  { id: "image-converter", name: "Image Format Converter", description: "Convert images between PNG, JPG, and WEBP formats with adjustable quality settings. Free browser-based converter, your files never leave your device.", shortDescription: "Convert image formats", icon: FileImage, category: "image", path: "/tools/image-converter", keywords: ["convert", "PNG", "JPG", "WEBP", "format"] },
  { id: "color-picker", name: "Color Picker & Palette", description: "Pick colors, generate complementary palettes, and convert between HEX, RGB, and HSL formats. Free online color picker for designers and developers.", shortDescription: "Pick and convert colors", icon: Palette, category: "image", path: "/tools/color-picker", keywords: ["color", "picker", "palette", "hex", "RGB"] },
  { id: "image-rotator", name: "Image Rotator & Flipper", description: "Rotate images by any angle or flip horizontally and vertically. Free browser-based image rotator with live preview and instant PNG download.", shortDescription: "Rotate and flip images", icon: RotateCw, category: "image", path: "/tools/image-rotator", keywords: ["rotate", "flip", "mirror", "image"] },
  { id: "logo-mockup", name: "Logo Mockup Generator", description: "Preview your logo on realistic product mockups including T-shirts, mugs, phone cases, tote bags, and billboards. Free online mockup generator.", shortDescription: "Preview logos on products", icon: ImageIcon, category: "image", path: "/tools/logo-mockup", keywords: ["mockup", "logo", "brand", "preview"] },
  { id: "image-to-pdf", name: "Image to PDF", description: "Convert JPG, PNG, and WEBP images to PDF documents. Combine multiple images into one PDF with custom page sizes and orientation. Free online tool.", shortDescription: "Convert images to PDF", icon: Images, category: "image", path: "/tools/image-to-pdf", keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert"] },

  // PDF Suite (part of Developer)
  { id: "pdf-merge", name: "PDF Merge", description: "Merge multiple PDF files into one document with drag-and-drop reordering. Free browser-based PDF merger, no file uploads to servers. 100% private.", shortDescription: "Merge PDF files", icon: Merge, category: "developer", path: "/tools/pdf-merge", keywords: ["pdf merge", "combine pdf", "join pdf"], featured: true },
  { id: "pdf-compress", name: "PDF Compress", description: "Reduce PDF file sizes by up to 80% while maintaining visual quality. Perfect for email attachments and web uploads. Free, private, browser-based.", shortDescription: "Compress PDF files", icon: FileArchive, category: "developer", path: "/tools/pdf-compress", keywords: ["pdf compress", "reduce pdf", "shrink pdf"] },
  { id: "pdf-split", name: "PDF Split", description: "Split PDF documents into individual pages or extract specific page ranges. Free, no uploads to servers. Everything runs in your browser.", shortDescription: "Split PDF pages", icon: Scissors, category: "developer", path: "/tools/pdf-split", keywords: ["pdf split", "extract pages", "separate pdf"] },

  // New Developer Tools
  { id: "text-diff", name: "Text Diff", description: "Compare two text blocks and highlight additions, removals, and unchanged lines with color coding. Free online text diff tool for code review.", shortDescription: "Compare text differences", icon: GitCompare, category: "developer", path: "/tools/text-diff", keywords: ["diff", "compare", "text comparison", "changes"] },
  { id: "regex-tester", name: "Regex Tester", description: "Test and debug regular expressions with real-time matching, group highlighting, and common pattern library. Free online regex tester for developers.", shortDescription: "Test regex patterns", icon: Regex, category: "developer", path: "/tools/regex-tester", keywords: ["regex", "regular expression", "pattern matching"], featured: true },
  { id: "json-to-csv", name: "JSON to CSV Converter", description: "Convert JSON to CSV and vice versa. Handles nested objects, arrays, and custom delimiters. Free online converter with download and copy options.", shortDescription: "Convert JSON ↔ CSV", icon: FileSpreadsheet, category: "developer", path: "/tools/json-to-csv", keywords: ["json", "csv", "convert", "spreadsheet"] },
  { id: "meta-tag-generator", name: "Meta Tag Generator", description: "Generate SEO-optimized meta tags, Open Graph tags, and Twitter Card tags for your website with live preview. Free online meta tag generator tool.", shortDescription: "Generate meta tags", icon: Tags, category: "developer", path: "/tools/meta-tag-generator", keywords: ["meta tags", "seo", "open graph", "twitter cards"] },
  { id: "cron-builder", name: "Cron Expression Builder", description: "Build and understand cron expressions with a visual editor, preset templates, and human-readable explanations. Free online cron schedule builder.", shortDescription: "Build cron schedules", icon: Clock, category: "developer", path: "/tools/cron-builder", keywords: ["cron", "schedule", "automation", "jobs"] },
  { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JSON Web Tokens to view header, payload, and expiration data. Free browser-based JWT decoder with claim inspection.", shortDescription: "Decode JWT tokens", icon: Key, category: "developer", path: "/tools/jwt-decoder", keywords: ["jwt", "token", "authentication", "decode"] },
  { id: "url-shortener", name: "URL Shortener", description: "Create short, memorable links for your URLs with custom aliases. Stored locally in your browser for complete privacy. Free URL shortener tool.", shortDescription: "Shorten URLs", icon: Link2, category: "developer", path: "/tools/url-shortener", keywords: ["url", "shortener", "links", "short link"] },
  { id: "timestamp-converter", name: "Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates with seconds and milliseconds support. Free online epoch converter with multiple formats.", shortDescription: "Convert timestamps", icon: Timer, category: "developer", path: "/tools/timestamp-converter", keywords: ["timestamp", "unix", "date", "epoch"] },

  // New Image Tools
  { id: "favicon-generator", name: "Favicon Generator", description: "Generate all required favicon sizes from a single image upload. Create icons for browsers, PWAs, Apple Touch, and Android devices. Free online tool.", shortDescription: "Create favicons", icon: ImageLucide, category: "image", path: "/tools/favicon-generator", keywords: ["favicon", "icon", "website icon", "pwa"] },
  { id: "css-gradient-generator", name: "CSS Gradient Generator", description: "Create beautiful CSS gradients with a visual editor. Linear, radial, and conic gradients with instant CSS code. Free online gradient generator.", shortDescription: "Create CSS gradients", icon: PaintBucket, category: "image", path: "/tools/css-gradient-generator", keywords: ["gradient", "css", "background", "colors"], featured: true },
  { id: "svg-optimizer", name: "SVG Optimizer", description: "Optimize and minify SVG files to reduce file size by up to 50% while preserving visual quality. Free browser-based SVG optimizer, no uploads.", shortDescription: "Optimize SVG files", icon: FileCode, category: "image", path: "/tools/svg-optimizer", keywords: ["svg", "optimize", "minify", "vector"] }
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
