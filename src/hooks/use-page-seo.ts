import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = "https://toolsuitex.online/og-image.png";
const SITE_NAME = "ToolSuiteX";

function setMetaTag(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function usePageSEO({ title, description, canonical, ogImage }: PageSEOProps) {
  useEffect(() => {
    const safeDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;
    const image = ogImage || DEFAULT_OG_IMAGE;

    document.title = title;

    // Meta description
    setMetaTag("name", "description", safeDescription);

    // Open Graph / Facebook / LinkedIn
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", safeDescription);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:image:alt", title);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:type", "website");
    if (canonical) {
      setMetaTag("property", "og:url", canonical);
    }

    // Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", safeDescription);
    setMetaTag("name", "twitter:image", image);
    setMetaTag("name", "twitter:image:alt", title);

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    return () => {
      document.title = "ToolSuiteX - 50+ Free Browser-Based Tools for Professionals";
      const defaultDesc = "ToolSuiteX offers 50+ free browser-based tools: Resume Builder, Image Compressor, JSON Formatter & more. 100% private, your data never leaves your device.";
      setMetaTag("name", "description", defaultDesc);
      setMetaTag("property", "og:image", DEFAULT_OG_IMAGE);
    };
  }, [title, description, canonical, ogImage]);
}
