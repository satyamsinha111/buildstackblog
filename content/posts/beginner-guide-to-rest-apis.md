---
title: "A Practical Beginner's Guide to REST APIs"
description: "What a REST API actually is, why HTTP verbs matter, and how to design and consume one without falling into common traps. Written for developers who want a working mental model, not a textbook definition."
date: "2026-04-09"
category: "developer-guides"
tags: ["API", "REST", "HTTP", "Backend"]
author: "BuildStack Editorial"
---

If you've ever called `fetch("/api/users")` and wondered what's actually going on under the hood, this guide is for you. We're going to build a real mental model of REST APIs — not the marketing version, not the academic version, the version that holds up when you have to debug something at 11 p.m.

## What "REST" actually means

REST stands for Representational State Transfer. That sounds intimidating until you translate it: a REST API is a way for two programs to talk over HTTP using a small, predictable vocabulary.

The vocabulary has three parts:

- **Resources** — the nouns. A user, a post, an order. Each one has a URL.
- **Verbs** — what you want to do to those resources. HTTP gives you GET, POST, PUT, PATCH, and DELETE.
- **Representations** — how the data is encoded. Usually JSON in 2026.

That's it. Most "REST" debates online are arguments about how strictly to follow these rules. In practice, every team draws the line somewhere different, and that's fine — as long as you're consistent.

## A worked example

Let's design a small API for managing blog posts. The URL structure should read like English:

- `GET /posts` — list posts
- `GET /posts/123` — get one post
- `POST /posts` — create a post
- `PATCH /posts/123` — update part of a post
- `DELETE /posts/123` — delete a post

Notice what we didn't do:

- `GET /getPosts`
- `POST /deletePost`
- `GET /posts?action=delete&id=123`

The HTTP verb already says what you're doing. Putting the verb in the URL is duplication, and it makes things harder to read, log, and cache.

## HTTP verbs in plain English

Here's the rule of thumb that has served us best:

- **GET** — "give me a thing." Should never change anything on the server. Safe to retry.
- **POST** — "make a new thing." Generally not safe to retry blindly.
- **PUT** — "replace this thing entirely with what I'm sending."
- **PATCH** — "update part of this thing."
- **DELETE** — "remove this thing."

Two things people get wrong:

1. Using POST for everything. It works, but you lose the ability for browsers, proxies, and caches to optimize.
2. Confusing PUT and PATCH. PUT is a full replacement; PATCH is a partial update. If your endpoint accepts only the fields you want to change, it's a PATCH.

## Status codes that actually matter

Most APIs only need a small subset:

- **200 OK** — "here's what you asked for."
- **201 Created** — "I made the thing. Here it is."
- **204 No Content** — "I did the thing. Nothing to send back."
- **400 Bad Request** — "your input was invalid."
- **401 Unauthorized** — "I don't know who you are."
- **403 Forbidden** — "I know who you are, and you can't do this."
- **404 Not Found** — "no such resource."
- **409 Conflict** — "this clashes with the current state" (good for duplicate emails).
- **422 Unprocessable Entity** — "I understood your request but it's semantically wrong."
- **429 Too Many Requests** — "slow down."
- **500 Internal Server Error** — "something broke on our side."

The mistake to avoid: returning `200 OK` with `{ "error": "..." }` in the body for actual errors. That breaks everything downstream that relies on status codes — monitoring, logging, retries, caches.

## Designing request bodies

A few small rules go a long way:

- Use `camelCase` consistently (or `snake_case`, just pick one).
- Use proper types. Numbers as numbers, dates as ISO 8601 strings, booleans as booleans. Strings everywhere is a code smell.
- Keep nesting shallow. Two levels of nesting is usually plenty.
- Validate everything on input. Trust nothing the client sends.

Here's a reasonable request to create a post:

```json
{
  "title": "Hello, world",
  "body": "Welcome to my blog.",
  "tags": ["intro", "meta"],
  "publishedAt": "2026-04-09T10:00:00Z"
}
```

And a reasonable error response:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Title is required.",
    "field": "title"
  }
}
```

A consistent error shape makes client code dramatically easier to write. Decide on yours early.

## Authentication, briefly

Almost every real API needs auth. The two patterns you'll see most often:

- **Bearer tokens in the Authorization header**: `Authorization: Bearer eyJ...`. Used for OAuth, JWTs, API keys.
- **Cookies with `Secure; HttpOnly; SameSite=Lax`**: used for browser-based sessions.

Some practical advice:

- Don't put tokens in URLs. They end up in logs.
- Don't ship your API key in client-side code. If users can see it, they can steal it.
- Use HTTPS for everything. There is no excuse not to in 2026.

## Pagination, filtering, and sorting

For any list endpoint, you'll want at least three query parameters:

- `?limit=20&cursor=abc` — pagination. Cursor-based scales better than `?page=2`.
- `?sort=-createdAt` — sort by created date descending.
- `?status=published` — filter.

Pick one style and use it across every list endpoint. Inconsistency is the silent killer of API DX.

## Versioning without regret

Some day, you will need to make a breaking change. Plan for it now. Two patterns work in practice:

- **URL versioning**: `/v1/posts`. Easy, ugly, hard to argue with.
- **Header versioning**: `Accept: application/vnd.example.v1+json`. Cleaner URLs, more friction for consumers.

If you're a small team shipping a public API, URL versioning is fine. The important thing is that you have *some* way to ship `v2` without breaking `v1` consumers overnight.

## Consuming a REST API from JavaScript

A safe baseline pattern:

```ts
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}
```

Build everything else on top of this. Don't repeat error-handling logic across the codebase.

## What to read next

If you want to take this further:

- Read [the Stripe API docs](https://stripe.com/docs/api). They're widely considered the gold standard.
- Look at OpenAPI / Swagger for documenting your APIs as a machine-readable spec.
- Try GraphQL once, just to understand what problems REST has.

REST isn't a religion. It's a set of conventions that make HTTP-based systems easier to build, document, and debug. Get the basics right, stay consistent, and you'll have an API that other developers actually enjoy using — which is, in the end, the whole point.
