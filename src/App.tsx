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
import NotFound from "./pages/NotFound";

// Tool Pages
import ResumeBuilder from "./pages/tools/ResumeBuilder";
import CVMaker from "./pages/tools/CVMaker";
import CoverLetterGenerator from "./pages/tools/CoverLetterGenerator";
import CustomEncoder from "./pages/tools/CustomEncoder";
import PasswordStrength from "./pages/tools/PasswordStrength";
import HashGenerator from "./pages/tools/HashGenerator";
import ShadowChat from "./pages/tools/ShadowChat";
import JsonFormatter from "./pages/tools/JsonFormatter";
import CodeMinifier from "./pages/tools/CodeMinifier";
import SQLFormatter from "./pages/tools/SQLFormatter";
import UnitConverter from "./pages/tools/UnitConverter";
import BaseConverter from "./pages/tools/BaseConverter";
import WordCounter from "./pages/tools/WordCounter";
import CaseConverter from "./pages/tools/CaseConverter";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import LoremGenerator from "./pages/tools/LoremGenerator";
import ImageCompressor from "./pages/tools/ImageCompressor";
import ImageResizer from "./pages/tools/ImageResizer";
import ImageConverter from "./pages/tools/ImageConverter";
import ColorPicker from "./pages/tools/ColorPicker";
import ImageRotator from "./pages/tools/ImageRotator";

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
            
            {/* Professional Suite */}
            <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
            <Route path="/tools/cv-maker" element={<CVMaker />} />
            <Route path="/tools/cover-letter-generator" element={<CoverLetterGenerator />} />
            
            {/* Security Suite */}
            <Route path="/tools/custom-encoder" element={<CustomEncoder />} />
            <Route path="/tools/password-strength" element={<PasswordStrength />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/shadow-chat" element={<ShadowChat />} />
            
            {/* Developer Suite */}
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/code-minifier" element={<CodeMinifier />} />
            <Route path="/tools/sql-formatter" element={<SQLFormatter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/base-converter" element={<BaseConverter />} />
            
            {/* Content Suite */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/markdown-editor" element={<MarkdownEditor />} />
            <Route path="/tools/lorem-generator" element={<LoremGenerator />} />
            
            {/* Image Suite */}
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-converter" element={<ImageConverter />} />
            <Route path="/tools/color-picker" element={<ColorPicker />} />
            <Route path="/tools/image-rotator" element={<ImageRotator />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
