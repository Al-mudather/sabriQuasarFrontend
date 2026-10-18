# Payment implementation summary

- Bankak (bank transfer) is the production payment path (`bankakPay.vue`, `UploadAttachmentTransaction`).
- Stripe is dev-only, kept in `payment.vue` and shown only when `stripePublishableKey` is available.
- PayPal, Braintree, SmartNode and SyberPay were removed from the API on 2026-10-17.
- Their components, GraphQL documents, store state and types were deleted on 2026-10-18.
- `PaymentProvider` in `src/types/cart/types.ts` is `'stripe' | 'bankak'`.
- Codegen: `GRAPHQL_SCHEMA_URL=<url> npm run codegen` overrides the schema endpoint.
- Build flag `STRIPE_CHECKOUT_UI` (read from `.env`, inlined at build time): card checkout is offered only when it is `true`/`1` AND the backend returns a key. Set `STRIPE_CHECKOUT_UI=false` or leave it unset; development/testing only, production builds leave this off.
