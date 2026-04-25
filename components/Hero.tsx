import Link from "next/link";
import { siteConfig } from "@/lib/site";

interface HeroProps {
  totalCount: number;
}

export function Hero({ totalCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 -z-10 mask-fade-bottom"
      />
      <div className="container pt-14 pb-12 sm:pt-20 sm:pb-16">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="eyebrow flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-500" />
              <span>The {siteConfig.name} Review · Issue 01</span>
            </p>
            <h1 className="mt-5 font-display text-[40px] font-medium leading-[1.05] tracking-crisp text-fg text-balance sm:text-6xl md:text-[68px]">
              Practical writing for{" "}
              <em className="font-display italic text-fg">people who ship</em>{" "}
              software.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted text-pretty sm:text-lg">
              Independent essays on web development, AI tools, and the everyday
              craft of modern engineering — written by working developers, for
              working developers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/blog" className="btn-primary">
                Read the latest issue
              </Link>
              <Link href="/about" className="btn-secondary">
                Our editorial standards
              </Link>
            </div>
          </div>

          <aside className="md:col-span-4">
            <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-canvas-subtle/50 p-5 md:grid-cols-1 md:gap-5">
              <div>
                <dt className="eyebrow">Articles</dt>
                <dd className="mt-1 font-display text-2xl font-medium tracking-tightish text-fg">
                  {totalCount}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Topics</dt>
                <dd className="mt-1 font-display text-2xl font-medium tracking-tightish text-fg">
                  5
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Updated</dt>
                <dd className="mt-1 font-display text-2xl font-medium tracking-tightish text-fg">
                  Weekly
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
