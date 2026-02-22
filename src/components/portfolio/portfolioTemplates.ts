export interface PortfolioTemplate {
  id: string;
  name: string;
  preview: string; // emoji or short label
  colors: {
    bg: string;
    cardBg: string;
    accent: string;
    accentEnd: string;
    text: string;
    textMuted: string;
    border: string;
  };
  font: string;
  style: "modern" | "minimal" | "creative" | "corporate" | "warm";
}

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "modern-dark",
    name: "Modern Dark",
    preview: "🌙",
    colors: {
      bg: "#0f172a",
      cardBg: "#1e293b",
      accent: "#60a5fa",
      accentEnd: "#a78bfa",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
      border: "#334155",
    },
    font: "system-ui, -apple-system, sans-serif",
    style: "modern",
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    preview: "☀️",
    colors: {
      bg: "#ffffff",
      cardBg: "#f8fafc",
      accent: "#0f172a",
      accentEnd: "#475569",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
    font: "'Georgia', serif",
    style: "minimal",
  },
  {
    id: "creative-gradient",
    name: "Creative Gradient",
    preview: "🎨",
    colors: {
      bg: "#1a1a2e",
      cardBg: "#16213e",
      accent: "#e94560",
      accentEnd: "#f97316",
      text: "#eaeaea",
      textMuted: "#a0a0b0",
      border: "#2a2a4e",
    },
    font: "'Segoe UI', Tahoma, sans-serif",
    style: "creative",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    preview: "💼",
    colors: {
      bg: "#f0f4f8",
      cardBg: "#ffffff",
      accent: "#1e40af",
      accentEnd: "#3b82f6",
      text: "#1e293b",
      textMuted: "#64748b",
      border: "#cbd5e1",
    },
    font: "'Helvetica Neue', Arial, sans-serif",
    style: "corporate",
  },
  {
    id: "warm-sunset",
    name: "Warm Sunset",
    preview: "🌅",
    colors: {
      bg: "#1c1917",
      cardBg: "#292524",
      accent: "#f59e0b",
      accentEnd: "#ef4444",
      text: "#fafaf9",
      textMuted: "#a8a29e",
      border: "#44403c",
    },
    font: "'Trebuchet MS', sans-serif",
    style: "warm",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    preview: "🌿",
    colors: {
      bg: "#f0fdf4",
      cardBg: "#ffffff",
      accent: "#166534",
      accentEnd: "#15803d",
      text: "#14532d",
      textMuted: "#4b5563",
      border: "#bbf7d0",
    },
    font: "'Palatino', 'Book Antiqua', serif",
    style: "minimal",
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    preview: "⚡",
    colors: {
      bg: "#09090b",
      cardBg: "#18181b",
      accent: "#22d3ee",
      accentEnd: "#a855f7",
      text: "#fafafa",
      textMuted: "#71717a",
      border: "#27272a",
    },
    font: "'Consolas', 'Courier New', monospace",
    style: "creative",
  },
  {
    id: "rose-elegant",
    name: "Rose Elegant",
    preview: "🌹",
    colors: {
      bg: "#fff1f2",
      cardBg: "#ffffff",
      accent: "#be123c",
      accentEnd: "#9f1239",
      text: "#1c1917",
      textMuted: "#78716c",
      border: "#fecdd3",
    },
    font: "'Didot', 'Bodoni MT', serif",
    style: "minimal",
  },
];

export function generatePortfolioHTML(
  portfolio: {
    name: string;
    title: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    photo: { src: string; shape: string; zoom: number; rotation: number; alignment: string };
    projects: { title: string; description: string; link: string; image: string }[];
  },
  template: PortfolioTemplate,
  customColors?: Partial<PortfolioTemplate["colors"]>
) {
  const colors = { ...template.colors, ...customColors };

  const photoHTML = portfolio.photo.src
    ? `
      <div class="profile-photo" style="
        width: 150px; height: 150px;
        margin: 0 ${portfolio.photo.alignment === "center" ? "auto" : portfolio.photo.alignment === "right" ? "0 0 auto" : "auto 0"} 1.5rem;
        overflow: hidden;
        ${portfolio.photo.shape === "circle" ? "border-radius: 50%;" : portfolio.photo.shape === "rounded" ? "border-radius: 1rem;" : ""}
        border: 3px solid ${colors.accent};
      ">
        <img src="${portfolio.photo.src}" alt="${portfolio.name}" style="
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(${portfolio.photo.zoom / 100}) rotate(${portfolio.photo.rotation}deg);
        "/>
      </div>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.name || "Portfolio"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${template.font}; background: ${colors.bg}; color: ${colors.text}; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    header { text-align: center; padding: 4rem 0; }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, ${colors.accent}, ${colors.accentEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .title { font-size: 1.25rem; color: ${colors.textMuted}; margin-bottom: 1rem; }
    .bio { max-width: 600px; margin: 0 auto 2rem; color: ${colors.textMuted}; }
    .socials { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .socials a { color: ${colors.accent}; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid ${colors.border}; border-radius: 2rem; transition: all 0.3s; }
    .socials a:hover { background: ${colors.accent}; color: ${colors.bg}; }
    .section-title { text-align: center; font-size: 2rem; margin: 3rem 0 2rem; background: linear-gradient(135deg, ${colors.accent}, ${colors.accentEnd}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .projects { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; margin-top: 1rem; }
    .project { background: ${colors.cardBg}; border: 1px solid ${colors.border}; border-radius: 1rem; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; }
    .project:hover { transform: translateY(-5px); box-shadow: 0 10px 40px ${colors.accent}22; }
    .project-img { height: 200px; background: ${colors.border}; display: flex; align-items: center; justify-content: center; color: ${colors.textMuted}; overflow: hidden; }
    .project-img img { width: 100%; height: 100%; object-fit: cover; }
    .project-content { padding: 1.5rem; }
    .project h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .project p { color: ${colors.textMuted}; font-size: 0.875rem; margin-bottom: 1rem; }
    .project a { color: ${colors.accent}; text-decoration: none; font-size: 0.875rem; font-weight: 600; }
    .project a:hover { text-decoration: underline; }
    footer { text-align: center; padding: 3rem 0; margin-top: 4rem; border-top: 1px solid ${colors.border}; color: ${colors.textMuted}; font-size: 0.875rem; }
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
        ${portfolio.email ? `<a href="mailto:${portfolio.email}">📧 Email</a>` : ""}
        ${portfolio.github ? `<a href="${portfolio.github}" target="_blank">💻 GitHub</a>` : ""}
        ${portfolio.linkedin ? `<a href="${portfolio.linkedin}" target="_blank">🔗 LinkedIn</a>` : ""}
        ${portfolio.twitter ? `<a href="${portfolio.twitter}" target="_blank">🐦 Twitter</a>` : ""}
      </div>
    </header>
    <h2 class="section-title">My Projects</h2>
    <section class="projects">
      ${portfolio.projects
        .map(
          (p) => `
        <div class="project">
          <div class="project-img">${p.image ? `<img src="${p.image}" alt="${p.title}">` : "📁 Project Image"}</div>
          <div class="project-content">
            <h3>${p.title || "Project Title"}</h3>
            <p>${p.description || "Project description..."}</p>
            ${p.link ? `<a href="${p.link}" target="_blank">View Project →</a>` : ""}
          </div>
        </div>`
        )
        .join("")}
    </section>
    <footer>
      <p>© ${new Date().getFullYear()} ${portfolio.name || "Portfolio"}. All rights reserved.</p>
    </footer>
  </div>
</body>
</html>`;
}
