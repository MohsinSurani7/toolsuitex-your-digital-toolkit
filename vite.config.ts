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
    },
    "/tools": {
      title: "All Free Online Tools - Resume Builder, Image Compressor & More | ToolSuiteX",
      description:
        "Browse 50+ free online tools: Resume Builder, Image Compressor, JSON Formatter, QR Code Generator & more. All browser-based, no signup required.",
      canonical: `${SITE_URL}/tools`,
      h1: "All Tools",
    },
    "/about": {
      title: "About ToolSuiteX - Free Browser-Based Tools for Everyone",
      description:
        "Learn about ToolSuiteX, a platform offering 50+ free browser-based tools with complete privacy. Your data never leaves your device.",
      canonical: `${SITE_URL}/about`,
      h1: "About ToolSuiteX",
    },
    "/contact": {
      title: "Contact Us - ToolSuiteX Support & Feedback",
      description:
        "Get in touch with ToolSuiteX team. Share feedback, report bugs, or suggest new tools. We'd love to hear from you.",
      canonical: `${SITE_URL}/contact`,
      h1: "Contact Us",
    },
    "/privacy": {
      title: "Privacy Policy - ToolSuiteX",
      description:
        "ToolSuiteX privacy policy. Your data never leaves your browser. 100% client-side processing with no data collection.",
      canonical: `${SITE_URL}/privacy`,
      h1: "Privacy Policy",
    },
    "/terms": {
      title: "Terms of Service - ToolSuiteX",
      description:
        "ToolSuiteX terms of service. Read our usage guidelines and policies for using our free browser-based tools.",
      canonical: `${SITE_URL}/terms`,
      h1: "Terms of Service",
    },
  };
}

function getToolRoutesSEO(): Record<string, RouteSEO> {
  const toolsFilePath = path.resolve(__dirname, "./src/lib/tools-data.ts");
  const toolsSource = fs.readFileSync(toolsFilePath, "utf-8");
  const toolPattern = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*shortDescription:/g;

  const toolRoutes: Record<string, RouteSEO> = {};
  let match: RegExpExecArray | null;

  while ((match = toolPattern.exec(toolsSource)) !== null) {
    const [, id, name, description] = match;
    const route = `/tools/${id}`;
    const title = `${name} - Free Online ${name} | ToolSuiteX`;

    toolRoutes[route] = {
      title,
      description: truncateDescription(description),
      canonical: `${SITE_URL}${route}`,
      h1: name,
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
