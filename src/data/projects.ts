export type Project = {
  slug: string;
  title: string;
  category: "Web App" | "Branding" | "WordPress" | "Motion";
  year: number;
  cover: string;
  summary: string;
  stack: string[];
  href?: string;
  accent: string; // hex color used for hover glow
};

export const projects: Project[] = [
  {
    slug: "aurora-commerce",
    title: "Aurora Commerce",
    category: "Web App",
    year: 2026,
    cover:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A headless storefront with cinematic product reveals and sub-second navigation.",
    stack: ["Next.js", "GSAP", "Shopify", "Tailwind"],
    accent: "#A855F7",
  },
  {
    slug: "lumen-brand",
    title: "Lumen Identity System",
    category: "Branding",
    year: 2025,
    cover:
      "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Full brand identity for a creative studio — wordmark, motion guidelines, and a 60-page brand book.",
    stack: ["Illustrator", "After Effects", "Figma"],
    accent: "#06B6D4",
  },
  {
    slug: "kairos-blog",
    title: "Kairos — Editorial Platform",
    category: "WordPress",
    year: 2025,
    cover:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Custom WordPress theme & block editor experience for a long-form journalism magazine.",
    stack: ["WordPress", "ACF", "PHP", "GSAP"],
    accent: "#F43F5E",
  },
  {
    slug: "orbit-motion",
    title: "Orbit — Motion Reel",
    category: "Motion",
    year: 2026,
    cover:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A 90-second motion reel exploring particles, type, and color transitions.",
    stack: ["After Effects", "Cinema 4D", "Three.js"],
    accent: "#1E3A8A",
  },
  {
    slug: "mesh-saas",
    title: "Mesh — Analytics SaaS",
    category: "Web App",
    year: 2025,
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    summary:
      "A real-time analytics dashboard with motion-driven data viz and a tactile dark UI.",
    stack: ["Next.js", "tRPC", "D3", "Postgres"],
    accent: "#8B5CF6",
  },
  {
    slug: "noir-portfolio",
    title: "Noir — Photographer Site",
    category: "WordPress",
    year: 2024,
    cover:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80",
    summary:
      "Photo portfolio with smooth-scroll galleries, lazy media, and headless CMS.",
    stack: ["WordPress", "Headless", "Next.js"],
    accent: "#22D3EE",
  },
];
