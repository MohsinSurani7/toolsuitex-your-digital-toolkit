import { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, Briefcase, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { ProfilePhotoUpload, PhotoSettings, defaultPhotoSettings } from "@/components/ProfilePhotoUpload";

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

  const generateHTML = () => {
    const photoHTML = portfolio.photo.src ? `
      <div class="profile-photo" style="
        width: 150px; 
        height: 150px; 
        margin: 0 ${portfolio.photo.alignment === 'center' ? 'auto' : portfolio.photo.alignment === 'right' ? '0 0 auto' : 'auto 0'} 1.5rem;
        overflow: hidden;
        ${portfolio.photo.shape === 'circle' ? 'border-radius: 50%;' : portfolio.photo.shape === 'rounded' ? 'border-radius: 1rem;' : ''}
      ">
        <img src="${portfolio.photo.src}" alt="${portfolio.name}" style="
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          transform: scale(${portfolio.photo.zoom / 100}) rotate(${portfolio.photo.rotation}deg);
        "/>
      </div>
    ` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name || "Portfolio"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    header { text-align: center; padding: 4rem 0; }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .title { font-size: 1.25rem; color: #94a3b8; margin-bottom: 1rem; }
    .bio { max-width: 600px; margin: 0 auto 2rem; color: #cbd5e1; }
    .socials { display: flex; gap: 1rem; justify-content: center; }
    .socials a { color: #60a5fa; text-decoration: none; }
    .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-top: 4rem; }
    .project { background: #1e293b; border-radius: 1rem; overflow: hidden; transition: transform 0.3s; }
    .project:hover { transform: translateY(-5px); }
    .project-img { height: 200px; background: #334155; display: flex; align-items: center; justify-content: center; color: #64748b; }
    .project-content { padding: 1.5rem; }
    .project h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .project p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1rem; }
    .project a { color: #60a5fa; text-decoration: none; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${photoHTML}
      <h1>${portfolio.name || "Your Name"}</h1>
      <p class="title">${portfolio.title || "Your Title"}</p>
      <p class="bio">${portfolio.bio || "Your bio goes here..."}</p>
      <div class="socials">
        ${portfolio.email ? `<a href="mailto:${portfolio.email}">Email</a>` : ""}
        ${portfolio.github ? `<a href="${portfolio.github}" target="_blank">GitHub</a>` : ""}
        ${portfolio.linkedin ? `<a href="${portfolio.linkedin}" target="_blank">LinkedIn</a>` : ""}
        ${portfolio.twitter ? `<a href="${portfolio.twitter}" target="_blank">Twitter</a>` : ""}
      </div>
    </header>
    <section class="projects">
      ${portfolio.projects
        .map(
          (p) => `
        <div class="project">
          <div class="project-img">${p.image ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">` : "Project Image"}</div>
          <div class="project-content">
            <h3>${p.title || "Project Title"}</h3>
            <p>${p.description || "Project description..."}</p>
            ${p.link ? `<a href="${p.link}" target="_blank">View Project →</a>` : ""}
          </div>
        </div>
      `
        )
        .join("")}
    </section>
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

  const seoContent = {
    description: "Build a professional portfolio website in minutes. Export as HTML, no coding required.",
    content: `<h3>Introduction</h3><p>Create a stunning portfolio to showcase your work with our free builder.</p><h3>Key Benefits</h3><ul><li>No coding skills required</li><li>Export as standalone HTML</li><li>Modern responsive design</li><li>Showcase unlimited projects</li></ul>`,
    keywords: ["portfolio builder", "portfolio builder tools", "free portfolio builder", "portfolio generator", "free portfolio website", "toolsuite", "free tools", "cv maker free", "online portfolio maker", "portfolio website builder free", "create portfolio online"],
    faqs: [
      { question: "Can I host this portfolio?", answer: "Yes! The HTML file can be hosted on any web server." },
      { question: "Is it mobile responsive?", answer: "Absolutely, the generated portfolio is fully responsive." },
    ],
    aboutTool: "Our Portfolio Builder helps you create a professional online presence in minutes.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
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
                <Label className="flex items-center gap-1">Email</Label>
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
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Project URL" value={project.link} onChange={(e) => updateProject(project.id, "link", e.target.value)} />
                    <Input placeholder="Image URL" value={project.image} onChange={(e) => updateProject(project.id, "image", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={generateHTML}>
              <Download className="w-4 h-4 mr-2" /> Download Portfolio HTML
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-xl p-6 text-center">
              {portfolio.photo.src && (
                <div className={`mb-4 flex ${portfolio.photo.alignment === 'left' ? 'justify-start' : portfolio.photo.alignment === 'right' ? 'justify-end' : 'justify-center'}`}>
                  <div 
                    className={`w-20 h-20 overflow-hidden ${portfolio.photo.shape === 'circle' ? 'rounded-full' : portfolio.photo.shape === 'rounded' ? 'rounded-lg' : ''}`}
                  >
                    <img
                      src={portfolio.photo.src}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `scale(${portfolio.photo.zoom / 100}) rotate(${portfolio.photo.rotation}deg)`,
                      }}
                    />
                  </div>
                </div>
              )}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {portfolio.name || "Your Name"}
              </h2>
              <p className="text-slate-400 mb-3">{portfolio.title || "Your Title"}</p>
              <p className="text-slate-300 text-sm mb-4 max-w-md mx-auto">{portfolio.bio || "Your bio goes here..."}</p>
              <div className="flex gap-3 justify-center mb-6">
                {portfolio.github && <ExternalLink className="w-5 h-5 text-blue-400" />}
                {portfolio.linkedin && <Linkedin className="w-5 h-5 text-blue-400" />}
                {portfolio.twitter && <Twitter className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="grid gap-4">
                {portfolio.projects.slice(0, 2).map((p) => (
                  <div key={p.id} className="bg-slate-800 rounded-lg p-4 text-left">
                    <h3 className="font-semibold">{p.title || "Project Title"}</h3>
                    <p className="text-sm text-slate-400">{p.description || "Description..."}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
