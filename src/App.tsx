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
import CustomEncoder from "./pages/tools/CustomEncoder";
import JsonFormatter from "./pages/tools/JsonFormatter";
import WordCounter from "./pages/tools/WordCounter";
import ImageCompressor from "./pages/tools/ImageCompressor";

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
            
            {/* Tool Routes */}
            <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
            <Route path="/tools/custom-encoder" element={<CustomEncoder />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
