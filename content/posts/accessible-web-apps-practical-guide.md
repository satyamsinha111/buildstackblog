---
title: "Building Accessible Web Apps: A Practical Guide"
description: "Accessibility isn't checklist work — it's product quality. A working developer's guide to the WCAG basics, the tools that catch most issues, and the patterns that hold up."
date: "2026-02-09"
category: "best-practices"
tags: ["Accessibility", "WCAG", "Frontend", "UX"]
author: "BuildStack Editorial"
---

Accessibility is one of those topics where the conversation skews toward either compliance ("avoid lawsuits") or guilt ("you should be doing more"). Neither framing produces good software. Let's reframe: accessible apps are better-built apps, full stop. They work for users with disabilities, they work for older devices, they work for keyboard-only power users, and they tend to have cleaner architecture in general.

This is a practical guide to building for accessibility — not exhaustive, but honest about what moves the needle on a typical web app.

## What "accessible" actually means

The Web Content Accessibility Guidelines (WCAG) define accessibility along four principles:

- **Perceivable** — users can perceive your content (with screen readers, with high contrast, without color).
- **Operable** — users can navigate and interact (with keyboard, with assistive tech).
- **Understandable** — content and operation are predictable.
- **Robust** — your content works across browsers, devices, and assistive tech.

WCAG has three conformance levels: A (minimum), AA (target for most public sites), AAA (rarely fully achievable). For most product teams, "we meet WCAG 2.2 AA" is the target.

You don't need to memorize the spec. You do need a working understanding of what it asks for.

## Use the platform

The single most valuable accessibility habit is *using semantic HTML*. The platform has done most of the work for you, and most accessibility problems come from ignoring it.

Specifically:

- A `<button>` is a button. A `<div onClick>` is not.
- A `<nav>` is navigation. A `<div className="nav">` is a div.
- A form input has a `<label>` with a `for` attribute (or wraps the input).
- Headings (`<h1>` through `<h6>`) form an outline. A page should have one `<h1>` and an orderly hierarchy below it.

The moment you start replacing semantic elements with generic divs, you're signing up to recreate behaviors that the browser already gave you for free — focus, keyboard handling, screen reader semantics, all of it.

Reach for ARIA only when there's no semantic element that fits. The first rule of ARIA is *don't use ARIA*: prefer real HTML.

## Make keyboard work

Pretend you don't have a mouse for a day. You will discover problems within five minutes.

Things to check on every interactive element:

- Can I reach it with `Tab`?
- Is the focus visible? (Don't `:focus { outline: none }` without replacing it with something visible. We see this everywhere.)
- Does `Enter` activate buttons? Does `Space` activate buttons?
- Do `Tab` and `Shift+Tab` move through controls in a logical order?
- Inside modals, does focus stay trapped until I close the modal?
- After closing the modal, does focus return where I was before opening it?

If you can't get through your app with only the keyboard, neither can a screen reader user.

## Color, contrast, and text

A few rules that catch most visual accessibility issues:

- **Contrast**: WCAG AA requires 4.5:1 for normal text and 3:1 for large text. Use a contrast checker; don't eyeball it.
- **Color isn't the only signal**: don't use red alone to mean "error." Add an icon, a label, or both.
- **Font size**: 16px (or 1rem) is the minimum for body text. Smaller is fine for fine print, but not for the things users actually read.
- **Line height**: 1.5 for body text, more for long-form. Cramped text is a common readability fail.
- **Don't disable zoom**. People rely on browser zoom. `user-scalable=no` is hostile.

Modern design systems handle most of this if you let them. Light pastels on white look great in mockups and fail contrast in production. Check.

## Forms that don't fight users

Forms are where most accessibility failures hurt the most, because forms are how users *do* things.

- **Every input has a visible label.** Placeholders are not labels.
- **Errors are explicit.** Tie them to the input with `aria-describedby` so screen readers read them when the field is focused.
- **Required fields are marked.** "* required" with the asterisk explained.
- **Don't auto-submit on input change** unless it's truly the right pattern. Surprises break flow for everyone.
- **Show validation at the right time.** Mid-typing red errors feel hostile. On blur or on submit feels appropriate.

A form that's accessible is, almost by accident, a form that's clearer for everyone.

## Images, media, and motion

- **All meaningful images have alt text.** Decorative images use `alt=""`.
- **Videos have captions.** Auto-generated captions are a baseline; cleaned-up captions are better.
- **Audio has transcripts.** Most teams skip this and shouldn't.
- **Animations respect `prefers-reduced-motion`.** A `@media (prefers-reduced-motion: reduce) { ... }` block can save the experience for users sensitive to motion.

Alt text is its own small skill. The rule: describe what the image *means* in context, not what it shows. A "Sign In" button image with the alt "person at laptop" is wrong — it should be "Sign In."

## ARIA, the right way

ARIA exists to fill the gaps in HTML semantics. Use it where the HTML doesn't have what you need:

- Custom widgets (tabs, sliders, comboboxes) need explicit ARIA roles, states, and properties.
- Live regions (`aria-live="polite"`) announce dynamic updates to screen readers.
- `aria-label` and `aria-labelledby` provide accessible names for elements that don't have visible text.

The mistakes to avoid:

- **Wrong roles**: a `role="button"` on a `<div>` is no substitute for an actual `<button>`.
- **Stale state**: `aria-expanded` that never updates is worse than no attribute at all.
- **Over-labelling**: every element doesn't need an `aria-label`. Native semantics often provide it for free.

When in doubt, look up the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) for the widget you're building. There's almost certainly a tested, recommended pattern.

## Testing accessibility

You can't ship accessible software by intention alone. Test it.

A pragmatic testing stack:

- **Axe DevTools** in the browser. Automated linting catches roughly a third of issues — the obvious ones.
- **Keyboard testing** by hand on every meaningful flow.
- **Screen reader testing** at least occasionally. VoiceOver on macOS, NVDA on Windows, both free.
- **Lighthouse accessibility audit** in CI. Track the score over time.
- **User research with disabled users** when you can. There is no substitute.

Don't aim for a perfect Lighthouse score and stop there. Automated tools find a fraction of real issues. Manual testing catches the rest.

## Common patterns that need extra care

A few UI patterns are accessibility minefields. Know what to do:

- **Modals**: trap focus, return focus on close, label the modal, allow Escape to dismiss.
- **Custom dropdowns and comboboxes**: this is where most teams reinvent the wheel and ship broken accessibility. Use a tested library (Radix, Headless UI, Reach UI's successors) instead of rolling your own.
- **Toasts and notifications**: use `role="status"` or `aria-live="polite"` so screen readers actually announce them.
- **Drag-and-drop**: provide a keyboard alternative, every time.
- **Infinite scroll**: avoid where possible. If unavoidable, provide a "load more" alternative and skip-to-footer affordance.

The rule: any time you hear "let's build a custom widget," the accessibility cost should be part of the conversation.

## Building accessibility into the team

Accessibility doesn't survive without process:

- **Make it a PR review criterion.** A reviewer flags missing alt text the same way they'd flag a missing test.
- **Add a Storybook a11y addon** so component-level issues show up during development.
- **Track at the component library level.** Most accessibility lives at the design system layer; if your `Button`, `Modal`, and `Form` are accessible, much of your app is too.
- **Have an accessibility champion**, even part-time. Without one, accessibility quietly slides.

The teams we've worked with that consistently ship accessible products treat it as a quality concern, not a separate workstream. It belongs alongside performance, security, and reliability — not after them.

## A short closing thought

Most "accessibility wins" come from a small number of habits done consistently: semantic HTML, real focus styles, real labels, manual keyboard testing. Do those, and you'll already be ahead of the median web app — with happier users, fewer bugs, and a codebase that holds up better in general.

That's the pitch. Not "do this because the law says so," but "do this because it's how good software is built."
