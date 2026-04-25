"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

export interface TocItem {
  level: 2 | 3;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((i) => i.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="eyebrow mb-4">In this article</p>
      <ol className="space-y-2.5 border-l border-line">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={item.level === 3 ? "pl-4" : ""}
            >
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l py-0.5 pl-4 transition ${
                  isActive
                    ? "border-fg font-medium text-fg"
                    : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { slugify };
