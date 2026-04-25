import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the BuildStack team — for feedback, corrections, story pitches, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Get in touch"
        title="We read every email."
        description="Have a question, a correction, or a topic you'd like us to cover? Drop us a line — we aim to reply within two working days."
      />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <aside className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-canvas-subtle/50 p-6">
            <h3 className="eyebrow">Direct contact</h3>
            <ul className="mt-5 space-y-5 text-sm">
              <li>
                <p className="font-medium text-fg">Editorial</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="link-underline mt-0.5 inline-block"
                >
                  {siteConfig.contact.email}
                </a>
                <p className="mt-1.5 text-fg-muted">
                  Story pitches, corrections, and feedback on any article.
                </p>
              </li>
              <li>
                <p className="font-medium text-fg">Partnerships</p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="link-underline mt-0.5 inline-block"
                >
                  {siteConfig.contact.email}
                </a>
                <p className="mt-1.5 text-fg-muted">
                  Tasteful, relevant sponsorship inquiries only. We do not
                  accept paid editorial.
                </p>
              </li>
              <li>
                <p className="font-medium text-fg">Location</p>
                <p className="text-fg-muted">{siteConfig.contact.location}</p>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-line p-6">
            <h3 className="font-display text-lg font-medium text-fg">
              A quick note on response time
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              We&rsquo;re a small team. We try to respond within two working
              days for editorial inquiries and within a week for everything
              else. Thanks for your patience.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-canvas-subtle/50 p-6">
            <h3 className="eyebrow">Common questions</h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-fg">
                  Can I republish your articles?
                </dt>
                <dd className="mt-1 text-fg-muted">
                  Excerpts with attribution are welcome. For full
                  republication, ask first.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-fg">
                  Will you review my product?
                </dt>
                <dd className="mt-1 text-fg-muted">
                  Sometimes, if it fits our editorial focus. We don&rsquo;t
                  accept payment for reviews.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Do you take guest posts?</dt>
                <dd className="mt-1 text-fg-muted">
                  Occasionally — pitch us a paragraph first.
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
