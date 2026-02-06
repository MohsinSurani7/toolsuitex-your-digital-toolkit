import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BookOpen, HelpCircle, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface KnowledgeHubProps {
  toolName: string;
  description: string;
  content: string;
  keywords: string[];
  faqs: FAQItem[];
  aboutTool: string;
}

export function KnowledgeHub({
  toolName,
  description,
  content,
  keywords,
  faqs,
  aboutTool,
}: KnowledgeHubProps) {
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Knowledge Hub</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Complete Guide to <span className="text-gradient">{toolName}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Main Content */}
          <div className="glass-card p-8 mb-8">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>
          </div>

          {/* About This Tool */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">About {toolName}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutTool}
                </p>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Related Topics:</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            </div>
            
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border rounded-lg px-4 data-[state=open]:bg-muted/50"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
