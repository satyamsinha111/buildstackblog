import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-canvas-subtle/40">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fg-muted">
              {siteConfig.description}
            </p>
            <p className="mt-5 text-sm text-fg-muted">
              Editorial:{" "}
              <a
                className="link-underline text-fg"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footer.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="eyebrow">Legal</h4>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-fg-subtle">
              We use cookies and may display ads to support free content.
              See our{" "}
              <Link href="/privacy-policy" className="link-underline text-fg-muted">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-line pt-8 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p className="font-mono text-[11px] tracking-wide">
            Crafted with Next.js, Tailwind &amp; care.
          </p>
        </div>
      </div>
    </footer>
  );
}
