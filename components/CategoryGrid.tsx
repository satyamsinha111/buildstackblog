import Link from "next/link";
import { categories } from "@/lib/categories";
import { getAllPostMetas } from "@/lib/posts";

export function CategoryGrid() {
  const all = getAllPostMetas();
  const counts = new Map<string, number>();
  for (const p of all) {
    counts.set(
      p.frontmatter.category,
      (counts.get(p.frontmatter.category) ?? 0) + 1,
    );
  }

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const count = counts.get(category.slug) ?? 0;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group relative flex flex-col gap-4 bg-canvas p-7 transition hover:bg-canvas-subtle"
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${category.accent} font-display text-lg font-medium text-white shadow-soft`}
              >
                {category.mark}
              </span>
              <span className="font-mono text-[11px] tracking-wider text-fg-subtle">
                {String(count).padStart(2, "0")} articles
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium tracking-tightish text-fg">
                {category.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {category.description}
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-fg">
              <span className="bg-[linear-gradient(transparent_calc(100%_-_1px),rgb(var(--fg)/0.4)_1px)] bg-no-repeat [background-size:0%_100%] transition-[background-size] duration-300 group-hover:[background-size:100%_100%]">
                Browse {category.shortName.toLowerCase()}
              </span>
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
          </Link>
        );
      })}
      <div className="hidden lg:block bg-canvas p-7" />
    </div>
  );
}
