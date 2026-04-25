# BuildStack

A production-ready Next.js + Tailwind CSS blog platform for **web development, AI tools, and developer guides**. Built to be fast, accessible, SEO-clean, and AdSense-friendly out of the box.

> Independent writing for working developers. No clickbait, no fluff.

---

## What's inside

- **Next.js 15** (App Router, React 19, fully typed)
- **Tailwind CSS** with the typography plugin and a custom design system
- **20 long-form articles** (800–1200 words each) on real engineering topics
- **Markdown content layer** with frontmatter (`gray-matter` + `react-markdown` + GFM)
- **SEO-first**: per-page metadata, Open Graph, Twitter cards, JSON-LD Article schema, automatic sitemap and robots
- **Search** across all articles, **categories**, and **tag** pages
- **Trust pages**: real About, Contact (with form UI), Privacy Policy (cookies + ads + analytics disclosure), Terms & Conditions
- **Accessibility**: skip-to-content link, semantic landmarks, keyboard-friendly navigation, visible focus rings
- **Performance**: ~107 kB first-load JS, fully static pre-rendered routes, font subsetting via `next/font`

---

## Project structure

```
.
├── app/
│   ├── layout.tsx              # Root layout, metadata, fonts, Navbar/Footer
│   ├── page.tsx                # Home page (hero, featured, categories, latest)
│   ├── globals.css             # Tailwind base + design tokens
│   ├── not-found.tsx           # Custom 404
│   ├── sitemap.ts              # Dynamic sitemap.xml
│   ├── robots.ts               # robots.txt
│   ├── blog/
│   │   ├── page.tsx            # Blog index (with search + category filter)
│   │   └── [slug]/page.tsx     # Individual post (SEO + related)
│   ├── category/[slug]/        # Per-category archive
│   ├── tag/[slug]/             # Per-tag archive
│   ├── about/                  # About page
│   ├── contact/                # Contact page (with form)
│   ├── privacy-policy/         # Privacy Policy
│   └── terms/                  # Terms & Conditions
├── components/
│   ├── Navbar.tsx              # Sticky responsive nav
│   ├── Footer.tsx              # Footer with all important links
│   ├── Hero.tsx                # Home hero section
│   ├── BlogCard.tsx            # Reusable card (3 variants)
│   ├── CategoryGrid.tsx        # Category overview
│   ├── CategoryFilter.tsx      # Filter chips (client)
│   ├── SearchBar.tsx           # Live client-side search
│   ├── SubscribeCard.tsx       # Newsletter UI
│   ├── ContactForm.tsx         # Validated contact form
│   ├── MarkdownContent.tsx     # Markdown -> HTML renderer
│   ├── PageHeader.tsx          # Reusable page header
│   └── Logo.tsx
├── content/
│   └── posts/                  # 20 markdown articles with frontmatter
├── lib/
│   ├── posts.ts                # Markdown loader, search, related-post logic
│   ├── categories.ts           # Category metadata
│   └── site.ts                 # Site config (name, URL, nav, footer, etc.)
├── public/
│   └── favicon.svg
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Getting started

### Prerequisites

- Node.js 20+ and npm 10+

### Install

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is currently recommended because some dependencies (`react-markdown`, ESLint plugins) lag slightly behind React 19's peer ranges. Drop it once those catch up.

### Run in development

```bash
npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build
npm run start
```

The build pre-renders every page (home, blog index, every article, every category, every tag, plus trust pages) as static HTML. You can deploy the output to any host that runs Node.js (Vercel, Netlify, Fly, your own server).

---

## Adding a new article

1. Create a markdown file in `content/posts/` (the filename becomes the URL slug).
2. Add frontmatter at the top:

   ```md
   ---
   title: "Your Article Title"
   description: "A clear, SEO-friendly description (150–180 chars works best)."
   date: "2026-05-01"
   category: "web-development"          # one of: web-development, ai-tools, developer-guides, performance, best-practices
   tags: ["Next.js", "React"]           # any tags you like
   author: "Your Name"
   featured: false                      # set true for the homepage hero strip
   ---
   ```

3. Write the body in Markdown. Headings, lists, code fences, tables, and links all work.
4. Save. Hot reload picks it up immediately. The next build will:
   - Generate a static page at `/blog/your-slug`
   - Add it to the sitemap
   - Index its tags and category
   - Make it searchable from the navbar/blog page

---

## Customizing the brand

Most identity changes happen in two files:

- **`lib/site.ts`** — site name, tagline, description, contact email, navigation, footer links.
- **`tailwind.config.ts`** — color palette (`brand` and `ink` scales), fonts, typography defaults.

Update those, and the changes propagate everywhere.

---

## SEO checklist (already done)

- [x] Per-page `<title>` and `<meta description>`
- [x] Open Graph + Twitter card tags
- [x] JSON-LD Article structured data on every blog post
- [x] Canonical URLs
- [x] Auto-generated `sitemap.xml` covering pages, posts, categories, and tags
- [x] `robots.txt` allowing indexing + linking the sitemap
- [x] Semantic HTML (`<article>`, `<header>`, `<nav>`, `<main>`, `<footer>`)
- [x] Clean URL structure (`/blog/post-slug`)
- [x] Internal linking (related posts, category links, tag links, breadcrumbs)
- [x] Image-friendly setup (`next/image` enabled, AVIF/WebP)
- [x] No `noindex` on content pages

---

## AdSense readiness checklist

- [x] Original, long-form, useful content (20 articles, 800–1200 words each)
- [x] Real About page with editorial process and funding disclosure
- [x] Real Contact page with email + form
- [x] Privacy Policy covering cookies, analytics, and AdSense
- [x] Terms & Conditions
- [x] Clear navigation and footer
- [x] Mobile-responsive design
- [x] Fast, accessible UI (no dark patterns, no spammy elements)
- [x] No fake claims or misleading content

When you're ready to enable AdSense, add the verification snippet to `app/layout.tsx` (or use a `<Script>` component) and you're set.

---

## Wiring the contact form & newsletter to a real backend

The Contact form (`components/ContactForm.tsx`) and SubscribeCard (`components/SubscribeCard.tsx`) ship as polished UIs that simulate a successful submit. To make them real:

- **Easiest path**: route the form to a hosted form service (Formspree, Resend's contact form template, Convertkit, etc.). Replace the `setTimeout` with a `fetch` to the service endpoint.
- **API route**: add an `app/api/contact/route.ts` that emails you via Resend / SendGrid / nodemailer.

The forms are intentionally backend-agnostic so you can plug in whatever you already use.

---

## Scripts

| Command         | What it does                            |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start the dev server on `:3000`         |
| `npm run build` | Build for production (static + SSG)     |
| `npm run start` | Run the production server               |
| `npm run lint`  | Lint the project with `eslint-config-next` |

---

## License

The starter code is yours to use as you like. The article content is the original work of the BuildStack editorial team — feel free to use it as a reference, but if you republish, please write your own.
