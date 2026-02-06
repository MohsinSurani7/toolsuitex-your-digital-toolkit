import { Link } from "react-router-dom";
import { Zap, Mail, Github, Twitter, Linkedin } from "lucide-react";
import { categories } from "@/lib/tools-data";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">ToolSuiteX</span>
            </Link>
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
                  <Link
                    to={`/tools?category=${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-semibold mb-4">Popular Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tools/resume-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/tools/json-formatter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  JSON Formatter
                </Link>
              </li>
              <li>
                <Link to="/tools/image-compressor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link to="/tools/word-counter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link to="/tools/custom-encoder" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ToolSuiteX Encoder
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
