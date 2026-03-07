import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { tools, categories, searchTools, getToolsByCategory, ToolCategory } from "@/lib/tools-data";
import { usePageSEO } from "@/hooks/use-page-seo";

export default function ToolsPage() {
  usePageSEO({
    title: "All Free Online Tools - Resume Builder, Image Compressor & More | ToolSuiteX",
    description: "Browse 50+ free online tools: Resume Builder, Invoice Generator, Image Compressor, JSON Formatter, QR Code Generator, and more. All browser-based, no signup required.",
    canonical: "https://toolsuitex.online/tools",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const activeCategory = searchParams.get("category") as ToolCategory | null;

  const filteredTools = useMemo(() => {
    let result = tools;
    
    if (activeCategory) {
      result = getToolsByCategory(activeCategory);
    }
    
    if (searchQuery) {
      result = searchTools(searchQuery).filter(
        tool => !activeCategory || tool.category === activeCategory
      );
    }
    
    return result;
  }, [activeCategory, searchQuery]);

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our complete collection of 50+ browser-based tools
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass input-glow"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Tools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Button
              variant={!activeCategory ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryClick(null)}
              className="rounded-full"
            >
              All Tools
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(cat.id)}
                className="rounded-full"
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No tools found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool, index) => {
                const category = categories.find(c => c.id === tool.category);
                
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={tool.path}
                      className="block tool-card group h-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category?.gradient || 'from-primary to-accent'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        {tool.featured && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {tool.shortDescription}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Open tool
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
