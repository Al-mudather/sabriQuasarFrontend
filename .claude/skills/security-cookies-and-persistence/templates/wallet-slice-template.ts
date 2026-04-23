/**
 * Encrypted Wallet Slice Template
 *
 * Template for Redux slice with sensitive financial data.
 * This data will be automatically encrypted when persisted to localStorage.
 *
 * Copy this into src/lib/redux/slices/walletSlice.ts
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// ============================================================================
// Types
// ============================================================================

interface Transaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface WalletState {
  // Core wallet data (will be encrypted)
  balance: number;
  currency: string;
  pendingBalance: number;

  // Transaction history (will be encrypted)
  transactions: Transaction[];

  // Metadata
  lastUpdated: string | null;
  lastSyncedAt: string | null;

  // UI state (non-sensitive)
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: WalletState = {
  balance: 0,
  currency: "SAR",
  pendingBalance: 0,
  transactions: [],
  lastUpdated: null,
  lastSyncedAt: null,
  isLoading: false,
  error: null,
};

// ============================================================================
// Slice
// ============================================================================

const walletSlice = createSlice({
  name: "wallet",
  initialState,

  reducers: {
    // ========================================================================
    // Set complete wallet data (from API)
    // ========================================================================
    setWalletData: (state, action: PayloadAction<Partial<WalletState>>) => {
      return {
        ...state,
        ...action.payload,
        lastUpdated: new Date().toISOString(),
      };
    },

    // ========================================================================
    // Update balance only
    // ========================================================================
    updateBalance: (
      state,
      action: PayloadAction<{ balance: number; pendingBalance?: number }>
    ) => {
      state.balance = action.payload.balance;

      if (action.payload.pendingBalance !== undefined) {
        state.pendingBalance = action.payload.pendingBalance;
      }

      state.lastUpdated = new Date().toISOString();
    },

    // ========================================================================
    // Add new transaction
    // ========================================================================
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      // Add to beginning of array (most recent first)
      state.transactions.unshift(action.payload);

      // Update balance based on transaction type
      if (action.payload.status === "completed") {
        if (action.payload.type === "credit") {
          state.balance += action.payload.amount;
        } else {
          state.balance -= action.payload.amount;
        }
      }

      state.lastUpdated = new Date().toISOString();
    },

    // ========================================================================
    // Update transaction status
    // ========================================================================
    updateTransactionStatus: (
      state,
      action: PayloadAction<{ id: string; status: Transaction["status"] }>
    ) => {
      const transaction = state.transactions.find(
        (t) => t.id === action.payload.id
      );

      if (transaction) {
        const oldStatus = transaction.status;
        transaction.status = action.payload.status;

        // Update balance if transaction moved to/from completed
        if (oldStatus !== "completed" && action.payload.status === "completed") {
          if (transaction.type === "credit") {
            state.balance += transaction.amount;
          } else {
            state.balance -= transaction.amount;
          }
        } else if (
          oldStatus === "completed" &&
          action.payload.status !== "completed"
        ) {
          if (transaction.type === "credit") {
            state.balance -= transaction.amount;
          } else {
            state.balance += transaction.amount;
          }
        }

        state.lastUpdated = new Date().toISOString();
      }
    },

    // ========================================================================
    // Set transactions (bulk)
    // ========================================================================
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    // ========================================================================
    // Mark as synced
    // ========================================================================
    markSynced: (state) => {
      state.lastSyncedAt = new Date().toISOString();
    },

    // ========================================================================
    // Loading state
    // ========================================================================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;

      if (action.payload) {
        state.error = null;
      }
    },

    // ========================================================================
    // Error state
    // ========================================================================
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // ========================================================================
    // Clear all wallet data (on logout)
    // ========================================================================
    clearWallet: () => initialState,
  },
});

// ============================================================================
// Actions
// ============================================================================

export const {
  setWalletData,
  updateBalance,
  addTransaction,
  updateTransactionStatus,
  setTransactions,
  markSynced,
  setLoading,
  setError,
  clearWallet,
} = walletSlice.actions;

// ============================================================================
// Selectors
// ============================================================================

// Basic selectors
export const selectWallet = (state: RootState) => state.wallet;
export const selectWalletBalance = (state: RootState) => state.wallet.balance;
export const selectWalletCurrency = (state: RootState) => state.wallet.currency;
export const selectPendingBalance = (state: RootState) =>
  state.wallet.pendingBalance;
export const selectTransactions = (state: RootState) =>
  state.wallet.transactions;
export const selectIsLoading = (state: RootState) => state.wallet.isLoading;
export const selectError = (state: RootState) => state.wallet.error;

// Computed selectors
export const selectTotalBalance = (state: RootState) =>
  state.wallet.balance + state.wallet.pendingBalance;

export const selectRecentTransactions = (state: RootState, limit = 10) =>
  state.wallet.transactions.slice(0, limit);

export const selectTransactionsByType =
  (type: Transaction["type"]) => (state: RootState) =>
    state.wallet.transactions.filter((t) => t.type === type);

export const selectCompletedTransactions = (state: RootState) =>
  state.wallet.transactions.filter((t) => t.status === "completed");

// ============================================================================
// Reducer
// ============================================================================

export default walletSlice.reducer;

// ============================================================================
// Usage Example
// ============================================================================

/**
 * Example: Fetching and storing wallet data
 *
 * import { useDispatch } from 'react-redux';
 * import { setWalletData, setLoading, setError } from './walletSlice';
 *
 * const dispatch = useDispatch();
 *
 * async function fetchWallet() {
 *   dispatch(setLoading(true));
 *
 *   try {
 *     const response = await getWalletBalance();
 *
 *     if (response.success) {
 *       dispatch(setWalletData({
 *         balance: response.data.balance,
 *         currency: response.data.currency,
 *         transactions: response.data.transactions,
 *       }));
 *     } else {
 *       dispatch(setError(response.error.en));
 *     }
 *   } catch (error) {
 *     dispatch(setError('Failed to fetch wallet data'));
 *   } finally {
 *     dispatch(setLoading(false));
 *   }
 * }
 */
