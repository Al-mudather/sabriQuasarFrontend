---
name: types-and-transformers
description: >
  Use when creating business logic types from GraphQL operations. Transform generated GraphQL types to domain types with Date objects, flattened structures, and proper TypeScript interfaces. Essential for type-safe server actions and components.
---

# Types and Transformers

## What This Skill Does

- Implements a 3-layer type system: GraphQL operations → Generated types → Domain types
- Transforms GraphQL generated types to business-friendly domain types
- Converts string dates to Date objects and flattens nested GraphQL structures
- Defines naming conventions for Props, Result, Input, and State types

## When to Use

Use this skill when:
- Creating business logic types from GraphQL operations
- Building server actions that need result types
- Defining component props interfaces
- Setting up the type layer for a new feature
- Need to transform string dates to Date objects or flatten nested objects

## Non-Negotiables

### MUST
- **MUST** create domain types that transform GraphQL generated types
- **MUST** write transformer functions for all type conversions
- **MUST** transform string dates to Date objects
- **MUST** use type suffixes (*Props, *Result, *Input, *State)
- **MUST** create result types with I18nMessage for errors

### NEVER
- **NEVER** use generated GraphQL types directly in UI components
- **NEVER** skip transformation layer between GraphQL and domain types
- **NEVER** return GraphQL types from server actions to clients
- **NEVER** modify `src/__generated__/graphql.ts` file
- **NEVER** create custom enums when GraphQL already provides them (use `CommunityCategoryStatusEnum`, `UserRoleEnum`, etc. directly from generated types)
- **NEVER** duplicate types that already exist in GraphQL schema

## Quick Start

1. **Create type directory**
   ```bash
   src/types/{domain}/
   ├── {domain}-types.ts    # Domain interfaces and transformers
   ├── validation.ts        # Zod schemas (see zod-validation skill)
   └── index.ts            # Barrel export
   ```

2. **Import generated types**
   ```typescript
   import type { AppMyWalletQuery } from "@/__generated__/graphql";
   type GraphQLWallet = NonNullable<AppMyWalletQuery['APP_myWallet']>;
   ```

3. **Define domain interface**
   ```typescript
   export interface WalletOverview {
     id: string;
     balance: number;
     createdAt: Date;  // Transformed from string
   }
   ```

4. **Create transformer function**
   ```typescript
   export function transformWallet(gql: GraphQLWallet): WalletOverview {
     return {
       id: gql.id,
       balance: gql.balance,
       createdAt: new Date(gql.createdAt),  // Transform string → Date
     };
   }
   ```

5. **Create result type**
   ```typescript
   export interface WalletResult {
     success: boolean;
     data?: WalletOverview;
     error?: I18nMessage;
     errorCode?: string;
   }
   ```

6. **Create barrel export**
   ```typescript
   // src/types/wallet/index.ts
   export type { WalletOverview, WalletResult } from "./wallet-types";
   export { transformWallet } from "./wallet-types";
   ```

7. **Use domain types in components**
   ```typescript
   import type { WalletOverview } from "@/types/wallet";
   // Use WalletOverview, not GraphQL types
   ```

## CRITICAL: Use GraphQL Enums, Never Create Custom Ones

**Rule**: If an enum exists in the GraphQL schema, you MUST use it directly. Never create a custom enum.

### ❌ WRONG - Creating Custom Enum
```typescript
// ❌ DON'T DO THIS
export enum CategoryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface CommunityCategory {
  status: CategoryStatus;  // ❌ Wrong!
}
```

### ✅ CORRECT - Use GraphQL Enum
```typescript
// ✅ DO THIS
import { CommunityCategoryStatusEnum } from '@/generated/graphql';

export interface CommunityCategory {
  status: CommunityCategoryStatusEnum;  // ✅ Correct!
}
```

### Why This Matters
1. **Single Source of Truth**: GraphQL schema is the source of truth
2. **Backend Compatibility**: Custom enums won't match backend enum values (e.g., missing 'ARCHIVED')
3. **Type Safety**: Using GraphQL enums ensures proper type checking
4. **Maintainability**: When backend adds new enum values, generated types auto-update

### How to Check
Before creating any enum:
1. Search `src/generated/graphql.ts` for the enum name (e.g., `CommunityCategoryStatusEnum`)
2. If it exists → Import and use it
3. If it doesn't exist → Verify with backend team first

### Common GraphQL Enums
```typescript
import {
  CommunityCategoryStatusEnum,  // DRAFT | PUBLISHED | ARCHIVED
  CommunityStatusEnum,          // ACTIVE | INACTIVE
  UserRoleEnum,                 // ADMIN | USER | MODERATOR
  SortOrder,                    // ASC | DESC
  // ... import enums from generated types, never create custom ones
} from '@/generated/graphql';
```

## The 3-Layer Type System

```
┌──────────────────────────────────────────────────────────┐
│ LAYER 1: GraphQL Operations (Read-Only Reference)       │
│ Location: src/graphql/*/queries.graphql                 │
│ Purpose: Understand API contract                        │
│ Action: READ ONLY - do not modify                       │
└──────────────────────────────────────────────────────────┘
              ↓ codegen (backend runs)
┌──────────────────────────────────────────────────────────┐
│ LAYER 2: Generated TypeScript Types                     │
│ Location: src/__generated__/graphql.ts                  │
│ Purpose: Auto-generated from GraphQL schema             │
│ Action: USE in server actions, do NOT edit              │
│ Types: *Query, *Mutation, *Variables, *Document         │
└──────────────────────────────────────────────────────────┘
              ↓ transform (YOU create this)
┌──────────────────────────────────────────────────────────┐
│ LAYER 3: Domain/Business Types (YOU CREATE)             │
│ Location: src/types/*/                                  │
│ Purpose: Business logic types for the application       │
│ Action: CREATE domain types + transformer functions     │
└──────────────────────────────────────────────────────────┘
```

**THIS IS NORMAL**: Creating domain types that transform GraphQL types is an expected pattern.

## Documentation

- [reference.md](./reference.md) - Detailed procedures, decision tables, and transformation patterns
- [examples.md](./examples.md) - Complete code examples and common gotchas
- [templates/](./templates/) - Copy-pastable templates for domain types

## Related Skills

- [zod-validation](../zod-validation/SKILL.md) - Create input validation schemas
- [graphql-read-only-contract](../graphql-read-only-contract/SKILL.md) - Understanding GraphQL operations
