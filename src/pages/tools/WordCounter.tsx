import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlignLeft, Clock, FileText, Hash, Type } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
  avgWordLength: number;
  longestWord: string;
}

export default function WordCounterPage() {
  const tool = getToolById("word-counter")!;
  const [text, setText] = useState("");

  const stats = useMemo((): TextStats => {
    if (!text) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: "0 sec",
        speakingTime: "0 sec",
        avgWordLength: 0,
        longestWord: "-"
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    
    const lines = text.split(/\n/).length;

    // Reading time (200 words per minute average)
    const readingMinutes = wordCount / 200;
    let readingTime = "";
    if (readingMinutes < 1) {
      readingTime = `${Math.ceil(readingMinutes * 60)} sec`;
    } else {
      readingTime = `${Math.ceil(readingMinutes)} min`;
    }

    // Speaking time (130 words per minute average)
    const speakingMinutes = wordCount / 130;
    let speakingTime = "";
    if (speakingMinutes < 1) {
      speakingTime = `${Math.ceil(speakingMinutes * 60)} sec`;
    } else {
      speakingTime = `${Math.ceil(speakingMinutes)} min`;
    }

    // Average word length
    const totalWordChars = words.reduce((acc, w) => acc + w.length, 0);
    const avgWordLength = wordCount > 0 ? Math.round((totalWordChars / wordCount) * 10) / 10 : 0;

    // Longest word
    const longestWord = words.reduce((longest, current) => 
      current.length > longest.length ? current : longest, ""
    ) || "-";

    return {
      characters,
      charactersNoSpaces,
      words: wordCount,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      avgWordLength,
      longestWord: longestWord.length > 20 ? longestWord.slice(0, 20) + "..." : longestWord
    };
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.words, icon: Type },
    { label: "Characters", value: stats.characters, icon: Hash },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces, icon: Hash },
    { label: "Sentences", value: stats.sentences, icon: FileText },
    { label: "Paragraphs", value: stats.paragraphs, icon: AlignLeft },
    { label: "Lines", value: stats.lines, icon: AlignLeft },
    { label: "Reading Time", value: stats.readingTime, icon: Clock },
    { label: "Speaking Time", value: stats.speakingTime, icon: Clock },
  ];

  const seoContent = {
    description: "Count words, characters, sentences, and paragraphs instantly. Get reading and speaking time estimates for your content.",
    content: `
      <h3>Accurate Word and Character Counting</h3>
      <p>Whether you're writing an essay, blog post, tweet, or any content with length requirements, accurate word and character counts are essential. Our word counter provides instant, precise statistics as you type.</p>
      
      <h4>Perfect for Writers and Content Creators</h4>
      <p>Social media posts have character limits. Academic papers have word count requirements. SEO meta descriptions need to fit specific lengths. Our tool helps you hit your targets every time with real-time counting.</p>
      
      <h4>Reading Time Estimation</h4>
      <p>Based on the average adult reading speed of 200 words per minute, we calculate how long it will take someone to read your content. This helps you gauge content length for your audience and platform.</p>
      
      <h4>Speaking Time for Presentations</h4>
      <p>Preparing a speech or presentation? At the average speaking rate of 130 words per minute, we estimate your speaking time. This is invaluable for fitting presentations into time slots or meeting video length requirements.</p>
      
      <h4>Advanced Text Statistics</h4>
      <p>Beyond basic counts, we show sentence count, paragraph count, average word length, and your longest word. These metrics help you analyze and improve your writing style.</p>
    `,
    keywords: [
      "Word Counter Online",
      "Character Counter",
      "Text Statistics Tool",
      "Reading Time Calculator",
      "Speaking Time Estimator",
      "Letter Counter",
      "Sentence Counter",
      "Paragraph Counter",
      "Free Word Counter",
      "Writing Tool"
    ],
    faqs: [
      {
        question: "How is reading time calculated?",
        answer: "Reading time is calculated based on the average adult reading speed of 200 words per minute. This provides a good estimate for most readers, though actual reading speed varies by individual and content complexity."
      },
      {
        question: "What's the difference between character count with and without spaces?",
        answer: "Total character count includes all characters including spaces, tabs, and line breaks. Character count without spaces excludes all whitespace, which is useful for platforms that don't count spaces (like some SMS systems)."
      },
      {
        question: "How are sentences counted?",
        answer: "Sentences are counted by detecting sentence-ending punctuation: periods (.), question marks (?), and exclamation points (!). This provides an accurate count for standard English text."
      },
      {
        question: "Is my text stored or analyzed anywhere?",
        answer: "No. All counting and analysis happens locally in your browser using JavaScript. Your text never leaves your device, ensuring complete privacy for sensitive content."
      },
      {
        question: "Can I use this for different languages?",
        answer: "Yes! The word counter works with any language that uses spaces to separate words. Character counts work for all languages including those with special characters or scripts."
      },
      {
        question: "What's a good average word length?",
        answer: "In English, the average word length is about 4.5-5 characters. Higher averages might indicate complex vocabulary, while lower averages suggest simpler language. Neither is inherently better—it depends on your audience."
      }
    ],
    aboutTool: "The ToolSuiteX Word Counter provides comprehensive text analysis with instant results. Get accurate counts for words, characters, sentences, paragraphs, and lines. Plus, estimate reading and speaking times for your content. Perfect for writers, students, content creators, and anyone who needs precise text statistics. All analysis happens locally in your browser for complete privacy."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Average Word Length</div>
            <div className="text-xl font-semibold">{stats.avgWordLength} characters</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Longest Word</div>
            <div className="text-xl font-semibold font-mono">{stats.longestWord}</div>
          </Card>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter or paste your text:</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here to see real-time statistics..."
            className="h-80 text-base resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
