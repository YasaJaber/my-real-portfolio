"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/visuals/Reveal";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  readingTime: string;
}

interface Props {
  posts: BlogPost[];
}

export function BlogTeaserList({ posts }: Props) {
  const { locale, t } = useLanguage();

  return (
    <section className="section-wrapper">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
        <div>
          <Reveal direction="up" distance={14}>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
              {t.blog.label[locale]}
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {t.blog.heading[locale]}
            </h2>
          </Reveal>
        </div>
        <Reveal direction="up" delay={0.16}>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm text-white/65 underline-offset-4 transition-colors hover:text-white"
            data-cursor-grow
          >
            <span className="border-b border-white/0 transition-colors group-hover:border-white/60">
              {t.blog.viewAll[locale]}
            </span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="divide-y divide-white/10 border-y border-white/10"
      >
        {posts.map((post) => (
          <motion.li
            key={post.slug}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: easeOut },
              },
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group relative grid gap-2 py-6 transition-colors hover:bg-white/[0.02] sm:py-7 md:grid-cols-[160px_1fr_auto] md:items-center md:gap-10 md:px-2"
              data-cursor-grow
            >
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-px w-0 -translate-y-1/2 bg-white/40 transition-all duration-500 ease-out group-hover:w-6 rtl:left-auto rtl:right-0"
              />

              <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 md:pl-8 md:group-hover:pl-12 md:group-hover:text-white/70 rtl:md:pl-0 rtl:md:pr-8 rtl:md:group-hover:pl-0 rtl:md:group-hover:pr-12">
                {formatDate(post.date)}
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  {post.category} · {post.readingTime}
                </div>
                <h3 className="font-display text-lg font-semibold text-white transition-transform duration-500 ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-hover:translate-x-0 md:text-xl">
                  {post.title}
                </h3>
              </div>
              <span
                className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-white/35 group-hover:bg-white/[0.1] md:grid"
                aria-hidden
              >
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
