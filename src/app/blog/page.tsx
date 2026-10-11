import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { BlogSearch } from "@/components/sections/BlogSearch";
import { siteConfig } from "@/config/site";
import {
  buildBlogJsonLd,
  buildBreadcrumbList,
  buildCollectionPageJsonLd,
  siteKeywords,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog Articles",
  description:
    "Blog by Yasa Jaber with SEO-friendly articles about front-end engineering, React, Next.js, WordPress, and web design. مقالات يسي جابر عن تطوير الويب والفرونت اند.",
  keywords: [
    ...siteKeywords,
    "Yasa Jaber blog",
    "يسي جابر مدونة",
    "ياسا جابر مدونة",
    "front-end engineering",
    "web development articles",
    "مقالات برمجة",
    "Next.js tutorials",
    "React articles",
    "SEO articles",
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog`,
    languages: { "en-US": `${siteConfig.url}/blog`, "ar-EG": `${siteConfig.url}/blog` },
  },
  openGraph: {
    title: `Blog — ${siteConfig.name}`,
    description:
      "Articles by Yasa Jaber about front-end development, SEO, design, and WordPress.",
    url: `${siteConfig.url}/blog`,
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Blog by ${siteConfig.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog — ${siteConfig.name}`,
    description: "Articles and tutorials by Yasa Jaber.",
    images: [siteConfig.ogImage],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts().map((post) => ({
    ...post,
    searchText: Array.from(
      new Set((getPostBySlug(post.slug)?.content ?? "").split(/\s+/).filter(Boolean)),
    ).join(" "),
  }));
  const blogJsonLd = buildBlogJsonLd(posts);
  const collectionJsonLd = buildCollectionPageJsonLd(posts);
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="section-wrapper pt-32 sm:pt-36 md:pt-40">
      {/* Header */}
      <div className="mb-14 max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
          Blog
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          Articles
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/65">
          Notes on front-end engineering, design, and WordPress.
        </p>
      </div>

      <BlogSearch posts={posts} />
    </div>
    </>
  );
}
