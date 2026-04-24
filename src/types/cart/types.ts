// Type-only module for the CART & CHECKOUT feature.
//
// Sources:
//   - src/graphql/generated.ts .............. raw GraphQL operation types
//   - src/stores/cart.js .................... local cart state shape
//
// This file is the type-safety source of truth for the cart store and the
// per-provider checkout flows. Keep it type-only (no runtime imports) and
// do not cross-import from other types/* modules.

import type {
  // Stripe
  CreateStripeCheckoutMutation,
  CreateStripeCheckoutMutationVariables,
  // Paypal
  CapturePaypalCheckoutMutation,
  CapturePaypalCheckoutMutationVariables,
  // Braintree
  CreateBraintreeCheckoutMutation,
  CreateBraintreeCheckoutMutationVariables,
  CaptureBraintreeCheckoutMutation,
  CaptureBraintreeCheckoutMutationVariables,
  // SmartNode
  CreateSmartNodeCheckoutMutation,
  CreateSmartNodeCheckoutMutationVariables,
  // Publishable keys
  StripePublishableKeyQuery,
  StripePublishableKeyQueryVariables,
  PaypalPublishableKeyQuery,
  PaypalPublishableKeyQueryVariables
} from 'src/graphql/generated'

// ---------------------------------------------------------------------------
// Local cart shape (NOT from GraphQL)
// ---------------------------------------------------------------------------
// Mirrors the entries that src/stores/cart.js pushes into
// `shoppingCartDataList` (SessionStorage-backed). A cart entry is a minimal
// course reference the user added locally; the full course record is
// re-fetched for display at checkout time.
//
// The legacy store wraps each entry as `{ course: {...}, ...extras }` — the
// `CartItem` below is the *course reference* carried inside that wrapper.
// `CartEntry` captures the wrapper so call sites can type the full list.
export interface CartItem {
  /** Relay id of the course. */
  id: string
  /** Numeric primary key (may be null before server round-trip). */
  pk: number | null
  /** Display name of the course. */
  name: string
  /**
   * Currency/price payload. The backend ships this as a JSONString which the
   * generated scalar types surface as `Record<string, number>`; types/courses
   * will narrow it further. Keep it permissive here to avoid coupling.
   */
  currency: Record<string, number>
  /** Optional affiliate/referral code attached at add-to-cart time. */
  affiliateCode?: string | null
}

/**
 * Full cart entry as stored in `shoppingCartDataList`. The Vuex-era shape
 * nests the course reference under `course` — preserve that so the migrated
 * Pinia store and checkout components keep working unchanged.
 */
export interface CartEntry {
  course: CartItem
  /** Escape hatch for legacy ad-hoc fields (coupon, qty, etc.). */
  [extra: string]: unknown
}

// ---------------------------------------------------------------------------
// Payment providers
// ---------------------------------------------------------------------------
// Canonical discriminator used by the cart/checkout UI. `syberpay` is kept in
// the union because product/UI still reference it even though its GraphQL ops
// are not exported from generated.ts yet (see TODOs below).
export type PaymentProvider =
  | 'stripe'
  | 'paypal'
  | 'braintree'
  | 'smartnode'
  | 'syberpay'

// ---------------------------------------------------------------------------
// Per-operation Result / Vars aliases
// ---------------------------------------------------------------------------
// Only providers/operations present in generated.ts are aliased. Missing ops
// are documented with TODO so the codegen owner knows what to add.

// ---- Stripe ----
export type CreateStripeCheckoutResult = CreateStripeCheckoutMutation
export type CreateStripeCheckoutVars = CreateStripeCheckoutMutationVariables
// TODO: CaptureStripeCheckout is not exported from generated.ts — the Stripe
// flow captures server-side via webhook / paymentUrl redirect, so no client
// mutation exists. Add here if a capture mutation is later introduced.

// ---- Paypal ----
// TODO: CreatePaypalCheckout mutation is defined on the schema
// (see RootMutationCreatePaypalCheckoutArgs) but no named client operation is
// exported from generated.ts. Add the operation document under
// src/graphql/checkout_management/ and re-run codegen to surface
// `CreatePaypalCheckoutMutation{,Variables}` aliases here.
export type CapturePaypalCheckoutResult = CapturePaypalCheckoutMutation
export type CapturePaypalCheckoutVars = CapturePaypalCheckoutMutationVariables

// ---- Braintree ----
export type CreateBraintreeCheckoutResult = CreateBraintreeCheckoutMutation
export type CreateBraintreeCheckoutVars = CreateBraintreeCheckoutMutationVariables
export type CaptureBraintreeCheckoutResult = CaptureBraintreeCheckoutMutation
export type CaptureBraintreeCheckoutVars = CaptureBraintreeCheckoutMutationVariables

// ---- SmartNode ----
export type CreateSmartNodeCheckoutResult = CreateSmartNodeCheckoutMutation
export type CreateSmartNodeCheckoutVars = CreateSmartNodeCheckoutMutationVariables
// TODO: CaptureSmartNodeCheckout is not exported from generated.ts. Add here
// if/when the backend ships a client-callable capture mutation.

// ---- Syberpay ----
// TODO: Neither CreateSyberpayCheckout nor CaptureSyberpayCheckout are
// exported from generated.ts (excluded from codegen or not yet added on the
// backend). The `'syberpay'` PaymentProvider variant is kept for UI parity.

// ---------------------------------------------------------------------------
// Publishable-key queries
// ---------------------------------------------------------------------------
export type StripePublishableKeyResult = StripePublishableKeyQuery
export type StripePublishableKeyVars = StripePublishableKeyQueryVariables

export type PaypalPublishableKeyResult = PaypalPublishableKeyQuery
export type PaypalPublishableKeyVars = PaypalPublishableKeyQueryVariables
