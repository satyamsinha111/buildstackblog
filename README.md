# BuildStack

> Practical guides for modern web developers, AI tools, and engineering best practices.

A static, SEO-friendly editorial blog written in **plain HTML, CSS, and JavaScript**. No build step. No framework. No package manager. Every page in this repository is a real, hand-editable `.html` file.

---

## What's in this repo

```
.
├── index.html                         Home page
├── 404.html                           Custom not-found page
├── about/index.html
├── contact/index.html
├── privacy-policy/index.html
├── terms/index.html
├── blog/
│   ├── index.html                     Article archive (search + filter)
│   └── <slug>/index.html              One folder per article (×20)
├── category/<slug>/index.html         One per category (×5)
├── tag/<slug>/index.html              One per tag
├── assets/
│   ├── styles.css                     ~40 KB hand-written CSS, light + dark themes
│   └── main.js                        ~6 KB vanilla JS (theme, nav, search, progress bar)
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── rss.xml
```

That's it. There is no `package.json`, no `node_modules`, no build script, no compile step. What you see is what gets shipped.

---

## Run it locally

Pick any static file server. Examples:

```bash
# Python (built into macOS / most Linux)
python3 -m http.server 3000

# Node (no install)
npx http-server -p 3000

# PHP
php -S localhost:3000
```

Then open <http://localhost:3000>.

You **can** also open `index.html` directly via `file://`, but absolute paths like `/blog/...` won't resolve there — use a local server for accurate previews.

---

## Editing content

### A blog post

Open `blog/<slug>/index.html` in any editor. The article body lives inside `<article class="post-body">`. Heading IDs already exist for in-page anchors and the table of contents. Update the `<title>`, `<meta name="description">`, the OpenGraph/Twitter tags, and the JSON-LD `<script type="application/ld+json">` block at the top so SEO metadata stays in sync.

### Adding a new post

1. Create a folder `blog/my-new-post/` and copy any existing post's `index.html` into it as a starting template.
2. Replace the title, description, date, body, related articles.
3. Add a card linking to it on:
   - `index.html` (homepage — Latest section)
   - `blog/index.html` (archive grid)
   - `category/<your-category>/index.html`
   - any matching `tag/<tag>/index.html`
4. Add an entry in `sitemap.xml` and (optionally) `rss.xml`.

### A static page (about / contact / privacy / terms)

Edit the corresponding `index.html`. They share the same shell as every other page, so you can copy markup between them freely.

### Site-wide changes (header, footer, nav)

The header and footer are duplicated into every HTML file (this is the cost of "no build step"). Use a project-wide find/replace in your editor when the brand, nav links, or footer changes.

### Styling

Edit `assets/styles.css`. CSS custom properties at the top of the file define the design tokens (colors for both themes, font stacks, spacing, radii). The light theme is the default and the dark theme uses `[data-theme="dark"]` and `prefers-color-scheme: dark`.

### Behaviour

Edit `assets/main.js`. It handles:

- Theme toggle (with `localStorage` persistence)
- Mobile navigation drawer
- Sticky-on-scroll header shadow
- Reading-progress bar on article pages
- Client-side search dropdown (the search index is embedded inline in each page that uses search)
- Share buttons

---

## SEO features (already wired up)

- Per-page `<title>`, `<meta name="description">`, `<link rel="canonical">`
- Open Graph (`og:type`, `og:title`, `og:description`, `og:image`, `og:url`) and Twitter Card meta on every page
- JSON-LD structured data: `WebSite` schema on the home page, `Article` schema on every post (with author, dates, publisher, keywords)
- Pre-rendered HTML — content is fully visible to crawlers without executing JavaScript
- `sitemap.xml` with `lastmod`, `changefreq`, `priority`
- `robots.txt` referencing the sitemap
- `rss.xml` with the 30 most recent posts
- Semantic HTML: `<article>`, `<header>`, `<main>`, `<nav>`, `<time datetime="...">`, breadcrumbs with proper `aria-label`
- Skip-to-content link, focus-visible outlines, `aria-expanded` on the mobile menu, `aria-hidden` on decorative SVGs

---

## Design

- Editorial publication aesthetic: serif display type (Fraunces), clean sans body (Inter), monospace numerals (JetBrains Mono)
- Light + dark themes that respect system preference and persist user choice
- Deterministic SVG cover art on each article (no image files, no external dependencies, unique-feeling per slug)
- Drop cap on the first paragraph of every article body
- Reading-progress bar on article pages
- Sticky table of contents on wide viewports

All interactions degrade gracefully: a JS-disabled visitor still gets readable content.

---

## Deploy

Anything that serves files works. Point the document root at this repository.

**Netlify / Vercel / Cloudflare Pages**

- Build command: *(none — leave blank)*
- Publish directory: `.` (the repo root)

**GitHub Pages**

```bash
# Either use the docs/ branch / Pages settings to serve the repo root,
# or push the repo to a gh-pages branch.
```

**Nginx / Apache / S3 + CloudFront**

Serve the repo as the document root. URLs use trailing slashes (e.g. `/blog/build-authentication-in-nextjs/`) and resolve to `index.html` automatically on most servers.

---

## History

This repo previously used Next.js 15 + React + Tailwind, then a small Node.js static site generator. Both have been removed. What remains is the thing they were producing: plain HTML, plain CSS, plain JS.
