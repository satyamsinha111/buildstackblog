---
title: "Mastering React Server Components in Next.js"
description: "Server Components have changed how Next.js apps are built. Here's a working mental model — what they're for, where Client Components belong, and the patterns that scale."
date: "2026-04-02"
category: "web-development"
tags: ["React", "Next.js", "Server Components", "Architecture"]
author: "BuildStack Editorial"
---

React Server Components are the kind of feature that looks small in the docs and rearranges your entire mental model in practice. If you've been using Next.js's App Router for a while and still occasionally aren't sure why a component needs `"use client"` at the top, this guide is for you.

We'll cut through the abstract framing ("server-rendered React") and focus on what actually changes about how you write code.

## The one-line mental model

A Server Component runs **once, on the server, before the response is sent**. A Client Component runs **on the server during streaming, then again in the browser** to handle interactivity.

That's the whole concept. Everything else is implications of that sentence.

A few things that fall out of it immediately:

- Server Components can do anything Node.js can do — read files, query databases, call private APIs. That code never reaches the browser.
- Server Components can't use `useState`, `useEffect`, or browser-only APIs. They've already finished by the time the page is interactive.
- Client Components can use those things, but they need their JavaScript shipped to the user.

## When to use which

The default in the App Router is Server Components. You only opt into a Client Component when you need one. The rule of thumb:

- **Use a Server Component when**: you're rendering content, fetching data, composing layouts, doing anything that doesn't react to user input.
- **Use a Client Component when**: you need interactivity (clicks, inputs, animations), browser APIs (`window`, `localStorage`), or React hooks for state.

A typical page is mostly Server Components, with small Client Components for the interactive bits — a search box, a dropdown menu, a like button.

## The "use client" boundary

When you add `"use client"` to a file, **everything imported by that file becomes part of the client bundle**. This is the rule that confuses people most.

```tsx
// app/components/Counter.tsx
"use client";

import { useState } from "react";
import { ExpensiveDateLib } from "expensive-date-lib";

export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

The moment you add `"use client"`, `expensive-date-lib` is now in your client bundle. If you didn't realize that, you're shipping kilobytes of JavaScript to the user that you didn't need to.

The fix is to keep "use client" components small and leaf-shaped. They should be the green tips of the tree, not the trunk.

## Composing Server and Client Components

Two patterns cover most cases:

### Pattern 1: Server Component as the parent

```tsx
// app/page.tsx (Server Component)
import { LikeButton } from "./LikeButton";
import { db } from "@/lib/db";

export default async function Page() {
  const post = await db.post.findUnique({ where: { id: "1" } });
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <LikeButton postId={post.id} initialCount={post.likes} />
    </article>
  );
}
```

The data is fetched on the server. Only the tiny `LikeButton` ships to the client. This is the common case.

### Pattern 2: passing Server Components as children to a Client Component

This one trips people up. You can do this:

```tsx
// app/page.tsx (Server Component)
import { Modal } from "./Modal";
import { Article } from "./Article"; // Server Component

export default function Page() {
  return (
    <Modal>
      <Article />
    </Modal>
  );
}
```

Even though `Modal` is a Client Component, `Article` is rendered on the server and passed in as a child. The client never sees `Article`'s implementation — it just receives the rendered output.

This pattern is the escape hatch when you need a Client Component wrapping Server Components. Use it sparingly; it's powerful and easy to abuse.

## Data fetching, simplified

The biggest practical win of Server Components is that you can fetch data anywhere a component renders, without `useEffect`, without spinners, without a separate API layer.

```tsx
async function PostList() {
  const posts = await db.post.findMany({ take: 10 });
  return (
    <ul>
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

A few things to know:

- React deduplicates fetches with the same URL automatically within a single render.
- `fetch` is patched in Server Components to support caching and revalidation directly.
- You can co-locate the query with the component that uses it, instead of pushing data through props from the page level.

## Streaming and Suspense

Server Components compose with React's Suspense to give you streamed responses. The user starts seeing the page before slow data has finished loading.

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<PostSkeleton />}>
        <SlowPosts />
      </Suspense>
    </>
  );
}
```

The header renders instantly. `<SlowPosts />` streams in when its data is ready. No loading spinner inside a `useEffect`, no flash of empty content.

## Server Actions for mutations

Server Actions let you write mutations as plain async functions on the server, called directly from the client:

```tsx
// app/actions.ts
"use server";

export async function likePost(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
}
```

Used from a Client Component:

```tsx
"use client";
import { likePost } from "./actions";

export function LikeButton({ postId }: { postId: string }) {
  return <button onClick={() => likePost(postId)}>Like</button>;
}
```

You can replace a lot of REST endpoints with Server Actions. Two cautions:

- They're still HTTP under the hood. Treat their inputs as untrusted, validate every parameter.
- Don't return huge objects from Server Actions. The serialization cost adds up.

## Common pitfalls

A few mistakes we keep seeing:

- **Adding `"use client"` to a layout** because one component inside needs interactivity. Now everything is a Client Component. Move the `"use client"` to the leaf.
- **Trying to use Server Component features inside a Client Component.** You can't `await db.query()` in a Client Component. Lift the data fetching to a Server Component above it.
- **Treating Server Components as a performance silver bullet.** They reduce client JavaScript, which often improves performance — but a slow database query is still slow whether it runs on the server or in a Client Component.

## A useful default architecture

For a typical Next.js App Router project:

- Pages and layouts: Server Components.
- Data-fetching wrappers: Server Components.
- Anything with `useState`, `useEffect`, or `onClick`: Client Component.
- Mutations: Server Actions.
- Validation and authorization: in a shared module imported by both.

You'll deviate from this in specific places, and that's fine. Have a default, then break it on purpose.

The shift to Server Components feels uncomfortable for about a week. After that, the old way of doing things — `useEffect` for data, separate API routes for mutations, hydration mismatches — feels weirdly cumbersome. Lean into the model. The framework is doing more of the work for you than it looks.
