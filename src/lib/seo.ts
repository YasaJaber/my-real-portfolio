import type { PostMeta } from "@/lib/posts";
import { siteConfig } from "@/config/site";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export const siteKeywords = Array.from(
  new Set([...siteConfig.seo.nameVariants, ...siteConfig.seo.primaryKeywords])
);

export function absoluteUrl(path = "") {
  if (!path) return siteConfig.url;
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, siteConfig.url).toString();
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}#person`,
    name: siteConfig.author.name,
    alternateName: siteConfig.seo.nameVariants,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.profileImage),
    email: siteConfig.author.email,
    jobTitle: [siteConfig.author.role, siteConfig.author.roleAr],
    description: [siteConfig.description, siteConfig.descriptionAr],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sohag",
      addressCountry: "EG",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Egyptian E-Learning University",
    },
    sameAs: siteConfig.author.sameAs,
    knowsAbout: [
      "Front-End Development",
      "Graphic Design",
      "React",
      "Next.js",
      "TypeScript",
      "GSAP",
      "WordPress",
      "UI Design",
      "Motion Design",
      "تطوير الواجهات الأمامية",
      "تصميم الجرافيك",
      "تصميم المواقع",
    ],
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    alternateName: [siteConfig.nameAr, ...siteConfig.seo.nameVariants],
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.ogImage),
    founder: {
      "@id": `${siteConfig.url}#person`,
    },
    sameAs: siteConfig.author.sameAs,
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    alternateName: [siteConfig.nameAr, ...siteConfig.seo.nameVariants],
    url: siteConfig.url,
    description: [siteConfig.description, siteConfig.descriptionAr],
    inLanguage: ["en", "ar"],
    publisher: {
      "@id": `${siteConfig.url}#organization`,
    },
    author: {
      "@id": `${siteConfig.url}#person`,
    },
  };
}

export function buildHomePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}#webpage`,
    url: siteConfig.url,
    name: `${siteConfig.name} | ${siteConfig.nameAr}`,
    description: [siteConfig.description, siteConfig.descriptionAr],
    inLanguage: ["en", "ar"],
    isPartOf: {
      "@id": `${siteConfig.url}#website`,
    },
    mainEntity: {
      "@id": `${siteConfig.url}#person`,
    },
    about: {
      "@id": `${siteConfig.url}#person`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(siteConfig.profileImage),
    },
  };
}

export function buildBlogJsonLd(posts: PostMeta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    name: `Blog — ${siteConfig.name}`,
    alternateName: [`مدونة ${siteConfig.nameAr}`, `مدونة ${siteConfig.author.nameAr}`],
    description:
      "Essays on front-end engineering, motion design, modern WordPress, and web development by Yasa Jaber.",
    url: `${siteConfig.url}/blog`,
    inLanguage: ["en", "ar"],
    publisher: {
      "@id": `${siteConfig.url}#organization`,
    },
    author: {
      "@id": `${siteConfig.url}#person`,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      url: absoluteUrl(`/blog/${post.slug}`),
      image: absoluteUrl(post.cover),
      inLanguage: post.lang === "ar" ? "ar" : "en",
    })),
  };
}

export function buildCollectionPageJsonLd(posts: PostMeta[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/blog#collection`,
    url: `${siteConfig.url}/blog`,
    name: `Blog Articles — ${siteConfig.name}`,
    isPartOf: {
      "@id": `${siteConfig.url}#website`,
    },
    about: {
      "@id": `${siteConfig.url}#person`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/blog/${post.slug}`),
        name: post.title,
      })),
    },
  };
}

export function buildBlogPostingJsonLd(post: PostMeta, articleBody: string) {
  const postUrl = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.title,
    description: post.summary,
    image: absoluteUrl(post.cover),
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    mainEntityOfPage: postUrl,
    inLanguage: post.lang === "ar" ? "ar" : "en",
    articleSection: post.category,
    keywords: post.tags.join(", "),
    articleBody,
    wordCount: articleBody.split(/\s+/u).filter(Boolean).length,
    author: {
      "@id": `${siteConfig.url}#person`,
    },
    publisher: {
      "@id": `${siteConfig.url}#organization`,
    },
  };
}
