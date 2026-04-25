---
title: "How to Build Authentication in Next.js: A Step-by-Step Walkthrough"
description: "A practical, opinionated guide to adding email + OAuth authentication to a Next.js App Router project — covering sessions, middleware, and the real-world gotchas."
date: "2026-04-18"
category: "web-development"
tags: ["Next.js", "Authentication", "React", "Security"]
author: "BuildStack Editorial"
featured: true
---

Authentication looks deceptively simple. You sign someone in, you store something in a cookie, you check that cookie on every request. Then real life shows up: refresh tokens, session invalidation, edge runtimes, role-based access, the email you definitely should not be storing in plain text. This guide walks through how to add authentication to a Next.js App Router project the way you'd actually ship it in production — not the textbook version.

We'll use [Auth.js](https://authjs.dev) (the successor to NextAuth) because it sits at the right level of abstraction: opinionated enough to keep you out of trouble, flexible enough to extend.

## What you actually need from "auth"

Before writing a line of code, write down what you want.

- **Identity**: who is this user, and how do they prove it?
- **Sessions**: how do you remember them on the next request?
- **Authorization**: what are they allowed to do?
- **Recovery**: what happens when they forget their password or lose access?

If you skip step four, you'll end up shipping it anyway — usually as a 2 a.m. patch. Plan for it now.

## Installing the basics

Start with a fresh Next.js 15 App Router project. Then add Auth.js and a database adapter. We'll use Prisma + PostgreSQL because they're boring and well-supported.

```bash
npm install next-auth@beta @auth/prisma-adapter prisma @prisma/client
npx prisma init
```

Create your `.env`:

```bash
AUTH_SECRET="run: openssl rand -base64 32"
DATABASE_URL="postgresql://user:pass@localhost:5432/app"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`. Treat it like a database password: never commit it, rotate it if it leaks.

## Defining your schema

You don't need to memorize the Auth.js schema. Copy it from the docs and adapt. The minimum is `User`, `Account`, `Session`, and `VerificationToken`. Add a `role` field on `User` early — retrofitting roles later is painful.

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  accounts      Account[]
  sessions      Session[]
}

enum Role {
  USER
  EDITOR
  ADMIN
}
```

Run `npx prisma migrate dev --name init` and you have a database.

## Wiring up Auth.js

Create `auth.ts` at your project root:

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = (user as any).role;
      return session;
    },
  },
});
```

Then expose the route handler at `app/api/auth/[...nextauth]/route.ts`:

```ts
export { GET, POST } from "@/auth";
```

Two files, and you have a working OAuth flow. The temptation now is to start adding features. Resist it. First, prove sign-in works end to end, then layer everything else on.

## Reading the session in Server Components

In the App Router, you read the session directly on the server:

```tsx
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  if (!session) return <p>Please sign in.</p>;
  return <p>Welcome back, {session.user.name}.</p>;
}
```

No useEffect, no client-side flicker, no spinner before the layout settles. This is the single biggest reason to use Server Components for auth-aware UI.

## Protecting routes with middleware

Don't try to gate every page with manual checks. Use a single `middleware.ts`:

```ts
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
```

Two rules of thumb:

- Keep the matcher narrow. The middleware runs on every matched request.
- Don't query your database inside middleware. Use what's already in the JWT or session token.

## Adding email + password (carefully)

OAuth covers most modern apps. If you need email + password, use the Credentials provider — but understand what you're signing up for: **you** are responsible for password hashing, breach detection, lockouts, and rate limiting.

At minimum:

- Hash with `bcrypt` or `argon2id`. Never store plain text. Never store a "lightly obfuscated" password.
- Rate-limit failed attempts per email **and** per IP.
- Force a verified email before granting access to any meaningful action.

If that list makes you nervous, pick a managed identity provider (Clerk, WorkOS, or Auth0). Outsourcing this is rarely the wrong call.

## Authorization, not just authentication

A logged-in user is not the same as an authorized user. Build a tiny helper and use it everywhere:

```ts
export async function requireRole(role: Role) {
  const session = await auth();
  if (!session) throw new Response("Unauthorized", { status: 401 });
  if (session.user.role !== role && session.user.role !== "ADMIN") {
    throw new Response("Forbidden", { status: 403 });
  }
  return session;
}
```

Use it inside Server Actions, route handlers, and Server Components. The point is to centralize the check so an audit later is "grep for `requireRole`" instead of a multi-day archaeology dig.

## Things that will bite you

A few hard-won lessons:

- **Cookies and edge runtimes**: not every cookie option works at the edge. If you see "session lost on navigation," check the runtime your middleware is using.
- **Local vs production callback URLs**: every OAuth provider needs production redirect URIs configured. Plan for at least three: local, preview, production.
- **Session invalidation**: when a user changes password or you ban them, their existing JWTs are still valid until they expire. Use database sessions if invalidation matters, or accept short JWT lifetimes.

## Where to go from here

Once the basics work, the next things worth building, in order:

1. **Email magic links** for passwordless sign-in.
2. **MFA** for accounts that touch money or admin permissions.
3. **An audit log** for security-sensitive actions (sign-in, password change, role changes).
4. **A `/account` page** where users can revoke sessions and remove linked OAuth providers.

Authentication is one of those areas where doing 80% of the work gets you 30% of the value. Plan a little more than feels necessary up front, keep your authorization logic centralized, and treat your secrets like the keys to the building. Future-you will be glad.
