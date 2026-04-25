"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-line bg-canvas/80 backdrop-blur-md"
          : "border-b border-transparent bg-canvas"
      }`}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:bg-canvas-subtle hover:text-fg"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-px h-px bg-fg/30" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/blog"
            aria-label="Search articles"
            title="Search articles"
            className="hidden sm:inline-flex h-9 items-center gap-2 rounded-full border border-line bg-canvas px-3 text-sm text-fg-muted transition hover:border-line-strong hover:bg-canvas-subtle hover:text-fg"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
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
            <span>Search</span>
            <kbd className="hidden rounded border border-line bg-canvas-inset px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle md:inline-block">
              /
            </kbd>
          </Link>
          <ThemeToggle />
          <Link
            href="/blog"
            className="hidden md:inline-flex btn-primary h-9 px-4 py-0"
          >
            Read articles
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition hover:bg-canvas-subtle md:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-canvas md:hidden"
        >
          <div className="container flex flex-col gap-1 py-3">
            {siteConfig.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-canvas-subtle text-fg"
                      : "text-fg-muted hover:bg-canvas-subtle"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/blog" className="btn-primary mt-2 w-full">
              Read articles
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
