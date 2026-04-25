import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { PageHeader } from "@/components/PageHeader";
import { getAllTags, getPostsByTag } from "@/lib/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({
    slug: encodeURIComponent(tag.toLowerCase()),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  return {
    title: `#${tag}`,
    description: `Articles tagged with "${tag}" on BuildStack.`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  const displayTag =
    posts[0].frontmatter.tags?.find((t) => t.toLowerCase() === tag.toLowerCase()) ??
    tag;

  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow={`Tag · ${posts.length} article${posts.length === 1 ? "" : "s"}`}
        title={`#${displayTag}`}
        description={`Every article we've published tagged with "${displayTag}".`}
      />

      <div className="mb-10">
        <Link href="/blog" className="btn-ghost">
          ← All articles
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
