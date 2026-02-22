import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, Briefcase, Github, Linkedin, Twitter, Palette, Check } from "lucide-react";
import { toast } from "sonner";
import { ProfilePhotoUpload, PhotoSettings, defaultPhotoSettings } from "@/components/ProfilePhotoUpload";
import { portfolioTemplates, PortfolioTemplate, generatePortfolioHTML } from "@/components/portfolio/portfolioTemplates";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { DragDropZone } from "@/components/portfolio/DragDropZone";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  photo: PhotoSettings;
  projects: Project[];
}

const tool = getToolById("portfolio-builder")!;

export default function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    name: "",
    title: "",
    bio: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    photo: defaultPhotoSettings,
    projects: [{ id: crypto.randomUUID(), title: "", description: "", link: "", image: "" }],
  });

  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate>(portfolioTemplates[0]);
  const [customColors, setCustomColors] = useState<Partial<PortfolioTemplate["colors"]>>({});
  const [showColorCustomizer, setShowColorCustomizer] = useState(false);

  const addProject = () => {
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, { id: crypto.randomUUID(), title: "", description: "", link: "", image: "" }],
    });
  };

  const removeProject = (id: string) => {
    if (portfolio.projects.length > 1) {
      setPortfolio({ ...portfolio, projects: portfolio.projects.filter((p) => p.id !== id) });
    }
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const handleProjectImageDrop = useCallback((projectId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateProject(projectId, "image", dataUrl);
    };
    reader.readAsDataURL(file);
  }, [portfolio.projects]);

  const handleDownload = () => {
    const html = generatePortfolioHTML(portfolio, selectedTemplate, customColors);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio HTML downloaded!");
  };

  const colorFields: { key: keyof PortfolioTemplate["colors"]; label: string }[] = [
    { key: "bg", label: "Background" },
    { key: "cardBg", label: "Card BG" },
    { key: "accent", label: "Accent" },
    { key: "accentEnd", label: "Accent End" },
    { key: "text", label: "Text" },
    { key: "textMuted", label: "Muted" },
    { key: "border", label: "Border" },
  ];

  const seoContent = {
    description: "Build a professional portfolio website in minutes. Choose from 8+ templates, customize colors, drag & drop images. Export as HTML, no coding required.",
    content: `<h3>Introduction</h3><p>Create a stunning portfolio to showcase your work with our free builder. Choose from multiple professional templates and customize every color.</p><h3>Key Benefits</h3><ul><li>8+ professional templates to choose from</li><li>Full color customization for every element</li><li>Drag & drop image uploads</li><li>No coding skills required</li><li>Export as standalone HTML</li><li>Modern responsive design</li><li>Showcase unlimited projects</li></ul>`,
    keywords: ["portfolio builder", "portfolio builder tools", "free portfolio builder", "portfolio generator", "free portfolio website", "toolsuite", "free tools", "cv maker free", "online portfolio maker", "portfolio website builder free", "create portfolio online", "portfolio templates free", "drag and drop portfolio builder"],
    faqs: [
      { question: "Can I host this portfolio?", answer: "Yes! The HTML file can be hosted on any web server, GitHub Pages, Netlify, or Vercel." },
      { question: "Is it mobile responsive?", answer: "Absolutely, the generated portfolio is fully responsive across all devices." },
      { question: "How many templates are available?", answer: "We offer 8+ professionally designed templates including Modern Dark, Minimal Light, Creative Gradient, Corporate Blue, and more." },
      { question: "Can I customize the colors?", answer: "Yes! Every color in the template can be customized using the color picker." },
      { question: "Can I drag and drop images?", answer: "Yes, you can drag and drop images for both your profile photo and project images." },
    ],
    aboutTool: "Our Portfolio Builder helps you create a professional online presence in minutes. With 8+ templates, full color customization, and drag & drop support, it's the easiest way to build your portfolio.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      {/* Template Selector */}
      <div className="mb-6">
        <Label className="text-lg font-semibold mb-3 block">Choose a Template</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {portfolioTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTemplate(t);
                setCustomColors({});
              }}
              className={`relative p-3 rounded-xl border-2 transition-all text-center hover:scale-105 ${
                selectedTemplate.id === t.id
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
              style={{ background: t.colors.bg }}
            >
              {selectedTemplate.id === t.id && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="text-2xl mb-1">{t.preview}</div>
              <div className="text-xs font-medium" style={{ color: t.colors.text }}>
                {t.name}
              </div>
              <div className="flex gap-1 justify-center mt-2">
                <span className="w-3 h-3 rounded-full" style={{ background: t.colors.accent }} />
                <span className="w-3 h-3 rounded-full" style={{ background: t.colors.accentEnd }} />
                <span className="w-3 h-3 rounded-full" style={{ background: t.colors.cardBg, border: `1px solid ${t.colors.border}` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customizer Toggle */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowColorCustomizer(!showColorCustomizer)}
          className="gap-2"
        >
          <Palette className="w-4 h-4" />
          {showColorCustomizer ? "Hide" : "Customize"} Colors
        </Button>
        {showColorCustomizer && (
          <div className="mt-3 p-4 glass-card rounded-xl grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {colorFields.map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs mb-1 block">{label}</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColors[key] || selectedTemplate.colors[key]}
                    onChange={(e) => setCustomColors({ ...customColors, [key]: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {(customColors[key] || selectedTemplate.colors[key]).slice(0, 7)}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={() => setCustomColors({})}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Portfolio Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfilePhotoUpload
              photoSettings={portfolio.photo}
              onPhotoChange={(photo) => setPortfolio({ ...portfolio, photo })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={portfolio.name} onChange={(e) => setPortfolio({ ...portfolio, name: e.target.value })} />
              </div>
              <div>
                <Label>Title/Role</Label>
                <Input placeholder="Full Stack Developer" value={portfolio.title} onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea placeholder="Tell your story..." value={portfolio.bio} onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input placeholder="you@email.com" value={portfolio.email} onChange={(e) => setPortfolio({ ...portfolio, email: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</Label>
                <Input placeholder="https://github.com/..." value={portfolio.github} onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
                <Input placeholder="https://linkedin.com/..." value={portfolio.linkedin} onChange={(e) => setPortfolio({ ...portfolio, linkedin: e.target.value })} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Twitter className="w-3 h-3" /> Twitter</Label>
                <Input placeholder="https://twitter.com/..." value={portfolio.twitter} onChange={(e) => setPortfolio({ ...portfolio, twitter: e.target.value })} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Projects</Label>
                <Button size="sm" variant="outline" onClick={addProject}>
                  <Plus className="w-4 h-4 mr-1" /> Add Project
                </Button>
              </div>
              {portfolio.projects.map((project, idx) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project {idx + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Input placeholder="Project Title" value={project.title} onChange={(e) => updateProject(project.id, "title", e.target.value)} />
                  <Textarea placeholder="Description" value={project.description} onChange={(e) => updateProject(project.id, "description", e.target.value)} />
                  <Input placeholder="Project URL" value={project.link} onChange={(e) => updateProject(project.id, "link", e.target.value)} />
                  
                  {/* Drag & Drop Image Upload for Project */}
                  {project.image ? (
                    <div className="relative group">
                      <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => updateProject(project.id, "image", "")}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <DragDropZone
                      onFileDrop={(file) => handleProjectImageDrop(project.id, file)}
                      compact
                    />
                  )}
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download Portfolio HTML
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Live Preview</span>
              <span className="text-sm font-normal text-muted-foreground">{selectedTemplate.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioPreview
              {...portfolio}
              template={selectedTemplate}
              customColors={customColors}
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
