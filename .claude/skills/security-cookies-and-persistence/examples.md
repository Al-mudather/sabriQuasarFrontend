# Security: Cookies and Persistence - Examples

Complete, production-ready code examples for secure authentication and data persistence.

## Table of Contents

- [Login Action with Cookie Setup](#login-action-with-cookie-setup)
- [Logout Action with Cookie Clearing](#logout-action-with-cookie-clearing)
- [Protected Route Middleware](#protected-route-middleware)
- [Encrypted Wallet State](#encrypted-wallet-state)
- [Auth Token Retrieval in Server Action](#auth-token-retrieval-in-server-action)
- [Complete Redux Store Setup](#complete-redux-store-setup)

## Login Action with Cookie Setup

Complete login server action with secure cookie configuration:

```typescript
"use server";

import { cookies } from "next/headers";
import { getClient } from "@/lib/apollo/ApolloClient";
import { ShifterLoginDocument } from "@/__generated__/graphql";
import type { LoginResult } from "@/types/auth";
import { loginSchema } from "@/lib/validation/auth";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function loginUser(input: unknown): Promise<LoginResult> {
  try {
    // 1. Validate input
    const validated = loginSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: {
          en: "Invalid login credentials",
          ar: "بيانات تسجيل دخول غير صالحة",
        },
        errorCode: "VALIDATION_ERROR",
      };
    }

    // 2. Execute GraphQL mutation
    const client = getClient();
    const { data, errors } = await client.mutate({
      mutation: ShifterLoginDocument,
      variables: { input: validated.data },
    });

    // 3. Handle GraphQL errors
    if (errors) {
      console.error("❌ [loginUser] GraphQL errors:", errors);
      return {
        success: false,
        error: {
          en: "Login failed",
          ar: "فشل تسجيل الدخول",
        },
        errorCode: "GRAPHQL_ERROR",
      };
    }

    // 4. Validate response data
    const accessToken = data?.ShifterLogin?.login?.accessToken;

    if (!accessToken) {
      return {
        success: false,
        error: {
          en: "No authentication token returned",
          ar: "لم يتم إرجاع رمز المصادقة",
        },
        errorCode: "NO_DATA",
      };
    }

    // 5. Set HTTP-only auth cookies
    const cookieStore = await cookies();

    // Primary auth token (HTTP-only, secure)
    cookieStore.set(ACCESS_TOKEN, accessToken, {
      httpOnly: true,                          // 🔒 No JavaScript access
      secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
      sameSite: "lax",                        // 🔒 CSRF protection
      maxAge: 60 * 60 * 24 * 7,              // 7 days
      path: "/",                              // Site-wide
    });

    // Secondary status cookie (readable by client for UI)
    cookieStore.set("is_authenticated", "true", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      // Note: NOT httpOnly - client can read for UI state
    });

    console.log("✅ [loginUser] Login successful, cookies set");

    return {
      success: true,
      data: {
        user: data.ShifterLogin?.login?.user,
      },
    };

  } catch (error) {
    console.error("❌ [loginUser] Unexpected error:", error);
    return {
      success: false,
      error: {
        en: "An unexpected error occurred",
        ar: "حدث خطأ غير متوقع",
      },
      errorCode: "UNEXPECTED_ERROR",
    };
  }
}
```

## Logout Action with Cookie Clearing

Complete logout server action that clears all authentication state:

```typescript
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function logoutUser() {
  try {
    console.log("🔄 [logoutUser] Starting logout process");

    const cookieStore = await cookies();

    // Clear all auth cookies
    cookieStore.delete(ACCESS_TOKEN);
    cookieStore.delete("is_authenticated");

    console.log("✅ [logoutUser] Auth cookies cleared");

    // Optional: Call logout mutation on GraphQL server
    // This might invalidate refresh tokens, etc.
    try {
      const client = getClient();
      await client.mutate({
        mutation: LogoutDocument,
      });
    } catch (error) {
      // Log but don't fail - cookies are already cleared
      console.warn("⚠️ [logoutUser] Server logout failed:", error);
    }

  } catch (error) {
    console.error("❌ [logoutUser] Error during logout:", error);
    // Still redirect even if error occurs
  }

  // Redirect to login page
  redirect("/login");
}
```

## Protected Route Middleware

Next.js middleware for protecting authenticated routes:

```typescript
// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth cookie
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;

  // Define route types
  const isAuthPage = pathname.startsWith("/login") ||
                     pathname.startsWith("/register") ||
                     pathname.startsWith("/forgot-password");

  const isProtectedRoute = pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/wallet") ||
                          pathname.startsWith("/profile") ||
                          pathname.startsWith("/members");

  // Case 1: Not authenticated trying to access protected route
  if (!accessToken && isProtectedRoute) {
    console.log("🔒 [middleware] Unauthenticated access to protected route:", pathname);

    // Redirect to login with return URL
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Authenticated trying to access auth pages
  if (accessToken && isAuthPage) {
    console.log("🔓 [middleware] Authenticated user accessing auth page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3: All other requests - allow through
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/members/:path*",
    "/branches/:path*",
    // Auth routes
    "/login",
    "/register",
    "/forgot-password",
    // Exclude static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Encrypted Wallet State

Complete Redux slice with encrypted persistence for wallet data:

```typescript
// src/lib/redux/slices/walletSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Types
interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: string;
}

interface WalletState {
  balance: number;
  currency: string;
  pendingBalance: number;
  transactions: Transaction[];
  lastUpdated: string | null;
}

// Initial state
const initialState: WalletState = {
  balance: 0,
  currency: "SAR",
  pendingBalance: 0,
  transactions: [],
  lastUpdated: null,
};

// Slice
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Set complete wallet data
    setWalletData: (state, action: PayloadAction<WalletState>) => {
      // This data will be automatically encrypted when persisted
      state.balance = action.payload.balance;
      state.currency = action.payload.currency;
      state.pendingBalance = action.payload.pendingBalance;
      state.transactions = action.payload.transactions;
      state.lastUpdated = new Date().toISOString();
    },

    // Update balance only
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // Add new transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Clear all wallet data (on logout)
    clearWallet: () => initialState,
  },
});

// Actions
export const {
  setWalletData,
  updateBalance,
  addTransaction,
  clearWallet,
} = walletSlice.actions;

// Selectors
export const selectWalletBalance = (state: RootState) => state.wallet.balance;
export const selectWalletTransactions = (state: RootState) => state.wallet.transactions;
export const selectWalletCurrency = (state: RootState) => state.wallet.currency;

// Reducer
export default walletSlice.reducer;
```

## Auth Token Retrieval in Server Action

Example of using auth token in a protected server action:

```typescript
"use server";

import { cookies } from "next/headers";
import { getClient } from "@/lib/apollo/ApolloClient";
import { GetWalletBalanceDocument } from "@/__generated__/graphql";

const ACCESS_TOKEN = "ACCESS_TOKEN";

export async function getWalletBalance() {
  try {
    // 1. Get auth token from cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

    if (!accessToken) {
      return {
        success: false,
        error: {
          en: "Not authenticated",
          ar: "غير مصادق",
        },
        errorCode: "UNAUTHORIZED",
      };
    }

    // 2. Create Apollo client with auth token
    const client = getClient();

    // 3. Execute authenticated query
    const { data, errors } = await client.query({
      query: GetWalletBalanceDocument,
      context: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    if (errors) {
      console.error("❌ [getWalletBalance] GraphQL errors:", errors);
      return {
        success: false,
        error: {
          en: "Failed to fetch wallet balance",
          ar: "فشل في جلب رصيد المحفظة",
        },
        errorCode: "GRAPHQL_ERROR",
      };
    }

    return {
      success: true,
      data: {
        balance: data?.wallet?.balance,
        currency: data?.wallet?.currency,
      },
    };

  } catch (error) {
    console.error("❌ [getWalletBalance] Error:", error);
    return {
      success: false,
      error: {
        en: "An unexpected error occurred",
        ar: "حدث خطأ غير متوقع",
      },
      errorCode: "UNEXPECTED_ERROR",
    };
  }
}
```

## Complete Redux Store Setup

Full Redux store configuration with encrypted persistence:

```typescript
// src/lib/redux/store.ts

import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { encryptTransform } from "redux-persist-transform-encrypt";

// Reducers
import authReducer from "./slices/authSlice";
import walletReducer from "./slices/walletSlice";
import commissionReducer from "./slices/commissionSlice";

// Encryption transform
const encryptTransform = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPT_KEY || "fallback-dev-key",
  onError: (error) => {
    console.error("❌ Redux encryption error:", error);
  },
});

// Persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Only persist wallet and commission (sensitive financial data)
  whitelist: ["wallet", "commission"],
  // Encrypt before storing
  transforms: [encryptTransform],
};

// Combine reducers
const rootReducer = {
  auth: authReducer,         // NOT persisted (uses cookies)
  wallet: walletReducer,     // Persisted + encrypted
  commission: commissionReducer, // Persisted + encrypted
};

// Create persisted reducer
const persistedReducer = persistReducer(
  persistConfig,
  configureStore({
    reducer: rootReducer,
  }).reducer
);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Redux Provider Setup

```typescript
// src/app/providers.tsx

"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
```

### Usage in App Layout

```typescript
// src/app/layout.tsx

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## Using Wallet State in Components

```typescript
"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectWalletBalance, updateBalance } from "@/lib/redux/slices/walletSlice";

export function WalletDisplay() {
  const balance = useSelector(selectWalletBalance);
  const dispatch = useDispatch();

  // Data is automatically encrypted in localStorage
  // Decryption happens automatically when reading

  return (
    <div>
      <h2>Wallet Balance</h2>
      <p>{balance} SAR</p>
    </div>
  );
}
```

## Testing Cookie Security

```typescript
// test-cookie-security.ts

import { cookies } from "next/headers";

export async function testCookieSecurity() {
  const cookieStore = await cookies();

  // Set test cookie
  cookieStore.set("TEST_SECURE", "test-value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60,
    path: "/",
  });

  // Try to read it
  const testCookie = cookieStore.get("TEST_SECURE");

  console.log("Cookie set:", !!testCookie);
  console.log("Cookie value:", testCookie?.value);
  console.log("Environment:", process.env.NODE_ENV);

  // Clean up
  cookieStore.delete("TEST_SECURE");

  return {
    cookieSet: !!testCookie,
    environment: process.env.NODE_ENV,
    secure: process.env.NODE_ENV === "production",
  };
}
```

## Environment Setup

Required environment variables:

```bash
# .env.local

# GraphQL API
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql/

# Redux encryption key (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NEXT_PUBLIC_REDUX_ENCRYPT_KEY=your-secure-random-key-here

# Node environment
NODE_ENV=development  # or production
```

Generate a secure encryption key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example:
```
a7f3c2e9b1d4567890abcdef1234567890abcdef1234567890abcdef12345678
```
