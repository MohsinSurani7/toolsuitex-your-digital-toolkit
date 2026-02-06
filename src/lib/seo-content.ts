// Helper to generate proper SEO content structure for tool pages
export interface SEOContent {
  description: string;
  content: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
  aboutTool: string;
}

export function createSEOContent(
  description: string,
  introduction: string,
  benefits: string[],
  howTo: string[],
  faq: { question: string; answer: string }[],
  aboutTool: string,
  keywords: string[]
): SEOContent {
  const benefitsList = benefits.map(b => `<li>${b}</li>`).join("");
  const howToList = howTo.map((step, i) => `<li><strong>Step ${i + 1}:</strong> ${step}</li>`).join("");
  
  const content = `
    <h3>Introduction</h3>
    <p>${introduction}</p>
    
    <h3>Key Benefits</h3>
    <ul>${benefitsList}</ul>
    
    <h3>How to Use</h3>
    <ol>${howToList}</ol>
  `;

  return { description, content, keywords, faqs: faq, aboutTool };
}
