import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { componentTagger } from "lovable-tagger";

const SITE_URL = "https://toolsuitex.online";

interface RouteSEO {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  bodyContent?: string;
}

function truncateDescription(description: string) {
  return description.length > 160 ? `${description.substring(0, 157)}...` : description;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertMetaTag(html: string, attr: "name" | "property", key: string, content: string) {
  const safeContent = escapeHtml(content);
  const newTag = `<meta ${attr}="${key}" content="${safeContent}" />`;
  const pattern = new RegExp(`<meta[^>]*${attr}="${escapeRegex(key)}"[^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, newTag);
  }

  return html.replace("</head>", `    ${newTag}\n  </head>`);
}

function upsertCanonicalLink(html: string, canonical: string) {
  const safeCanonical = escapeHtml(canonical);
  const newTag = `<link rel="canonical" href="${safeCanonical}" />`;
  const pattern = /<link[^>]*rel="canonical"[^>]*>/i;

  if (pattern.test(html)) {
    return html.replace(pattern, newTag);
  }

  return html.replace("</head>", `    ${newTag}\n  </head>`);
}

function applyRouteSEO(baseHtml: string, routeSEO: RouteSEO) {
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(routeSEO.title)}</title>`);
  html = upsertMetaTag(html, "name", "description", routeSEO.description);
  html = upsertMetaTag(html, "property", "og:title", routeSEO.title);
  html = upsertMetaTag(html, "property", "og:description", routeSEO.description);
  html = upsertMetaTag(html, "property", "og:url", routeSEO.canonical);
  html = upsertMetaTag(html, "name", "twitter:title", routeSEO.title);
  html = upsertMetaTag(html, "name", "twitter:description", routeSEO.description);
  html = upsertCanonicalLink(html, routeSEO.canonical);

  html = html.replace(
    /<h1 style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">[\s\S]*?<\/h1>/i,
    `<h1 style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">${escapeHtml(routeSEO.h1)}</h1>`,
  );

  if (routeSEO.bodyContent) {
    html = html.replace(
      '</body>',
      `    <noscript><div class="seo-content" style="max-width:800px;margin:0 auto;padding:40px 20px;font-family:system-ui,sans-serif;line-height:1.7;color:#333;">${routeSEO.bodyContent}</div></noscript>\n  </body>`,
    );
  }

  return html;
}

function getStaticRoutesSEO(): Record<string, RouteSEO> {
  return {
    "/": {
      title: "ToolSuiteX - 50+ Free Browser-Based Tools for Professionals",
      description:
        "ToolSuiteX offers 50+ free browser-based tools: Resume Builder, Image Compressor, JSON Formatter & more. 100% private, your data never leaves your device.",
      canonical: `${SITE_URL}`,
      h1: "ToolSuiteX - 50+ Free Browser-Based Tools for Professionals",
      bodyContent: `<h2>Welcome to ToolSuiteX</h2><p>ToolSuiteX is a comprehensive collection of over 50 free browser-based tools designed for professionals, developers, designers, and content creators. Every tool runs entirely in your browser, meaning your data never leaves your device. We believe in complete privacy and zero data collection.</p><h3>Why Choose ToolSuiteX?</h3><p>Unlike other online tool platforms, ToolSuiteX processes everything client-side using modern web technologies. There are no file uploads to remote servers, no accounts required, and no tracking. Whether you need to build a resume, compress images, format code, or generate QR codes, our tools deliver instant results with professional quality.</p><h3>Our Tool Categories</h3><p><strong>Professional Suite:</strong> Create ATS-friendly resumes, academic CVs, cover letters, invoices, business cards, and portfolio websites. Perfect for job seekers and freelancers.</p><p><strong>Security Suite:</strong> Encrypt text with our proprietary cipher, check password strength, generate cryptographic hashes, and share secret notes securely.</p><p><strong>Developer Suite:</strong> Format JSON, minify code, beautify SQL, test regex patterns, decode JWTs, build cron expressions, compare text diffs, and much more.</p><p><strong>Content Suite:</strong> Count words and characters, convert text cases, edit Markdown with live preview, generate placeholder text, and optimize AI prompts.</p><p><strong>Image Suite:</strong> Compress images up to 80%, resize to exact dimensions, convert between PNG/JPG/WEBP, pick colors, rotate and flip images, create favicons, and generate CSS gradients.</p><h3>Trusted by Thousands</h3><p>ToolSuiteX is used daily by professionals worldwide who value speed, privacy, and reliability. All tools are free to use with no limitations, no watermarks, and no hidden fees. Start using any tool instantly — no signup required.</p>`,
    },
    "/tools": {
      title: "All Free Online Tools - Resume Builder, Image Compressor & More | ToolSuiteX",
      description:
        "Browse 50+ free online tools: Resume Builder, Image Compressor, JSON Formatter, QR Code Generator & more. All browser-based, no signup required.",
      canonical: `${SITE_URL}/tools`,
      h1: "All Tools",
      bodyContent: `<h2>Browse All Free Online Tools</h2><p>ToolSuiteX offers a growing collection of over 50 free browser-based tools organized into five categories: Professional, Security, Developer, Content, and Image tools. Each tool is designed to be fast, private, and easy to use with no signup or installation required.</p><p>Our Professional Suite includes an AI Resume Builder with 12+ themes and ATS optimization, a CV Maker for academic portfolios, a Cover Letter Generator, Invoice Generator, Business Card Generator, and Portfolio Builder. The Security Suite features our proprietary encoder/decoder, password strength meter, hash generator, and secret notes tool.</p><p>For developers, we offer a JSON Formatter, Code Minifier, SQL Formatter, Code Beautifier, Regex Tester, Text Diff tool, JSON to CSV converter, Meta Tag Generator, Cron Builder, JWT Decoder, URL Shortener, Timestamp Converter, and more. Content creators can use our Word Counter, Case Converter, Markdown Editor, Lorem Ipsum Generator, and AI Prompt Optimizer.</p><p>Our Image Suite includes an Image Compressor, Image Resizer, Image Format Converter, Color Picker, Image Rotator, Logo Mockup Generator, Image to PDF converter, Favicon Generator, CSS Gradient Generator, and SVG Optimizer. All image tools process files locally in your browser for maximum privacy.</p>`,
    },
    "/about": {
      title: "About ToolSuiteX - Free Browser-Based Tools for Everyone",
      description:
        "Learn about ToolSuiteX, a platform offering 50+ free browser-based tools with complete privacy. Your data never leaves your device.",
      canonical: `${SITE_URL}/about`,
      h1: "About ToolSuiteX",
      bodyContent: `<h2>About ToolSuiteX</h2><p>ToolSuiteX was created with a simple mission: provide free, high-quality online tools that respect user privacy. Every tool on our platform runs entirely in your browser using client-side JavaScript. This means your files, text, and data are never uploaded to any server.</p><p>We started with a handful of developer utilities and grew to over 50 tools spanning professional document creation, security and encryption, code formatting, content analysis, and image processing. Our tools are used by thousands of professionals, students, and developers worldwide.</p><h3>Our Privacy Promise</h3><p>We take privacy seriously. ToolSuiteX does not collect personal data, track usage patterns, or store any files you process. There are no accounts to create, no cookies to accept, and no data to worry about. Your work stays on your device, period.</p><h3>Built with Modern Technology</h3><p>ToolSuiteX is built using React, TypeScript, and modern web APIs like the Canvas API, Web Crypto API, and File API. This enables powerful processing capabilities directly in the browser without needing server-side infrastructure. The result is faster processing, better privacy, and a seamless user experience.</p>`,
    },
    "/contact": {
      title: "Contact Us - ToolSuiteX Support & Feedback",
      description:
        "Get in touch with ToolSuiteX team. Share feedback, report bugs, or suggest new tools. We'd love to hear from you.",
      canonical: `${SITE_URL}/contact`,
      h1: "Contact Us",
      bodyContent: `<h2>Contact ToolSuiteX</h2><p>We value your feedback and suggestions. Whether you have found a bug, want to request a new tool, or simply want to share your experience, we would love to hear from you. ToolSuiteX is continuously improving based on user feedback, and your input helps us build better tools for everyone.</p><p>You can reach us through the contact form on this page. We typically respond within 24-48 hours. For urgent issues or bugs that affect tool functionality, please include as much detail as possible including the tool name, browser version, and steps to reproduce the issue.</p><p>We are also open to partnership opportunities, guest content contributions, and feature collaboration. If you are a developer interested in contributing to ToolSuiteX or have ideas for new tools that would benefit our community, do not hesitate to reach out.</p>`,
    },
    "/privacy": {
      title: "Privacy Policy - ToolSuiteX",
      description:
        "ToolSuiteX privacy policy. Your data never leaves your browser. 100% client-side processing with no data collection.",
      canonical: `${SITE_URL}/privacy`,
      h1: "Privacy Policy",
      bodyContent: `<h2>ToolSuiteX Privacy Policy</h2><p>At ToolSuiteX, your privacy is our top priority. This privacy policy explains how our tools handle your data and why you can trust us with your sensitive information.</p><h3>Client-Side Processing</h3><p>All ToolSuiteX tools run entirely in your web browser. When you upload an image for compression, format JSON code, or create a resume, all processing happens locally on your device. No files or data are transmitted to our servers or any third-party services.</p><h3>No Data Collection</h3><p>We do not collect personal information, usage analytics, or browsing data. We do not use cookies for tracking purposes. We do not require account registration or email addresses to use any of our tools.</p><h3>No Third-Party Sharing</h3><p>Since we do not collect any data, there is nothing to share with third parties. Your documents, images, code, and text remain exclusively on your device throughout the entire process.</p><h3>Local Storage</h3><p>Some tools may use your browser's local storage to save preferences or recent work for your convenience. This data is stored only on your device and can be cleared at any time through your browser settings.</p>`,
    },
    "/terms": {
      title: "Terms of Service - ToolSuiteX",
      description:
        "ToolSuiteX terms of service. Read our usage guidelines and policies for using our free browser-based tools.",
      canonical: `${SITE_URL}/terms`,
      h1: "Terms of Service",
      bodyContent: `<h2>ToolSuiteX Terms of Service</h2><p>Welcome to ToolSuiteX. By accessing and using our website and tools, you agree to these terms of service. Please read them carefully before using our platform.</p><h3>Free Usage</h3><p>All tools on ToolSuiteX are provided free of charge for personal and commercial use. There are no usage limits, no watermarks on generated content, and no hidden fees. You may use the output from our tools in any way you see fit, including for commercial projects.</p><h3>No Warranty</h3><p>ToolSuiteX tools are provided as-is without any warranty of any kind. While we strive to ensure accuracy and reliability, we cannot guarantee that tools will be error-free or produce perfect results in every situation. Users are responsible for verifying the output of any tool before using it in production or professional contexts.</p><h3>Intellectual Property</h3><p>Content you create using ToolSuiteX tools belongs entirely to you. We claim no ownership or rights over resumes, images, documents, or any other output generated using our platform. The ToolSuiteX name, logo, and website design are our intellectual property.</p>`,
    },
  };
}

function getToolRoutesSEO(): Record<string, RouteSEO> {
  const toolsFilePath = path.resolve(__dirname, "./src/lib/tools-data.ts");
  const toolsSource = fs.readFileSync(toolsFilePath, "utf-8");
  const toolPattern = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*shortDescription:\s*"([^"]+)",[^}]*category:\s*"([^"]+)",[^}]*keywords:\s*\[([^\]]*)\]/g;

  const categoryLabels: Record<string, string> = {
    professional: "Professional Suite",
    security: "Security Suite",
    developer: "Developer Suite",
    content: "Content Suite",
    image: "Image Suite",
  };

  const toolRoutes: Record<string, RouteSEO> = {};
  let match: RegExpExecArray | null;

  while ((match = toolPattern.exec(toolsSource)) !== null) {
    const [, id, name, description, shortDesc, category, keywordsRaw] = match;
    const route = `/tools/${id}`;
    const title = `${name} - Free Online ${name} | ToolSuiteX`;
    const keywords = keywordsRaw.replace(/"/g, "").split(",").map((k: string) => k.trim()).filter(Boolean);
    const catLabel = categoryLabels[category] || category;

    const bodyContent = `<h2>${name} - Free Online Tool</h2><p>${description}</p><h3>Why Use Our ${name}?</h3><p>ToolSuiteX ${name} is a completely free, browser-based tool that processes everything locally on your device. Unlike other online tools, we never upload your data to any server. This means your files, text, and sensitive information remain 100% private and secure throughout the entire process.</p><h3>Key Features</h3><ul><li>Completely free with no usage limits or watermarks</li><li>No signup or account required to get started</li><li>100% browser-based — your data never leaves your device</li><li>Works on desktop, tablet, and mobile devices</li><li>Fast processing with instant results</li><li>Professional-quality output for personal and commercial use</li></ul><h3>How to Use ${name}</h3><p>Using our ${name} is simple and straightforward. Just open the tool, provide your input, configure any options to match your needs, and get instant results. There is no learning curve — the interface is designed to be intuitive for both beginners and experienced users. You can use the output for any purpose, including commercial projects, without attribution.</p><h3>Part of ${catLabel}</h3><p>The ${name} is part of our ${catLabel}, which includes a curated collection of related tools designed to work together seamlessly. ToolSuiteX offers over 50 free tools across five categories: Professional, Security, Developer, Content, and Image tools. Each tool is built with the same commitment to privacy, speed, and quality.</p><h3>Related Topics</h3><p>This tool is commonly used for: ${keywords.join(", ")}. Whether you are a developer, designer, content creator, student, or business professional, our ${name} helps you accomplish your tasks quickly and efficiently without compromising on quality or privacy.</p><h3>Frequently Asked Questions</h3><p><strong>Is ${name} really free?</strong> Yes, completely free with no hidden charges, premium tiers, or usage limits. All features are available to everyone.</p><p><strong>Is my data safe?</strong> Absolutely. All processing happens in your browser. We do not upload, store, or transmit any of your data to external servers.</p><p><strong>Do I need to create an account?</strong> No. You can start using ${name} immediately without any registration or login.</p><p><strong>Can I use the output commercially?</strong> Yes. Everything you create with our tools is yours to use however you wish, including for commercial purposes.</p>`;

    toolRoutes[route] = {
      title,
      description: truncateDescription(description),
      canonical: `${SITE_URL}${route}`,
      h1: name,
      bodyContent,
    };
  }

  return toolRoutes;
}

function routeSeoPrerenderPlugin(): Plugin {
  return {
    name: "route-seo-prerender",
    apply: "build",
    async writeBundle(outputOptions) {
      const distDir = outputOptions.dir
        ? path.resolve(outputOptions.dir)
        : path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");

      if (!fs.existsSync(indexPath)) return;

      const baseHtml = await fsPromises.readFile(indexPath, "utf-8");
      const routesSEO = {
        ...getStaticRoutesSEO(),
        ...getToolRoutesSEO(),
      };

      const rootHtml = applyRouteSEO(baseHtml, routesSEO["/"]);
      await fsPromises.writeFile(indexPath, rootHtml, "utf-8");

      const writeTasks = Object.entries(routesSEO)
        .filter(([route]) => route !== "/")
        .map(async ([route, seo]) => {
          const routeFilePath = path.join(distDir, route.replace(/^\//, ""), "index.html");
          await fsPromises.mkdir(path.dirname(routeFilePath), { recursive: true });
          await fsPromises.writeFile(routeFilePath, applyRouteSEO(baseHtml, seo), "utf-8");
        });

      await Promise.all(writeTasks);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), routeSeoPrerenderPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React instances
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
