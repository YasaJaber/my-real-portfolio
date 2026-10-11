"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PostCategory, PostMeta } from "@/lib/posts";

type SearchablePost = PostMeta & { searchText: string };

interface Props {
  posts: SearchablePost[];
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي");
}

export function BlogSearch({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | PostCategory>("All");
  const categories: ("All" | PostCategory)[] = [
    "All",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  const filteredPosts = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);

    return posts.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      const searchableText = normalize(
        [post.title, post.summary, post.category, ...post.tags, post.searchText].join(" "),
      );
      return terms.every((term) => searchableText.includes(term));
    });
  }, [category, posts, query]);

  return (
    <>
      <div className="mb-7">
        <label htmlFor="blog-search" className="sr-only">
          Search articles by title, topic, or keyword
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 transition-colors focus-within:border-accent-cyan/50 focus-within:bg-white/[0.05]">
          <Search size={18} className="shrink-0 text-white/45" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search in Arabic or English…"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter articles by category">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-cyan ${
              category === item
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-white/45" aria-live="polite">
        {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
      </p>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {filteredPosts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-3 py-6 transition-colors hover:bg-white/[0.02] sm:py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:px-2"
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
                <h2 className="font-display text-xl font-semibold leading-snug text-white transition-colors group-hover:text-accent-cyan sm:text-2xl md:text-3xl">
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

      {filteredPosts.length === 0 && (
        <div className="rounded-b-3xl border-x border-b border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-white/60">
          No articles found. Try a different title, topic, or keyword.
        </div>
      )}
    </>
  );
}
