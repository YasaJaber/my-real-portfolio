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
    email: "yasajaber@gmail.com",
  },
  links: {
    github: "https://github.com/yasajaber",
    x: "https://x.com/YasaJaber",
    linkedin: "https://www.linkedin.com/in/yasa-jaber/",
    behance: "https://www.behance.net/yasa_jaber",
    instagram: "https://www.instagram.com/yasa_jaber/",
    facebook: "https://www.facebook.com/yasa.jaber/",
    youtube: "https://www.youtube.com/@yasa_jaber",
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
