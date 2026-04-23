# Types and Transformers - Reference

This document contains detailed procedures, decision tables, and transformation patterns for implementing the 3-layer type system.

## Table of Contents

- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Decision Rules](#decision-rules)
- [Step-by-Step Procedures](#step-by-step-procedures)
- [Common Transformation Patterns](#common-transformation-patterns)
- [Implementation Checklist](#implementation-checklist)
- [Standard Type Definitions](#standard-type-definitions)

## Naming Conventions

### Type Suffixes

Use these suffixes to clearly identify the purpose of each type:

| Suffix | Purpose | Example | Where Used |
|--------|---------|---------|------------|
| `*Props` | Component props | `WalletCardProps` | React components |
| `*Result` | Server action return type | `LoginResult`, `WalletResult` | Server actions |
| `*Input` | Server action parameter (from Zod) | `LoginInput`, `CreateWalletInput` | Server actions |
| `*Schema` | Zod validation schema | `LoginInputSchema` | Validation files |
| `*State` | Redux state slice | `WalletState`, `AuthState` | Redux slices |
| (no suffix) | Domain/business types | `Wallet`, `User`, `Transaction` | Business logic |

### File Naming

Structure your type directories consistently:

| File | Contains | Example |
|------|----------|---------|
| `{domain}-types.ts` | Domain interfaces + transformers | `wallet-types.ts`, `shifter-types.ts` |
| `validation.ts` | Zod schemas + input types | Validation schemas for server actions |
| `index.ts` | Barrel exports | Re-exports all public types and functions |

## File Organization

### Standard Type Directory Structure

```
src/types/{domain}/
├── {domain}-types.ts    # Domain interfaces and transformers
├── validation.ts        # Zod schemas (see zod-validation skill)
└── index.ts            # Barrel export
```

### Domain Types File Template

```typescript
// src/types/{domain}/{domain}-types.ts

import type { App{Operation}Query } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

// Extract GraphQL type
type GraphQL{Domain} = NonNullable<App{Operation}Query['APP_{operation}']>;

// Domain interface
export interface {Domain} {
  // ... fields
}

// Transformer function
export function transform{Domain}(gql: GraphQL{Domain}): {Domain} {
  // ... transformation logic
}

// Result type
export interface {Domain}Result {
  success: boolean;
  data?: {Domain};
  error?: I18nMessage;
  errorCode?: string;
}
```

## Decision Rules

### GraphQL Type Transformation Decision Table

Use this table to determine how to transform each GraphQL type:

| GraphQL Type | Transform To | Transformation Code | When to Use |
|--------------|--------------|---------------------|-------------|
| `string` (ISO date) | `Date` | `new Date(gql.createdAt)` | All date fields |
| `string` (enum) | `string` or union type | `type Status = "active" \| "inactive"` | When type safety needed |
| `string` (plain) | `string` | Direct copy | Regular text fields |
| `number` | `number` | Direct copy | Numeric fields |
| `boolean` | `boolean` | Direct copy | Boolean flags |
| Nested object | Flatten or keep nested | Depends on UI needs | When simplification helps UI |
| Nullable field (`T \| null`) | Optional property (`T?`) | `field: gql.field ?? undefined` | GraphQL nullable fields |
| Array | Array with transformed items | `items.map(transformItem)` | Collections |
| i18n message | `I18nMessage` type | `{ en: string, ar: string }` | User-facing messages |

### Nested Object Decision Table

| Scenario | Action | Reason |
|----------|--------|--------|
| Nested object used in single component | Keep nested | Maintains structure |
| Nested object fields used separately in UI | Flatten | Simplifies component props |
| Deep nesting (3+ levels) | Flatten or create intermediate types | Improves maintainability |
| GraphQL edge/node pattern | Extract node, discard edge metadata | Simplifies UI data |

## Step-by-Step Procedures

### Procedure 1: Creating a New Domain Type

1. **Create type directory**
   ```bash
   mkdir -p src/types/{domain}
   ```

2. **Create domain types file**
   ```bash
   touch src/types/{domain}/{domain}-types.ts
   ```

3. **Import generated GraphQL types**
   ```typescript
   import type { App{Operation}Query } from "@/__generated__/graphql";
   ```

4. **Extract the GraphQL type with null handling**
   ```typescript
   type GraphQL{Domain} = NonNullable<App{Operation}Query['APP_{operation}']>;
   ```

5. **Define domain interface with JSDoc**
   ```typescript
   /**
    * Domain type for {Domain} - transformed from GraphQL response
    *
    * Transformations:
    * - createdAt: string → Date (parse ISO string)
    * - Add other transformations as needed
    */
   export interface {Domain} {
     // ... fields
   }
   ```

6. **Create transformer function**
   ```typescript
   /**
    * Transforms GraphQL {domain} data to domain type
    */
   export function transform{Domain}(gql: GraphQL{Domain}): {Domain} {
     return {
       // ... transformation logic
     };
   }
   ```

7. **Create result type**
   ```typescript
   export interface {Domain}Result {
     success: boolean;
     data?: {Domain};
     error?: I18nMessage;
     errorCode?: string;
   }
   ```

8. **Create barrel export**
   ```typescript
   // src/types/{domain}/index.ts
   export type { {Domain}, {Domain}Result } from "./{domain}-types";
   export { transform{Domain} } from "./{domain}-types";
   ```

### Procedure 2: Flattening Nested GraphQL Objects

When GraphQL returns deeply nested structures, flatten them for easier UI consumption:

1. **Identify nested structure in GraphQL type**
   ```typescript
   type GraphQLShifter = {
     id: string;
     user: {
       id: string;
       fullName: string;
     };
     community: {
       id: string;
       name: string;
     };
   };
   ```

2. **Define flattened domain interface**
   ```typescript
   interface ShifterDetails {
     id: string;
     userId: string;
     userName: string;
     communityId: string;
     communityName: string;
   }
   ```

3. **Create transformer that flattens**
   ```typescript
   function transformShifter(gql: GraphQLShifter): ShifterDetails {
     return {
       id: gql.id,
       userId: gql.user.id,
       userName: gql.user.fullName,
       communityId: gql.community.id,
       communityName: gql.community.name,
     };
   }
   ```

### Procedure 3: Transforming Arrays

When GraphQL returns arrays, transform each item:

1. **Define single item transformer**
   ```typescript
   function transformTransaction(gql: GraphQLTransaction): Transaction {
     return {
       id: gql.id,
       amount: gql.amount,
       createdAt: new Date(gql.createdAt),
     };
   }
   ```

2. **Use map to transform array**
   ```typescript
   function transformWallet(gql: GraphQLWallet): Wallet {
     return {
       id: gql.id,
       transactions: gql.transactions.map(transformTransaction),
     };
   }
   ```

## Common Transformation Patterns

### Pattern 1: Date Transformation

**GraphQL Type:**
```typescript
type GraphQLData = {
  createdAt: string;  // ISO 8601 string
  updatedAt: string;
};
```

**Domain Type:**
```typescript
interface DomainData {
  createdAt: Date;
  updatedAt: Date;
}
```

**Transformer:**
```typescript
function transform(gql: GraphQLData): DomainData {
  return {
    createdAt: new Date(gql.createdAt),
    updatedAt: new Date(gql.updatedAt),
  };
}
```

### Pattern 2: Flattening Nested Objects

**GraphQL Type:**
```typescript
type GraphQLShifter = {
  id: string;
  user: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  community: {
    id: string;
    name: string;
  };
};
```

**Domain Type:**
```typescript
interface ShifterDetails {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  communityId: string;
  communityName: string;
}
```

**Transformer:**
```typescript
function transformShifter(gql: GraphQLShifter): ShifterDetails {
  return {
    id: gql.id,
    userId: gql.user.id,
    userName: gql.user.fullName,
    userPhone: gql.user.phoneNumber,
    communityId: gql.community.id,
    communityName: gql.community.name,
  };
}
```

### Pattern 3: Array Transformation

**GraphQL Type:**
```typescript
type GraphQLWallet = {
  transactions: Array<{
    id: string;
    amount: number;
    createdAt: string;
  }>;
};
```

**Domain Type:**
```typescript
interface WalletWithTransactions {
  transactions: Array<{
    id: string;
    amount: number;
    createdAt: Date;
  }>;
}
```

**Transformer:**
```typescript
function transformWallet(gql: GraphQLWallet): WalletWithTransactions {
  return {
    transactions: gql.transactions.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      createdAt: new Date(tx.createdAt),
    })),
  };
}
```

### Pattern 4: Handling Nullability

**GraphQL Type:**
```typescript
type GraphQLProfile = {
  id: string;
  email?: string | null;
  avatar?: string | null;
};
```

**Domain Type:**
```typescript
interface Profile {
  id: string;
  email?: string;
  avatar?: string;
}
```

**Transformer:**
```typescript
function transformProfile(gql: GraphQLProfile): Profile {
  return {
    id: gql.id,
    email: gql.email ?? undefined,
    avatar: gql.avatar ?? undefined,
  };
}
```

### Pattern 5: Enum Transformation

**GraphQL Type:**
```typescript
type GraphQLUser = {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};
```

**Domain Type:**
```typescript
type UserStatus = "active" | "inactive" | "suspended";

interface User {
  status: UserStatus;
}
```

**Transformer:**
```typescript
function transformUser(gql: GraphQLUser): User {
  return {
    status: gql.status.toLowerCase() as UserStatus,
  };
}
```

## Implementation Checklist

Use this checklist when creating new domain types:

- [ ] Created `src/types/{domain}/` directory
- [ ] Imported generated types from `__generated__/graphql.ts`
- [ ] Created domain interfaces with proper transformations
- [ ] Created transformer functions for each domain type
- [ ] Transformed all string dates to Date objects
- [ ] Handled nested objects (flatten or keep based on needs)
- [ ] Handled nullable fields properly (null → undefined)
- [ ] Created result type interfaces with I18nMessage
- [ ] Used proper naming conventions (*Props, *Result, *Input)
- [ ] Created barrel export in `index.ts`
- [ ] Added JSDoc comments for complex types
- [ ] Verified types are not exported from `__generated__/graphql.ts` to UI

## Standard Type Definitions

### I18nMessage Type

Always use for user-facing messages to support internationalization:

```typescript
export interface I18nMessage {
  en: string;
  ar: string;
}
```

### ServerActionResult Type

Standard result wrapper for all server actions:

```typescript
export interface ServerActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: I18nMessage;
  errorCode?: string;
  errorDetails?: {
    fields?: Record<string, string[]>;
    requiresRedirect?: boolean;
    redirectTo?: string;
  };
}
```

### Pagination Types

For list operations with pagination:

```typescript
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalPages: number;
}

export interface PaginatedResult<T> {
  success: boolean;
  data?: T[];
  pagination?: PaginationInfo;
  error?: I18nMessage;
  errorCode?: string;
}
```

## Best Practices

### DO

- **DO** create separate domain types even if they're similar to GraphQL types
- **DO** add JSDoc comments explaining transformations
- **DO** use `NonNullable<>` utility type for GraphQL nullable fields
- **DO** co-locate types with their transformers
- **DO** create barrel exports for clean imports
- **DO** transform dates consistently to Date objects

### DON'T

- **DON'T** skip the transformation layer to save time
- **DON'T** use spread operator without explicit date transformations
- **DON'T** export GraphQL types to client components
- **DON'T** create types without corresponding transformers
- **DON'T** forget to handle null/undefined edge cases
