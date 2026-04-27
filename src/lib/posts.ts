import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostCategory = "Programming" | "Design" | "WordPress";

export type PostMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: PostCategory;
  cover: string;
  tags: string[];
  readingTime: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) return false;
  return true;
}

export function getAllPostSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): {
  meta: PostMeta;
  content: string;
} | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    summary: String(data.summary ?? ""),
    date: String(data.date ?? new Date().toISOString()),
    category: (data.category as PostCategory) ?? "Programming",
    cover: String(data.cover ?? "/og.png"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: stats.text,
  };

  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug)?.meta)
    .filter((m): m is PostMeta => Boolean(m))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostsByCategory(category: PostCategory): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}
