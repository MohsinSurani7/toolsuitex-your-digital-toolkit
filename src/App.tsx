import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Tool Pages
import ResumeBuilder from "./pages/tools/ResumeBuilder";
import CVMaker from "./pages/tools/CVMaker";
import CoverLetterGenerator from "./pages/tools/CoverLetterGenerator";
import InvoiceGenerator from "./pages/tools/InvoiceGenerator";
import BusinessCardGenerator from "./pages/tools/BusinessCardGenerator";
import PortfolioBuilder from "./pages/tools/PortfolioBuilder";
import CustomEncoder from "./pages/tools/CustomEncoder";
import PasswordStrength from "./pages/tools/PasswordStrength";
import HashGenerator from "./pages/tools/HashGenerator";
import ShadowChat from "./pages/tools/ShadowChat";
import JsonFormatter from "./pages/tools/JsonFormatter";
import CodeMinifier from "./pages/tools/CodeMinifier";
import SQLFormatter from "./pages/tools/SQLFormatter";
import UnitConverter from "./pages/tools/UnitConverter";
import BaseConverter from "./pages/tools/BaseConverter";
import SitemapGenerator from "./pages/tools/SitemapGenerator";
import FakeDataGenerator from "./pages/tools/FakeDataGenerator";
import EmailValidator from "./pages/tools/EmailValidator";
import PhoneValidator from "./pages/tools/PhoneValidator";
import QRCodeGenerator from "./pages/tools/QRCodeGenerator";
import BarcodeGenerator from "./pages/tools/BarcodeGenerator";
import WordCounter from "./pages/tools/WordCounter";
import CaseConverter from "./pages/tools/CaseConverter";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import LoremGenerator from "./pages/tools/LoremGenerator";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageConverter from "./pages/tools/ImageConverter";
import ColorPicker from "./pages/tools/ColorPicker";
import ImageRotator from "./pages/tools/ImageRotator";
import LogoMockup from "./pages/tools/LogoMockup";
import PDFMerge from "./pages/tools/PDFMerge";
import PDFCompress from "./pages/tools/PDFCompress";
import ImageToPDF from "./pages/tools/ImageToPDF";
import PromptOptimizer from "./pages/tools/PromptOptimizer";
import SecretNotes from "./pages/tools/SecretNotes";
import SEOAudit from "./pages/tools/SEOAudit";
import CodeBeautifier from "./pages/tools/CodeBeautifier";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Professional Suite */}
            <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
            <Route path="/tools/cv-maker" element={<CVMaker />} />
            <Route path="/tools/cover-letter-generator" element={<CoverLetterGenerator />} />
            <Route path="/tools/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/tools/business-card-generator" element={<BusinessCardGenerator />} />
            <Route path="/tools/portfolio-builder" element={<PortfolioBuilder />} />
            
            {/* Security Suite */}
            <Route path="/tools/custom-encoder" element={<CustomEncoder />} />
            <Route path="/tools/password-strength" element={<PasswordStrength />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/shadow-chat" element={<ShadowChat />} />
            <Route path="/tools/secret-notes" element={<SecretNotes />} />
            
            {/* Developer Suite */}
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/code-minifier" element={<CodeMinifier />} />
            <Route path="/tools/sql-formatter" element={<SQLFormatter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/base-converter" element={<BaseConverter />} />
            <Route path="/tools/sitemap-generator" element={<SitemapGenerator />} />
            <Route path="/tools/fake-data-generator" element={<FakeDataGenerator />} />
            <Route path="/tools/email-validator" element={<EmailValidator />} />
            <Route path="/tools/phone-validator" element={<PhoneValidator />} />
            <Route path="/tools/qr-code-generator" element={<QRCodeGenerator />} />
            <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
            <Route path="/tools/seo-audit" element={<SEOAudit />} />
            <Route path="/tools/code-beautifier" element={<CodeBeautifier />} />
            
            {/* Content Suite */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tools/lorem-generator" element={<LoremGenerator />} />
            <Route path="/tools/prompt-optimizer" element={<PromptOptimizer />} />
            
            {/* Image Suite */}
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-converter" element={<ImageConverter />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/image-rotator" element={<ImageRotator />} />
            <Route path="/tools/logo-mockup" element={<LogoMockup />} />
            <Route path="/tools/image-to-pdf" element={<ImageToPDF />} />
            
            {/* PDF Tools */}
            <Route path="/tools/pdf-merge" element={<PDFMerge />} />
            <Route path="/tools/pdf-compress" element={<PDFCompress />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
