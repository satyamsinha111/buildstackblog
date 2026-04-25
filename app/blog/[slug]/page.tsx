import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BlogCard } from "@/components/BlogCard";
import { SubscribeCard } from "@/components/SubscribeCard";
import { CoverArt } from "@/components/CoverArt";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadingProgress } from "@/components/ReadingProgress";
import { AuthorFooter } from "@/components/AuthorFooter";
import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import { siteConfig } from "@/lib/site";
import { extractHeadings } from "@/lib/slug";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  const title = post.frontmatter.title;
  const description = post.frontmatter.description;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.updated ?? post.frontmatter.date,
      authors: [post.frontmatter.author ?? siteConfig.author.name],
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategoryBySlug(post.frontmatter.category);
  const related = getRelatedPosts(post, 3);
  const headings = extractHeadings(post.content);
  const author = post.frontmatter.author ?? siteConfig.author.name;
  const date = formatPostDate(post.frontmatter.date);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updated ?? post.frontmatter.date,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
    keywords: post.frontmatter.tags?.join(", "),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <ReadingProgress />

      {/* Article header */}
      <header className="container pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-xs text-fg-subtle">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-fg">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-fg">
                Articles
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/category/${category.slug}`}
                    className="hover:text-fg"
                  >
                    {category.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-3xl">
          {category && (
            <p className="eyebrow flex items-center gap-2">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r ${category.accent}`}
              />
              {category.name}
            </p>
          )}
          <h1 className="mt-5 font-display text-[40px] font-medium leading-[1.08] tracking-crisp text-fg text-balance sm:text-5xl md:text-[58px]">
            {post.frontmatter.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted text-pretty sm:text-xl">
            {post.frontmatter.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
            <span className="text-fg">{author}</span>
            <span aria-hidden="true" className="text-fg-subtle">
              ·
            </span>
            <time dateTime={post.frontmatter.date}>{date}</time>
            <span aria-hidden="true" className="text-fg-subtle">
              ·
            </span>
            <span className="font-mono text-fg-subtle">
              {post.readingTimeText}
            </span>
            <span aria-hidden="true" className="text-fg-subtle">
              ·
            </span>
            <span className="font-mono text-fg-subtle">
              {post.wordCount.toLocaleString()} words
            </span>
          </div>
        </div>

        {/* Cover art */}
        <div className="mx-auto mt-12 max-w-5xl">
          <CoverArt
            slug={post.slug}
            title={post.frontmatter.title}
            category={post.frontmatter.category}
            variant="post"
          />
        </div>
      </header>

      {/* Article body with TOC sidebar */}
      <div className="container mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <MarkdownContent content={post.content} />

            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="mt-14 border-t border-line pt-8">
                <p className="eyebrow">Filed under</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      className="chip transition hover:border-line-strong hover:text-fg"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AuthorFooter
              author={author}
              date={date}
              title={post.frontmatter.title}
              slug={post.slug}
            />
          </div>

          {headings.length >= 3 && (
            <aside className="hidden lg:col-span-2 lg:col-start-11 lg:block">
              <div className="sticky top-24">
                <TableOfContents items={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mt-24 border-t border-line pt-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Keep reading</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tightish text-fg sm:text-4xl">
                Related articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm text-fg-muted hover:text-fg sm:inline-flex"
            >
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} variant="feature" />
            ))}
          </div>
        </section>
      )}

      <section className="container mt-24">
        <SubscribeCard />
      </section>
    </article>
  );
}
