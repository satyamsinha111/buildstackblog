import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/BlogCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PageHeader } from "@/components/PageHeader";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug);

  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow={`Section · ${posts.length} article${posts.length === 1 ? "" : "s"}`}
        title={category.name}
        description={category.description}
      />

      <CategoryFilter activeSlug={category.slug} />

      {posts.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-line bg-canvas-subtle/40 p-10 text-center text-sm text-fg-muted">
          No articles in this section yet. Check back soon.
        </p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
