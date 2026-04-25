export const siteConfig = {
  name: "BuildStack",
  shortName: "BuildStack",
  url: "https://buildstack.dev",
  tagline: "Practical guides for modern web developers.",
  description:
    "BuildStack is an independent publication covering web development, AI tools, and developer guides. Honest, practical writing from working engineers — no fluff, no clickbait.",
  ogImage: "/og-default.png",
  locale: "en_US",
  author: {
    name: "BuildStack Editorial",
    email: "hello@buildstack.dev",
    twitter: "@buildstack",
  },
  contact: {
    email: "hello@buildstack.dev",
    location: "Remote — distributed team",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    explore: [
      { label: "Latest articles", href: "/blog" },
      { label: "Web Development", href: "/category/web-development" },
      { label: "AI Tools", href: "/category/ai-tools" },
      { label: "Developer Guides", href: "/category/developer-guides" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
