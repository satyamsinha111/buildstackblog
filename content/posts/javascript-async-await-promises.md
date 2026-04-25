---
title: "Understanding JavaScript Promises and Async/Await"
description: "A clear, example-led guide to async JavaScript — what Promises are, why async/await exists, the patterns that hold up, and the mistakes that quietly cost performance."
date: "2026-02-25"
category: "developer-guides"
tags: ["JavaScript", "Async", "Promises"]
author: "BuildStack Editorial"
---

JavaScript's async story has gotten a lot better over the years, but the failure modes are still subtle. This guide builds a working mental model of Promises and async/await — enough to write the right code on the first try and recognize the wrong code in code review.

We'll start with the model and work outward to the patterns.

## What a Promise actually is

A Promise is an object that represents the future result of an operation. At any moment, it's in one of three states:

- **Pending** — work is in progress.
- **Fulfilled** — the work succeeded, with a value.
- **Rejected** — the work failed, with a reason.

Once a Promise leaves "pending," it's settled forever. It cannot become pending again, and it cannot change from fulfilled to rejected.

Two important consequences:

- A Promise represents a *single* future value. If you want a stream of values, you want an `AsyncIterable` or a library like RxJS.
- A Promise starts running the moment it's created. There's no "lazy" Promise unless you build one yourself.

That second point is the source of more bugs than any other Promise behavior. We'll come back to it.

## The classic Promise API

You can consume a Promise with `.then()` and `.catch()`:

```js
fetch("/api/posts")
  .then((res) => res.json())
  .then((posts) => render(posts))
  .catch((err) => showError(err));
```

This works, but it doesn't compose well past two or three steps. That's what async/await fixes.

## async/await is just sugar (mostly)

`async` and `await` are syntactic sugar for the Promise API. The two pieces of sugar are:

- An `async` function always returns a Promise.
- `await` pauses execution inside an async function until a Promise settles, then unwraps it.

Rewriting the example above:

```js
async function loadPosts() {
  try {
    const res = await fetch("/api/posts");
    const posts = await res.json();
    render(posts);
  } catch (err) {
    showError(err);
  }
}
```

It reads top-to-bottom like synchronous code. That's the whole point.

A few things people get wrong:

- Forgetting that `async` functions still return Promises. `let posts = loadPosts()` gives you a Promise, not posts.
- Forgetting `await`. `const data = fetch(url).json()` doesn't work and the bug is silent until something downstream breaks.
- Treating `try/catch` around `await` as optional. It's the *only* way to handle rejections in async functions.

## Run things in parallel when you can

The most common performance mistake we see is unnecessary serialization:

```js
const user = await fetchUser(id);
const posts = await fetchPosts(id);
const friends = await fetchFriends(id);
```

If those three calls don't depend on each other, this code is three times slower than it needs to be. Use `Promise.all`:

```js
const [user, posts, friends] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchFriends(id),
]);
```

Now they run concurrently. The total time is the slowest of the three, not the sum.

A subtle gotcha: `Promise.all` rejects as soon as *any* promise rejects, but the others keep running. If you need all results regardless of failure, use `Promise.allSettled`:

```js
const results = await Promise.allSettled([
  fetchUser(id),
  fetchPosts(id),
  fetchFriends(id),
]);
```

Each result is `{ status: "fulfilled", value }` or `{ status: "rejected", reason }`. You decide how to handle each one.

## The Promises-start-immediately trap

```js
async function loadEverything() {
  const usersPromise = fetchUsers();
  const postsPromise = fetchPosts();
  // ... maybe some other work
  const users = await usersPromise;
  const posts = await postsPromise;
  return { users, posts };
}
```

This is great. Both fetches start immediately. By the time we await, they're already in flight.

Compare to:

```js
async function loadEverything() {
  const users = await fetchUsers();
  const posts = await fetchPosts(); // doesn't start until users finishes
  return { users, posts };
}
```

This is sequential. The second pattern shows up everywhere because async/await makes serialization look natural. Look for it in code review.

## Sequential when you have to be

Sometimes you genuinely need a loop of awaits — when each iteration depends on the previous one, or when you want to throttle an external API:

```js
for (const id of ids) {
  await processOne(id);
}
```

This runs one at a time. That's fine when needed.

What's *not* fine:

```js
ids.forEach(async (id) => {
  await processOne(id);
});
```

`forEach` doesn't await its callback. This kicks off all the calls at once, ignores their results, and finishes immediately. If you wanted parallelism, use `Promise.all(ids.map(processOne))`. If you wanted serial, use a for-of loop.

This bug is in production code more often than people admit.

## Concurrency limits with `Promise.all` are unsafe

`Promise.all([...].map(...))` runs *everything* at once. For 10 items, fine. For 10,000, you'll hit rate limits, exhaust connections, and possibly DoS your own database.

A small pattern for bounded concurrency:

```js
async function pool(items, limit, fn) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

const out = await pool(largeArray, 8, processOne);
```

Or use a library (`p-limit` is a good one). The point is to be deliberate about how many things are in flight at once.

## Cancelling work with AbortController

In 2026, almost every async API in the browser and Node.js accepts an `AbortSignal`. You should pass one through your stack:

```js
const controller = new AbortController();

const data = await fetch("/api/slow", { signal: controller.signal });

// somewhere else, when the user navigates away:
controller.abort();
```

Reasons to bother:

- Cancelling stale data fetches when a user types in a search box.
- Stopping background work when the user leaves a page.
- Bounding total time on a request that might hang.

It's a small habit that makes apps feel dramatically more responsive.

## Error handling patterns

Two patterns cover most async error handling:

### Wrap at the boundary

```js
export async function safeApi(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return { data: await res.json() };
  } catch (err) {
    return { error: err.message };
  }
}
```

A function that never throws, returns a tagged result. The rest of the code can pattern-match on it.

### Throw, but high up

For internal code, throw freely and catch at the request handler. Don't wrap every function in try/catch — that's the JavaScript equivalent of swallowing exceptions.

## Things to avoid

A short list of patterns we keep seeing in code review:

- **Using `.then()` inside `async`** functions. Pick one style. Mixing makes errors easier to drop on the floor.
- **Awaiting in a `Promise.all` callback** instead of mapping. `await Promise.all(items.map(async (i) => await fetchOne(i)))` does what you mean, but is often easier to write as `await Promise.all(items.map(fetchOne))`.
- **Catching everything to log it and rethrow nothing.** Now you have unhandled rejections that log twice and break tests.
- **Forgetting that React event handlers and lifecycle effects can call async functions but don't await them.** Errors thrown inside become unhandled.

## A clean mental model

Most async bugs come from one of three confusions:

1. "I forgot to `await` and the code ran out of order."
2. "I serialized work that could have been parallel."
3. "I started 10,000 things at once when I only meant to start 8."

Knowing those three, plus the basic syntax, is enough to write correct async JavaScript 95% of the time. The other 5% is interesting, edge-case territory — but you'll know you're there because the patterns above won't quite fit.

Async code isn't fundamentally hard. It just rewards a clear model and a little discipline. With those, modern JavaScript handles concurrency more cleanly than most languages a decade ago could.
