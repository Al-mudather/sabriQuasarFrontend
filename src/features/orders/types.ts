// Type-safety source of truth for the ORDERS feature.
//
// Owned operations:
//   - Mutation: CreateNewOrderWithBulkOrderDetails
//
// NOTE: No user-facing order-listing query (MyOrders / AllOrders / allMyOrders /
// order) is currently present as a typed operation in `src/graphql/generated.ts`
// — only the raw schema types (OrderNode, OrderNodeConnection, etc.) exist.
// Order listing for marketers/pyramid managers is handled via the
// attachment-transaction feature (see AllMarketerAttachmentTransactionQuery /
// MyAttachmentTransactionsQuery), which exposes the underlying OrderNode fields.
// When a dedicated order-listing operation is added, extend this file to derive
// `Order` from that query's connection edges.
//
// TODO: add `Order` / `OrderList` types once a MyOrders/AllOrders operation
// is registered in generated.ts.

import type {
  CreateNewOrderWithBulkOrderDetailsMutation,
  CreateNewOrderWithBulkOrderDetailsMutationVariables,
  OrderNode,
  OrderCurrency,
} from 'src/graphql/generated'

/**
 * Result payload returned by the CreateNewOrderWithBulkOrderDetails mutation.
 * Shape: { createNewOrderWithBulkOrderDetails: { success, errors, order: { pk } } | null }
 */
export type CreateOrderResult = CreateNewOrderWithBulkOrderDetailsMutation

/**
 * Variables for the CreateNewOrderWithBulkOrderDetails mutation.
 * Shape: { courseIds: number[] }
 */
export type CreateOrderVars = CreateNewOrderWithBulkOrderDetailsMutationVariables

/**
 * The minimal order handle returned by the create mutation — just the primary
 * key. Components that need richer order data should fetch via a dedicated
 * listing/detail query (not yet typed — see TODO above).
 */
export type CreatedOrderHandle = NonNullable<
  NonNullable<CreateOrderResult['createNewOrderWithBulkOrderDetails']>['order']
>

/**
 * Re-export of the raw schema `OrderNode` for downstream consumers that
 * currently rely on the pre-migration shape. Prefer deriving field-precise
 * types from a real operation once one exists.
 */
export type OrderEntity = OrderNode

export type { OrderCurrency }
