"use client";

import { useState } from "react";

export function SubscribeCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 600);
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-canvas-subtle/60 px-6 py-12 sm:px-12 sm:py-16">
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 mask-fade-bottom"
      />
      <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow">The Newsletter</p>
          <h2 className="mt-4 font-display text-3xl font-medium tracking-tightish text-fg text-balance sm:text-4xl">
            One thoughtful article a week.
            <br className="hidden sm:block" />
            <em className="font-display italic text-fg-muted">No spam. No fluff.</em>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted">
            Get new deep dives on web development, AI tools, and developer
            workflow delivered to your inbox. Unsubscribe in one click.
          </p>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-5">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-canvas p-1.5 sm:flex-row sm:items-center">
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 w-full bg-transparent px-3 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary h-10 shrink-0 disabled:opacity-60"
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {status === "done" ? (
            <p className="mt-3 text-xs text-fg">
              ✓ Thanks — check your inbox to confirm.
            </p>
          ) : (
            <p className="mt-3 text-xs text-fg-subtle">
              We respect your inbox. Read our{" "}
              <a href="/privacy-policy" className="link-underline">
                privacy policy
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
