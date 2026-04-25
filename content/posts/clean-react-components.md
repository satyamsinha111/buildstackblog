---
title: "How to Write React Components That Don't Get Refactored Twice"
description: "Concrete patterns for writing React components that survive contact with a real codebase — composition, prop design, and the small habits that prevent rewrites."
date: "2026-03-13"
category: "best-practices"
tags: ["React", "Code Quality", "Patterns"]
author: "BuildStack Editorial"
---

A "clean" React component isn't one that looks pretty in isolation. It's one that survives six months of feature requests, three new contributors, and a complete redesign without getting completely rewritten. That's a much higher bar, and it requires habits, not tricks.

This is a tour of the practices that, in our experience, make the biggest difference between components that age well and ones that get tagged "needs refactor" two sprints in.

## 1. Make the prop interface tell the truth

A component's props are its API. Treat them like one.

Here's a tell-tale sign of a component that hasn't been thought through:

```tsx
<Card variant="primary" hideHeader hideFooter dark large compact />
```

Six props, three of them booleans, two of them contradictory. Each one was added in a different PR. The component now has 2^6 = 64 possible appearances and tests for none of them.

The fix is usually to step back and ask: what *kinds* of cards exist? Often there are three or four real variants, and you can express them as discriminated props:

```tsx
type CardProps =
  | { kind: "default"; title: string; children: ReactNode }
  | { kind: "compact"; title: string }
  | { kind: "feature"; title: string; description: string; cta: ReactNode };
```

Now the type system enforces correctness, and the component's complexity matches the actual product.

## 2. Lift state up only as far as it needs to go

A common React pitfall: every piece of state lives in a context or a global store, "just in case." This makes components easier to "wire up" and dramatically harder to reason about.

The rule we use:

- State that only one component cares about: `useState` in that component.
- State two siblings need to share: lift to their common parent.
- State five components scattered across the tree need: a context, but only when you've actually needed to.
- State that survives navigation: a server cache or URL parameters, not a global client store.

Most React performance problems we see are state lifted higher than necessary, causing unrelated components to re-render. Most React readability problems are state lifted lower than necessary, requiring prop-drilling for things that should be local.

## 3. Composition beats configuration

When in doubt, give the component slots instead of props.

Bad:

```tsx
<Modal title="Confirm" footerText="Are you sure?" confirmLabel="Yes" cancelLabel="No" />
```

Good:

```tsx
<Modal>
  <Modal.Header>Confirm</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button kind="secondary">No</Button>
    <Button kind="primary">Yes</Button>
  </Modal.Footer>
</Modal>
```

The configuration version looks shorter. It's also a trap. The first time you need a custom footer with a checkbox, the API has to grow. The composition version handles every future variation for free.

The trade-off is that composition has slightly more boilerplate at the call site. That's almost always the right trade.

## 4. Don't `useEffect` to derive state

This is one of the most common bugs in React codebases.

```tsx
function ProductCard({ product }) {
  const [discounted, setDiscounted] = useState(0);

  useEffect(() => {
    setDiscounted(product.price * 0.9);
  }, [product.price]);

  return <p>{discounted}</p>;
}
```

This renders twice on every prop change and is harder to reason about than the alternative. Just compute it:

```tsx
function ProductCard({ product }) {
  const discounted = product.price * 0.9;
  return <p>{discounted}</p>;
}
```

The rule: **`useEffect` is for synchronizing with the outside world** — DOM APIs, timers, network requests. It's not for derived values. If you find yourself reaching for `useEffect` to compute something from props or state, you almost always don't need it.

## 5. Co-locate, then extract

Resist the temptation to extract every component into its own file the moment you write it. Inline a small subcomponent at first. Extract when:

- It's used in more than one place.
- It has its own state or effects worth isolating.
- It's grown big enough that it dominates the file it lives in.

Premature extraction creates a maze of one-line files that's hard to navigate and harder to refactor. Files that are 200–400 lines and contain three related components are usually easier to work with than thirty 30-line files.

## 6. Name your hooks like the data they manage

A hook called `useData` is a bug waiting to happen. A hook called `useCurrentUser` is a contract.

Some habits that pay off:

- Name hooks after what they return, not what they do (`useCurrentUser`, `useShoppingCart`, not `useFetchUser`).
- Hooks that fetch should return the same shape as their successful state when possible (`{ user, isLoading, error }`).
- Resist hooks with a dozen parameters. They're a sign you're trying to express a stateful object as a function.

The best hooks read at the call site like English: "use the current user," "use the cart," "use the active modal."

## 7. Stop being clever with `useMemo` and `useCallback`

`useMemo` and `useCallback` are not free. They each have an allocation, a dependency check, and a reference comparison. Sprinkling them everywhere makes code slower *and* harder to read.

When to use them:

- The wrapped value is genuinely expensive to compute (parsing a large object, running a sort over thousands of items).
- You're passing a callback to a memoized child and need referential stability.

When not to use them:

- "Just in case." React is fast enough that wrapping every callback in `useCallback` is a net loss.
- For simple values like `count + 1`. Stop.

The rule of thumb: don't optimize until you've measured.

## 8. Errors and loading states are part of the design

Every component that fetches data has at least three states: loading, error, success. Designing only the success state is the most common cause of UI that looks great in screenshots and feels broken in production.

A good pattern:

```tsx
function PostList() {
  const { data, error, isLoading } = usePosts();
  if (isLoading) return <PostListSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data?.length) return <EmptyState />;
  return data.map((post) => <PostCard key={post.id} post={post} />);
}
```

That's four states explicitly handled in seven lines. Most "weird UI bugs" come from skipping one of them.

## 9. Test the contract, not the implementation

A test that asserts "the component renders a `<div>` with class `wrapper`" will break the next time someone changes the markup. A test that asserts "the user can submit the form and see a confirmation" will keep passing through three redesigns.

React Testing Library is built around this principle: test behavior, not internals. If your test is reaching for component instances or testing exact DOM structure, you're probably testing the wrong thing.

## 10. Write components like the next person who reads them is on a deadline

Practical implications:

- Sort imports.
- Pull constants out of render.
- Give long props meaningful names.
- Add a `// why this exists` comment when something looks weirder than it should.
- Avoid clever one-liners that need a paragraph to explain.

The goal isn't beauty. It's the reader being able to make a small change without having to understand everything.

## A short closing thought

React has been around long enough that the patterns are well-understood. Most of the value isn't in choosing exotic tools — it's in being consistently boring across a codebase. Boring components compose. Boring components survive refactors. Boring components are the ones that, six months later, you don't have to rewrite.

That's the only metric of clean React code that really matters.
