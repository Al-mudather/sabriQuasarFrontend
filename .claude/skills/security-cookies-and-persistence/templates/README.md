# Security Templates

Reusable code templates for secure authentication and data persistence.

## Available Templates

### 1. Auth Cookie Template
**File:** `auth-cookie-template.ts`

Utility functions for managing HTTP-only authentication cookies:
- `setAuthCookies()` - Set auth cookies after login
- `getAuthToken()` - Retrieve auth token from cookies
- `isAuthenticated()` - Check authentication status
- `clearAuthCookies()` - Clear cookies on logout
- `refreshAuthToken()` - Update token after refresh

**Use when:** Setting up authentication in your project

### 2. Redux Persist Config Template
**File:** `persist-config-template.ts`

Redux persistence configuration with encryption:
- Basic persist config with encryption
- Whitelist vs. blacklist approaches
- Migration configuration for version changes
- Encryption transform setup

**Use when:** Setting up Redux store with encrypted persistence

### 3. Middleware Template
**File:** `middleware-template.ts`

Next.js middleware for route protection:
- Basic authentication middleware
- Public/auth/protected route handling
- Return URL preservation
- Role-based access control example

**Use when:** Protecting routes based on authentication status

### 4. Wallet Slice Template
**File:** `wallet-slice-template.ts`

Complete Redux slice for sensitive financial data:
- Wallet state management
- Transaction handling
- Balance updates
- Comprehensive selectors
- Encryption-ready (when persisted)

**Use when:** Managing sensitive financial data in Redux

## How to Use

1. **Copy the template** to your project location
2. **Customize** constants and types to match your project
3. **Import and use** in your application

### Example: Using Auth Cookie Template

```typescript
// 1. Copy template to src/lib/auth/cookies.ts
// 2. Import in your login action:

import { setAuthCookies } from "@/lib/auth/cookies";

export async function loginUser(credentials: LoginInput) {
  const { accessToken } = await authenticateUser(credentials);
  await setAuthCookies(accessToken);
  return { success: true };
}
```

## Security Notes

All templates follow security best practices:
- HTTP-only cookies for auth tokens
- Encrypted Redux persistence for sensitive data
- CSRF protection with sameSite
- HTTPS enforcement in production
- No tokens in localStorage/sessionStorage

## Related Documentation

- [SKILL.md](../SKILL.md) - Quick start guide
- [reference.md](../reference.md) - Detailed reference
- [examples.md](../examples.md) - Complete examples
