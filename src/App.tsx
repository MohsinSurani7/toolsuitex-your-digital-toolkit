import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { ScrollToTop } from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";

// Eagerly load main pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const Tools = lazy(() => import("./pages/Tools"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Lazy load tool pages
const ResumeBuilder = lazy(() => import("./pages/tools/ResumeBuilder"));
const CVMaker = lazy(() => import("./pages/tools/CVMaker"));
const CoverLetterGenerator = lazy(() => import("./pages/tools/CoverLetterGenerator"));
const InvoiceGenerator = lazy(() => import("./pages/tools/InvoiceGenerator"));
const BusinessCardGenerator = lazy(() => import("./pages/tools/BusinessCardGenerator"));
const PortfolioBuilder = lazy(() => import("./pages/tools/PortfolioBuilder"));
const CustomEncoder = lazy(() => import("./pages/tools/CustomEncoder"));
const PasswordStrength = lazy(() => import("./pages/tools/PasswordStrength"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const CodeMinifier = lazy(() => import("./pages/tools/CodeMinifier"));
const SQLFormatter = lazy(() => import("./pages/tools/SQLFormatter"));
const UnitConverter = lazy(() => import("./pages/tools/UnitConverter"));
const BaseConverter = lazy(() => import("./pages/tools/BaseConverter"));
const SitemapGenerator = lazy(() => import("./pages/tools/SitemapGenerator"));
const FakeDataGenerator = lazy(() => import("./pages/tools/FakeDataGenerator"));
const EmailValidator = lazy(() => import("./pages/tools/EmailValidator"));
const PhoneValidator = lazy(() => import("./pages/tools/PhoneValidator"));
const QRCodeGenerator = lazy(() => import("./pages/tools/QRCodeGenerator"));
const BarcodeGenerator = lazy(() => import("./pages/tools/BarcodeGenerator"));
const WordCounter = lazy(() => import("./pages/tools/WordCounter"));
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const MarkdownEditor = lazy(() => import("./pages/tools/MarkdownEditor"));
const LoremGenerator = lazy(() => import("./pages/tools/LoremGenerator"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const ImageConverter = lazy(() => import("./pages/tools/ImageConverter"));
const ColorPicker = lazy(() => import("./pages/tools/ColorPicker"));
const ImageRotator = lazy(() => import("./pages/tools/ImageRotator"));
const LogoMockup = lazy(() => import("./pages/tools/LogoMockup"));
const PDFMerge = lazy(() => import("./pages/tools/PDFMerge"));
const PDFCompress = lazy(() => import("./pages/tools/PDFCompress"));
const ImageToPDF = lazy(() => import("./pages/tools/ImageToPDF"));
const PromptOptimizer = lazy(() => import("./pages/tools/PromptOptimizer"));
const SecretNotes = lazy(() => import("./pages/tools/SecretNotes"));
const SEOAudit = lazy(() => import("./pages/tools/SEOAudit"));
const CodeBeautifier = lazy(() => import("./pages/tools/CodeBeautifier"));
const TextDiff = lazy(() => import("./pages/tools/TextDiff"));
const PDFSplit = lazy(() => import("./pages/tools/PDFSplit"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const JsonToCsv = lazy(() => import("./pages/tools/JsonToCsv"));
const FaviconGenerator = lazy(() => import("./pages/tools/FaviconGenerator"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const CronBuilder = lazy(() => import("./pages/tools/CronBuilder"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const UrlShortener = lazy(() => import("./pages/tools/UrlShortener"));
const TimestampConverter = lazy(() => import("./pages/tools/TimestampConverter"));
const CssGradientGenerator = lazy(() => import("./pages/tools/CssGradientGenerator"));
const SvgOptimizer = lazy(() => import("./pages/tools/SvgOptimizer"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/tools/pdf-split" element={<PDFSplit />} />
              <Route path="/tools/text-diff" element={<TextDiff />} />
              <Route path="/tools/regex-tester" element={<RegexTester />} />
              <Route path="/tools/json-to-csv" element={<JsonToCsv />} />
              <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
              <Route path="/tools/meta-tag-generator" element={<MetaTagGenerator />} />
              <Route path="/tools/cron-builder" element={<CronBuilder />} />
              <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
              <Route path="/tools/url-shortener" element={<UrlShortener />} />
              <Route path="/tools/timestamp-converter" element={<TimestampConverter />} />
              <Route path="/tools/css-gradient-generator" element={<CssGradientGenerator />} />
              <Route path="/tools/svg-optimizer" element={<SvgOptimizer />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
