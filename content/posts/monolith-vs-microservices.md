---
title: "Monolith vs Microservices: When to Choose What"
description: "An honest look at the architectural debate that won't go away — when a monolith is the right call, when microservices earn their complexity, and the modular middle ground most teams should start with."
date: "2026-03-01"
category: "best-practices"
tags: ["Architecture", "Microservices", "Backend"]
author: "BuildStack Editorial"
---

The microservices wave has receded enough in 2026 that we can talk about this honestly. For most of the 2010s, "we're moving to microservices" meant "we are growing up." It also meant, for many teams, "we are about to spend the next two years rebuilding the same product on a much harder substrate." This guide is a sober look at when each approach is right, and what most teams actually need.

## The shapes of an application

Three shapes are worth understanding:

- **Monolith** — one deployable application. All features live in the same process. One database, generally.
- **Modular monolith** — one deployable, but with strong internal boundaries between modules. Each module owns its own data and exposes a clear interface.
- **Microservices** — many independently deployable services, often with their own databases, communicating over the network.

The conversation usually frames this as monolith vs microservices. The interesting answer is almost always the modular monolith.

## What microservices were trying to solve

It helps to remember why teams started reaching for microservices in the first place:

- **Scaling teams.** With a hundred engineers in one repo, you need clear ownership boundaries.
- **Scaling deployments.** A single 30-minute build is fine for a team of 5 and unbearable for a team of 50.
- **Independent scaling.** Some parts of the system are CPU-bound, others are I/O-bound, others are bursty.
- **Polyglot needs.** Some parts genuinely benefit from a different language or runtime.

Notice what's *not* on this list: "scaling traffic" alone. A well-designed monolith with horizontal scaling and a good database can handle staggering amounts of traffic. Twitter ran on a monolith for years.

## What microservices cost

The honest costs that don't get enough airtime:

- **Operational complexity.** You now run, monitor, and deploy many services instead of one. Logging, tracing, secrets, deploys — all multiplied.
- **Network reality.** Function calls become network calls. The fallacies of distributed computing show up: latency, partial failure, version skew, retries, idempotency.
- **Data consistency.** Transactions across services don't exist. You have to design for eventual consistency, and you have to mean it.
- **Local development.** Spinning up the full stack on a laptop is harder. Some teams ship "dev clusters" or "stub services," all of which is real engineering work.
- **Testing surface.** Integration tests have to span network boundaries; mocks proliferate.

These costs aren't theoretical. They're real, and they're what you pay for the benefits.

## When a monolith is right

A monolith is the right call when:

- You're a team of 1–20 engineers.
- You don't yet know your product's boundaries — what should be a separate service?
- Your operational maturity is "we can deploy a single app reliably."
- Your traffic fits comfortably on a few replicas of a single application.

A monolith for the first two years of a startup is almost always the right answer. It's the choice that lets you focus on the product, ship fast, and reorganize the code as understanding deepens.

The mistake to avoid is letting the monolith become a "big ball of mud" — no internal structure, no module boundaries, no clear ownership. That's when monoliths get a bad reputation. The fix isn't microservices; it's modules.

## The modular monolith

The modular monolith is what most teams actually want. It looks like this:

- One deployable, one CI pipeline, one production environment.
- Inside, the code is divided into modules with well-defined boundaries.
- Each module owns its database tables. Other modules don't read those tables directly — they call the module's functions.
- Cross-module communication happens through explicit interfaces, not shared mutable state.

This is the architecture that lets you grow from 5 engineers to 50 without a rewrite. When a module genuinely needs to scale or deploy independently, you've already got the boundary; extracting it to a service is a refactor, not a re-architecture.

Some practical patterns:

- A top-level directory per module (`/modules/billing`, `/modules/users`, `/modules/inventory`).
- Each module has its own routes, services, and data access layer.
- Cross-module calls go through a public interface (`billing.charge(...)`), not a shared database.
- Schema migrations are per-module where possible.

You don't need a fancy framework for this. Discipline and convention are usually enough.

## When microservices are right

There are real reasons to go microservices, even early on:

- **Genuinely different runtime needs.** Your real-time chat backend probably belongs in a different service from your billing system.
- **Independent scaling concerns.** The image-processing pipeline and the API don't have similar traffic patterns. Splitting them is reasonable.
- **Clear, durable boundaries.** Some product domains are just genuinely separate.
- **Team-shaped problems.** Conway's Law is real. If two teams own different product areas, separate services often follow naturally.

A pattern that works in 2026: a "modular monolith plus" approach. Most of the system stays in the monolith. A small number of services live outside it for specific reasons (high-throughput ingestion, isolated billing, an ML model server). Five services beats fifty.

## Migration patterns

If you have a monolith and you're feeling the pain, two migration patterns actually work:

### The strangler fig

Pick one bounded context (e.g. notifications). Build a new service that handles it. Route a small fraction of traffic to the new service. Expand the slice over time. Eventually, the old code is unused and can be deleted.

This is slow and unglamorous. It also works.

### The branch-by-abstraction

Inside the monolith, introduce an interface between the rest of the code and the module you want to extract. Get all callers to go through the interface. Then swap the implementation behind the interface for a network call to a new service. You change one file to extract a module.

This is harder than it sounds in a tangled codebase. It's the right approach if you can do it.

What doesn't work: declaring "we're rewriting the system as microservices" and starting from scratch. The graveyard of failed rewrites is full of these.

## Common mistakes in either direction

A few patterns to avoid regardless of architecture:

- **Sharing a database across services.** This is microservices in name only — you'll get all the operational pain and none of the isolation benefits.
- **Microservices that always call each other in a chain.** A request that hits five services in sequence has worse latency, worse error semantics, and worse observability than the equivalent monolith call.
- **A monolith with no internal boundaries.** Every PR touches every module, every team blocks every other team, and the test suite is a 30-minute joke.
- **A monolith that's actually three monoliths sharing a database.** Pick one architecture and live with it.

## The takeaway

Most teams in 2026 should start with a modular monolith and stay there longer than they think. When the monolith starts genuinely getting in the way — for clear, articulated reasons that aren't "I read a blog post" — extract one or two services that earn their cost.

Architecture is, in the end, about whose problems you want to have. Microservices solve coordination problems and create operational problems. Monoliths solve operational problems and can create coordination problems. The skill is knowing which set of problems your team is built to handle right now — and being honest about it.
