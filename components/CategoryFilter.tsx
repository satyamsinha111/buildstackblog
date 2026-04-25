"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { categories } from "@/lib/categories";

interface CategoryFilterProps {
  activeSlug?: string;
}

export function CategoryFilter({ activeSlug }: CategoryFilterProps) {
  const segments = useSelectedLayoutSegments();
  const inferred = segments[0] === "category" ? segments[1] : undefined;
  const active = activeSlug ?? inferred;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/blog"
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
          !active
            ? "bg-fg text-fg-inverted"
            : "border border-line text-fg-muted hover:border-line-strong hover:text-fg"
        }`}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/category/${c.slug}`}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            active === c.slug
              ? "bg-fg text-fg-inverted"
              : "border border-line text-fg-muted hover:border-line-strong hover:text-fg"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
