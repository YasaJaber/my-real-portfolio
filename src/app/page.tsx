import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { Contact } from "@/components/sections/Contact";
import { siteConfig } from "@/config/site";
import {
  buildBreadcrumbList,
  buildHomePageJsonLd,
  siteKeywords,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.nameAr}`,
  description:
    "Yasa Jaber portfolio for front-end development, graphic design, React, Next.js, and WordPress services in Egypt and worldwide. بورتفوليو يسي جابر لمشاريع تطوير الواجهات الأمامية وتصميم المواقع.",
  keywords: [
    ...siteKeywords,
    "Yasa Jaber portfolio",
    "يسي جابر بورتفوليو",
    "يسي جابر بورتفوليو",
    "Front-End Developer Egypt",
    "مطور واجهات أمامية مصر",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.nameAr}`,
    description:
      "Portfolio of Yasa Jaber, front-end developer and graphic designer building fast, modern, SEO-friendly websites.",
    url: siteConfig.url,
    type: "profile",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.nameAr}`,
    description:
      "Front-end developer and graphic designer portfolio by Yasa Jaber.",
    images: [siteConfig.ogImage],
  },
};

export default function HomePage() {
  const homePageJsonLd = buildHomePageJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: "Home", url: siteConfig.url },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Hero />
      <About />
      <Skills />
      <Services />
      <Process />
      <Work />
      <BlogTeaser />
      <Contact />
    </>
  );
}
