// Type-safety source of truth for the PYRAMID MARKETING (MLM) feature.
// Covers: affiliate account, balance, withdrawals, ledger rewards, marketers,
// and the platform-join flow. Type-only file — no runtime code.

import type {
  // Queries
  MyPyramidAccountQuery,
  MyPyramidAccountQueryVariables,
  MyPyramidBalanceQuery,
  MyPyramidBalanceQueryVariables,
  MyPyramidWithdrawsQuery,
  MyPyramidWithdrawsQueryVariables,
  MyPyramidLedgerRewardQuery,
  MyPyramidLedgerRewardQueryVariables,
  MyPyramidMarketersQuery,
  MyPyramidMarketersQueryVariables,
  CheckPyramidAffiliateQuery,
  CheckPyramidAffiliateQueryVariables,

  // Mutations
  // codegen emits `WithdrawPyramidBalanceMutation` for the `MakePyramidWithdraw` op.
  WithdrawPyramidBalanceMutation,
  WithdrawPyramidBalanceMutationVariables,
  ClaimPyramidLedgerBalanceMutation,
  ClaimPyramidLedgerBalanceMutationVariables,
  JoinPyramidProgramMutation,
  JoinPyramidProgramMutationVariables,
  JoinPlatformMutation,
  JoinPlatformMutationVariables,
} from 'src/graphql/generated'

// TODO: `WhoJoindThePlatformThrowMe` query is referenced in
// src/graphql/pyramid_marketing_management/query/WhoJoindThePlatformThrowMe.js
// but has no codegen-generated type (not registered in codegen document set).
// Skipped here — add when the op is wired into GraphQL codegen.

// ---------------------------------------------------------------------------
// Domain entities (narrowed from the raw query result shapes)
// ---------------------------------------------------------------------------

/** The caller's own pyramid (affiliate) account node. */
export type PyramidAccount = NonNullable<MyPyramidAccountQuery['myPyramidAccount']>

/** The caller's pyramid balance node (balance + timestamps). */
export type PyramidBalance = NonNullable<MyPyramidBalanceQuery['myPyramidBalance']>

/** A single withdrawal row (edge.node of the `myPyramidWithdraws` connection). */
export type PyramidWithdraw = NonNullable<
  NonNullable<
    NonNullable<MyPyramidWithdrawsQuery['myPyramidWithdraws']>['edges'][number]
  >['node']
>

/**
 * Affiliate membership record used by the "join platform" flow.
 * Returned by `CheckPyramidAffiliate`.
 */
export type PyramidAffiliate = NonNullable<CheckPyramidAffiliateQuery['checkPyramidAffiliate']>

/**
 * Scalar ledger-reward payload as returned by the server.
 * The backend currently returns a flat `number | null`, but the client
 * (MyMarketingPage.vue `totalEarnings` computed) also handles a JSON string
 * or an object keyed by currency — see {@link PyramidLedgerPayload}.
 */
export type PyramidLedgerRewardRaw = MyPyramidLedgerRewardQuery['myPyramidLedgerReward']

/** Count of direct marketers under the caller (server returns `number | null`). */
export type PyramidMarketerCount = MyPyramidMarketersQuery['myPyramidMarketers']

// ---------------------------------------------------------------------------
// LEDGER JSON NARROWING
// ---------------------------------------------------------------------------
//
// In `MyMarketingPage.vue` the `myPyramidLedgerReward` scalar is treated as
// possibly a JSON-encoded string keyed by currency, e.g. `{ "USD": 42.5, "SAR": 160 }`.
// The raw `JSON.parse(raw)` call had no type narrowing. This interface
// documents every shape the client code is prepared to accept and replaces
// the untyped parse site.
//
// Observed shape (from totalEarnings computed): values indexed by currency code
// (number). The canonical structured fields below (amount/course/customer/
// commission/date) are declared so future ledger-entry endpoints that return
// a richer payload can narrow to the same type.
export interface PyramidLedgerPayload {
  /** Flat total amount (fallback when not keyed by currency). */
  amount?: number
  /** Related course title, when a ledger entry is tied to a course sale. */
  course?: string | null
  /** Customer full name/email who generated the commission. */
  customer?: string | null
  /** Commission value for the entry. */
  commission?: number | null
  /** ISO-like date string for the entry. */
  date?: string | null
  /**
   * Index signature for currency-keyed totals: e.g. `payload.USD`, `payload.SAR`.
   * This is the shape that `MyMarketingPage.vue::totalEarnings` actually reads.
   */
  [currency: string]: number | string | null | undefined
}

/**
 * Every runtime shape the ledger-reward scalar may arrive as.
 * Use with a type guard at the call site instead of `JSON.parse` without narrowing.
 */
export type PyramidLedgerRewardValue =
  | number
  | string
  | PyramidLedgerPayload
  | null
  | undefined

// ---------------------------------------------------------------------------
// Per-operation Result / Variables pairs
// ---------------------------------------------------------------------------

// --- Queries ---------------------------------------------------------------
export type MyPyramidAccountResult = MyPyramidAccountQuery
export type MyPyramidAccountVars = MyPyramidAccountQueryVariables

export type MyPyramidBalanceResult = MyPyramidBalanceQuery
export type MyPyramidBalanceVars = MyPyramidBalanceQueryVariables

export type MyPyramidWithdrawsResult = MyPyramidWithdrawsQuery
export type MyPyramidWithdrawsVars = MyPyramidWithdrawsQueryVariables

export type MyPyramidLedgerRewardResult = MyPyramidLedgerRewardQuery
export type MyPyramidLedgerRewardVars = MyPyramidLedgerRewardQueryVariables

export type MyPyramidMarketersResult = MyPyramidMarketersQuery
export type MyPyramidMarketersVars = MyPyramidMarketersQueryVariables

export type CheckPyramidAffiliateResult = CheckPyramidAffiliateQuery
export type CheckPyramidAffiliateVars = CheckPyramidAffiliateQueryVariables

// --- Mutations -------------------------------------------------------------
export type MakePyramidWithdrawResult = WithdrawPyramidBalanceMutation
export type MakePyramidWithdrawVars = WithdrawPyramidBalanceMutationVariables

export type ClaimPyramidLedgerBalanceResult = ClaimPyramidLedgerBalanceMutation
export type ClaimPyramidLedgerBalanceVars = ClaimPyramidLedgerBalanceMutationVariables

export type JoinPyramidProgramResult = JoinPyramidProgramMutation
export type JoinPyramidProgramVars = JoinPyramidProgramMutationVariables

export type JoinPlatformResult = JoinPlatformMutation
export type JoinPlatformVars = JoinPlatformMutationVariables
