import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BlogCard } from "@/components/BlogCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SubscribeCard } from "@/components/SubscribeCard";
import { getAllPostMetas, getFeaturedPosts } from "@/lib/posts";

export default function HomePage() {
  const featured = getFeaturedPosts();
  const allPosts = getAllPostMetas();
  const totalCount = allPosts.length;

  const lead = featured[0] ?? allPosts[0];
  const secondaryFeatured = featured.slice(1, 4);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  if (lead) featuredSlugs.add(lead.slug);

  const latest = allPosts.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 6);
  const editorsPicks = allPosts
    .filter((p) => p.slug !== lead?.slug)
    .slice(0, 5);

  return (
    <>
      <Hero totalCount={totalCount} />

      {/* Lead story */}
      {lead && (
        <section className="container mt-16 sm:mt-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <h2 className="eyebrow">This issue</h2>
            <Link
              href="/blog"
              className="hidden text-sm text-fg-muted hover:text-fg sm:inline-flex"
            >
              All articles →
            </Link>
          </div>
          <BlogCard post={lead} variant="lead" />
        </section>
      )}

      {/* Secondary featured */}
      {secondaryFeatured.length > 0 && (
        <section className="container mt-20 border-t border-line pt-16">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Editor&rsquo;s selection</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tightish text-fg sm:text-4xl">
                Featured this week
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryFeatured.map((post) => (
              <BlogCard key={post.slug} post={post} variant="feature" />
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      <section className="container mt-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Sections</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tightish text-fg sm:text-4xl">
              Browse by topic
            </h2>
          </div>
        </div>
        <CategoryGrid />
      </section>

      {/* Latest + sidebar */}
      <section className="container mt-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Recent</p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tightish text-fg sm:text-4xl">
                Latest articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm text-fg-muted hover:text-fg sm:inline-flex"
            >
              View all ({totalCount}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
            {latest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="mt-10 sm:hidden">
            <Link href="/blog" className="btn-secondary w-full">
              View all articles
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-line">
          <div className="sticky top-24">
            <p className="eyebrow">Editor&rsquo;s picks</p>
            <h3 className="mt-3 font-display text-2xl font-medium tracking-tightish text-fg">
              Reader favorites
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              Hand-picked deep dives from the archive — the pieces our readers
              keep coming back to.
            </p>
            <ol className="mt-6 divide-y divide-line">
              {editorsPicks.map((post, idx) => (
                <li
                  key={post.slug}
                  className="flex items-start gap-4 py-4 first:pt-0"
                >
                  <span className="font-display text-2xl font-medium text-fg-subtle tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group min-w-0 flex-1"
                  >
                    <p className="eyebrow text-fg-subtle">
                      {post.frontmatter.category.replace("-", " ")}
                    </p>
                    <p className="mt-1 font-display text-[17px] font-medium leading-snug text-fg group-hover:underline group-hover:underline-offset-4">
                      {post.frontmatter.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      {/* Newsletter */}
      <section className="container mt-24">
        <SubscribeCard />
      </section>
    </>
  );
}
