import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolById } from "@/lib/tools-data";

const MetaTagGenerator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [type] = useState("website");
  const { toast } = useToast();

  const generateBasicMeta = () => {
    let meta = "";
    if (title) meta += `<title>${title}</title>\n`;
    if (description) meta += `<meta name="description" content="${description}">\n`;
    if (keywords) meta += `<meta name="keywords" content="${keywords}">\n`;
    if (author) meta += `<meta name="author" content="${author}">\n`;
    meta += `<meta name="robots" content="index, follow">\n`;
    meta += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    return meta;
  };

  const generateOpenGraph = () => {
    let meta = "";
    if (title) meta += `<meta property="og:title" content="${title}">\n`;
    if (description) meta += `<meta property="og:description" content="${description}">\n`;
    if (url) meta += `<meta property="og:url" content="${url}">\n`;
    if (image) meta += `<meta property="og:image" content="${image}">\n`;
    if (siteName) meta += `<meta property="og:site_name" content="${siteName}">\n`;
    meta += `<meta property="og:type" content="${type}">\n`;
    return meta;
  };

  const generateTwitterCards = () => {
    let meta = `<meta name="twitter:card" content="summary_large_image">\n`;
    if (title) meta += `<meta name="twitter:title" content="${title}">\n`;
    if (description) meta += `<meta name="twitter:description" content="${description}">\n`;
    if (image) meta += `<meta name="twitter:image" content="${image}">\n`;
    if (twitterHandle) {
      const handle = twitterHandle.startsWith("@") ? twitterHandle : `@${twitterHandle}`;
      meta += `<meta name="twitter:site" content="${handle}">\n`;
      meta += `<meta name="twitter:creator" content="${handle}">\n`;
    }
    return meta;
  };

  const getAllMeta = () => {
    return `<!-- Basic Meta Tags -->\n${generateBasicMeta()}\n<!-- Open Graph / Facebook -->\n${generateOpenGraph()}\n<!-- Twitter Cards -->\n${generateTwitterCards()}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const tool = getToolById("meta-tag-generator")!;

  const seoContent = {
    introduction: "Meta tags are crucial for SEO and social media sharing. Our Meta Tag Generator creates optimized meta tags, Open Graph tags for Facebook, and Twitter Card tags - all from a simple form interface.",
    howItWorks: [
      "Fill in your page title (under 60 characters for best SEO)",
      "Add a compelling description (under 160 characters)",
      "Enter social media details for rich previews",
      "Copy the generated tags to your HTML head section"
    ],
    useCases: [
      { title: "SEO Optimization", description: "Create meta tags that help search engines understand your content" },
      { title: "Social Sharing", description: "Control how your pages appear when shared on Facebook and Twitter" },
      { title: "Brand Consistency", description: "Ensure consistent appearance across all platforms" }
    ],
    faq: [
      { question: "What's the ideal title length?", answer: "Keep titles under 60 characters to avoid truncation in search results." },
      { question: "What image size should I use for OG images?", answer: "The recommended size is 1200x630 pixels for optimal display across platforms." }
    ]
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title ({title.length}/60)</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Website"
                  maxLength={60}
                />
                {title.length > 55 && (
                  <p className="text-xs text-amber-500">Title may be truncated in search results</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Description ({description.length}/160)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of your page..."
                  maxLength={160}
                />
                {description.length > 155 && (
                  <p className="text-xs text-amber-500">Description may be truncated</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="web, development, tools"
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                <p className="text-xs text-muted-foreground">Recommended: 1200x630 pixels</p>
              </div>

              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="My Website"
                />
              </div>

              <div className="space-y-2">
                <Label>Twitter Handle</Label>
                <Input
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-primary text-lg font-medium line-clamp-1">
                  {title || "Page Title"}
                </p>
                <p className="text-green-600 text-sm">
                  {url || "https://example.com"}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {description || "Your page description will appear here..."}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">This is how your page may appear in search results</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-4 h-4" />
                Generated Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                  <TabsTrigger value="og" className="flex-1">Open Graph</TabsTrigger>
                  <TabsTrigger value="twitter" className="flex-1">Twitter</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                    {getAllMeta()}
                  </pre>
                  <Button onClick={() => copyToClipboard(getAllMeta(), "All meta tags")} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Tags
                  </Button>
                </TabsContent>

                <TabsContent value="basic" className="space-y-2">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                    {generateBasicMeta()}
                  </pre>
                  <Button variant="outline" onClick={() => copyToClipboard(generateBasicMeta(), "Basic meta tags")} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Basic Tags
                  </Button>
                </TabsContent>

                <TabsContent value="og" className="space-y-2">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                    {generateOpenGraph()}
                  </pre>
                  <Button variant="outline" onClick={() => copyToClipboard(generateOpenGraph(), "Open Graph tags")} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Open Graph
                  </Button>
                </TabsContent>

                <TabsContent value="twitter" className="space-y-2">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                    {generateTwitterCards()}
                  </pre>
                  <Button variant="outline" onClick={() => copyToClipboard(generateTwitterCards(), "Twitter Card tags")} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Twitter Cards
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MetaTagGenerator;
