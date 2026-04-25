import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PageHeader } from "@/components/PageHeader";
import { SearchBar } from "@/components/SearchBar";
import { getAllPostMetas, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "All BuildStack articles on web development, AI tools, performance, and engineering best practices.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPostMetas();
  const tags = getAllTags().slice(0, 14);
  const featured = posts.filter((p) => p.frontmatter.featured).slice(0, 1);
  const lead = featured[0] ?? posts[0];
  const rest = lead ? posts.filter((p) => p.slug !== lead.slug) : posts;

  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="The Archive"
        title="All articles"
        description="Browse every BuildStack article. Filter by topic, search by keyword, or just scroll — every piece is written to be worth your time."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5 lg:col-span-5">
          <SearchBar posts={posts} placeholder="Search articles…" />
        </div>
        <div className="md:col-span-7 lg:col-span-7 md:justify-self-end">
          <CategoryFilter />
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2 border-y border-line py-5">
          <span className="eyebrow mr-2">Popular tags</span>
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className="chip transition hover:border-line-strong hover:text-fg"
            >
              {tag}
              <span className="text-fg-subtle">·{count}</span>
            </Link>
          ))}
        </div>
      )}

      {lead && (
        <section className="mt-14">
          <p className="eyebrow mb-6">Top story</p>
          <BlogCard post={lead} variant="lead" />
        </section>
      )}

      <section className="mt-20 border-t border-line pt-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">All {posts.length} articles</p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tightish text-fg sm:text-3xl">
              The full archive
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
