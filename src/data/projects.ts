export type Project = {
  slug: string;
  title: string;
  category: "Web App" | "Branding" | "WordPress" | "Motion";
  year: number;
  /** Optional cover image — leave empty for the text-only card layout. */
  cover?: string;
  summary: string;
  description: string;
  features: string[];
  stack: string[];
  repoUrl: string;
  liveUrl?: string;
  /** Hex color used for the accent halo / glow */
  accent: string;
  /** Optional role label for collaborative projects */
  role?: string;
  roleLink?: {
    label: string;
    href: string;
  };
};

export const projects: Project[] = [
  {
    slug: "masar-e-learning-platform",
    title: "Masar — E-Learning Platform",
    category: "Web App",
    year: 2026,
    cover: "/projects/masar learning.png",
    summary:
      "A full-stack Arabic-first e-learning platform with three roles, DRM-ready video delivery, certificates, and a 4-layer device-protection system.",
    description:
      "Masar is a production-grade MERN e-learning platform with a full Arabic RTL interface and three role-tailored dashboards (Student, Instructor, Admin). It covers the entire learning lifecycle — course creation, dual-provider video delivery (YouTube for the demo, Bunny.net DRM for production), payment & order management, progress tracking, auto-generated PDF certificates, reviews, comments, coupons, wishlist, and a real-time notification system. A custom 4-layer device-protection layer (device agreement, monthly limit, cooldown, single active session) prevents account sharing.",
    features: [
      "Three role dashboards: Student, Instructor, Admin",
      "JWT auth with HttpOnly cookies + refresh-token rotation",
      "4-layer device protection with SHA-256 fingerprinting",
      "Dual video provider system (YouTube + Bunny.net DRM-ready)",
      "Manual & sandbox payment flows + coupon engine",
      "Auto PDF certificates (pdf-lib) with public verification",
      "Real-time notification bell + dedicated notifications page",
      "80+ REST endpoints across 16 route modules, 11 Mongoose models",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Node.js",
      "Express",
      "MongoDB",
      "Cloudinary",
      "JWT",
    ],
    repoUrl: "https://github.com/Mo7amed-3bnaser/e-learning-platform",
    liveUrl: "https://masar-zsel.onrender.com/",
    role: "Full-Stack Developer · Co-built with",
    roleLink: {
      label: "Mohamed Abdelnaser",
      href: "https://3bnaser.tech/",
    },
    accent: "#A855F7",
  },
  {
    slug: "church-management-system",
    title: "Church Management System",
    category: "Web App",
    year: 2026,
    cover: "/projects/church management system.png",
    summary:
      "A bilingual Arabic/English platform for Sunday Schools with attendance, pastoral follow-up, exports, and full audit logging.",
    description:
      "A comprehensive management system built for Saint George Church (Sunday Schools / مدارس الأحد) with full Arabic RTL support. It handles multi-role authentication (Admin / Service Leader / Teacher / Servant), class & children management, attendance tracking for both children and servants, pastoral follow-up workflows, gift delivery for streaks, advanced analytics dashboards, role-based PDF/Excel exports, and a complete audit trail with full device fingerprinting on every login.",
    features: [
      "Multi-role auth with JWT + RBAC (Admin / Leader / Teacher / Servant)",
      "Attendance tracking with consecutive-week streaks & gift eligibility",
      "Pastoral care follow-up with call tracking & auto removal on attendance",
      "PDF & Excel exports with Arabic RTL formatting",
      "Audit trail with full device fingerprint on every login (IP, OS, browser, geo)",
      "Dark mode, error boundary, and bilingual Arabic/English content",
    ],
    stack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind",
      "MongoDB",
      "JWT",
      "Chart.js",
      "Helmet",
      "Winston",
    ],
    repoUrl: "https://github.com/YasaJaber/Church-Management-System",
    liveUrl: "https://church-management-system-1-i51l.onrender.com",
    accent: "#06B6D4",
  },
  {
    slug: "my-real-portfolio",
    title: "Yasa Jaber — Real Portfolio",
    category: "Web App",
    year: 2026,
    cover: "/projects/real portfolio.png",
    summary:
      "This very site — a high-performance SPA portfolio bridging front-end engineering and graphic design with cinematic transitions.",
    description:
      "My current production portfolio: a high-performance Single Page Application built around an animated Aurora Mesh Gradient, interactive per-letter typography, and cinematic page transitions. Includes an MDX-powered blog with categories, dynamic Open Graph metadata, and reading-time. Designed with accessibility in mind — honors prefers-reduced-motion, fully keyboard-reachable.",
    features: [
      "Interactive Hero — every letter is its own DOM node (magnetize on hover, explode on click)",
      "Aurora Mesh Background — pure 2D Canvas with cursor-following blobs & click ripples",
      "Cinematic page transitions via Framer Motion AnimatePresence",
      "Glassmorphism navbar & cards over the live mesh",
      "MDX blog with categories, reading-time, and dynamic OG images per post",
      "Accessible: respects prefers-reduced-motion, fully keyboard navigable",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind",
      "GSAP",
      "Framer Motion",
      "Lenis",
      "MDX",
    ],
    repoUrl: "https://github.com/YasaJaber/my-real-portfolio",
    liveUrl: "https://yasajaber.me",
    accent: "#F43F5E",
  },
  {
    slug: "login-register-system",
    title: "Login / Register System",
    category: "Web App",
    year: 2025,
    cover: "/projects/login_register system.png",
    summary:
      "A secure user authentication platform with email/password and Google + GitHub OAuth 2.0.",
    description:
      "A production-ready authentication system supporting traditional email/password and social login via Google and GitHub OAuth 2.0. Built security-first — JWT sessions, bcrypt-hashed passwords, IP-based rate limiting, CORS protection, full input validation, email verification, and a secure password recovery flow.",
    features: [
      "Email/password + Google & GitHub OAuth 2.0",
      "JWT-based sessions with configurable expiration",
      "Email verification & secure password recovery",
      "IP-based rate limiting + CORS + XSS / CSRF protection",
      "RESTful API with MongoDB & Mongoose",
      "Mobile-first responsive UI",
    ],
    stack: ["Node.js", "Express", "MongoDB", "Passport.js", "JWT", "OAuth 2.0"],
    repoUrl: "https://github.com/YasaJaber/login-register--system",
    liveUrl: "https://login-register-system-sxto.onrender.com/",
    accent: "#22D3EE",
  },
  {
    slug: "yasa-portfolio-v1",
    title: "Yasa — Portfolio (v1)",
    category: "Web App",
    year: 2025,
    cover: "/projects/demo portfolio.png",
    summary:
      "My first personal portfolio, hand-built from scratch in pure HTML, CSS & vanilla JavaScript — zero frameworks.",
    description:
      "The first iteration of my personal portfolio, built as a deliberate challenge to push my fundamentals: every animation, transition, and interaction was written from scratch in vanilla HTML, CSS, and JavaScript — no frameworks, no libraries. Fully responsive across all devices and showcases my work as a graphic designer & front-end developer.",
    features: [
      "Fully responsive across all devices",
      "Custom CSS animations & scroll-driven effects",
      "About / Work / Contact sections",
      "Zero dependencies — pure HTML / CSS / JS",
    ],
    stack: ["HTML5", "CSS3", "Vanilla JS"],
    repoUrl: "https://github.com/YasaJaber/yasa-portfolio",
    liveUrl: "https://yasajaber.github.io/yasa-portfolio/",
    accent: "#8B5CF6",
  },
];
