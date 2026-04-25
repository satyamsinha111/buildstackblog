import Link from "next/link";
import { siteConfig } from "@/lib/site";

interface AuthorFooterProps {
  author: string;
  date: string;
  title: string;
  slug: string;
}

export function AuthorFooter({ author, date, title, slug }: AuthorFooterProps) {
  const initials = author
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const url = `${siteConfig.url}/blog/${slug}`;
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} — ${siteConfig.name}`,
  )}&url=${encodeURIComponent(url)}`;
  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const hn = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
    url,
  )}&t=${encodeURIComponent(title)}`;

  return (
    <footer className="mt-16 border-t border-line pt-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
        <div className="md:col-span-7">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-fg text-fg-inverted font-display text-base font-medium">
              {initials || "BS"}
            </div>
            <div>
              <p className="eyebrow">Written by</p>
              <p className="mt-1 font-display text-lg font-medium text-fg">
                {author}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                Published {date}. The {siteConfig.name} editorial team is a
                small group of working engineers writing about the craft of
                shipping software.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link href="/about" className="link-underline text-fg">
                  About the team
                </Link>
                <span aria-hidden="true" className="text-fg-subtle">
                  ·
                </span>
                <Link href="/contact" className="link-underline text-fg">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-5">
          <p className="eyebrow">Share this article</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={tweet}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-9 px-4"
            >
              Share on X
            </a>
            <a
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-9 px-4"
            >
              LinkedIn
            </a>
            <a
              href={hn}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-9 px-4"
            >
              Hacker News
            </a>
          </div>
          <p className="mt-4 text-xs text-fg-subtle">
            Found a typo or have feedback? Email{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="link-underline"
            >
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
