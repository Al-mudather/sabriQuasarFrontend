---
name: scope-contract
description: Before any multi-file refactor, parallel agent swarm, or ambitious task that could drift across the codebase, declare a written SCOPE CONTRACT listing exact files that WILL be modified, files that will be READ ONLY, functionality to PRESERVE, and forbidden paths. Use this skill whenever the user asks for a "refactor", "rebrand", "migration", "propagation across N files", "parallel agents", "team of agents", "multi-file change", "touch many files", or any task that sounds like it could accidentally touch files outside the intended scope. Also trigger on phrases like "frontend only", "don't touch the backend", "read-only", or when dispatching more than one subagent with file-editing permissions. This skill exists to prevent scope drift — Claude touching files it wasn't asked to touch, parallel agents colliding on shared files, or refactors silently removing functionality that wasn't supposed to change.
---

# Scope Contract

A written contract that locks down exactly what a task is allowed to touch *before* the first edit. The point is to stop two failure modes at once:

1. **Scope drift by a single agent** — "frontend only" gets interpreted loosely and backend files start changing, or a refactor silently loses a feature that wasn't meant to change.
2. **Collision in a parallel agent swarm** — two agents writing to the same file and overwriting each other, or one agent rewriting files another agent owns.

Both failures are expensive to undo and hard to spot until after the commit. A scope contract is a cheap upfront artifact that makes them visible before any edits happen.

## When to use this skill

**Trigger automatically when any of these apply:**

- The task will touch more than ~5 files
- The user says "frontend only", "backend only", "don't touch X", "read-only", or any explicit boundary
- You're about to dispatch two or more implementation subagents (builder, frontend-developer, backend-architect, etc.) that could write files
- The task is a "refactor", "rebrand", "migration", "propagation", "rollout", or anything phrased as a codebase-wide change
- The task crosses repository boundaries in a monorepo (e.g. touches both `community-app/` and `community-be/`, or both frontend and mobile)
- You're uncertain whether a fix belongs in the "current scope" or somewhere adjacent

**Don't use this skill for:** single-file fixes, trivial typo corrections, one-off script runs, or tasks where the scope is the entire obvious unit (one component, one test file).

## The contract format

A scope contract is a short Markdown block with four fixed sections. Write it before any editing tool call. Paste it in the conversation so the user can see it and course-correct before you execute.

```markdown
## Scope Contract

### Will modify
- `path/to/file-a.ts` — reason
- `path/to/dir/` — reason (all files in this directory, exact list below)
  - `path/to/dir/file-1.ts`
  - `path/to/dir/file-2.ts`

### Read only (will consult but not edit)
- `path/to/reference.ts` — why I need to read it

### Must preserve (existing behavior that must keep working)
- [feature]: [how I'll verify it still works]
- Example: Server-side nearby/search filter on /branches — verify by reading the existing query, not editing it, and running the page afterward

### Forbidden paths (will not touch under any circumstance)
- `community-be/` — backend is read-only per AGENTS.md
- Any file matching `**/*.lock` or `**/package-lock.json` — lockfiles
- `.github/workflows/` — CI config

### Verification command(s) to run after
- `npx tsc --noEmit`
- `npm run lint`
- Playwright screenshot of affected pages
```

Each section is load-bearing:

- **Will modify** forces you to be concrete about the blast radius. "All files under X" is fine *only* if followed by the exact list. No globs-as-wishful-thinking.
- **Read only** is the section that stops "I needed to understand this file so I edited it a little." If you read it, declare it. If you don't plan to edit it, say so.
- **Must preserve** is the section that catches the silent-feature-loss failure mode. Explicitly name the behaviors that must keep working, and how you'll verify.
- **Forbidden paths** is belt-and-suspenders. Even if the plan doesn't seem to need them, list the paths the user has marked off-limits in their `CLAUDE.md` / `AGENTS.md`.
- **Verification commands** locks in how you'll prove the contract was honored.

## For parallel agent swarms

When dispatching multiple implementation agents in parallel, each agent gets its **own** scope contract, and the contracts must have **disjoint "Will modify" sets**. No file appears on two agents' lists.

Produce a single master contract first, then split it into per-agent contracts. Include each agent's contract in the prompt you send them. Example:

```markdown
## Master Scope Contract

### Team A — Question Review Screen
**Will modify:**
- `src/app/.../review/page.tsx`
- `src/app/.../review/_components/QuestionReviewNavigator.tsx`
- `src/app/.../review/_components/QuestionReviewCard.tsx`
**Forbidden:** anything under `../attempt/[attemptId]/_components/`, anything under `../performance/`, anything under `/my-progress/`

### Team B — Post-submit Breakdown
**Will modify:**
- `src/app/.../attempt/[attemptId]/page.tsx`
- `src/app/.../attempt/[attemptId]/_components/ExamResults.tsx`
- `src/app/.../attempt/[attemptId]/_components/ResultBreakdown.tsx`
- `src/app/.../attempt/[attemptId]/_components/BreakdownCountsCard.tsx`
- `src/app/.../attempt/[attemptId]/_components/PreviousAttemptComparison.tsx`
**Forbidden:** anything under `../review/`, anything under `../../performance/`, anything under `/my-progress/`

### Team C — Per-exam Performance Page
**Will modify:** [...]
**Forbidden:** [...]

### Team D — Global Progress Dashboard
**Will modify:** [...]
**Forbidden:** [...]

### Shared read-only references (all teams may read)
- `src/types/exam/*.ts`
- `src/lib/exam-stats/*`
- `messages/exam/*.json` (coordinated additions only — Phase 0 added all keys)
```

**Rules for parallel contracts:**

1. **Disjoint write sets** — verify by eye that no file appears in two "Will modify" sections. If it does, split responsibility (one agent owns the file, the other consumes it).
2. **Shared read-only set** — declare files all agents may read without editing. Types, utilities, and docs usually live here.
3. **Orchestrator owns merges** — if two agents legitimately need to change the same file (e.g. a shared `i18n` key file), the orchestrator (you) does the merge, not the agents.
4. **Forbidden paths apply to every agent** — write them once in the master contract and have every agent prompt restate them verbatim.

## What to do when the contract needs to change mid-flight

If during execution you discover that the contract is wrong — a file you didn't list needs to change, or a file you listed turns out not to — **stop and update the contract before proceeding**. Don't silently expand. Don't "just add one more file."

The update protocol:

1. Stop editing
2. State what you discovered and why the original contract was incomplete
3. Propose the contract amendment (added files, removed files, new forbidden paths)
4. Wait for user approval OR proceed only if the change is small and clearly within the spirit of the original scope
5. Resume with the amended contract

"Small and clearly within spirit" means: adding a new file whose parent directory was already listed, or adding a sibling component the user would obviously expect. It does NOT mean: crossing into a new feature area, touching a forbidden path, or expanding beyond the stated layer (frontend vs. backend).

## Verification after execution

After all edits are done, before committing, verify the contract was honored:

1. Run `git status` — every changed file should appear in "Will modify"
2. Any file in `git status` that's NOT in "Will modify" is a scope violation — investigate
3. Run the verification commands you declared
4. If using parallel agents, verify no two agents' files overlap in the diff

If you find violations, report them to the user before committing. Don't pretend they didn't happen.

## Anti-patterns

- **Wishful globs** — listing `src/app/**` as "will modify" without specifying which files. This is not a contract; it's a license.
- **Silent expansion** — touching a file not in the contract because "it was nearby" or "it needed a small update."
- **Missing preserve list** — not declaring what must keep working is how refactors silently remove features. Always name the behaviors you expect to survive.
- **Skipping the contract for "small" multi-file tasks** — if it's truly small (≤5 files, single concern), skip. If you're rationalizing that a 15-file refactor is "small", you need the contract.
- **Post-hoc contracts** — writing the contract after the fact, to describe what you already did. This defeats the point. The contract is a commitment, not a summary.
- **Contracts that are just file lists** — missing the "must preserve" and "forbidden" sections means the contract isn't catching the failures it's supposed to catch.

## Why this skill exists

Two recurring failure modes prompted this skill:

1. **Scope drift on single-agent tasks** — Claude was asked for a frontend-only refactor, decided the fix actually needed a backend tweak, edited the backend, and lost server-side search/filter behavior in the process. The user then had to re-add the removed functionality manually.
2. **Collision and overreach in parallel agent swarms** — a design-system propagation agent designated "P0" rewrote files it wasn't supposed to touch, and the orchestrator didn't notice until after commit.

Both failures were cheap to prevent and expensive to recover from. A written contract is the cheapest prevention there is: it forces a moment of commitment before execution, and it gives the user a concrete artifact to sanity-check before any tool call fires.

## Pairs well with

- **[Error Resolution Protocol](../error-resolution-protocol/SKILL.md)** — when an error surfaces mid-task, the protocol kicks in; if the fix expands scope, update the contract before applying.
- **Plan mode** — use plan mode to present the scope contract for user approval; ExitPlanMode signals acceptance of the contract.
- **Agent orchestration skills** — any skill that dispatches multiple parallel agents should produce a scope contract first.
