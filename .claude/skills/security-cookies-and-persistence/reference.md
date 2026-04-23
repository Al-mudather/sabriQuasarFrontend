# Security: Cookies and Persistence - Reference Guide

Complete reference for secure authentication cookies and encrypted Redux persistence.

## Table of Contents

- [Auth Cookie Configuration](#auth-cookie-configuration)
- [Redux Persistence with Encryption](#redux-persistence-with-encryption)
- [Header Forwarding](#header-forwarding)
- [Decision Tables](#decision-tables)
- [Common Gotchas](#common-gotchas)

## Auth Cookie Configuration

### Setting Auth Cookies

Use this pattern when users successfully authenticate (login, registration, OTP verification):

```typescript
import { cookies } from "next/headers";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies();

  // Primary auth token - HTTP-only (secure)
  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,                          // 🔒 CRITICAL - No JS access
    secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
    sameSite: "lax",                        // 🔒 CRITICAL - CSRF protection
    maxAge: 60 * 60 * 24 * 7,              // 7 days
    path: "/",                              // Available site-wide
  });

  // Secondary status cookie - readable by client
  cookieStore.set("is_authenticated", "true", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    // Note: NOT httpOnly - client can read this one for UI state
  });
}
```

#### Cookie Options Explained

| Option | Value | Purpose | Required |
|--------|-------|---------|----------|
| `httpOnly` | `true` | Prevents JavaScript access to token (XSS protection) | **Yes** (for ACCESS_TOKEN) |
| `secure` | `true` (prod) | Only send over HTTPS (man-in-the-middle protection) | **Yes** |
| `sameSite` | `"lax"` | CSRF protection (blocks cross-site requests) | **Yes** |
| `maxAge` | `604800` (7 days) | Cookie lifetime in seconds | Recommended |
| `path` | `"/"` | Cookie available on all routes | Recommended |

### Reading Auth Cookies

Server-side only (server actions, API routes, middleware):

```typescript
import { cookies } from "next/headers";

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN)?.value;
}
```

In middleware (synchronous):

```typescript
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("ACCESS_TOKEN")?.value;
  // ... use token for auth checks
}
```

### Deleting Auth Cookies

Use during logout or when auth becomes invalid:

```typescript
import { cookies } from "next/headers";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  // Delete both auth cookies
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete("is_authenticated");
}
```

## Redux Persistence with Encryption

### Persistence Configuration

Location: `src/lib/redux/persistConfig.ts`

```typescript
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage"; // localStorage

// Create encryption transform
const encryptTransform = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPT_KEY || "fallback-key",
  onError: (error) => {
    console.error("Encryption error:", error);
  },
});

// Configure persistence with encryption
const persistConfig = {
  key: "root",                      // Storage key
  storage,                          // Use localStorage
  whitelist: ["wallet"],            // Only persist these slices
  transforms: [encryptTransform],   // Apply encryption
};

export default persistConfig;
```

### Environment Variables

Add to `.env.local`:

```bash
# Redux encryption key - use a strong random string in production
NEXT_PUBLIC_REDUX_ENCRYPT_KEY=your-secure-random-key-here
```

**Important**: Generate a strong key for production using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Encryption Transform Options

| Option | Type | Purpose | Required |
|--------|------|---------|----------|
| `secretKey` | `string` | Encryption key (use env var) | **Yes** |
| `onError` | `function` | Error handler for encryption failures | Recommended |
| `encryptor` | `object` | Custom encryption implementation | Optional |

### Which Slices to Persist and Encrypt

Configure the `whitelist` array based on data sensitivity:

```typescript
const persistConfig = {
  // ...
  whitelist: [
    "wallet",      // ✅ Encrypt - financial data
    "commission",  // ✅ Encrypt - earnings data
    // Don't include: auth (use cookies), ui (not sensitive)
  ],
};
```

## Header Forwarding

### Allow List (Forward These Headers)

Forward these headers to the GraphQL server for security and tracking:

```typescript
const FORWARD_HEADERS = [
  "x-forwarded-for",  // Client IP address (for rate limiting, security)
  "user-agent",       // Browser/device info (for security, analytics)
  "referer",          // Originating page (for tracking)
];
```

### Block List (NEVER Forward)

Never forward these headers (security risk):

```typescript
const BLOCK_HEADERS = [
  "accept",          // Can leak information
  "authorization",   // Security risk (use cookies instead)
  "cookie",          // Don't forward raw cookies
  "host",            // Can cause routing issues
];
```

### Implementation in Apollo Client

```typescript
import { cookies } from "next/headers";

export async function getClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;

  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    headers: {
      // Forward auth token from cookie
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      // Forward allowed headers from request
      "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
      "user-agent": request.headers.get("user-agent") || "",
    },
  });
}
```

## Decision Tables

### When to Encrypt Redux State

| Data Type | Encrypt? | Reason |
|-----------|----------|--------|
| Wallet balance | ✅ **Yes** | Financial information (PCI/PII) |
| Transaction history | ✅ **Yes** | Sensitive user financial data |
| Commission earnings | ✅ **Yes** | Financial information |
| User profile data | ⚠️ **Maybe** | Depends on what's included (address, phone, etc.) |
| UI preferences | ❌ **No** | Not sensitive, no security risk |
| Theme settings | ❌ **No** | Not sensitive |
| Auth token | ❌ **NEVER** | Use HTTP-only cookies instead |
| Session data | ❌ **NEVER** | Use HTTP-only cookies instead |

### Cookie vs. localStorage Decision

| Scenario | Use Cookies | Use localStorage | Use Encrypted Redux |
|----------|-------------|------------------|---------------------|
| Auth tokens | ✅ HTTP-only cookie | ❌ Never | ❌ Never |
| Session ID | ✅ HTTP-only cookie | ❌ Never | ❌ Never |
| User preferences | Optional | ✅ Yes | ❌ No (not sensitive) |
| Wallet balance | ❌ No | ❌ No | ✅ Encrypted Redux |
| UI theme | ❌ No | ✅ Yes | Optional |
| Language setting | ✅ Cookie (for SSR) | ✅ Also fine | ❌ Overkill |

### Cookie Flags by Environment

| Flag | Development | Production | Reason |
|------|-------------|------------|--------|
| `httpOnly` | `true` | `true` | Always protect from XSS |
| `secure` | `false` | `true` | HTTPS required in prod |
| `sameSite` | `"lax"` | `"lax"` | Always protect from CSRF |
| `maxAge` | `604800` | `604800` | 7 days is standard |
| `path` | `"/"` | `"/"` | Available site-wide |

## Common Gotchas

### Gotcha 1: Storing Tokens in localStorage

**Problem**: Tokens in localStorage are accessible to any JavaScript, including malicious scripts (XSS attacks).

❌ **WRONG**:
```typescript
// NEVER do this - tokens accessible to JavaScript/XSS
localStorage.setItem("token", accessToken);
sessionStorage.setItem("token", accessToken);
```

✅ **CORRECT**:
```typescript
// Use HTTP-only cookies - not accessible to JavaScript
const cookieStore = await cookies();
cookieStore.set(ACCESS_TOKEN, accessToken, {
  httpOnly: true,  // Protected from XSS
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

### Gotcha 2: Forgetting the Secure Flag in Production

**Problem**: Without `secure: true`, cookies can be transmitted over HTTP, vulnerable to man-in-the-middle attacks.

❌ **WRONG**:
```typescript
cookieStore.set(ACCESS_TOKEN, accessToken, {
  httpOnly: true,
  // Missing secure flag - sent over HTTP in production!
});
```

✅ **CORRECT**:
```typescript
cookieStore.set(ACCESS_TOKEN, accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
  sameSite: "lax",
});
```

### Gotcha 3: Missing sameSite Protection

**Problem**: Without `sameSite`, cookies can be sent with cross-site requests (CSRF attacks).

❌ **WRONG**:
```typescript
cookieStore.set(ACCESS_TOKEN, accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Missing sameSite - vulnerable to CSRF!
});
```

✅ **CORRECT**:
```typescript
cookieStore.set(ACCESS_TOKEN, accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",  // Blocks most CSRF attacks
});
```

### Gotcha 4: Not Encrypting Sensitive Redux State

**Problem**: Financial data stored in plain text in localStorage can be read/modified by malicious scripts or browser extensions.

❌ **WRONG**:
```typescript
// Wallet balance stored in plain text in localStorage
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet"],  // No encryption transform!
};
```

✅ **CORRECT**:
```typescript
// Encrypt financial data before storing
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["wallet"],
  transforms: [encryptTransform],  // Encrypted before localStorage
};
```

### Gotcha 5: Storing Auth Tokens in Redux

**Problem**: Redux state (even encrypted) is still accessible to JavaScript. Auth tokens should never be in client-side state.

❌ **WRONG**:
```typescript
// NEVER store tokens in Redux, even encrypted
const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,  // ❌ WRONG
  },
  // ...
});
```

✅ **CORRECT**:
```typescript
// Auth tokens only in HTTP-only cookies (server-side)
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,  // ✅ Just status, not token
    user: null,              // ✅ User info is fine
  },
  // ...
});
```

### Gotcha 6: Forgetting to Clear Cookies on Logout

**Problem**: Old cookies remain active, allowing continued access after logout.

❌ **WRONG**:
```typescript
export async function logoutUser() {
  // Only clear Redux state, cookies still active!
  dispatch(clearAuth());
  redirect("/login");
}
```

✅ **CORRECT**:
```typescript
export async function logoutUser() {
  const cookieStore = await cookies();

  // Clear all auth cookies
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete("is_authenticated");

  // Then clear Redux state
  dispatch(clearAuth());
  redirect("/login");
}
```

## Troubleshooting

### Issue: Cookies Not Being Set

**Symptoms**: Login succeeds but cookies don't appear in browser.

**Possible Causes**:
1. Not using `await cookies()` (Next.js 15+)
2. Wrong cookie name
3. Path mismatch
4. Secure flag in development without HTTPS

**Solution**:
```typescript
// Ensure async/await
const cookieStore = await cookies();

// Use correct name constant
const ACCESS_TOKEN = "ACCESS_TOKEN";

// Check environment
cookieStore.set(ACCESS_TOKEN, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false in dev
  sameSite: "lax",
  path: "/",
});
```

### Issue: Encrypted Redux State Not Loading

**Symptoms**: App crashes or state is empty on reload.

**Possible Causes**:
1. Encryption key changed
2. Corrupted localStorage data
3. Missing encryption transform

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Verify encryption key in `.env.local`
3. Check persistConfig includes transforms

### Issue: Auth Token Not Being Read in Middleware

**Symptoms**: Protected routes redirect to login even when authenticated.

**Possible Causes**:
1. Wrong cookie name
2. Cookie expired
3. Middleware not matching routes

**Solution**:
```typescript
// Verify cookie name matches
const accessToken = request.cookies.get("ACCESS_TOKEN")?.value;

// Check cookie expiry
console.log("Token exists:", !!accessToken);

// Verify middleware matcher
export const config = {
  matcher: ["/dashboard/:path*", "/wallet/:path*"],
};
```

## Best Practices Summary

1. **Always use HTTP-only cookies for auth tokens** - Never localStorage/sessionStorage
2. **Encrypt sensitive Redux state** - Use redux-persist-transform-encrypt for financial data
3. **Use environment variables for encryption keys** - Never hardcode secrets
4. **Set all security flags on cookies** - httpOnly, secure (prod), sameSite
5. **Clear all auth cookies on logout** - Prevent stale sessions
6. **Never store tokens in Redux** - Even encrypted, they shouldn't be in client state
7. **Forward only necessary headers** - Use allow/block lists for header forwarding
8. **Test in both dev and production modes** - Secure flag behaves differently
