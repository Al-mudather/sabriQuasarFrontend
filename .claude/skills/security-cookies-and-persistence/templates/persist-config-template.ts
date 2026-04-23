/**
 * Redux Persist Configuration Template
 *
 * Template for setting up encrypted Redux persistence.
 * Copy this into your Redux store configuration (e.g., src/lib/redux/persistConfig.ts)
 */

import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import type { PersistConfig } from "redux-persist";

/**
 * Create encryption transform for Redux persistence
 * Encrypts sensitive data before storing in localStorage
 */
export const createEncryptTransform = () => {
  return encryptTransform({
    // Use environment variable for encryption key
    secretKey:
      process.env.NEXT_PUBLIC_REDUX_ENCRYPT_KEY || "fallback-development-key",

    // Error handler for encryption/decryption failures
    onError: (error) => {
      console.error("❌ Redux encryption error:", error);

      // In production, you might want to clear corrupted storage
      if (process.env.NODE_ENV === "production") {
        try {
          localStorage.removeItem("persist:root");
          console.log("🔄 Cleared corrupted encrypted storage");
        } catch (clearError) {
          console.error("Failed to clear storage:", clearError);
        }
      }
    },
  });
};

/**
 * Basic persist configuration with encryption
 */
export const persistConfig: PersistConfig<any> = {
  key: "root",
  version: 1,
  storage,

  // Only persist these slices (whitelist approach)
  whitelist: [
    "wallet", // ✅ Financial data - MUST encrypt
    "commission", // ✅ Earnings data - MUST encrypt
    // Don't include: auth (use cookies), ui (not sensitive)
  ],

  // Apply encryption transform
  transforms: [createEncryptTransform()],

  // Timeout for persistence operations (ms)
  timeout: 10000,

  // Debounce writes to storage (ms)
  writeDebounce: 1000,
};

/**
 * Alternative: Blacklist approach (persist everything except specified slices)
 */
export const persistConfigBlacklist: PersistConfig<any> = {
  key: "root",
  version: 1,
  storage,

  // Don't persist these slices (blacklist approach)
  blacklist: [
    "auth", // ❌ NEVER persist - use HTTP-only cookies
    "ui", // Not needed - just UI state
  ],

  transforms: [createEncryptTransform()],
};

/**
 * Migration configuration for versioned persistence
 * Use when changing Redux state structure
 */
export const persistConfigWithMigrations: PersistConfig<any> = {
  key: "root",
  version: 2, // Increment when state structure changes
  storage,
  whitelist: ["wallet", "commission"],
  transforms: [createEncryptTransform()],

  // Migrations for version changes
  migrate: (state: any, version: number) => {
    console.log(`🔄 Migrating Redux persist from version ${version} to 2`);

    // Example: Migrate from v1 to v2
    if (version === 1) {
      return Promise.resolve({
        ...state,
        wallet: {
          ...state.wallet,
          // Add new field that didn't exist in v1
          pendingBalance: 0,
        },
      });
    }

    return Promise.resolve(state);
  },
};

/**
 * Environment variable setup
 *
 * Add to .env.local:
 *
 * # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 * NEXT_PUBLIC_REDUX_ENCRYPT_KEY=your-secure-random-key-here
 */
