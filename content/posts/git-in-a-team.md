---
title: "How to Use Git Confidently in a Team"
description: "Beyond add, commit, push — the Git workflows, recovery techniques, and team conventions that prevent the late-night merge disasters."
date: "2026-03-05"
category: "best-practices"
tags: ["Git", "Workflow", "Team"]
author: "BuildStack Editorial"
---

Most engineers learn just enough Git to ship code and then stop. That works until something goes sideways — a bad merge, a force push to the wrong branch, a `rebase` halfway done. This guide is about the next layer: the day-to-day commands, recovery techniques, and team conventions that make Git feel less like an arbitrary monster and more like a tool you trust.

## The mental model that helps

Git is a graph of commits, where each commit points at its parent(s). Branches are just movable pointers into that graph. Once you internalize that, most operations stop feeling magical.

Three commands let you see the graph:

- `git log --oneline --graph --decorate --all` — your default visual log. Alias it as `git lg` and use it constantly.
- `git status` — what's changed in your working directory and what's staged.
- `git reflog` — the safety net (more on this in a moment).

If you get in the habit of checking the graph before doing anything risky, you'll avoid most disasters before they happen.

## Daily commands worth memorizing

Beyond `add` / `commit` / `push`, these are the ones that pay rent:

- `git checkout -b feature/whatever` — branch off and switch in one command.
- `git restore --staged <file>` — unstage without losing changes.
- `git restore <file>` — discard local changes (use carefully).
- `git stash` and `git stash pop` — set aside changes when you need to switch branches quickly.
- `git diff --cached` — see exactly what's about to be committed.
- `git commit --amend` — fix the last commit before pushing.
- `git rebase -i HEAD~5` — clean up your last five commits before opening a PR.
- `git cherry-pick <sha>` — bring a single commit from another branch.

You don't need to be a Git wizard. You do need this small toolkit at your fingertips.

## The reflog is your time machine

Every action that moves a branch reference — commit, reset, rebase, even checkout — is logged in `git reflog`. It's the difference between "I've lost my work" and "I'll be fine in two commands."

```bash
git reflog
# Pick the SHA before you broke things
git reset --hard <sha>
```

The reflog stays around for about 90 days by default. It has saved more careers than any other Git feature. Learn it.

## Branching strategies that survive contact with reality

The two strategies that work well for most teams in 2026:

### Trunk-based development with short-lived branches

Everyone branches off `main`, makes small changes, opens a PR, merges back. The longest a branch should live is a couple of days.

This works when:

- You have CI that's fast and trustworthy.
- You can deploy `main` at any time.
- Your team is comfortable with feature flags for in-progress work.

It's the right default for most product teams. PRs stay small, reviews stay manageable, conflicts stay tiny.

### GitFlow (long-lived branches)

`main`, `develop`, feature branches, release branches, hotfix branches. Heavyweight, but appropriate when you actually have versioned releases (a desktop app, an SDK, software shipped to customers' servers).

For a typical web app deployed continuously, this is overkill and slows everything down.

Pick one consciously. The worst outcome is "we sort of do trunk-based but with three-week feature branches" — which has the costs of both and the benefits of neither.

## Pull requests as a unit of communication

A PR is not just a code review request. It's a written record of why the change was made. Things that make a PR easy to review — and easy to read in three years when someone needs to understand it:

- A title that says what changed (`Add rate limit to /signup endpoint`), not how (`Update routes.ts`).
- A description that answers "why" and "how to verify."
- A link to the issue, ticket, or RFC.
- A small diff (under ~400 lines if at all possible).
- Self-review *before* asking someone else.

The PRs that get reviewed quickly are the ones that respect reviewers' time. Writing a good description is a 5-minute investment that saves your reviewer 20 minutes.

## Rebase or merge?

The eternal question. Practically:

- **Rebase your feature branch onto `main`** to keep history linear *before* opening or updating a PR.
- **Merge into `main`** with a regular merge commit (or squash merge, if your team prefers — both are fine).
- **Don't rebase shared branches.** If anyone else has based work on your branch, don't rewrite its history.

The rule we use: rebase to clean up your own history, merge to integrate with shared history. Mixing the two correctly is more important than which one you "prefer."

## Recovering from common disasters

A short list of things that feel like the end of the world and aren't:

### "I committed to the wrong branch."

```bash
git log --oneline -1   # note the SHA
git reset --hard HEAD~1
git checkout right-branch
git cherry-pick <sha>
```

### "I force-pushed and lost commits."

```bash
git reflog
# find the SHA before the force push
git reset --hard <sha>
git push --force-with-lease
```

### "My rebase is a disaster."

```bash
git rebase --abort
```

When in doubt, abort. Then come back to the rebase with a plan.

### "I committed sensitive data."

If it's not pushed yet, `git reset --soft HEAD~1`, fix the file, recommit. If it's pushed, you have to *rewrite history* (`git filter-repo` is the right tool now, not `git filter-branch`) **and** rotate the secret. Don't skip the rotation; assume it's already been seen.

## Conventions that keep the team sane

A few small agreements go a long way:

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`. Boring, but enables automated changelogs and clearer history.
- **Branch naming**: `feature/`, `fix/`, `chore/` prefixes. Plus a ticket ID (`feature/SHOP-123-cart-fixes`) so finding the related context is one search.
- **Protected `main`**: no direct pushes, required reviews, required CI. The five minutes setting this up will prevent at least one outage.
- **Squash on merge** (or rebase-merge), so `main` history is clean.

Whatever you choose, write it down somewhere everyone can read. Inconsistent conventions are worse than imperfect ones.

## Two power features worth knowing

`git bisect` finds the commit that introduced a bug by binary search:

```bash
git bisect start
git bisect bad             # current commit is broken
git bisect good <old-sha>  # this old one works
# Git checks out a midpoint; you say good or bad
git bisect good
# ... and so on, until Git names the bad commit
git bisect reset
```

It works best when you have a clear, automatable test for the bug ("this URL returns 500"). For a regression in a long-lived codebase, it's almost magical.

`git worktree` lets you have multiple checkouts of the same repo at once:

```bash
git worktree add ../my-repo-hotfix main
```

Now you can fix a production bug in `../my-repo-hotfix` without disturbing your in-progress feature branch. No more `git stash` panic when the on-call rotation finds you.

## The takeaway

Git rewards a little curiosity. A weekend spent reading the man pages for `log`, `reset`, `rebase`, and `reflog` will save you more time over your career than almost any other technical investment. The goal isn't to memorize commands. It's to build enough mental model that, when something goes wrong, your first reaction is "let me look at the graph" instead of "I think I'm going to start over."

Get there, and Git stops being scary.
