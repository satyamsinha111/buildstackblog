import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How BuildStack handles your data, cookies, analytics, and advertising.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "April 1, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-14 sm:py-20">
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated ${LAST_UPDATED}`}
      />

      <div className="prose prose-lg dark:prose-invert max-w-3xl">
        <p>
          This Privacy Policy explains what information {siteConfig.name}{" "}
          (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects
          when you visit{" "}
          <a href={siteConfig.url}>{siteConfig.url.replace(/^https?:\/\//, "")}</a>{" "}
          (the &ldquo;Site&rdquo;), how we use that information, and the choices
          you have. We try to keep this short, clear, and honest.
        </p>

        <h2>1. Information we collect</h2>
        <p>
          We collect a limited amount of information, in two categories:
        </p>
        <ul>
          <li>
            <strong>Information you give us directly.</strong> If you contact
            us via email or the contact form, we receive whatever you choose
            to send (such as your name, email address, and the contents of
            your message). If you subscribe to our newsletter, we receive
            your email address.
          </li>
          <li>
            <strong>Information collected automatically.</strong> Like most
            websites, our servers and analytics tools log standard technical
            information such as your IP address, browser type, referring URL,
            pages visited, and approximate location (derived from IP address).
            This data is used to operate and improve the Site.
          </li>
        </ul>

        <h2>2. Cookies and similar technologies</h2>
        <p>
          We use cookies and similar technologies for the following purposes:
        </p>
        <ul>
          <li>
            <strong>Strictly necessary cookies</strong> required for the Site
            to function properly (e.g. remembering preferences during your
            visit). These cannot be disabled.
          </li>
          <li>
            <strong>Analytics cookies</strong> that help us understand how
            visitors use the Site so we can improve the content and structure.
            These are aggregated and do not identify you personally.
          </li>
          <li>
            <strong>Advertising cookies</strong>, where applicable, used by
            third-party ad networks (such as Google AdSense) to show
            relevant advertisements and measure their effectiveness.
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. Most
          browsers let you block, delete, or get notified about cookies. If
          you block all cookies, parts of the Site may not work as intended.
        </p>

        <h2>3. Advertising</h2>
        <p>
          The Site may display advertisements served by third-party advertising
          networks, including Google AdSense. These ad networks may use
          cookies, web beacons, and similar technologies to collect
          information about your visits to this and other websites in order
          to provide advertisements about goods and services that may be of
          interest to you.
        </p>
        <p>
          For more information on how Google uses data when you use partners&rsquo;
          sites or apps, please visit{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google&rsquo;s policy
          </a>
          . You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>{" "}
          or{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
          >
            aboutads.info
          </a>
          .
        </p>

        <h2>4. Analytics</h2>
        <p>
          We use privacy-respecting web analytics to understand which articles
          are read most, where readers come from, and how the Site performs.
          Analytics data is processed in aggregate and is not used to identify
          individual readers.
        </p>

        <h2>5. How we use information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Operate, maintain, and improve the Site;</li>
          <li>Respond to your inquiries and support requests;</li>
          <li>Send newsletters and updates if you subscribe;</li>
          <li>
            Detect, prevent, and address fraud, abuse, security, or technical
            issues;
          </li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not share it with
          third parties except as needed to provide the services described
          here (for example, our email or hosting providers) or as required
          by law.
        </p>

        <h2>6. Data retention</h2>
        <p>
          We retain personal information only for as long as necessary to
          fulfill the purposes outlined in this policy, unless a longer
          retention period is required or permitted by law. Newsletter
          subscribers can unsubscribe at any time using the link at the
          bottom of any email.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Depending on where you live, you may have rights regarding your
          personal information, including the right to access, correct,
          delete, or restrict the processing of your data. To exercise any of
          these rights, contact us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          . We will respond within a reasonable timeframe.
        </p>

        <h2>8. Children</h2>
        <p>
          The Site is not directed to children under the age of 13. We do not
          knowingly collect personal information from children. If you
          believe a child has provided us with personal information, please
          contact us and we will take appropriate action.
        </p>

        <h2>9. International users</h2>
        <p>
          The Site may be accessed from anywhere in the world. By using the
          Site, you understand that your information may be transferred to,
          stored, and processed in countries other than your own, where
          privacy laws may differ from those in your jurisdiction.
        </p>

        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;Last updated&rdquo; date at the top of this
          page. We encourage you to review this policy periodically.
        </p>

        <h2>11. Contact us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or
          our data practices, please email us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
