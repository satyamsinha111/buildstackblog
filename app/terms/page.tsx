import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions that govern your use of the BuildStack website.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "April 1, 2026";

export default function TermsPage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description={`Last updated ${LAST_UPDATED}`}
      />

      <div className="prose prose-lg dark:prose-invert max-w-3xl">
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to
          and use of {siteConfig.name} (the &ldquo;Site&rdquo;), located at{" "}
          <a href={siteConfig.url}>{siteConfig.url.replace(/^https?:\/\//, "")}</a>.
          By using the Site, you agree to these Terms. If you do not agree,
          please do not use the Site.
        </p>

        <h2>1. Use of the Site</h2>
        <p>
          You may access and read articles on the Site for personal,
          non-commercial purposes. You agree not to:
        </p>
        <ul>
          <li>
            Use the Site in any way that violates applicable laws or
            regulations;
          </li>
          <li>
            Attempt to interfere with the proper operation of the Site,
            including by introducing malware, performing denial-of-service
            attacks, or accessing areas of the Site you are not authorized to
            access;
          </li>
          <li>
            Scrape, copy, or republish substantial portions of the content
            without our written permission, except as expressly permitted
            below;
          </li>
          <li>
            Use the Site or its content to train commercial machine learning
            models without explicit, written permission.
          </li>
        </ul>

        <h2>2. Intellectual property</h2>
        <p>
          All content on the Site, including articles, images, logos, and
          design elements, is the property of {siteConfig.name} or its
          contributors and is protected by copyright and other intellectual
          property laws.
        </p>
        <p>
          You may quote brief excerpts (under approximately 250 words) for
          commentary, review, or educational purposes, provided you include
          a clear attribution and a link back to the original article. For
          any larger or commercial use, please contact us in advance.
        </p>

        <h2>3. User submissions</h2>
        <p>
          If you submit feedback, comments, or other materials to us — for
          example, through the contact form — you grant us a non-exclusive,
          royalty-free, worldwide license to use, reproduce, and incorporate
          those submissions for the purpose of operating and improving the
          Site. We do not claim ownership of your submissions.
        </p>
        <p>
          Please do not send us confidential or proprietary information
          through public-facing channels. We cannot guarantee confidentiality
          for unsolicited submissions.
        </p>

        <h2>4. Third-party links and content</h2>
        <p>
          The Site may contain links to third-party websites or services that
          are not owned or controlled by {siteConfig.name}. We are not
          responsible for the content, privacy policies, or practices of any
          third-party sites or services. You access them at your own risk.
        </p>

        <h2>5. Advertising</h2>
        <p>
          The Site may display advertisements served by third parties. We do
          not endorse the products or services advertised, and any
          transactions you enter into with advertisers are solely between you
          and the advertiser.
        </p>

        <h2>6. Disclaimers</h2>
        <p>
          The Site and its content are provided on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis. While we make every reasonable
          effort to ensure accuracy, we make no warranties, express or
          implied, regarding:
        </p>
        <ul>
          <li>The accuracy, completeness, or timeliness of the content;</li>
          <li>
            The continuous, uninterrupted, or error-free operation of the
            Site;
          </li>
          <li>
            The suitability of any content or recommendation for your specific
            situation.
          </li>
        </ul>
        <p>
          Articles on the Site are written for general informational purposes
          and should not be relied upon as professional advice. Always
          evaluate technical recommendations against your own context, test
          changes thoroughly, and consult appropriate professionals when
          decisions carry significant risk.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {siteConfig.name} and its
          contributors shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of or
          related to your use of the Site, even if we have been advised of
          the possibility of such damages. Our total liability to you for any
          claim shall not exceed the amount you have paid us, which for most
          readers is zero.
        </p>

        <h2>8. Changes to the Site and Terms</h2>
        <p>
          We may modify, suspend, or discontinue all or part of the Site at
          any time without notice. We may also update these Terms from time
          to time. Continued use of the Site after changes are posted
          constitutes your acceptance of the updated Terms. We will revise
          the &ldquo;Last updated&rdquo; date at the top of this page when we
          do.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may terminate or restrict your access to the Site at any time,
          with or without notice, for any conduct that we believe violates
          these Terms or is otherwise harmful to other users, us, or third
          parties.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by applicable laws, without regard to
          conflict-of-law principles. Any disputes arising out of or related
          to these Terms or the Site shall be resolved through good-faith
          negotiation, and failing that, in the appropriate courts of
          competent jurisdiction.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
