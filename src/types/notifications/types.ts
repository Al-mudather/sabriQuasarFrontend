import type {
  GetAllMyNotificationsQuery,
  GetAllMyNotificationsQueryVariables,
  DoneReadingNotificationMutation,
  DoneReadingNotificationMutationVariables,
  NotificationCreatedSubscriptionSubscription,
  NotificationCreatedSubscriptionSubscriptionVariables,
  CheckoutSubscriptionSubscription,
  CheckoutSubscriptionSubscriptionVariables,
} from 'src/graphql/generated'

// Domain entity — extracted from the `myNotifications` connection edge.node
export type Notification = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<GetAllMyNotificationsQuery['myNotifications']>['edges'][number]
    >
  >['node']
>

// Query: GetAllMyNotifications
export type MyNotificationsResult = GetAllMyNotificationsQuery
export type MyNotificationsVars = GetAllMyNotificationsQueryVariables

// TODO: GetAllMyNotificationsCount missing (schema drift) — not emitted in generated.ts

// Mutation: DoneReadingNotification
export type DoneReadingNotificationResult = DoneReadingNotificationMutation
export type DoneReadingNotificationVars = DoneReadingNotificationMutationVariables

// Subscriptions
export type NotificationCreatedPayload = NotificationCreatedSubscriptionSubscription
export type NotificationCreatedVars = NotificationCreatedSubscriptionSubscriptionVariables

export type CheckoutPayload = CheckoutSubscriptionSubscription
export type CheckoutVars = CheckoutSubscriptionSubscriptionVariables
