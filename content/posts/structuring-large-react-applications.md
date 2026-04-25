---
title: "How to Structure a Large React Application Without It Becoming a Maze"
description: "Folder structures, module boundaries, and team conventions that keep React projects navigable as they grow from one engineer to twenty."
date: "2026-02-05"
category: "web-development"
tags: ["React", "Architecture", "Patterns"]
author: "BuildStack Editorial"
---

The first 5,000 lines of a React project don't need a structure. The next 50,000 do. The difference between codebases that scale gracefully and ones that turn into mazes isn't the framework or the libraries — it's the conventions the team agreed on early and stuck to.

This is a working tour of structures and conventions that hold up. None of it is universal. All of it is opinionated.

## Start with one principle: organize by feature, not by type

Most React tutorials show you something like this:

```
src/
  components/
    Button.tsx
    Card.tsx
    UserList.tsx
    PostEditor.tsx
  hooks/
    useUser.ts
    usePosts.ts
  utils/
    formatDate.ts
    api.ts
```

This works for a tiny app. It falls apart at scale. To work on a single feature, you're touching files in four different folders. The "User" stuff and the "Posts" stuff are mixed everywhere.

The structure that scales:

```
src/
  features/
    users/
      components/
      hooks/
      api.ts
      types.ts
      index.ts
    posts/
      components/
      hooks/
      api.ts
      types.ts
      index.ts
  shared/
    components/
    hooks/
    utils/
  app/
    layout.tsx
    page.tsx
```

Now everything related to "users" lives under `features/users`. To delete a feature, you delete one folder. To work on a feature, you touch one folder. New engineers learn the codebase by reading one feature at a time.

## What goes in `shared`

`shared` is everything that's truly cross-feature. Be ruthless about it:

- Generic UI primitives (`Button`, `Modal`, `Tooltip`).
- Genuinely shared hooks (`useDebouncedValue`, `useMediaQuery`).
- Cross-cutting utilities (date formatting, currency, the `api` client wrapper).

What does *not* go in `shared`:

- A `<UserCard />` that's used in two features. That's a feature-coupling problem, not a shared component. Either lift the user feature higher, or extract the card to `features/users` and import it from the second feature explicitly.
- Anything you "might use later." YAGNI. Build it where it lives now; promote it when there's actual reuse.

## Module boundaries that mean something

The `index.ts` file in each feature is the public API. Other features import from `features/users`, not from `features/users/components/internal/Foo.tsx`. This single convention prevents an enormous amount of accidental coupling.

```ts
// features/users/index.ts
export { UserCard } from "./components/UserCard";
export { useCurrentUser } from "./hooks/useCurrentUser";
export type { User } from "./types";
```

You can enforce this with ESLint (`no-restricted-imports`) or a linter like `dependency-cruiser`. Even without enforcement, the convention helps if you write it down.

## Where data fetching lives

In a Next.js App Router project, the answer is mostly: in Server Components, near where the data is used. In a client-heavy SPA, the answer is: in a small layer per feature.

The common mistake: a single `api.ts` at the root of the project that grows to 3,000 lines. Split it per feature:

```
features/users/api.ts        # only user-related calls
features/posts/api.ts        # only post-related calls
shared/utils/api-client.ts   # the underlying fetch wrapper
```

Each `api.ts` exports a small, named set of functions. The shared client handles the cross-cutting concerns (auth headers, error mapping, retries).

## State management at scale

The decision tree we use:

1. Local state? `useState`.
2. Shared between two siblings? Lift to common parent.
3. Shared across the tree but only one feature? Feature-level context.
4. Server data (anything from your API)? A server-state library — TanStack Query, RTK Query, or framework-native (Next.js's data fetching, React Router loaders).
5. Truly global UI state (theme, current user)? A small global store. Zustand or Redux Toolkit.

Two things to avoid at scale:

- **One giant Redux store** for everything. It will become impossible to delete anything from it.
- **Conflating server state and UI state.** They have different lifecycles, different cache concerns, different invalidation rules. Use different tools.

## Routing and code splitting

For a large app, every route should be a code-split chunk. In Next.js this is automatic per route. In other frameworks, use lazy loading explicitly.

Two principles:

- **Route boundaries are split boundaries.** Don't split inside a route — that's premature optimization.
- **Avoid putting heavy dependencies in shared layouts.** A heavy library imported by `_app.tsx` ships to every page.

A good audit at any size is "how many KB of JavaScript does my smallest page ship?" If the answer is in the hundreds, you've got something heavy in the shell.

## Types as a contract layer

In a project of any meaningful size, your types are the most important documentation you have. Some habits that pay off:

- **Define core domain types once, in one place per feature** (`features/users/types.ts`). Don't redefine `User` in three components.
- **Use branded types for IDs.** A `UserId` is not a `string`.
- **Don't export `any` from a module's public API.** Every public type should be precise.
- **Validate at the boundary.** Use Zod (or similar) to validate API responses, then carry the inferred type forward. Inside the app, the types are trustworthy.

The payoff is that refactors become tractable. "Add a field to `User`" becomes a `tsc` exercise instead of a search across the codebase.

## Testing structure

Tests should live next to the code they test. The convention we use:

```
features/users/
  components/
    UserCard.tsx
    UserCard.test.tsx
  hooks/
    useCurrentUser.ts
    useCurrentUser.test.ts
```

Co-location keeps tests easy to find and easy to delete. A separate `tests/` folder mirroring `src/` is a structure that nobody updates.

Higher-level tests (integration, E2E) belong in their own top-level folder, where their setup is clearly different from unit tests:

```
src/
  features/
e2e/
  auth.spec.ts
  checkout.spec.ts
```

## Conventions that pay off

A few small agreements that compound across a year:

- **One default export per file** for components. Named exports for everything else. Consistency wins.
- **Group imports**: external first, then `@/shared`, then `@/features/...`, then relative. A Prettier or ESLint plugin can enforce this.
- **No deep relative imports** (`../../../../`). Use path aliases (`@/`).
- **A `README.md` per feature** with a paragraph about what it does and any non-obvious decisions.
- **Folder names are plural** (`features/`, `components/`), file names are singular (`UserCard.tsx`).

None of these matter individually. Together, they make the codebase feel like one project instead of five.

## What to avoid as you grow

A few patterns that look harmless and become expensive:

- **A `utils.ts` that everyone dumps things into.** It will become 4,000 lines. Split by purpose early.
- **A "common" or "lib" folder with no clear contract.** Same problem.
- **Re-export barrels at every level.** A barrel at the feature boundary is great. A barrel at every directory level slows down builds and obscures imports.
- **Lots of "v2" components living next to "v1" components.** Have a real migration; don't let half-migrations linger.

The pattern is: every "small convenience" decision compounds. The good ones compound into a codebase you're glad to work in. The bad ones compound into a maze.

## When the structure breaks

It will, eventually. A new product requirement crosses old boundaries. A feature grows large enough that it deserves to be broken into sub-features. A shared utility was over-shared and needs to be moved back to a feature.

When this happens, refactor honestly. Move the files, update the imports, run the tests. Don't paper over it with another layer of abstraction. The structure is a tool, not a treaty.

## A final note

The single biggest predictor of a healthy large React codebase is *how easy it is to delete things*. If features can be deleted by removing one folder, if test files live next to the code they test, if the shared layer is small and well-defined, you have a structure that will hold up.

If, instead, removing a feature requires editing twenty files in five folders and rerouting imports through three barrels, the structure has already failed. Notice it early. Refactor when the cost is small. The codebase you'll be working in next year is the codebase you build today.
