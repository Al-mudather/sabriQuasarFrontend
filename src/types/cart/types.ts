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
  // Publishable keys
  StripePublishableKeyQuery,
  StripePublishableKeyQueryVariables,
  // Order management
  CreateNewOrderWithBulkOrderDetailsMutation,
  CreateNewOrderWithBulkOrderDetailsMutationVariables,
  // Bankak (bank transfer)
  UploadAttachmentTransactionMutation,
  UploadAttachmentTransactionMutationVariables,
  // Notifications (success page)
  GetMyNotificationsQuery,
  GetMyNotificationsQueryVariables,
  // Checkout subscription (layout shell)
  CheckoutSubscriptionSubscription,
  CheckoutSubscriptionSubscriptionVariables,
  // Pyramid affiliate check
  CheckPyramidAffiliateQuery,
  CheckPyramidAffiliateQueryVariables,
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
  /**
   * Optional display fields carried from the course node at add-to-cart time
   * (both are real fields on the course node — `title` and `cover`). They let
   * the cart render the course name + thumbnail without re-fetching.
   */
  title?: string
  cover?: string | null
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
// Canonical discriminator used by the cart/checkout UI.
export type PaymentProvider = 'stripe' | 'bankak'

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

// ---------------------------------------------------------------------------
// Publishable-key queries
// ---------------------------------------------------------------------------
export type StripePublishableKeyResult = StripePublishableKeyQuery
export type StripePublishableKeyVars = StripePublishableKeyQueryVariables

// ---------------------------------------------------------------------------
// Order management
// ---------------------------------------------------------------------------
export type CreateOrderResult = CreateNewOrderWithBulkOrderDetailsMutation
export type CreateOrderVars = CreateNewOrderWithBulkOrderDetailsMutationVariables

/** Convenience: the payload nested under createNewOrderWithBulkOrderDetails */
export type CreateOrderPayload = NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']>

// ---------------------------------------------------------------------------
// Bankak (bank transfer attachment)
// ---------------------------------------------------------------------------
export type UploadAttachmentResult = UploadAttachmentTransactionMutation
export type UploadAttachmentVars = UploadAttachmentTransactionMutationVariables

// ---------------------------------------------------------------------------
// Notifications (success page query)
// ---------------------------------------------------------------------------
export type GetMyNotificationsResult = GetMyNotificationsQuery
export type GetMyNotificationsVars = GetMyNotificationsQueryVariables

// ---------------------------------------------------------------------------
// Checkout subscription (cart layout shell)
// ---------------------------------------------------------------------------
export type CheckoutSubscriptionResult = CheckoutSubscriptionSubscription
export type CheckoutSubscriptionVars = CheckoutSubscriptionSubscriptionVariables

// ---------------------------------------------------------------------------
// Pyramid affiliate check (cart entry guard)
// ---------------------------------------------------------------------------
export type CheckPyramidAffiliateResult = CheckPyramidAffiliateQuery
export type CheckPyramidAffiliateVars = CheckPyramidAffiliateQueryVariables
