import { Zap, Mail } from "lucide-react";
import { categories, tools } from "@/lib/tools-data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">ToolSuiteX</span>
            </a>
            <p className="text-sm text-muted-foreground mb-4">
              50+ powerful browser-based tools for professionals, developers, and creators. 
              No uploads, no servers – everything runs locally in your browser.
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="mailto:sctv77834@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                sctv77834@gmail.com
              </a>
            </div>
          </div>

          {/* Tool Categories */}
          <div>
            <h4 className="font-semibold mb-4">Tool Suites</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/tools?category=${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-semibold mb-4">Popular Tools</h4>
            <ul className="space-y-2">
              {tools.filter(t => t.featured).slice(0, 8).map((tool) => (
                <li key={tool.id}>
                  <a href={tool.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Tools
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* All Tools Links - Full crawlable list for SEO */}
        <div className="border-t mt-8 pt-8">
          <h4 className="font-semibold mb-4">All Tools</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.path}
                className="text-xs text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ToolSuiteX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            100% Browser-Based • No Data Uploaded • Privacy First
          </p>
        </div>
      </div>
    </footer>
  );
}
