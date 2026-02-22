import { ExternalLink, Linkedin, Twitter } from "lucide-react";
import { PortfolioTemplate } from "./portfolioTemplates";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
}

interface PortfolioPreviewProps {
  name: string;
  title: string;
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  photo: { src: string; shape: string; zoom: number; rotation: number; alignment: string };
  projects: Project[];
  template: PortfolioTemplate;
  customColors?: Partial<PortfolioTemplate["colors"]>;
}

export function PortfolioPreview({
  name, title, bio, github, linkedin, twitter, photo, projects, template, customColors,
}: PortfolioPreviewProps) {
  const colors = { ...template.colors, ...customColors };

  return (
    <div
      className="rounded-xl p-6 text-center transition-all duration-300"
      style={{ background: colors.bg, color: colors.text, fontFamily: template.font }}
    >
      {photo.src && (
        <div className={`mb-4 flex ${photo.alignment === "left" ? "justify-start" : photo.alignment === "right" ? "justify-end" : "justify-center"}`}>
          <div
            className="w-20 h-20 overflow-hidden"
            style={{
              borderRadius: photo.shape === "circle" ? "50%" : photo.shape === "rounded" ? "0.5rem" : "0",
              border: `2px solid ${colors.accent}`,
            }}
          >
            <img
              src={photo.src}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${photo.zoom / 100}) rotate(${photo.rotation}deg)` }}
            />
          </div>
        </div>
      )}
      <h2
        className="text-3xl font-bold mb-2"
        style={{
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentEnd})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {name || "Your Name"}
      </h2>
      <p className="mb-3" style={{ color: colors.textMuted }}>
        {title || "Your Title"}
      </p>
      <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: colors.textMuted }}>
        {bio || "Your bio goes here..."}
      </p>
      <div className="flex gap-3 justify-center mb-6">
        {github && <ExternalLink className="w-5 h-5" style={{ color: colors.accent }} />}
        {linkedin && <Linkedin className="w-5 h-5" style={{ color: colors.accent }} />}
        {twitter && <Twitter className="w-5 h-5" style={{ color: colors.accent }} />}
      </div>
      <div className="grid gap-4">
        {projects.slice(0, 3).map((p) => (
          <div
            key={p.id}
            className="rounded-lg p-4 text-left transition-colors"
            style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}
          >
            {p.image && (
              <img src={p.image} alt={p.title} className="w-full h-24 object-cover rounded mb-2" />
            )}
            <h3 className="font-semibold">{p.title || "Project Title"}</h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>
              {p.description || "Description..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
