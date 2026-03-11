import { useEffect } from "react";

interface PageSEOProps {
  title: string;
  description: string;
  canonical?: string;
}

export function usePageSEO({ title, description, canonical }: PageSEOProps) {
  useEffect(() => {
    // Ensure description is within 160 chars
    const safeDescription = description.length > 160 ? description.substring(0, 157) + "..." : description;

    // Set document title
    document.title = title;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", safeDescription);

    // Set OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    // Set OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", safeDescription);

    // Set Twitter title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twTitle) {
      twTitle = document.createElement("meta");
      twTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twTitle);
    }
    twTitle.setAttribute("content", title);

    // Set Twitter description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement("meta");
      twDesc.setAttribute("name", "twitter:description");
      document.head.appendChild(twDesc);
    }
    twDesc.setAttribute("content", description);

    // Set canonical
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
      // Reset to defaults on unmount
      document.title = "ToolSuiteX - 50+ Free Browser-Based Tools for Professionals";
      const defaultDesc = "ToolSuiteX offers 50+ free browser-based tools: Resume Builder, Image Compressor, JSON Formatter & more. 100% private, your data never leaves your device.";
      metaDesc?.setAttribute("content", defaultDesc);
    };
  }, [title, description, canonical]);
}
