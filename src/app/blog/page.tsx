import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts, type PostCategory } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Essays on front-end engineering, motion design, and modern WordPress — by Yasa Jaber.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog — ${siteConfig.name}`,
    description:
      "Essays on front-end engineering, motion design, and modern WordPress.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

const categories: ("All" | PostCategory)[] = [
  "All",
  "Programming",
  "Design",
  "WordPress",
];

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="section-wrapper pt-40">
      {/* Header */}
      <div className="mb-14 max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
          Blog
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          Articles
        </h1>
        <p className="mt-5 text-base leading-relaxed text-white/65">
          Notes on front-end engineering, design, and WordPress.
        </p>
      </div>

      {/* Category chips (visual only on this static version) */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="cursor-default rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/65 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Posts list */}
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-3 py-8 transition-colors hover:bg-white/[0.02] md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:px-2"
              data-cursor-grow
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-white/70">
                    {post.category}
                  </span>
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold leading-snug text-white transition-colors group-hover:text-accent-cyan md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 max-w-2xl text-white/65">{post.summary}</p>
              </div>
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black"
                aria-hidden
              >
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-white/60">
          No posts yet — check back soon.
        </div>
      )}
    </div>
  );
}
