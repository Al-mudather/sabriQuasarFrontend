# Type Templates

This directory contains copy-pastable templates for creating domain types and transformers.

## Available Templates

### 1. domain-type-template.ts
**Use for:** Creating a complete domain type file with transformer functions.

**Includes:**
- GraphQL type extraction with nullability handling
- Domain interface with JSDoc
- Transformer function
- Single item result type
- List result type with pagination

**When to use:** Starting a new domain type from scratch.

### 2. result-type-template.ts
**Use for:** Creating result types for server actions.

**Includes:**
- Single item result type
- List result type with pagination
- Mutation result type

**When to use:** Need to add result types to existing domain types.

### 3. barrel-export-template.ts
**Use for:** Creating index.ts barrel exports.

**Includes:**
- Type exports
- Function exports
- Input type exports
- Schema exports

**When to use:** Setting up the public API for a type directory.

### 4. component-props-template.ts
**Use for:** Creating component props interfaces.

**Includes:**
- Props interface with domain types
- Callback handlers
- State props (loading, error)
- Styling props
- Example component usage

**When to use:** Creating new components that consume domain types.

### 5. flattening-template.ts
**Use for:** Flattening deeply nested GraphQL structures.

**Includes:**
- Fully flattened version
- Selectively flattened version
- Examples of nested-to-flat transformations

**When to use:** GraphQL returns deep nesting that's awkward for UI.

## How to Use Templates

1. **Copy the template file**
2. **Find and replace placeholders:**
   - `{Domain}` → Your domain name (e.g., `Wallet`, `Shifter`, `Transaction`)
   - `{domain}` → Lowercase domain name (e.g., `wallet`, `shifter`, `transaction`)
   - `{Operation}` → GraphQL operation name (e.g., `MyWallet`, `ShifterDetails`)
   - `{operation}` → Lowercase operation (e.g., `myWallet`, `shifterDetails`)
   - `{Component}` → Component name (e.g., `WalletCard`, `ShifterDetails`)
3. **Customize fields** to match your GraphQL schema
4. **Add/remove** sections based on your needs
5. **Update JSDoc** comments to describe your specific transformations

## Example Replacements

### For Wallet Domain

```
{Domain} → Wallet
{domain} → wallet
{Operation} → MyWallet
{operation} → myWallet
{Component} → WalletCard
```

### For Shifter Domain

```
{Domain} → Shifter
{domain} → shifter
{Operation} → ShifterDetails
{operation} → shifterDetails
{Component} → ShifterDetailsCard
```

### For Transaction Domain

```
{Domain} → Transaction
{domain} → transaction
{Operation} → TransactionHistory
{operation} → transactionHistory
{Component} → TransactionList
```
