# Backend findings from the October 2026 frontend adaptation

**Audience:** backend team (SabriBackend)
**Scope:** behaviour of master `56d0e35` (2026-10-18) observed while adapting the three frontends and running a ten-persona end-to-end test against a local copy of that build.
**Frontend branches:** `api-changes-2026-10` in sabriQuasarFrontend, DrSabriDashboard and stc_mobile_app. The frontends already cope with every item below; these are things only the backend can fix properly.
**Release note the findings are checked against:** `product/development/frontend-api-changes-2026-10.md`.

Priority: **B1 and B2 block real users**; the rest are contract mismatches and robustness issues.

## Status after the backend's 19 October response (master `af8d3ea`, PR #10)

Re-verified against a local run of `af8d3ea` with the same ten personas.

| Finding | Backend status | Verified locally |
|---|---|---|
| B1 nested `order.user` fields "Access denied" for non-staff managers | **Open** (product decision; pinned as an xfail test). All production managers are staff today. | Unchanged |
| B2 upload fails after saving when the queue is down | Fixed (`c4f7d84`): upload succeeds, receipt reviewed without OCR | ✅ with Redis unreachable |
| B3 orders without a registration code | **Open** (product decision). Such users cannot pay: `uploadAttachmentTransaction` refuses with "PyramidAffiliate matching query does not exist." — keep the client-side gate | ✅ refusal reproduced |
| B4 foreign re-upload raised | Fixed (`e33423b`): `{"message": "Not Found"}` | ✅ |
| B5 Stripe crash without redirect URLs | Fixed (`ab364bd`): falls back to configured redirects | ✅ no crash (Stripe off → `nonFieldErrors`) |
| B6 error shapes | Guide corrected: shape 2 is `{"nonFieldErrors": [...]}`, shape 5 added for `not_verified` / `unauthenticated` | ✅ |
| B7 already-enrolled raised | Fixed (`9591309`): `{"success": false, "errors": {"message": "User already has valid enrollment in the course: <titles>"}}`, no order created | ✅ (course title included) |
| B8 confirmation `KeyError` | Fixed (`bbe73fa`): an omitted flag means false | ✅ approve with only `pyramidManagerEndorse` works |

Frontend impact: none required. The student web already matches `/already has valid enrollment/` on both payload and top-level messages, routes "PyramidAffiliate matching query does not exist." to the registration-code page, and parses the `nonFieldErrors` wrapper.

---

## Original findings (18 October, against `56d0e35`)

---

## B1. Non-staff pyramid managers cannot see any receipt (blocks the receipt-review screen)

**Where:** `sabri_backend/security/types_security.py:15-25` (`owner_access_required`) applied to `CustomUserNode.username`, `email`, `phoneNumber2`, `phoneNumber3`; reached through `allPyramidAttachmentTransactions` (`checkout_management/graphql/queries/attachment_transaction.py:127`) → `order.user`.

**Repro:** sign in as a user who is a manager of a pyramid (`AttachmentTransactionManager` row) but not `is_staff`, and run the dashboard's receipts query:

```graphql
{ allPyramidAttachmentTransactions {
    edges { node { pk order { pk user { username email phoneNumber2 phoneNumber3 } } } } } }
```

**Observed:**

```json
{ "errors": [ { "message": "Access denied", "path": ["allPyramidAttachmentTransactions","edges",0,"node","order","user","username"] }, … ],
  "data": { "allPyramidAttachmentTransactions": { "edges": [ { "node": null }, { "node": null }, { "node": null } ] } } }
```

Every `node` collapses to `null` because the guarded user fields are non-nullable inside the selection, so the manager sees an empty list. Staff get the full list. This guard predates the October merge (commit `64ba851`), but the October scoping made manager accounts the only non-staff callers of this list, so it is now the whole screen.

**Expected:** a manager of the receipt's pyramid (and the receipt's marketer) may read the buyer's username, email and phone numbers on receipts they are allowed to list; everyone else keeps "Access denied".

**Suggested fix:** in `owner_access_required`, or in a dedicated resolver for these four fields, allow the read when the requesting user manages the pyramid of the order's receipt (`AttachmentTransactionManager.objects.filter(manager=user, pyramid_id=receipt.marketer.pyramid_id).exists()`) or is the receipt's marketer. Alternatively return `null` for the field instead of raising, so the rest of the node survives.

---

## B2. `uploadAttachmentTransaction` fails after creating the receipt when the Celery broker is unreachable

**Where:** `checkout_management/graphql/mutations/attachment_transaction.py:147` and `:240` — `transaction.on_commit(lambda pk=instance.pk: read_attachment_file_data.delay(pk))`.

**Repro:** stop Redis (or point `CELERY_BROKER_URL` at an unreachable host) and upload a receipt.

**Observed:** HTTP 400 with

```json
{ "errors": [ { "message": "\nRetry limit exceeded while trying to reconnect to the Celery result store\nbackend. The Celery application must be restarted.\n" } ] }
```

but the `AttachmentTransaction` row **is** created (the `.delay()` call runs after commit). The student sees a failure, retries, and a second receipt row appears for the same order. We saw three rows for one order in the local run.

**Expected:** the mutation returns `success: true` once the row is committed; the OCR job is best-effort.

**Suggested fix:** wrap the `.delay()` in `try/except Exception` with a log line (or use `apply_async(..., retry=False)` and ignore `OperationalError`), and have the manager screen tolerate `done_verification=False` receipts that never got OCR'd. Consider a uniqueness guard (`order`, `attachment` hash) or an "existing pending receipt for this order" check to stop duplicates on retry.

---

## B3. Orders can be created by users who have no registration code

**Where:** `createNewOrderWithBulkOrderDetails` (`order_management/graphql/mutations/mutation.py`).

**Repro:** user with no `PyramidAffiliate` row (never entered a code):

```graphql
{ checkPyramidAffiliate { pk } }        # → "PyramidAffiliate matching query does not exist."
mutation { createNewOrderWithBulkOrderDetails(courseIds: [2]) { success order { pk } } }   # → success: true
```

**Observed:** the order is created. The only thing stopping a no-code user from paying is the frontend router gate, which fails open on any transient error by design.

**Expected (if the registration code is a business requirement):** the order mutation refuses with `{"success": false, "errors": {"message": "Registration code required"}}` when the caller has no affiliate row. If the code is optional, say so in the release note and we will drop the client-side gate.

---

## B4. `reUploadAttachmentTransaction` on someone else's receipt raises instead of returning `Not Found`

**Where:** `checkout_management/graphql/mutations/attachment_transaction.py:205` — `AttachmentTransaction.objects.get(...)` outside a `try`, while the documented `{'message': 'Not Found'}` payload is only produced further down (`:248`).

**Repro:** user A re-uploads with the `id` of user B's receipt.

**Observed:** top-level `"AttachmentTransaction matching query does not exist."` with `data.reUploadAttachmentTransaction: null`.

**Release note says:** `{"success": false, "instance": null, "errors": {"message": "Not Found"}}`.

**Suggested fix:** catch `AttachmentTransaction.DoesNotExist` around the lookup and return the documented payload. (The student web does not mount a re-upload screen today, so no user hits this, but the contract should match the note.)

---

## B5. `createStripeCheckout` crashes when `successUrl` / `cancelUrl` are omitted

**Where:** `checkout_management/graphql/mutations/stripe_checkout_session.py:37-45` — the arguments are declared optional (`graphene.String()`) but `resolve_mutation(cls, root, info, order_id, success_url, cancel_url, currency, **kwargs)` requires them positionally.

**Repro:**

```graphql
mutation { createStripeCheckout(currency: "USD", orderId: 1) { success errors paymentUrl } }
```

**Observed:** `"resolve_mutation() missing 2 required positional arguments: 'success_url' and 'cancel_url'"` as a top-level error.

**Suggested fix:** either `required=True` on both arguments (schema change) or defaults from `settings.STRIPE_REDIRECT_SUCCESS_URL` / `STRIPE_REDIRECT_CANCEL_URL`. Development-only path, low priority, but it is a 500-class error on a documented operation.

---

## B6. Error shapes that differ from the release note

The note says every refusal uses one of four shapes. Two mutations use a fifth:

| Operation | Note says | Actually returned |
|---|---|---|
| `createStripeCheckout`, foreign `orderId` | `errors: [{"order": "Order not found"}]` | `errors: {"nonFieldErrors": [{"order": "Order not found"}]}` |
| `createStripeCheckout`, Stripe off | `errors: [{"stripe": "Stripe payments are not available"}]` | same `nonFieldErrors` wrapping (presumably; not reproduced with Stripe off because the key query already hides the UI) |
| any `@verification_required` mutation, unverified user | not documented | `errors: {"nonFieldErrors": [{"message": "Please verify your account.", "code": "not_verified"}]}` |

The frontend parser now handles the `nonFieldErrors` wrapper, so nothing is broken; please either correct the note or normalise the shape, so the next client does not have to guess.

---

## B7. `createNewOrderWithBulkOrderDetails` reports "already enrolled" as a raised error

**Repro:** a user enrolled in course 1 creates an order containing course 1.

**Observed:** top-level `"User already has valid enrollment in the course ..."` with `data.createNewOrderWithBulkOrderDetails: null`. The message also ends in a literal `...`.

**Expected:** this is a normal business refusal, not a server fault; `{"success": false, "errors": {"message": "You are already enrolled in <course title>"}}` would let clients show it without string-matching a top-level exception (which is what the student web does today, matching `/already has valid enrollment/`). Including the course title would help users with several items in the cart.

---

## B8. `pyramidAttachmentTransactionConfirmation` raises `KeyError` when an input flag is omitted

**Where:** `PyramidAttachmentTransactionConfirmation.mutate_and_get_payload` (`attachment_transaction.py`, around `:430` onward) reads `input['pyramid_retry_please']` and siblings directly.

**Repro:**

```graphql
mutation { pyramidAttachmentTransactionConfirmation(id: 3, userPaid: 270, input: { pyramidManagerEndorse: true }) { success errors } }
```

**Observed:** top-level `"'pyramid_retry_please'"`. The dashboard always sends all three flags, so it does not hit this; any other client (or a future mobile screen) will.

**Suggested fix:** `input.get('pyramid_retry_please', False)` for every optional flag, or make the three flags `required=True` in the input type.

---

## Verified as working (no action)

- `joinPyramidProgram` repeated → same `pk` and `pyramidCode`; `joinPlatform` sent again → "Already exists".
- `uploadAttachmentTransaction` on another user's order → `{"message": "Order not found"}`.
- `createCertificate` on another user's enrollment → `{"message": "User has no valid enrollment ..."}`.
- Second `pyramidAttachmentTransactionConfirmation` on the same receipt → `{"message": "Already approved"}`, no second reward.
- Instructors on `allAlhasifPartnerBalance` / `allEnrollments` → permission error; `allPyramidUsers` → empty edges.
- `stripePublishableKey` → `null` with `STRIPE_ENABLED` unset.

## How the local run was done (for reproduction)

Local SQLite copy of master `56d0e35`, `DEBUG=True`, `SECRET_KEY` set (the new master requires it), Celery forced inline with `CELERY_TASK_ALWAYS_EAGER=True` and `CELERY_TASK_EAGER_PROPAGATES=False` (no Redis available). Personas `p1@e2e.test`…`p10@e2e.test` with: normal, no code, enrolled-then-buying, foreign-order upload, double `joinPlatform`, never referred, wrong code, unverified, foreign re-upload, foreign certificate; plus a manager and an instructor. Concurrent `joinPlatform` could not be reproduced on SQLite ("database is locked"); please keep that case covered by the backend's own tests.
