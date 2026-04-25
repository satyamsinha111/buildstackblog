import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We couldn't find the page you were looking for.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm tracking-widest text-fg-subtle">404</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-crisp text-fg sm:text-6xl">
        Lost in the archives.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">
        The link may have moved, or the article you&rsquo;re looking for might
        have been renamed. Try searching, or head back to the homepage.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/blog" className="btn-secondary">
          Browse articles
        </Link>
      </div>
    </div>
  );
}
