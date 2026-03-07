import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, Briefcase, Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { ProfilePhotoUpload, PhotoSettings, defaultPhotoSettings } from "@/components/ProfilePhotoUpload";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { DragDropZone } from "@/components/portfolio/DragDropZone";
import { DesignCustomizer } from "@/components/design/DesignCustomizer";
import { DesignSettings, DesignTheme, portfolioThemes, getHeaderBackground } from "@/components/design/designData";

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
    name: "", title: "", bio: "", email: "", github: "", linkedin: "", twitter: "",
    photo: defaultPhotoSettings,
    projects: [{ id: crypto.randomUUID(), title: "", description: "", link: "", image: "" }],
  });

  const [selectedThemeId, setSelectedThemeId] = useState(portfolioThemes[0].id);
  const [design, setDesign] = useState<DesignSettings>(portfolioThemes[0].settings);
  const [textColors, setTextColors] = useState({ name: "", title: "", bio: "" });

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

  const handleThemeSelect = (theme: DesignTheme) => {
    setSelectedThemeId(theme.id);
    setDesign(theme.settings);
    setTextColors({ name: "", title: "", bio: "" });
  };

  const handleDownload = () => {
    const headerBg = getHeaderBackground(design);
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name || "Portfolio"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: ${design.bodyBg}; color: ${design.bodyText}; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { text-align: center; padding: 4rem 2rem; background: ${headerBg}; }
    .profile-photo { width: 150px; height: 150px; margin: 0 auto 1.5rem; overflow: hidden; ${design.headerAccent ? `border: 3px solid ${design.headerAccent};` : ""} border-radius: 50%; }
    .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; color: ${textColors.name || design.headerAccent}; }
    .title { font-size: 1.25rem; color: ${textColors.title || design.mutedText}; margin-bottom: 1rem; }
    .bio { max-width: 600px; margin: 0 auto 2rem; color: ${textColors.bio || design.mutedText}; }
    .socials { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .socials a { color: ${design.headerAccent}; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid ${design.borderColor}; border-radius: 2rem; transition: all 0.3s; }
    .socials a:hover { background: ${design.accentColor}; color: ${design.bodyBg}; }
    .section-title { text-align: center; font-size: 2rem; margin: 3rem 0 2rem; color: ${design.accentColor}; }
    .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; padding: 0 2rem; }
    .project { background: ${design.headerBg1}22; border: 1px solid ${design.borderColor}; border-radius: 1rem; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
    .project:hover { transform: translateY(-5px); box-shadow: 0 10px 40px ${design.accentColor}22; }
    .project-img { height: 200px; background: ${design.borderColor}; display: flex; align-items: center; justify-content: center; color: ${design.mutedText}; overflow: hidden; }
    .project-img img { width: 100%; height: 100%; object-fit: cover; }
    .project-content { padding: 1.5rem; }
    .project h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .project p { color: ${design.mutedText}; font-size: 0.875rem; margin-bottom: 1rem; }
    .project a { color: ${design.accentColor}; text-decoration: none; font-size: 0.875rem; font-weight: 600; }
    .project a:hover { text-decoration: underline; }
    footer { text-align: center; padding: 3rem 0; margin-top: 4rem; border-top: 1px solid ${design.borderColor}; color: ${design.mutedText}; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${portfolio.photo.src ? `<div class="profile-photo"><img src="${portfolio.photo.src}" alt="${portfolio.name}"/></div>` : ""}
      <h1>${portfolio.name || "Your Name"}</h1>
      <p class="title">${portfolio.title || "Your Title"}</p>
      <p class="bio">${portfolio.bio || "Your bio goes here..."}</p>
      <div class="socials">
        ${portfolio.email ? `<a href="mailto:${portfolio.email}">📧 Email</a>` : ""}
        ${portfolio.github ? `<a href="${portfolio.github}" target="_blank">💻 GitHub</a>` : ""}
        ${portfolio.linkedin ? `<a href="${portfolio.linkedin}" target="_blank">🔗 LinkedIn</a>` : ""}
        ${portfolio.twitter ? `<a href="${portfolio.twitter}" target="_blank">🐦 Twitter</a>` : ""}
      </div>
    </header>
    <h2 class="section-title">My Projects</h2>
    <section class="projects">
      ${portfolio.projects.map((p) => `
        <div class="project">
          <div class="project-img">${p.image ? `<img src="${p.image}" alt="${p.title}">` : "📁 Project Image"}</div>
          <div class="project-content">
            <h3>${p.title || "Project Title"}</h3>
            <p>${p.description || "Project description..."}</p>
            ${p.link ? `<a href="${p.link}" target="_blank">View Project →</a>` : ""}
          </div>
        </div>`).join("")}
    </section>
    <footer>
      <p>© ${new Date().getFullYear()} ${portfolio.name || "Portfolio"}. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Portfolio HTML downloaded!");
  };

  const textColorFields = [
    { key: "name", label: "Name", value: textColors.name, onChange: (c: string) => setTextColors(p => ({ ...p, name: c })) },
    { key: "title", label: "Title", value: textColors.title, onChange: (c: string) => setTextColors(p => ({ ...p, title: c })) },
    { key: "bio", label: "Bio", value: textColors.bio, onChange: (c: string) => setTextColors(p => ({ ...p, bio: c })) },
  ];

  const seoContent = {
    description: "Build a professional portfolio website in minutes. Choose from 12+ templates, customize colors, gradients & text. Drag & drop images. Export as HTML, no coding required.",
    content: `<h3>Introduction</h3><p>Create a stunning portfolio to showcase your work with our free builder. Choose from multiple professional templates with full design customization.</p><h3>Key Benefits</h3><ul><li>12+ professional templates including Glassmorphism, Brutalist, Neon Glow</li><li>Full color customization with 500+ color palette</li><li>24 gradient presets for headers</li><li>Individual text color controls</li><li>Drag & drop image uploads</li><li>No coding skills required</li><li>Export as standalone HTML</li></ul>`,
    keywords: ["portfolio builder", "portfolio builder tools", "free portfolio builder", "portfolio generator", "free portfolio website", "toolsuite", "free tools", "cv maker free", "online portfolio maker", "portfolio website builder free", "create portfolio online", "portfolio templates free", "drag and drop portfolio builder"],
    faqs: [
      { question: "Can I host this portfolio?", answer: "Yes! The HTML file can be hosted on any web server, GitHub Pages, Netlify, or Vercel." },
      { question: "Is it mobile responsive?", answer: "Absolutely, the generated portfolio is fully responsive across all devices." },
      { question: "How many templates are available?", answer: "We offer 12+ professionally designed templates including Modern Dark, Glassmorphism, Brutalist, Neon Glow, Retro 80s, and more." },
      { question: "Can I customize all the colors?", answer: "Yes! Every color can be customized using color pickers or our 500+ color palette. You can also set individual text colors." },
      { question: "Can I use gradient backgrounds?", answer: "Yes, choose from 24 gradient presets or create your own with adjustable angle control." },
    ],
    aboutTool: "Our Portfolio Builder helps you create a professional online presence in minutes. With 12+ templates, 500+ colors, gradient presets, and individual text color control, it's the most customizable free portfolio builder.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      {/* Design Customizer */}
      <div className="mb-6">
        <DesignCustomizer
          themes={portfolioThemes}
          settings={design}
          selectedThemeId={selectedThemeId}
          onThemeSelect={handleThemeSelect}
          onSettingsChange={setDesign}
          textColorFields={textColorFields}
        />
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
                    <DragDropZone onFileDrop={(file) => handleProjectImageDrop(project.id, file)} compact />
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
              <span className="text-sm font-normal text-muted-foreground">
                {portfolioThemes.find(t => t.id === selectedThemeId)?.name}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioPreview
              {...portfolio}
              design={design}
              nameColor={textColors.name}
              titleColor={textColors.title}
              bioColor={textColors.bio}
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
