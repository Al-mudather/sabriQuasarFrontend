# Generate Tasks from Feature Document

Read the feature document at `$ARGUMENTS` and generate a structured, phased task directory under `tasks/`.

---

## STEP 1: Read the Feature Document

Read the file at `$ARGUMENTS`. Extract:

- **Feature name** (use for directory naming, kebab-case)
- **Feature description** (1-2 sentence summary)
- **Route/location** (where this feature lives in the app)
- **All operations** (queries, mutations, API calls) with their inputs and outputs
- **Input/output types** referenced
- **Any perspective groupings** (e.g., APP, COMMUNITY, ADMIN) or logical domains

---

## STEP 2: Explore the Project

Before generating tasks, explore the project to understand its conventions:

1. **Derive the project root** from `$ARGUMENTS`. The first path segment is the project root (e.g., `dashboard-community/docs/features/wallet.md` → project root is `dashboard-community`).
2. **Read `{project-root}/PROJECT_STRUCTURE.md`** — this is the authoritative source for all directory paths, naming conventions, and patterns in that project. Use it to determine where routes, actions, types, GraphQL files, generated output, components, and i18n messages live.
3. **If `PROJECT_STRUCTURE.md` does not exist**, fall back to manually exploring the project: use `ls` on the `src/` directory and its subdirectories to discover the actual layout before generating any file paths.
4. **Check `tasks/`** inside the project root for any prior art on this feature.
5. **Verify before creating** — if a path is not mentioned in `PROJECT_STRUCTURE.md`, check via `ls` that the target directory exists before referencing it in tasks.

Note which assets already exist for this feature and which need to be created.

---

## STEP 3: Determine Phases

Apply these rules:

- **Phase 0** = ALWAYS "Scope and Routes" (foundation: route setup, sidebar nav, GraphQL verification, cache tags, type namespace)
- **Final Phase** = ALWAYS "Polish and Final Integration" (loading states, error boundaries, responsive, accessibility, production polish)
- **Middle phases** = Determined by the feature's logical groupings. Group related operations together. Each middle phase should represent a coherent, independently testable unit of work.

**Naming convention:** `PHASE_N_Short_Name_With_Underscores.md` (e.g., `PHASE_1_Wallet_Overview_and_Statistics.md`)

**Guidelines for middle phases:**
- Group by domain/entity (e.g., "Wallet Overview", "Recharge History", "Recharge Operations")
- Group by perspective if the feature has distinct perspective-based operation sets
- Each phase should have enough operations to justify 6 subtasks but not so many it becomes unwieldy
- Read-only operations (queries) before write operations (mutations) when possible
- Simpler operations before complex ones

---

## STEP 4: Generate the INIT.md File

Create `tasks/{feature-name}/INIT.md` using this exact template structure. Fill in all sections based on the feature document and project exploration.

```markdown
# {Feature Title} — Feature Implementation Plan

## What Is This Feature?

{1-2 paragraph description of the feature, what it does, and who uses it.}

### Where It Lives

- **Route**: `{route path}`
- **Folder**: `{src/app/... folder path}`
- **Sidebar**: {Where it appears in navigation, if applicable}

### Core Data Flow

```
{ASCII diagram showing the data flow between operations.
Show the entry point, how IDs chain between operations,
and the overall query/mutation flow.}
```

{1-2 sentences explaining the critical linking data between operations.}

### GraphQL Operations ({N} total)

**Queries ({N}):**
| # | Operation | Input | Purpose |
|---|-----------|-------|---------|
| 1 | `{operation_name}` | `{input}` | {purpose} |

**Mutations ({N}):**
| # | Operation | Purpose |
|---|-----------|---------|
| 1 | `{operation_name}` | {purpose} |

{Note about mutation return types if relevant (e.g., "all return only `{ id }`")}

### Existing Assets

{List what already exists in the codebase for this feature. Use checkmarks.}
- {asset}: `{path}` {checkmark or note}

### What Does NOT Exist Yet

{List what needs to be created.}
- `{path}` — {description}

---

## Phases Overview

This feature is broken into **{N} phases**, each following the standard 6-subtask structure:

1. **GraphQL** — verify or create `.graphql` operation files, then lock
2. **Types** — create/verify TypeScript types
3. **Server Actions** — create server actions with validation and caching
4. **Redux** — decision (default: NO Redux)
5. **UI** — implement components and pages
6. **Performance** — loading states, caching, optimization

---

## Phase Map

| Phase | Name | Focus |
|-------|------|-------|
| 0 | Scope and Routes | Route setup, sidebar nav, GraphQL verification, cache tags |
{for each middle phase:}
| {N} | {Phase Name} | {Brief focus description} |
{final phase:}
| {N} | Polish and Final Integration | Loading states, error handling, responsiveness, production polish |

---

## Dependency Graph

```
PHASE 0  (Scope and Routes)
   |
   +------> PHASE 1  ({Phase 1 Name})
               |
               +------> PHASE 2  ({Phase 2 Name})
                           |
                           +------> PHASE {N}  (Polish and Final Integration)
                                        ^
                                        |
               +------------------------+
   +-----------------------------------------+
```

**In plain terms:**
- PHASE 0 -> prerequisite for ALL phases
{for each subsequent phase, list its dependencies}
- PHASE {N} -> depends on ALL previous phases (0, 1, ..., N-1)

---

## Execution Order

Phases MUST be executed sequentially in the following order:

```
PHASE 0 -> PHASE 1 -> ... -> PHASE {N}
```

Within each phase, subtasks MUST be executed in this fixed order:

```
1) GraphQL -> 2) Types -> 3) Server Actions -> 4) Redux -> 5) UI -> 6) Performance
```

**Do NOT skip ahead.** Each subtask depends on the previous one completing successfully. If a GraphQL query is missing, the entire phase stops until it is resolved.

---

## Follow-Up Checklist

Use this checklist to track completion. A phase is only done when ALL 6 subtasks within it are checked off.

{For each phase, generate:}
### PHASE {N} — {Phase Name}
- [ ] Subtask 1: GraphQL ({brief description of GraphQL work for this phase})
- [ ] Subtask 2: Types ({brief description of types work})
- [ ] Subtask 3: Server Actions ({brief description of server actions work})
- [ ] Subtask 4: Redux ({decision or brief description})
- [ ] Subtask 5: UI ({brief description of UI work})
- [ ] Subtask 6: Performance ({brief description of performance work})
- [ ] **PHASE {N} COMPLETE**

---

### FEATURE COMPLETE

When all {N} phases are checked off above, the {Feature Title} feature is production-ready.

**Final verification:**
- [ ] All {N} GraphQL operations work end-to-end
{Add 4-6 feature-specific verification items}
- [ ] No console errors or TypeScript warnings
```

---

## STEP 5: Generate Each PHASE File

For each phase, create `tasks/{feature-name}/PHASE_{N}_{Name_With_Underscores}.md` using this exact template structure:

```markdown
You are an expert Senior Full-Stack Engineer specialized in **Next.js 15 App Router**, **Server Actions**, **GraphQL integrations**, and **enterprise-grade dashboard systems**.
You strictly follow:
- The existing **folder structure**
- The project's **design system** (`design/design.json`)
- The established **server actions pattern**
- {Any feature-specific pattern references, e.g., "Existing vendor dashboard patterns (reuse `getVendorById` cache, follow branches/users page structure)"}

====================================================================
### PROJECT GOAL — {PHASE TITLE IN UPPERCASE}

{2-4 sentences describing what this phase builds. Include the route/location. Describe the specific operations and UI elements this phase covers.}

====================================================================
### DEPENDENCIES

- {List dependencies on previous phases, e.g., "Depends on: `PHASE_0_Scope_and_Routes.md`"}
- {Or "This phase is a prerequisite for all subsequent phases." for Phase 0}

====================================================================
### REQUIRED SUBTASKS (IN ORDER)

#### 1) GraphQL ({verify or lock or create})
{Detailed instructions for GraphQL work in this phase.}
- {List specific operations to verify/use}
- {Note any constraints like "Do NOT modify mutations"}
- {Mention codegen if relevant}

#### 2) Types ({create or verify or extend})
{Detailed instructions for TypeScript types work.}
- {List specific types to create}
- {Cache tag constants if Phase 0}
- {Enum mappings if needed}
- {Note: "Include UI-safe error types (never leak raw GraphQL error shapes)" where relevant}

#### 3) Server Actions ({create or verify or extend})
{Detailed instructions for server actions.}
{For each server action, specify:}
- **`{actionName}({ params })`**
  - Uses `{OPERATION_NAME}`
  - {Caching strategy}
  - {Cache tags to use}
  - {Return type}
  - {Validation requirements}

Requirements:
- All actions start with `"use server"`
- Use `getClient()` for GraphQL operations
- Follow error handling pattern: check for auth, permission, validation, not-found errors
- Import types from `@/__generated__/graphql`

#### 4) Redux (decision)
{One of:}
- **NO Redux** for this phase. {Explain what to use instead: URL searchParams, local component state, server actions}
{Or if Redux IS needed:}
- Create Redux slice at `{path}`. {Describe state shape, actions, selectors.}

#### 5) UI ({implement or implement routing & nav only})
{Detailed UI implementation instructions.}
{Describe each section/component to build:}

**{Section Name}:**
- {Component/layout description}
- {Data it displays}
- {Interactions it supports}

**Action Buttons / Modals:**
- {Describe each interactive element}

**Empty State:**
- {What to show when data is missing}

**Design:**
- Match existing dashboard design
- Responsive: cards stack on mobile
- Use existing UI components (`Card`, `Badge`, `Button`, `Dialog`, etc.)

#### 6) Performance ({baseline or polish})
{Detailed performance instructions.}
- {Caching strategy}
- {Loading states}
- {Revalidation after mutations}
- {Layout shift prevention}

====================================================================
### ACCEPTANCE CRITERIA

- {List 5-8 testable criteria that must be true when this phase is complete}
- {Include both functional and non-functional criteria}
- {End with design/quality criteria like "UI matches existing dashboard design quality"}
```

---

## STEP 6: Phase-Specific Rules

### Phase 0 (Scope and Routes) — Always includes:
- **GraphQL (verify or create)**: Ensure ALL operations for the entire feature have corresponding `.graphql` files in the frontend. Use this 5-step process:
  1. Check if `src/graphql/{feature}/queries.graphql` and `mutations.graphql` exist and contain all operations
  2. If missing or incomplete, consult the backend (read-only): `community-be/schema/schema.gql` for exact types/args/return shapes, resolver files (`community-be/src/{feature}/resolvers/admin-*.resolver.ts`) for operation names, entity files for available fields, DTO files for input fields. **Do NOT modify any files in `community-be/`.**
  3. Write the `.graphql` files following the established pattern (reference: `src/graphql/communityCategories/`). Queries select fields needed for views (paginated queries include `totalCount`, `totalPages`, `currentPage`, `hasNextPage`, `hasPreviousPage`). Mutations return minimal data (typically `{ id }`).
  4. Run `npm run codegen` and fix any schema mismatch errors
  5. Confirm `src/generated/graphql.ts` contains TypeScript types for all operations
  - List ALL operations for the feature (queries and mutations) with their inputs and return types
- **Types**: Create the type namespace directory. Define ALL cache tag constants for the entire feature. Define revalidation path constants.
- **Server Actions**: Verify existing patterns (params handling, client usage). Plan the actions directory.
- **Redux**: Make the decision for the entire feature (default: NO Redux). Document the alternative (URL searchParams, local state, server actions).
- **UI**: Add navigation entry (sidebar, tab, etc.). Create route skeleton with placeholder/empty state.
- **Performance**: Establish cache tag naming conventions. Plan data fetching strategy.
- **Acceptance Criteria**: GraphQL line should say "All N operations have `.graphql` files and codegen succeeds" (not just "verified to exist")

### Middle Phases — Each includes:
- **GraphQL**: Lock the specific operations used in this phase (not all operations, just this phase's).
- **Types**: Create/extend types specific to this phase's operations.
- **Server Actions**: Create the specific actions for this phase.
- **Redux**: Confirm the decision (usually "confirm NO Redux").
- **UI**: Build the actual UI components for this phase's functionality.
- **Performance**: Phase-specific caching, loading states, revalidation.

### Final Phase (Polish and Final Integration) — Always includes:
- **GraphQL**: Final end-to-end verification of ALL operations.
- **Types**: Ensure all error types are properly typed and UI-safe.
- **Server Actions**: Comprehensive error handling for edge cases.
- **Redux**: Final confirmation of the decision.
- **UI**: Skeletons, error boundaries, responsive layout, empty states, accessibility, design consistency.
- **Performance**: No redundant fetches, no refetch loops, optimistic updates, lazy loading.

---

## STEP 7: Non-Applicable Subtasks

If a subtask genuinely does not apply to a phase (e.g., no Redux needed), keep the subtask header but write:

```markdown
#### 4) Redux (decision)
- **NO Redux** for this phase.
- {Explain the alternative approach being used instead.}
```

NEVER remove a subtask. All 6 subtasks must appear in every phase file, in the same fixed order.

---

## STEP 8: Write All Files

1. Create the directory: `tasks/{feature-name}/`
2. Write `tasks/{feature-name}/INIT.md`
3. Write each `tasks/{feature-name}/PHASE_{N}_{Name}.md`
4. Confirm the number of files created and list them.

---

## STEP 9: Verify Output

After writing all files:

1. List the contents of `tasks/{feature-name}/`
2. Confirm INIT.md has all required sections
3. Confirm each PHASE file has the persona block, all 6 subtasks, section dividers (`====`), and acceptance criteria
4. Report the total number of phases and operations covered
