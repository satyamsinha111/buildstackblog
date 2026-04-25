"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";

interface SearchBarProps {
  posts: PostMeta[];
  placeholder?: string;
}

export function SearchBar({
  posts,
  placeholder = "Search articles…",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((p) => {
        const haystack = [
          p.frontmatter.title,
          p.frontmatter.description,
          p.frontmatter.category,
          ...(p.frontmatter.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query, posts]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-fg-subtle"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="7"
              cy="7"
              r="5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 11l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Search articles"
          className="h-12 w-full rounded-full border border-line bg-canvas pl-11 pr-12 text-sm text-fg placeholder:text-fg-subtle transition focus:border-line-strong focus:outline-none focus:ring-4 focus:ring-fg/5"
        />
        <kbd className="pointer-events-none absolute inset-y-0 right-4 my-auto hidden h-6 items-center rounded border border-line bg-canvas-inset px-1.5 font-mono text-[10px] text-fg-subtle sm:inline-flex">
          /
        </kbd>
      </div>

      {open && query.trim() && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-canvas shadow-editorial"
        >
          {results.length === 0 ? (
            <p className="px-5 py-6 text-center text-sm text-fg-muted">
              No articles match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((post) => {
                const cat = getCategoryBySlug(post.frontmatter.category);
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block px-5 py-3.5 transition hover:bg-canvas-subtle"
                      role="option"
                    >
                      <p className="eyebrow text-fg-subtle">
                        {cat?.shortName ?? "Article"}
                      </p>
                      <p className="mt-1 font-display text-[15px] font-medium leading-snug text-fg">
                        {post.frontmatter.title}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-fg-muted">
                        {post.frontmatter.description}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
