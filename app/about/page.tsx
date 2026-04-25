import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "BuildStack is an independent publication for working web developers. Learn who we are, what we cover, and how we write.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="About"
        title="A small publication for people who actually build things."
        description={`${siteConfig.name} is an independent site covering web development, AI tools, and engineering practices. No clickbait, no listicles for the sake of listicles, no sponsored articles dressed up as editorial.`}
      />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Why we started this</h2>
            <p>
              The internet does not need another &ldquo;ultimate guide&rdquo;
              hastily generated to chase a search term. Most developer
              publications in 2026 are optimized for click-through rates, not
              for the engineer reading at the end of a long day with a real
              problem to solve.
            </p>
            <p>
              {siteConfig.name} exists because we wanted somewhere to publish
              the kind of writing we like to read: opinionated, specific, and
              honest about what we&rsquo;ve learned the hard way. Articles you
              can act on, written by people who actually ship code in
              production.
            </p>

            <h2>What we cover</h2>
            <p>
              Our editorial focus is narrow on purpose. We write about three
              areas in depth:
            </p>
            <ul>
              <li>
                <strong>Web development</strong> — frameworks, patterns, and
                the practical decisions that go into shipping reliable web
                apps. Heavy on Next.js, React, TypeScript, and the modern
                JavaScript ecosystem.
              </li>
              <li>
                <strong>AI tools</strong> — honest reviews and practical
                workflows for using AI tooling in real engineering work,
                without losing the skills that make engineers valuable in the
                first place.
              </li>
              <li>
                <strong>Developer guides &amp; best practices</strong> —
                step-by-step walkthroughs and engineering habits that hold up
                across teams, codebases, and years.
              </li>
            </ul>

            <h2>How we write</h2>
            <p>A few principles guide everything we publish:</p>
            <ul>
              <li>
                <strong>Original, working knowledge.</strong> Every article is
                written by someone with hands-on experience in the topic. We
                don&rsquo;t paraphrase documentation; we explain how things
                actually behave when you use them.
              </li>
              <li>
                <strong>Real examples.</strong> Code samples are taken from
                projects we&rsquo;ve worked on, simplified for clarity but
                grounded in reality.
              </li>
              <li>
                <strong>Respect for your time.</strong> Our articles are as
                long as they need to be and not a paragraph longer. If a topic
                can be explained in 800 words, we don&rsquo;t pad it to 2,000.
              </li>
              <li>
                <strong>No fake authority.</strong> If we don&rsquo;t know
                something, we say so. If we&rsquo;ve changed our minds, we say
                that too.
              </li>
            </ul>

            <h2>How we&rsquo;re funded</h2>
            <p>
              {siteConfig.name} is independent. We may show a small number of
              tasteful, relevant ads to support the cost of writing and
              hosting. We do not accept payment in exchange for editorial
              coverage, and we will always disclose any sponsored content
              clearly. If we recommend a tool, it&rsquo;s because we use it
              ourselves.
            </p>

            <h2>Editorial process</h2>
            <p>
              Every article goes through a real editorial pass before it
              ships:
            </p>
            <ol>
              <li>An author drafts the article from their own experience.</li>
              <li>
                A second engineer technically reviews it for accuracy &mdash;
                code samples are tested, claims are verified.
              </li>
              <li>An editor reviews for clarity, structure, and tone.</li>
              <li>
                When something changes (a framework version, a recommended
                library, a deprecated API), we update the article and note
                the date of the update.
              </li>
            </ol>
            <p>
              This is slower than the alternative. It&rsquo;s the only way we
              know to keep the bar where it should be.
            </p>

            <h2>Get in touch</h2>
            <p>
              If you spot an error, want to suggest a topic, or have feedback
              of any kind, we&rsquo;d love to hear from you. The fastest way
              is email:{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-canvas-subtle/50 p-6">
            <h3 className="eyebrow">At a glance</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-fg">Founded</dt>
                <dd className="text-fg-muted">2024</dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Editorial team</dt>
                <dd className="text-fg-muted">
                  Working engineers and writers, distributed remotely.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Cadence</dt>
                <dd className="text-fg-muted">
                  One in-depth article per week, on average.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Languages</dt>
                <dd className="text-fg-muted">English (US).</dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Contact</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="link-underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line p-6">
            <h3 className="font-display text-lg font-medium text-fg">
              Have a story to share?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              We occasionally publish guest articles from working engineers.
              If you have an idea, send us a one-paragraph pitch.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex text-sm font-medium text-fg link-underline"
            >
              Pitch an article →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
