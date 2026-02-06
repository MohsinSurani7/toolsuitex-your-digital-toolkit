import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Tool, getCategoryById } from "@/lib/tools-data";
import { KnowledgeHub, KnowledgeHubProps } from "@/components/seo/KnowledgeHub";
import { toast } from "sonner";

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
  seoContent: Omit<KnowledgeHubProps, "toolName">;
}

export function ToolLayout({ tool, children, seoContent }: ToolLayoutProps) {
  const category = getCategoryById(tool.category);

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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/tools" className="hover:text-primary transition-colors">Tools</Link>
              <span>/</span>
              {category && (
                <>
                  <Link 
                    to={`/tools?category=${category.id}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{tool.name}</span>
            </div>

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
                <Link to="/tools">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Tools
                  </Button>
                </Link>
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

      {/* SEO Knowledge Hub */}
      <KnowledgeHub toolName={tool.name} {...seoContent} />
    </Layout>
  );
}
