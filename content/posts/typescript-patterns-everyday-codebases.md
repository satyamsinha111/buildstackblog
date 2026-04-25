---
title: "TypeScript Patterns That Make Your Codebase Easier to Live With"
description: "Beyond the basics — a handful of TypeScript patterns that pay rent every day, including discriminated unions, branded types, and how to stop fighting the compiler."
date: "2026-03-29"
category: "best-practices"
tags: ["TypeScript", "Patterns", "Code Quality"]
author: "BuildStack Editorial"
---

TypeScript has won. Almost every serious JavaScript codebase uses it now. But there's a wide gap between "we use TypeScript" and "TypeScript is actually helping us." This post is a tour of the patterns that, in our experience, separate the two.

None of these are tricks. They're tools. Used well, they prevent entire classes of bugs from being possible to write.

## 1. Make impossible states impossible

The single most valuable thing TypeScript gives you is the ability to encode invariants in the type system. When you find yourself writing comments like "if `loading` is true, `data` will be undefined," that's a hint to use a discriminated union instead.

The lazy version:

```ts
type State = {
  loading: boolean;
  error?: Error;
  data?: User;
};
```

Every consumer has to remember the implicit rules. Every consumer eventually forgets.

The version that helps:

```ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: User };
```

Now the compiler enforces the rules. Inside `if (state.status === "success")`, `state.data` is typed as `User`. Outside it, accessing `state.data` is a type error.

This pattern shows up everywhere: form states, async results, payment statuses, anything with a clear set of mutually exclusive cases. Reach for it before you reach for optional fields.

## 2. Use branded types for values that look identical but aren't

`UserId` and `OrderId` are both `string` to TypeScript. That means you can pass an order ID where a user ID is expected and the compiler will not complain. This is how production bugs are born.

A "branded" type fixes it:

```ts
type Brand<T, B> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function getUser(id: UserId) {
  /* ... */
}

const orderId = "abc" as OrderId;
getUser(orderId); // Type error
```

The runtime cost is zero — the brand exists only in the type system. Use it for IDs, currency amounts, sanitized HTML, validated emails. Anything where mixing two values would cause a bug.

## 3. `as const` is your best friend

When you write a literal in TypeScript, the type defaults to its widened version: `"published"` becomes `string`, `[1, 2, 3]` becomes `number[]`. That's usually wrong.

`as const` keeps the literal type:

```ts
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"
```

Now `Role` is exactly the three strings, and you have a runtime array to iterate over for things like form options. One source of truth, two uses.

## 4. Stop using `any`. Use `unknown` instead.

`any` turns off type checking for the value it touches and everything that comes from it. `unknown` says "we don't know what this is yet" but forces you to narrow it before use.

```ts
function parseConfig(input: unknown) {
  if (typeof input !== "object" || input === null) {
    throw new Error("invalid config");
  }
  // input is now `object`. Narrow further as needed.
}
```

The pattern that almost always works:

- Internal API: never use `any`.
- Boundaries (network, file system, third-party libs): receive as `unknown`, validate at the edge, hand back a typed value to the rest of the codebase.

Validation libraries like Zod or Valibot make this trivial. Once you do it, the rest of the codebase stays clean.

## 5. Generic functions, but only when they earn their keep

Generics are a power tool, and they're easy to misuse. A generic that has only one type parameter and only one call site is just a fancy wrapper. A generic that lets you reuse the same function across many types is gold.

A great use case:

```ts
async function api<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

const user = await api<User>("/users/me");
```

A bad use case:

```ts
function logAndReturn<T>(value: T): T {
  console.log(value);
  return value;
}
```

The generic adds nothing here. `function logAndReturn<T>(value: T): T` is the same as accepting any input. If you can't write a sentence about *why* the function is generic, it shouldn't be.

## 6. Prefer `interface` for public shapes, `type` for everything else

This one is mildly contentious, but here's what we've settled on:

- `interface` for things you might extend or that are part of a public API. They support declaration merging, which is occasionally useful.
- `type` for everything else, especially unions, intersections, and computed types.

The mistake to avoid is mixing them randomly throughout the codebase. Pick a rule and follow it.

## 7. Narrow with type predicates instead of casting

When you need to tell TypeScript "trust me, this is an X," reach for a type predicate before reaching for `as`.

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

if (isUser(payload)) {
  // payload is User in here
}
```

Type predicates are checked. Casts aren't. The cost is the same; the safety is dramatically higher.

## 8. Use `satisfies` to validate without widening

The `satisfies` operator is one of the most underused features in TypeScript. It says "this value should be assignable to this type, but please keep its narrow inferred type."

```ts
const config = {
  port: 3000,
  env: "production",
  features: ["auth", "billing"],
} satisfies {
  port: number;
  env: "development" | "production";
  features: string[];
};

config.features; // string[], not just `string[]` — the literal narrowness is preserved
```

This is great for configs, route maps, and any object literal where you want both validation and precise types.

## 9. Stop reaching for utility types you don't need

`Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>` are all useful. They're also abused. If you find yourself writing `Partial<Pick<Omit<User, "id">, "name" | "email">>`, you don't need a clever type — you need to define a separate `UserUpdateInput` type and stop trying to derive it.

Types are documentation as much as they are constraints. A simple, named type is almost always better than a clever derived one.

## 10. Treat strict mode as non-negotiable

`"strict": true` in `tsconfig.json` should be on day one. Specifically:

- `noUncheckedIndexedAccess`: forces you to handle `array[i]` possibly being `undefined`. This catches real bugs.
- `noImplicitOverride`: prevents accidental overrides in classes.
- `exactOptionalPropertyTypes`: makes `field?: T` actually mean `T | undefined`, not "anything goes."

Yes, all of these will create work the first time you turn them on. That work is finding bugs, not creating them.

## What you can skip

Not every advanced feature is worth your time. In our experience, you can mostly ignore:

- Conditional types beyond simple use cases.
- The deepest levels of mapped types.
- Type-level computation that produces error messages a teammate has to ask Slack about.

If a type is so clever that nobody on the team can read it, it's a liability, not an asset.

The goal of TypeScript isn't a perfect type system. It's a codebase where the obvious bugs become impossible to write and where new contributors can change things without breaking them. Pick the patterns that move you toward that, and leave the rest.
