// Type-safety source of truth for the ATTACHMENTS feature
// (transaction attachments / proof-of-payment uploads).
//
// Raw operation types live in `src/graphql/generated.ts` (produced by
// @graphql-codegen). This module is the domain-named layer: it re-exports
// per-op Result/Vars pairs and extracts the connection `edge.node` as the
// primary `AttachmentTransaction` entity.
//
// NOTE: the codebase's `TheUserAttachmentTransactionsQuery.js` actually
// declares the operation as `MyAttachmentTransactions` (backed by the
// `myAttachmentTransactions` root field), so the generated type is
// `MyAttachmentTransactionsQuery`. We alias it under the domain name.

import type {
  MyAttachmentTransactionsQuery,
  MyAttachmentTransactionsQueryVariables,
  AllMarketerAttachmentTransactionQuery,
  AllMarketerAttachmentTransactionQueryVariables,
  UploadAttachmentTransactionMutation,
  UploadAttachmentTransactionMutationVariables,
  ReUploadAttachmentTransactionMutation,
  ReUploadAttachmentTransactionMutationVariables,
  MarketerAttachmentTransactionConfirmationMutation,
  MarketerAttachmentTransactionConfirmationMutationVariables,
} from 'src/graphql/generated'

// ---------------------------------------------------------------------------
// Entity: extract edge.node from the user-side connection query.
// Both `myAttachmentTransactions` and `allMarketerAttachmentTransaction`
// share the same underlying `AttachmentTransactionNode`, but the marketer
// query selects extra fields (user, orderdetailsSet). Use the richer marketer
// node as the canonical domain entity so consumers get the widest shape;
// the user-side node is exposed separately for narrower call sites.
// ---------------------------------------------------------------------------

export type AttachmentTransaction = NonNullable<
  NonNullable<
    NonNullable<
      AllMarketerAttachmentTransactionQuery['allMarketerAttachmentTransaction']
    >['edges'][number]
  >['node']
>

export type UserAttachmentTransaction = NonNullable<
  NonNullable<
    NonNullable<
      MyAttachmentTransactionsQuery['myAttachmentTransactions']
    >['edges'][number]
  >['node']
>

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

// TheUserAttachmentTransactionsQuery -> operation name `MyAttachmentTransactions`
export type TheUserAttachmentTransactionsResult = MyAttachmentTransactionsQuery
export type TheUserAttachmentTransactionsVars = MyAttachmentTransactionsQueryVariables

export type AllMarketerAttachmentTransactionResult = AllMarketerAttachmentTransactionQuery
export type AllMarketerAttachmentTransactionVars = AllMarketerAttachmentTransactionQueryVariables

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export type UploadAttachmentResult = UploadAttachmentTransactionMutation
export type UploadAttachmentVars = UploadAttachmentTransactionMutationVariables

export type ReUploadAttachmentResult = ReUploadAttachmentTransactionMutation
export type ReUploadAttachmentVars = ReUploadAttachmentTransactionMutationVariables

// marketerConfirmAttachmentTransaction -> schema field
// `marketerAttachmentTransactionConfirmation`
export type MarketerConfirmAttachmentResult =
  MarketerAttachmentTransactionConfirmationMutation
export type MarketerConfirmAttachmentVars =
  MarketerAttachmentTransactionConfirmationMutationVariables
