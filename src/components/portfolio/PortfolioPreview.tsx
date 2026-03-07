import { ExternalLink, Linkedin, Twitter } from "lucide-react";
import { DesignSettings, getHeaderBackground } from "../design/designData";

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
  design: DesignSettings;
  nameColor?: string;
  titleColor?: string;
  bioColor?: string;
}

export function PortfolioPreview({
  name, title, bio, github, linkedin, twitter, photo, projects, design, nameColor, titleColor, bioColor,
}: PortfolioPreviewProps) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: design.bodyBg, color: design.bodyText }}
    >
      {/* Header */}
      <div
        className="p-6 text-center"
        style={{ background: getHeaderBackground(design) }}
      >
        {photo.src && (
          <div className={`mb-4 flex ${photo.alignment === "left" ? "justify-start" : photo.alignment === "right" ? "justify-end" : "justify-center"}`}>
            <div
              className="w-20 h-20 overflow-hidden"
              style={{
                borderRadius: photo.shape === "circle" ? "50%" : photo.shape === "rounded" ? "0.5rem" : "0",
                border: `2px solid ${design.headerAccent}`,
              }}
            >
              <img
                src={photo.src}
                alt={`${portfolio.name || "User"} portfolio profile photo`}
                className="w-full h-full object-cover"
                style={{ transform: `scale(${photo.zoom / 100}) rotate(${photo.rotation}deg)` }}
              />
            </div>
          </div>
        )}
        <h2
          className="text-3xl font-bold mb-2"
          style={{ color: nameColor || design.headerAccent }}
        >
          {name || "Your Name"}
        </h2>
        <p className="mb-3" style={{ color: titleColor || design.mutedText }}>
          {title || "Your Title"}
        </p>
        <p className="text-sm mb-4 max-w-md mx-auto" style={{ color: bioColor || design.mutedText }}>
          {bio || "Your bio goes here..."}
        </p>
        <div className="flex gap-3 justify-center">
          {github && <ExternalLink className="w-5 h-5" style={{ color: design.headerAccent }} />}
          {linkedin && <Linkedin className="w-5 h-5" style={{ color: design.headerAccent }} />}
          {twitter && <Twitter className="w-5 h-5" style={{ color: design.headerAccent }} />}
        </div>
      </div>

      {/* Projects */}
      <div className="p-6">
        <h3
          className="text-lg font-bold text-center mb-4"
          style={{ color: design.accentColor }}
        >
          My Projects
        </h3>
        <div className="grid gap-4">
          {projects.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="rounded-lg p-4 text-left transition-colors"
              style={{ background: design.headerBg1 + "22", border: `1px solid ${design.borderColor}` }}
            >
              {p.image && (
                <img src={p.image} alt={p.title} className="w-full h-24 object-cover rounded mb-2" />
              )}
              <h3 className="font-semibold" style={{ color: design.bodyText }}>{p.title || "Project Title"}</h3>
              <p className="text-sm" style={{ color: design.mutedText }}>
                {p.description || "Description..."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
