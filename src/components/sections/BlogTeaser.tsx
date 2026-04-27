import { getAllPosts } from "@/lib/posts";
import { BlogTeaserList } from "./BlogTeaserList";

export function BlogTeaser() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      category: p.category,
      readingTime: p.readingTime,
    }));

  if (posts.length === 0) return null;

  return <BlogTeaserList posts={posts} />;
}
