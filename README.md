<div align="center">

# Yasa Jaber — Portfolio

**A high-performance Single Page Application portfolio that bridges Front-End engineering and Graphic Design.**

Built around an animated Aurora Mesh Gradient, interactive typography, cinematic page transitions, and AI-powered chatbot.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

🌐 **[Live Preview → yasajaber.me](https://yasajaber.me)**

</div>

---

## ✨ Highlights

- **Interactive Hero** — Each letter of the name is its own DOM node. Hover to magnetize, click to explode into particles with camera shutter sound effect.
- **Aurora Mesh Background** — A pure 2D Canvas mesh of 5 drifting color blobs that follow the cursor and ripple on click. Hue subtly shifts each click.
- **AI-Powered Chatbot** — Integrated intelligent chatbot with rate limiting (Upstash Redis) to answer questions about Yasa's work and experience.
- **Cinematic Transitions** — Liquid zoom/blur transitions between routes via Framer Motion's `AnimatePresence`.
- **Glassmorphism UI** — Cards, navbar, and panels rendered with `backdrop-blur` over the live mesh.
- **MDX Blog** — File-based articles with categories (`Programming`, `Design`, `WordPress`), reading-time, and dynamic Open Graph metadata for every post.
- **Multilingual Support** — Full Arabic/English language switching with context-aware translations.
- **Accessible** — Honors `prefers-reduced-motion`. All interactive elements are keyboard reachable.
- **Comments System** — Users can leave comments on blog posts with their name, supporting both Arabic and English.

## 🛠️ Tech Stack

| Layer          | Tools                                                                |
| -------------- | -------------------------------------------------------------------- |
| Core           | **Next.js 16.2** (App Router, Turbopack, React Compiler, async params) |
| UI             | **React 19** + **Tailwind CSS 3.4** + custom CSS variables          |
| Animations     | **GSAP 3.12 + ScrollTrigger** · **Framer Motion 11** · **Lenis 1.3** smooth scroll |
| Graphics       | **Canvas 2D** for the aurora mesh                                    |
| Content        | **MDX** with `gray-matter`, `reading-time`, `rehype-pretty-code`, `shiki` |
| Language       | **TypeScript 5.7** (strict mode, path aliases via `@/*`)            |
| AI & Backend   | **Upstash Redis** (rate limiting) · **Vercel Analytics**            |
| Internationalization | **React Context** for Arabic/English switching                |

## Color System (Modern Dark Mesh)

| Token             | Hex       | Use                                |
| ----------------- | --------- | ---------------------------------- |
| `base`            | `#030303` | Deep canvas behind everything      |
| `accent.purple`   | `#A855F7` | Primary highlight, CTAs            |
| `accent.cyan`     | `#06B6D4` | Secondary highlight, links         |
| `accent.midnight` | `#1E3A8A` | Depth & shadow blobs               |
| `accent.rose`     | `#F43F5E` | Tertiary, occasional accents       |

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YasaJaber/my-real-portfolio.git
cd my-real-portfolio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Upstash Redis credentials for chatbot rate limiting

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build && npm start
```

> Requires Node.js 18.18+ (Node 20+ recommended for Next 16).

### Environment Variables

Create a `.env.local` file with:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## 📁 Project Structure

```
src/
  app/                      # Next.js App Router pages
    page.tsx                # Home (Hero · About · Work · Blog · Contact)
    blog/page.tsx           # Blog index with categories
    blog/[slug]/page.tsx    # Dynamic article page (MDX) + dynamic OG
    api/chat/route.ts       # AI chatbot API endpoint with rate limiting
    feed.xml/route.ts       # RSS feed generation
    sitemap.ts robots.ts    # SEO essentials
    manifest.ts             # PWA manifest
  components/
    layout/                 # Navbar · Footer · PageTransition · Chatbot · LanguageSwitcher
    sections/               # Hero · About · Work · BlogTeaser · Contact · Skills · Services
    visuals/                # AuroraBackground · CursorGlow · InteractiveName · CameraShutter
  config/site.ts            # Site-wide config (nav, links, author)
  data/projects.ts          # Project showcase data
  hooks/                    # Custom React hooks (useShutterSound)
  i18n/                     # Internationalization (LanguageContext, translations)
  lib/                      # utils, posts (MDX loader), chat-rate-limit, seo
content/
  blog/*.mdx                # Articles (front-matter driven)
public/                     # Static assets (CV, logo, hero image, sounds, projects, posts)
mdx-components.tsx          # MDX component overrides
```

## 📝 Adding a Blog Post

1. Create a new file: `content/blog/my-post.mdx`
2. Add front-matter:

```mdx
---
title: "My Post Title"
summary: "One-line description."
date: "2026-04-25"
category: "Programming"   # Programming | Design | WordPress
cover: "https://..."      # Open-Graph image
tags: ["nextjs", "react"]
---

Your content in MDX.
```

3. The post will automatically appear on `/blog`, generate a sitemap entry, RSS feed entry, and have Open Graph meta tags ready for social sharing.

## ⚡ Performance Notes

- Aurora background is a single `<canvas>` — paints in ~0.6ms/frame on a recent laptop.
- Letters in the hero are individual `<span>`s but transformations are GPU-only (`transform`, `opacity`).
- Fonts load via `next/font` with `display: swap`.
- Images use `next/image` with AVIF/WebP automatic optimization.
- All scroll-triggered animations are lazy-imported (no GSAP in the initial bundle).
- Chatbot API includes rate limiting (5 requests per 10 seconds) to prevent abuse.
- Smooth scrolling powered by Lenis for 60fps performance.

## 📜 Available Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the development server (with Turbopack) |
| `npm run build` | Build the production bundle       |
| `npm start`     | Run the production server         |
| `npm run lint`  | Lint the codebase with ESLint     |

## 🔗 Connect

- **Live Site** — [yasajaber.me](https://yasajaber.me)
- **Portfolio repo** — [github.com/YasaJaber/my-real-portfolio](https://github.com/YasaJaber/my-real-portfolio)
- **GitHub** — [@YasaJaber](https://github.com/YasaJaber)
- **LinkedIn** — [Yasa Jaber](https://www.linkedin.com/in/yasa-jaber)

## 📄 License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE) for details.


<div align="center">

Crafted with care by **Yasa Jaber** — Front-End Developer & Graphic Designer from Sohag, Egypt 

**[Visit yasajaber.me](https://yasajaber.me)**

</div>
