import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { getMDXComponents } from "../../../../mdx-components";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  absoluteUrl,
  buildBlogPostingJsonLd,
  buildBreadcrumbList,
  siteKeywords,
} from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { meta } = post;
  const url = `${siteConfig.url}/blog/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.summary,
    keywords: [
      ...siteKeywords,
      ...meta.tags,
      siteConfig.author.name,
      siteConfig.author.nameAr,
    ],
    alternates: {
      canonical: url,
      languages: {
        "en-US": url,
        "ar-EG": url,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.summary,
      url,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.date,
      authors: [siteConfig.author.name],
      tags: meta.tags,
      images: [
        {
          url: absoluteUrl(meta.cover),
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale: meta.lang === "ar" ? "ar_AR" : "en_US",
      alternateLocale: meta.lang === "ar" ? ["en_US"] : ["ar_AR"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.summary,
      images: [absoluteUrl(meta.cover)],
      creator: siteConfig.seo.socialHandle,
    },
    category: meta.category,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const components = getMDXComponents({});
  const { content } = await compileMDX({
    source: post.content,
    components,
    options: { parseFrontmatter: false },
  });

  const { meta } = post;
  const isRTL = meta.lang === "ar";
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const articleBody = post.content.replace(/\n{2,}/g, "\n").trim();
  const jsonLd = buildBlogPostingJsonLd(meta, articleBody);
  const breadcrumbJsonLd = buildBreadcrumbList([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: meta.title, url: `${siteConfig.url}/blog/${meta.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="relative" dir={isRTL ? "rtl" : "ltr"} lang={meta.lang}>
        {/* Cover */}
        <div className="relative w-full overflow-hidden pb-0 pt-20 sm:pt-24">
          {/* Blurred background fill */}
          <div className="absolute inset-0">
            <Image
              src={meta.cover}
              alt=""
              fill
              sizes="100vw"
              className="object-cover scale-125 blur-3xl opacity-35"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-base/40" />
          </div>

          {/* Centered contained image */}
          <div className="relative mx-auto max-w-3xl px-4 pb-0 pt-8 sm:px-6 sm:pt-10">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_25px_100px_-20px_rgba(168,85,247,0.35)] ring-1 ring-white/5">
              <Image
                src={meta.cover}
                alt={meta.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          {/* Bottom fade into content */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base to-transparent" />
        </div>

        {/* Header */}
        <div className="section-wrapper -mt-16 pt-0">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
              data-cursor-grow
            >
              <BackArrow size={14} />
              {isRTL ? "جميع المقالات" : "All articles"}
            </Link>

            <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/70">
                {meta.category}
              </span>
              <span>{formatDate(meta.date)}</span>
              <span>·</span>
              <span>{meta.readingTime}</span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
              {meta.title}
            </h1>
            <p className="mt-5 text-base text-white/75 sm:text-lg md:text-xl">{meta.summary}</p>

            <div className="my-10 hairline" />

            <div className={`prose prose-invert max-w-none ${isRTL ? "prose-rtl text-right leading-[2]" : ""}`}>
              {content}
            </div>

            {meta.tags?.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {meta.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
