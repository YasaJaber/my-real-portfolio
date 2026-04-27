<div align="center">

# Yasa Jaber — Portfolio

**A high-performance Single Page Application portfolio that bridges Front-End engineering and Graphic Design.**

Built around an animated Aurora Mesh Gradient, interactive typography, and cinematic page transitions.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

</div>

---

## Highlights

- **Interactive Hero** — Each letter of the name is its own DOM node. Hover to magnetize, click to explode into particles.
- **Aurora Mesh Background** — A pure 2D Canvas mesh of 5 drifting color blobs that follow the cursor and ripple on click. Hue subtly shifts each click.
- **Cinematic Transitions** — Liquid zoom/blur transitions between routes via Framer Motion's `AnimatePresence`.
- **Glassmorphism UI** — Cards, navbar, and panels rendered with `backdrop-blur` over the live mesh.
- **MDX Blog** — File-based articles with categories (`Programming`, `Design`, `WordPress`), reading-time, and dynamic Open Graph metadata for every post.
- **Accessible** — Honors `prefers-reduced-motion`. All interactive elements are keyboard reachable.

## Tech Stack

| Layer       | Tools                                                                |
| ----------- | -------------------------------------------------------------------- |
| Core        | **Next.js 16** (App Router, Turbopack, React Compiler, async params) |
| UI          | **React 19** + **Tailwind CSS** + custom CSS variables               |
| Animations  | **GSAP + ScrollTrigger** · **Framer Motion** · **Lenis** smooth scroll |
| Graphics    | **Canvas 2D** for the aurora mesh                                    |
| Content     | **MDX** with `gray-matter`, `reading-time`, `rehype-pretty-code`, `shiki` |
| Language    | **TypeScript** (strict mode, path aliases via `@/*`)                 |

## Color System (Modern Dark Mesh)

| Token             | Hex       | Use                                |
| ----------------- | --------- | ---------------------------------- |
| `base`            | `#030303` | Deep canvas behind everything      |
| `accent.purple`   | `#A855F7` | Primary highlight, CTAs            |
| `accent.cyan`     | `#06B6D4` | Secondary highlight, links         |
| `accent.midnight` | `#1E3A8A` | Depth & shadow blobs               |
| `accent.rose`     | `#F43F5E` | Tertiary, occasional accents       |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/YasaJaber/my-real-portfolio.git
cd my-real-portfolio

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build && npm start
```

> Requires Node.js 18.18+ (Node 20+ recommended for Next 16).

## Project Structure

```
src/
  app/                      # Next.js App Router pages
    page.tsx                # Home (Hero · About · Work · Blog · Contact)
    blog/page.tsx           # Blog index with categories
    blog/[slug]/page.tsx    # Dynamic article page (MDX) + dynamic OG
    sitemap.ts robots.ts    # SEO essentials
  components/
    layout/                 # Navbar · Footer · PageTransition
    sections/               # Hero · About · Work · BlogTeaser · Contact
    visuals/                # AuroraBackground · CursorGlow · InteractiveName
  config/site.ts            # Site-wide config (nav, links, author)
  data/projects.ts          # Project showcase data
  hooks/                    # Custom React hooks
  lib/                      # utils, posts (MDX loader)
content/
  blog/*.mdx                # Articles (front-matter driven)
public/                     # Static assets (CV, logo, hero image, sounds)
mdx-components.tsx          # MDX component overrides
```

## Adding a Blog Post

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

3. The post will automatically appear on `/blog`, generate a sitemap entry, and have Open Graph meta tags ready for social sharing.

## Performance Notes

- Aurora background is a single `<canvas>` — paints in ~0.6ms/frame on a recent laptop.
- Letters in the hero are individual `<span>`s but transformations are GPU-only (`transform`, `opacity`).
- Fonts load via `next/font` with `display: swap`.
- Images use `next/image` with AVIF/WebP.
- All scroll-triggered animations are lazy-imported (no GSAP in the initial bundle).

## Available Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the development server      |
| `npm run build` | Build the production bundle       |
| `npm start`     | Run the production server         |
| `npm run lint`  | Lint the codebase with ESLint     |

## Connect

- **Portfolio repo** — [github.com/YasaJaber/my-real-portfolio](https://github.com/YasaJaber/my-real-portfolio)
- **GitHub** — [@YasaJaber](https://github.com/YasaJaber)

## License

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Crafted with care by **Yasa Jaber** — in Sohag.

</div>
