---
name: security-cookies-and-persistence
description: >
  Use HTTP-only cookies for authentication tokens and encrypted Redux persistence for sensitive wallet data. Apply this skill when storing auth tokens, persisting financial data, or handling security-critical operations.
---

# Security: Cookies and Persistence

## What This Skill Does

- Sets up secure HTTP-only cookies for authentication tokens (no JavaScript access)
- Configures encrypted Redux persistence for sensitive wallet and financial data
- Implements proper header forwarding with allow/block lists
- Ensures CSRF protection and HTTPS-only transmission in production

## When to Use

Use this skill when you need to:
- Store authentication tokens securely
- Persist sensitive data (wallet balance, transactions, financial info)
- Set up or modify auth cookie configuration
- Configure Redux persistence with encryption
- Handle any security-critical data storage operations

## Non-Negotiables

### MUST
- **MUST** use HTTP-only cookies for auth tokens
- **MUST** encrypt sensitive Redux state (wallet data, financial info)
- **MUST** use `secure: true` flag in production for HTTPS-only
- **MUST** set `sameSite: "lax"` for CSRF protection
- **MUST** use proper header forwarding (allow/block lists)

### NEVER
- **NEVER** store auth tokens in localStorage or sessionStorage
- **NEVER** store sensitive data unencrypted in Redux
- **NEVER** expose auth tokens to client-side JavaScript
- **NEVER** skip the `httpOnly` flag for authentication cookies
- **NEVER** forward authorization headers (use cookies instead)

## Quick Start

### Setting Up Auth Cookies (Login)

1. Import Next.js cookies utility in your server action
2. Set the access token with HTTP-only, secure, and sameSite flags
3. Set a secondary `is_authenticated` cookie (non-HTTP-only) for client-side checking
4. Use 7-day maxAge for both cookies

```typescript
import { cookies } from "next/headers";

const cookieStore = await cookies();
cookieStore.set("ACCESS_TOKEN", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
});
```

### Reading Auth Cookies

Use `cookies().get()` to retrieve the token value:

```typescript
const cookieStore = await cookies();
const token = cookieStore.get("ACCESS_TOKEN")?.value;
```

### Clearing Auth Cookies (Logout)

Delete both auth cookies:

```typescript
const cookieStore = await cookies();
cookieStore.delete("ACCESS_TOKEN");
cookieStore.delete("is_authenticated");
```

### Encrypting Redux State

Configure persistence with encryption transform for sensitive slices (already set up in this project):

```typescript
import { encryptTransform } from "redux-persist-transform-encrypt";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet"], // Only persist wallet (encrypted)
  transforms: [encryptTransform], // Encrypt before storing
};
```

## Security Checklist

Quick verification before deploying:

**Auth Cookies:**
- [ ] `httpOnly: true` (no JS access)
- [ ] `secure: true` in production
- [ ] `sameSite: "lax"` set
- [ ] Never stored in localStorage/sessionStorage

**Redux Persistence:**
- [ ] Sensitive slices encrypted (wallet, financial)
- [ ] Encryption key from environment variable
- [ ] Auth tokens NEVER stored in Redux

**General:**
- [ ] Header forwarding configured
- [ ] Protected routes use middleware
- [ ] Logout clears all cookies

## Learn More

- **[Reference Guide](./reference.md)** - Detailed procedures, decision tables, and configuration details
- **[Examples](./examples.md)** - Complete code examples for login, logout, middleware, and encrypted state
- **[Templates](./templates/)** - Reusable code snippets for auth cookies and persistence config

## Related Skills

- [server-actions-standard](../server-actions-standard/SKILL.md) - Use auth cookies in server actions
- [error-contract-and-codes](../error-contract-and-codes/SKILL.md) - Handle authentication errors
- [ui-server-components-first](../ui-server-components-first/SKILL.md) - Protected pages and layouts
