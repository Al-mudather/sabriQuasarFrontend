# Types and Transformers - Examples

This document contains complete code examples and common gotchas when implementing the 3-layer type system.

## Table of Contents

- [Complete Examples](#complete-examples)
- [Common Gotchas](#common-gotchas)
- [Real-World Scenarios](#real-world-scenarios)

## Complete Examples

### Example 1: Simple Wallet Type

This example shows a basic domain type with date transformations.

```typescript
// src/types/wallet/wallet-types.ts

import type { AppMyWalletQuery } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

/**
 * Extract the GraphQL wallet type (handle nullability)
 */
type GraphQLWallet = NonNullable<AppMyWalletQuery['APP_myWallet']>;

/**
 * Domain type for Wallet - transformed from GraphQL response
 *
 * Transformations:
 * - createdAt: string → Date (parse ISO string)
 * - updatedAt: string → Date (parse ISO string)
 */
export interface WalletOverview {
  id: string;
  balance: number;
  currency: string;
  creditLimit: number;
  availableBalance: number;
  totalCashback: number;
  pendingCashback: number;
  createdAt: Date;      // Transformed from string
  updatedAt: Date;      // Transformed from string
}

/**
 * Transforms GraphQL wallet data to domain type
 *
 * @param gql - GraphQL response data
 * @returns Transformed wallet object with Date fields
 */
export function transformWallet(gql: GraphQLWallet): WalletOverview {
  return {
    id: gql.id,
    balance: gql.balance,
    currency: gql.currency,
    creditLimit: gql.creditLimit,
    availableBalance: gql.availableBalance,
    totalCashback: gql.totalCashback,
    pendingCashback: gql.pendingCashback,
    createdAt: new Date(gql.createdAt),  // Transform string → Date
    updatedAt: new Date(gql.updatedAt),  // Transform string → Date
  };
}

/**
 * Standard result type for wallet server actions
 */
export interface WalletResult {
  success: boolean;
  data?: WalletOverview;
  error?: I18nMessage;
  errorCode?: string;
}
```

```typescript
// src/types/wallet/index.ts

export type {
  WalletOverview,
  WalletResult,
} from "./wallet-types";

export { transformWallet } from "./wallet-types";
```

**Usage in Server Action:**

```typescript
// src/actions/wallet/getMyWallet.ts

"use server";

import { requireAuth } from "@/lib/auth/authorization";
import { apolloClient } from "@/lib/apollo/ApolloClient";
import { APP_MY_WALLET } from "@/graphql/wallet/queries.graphql";
import { transformWallet } from "@/types/wallet";
import type { WalletResult } from "@/types/wallet";

export async function getMyWallet(): Promise<WalletResult> {
  const user = await requireAuth();

  const { data, errors } = await apolloClient.query({
    query: APP_MY_WALLET,
  });

  if (errors || !data?.APP_myWallet) {
    return {
      success: false,
      error: { en: "Failed to fetch wallet", ar: "فشل في جلب المحفظة" },
    };
  }

  return {
    success: true,
    data: transformWallet(data.APP_myWallet),
  };
}
```

### Example 2: Complex Shifter Type with Nesting

This example shows flattening nested GraphQL objects for easier UI consumption.

```typescript
// src/types/shifter/shifter-types.ts

import type { AppShifterDetailsQuery } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

/**
 * Extract GraphQL type
 */
type GraphQLShifterDetails = NonNullable<AppShifterDetailsQuery['APP_shifterDetails']>;

/**
 * Domain type for ShifterDetails - flattened from nested GraphQL structure
 *
 * Transformations:
 * - Flattened user object (user.id → userId, user.fullName → shifterName)
 * - Flattened community object (community.id → communityId, etc.)
 * - Flattened stats object (stats.directMembers → directMembers, etc.)
 * - joinedAt: string → Date
 * - status: enum string → union type
 */
export interface ShifterDetails {
  id: string;
  shifterName: string;
  shifterPhone: string;
  communityId: string;
  communityName: string;
  availableSlots: number;
  directMembers: number;
  totalNetwork: number;
  totalCommission: number;
  joinedAt: Date;
  status: ShifterStatus;
}

/**
 * Shifter status union type
 */
export type ShifterStatus = "active" | "inactive" | "suspended";

/**
 * Transforms GraphQL shifter details to flattened domain type
 *
 * @param gql - Nested GraphQL response data
 * @returns Flattened shifter details for easier UI consumption
 */
export function transformShifterDetails(gql: GraphQLShifterDetails): ShifterDetails {
  return {
    id: gql.id,
    shifterName: gql.shifter.fullName,
    shifterPhone: gql.shifter.phoneNumber,
    communityId: gql.community.id,
    communityName: gql.community.name,
    availableSlots: gql.community.availableSlots,
    directMembers: gql.stats.directMembers,
    totalNetwork: gql.stats.totalNetwork,
    totalCommission: gql.stats.totalCommission,
    joinedAt: new Date(gql.joinedAt),
    status: gql.status as ShifterStatus,
  };
}

/**
 * Result type for shifter details operations
 */
export interface ShifterDetailsResult {
  success: boolean;
  data?: ShifterDetails;
  error?: I18nMessage;
  errorCode?: string;
}
```

### Example 3: Component Props Type

This example shows using domain types in component props.

```typescript
// src/components/wallet/WalletCard.tsx

import type { WalletOverview } from "@/types/wallet";
import type { I18nMessage } from "@/types";

/**
 * Props for WalletCard component
 */
export interface WalletCardProps {
  wallet: WalletOverview;      // Domain type, not GraphQL type
  onRefresh?: () => void;
  error?: I18nMessage;
  loading?: boolean;
  className?: string;
}

/**
 * Displays wallet information with balance and transaction history
 */
export function WalletCard({
  wallet,
  onRefresh,
  error,
  loading,
  className
}: WalletCardProps) {
  // wallet.createdAt is Date object, not string
  const formattedDate = wallet.createdAt.toLocaleDateString();
  const daysSinceCreation = Math.floor(
    (Date.now() - wallet.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={className}>
      <h2>My Wallet</h2>
      <p>Balance: {wallet.balance} {wallet.currency}</p>
      <p>Available: {wallet.availableBalance} {wallet.currency}</p>
      <p>Total Cashback: {wallet.totalCashback} {wallet.currency}</p>
      <p>Created: {formattedDate} ({daysSinceCreation} days ago)</p>
      {error && <p className="error">{error.en}</p>}
      {onRefresh && <button onClick={onRefresh}>Refresh</button>}
    </div>
  );
}
```

### Example 4: List Type with Pagination

This example shows handling paginated list responses.

```typescript
// src/types/transaction/transaction-types.ts

import type { AppTransactionHistoryQuery } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

type GraphQLTransaction = NonNullable<
  AppTransactionHistoryQuery['APP_transactionHistory']['edges'][number]['node']
>;

/**
 * Domain type for Transaction
 */
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
}

export type TransactionType = "cashback" | "withdrawal" | "purchase" | "refund";
export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

/**
 * Transforms GraphQL transaction to domain type
 */
export function transformTransaction(gql: GraphQLTransaction): Transaction {
  return {
    id: gql.id,
    amount: gql.amount,
    currency: gql.currency,
    type: gql.type as TransactionType,
    status: gql.status as TransactionStatus,
    description: gql.description,
    createdAt: new Date(gql.createdAt),
  };
}

/**
 * Result type for transaction list with pagination
 */
export interface TransactionListResult {
  success: boolean;
  data?: Transaction[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
  error?: I18nMessage;
  errorCode?: string;
}
```

### Example 5: Handling Optional Fields

This example shows proper handling of nullable GraphQL fields.

```typescript
// src/types/profile/profile-types.ts

import type { AppUserProfileQuery } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

type GraphQLProfile = NonNullable<AppUserProfileQuery['APP_userProfile']>;

/**
 * Domain type for UserProfile with optional fields
 */
export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;           // Optional in GraphQL, optional here
  avatar?: string;          // Optional in GraphQL, optional here
  bio?: string;             // Optional in GraphQL, optional here
  dateOfBirth?: Date;       // Optional date field
  verifiedAt?: Date;        // Optional date field
  createdAt: Date;          // Required date field
}

/**
 * Transforms GraphQL profile to domain type
 * Converts null to undefined for optional fields
 */
export function transformUserProfile(gql: GraphQLProfile): UserProfile {
  return {
    id: gql.id,
    fullName: gql.fullName,
    phoneNumber: gql.phoneNumber,
    email: gql.email ?? undefined,
    avatar: gql.avatar ?? undefined,
    bio: gql.bio ?? undefined,
    dateOfBirth: gql.dateOfBirth ? new Date(gql.dateOfBirth) : undefined,
    verifiedAt: gql.verifiedAt ? new Date(gql.verifiedAt) : undefined,
    createdAt: new Date(gql.createdAt),
  };
}

/**
 * Result type for profile operations
 */
export interface UserProfileResult {
  success: boolean;
  data?: UserProfile;
  error?: I18nMessage;
  errorCode?: string;
}
```

## Common Gotchas

### Gotcha 1: Using GraphQL Types in UI

**Problem:** Using generated GraphQL types directly in components leads to string dates and unclear contracts.

❌ **WRONG:**
```typescript
import type { AppMyWalletQuery } from "@/__generated__/graphql";

// Using generated type directly
function WalletCard({ wallet }: { wallet: AppMyWalletQuery['APP_myWallet'] }) {
  // Type is nullable! Could be null
  const date = wallet.createdAt;  // string, not Date!
  const formatted = date.toLocaleDateString();  // ERROR: string has no toLocaleDateString
}
```

✅ **CORRECT:**
```typescript
import type { WalletOverview } from "@/types/wallet";

// Using domain type
function WalletCard({ wallet }: { wallet: WalletOverview }) {
  const date = wallet.createdAt;  // Date object ✓
  const formatted = date.toLocaleDateString();  // Works! ✓
}
```

### Gotcha 2: Forgetting to Transform Dates

**Problem:** Spreading GraphQL objects without explicit date transformations.

❌ **WRONG:**
```typescript
export function transformWallet(gql: GraphQLWallet): WalletOverview {
  return {
    ...gql,  // Direct spread - dates still strings!
  };
}

// Usage
const wallet = transformWallet(gqlData);
wallet.createdAt.toLocaleDateString();  // ERROR: string has no toLocaleDateString
```

✅ **CORRECT:**
```typescript
export function transformWallet(gql: GraphQLWallet): WalletOverview {
  return {
    ...gql,
    createdAt: new Date(gql.createdAt),  // Transform explicitly
    updatedAt: new Date(gql.updatedAt),  // Transform explicitly
  };
}

// Usage
const wallet = transformWallet(gqlData);
wallet.createdAt.toLocaleDateString();  // Works! ✓
```

### Gotcha 3: Not Handling Nullability

**Problem:** Not using `NonNullable<>` when extracting GraphQL types.

❌ **WRONG:**
```typescript
// Assuming non-null without checking
type GraphQLUser = AppUserQuery['APP_user'];  // Could be null!

export function transformUser(gql: GraphQLUser): User {
  return {
    id: gql.id,  // ERROR: gql could be null
    // ...
  };
}
```

✅ **CORRECT:**
```typescript
// Handle nullability explicitly
type GraphQLUser = NonNullable<AppUserQuery['APP_user']>;

export function transformUser(gql: GraphQLUser): User {
  return {
    id: gql.id,  // Works! gql is guaranteed non-null ✓
    // ...
  };
}
```

### Gotcha 4: Skipping Transformation Layer

**Problem:** Returning GraphQL types directly from server actions.

❌ **WRONG:**
```typescript
// src/actions/wallet/getMyWallet.ts

export async function getMyWallet() {
  const { data } = await apolloClient.query({
    query: APP_MY_WALLET,
  });

  return {
    success: true,
    data: data.APP_myWallet,  // Returning GraphQL type! ✗
  };
}

// Component
function WalletPage() {
  const wallet = await getMyWallet();
  // wallet.data.createdAt is string, not Date
}
```

✅ **CORRECT:**
```typescript
// src/actions/wallet/getMyWallet.ts

import { transformWallet } from "@/types/wallet";
import type { WalletResult } from "@/types/wallet";

export async function getMyWallet(): Promise<WalletResult> {
  const { data } = await apolloClient.query({
    query: APP_MY_WALLET,
  });

  return {
    success: true,
    data: transformWallet(data.APP_myWallet),  // Transform! ✓
  };
}

// Component
function WalletPage() {
  const wallet = await getMyWallet();
  // wallet.data.createdAt is Date object ✓
}
```

### Gotcha 5: Incorrect Array Transformation

**Problem:** Not mapping over array items to transform each one.

❌ **WRONG:**
```typescript
export function transformWallet(gql: GraphQLWallet): Wallet {
  return {
    id: gql.id,
    transactions: gql.transactions,  // Not transforming array items!
  };
}

// Usage
const wallet = transformWallet(gqlData);
wallet.transactions[0].createdAt.toLocaleDateString();  // ERROR: still string
```

✅ **CORRECT:**
```typescript
export function transformWallet(gql: GraphQLWallet): Wallet {
  return {
    id: gql.id,
    transactions: gql.transactions.map(tx => ({
      ...tx,
      createdAt: new Date(tx.createdAt),  // Transform each item ✓
    })),
  };
}

// Usage
const wallet = transformWallet(gqlData);
wallet.transactions[0].createdAt.toLocaleDateString();  // Works! ✓
```

### Gotcha 6: Mixing Naming Conventions

**Problem:** Inconsistent use of type suffixes.

❌ **WRONG:**
```typescript
// Inconsistent naming
export interface WalletProps { }        // Component props - correct suffix
export interface WalletData { }         // Should be Wallet or WalletOverview
export interface GetWalletResponse { }  // Should be WalletResult
export interface WalletInput { }        // Correct for server action input
```

✅ **CORRECT:**
```typescript
// Consistent naming
export interface WalletCardProps { }    // Component props
export interface WalletOverview { }     // Domain type (no suffix)
export interface WalletResult { }       // Server action result
export interface CreateWalletInput { }  // Server action input
```

## Real-World Scenarios

### Scenario 1: Multi-Level Nested Response

**GraphQL Response:**
```typescript
type GraphQLBranchDetails = {
  id: string;
  vendor: {
    id: string;
    businessName: string;
    owner: {
      id: string;
      fullName: string;
      phoneNumber: string;
    };
  };
  location: {
    id: string;
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
};
```

**Flattened Domain Type:**
```typescript
export interface BranchDetails {
  id: string;
  vendorId: string;
  vendorName: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export function transformBranchDetails(gql: GraphQLBranchDetails): BranchDetails {
  return {
    id: gql.id,
    vendorId: gql.vendor.id,
    vendorName: gql.vendor.businessName,
    ownerId: gql.vendor.owner.id,
    ownerName: gql.vendor.owner.fullName,
    ownerPhone: gql.vendor.owner.phoneNumber,
    address: gql.location.address,
    city: gql.location.city,
    latitude: gql.location.coordinates.latitude,
    longitude: gql.location.coordinates.longitude,
    createdAt: new Date(gql.createdAt),
  };
}
```

### Scenario 2: Conditional Transformations

**GraphQL Response:**
```typescript
type GraphQLCommission = {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID";
  paidAt?: string | null;
  approvedAt?: string | null;
};
```

**Domain Type with Conditional Dates:**
```typescript
export type CommissionStatus = "pending" | "approved" | "paid";

export interface Commission {
  id: string;
  amount: number;
  status: CommissionStatus;
  paidAt?: Date;
  approvedAt?: Date;
}

export function transformCommission(gql: GraphQLCommission): Commission {
  return {
    id: gql.id,
    amount: gql.amount,
    status: gql.status.toLowerCase() as CommissionStatus,
    paidAt: gql.paidAt ? new Date(gql.paidAt) : undefined,
    approvedAt: gql.approvedAt ? new Date(gql.approvedAt) : undefined,
  };
}
```

### Scenario 3: Computed Fields

**GraphQL Response:**
```typescript
type GraphQLWallet = {
  id: string;
  balance: number;
  creditLimit: number;
  pendingWithdrawals: number;
};
```

**Domain Type with Computed Field:**
```typescript
export interface WalletOverview {
  id: string;
  balance: number;
  creditLimit: number;
  pendingWithdrawals: number;
  availableBalance: number;  // Computed field
}

export function transformWallet(gql: GraphQLWallet): WalletOverview {
  return {
    id: gql.id,
    balance: gql.balance,
    creditLimit: gql.creditLimit,
    pendingWithdrawals: gql.pendingWithdrawals,
    // Compute available balance
    availableBalance: gql.balance - gql.pendingWithdrawals,
  };
}
```
