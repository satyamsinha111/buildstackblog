---
title: "Designing a Database Schema You Won't Regret in Six Months"
description: "Schema design choices are quiet for the first month and loud for the next five years. A practical guide to the decisions that matter most early."
date: "2026-03-21"
category: "best-practices"
tags: ["Database", "PostgreSQL", "Architecture", "Backend"]
author: "BuildStack Editorial"
---

Schema decisions you make in week one of a project ripple out for years. The wrong choice for an `id` column can quietly become the most expensive bug in the codebase by the time you have a million rows. This guide is about the schema decisions that matter most, with the reasoning that goes into them.

We'll use PostgreSQL throughout, because it's the right answer for almost any new project in 2026 unless you have a specific reason otherwise.

## Start with a real entity-relationship sketch

Before opening your ORM, sketch the entities on paper. The goal is to answer two questions for every one:

- **What identifies it?** Is there a natural key, or do we need a synthetic one?
- **What does it relate to, and how?** One-to-one, one-to-many, many-to-many?

If you can't answer those for an entity, you don't understand it well enough to model it yet. Talk to whoever does.

## Pick your primary key carefully

This is the decision people most often regret. Three reasonable choices:

- **Auto-incrementing integers** (`bigserial`). Smallest, fastest, easiest to read. Bad for distributed inserts and exposes record counts.
- **UUIDs** (`uuid`). Globally unique, safe to expose. Larger, and `gen_random_uuid()` is not great for index locality.
- **ULIDs / KSUIDs / UUIDv7**. Time-sortable identifiers. The best of both worlds for most modern apps.

Our default in 2026 is **UUIDv7** (or ULID where v7 isn't available natively). They're sortable by creation time, which keeps indexes warm and pagination predictable, while still being safe to put in URLs.

Whatever you choose, *don't mix* across tables. Pick one and stay with it.

## Use real types, not "string for everything"

Postgres has rich types. Use them.

- `timestamptz` for any datetime. Never `timestamp without time zone`. Time zones are real; storing UTC and converting at the edges is the only sane policy.
- `numeric(10, 2)` for money. Never `float`. Never `double`. The first time you sum 0.1 + 0.2 in floating point you'll wish you hadn't.
- `boolean` for booleans. Not `0/1`, not `'Y'/'N'`.
- `jsonb` for genuinely document-shaped data. Not as a junk drawer for fields you didn't want to think about.
- `text` over `varchar(n)`. There is no performance benefit to `varchar(255)` in Postgres, and the length limit will eventually bite you.

A few minutes here saves a week of `to_timestamp(...)` and `cast(... as numeric)` later.

## Foreign keys are not optional

Every relationship between tables should be enforced with a foreign key constraint. We've never met a team that turned foreign keys off and didn't regret it.

Two specific things to do:

- Use `ON DELETE` rules deliberately. `RESTRICT` is the safest default; `CASCADE` is fine for genuinely owned data (a comment cascades from a deleted post). Avoid `SET NULL` unless it actually models the domain.
- Index your foreign keys. Postgres doesn't do it for you, and unindexed foreign keys lead to slow joins and lock contention on deletes.

```sql
ALTER TABLE comments
  ADD CONSTRAINT comments_post_fk
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

CREATE INDEX comments_post_id_idx ON comments(post_id);
```

Do this from day one. Retrofitting foreign keys onto a live database is an unhappy weekend.

## Index for the queries you actually run

The two extremes are both wrong:

- **No indexes**: every query scans the whole table.
- **Too many indexes**: writes get slower, and the indexes you really need disappear into noise.

A workable rule:

1. Index every foreign key.
2. Index columns that appear in `WHERE` and `ORDER BY` on hot endpoints.
3. Use composite indexes when queries filter on multiple columns together (`(user_id, created_at)`).
4. Add indexes when you have actual evidence — `EXPLAIN ANALYZE` showing a sequential scan on a slow query.

Don't index `boolean` columns alone. They have terrible selectivity. Index them as part of a composite if you need to.

## Soft deletes: do them on purpose, not by default

Soft deletes (`deleted_at` columns) are useful for:

- Anything users see and might want back ("undelete this post").
- Anything tied to compliance or audit trails.

They're a footgun for everything else. Once you have soft deletes, every query needs to remember to filter them out. Forgetting once means showing deleted data. Forgetting in a foreign key check means orphaned references.

If you adopt soft deletes, do it consistently:

- A `deleted_at timestamptz` column.
- A view or scope that hides deleted rows by default.
- A clear policy on whether unique constraints include soft-deleted rows (probably not).

If you don't need them, don't preemptively add them.

## Use enums, but carefully

Postgres enums are great for fields with a small, stable set of values (`order_status`, `subscription_plan`). They show up nicely in tooling and constrain the values to the ones you've defined.

The catch: changing an enum requires a migration. Adding a value is fine, removing one is painful.

Our rule of thumb:

- Use enums when the set rarely changes and is conceptually closed (e.g. `status`).
- Use a lookup table when the set might grow over time (e.g. `country`, `plan`).

## Don't be clever with `jsonb`

`jsonb` is a powerful escape hatch. It's also where schema design goes to die. The "we'll just put it in `metadata` for now" pattern leads to:

- Untyped fields scattered across the codebase.
- Queries that can't use indexes.
- A surprise when two engineers store the same concept under different keys.

Use `jsonb` for:

- Genuinely user-defined data ("custom fields" on a record).
- Snapshots you want to keep verbatim (a webhook payload, an audit log entry).
- Data that changes shape over time and where you don't need to query individual fields often.

Don't use `jsonb` to avoid making schema decisions. Make the decisions.

## Audit fields that earn their keep

Every table benefits from a few audit fields:

- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()` (with a trigger to keep it fresh)
- `created_by` / `updated_by` for anything user-facing

These are cheap to add and invaluable when something goes wrong. The first time you have to debug "who changed this row and when," you'll be glad they're there.

## Migrations are part of your schema

Schema isn't just the current state — it's the path that got you there. A few habits make life easier:

- Every change goes through a migration tool. No "I just ran some SQL on the prod database to fix it."
- Migrations are forward-only. If you need to undo, write a new migration that undoes it.
- Test destructive migrations on a copy of production data, not just on a dev database with five rows.

In a team of any size, migrations are the schema's source of truth, not the live database.

## A small concrete example

Here's a respectable schema for a blog with users, posts, and comments:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX posts_author_idx ON posts(author_id);
CREATE INDEX posts_published_idx ON posts(published_at DESC) WHERE status = 'published';
```

Boring, explicit, and easy to evolve. That's the goal.

Schema design isn't about cleverness. It's about leaving as few sharp edges as possible for the version of yourself who comes back to this code in six months and has to ship something on a Friday afternoon. Make the obvious choices, and use the time you save for the parts that genuinely require thinking.
