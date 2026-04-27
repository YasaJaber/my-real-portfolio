export const siteConfig = {
  name: "Yasa Jaber",
  shortName: "Yasa",
  title: "Yasa Jaber — Front-End Developer & Graphic Designer",
  description:
    "Front-End engineer & graphic designer crafting cinematic, performant web experiences. Next.js, GSAP, and motion design from Egypt.",
  url: "https://yasajaber.com",
  ogImage: "/og.png",
  locale: "en_US",
  author: {
    name: "Yasa Jaber",
    role: "Front-End Developer · Graphic Designer",
    location: "sohag, Egypt",
    email: "hello@yasajaber.com",
  },
  links: {
    github: "https://github.com/yasajaber",
    twitter: "https://twitter.com/yasajaber",
    linkedin: "https://linkedin.com/in/yasajaber",
    behance: "https://behance.net/yasajaber",
    instagram: "https://instagram.com/yasajaber",
  },
  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
