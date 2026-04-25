export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  /** Tailwind gradient classes for accent strips and cover art base */
  accent: string;
  /** Two hex stops used for generated cover art (light + dark variants are derived) */
  cover: { from: string; to: string; tint: string };
  /** Single-letter mark used in compact contexts */
  mark: string;
}

export const categories: Category[] = [
  {
    slug: "web-development",
    name: "Web Development",
    shortName: "Web Dev",
    description:
      "Frameworks, patterns, and the everyday craft of shipping reliable web applications.",
    accent: "from-sky-500 via-indigo-500 to-violet-600",
    cover: { from: "#0ea5e9", to: "#7c3aed", tint: "#312e81" },
    mark: "W",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    shortName: "AI",
    description:
      "Honest reviews and practical workflows for using AI tooling without losing your edge as an engineer.",
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
    cover: { from: "#d946ef", to: "#f43f5e", tint: "#831843" },
    mark: "A",
  },
  {
    slug: "developer-guides",
    name: "Developer Guides",
    shortName: "Guides",
    description:
      "Step-by-step walkthroughs that turn fuzzy concepts into things you can actually build.",
    accent: "from-emerald-500 via-teal-500 to-cyan-600",
    cover: { from: "#10b981", to: "#0891b2", tint: "#064e3b" },
    mark: "G",
  },
  {
    slug: "performance",
    name: "Performance",
    shortName: "Perf",
    description:
      "Core Web Vitals, profiling, and the small details that separate a fast site from a slow one.",
    accent: "from-amber-400 via-orange-500 to-red-500",
    cover: { from: "#f59e0b", to: "#ef4444", tint: "#7c2d12" },
    mark: "P",
  },
  {
    slug: "best-practices",
    name: "Best Practices",
    shortName: "Practices",
    description:
      "Code reviews, architecture decisions, and engineering habits that hold up over time.",
    accent: "from-slate-700 via-slate-800 to-slate-900",
    cover: { from: "#475569", to: "#0f172a", tint: "#1e293b" },
    mark: "B",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
