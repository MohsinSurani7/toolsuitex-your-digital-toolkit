import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Tool, getCategoryById, getRelatedTools, categories } from "@/lib/tools-data";
import { KnowledgeHub, KnowledgeHubProps } from "@/components/seo/KnowledgeHub";
import { usePageSEO } from "@/hooks/use-page-seo";
import { toast } from "sonner";

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
  seoContent: Omit<KnowledgeHubProps, "toolName">;
}

export function ToolLayout({ tool, children, seoContent }: ToolLayoutProps) {
  const category = getCategoryById(tool.category);
  const relatedTools = getRelatedTools(tool.id, 6);
  const toolUrl = `https://toolsuitex.online/tools/${tool.id}`;

  usePageSEO({
    title: `${tool.name} - Free Online ${tool.name} | ToolSuiteX`,
    description: seoContent.description || tool.description,
    canonical: toolUrl,
  });

  // JSON-LD Structured Data
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "url": toolUrl,
      "description": seoContent.description || tool.description,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "ToolSuiteX",
        "url": "https://toolsuitex.online"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150",
        "bestRating": "5"
      },
      ...(seoContent.faqs && seoContent.faqs.length > 0 ? {} : {})
    };

    const faqJsonLd = seoContent.faqs && seoContent.faqs.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": seoContent.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    } : null;

    // Inject WebApplication JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-webapp";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // Inject FAQPage JSON-LD
    let faqScript: HTMLScriptElement | null = null;
    if (faqJsonLd) {
      faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.id = "jsonld-faq";
      faqScript.textContent = JSON.stringify(faqJsonLd);
      document.head.appendChild(faqScript);
    }

    return () => {
      document.getElementById("jsonld-webapp")?.remove();
      document.getElementById("jsonld-faq")?.remove();
    };
  }, [tool, seoContent, toolUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - ToolSuiteX`,
          text: tool.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Layout>
      {/* Tool Header */}
      <section className="py-8 md:py-12 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Breadcrumb - using <a> tags for SEO */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span>/</span>
              <a href="/tools" className="hover:text-primary transition-colors">Tools</a>
              <span>/</span>
              {category && (
                <>
                  <a 
                    href={`/tools?category=${category.id}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </a>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{tool.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category?.gradient || 'from-primary to-accent'} flex items-center justify-center shrink-0`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.name}</h1>
                  <p className="text-muted-foreground">{tool.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <a href="/tools">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Tools
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tool Interface */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </section>

      {/* Related Tools Section - HTML anchor links for SEO */}
      {relatedTools.length > 0 && (
        <section className="py-12 md:py-16 border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Related Tools</h2>
            <p className="text-muted-foreground mb-8">
              You might also find these tools useful
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => {
                const relCat = getCategoryById(relTool.category);
                return (
                  <a
                    key={relTool.id}
                    href={relTool.path}
                    className="group flex items-start gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${relCat?.gradient || 'from-primary to-accent'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <relTool.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {relTool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {relTool.shortDescription}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SEO Knowledge Hub */}
      <KnowledgeHub toolName={tool.name} {...seoContent} />
    </Layout>
  );
}
