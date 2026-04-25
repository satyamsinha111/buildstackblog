---
title: "How to Deploy a Full-Stack App: A No-Nonsense Walkthrough"
description: "From localhost to a live URL — a clear, modern path to deploying a Next.js + Postgres app without buying into a single vendor's worldview."
date: "2026-04-06"
category: "developer-guides"
tags: ["Deployment", "DevOps", "Next.js", "PostgreSQL"]
author: "BuildStack Editorial"
---

The first deployment is the hardest. Your app works locally. Then you push it to a server and a hundred small assumptions break at once. This guide walks through deploying a full-stack app — Next.js front end, Node.js API, PostgreSQL database — without leaning so hard on a single platform that you can't move later.

We'll cover three deployment styles in increasing order of control: managed platforms, container-based deploys, and self-managed VPS. Pick the one that matches your patience and your budget.

## What "deploying" actually involves

Before we touch anything, here's what every deployment has to do, regardless of platform:

- Build the production version of your app.
- Get the build artifacts onto a server somewhere.
- Run the server with environment variables set correctly.
- Connect to a managed database.
- Put a domain in front of it with HTTPS.
- Make sure logs and errors don't disappear into a void.

Every "deploy" tool — Vercel, Railway, Fly, raw Docker on a VPS — is just a different opinion about how to handle those steps.

## Step 0: get your app deploy-ready

Before deploying anything, do these three things on your laptop:

1. **Run the production build locally**: `npm run build && npm run start`. If it doesn't work here, it won't work anywhere.
2. **Move all secrets to environment variables.** Search your codebase for hardcoded database URLs, API keys, JWT secrets, and `localhost`. Remove them.
3. **Make sure your database migrations are reproducible.** `npx prisma migrate deploy` (or your equivalent) should bring a fresh database to the right state without manual SQL.

Skip these steps and you'll spend the next week debugging things that have nothing to do with the platform.

## Option 1: managed platform (the fast path)

If you want to be in production in an afternoon, use a managed platform like Vercel for the frontend and a managed Postgres provider (Neon, Supabase, or your cloud's hosted Postgres) for the database.

The flow:

1. Push your code to GitHub.
2. Connect the repo to Vercel.
3. Set environment variables in the dashboard.
4. Hit "deploy."

What you give up:

- **Long-running servers.** Most managed platforms run your code as serverless functions. If you need WebSockets, persistent connections, or background jobs longer than ~5 minutes, you'll need a different approach.
- **Vendor independence.** Migrating off later is annoying — possible, but annoying.

What you gain:

- Zero-config CI/CD on every push.
- Preview environments per pull request, which is genuinely transformative for review.
- TLS, edge caching, and a reasonable CDN by default.

For 90% of small-to-mid-sized projects, this is the right answer. The other 10% need more.

## Option 2: containers (the portable path)

If you might leave your platform later, build a Docker image and deploy it. This is the sweet spot of control and portability in 2026.

A reasonable production Dockerfile for a Next.js app:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

A few things worth knowing:

- Use Alpine images for smaller builds, but be aware of native-module quirks (e.g. `sharp` for image processing).
- Use multi-stage builds. Your final image should not contain dev dependencies.
- Pass secrets via environment variables, not by baking them into the image.

You can run this image on Fly.io, Render, Railway, AWS ECS, Google Cloud Run, or any Kubernetes cluster. The image doesn't care.

For the database, use a managed Postgres. There is almost no good reason to self-host the database for a small team in 2026.

## Option 3: self-managed VPS (the control path)

A $5/month VPS from DigitalOcean, Hetzner, or Vultr is still a perfectly good deployment target if you want full control and don't mind a bit of plumbing. Here's the minimum:

1. Provision an Ubuntu server.
2. Set up SSH key auth and disable password auth.
3. Install Node.js, Nginx, and PostgreSQL.
4. Use `pm2` or systemd to run the app and restart it on crash.
5. Configure Nginx as a reverse proxy in front of port 3000.
6. Use Let's Encrypt (`certbot`) for free TLS.
7. Set up a basic firewall (`ufw`) and unattended security updates.

You'll learn a lot from doing this once. After the first time, you can decide whether you want to do it again.

A few things people forget on first deployment:

- **Backups.** Set up automated database backups before you have data worth losing.
- **Log rotation.** Without it, your disk fills up at 3 a.m.
- **Time sync.** `chrony` or `systemd-timesyncd`. JWT validation breaks subtly when clocks drift.

## Environment variables: the most common foot-gun

In every deployment style, environment variables cause more headaches than the actual application code. A few habits that help:

- Keep a `.env.example` checked into git, with all keys and dummy values, so anyone can see what's required.
- Validate them at startup. If `DATABASE_URL` is missing, crash loudly. Don't let the app start in a broken state.
- Never put secrets in your build output. In Next.js, anything prefixed with `NEXT_PUBLIC_` is exposed to the browser. Treat that prefix as a public commitment.

## Database migrations on deploy

The cleanest pattern is to run migrations as a step in your deployment pipeline, *before* the new code starts serving traffic:

```bash
npx prisma migrate deploy
npm run start
```

For zero-downtime migrations, you also need to write your migrations to be backward-compatible with the previous version of the code:

1. Add new columns as nullable.
2. Backfill data in a separate migration.
3. Make the columns non-nullable in a *third* migration, after the old code is fully retired.

This sounds like extra work. It is. It's also the only way to deploy without scheduling downtime.

## Observability from day one

Before traffic shows up, set up:

- **Error tracking** — Sentry, Bugsnag, or similar.
- **Uptime monitoring** — even a free pinging service is fine.
- **Structured logging** — JSON logs, with timestamps and request IDs.

You don't need a fancy dashboard on day one. You do need a way to know when something is broken without a user emailing you.

## A reasonable first-deploy checklist

Print this and tape it next to your monitor:

- [ ] Production build runs locally.
- [ ] All secrets are in environment variables.
- [ ] `.env.example` is up to date.
- [ ] Database migrations are reproducible.
- [ ] HTTPS is enabled.
- [ ] Errors get reported somewhere you'll see them.
- [ ] You know how to roll back to the previous version.

If you can check all of those boxes, you're in better shape than most production apps. Ship it.
