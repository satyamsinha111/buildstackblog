import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  author?: string;
  cover?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Post {
  slug: string;
  content: string;
  readingTimeText: string;
  readingTimeMinutes: number;
  wordCount: number;
  frontmatter: PostFrontmatter;
}

export interface PostMeta {
  slug: string;
  readingTimeText: string;
  readingTimeMinutes: number;
  wordCount: number;
  frontmatter: PostFrontmatter;
  excerpt: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFile(filename: string): Post {
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const slug = filename.replace(/\.mdx?$/, "");

  return {
    slug,
    content,
    readingTimeText: stats.text,
    readingTimeMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
    frontmatter: data as PostFrontmatter,
  };
}

function toMeta(post: Post): PostMeta {
  const excerpt =
    post.frontmatter.description ??
    post.content
      .replace(/[#>*_`~\-]/g, "")
      .split("\n")
      .find((l) => l.trim().length > 0)
      ?.slice(0, 180) ??
    "";

  return {
    slug: post.slug,
    readingTimeText: post.readingTimeText,
    readingTimeMinutes: post.readingTimeMinutes,
    wordCount: post.wordCount,
    frontmatter: post.frontmatter,
    excerpt,
  };
}

let _cache: { posts?: Post[] } = {};

export function getAllPosts(): Post[] {
  if (_cache.posts) return _cache.posts;
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f));

  const posts = files
    .map(readPostFile)
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );

  _cache.posts = posts;
  return posts;
}

export function getAllPostMetas(): PostMeta[] {
  return getAllPosts().map(toMeta);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  return getAllPostMetas().filter(
    (p) => p.frontmatter.category === categorySlug,
  );
}

export function getPostsByTag(tag: string): PostMeta[] {
  const lower = tag.toLowerCase();
  return getAllPostMetas().filter((p) =>
    (p.frontmatter.tags ?? []).some((t) => t.toLowerCase() === lower),
  );
}

export function getFeaturedPosts(): PostMeta[] {
  const all = getAllPostMetas();
  const explicit = all.filter((p) => p.frontmatter.featured);
  if (explicit.length > 0) return explicit;
  return all.slice(0, 3);
}

export function getRelatedPosts(
  current: PostMeta | Post,
  limit = 3,
): PostMeta[] {
  const all = getAllPostMetas();
  const currentSlug = "slug" in current ? current.slug : "";
  const currentCategory = current.frontmatter.category;
  const currentTags = new Set((current.frontmatter.tags ?? []).map((t) => t.toLowerCase()));

  return all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0;
      if (p.frontmatter.category === currentCategory) score += 3;
      for (const tag of p.frontmatter.tags ?? []) {
        if (currentTags.has(tag.toLowerCase())) score += 1;
      }
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score || (
      new Date(b.post.frontmatter.date).getTime() -
      new Date(a.post.frontmatter.date).getTime()
    ))
    .slice(0, limit)
    .map((r) => r.post);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPostMetas()) {
    for (const tag of post.frontmatter.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function searchPosts(query: string): PostMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllPostMetas();

  return getAllPostMetas().filter((p) => {
    const haystack = [
      p.frontmatter.title,
      p.frontmatter.description,
      p.frontmatter.category,
      ...(p.frontmatter.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
