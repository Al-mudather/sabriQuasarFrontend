# Shifter Web - Claude Skills Library

Modular, reusable skills derived from the Shifter Web build doctrine. Each skill follows progressive disclosure: concise SKILL.md for navigation, detailed reference.md for procedures, examples.md for code, and templates/ for copy-paste snippets.

## 🎯 All Skills at a Glance

| Skill | When to Use | SKILL.md Lines |
|-------|-------------|----------------|
| [shifter-golden-path-router](#1-shifter-golden-path-router) | Start any new feature, need implementation sequence | 105 |
| [graphql-read-only-contract](#2-graphql-read-only-contract) | Review GraphQL operations, understand API contract | 110 |
| [types-and-transformers](#3-types-and-transformers) | Create domain types from GraphQL, transform data | 136 |
| [zod-validation](#4-zod-validation) | Validate user input, create input schemas | 109 |
| [server-actions-standard](#5-server-actions-standard) | Build backend logic, call GraphQL from server | 89 |
| [ui-server-components-first](#6-ui-server-components-first) | Create pages and components with Next.js | 124 |
| [i18n-next-intl-ar-first](#7-i18n-next-intl-ar-first) | Add translations, support Arabic RTL | 94 |
| [error-contract-and-codes](#8-error-contract-and-codes) | Handle errors with i18n messages | 128 |
| [security-cookies-and-persistence](#9-security-cookies-and-persistence) | Store auth tokens, encrypt sensitive data | 127 |
| [caching-and-data-freshness](#10-caching-and-data-freshness) | Configure fetch policies, optimize caching | 78 |

---

## 1. shifter-golden-path-router

**Purpose**: Orchestrate the complete feature build sequence and route to appropriate skills.

**When to use**:
- Starting any new feature from scratch
- Need to know which skill to use next
- Want to ensure all architectural layers are covered

**Trigger examples**:
- "Build a new wallet withdrawal feature"
- "Implement user profile editing"
- "What's the correct order to build this feature?"
- "I need to add a shifter network dashboard"

**What you get**:
- [SKILL.md](./shifter-golden-path-router/SKILL.md) - 8-phase golden path sequence
- [reference.md](./shifter-golden-path-router/reference.md) - 40-step detailed procedure, decision rules, acceptance checklist
- [examples.md](./shifter-golden-path-router/examples.md) - Complete walkthroughs (wallet feature, auth flow)

---

## 2. graphql-read-only-contract

**Purpose**: Review GraphQL operations to understand API contracts before implementation.

**When to use**:
- Always first step when building a feature
- Understanding what GraphQL query/mutation does
- Need to know what data backend provides

**Trigger examples**:
- "What GraphQL operations exist for wallet?"
- "Review the authentication mutations"
- "What does APP_myWallet return?"
- "Show me the GraphQL schema for branches"

**What you get**:
- [SKILL.md](./graphql-read-only-contract/SKILL.md) - Quick overview, non-negotiables (never modify GraphQL)
- [reference.md](./graphql-read-only-contract/reference.md) - 5-step review procedure, decision tables, gotchas
- [examples.md](./graphql-read-only-contract/examples.md) - Wallet, auth, complex queries, mutations
- [templates/](./graphql-read-only-contract/templates/) - Review template for documenting findings

---

## 3. types-and-transformers

**Purpose**: Implement the 3-layer type system and transform GraphQL types to domain types.

**When to use**:
- After reviewing GraphQL operations
- Need to create business logic types
- Transform string dates to Date objects
- Flatten nested GraphQL structures

**Trigger examples**:
- "Create domain types for wallet"
- "Transform GraphQL dates to Date objects"
- "Define types for the profile feature"
- "How do I flatten nested GraphQL data?"

**What you get**:
- [SKILL.md](./types-and-transformers/SKILL.md) - 3-layer type system diagram, quick start
- [reference.md](./types-and-transformers/reference.md) - Naming conventions, transformation patterns, decision tables
- [examples.md](./types-and-transformers/examples.md) - Wallet, shifter, component props, gotchas
- [templates/](./types-and-transformers/templates/) - 5 templates (domain types, result types, barrel exports, props, flattening)

---

## 4. zod-validation

**Purpose**: Implement input validation with Zod schemas and safeParse pattern.

**When to use**:
- Creating server actions that accept user input
- Need to validate form data
- Validating Saudi-specific formats (phone, IBAN, National ID)

**Trigger examples**:
- "Create validation for login inputs"
- "Add Zod schema for withdrawal form"
- "Validate Saudi phone number"
- "How do I validate password strength?"

**What you get**:
- [SKILL.md](./zod-validation/SKILL.md) - Quick reference for common patterns, safeParse pattern
- [reference.md](./zod-validation/reference.md) - All validation patterns, Saudi-specific validators, advanced schemas
- [examples.md](./zod-validation/examples.md) - Auth, wallet, profile, complex validation, testing
- [templates/](./zod-validation/templates/) - 30+ reusable validators, schema templates, server action templates

---

## 5. server-actions-standard

**Purpose**: Implement the 7-step server action pattern for all backend logic.

**When to use**:
- Building backend logic for features
- Calling GraphQL queries or mutations
- Need to fetch or mutate data server-side

**Trigger examples**:
- "Create a server action to get wallet data"
- "Implement login server action"
- "Build server action for withdrawals"
- "How do I call GraphQL from server?"

**What you get**:
- [SKILL.md](./server-actions-standard/SKILL.md) - 7-step pattern overview, fetch policies table
- [reference.md](./server-actions-standard/reference.md) - Detailed breakdown of all 7 steps, error handling, logging
- [examples.md](./server-actions-standard/examples.md) - Query, mutation, cache revalidation, variations
- [templates/](./server-actions-standard/templates/) - 4 templates (complete 7-step, query, mutation, auth)

---

## 6. ui-server-components-first

**Purpose**: Build UI with server components first, then client islands for interactivity.

**When to use**:
- Creating new pages or routes
- Building UI components
- Need to add interactivity to pages

**Trigger examples**:
- "Create a page for the wallet feature"
- "Build the profile page UI"
- "How do I structure server and client components?"
- "Add a form to the dashboard"

**What you get**:
- [SKILL.md](./ui-server-components-first/SKILL.md) - Server-first approach, quick start
- [reference.md](./ui-server-components-first/reference.md) - 5-step procedure, naming conventions, troubleshooting
- [examples.md](./ui-server-components-first/examples.md) - Wallet page, forms, lists, auth flow
- [templates/](./ui-server-components-first/templates/) - 6 templates (page, client, loading, error, form, README)

---

## 7. i18n-next-intl-ar-first

**Purpose**: Implement internationalization with Arabic and English, RTL support.

**When to use**:
- Adding any user-facing text or labels
- Displaying error messages
- Creating forms with placeholders
- Need RTL (right-to-left) support

**Trigger examples**:
- "Add translations for the wallet page"
- "Implement RTL support for Arabic"
- "How do I display bilingual errors?"
- "Create translation keys for login"

**What you get**:
- [SKILL.md](./i18n-next-intl-ar-first/SKILL.md) - Domain-specific translation structure, RTL utilities
- [reference.md](./i18n-next-intl-ar-first/reference.md) - File structure, key naming, server vs client patterns
- [examples.md](./i18n-next-intl-ar-first/examples.md) - Login form, wallet card, validation, navigation
- [templates/](./i18n-next-intl-ar-first/templates/) - 4 templates + README (translation files, RTL components)

---

## 8. error-contract-and-codes

**Purpose**: Implement unified error handling with i18n messages and error codes.

**When to use**:
- Implementing error handling in server actions
- Need to return errors to UI
- Extracting GraphQL backend errors
- Displaying error messages to users

**Trigger examples**:
- "How do I handle errors in server actions?"
- "Display validation errors in the UI"
- "Extract GraphQL error messages"
- "What error codes should I use?"

**What you get**:
- [SKILL.md](./error-contract-and-codes/SKILL.md) - Core types (I18nMessage, ServerActionResult), quick start
- [reference.md](./error-contract-and-codes/reference.md) - Error codes table, detailed procedures, best practices
- [examples.md](./error-contract-and-codes/examples.md) - 8 complete examples (server actions, UI, toasts)
- [templates/](./error-contract-and-codes/templates/) - Server action templates, UI error components

---

## 9. security-cookies-and-persistence

**Purpose**: Implement secure auth with HTTP-only cookies and encrypted state.

**When to use**:
- Storing authentication tokens
- Persisting sensitive data (wallet, financial)
- Setting up auth cookies
- Handling security-critical operations

**Trigger examples**:
- "How do I store auth tokens securely?"
- "Set up HTTP-only cookies for login"
- "Encrypt wallet data in Redux"
- "Clear auth cookies on logout"

**What you get**:
- [SKILL.md](./security-cookies-and-persistence/SKILL.md) - Security checklist, quick start
- [reference.md](./security-cookies-and-persistence/reference.md) - Cookie configuration, encryption, decision tables, troubleshooting
- [examples.md](./security-cookies-and-persistence/examples.md) - Login, logout, middleware, Redux setup
- [templates/](./security-cookies-and-persistence/templates/) - 4 templates + README (cookies, persistence, middleware, slices)

---

## 10. caching-and-data-freshness

**Purpose**: Configure fetch policies for optimal data freshness and performance.

**When to use**:
- Deciding fetch policy for GraphQL operations
- Configuring cache behavior
- Balancing performance vs freshness
- Setting dynamic vs static rendering

**Trigger examples**:
- "What fetch policy for wallet data?"
- "Configure caching for profile queries"
- "Should this page be static or dynamic?"
- "How do I make data always fresh?"

**What you get**:
- [SKILL.md](./caching-and-data-freshness/SKILL.md) - Fetch policy decision table, quick reference
- [reference.md](./caching-and-data-freshness/reference.md) - Detailed policies, rendering modes, decision flow
- [examples.md](./caching-and-data-freshness/examples.md) - 7 complete examples covering all fetch policies

---

## 🚀 How to Use This Library

### Quick Start: Building a New Feature

When you say: **"Build a wallet withdrawal feature"**

1. **Start**: [shifter-golden-path-router](./shifter-golden-path-router/SKILL.md) → Get the implementation sequence
2. **Review**: [graphql-read-only-contract](./graphql-read-only-contract/SKILL.md) → Understand GraphQL operations
3. **Types**: [types-and-transformers](./types-and-transformers/SKILL.md) → Create domain types
4. **Validation**: [zod-validation](./zod-validation/SKILL.md) → Create input schemas
5. **Backend**: [server-actions-standard](./server-actions-standard/SKILL.md) → Build server action
6. **UI**: [ui-server-components-first](./ui-server-components-first/SKILL.md) → Create page and components
7. **i18n**: [i18n-next-intl-ar-first](./i18n-next-intl-ar-first/SKILL.md) → Add translations
8. **Errors**: [error-contract-and-codes](./error-contract-and-codes/SKILL.md) → Handle errors
9. **Cache**: [caching-and-data-freshness](./caching-and-data-freshness/SKILL.md) → Configure fetch policy

### For Specific Tasks

**"Add translations for X"** → [i18n-next-intl-ar-first](./i18n-next-intl-ar-first/SKILL.md)

**"Validate phone number"** → [zod-validation](./zod-validation/SKILL.md)

**"Handle authentication errors"** → [error-contract-and-codes](./error-contract-and-codes/SKILL.md)

**"Store auth token"** → [security-cookies-and-persistence](./security-cookies-and-persistence/SKILL.md)

**"What's in the GraphQL schema?"** → [graphql-read-only-contract](./graphql-read-only-contract/SKILL.md)

---

## 📁 Consistent Structure

Every skill follows this structure:

```
skill-name/
├── SKILL.md              # Navigational hub (under 150 lines)
│   ├── What this skill does
│   ├── When to use
│   ├── Non-negotiables
│   ├── Quick start
│   └── Links to deeper content
│
├── reference.md          # Detailed procedures, tables, checklists
│
├── examples.md           # Complete code examples
│
└── templates/            # Copy-paste ready code (optional)
    ├── README.md
    └── *.ts / *.tsx / *.md
```

**Progressive Disclosure**: Start with SKILL.md for quick orientation, dive into reference.md for details, copy from templates/ for implementation.

---

## 🔒 Universal Non-Negotiables

These rules apply across ALL skills:

1. **Never throw errors** in server actions → Always return error objects
2. **Never modify GraphQL** schema → Read-only contract with backend
3. **Always i18n errors** → Both English and Arabic messages
4. **Always validate inputs** → Use Zod safeParse pattern
5. **HTTP-only cookies for auth** → Never localStorage
6. **Check errors first** → Before null data in GraphQL responses
7. **Transform types** → GraphQL → Domain types (never use generated types in UI)
8. **Server components first** → Then client islands for interactivity

---

## 📊 Skill Statistics

- **Total Skills**: 10
- **Total SKILL.md Lines**: 1,100 (avg 110 per skill)
- **All SKILL.md files**: Under 150 lines ✅
- **Smallest**: caching-and-data-freshness (78 lines)
- **Largest**: types-and-transformers (136 lines)
- **Supporting Files**: 10 reference.md, 10 examples.md, 7 templates/ folders

---

## 🎯 Skill Relationships

```
shifter-golden-path-router (orchestrator)
    ↓
graphql-read-only-contract (always first)
    ↓
types-and-transformers + zod-validation (parallel)
    ↓
server-actions-standard
    ↓
ui-server-components-first + i18n-next-intl-ar-first (parallel)
    ↓
error-contract-and-codes (verify)
    ↓
security-cookies-and-persistence (if auth/sensitive data)
    +
caching-and-data-freshness (configure)
```

---

## 🆕 Recent Updates

**2025-01**: All skills refactored to follow progressive disclosure pattern
- SKILL.md files reduced to navigational hubs (under 150 lines each)
- Detailed content moved to reference.md (procedures, tables, checklists)
- Code examples extracted to examples.md (real-world scenarios)
- Templates organized in templates/ folders (copy-paste ready)
- Consistent structure across all 10 skills
- Working relative links throughout

---

**Shifter Web Skills Library v2.0**
*Modular, Progressive, Production-Ready*
*For use with Claude Code CLI*
