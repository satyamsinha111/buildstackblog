import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatPostDate } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import { CoverArt } from "./CoverArt";

interface BlogCardProps {
  post: PostMeta;
  variant?: "default" | "compact" | "feature" | "lead" | "list";
  className?: string;
  showCover?: boolean;
}

export function BlogCard({
  post,
  variant = "default",
  className = "",
  showCover = true,
}: BlogCardProps) {
  const { slug, frontmatter, readingTimeMinutes } = post;
  const category = getCategoryBySlug(frontmatter.category);
  const href = `/blog/${slug}`;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={`group flex items-start gap-4 py-4 ${className}`}
      >
        <div className="hidden h-14 w-14 flex-none overflow-hidden rounded-xl ring-1 ring-line/60 sm:block">
          <CoverArt
            slug={slug}
            title={frontmatter.title}
            category={frontmatter.category}
            variant="card"
            className="!aspect-square !rounded-xl"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-subtle">
            <span>{category?.shortName ?? "Article"}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono normal-case tracking-normal">
              {readingTimeMinutes} min
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-base font-medium leading-snug tracking-tightish text-fg group-hover:underline group-hover:underline-offset-4">
            {frontmatter.title}
          </h3>
        </div>
      </Link>
    );
  }

  if (variant === "list") {
    return (
      <Link
        href={href}
        className={`group grid grid-cols-1 gap-6 border-b border-line py-8 last:border-b-0 sm:grid-cols-[1fr_auto] ${className}`}
      >
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-2">
            {category && <span>{category.shortName}</span>}
            <span aria-hidden="true">·</span>
            <span>{formatPostDate(frontmatter.date)}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium leading-[1.2] tracking-tightish text-fg sm:text-[26px]">
            <span className="bg-[linear-gradient(transparent_calc(100%_-_1px),rgb(var(--fg)/0.25)_1px)] bg-no-repeat [background-size:0%_100%] transition-[background-size] duration-300 group-hover:[background-size:100%_100%]">
              {frontmatter.title}
            </span>
          </h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
            {frontmatter.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-fg-subtle">
            <span className="font-mono">{readingTimeMinutes} min read</span>
            {frontmatter.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{frontmatter.author}</span>
              </>
            )}
          </div>
        </div>
        {showCover && (
          <div className="hidden w-44 flex-none sm:block">
            <CoverArt
              slug={slug}
              title={frontmatter.title}
              category={frontmatter.category}
              variant="card"
              className="!aspect-[4/3]"
            />
          </div>
        )}
      </Link>
    );
  }

  if (variant === "lead") {
    return (
      <Link
        href={href}
        className={`group grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 ${className}`}
      >
        <div className="lg:col-span-7">
          {showCover && (
            <CoverArt
              slug={slug}
              title={frontmatter.title}
              category={frontmatter.category}
              variant="lead"
            />
          )}
        </div>
        <div className="flex flex-col justify-center lg:col-span-5">
          <div className="eyebrow flex items-center gap-2">
            <span>Lead story</span>
            <span aria-hidden="true">·</span>
            {category && <span>{category.shortName}</span>}
          </div>
          <h2 className="mt-4 font-display text-3xl font-medium leading-[1.1] tracking-crisp text-fg text-balance sm:text-4xl lg:text-[44px]">
            <span className="bg-[linear-gradient(transparent_calc(100%_-_1px),rgb(var(--fg)/0.25)_1px)] bg-no-repeat [background-size:0%_100%] transition-[background-size] duration-300 group-hover:[background-size:100%_100%]">
              {frontmatter.title}
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted sm:text-[17px]">
            {frontmatter.description}
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs text-fg-subtle">
            <span>{formatPostDate(frontmatter.date)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{readingTimeMinutes} min read</span>
            {frontmatter.author && (
              <>
                <span aria-hidden="true">·</span>
                <span>{frontmatter.author}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "feature") {
    return (
      <Link
        href={href}
        className={`group flex flex-col gap-5 ${className}`}
      >
        {showCover && (
          <CoverArt
            slug={slug}
            title={frontmatter.title}
            category={frontmatter.category}
            variant="feature"
          />
        )}
        <div>
          <div className="eyebrow flex items-center gap-2">
            {category && <span>{category.shortName}</span>}
            <span aria-hidden="true">·</span>
            <span className="font-mono normal-case tracking-normal">
              {readingTimeMinutes} min
            </span>
          </div>
          <h3 className="mt-2.5 font-display text-2xl font-medium leading-[1.2] tracking-tightish text-fg text-balance sm:text-[26px]">
            <span className="bg-[linear-gradient(transparent_calc(100%_-_1px),rgb(var(--fg)/0.25)_1px)] bg-no-repeat [background-size:0%_100%] transition-[background-size] duration-300 group-hover:[background-size:100%_100%]">
              {frontmatter.title}
            </span>
          </h3>
          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-fg-muted">
            {frontmatter.description}
          </p>
        </div>
      </Link>
    );
  }

  // default
  return (
    <Link
      href={href}
      className={`group flex flex-col ${className}`}
    >
      {showCover && (
        <CoverArt
          slug={slug}
          title={frontmatter.title}
          category={frontmatter.category}
          variant="card"
        />
      )}
      <div className="mt-5">
        <div className="eyebrow flex items-center gap-2">
          {category && <span>{category.shortName}</span>}
          <span aria-hidden="true">·</span>
          <span className="font-mono normal-case tracking-normal">
            {readingTimeMinutes} min
          </span>
        </div>
        <h3 className="mt-2.5 font-display text-xl font-medium leading-snug tracking-tightish text-fg text-balance">
          <span className="bg-[linear-gradient(transparent_calc(100%_-_1px),rgb(var(--fg)/0.25)_1px)] bg-no-repeat [background-size:0%_100%] transition-[background-size] duration-300 group-hover:[background-size:100%_100%]">
            {frontmatter.title}
          </span>
        </h3>
        <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-fg-muted">
          {frontmatter.description}
        </p>
        <div className="mt-3 text-xs text-fg-subtle">
          {formatPostDate(frontmatter.date)}
        </div>
      </div>
    </Link>
  );
}
