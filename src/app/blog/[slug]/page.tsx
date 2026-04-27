import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { useMDXComponents } from "../../../../mdx-components";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

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
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.summary,
      url,
      type: "article",
      publishedTime: meta.date,
      authors: [siteConfig.author.name],
      tags: meta.tags,
      images: [{ url: meta.cover, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.summary,
      images: [meta.cover],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const components = useMDXComponents({});
  const { content } = await compileMDX({
    source: post.content,
    components,
    options: { parseFrontmatter: false },
  });

  const { meta } = post;
  return (
    <article className="relative">
      {/* Cover */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={meta.cover}
          alt={meta.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/70 to-transparent" />
      </div>

      {/* Header */}
      <div className="section-wrapper -mt-40 pt-0">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
            data-cursor-grow
          >
            <ArrowLeft size={14} /> All articles
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/70">
              {meta.category}
            </span>
            <span>{formatDate(meta.date)}</span>
            <span>·</span>
            <span>{meta.readingTime}</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            {meta.title}
          </h1>
          <p className="mt-6 text-xl text-white/75">{meta.summary}</p>

          <div className="my-10 hairline" />

          <div className="prose prose-invert max-w-none">{content}</div>

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
  );
}
