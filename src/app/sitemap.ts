import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const posts = getAllPosts();
  const latestPostDate = posts[0] ? new Date(posts[0].date) : now;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: { en: base, ar: base },
      },
    },
    {
      url: `${base}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: { en: `${base}/blog`, ar: `${base}/blog` },
      },
    },
    {
      url: `${base}/feed.xml`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const blogPosts = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${base}/blog/${p.slug}`,
        ar: `${base}/blog/${p.slug}`,
      },
    },
  }));

  return [...staticPages, ...blogPosts];
}
