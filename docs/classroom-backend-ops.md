# Classroom Backend Operations — Spec

Audience: backend engineer implementing the internal classroom. This document
enumerates every new GraphQL operation the frontend scaffolded for the
classroom feature, with full queries/mutations, argument types, response
shapes, semantics, auth requirements, and acceptance criteria.

All ops listed here are **NEW** — they do not exist on `https://stc.training/api/graphql/`
as of the snapshot captured in `src/graphql/generated.ts` on this branch.
Frontend work has landed behind scaffolds (`// BACKEND:` markers in
`src/graphql/classroom/**` and `src/types/classroom/types.ts`) and will
type-error cleanly once these schema additions ship and codegen runs.

---

## Table of contents

1. [Overview](#overview)
2. [Conventions](#conventions)
3. [Types](#types)
   - [QuizAnswerInput](#quizanswerinput)
   - [VideoPlaybackInfo (object type)](#videoplaybackinfo-object-type)
   - [ResourceNode / AllResourcesForEnrollmentConnection](#resourcenode--allresourcesforenrollmentconnection)
   - [Error shape](#error-shape)
4. [Ops](#ops)
   1. [Query: enrollment(enrollmentPk)](#query-enrollmentenrollmentpk)
   2. [Query: contentQuiz(contentPk)](#query-contentquizcontentpk)
   3. [Query: allResourcesForEnrollment(enrollmentPk)](#query-allresourcesforenrollmentenrollmentpk)
   4. [Query: videoPlaybackInfo(contentPk)](#query-videoplaybackinfocontentpk)
   5. [Mutation: markContentBegin(contentPk)](#mutation-markcontentbegincontentpk)
   6. [Mutation: markContentComplete(contentPk)](#mutation-markcontentcompletecontentpk)
   7. [Mutation: submitQuizAttempt(contentPk, answers)](#mutation-submitquizattemptcontentpk-answers)
   8. [Mutation: submitEnrollmentFeedback(enrollmentPk, rating, feedback)](#mutation-submitenrollmentfeedbackenrollmentpk-rating-feedback)
5. [Open questions](#open-questions)

---

## Overview

The internal classroom exposes a learner-facing "player" for an enrollment:
a left rail listing units/contents, a main stage that renders the current
content (video, quiz, article, file, or live meeting), and actions to mark
progress and collect feedback.

The frontend already consumes the enrollment via the legacy
`enrollmentByCourseForCurrentUser(courseId: Int!)` query for the catalog,
but the classroom uses the enrollment's own primary key (`enrollmentPk`)
because it's already on the URL and avoids the learner having to re-select
their enrollment if they have multiple for the same course (e.g. batched
cohorts).

All new ops:

- Must require authentication (`@login_required` or equivalent).
- Must authorize against `(user, enrollment)` — never trust `enrollmentPk`
  or `contentPk` alone; always verify the requester owns the enrollment
  and the content belongs to the enrollment's course.
- Must be idempotent where listed (see per-op acceptance).
- Must return `success: Boolean` and `errors: ExpectedErrorType` on
  mutations, matching the project's existing `graphene-django-cud` style
  seen in e.g. `tokenAuth` (see `LoginUserWithEmail.js`).

---

## Conventions

- Relay connections use `edges { node { ... } }` with `pageInfo` when
  paginated. Where the dataset is naturally small (all units of one course)
  the frontend does not request `pageInfo`; backend should still paginate
  defensively (default `first: 100`).
- All FK `pk` fields are `Int`, all ids are global Relay `ID`.
- Errors follow the existing `Scalars['ExpectedErrorType']` scalar — an
  opaque JSON blob the FE renders verbatim today.
- Time fields are `DateTime` (ISO-8601 UTC) and `Time` for the
  `videoTime` duration-of-day on `ContentVideoNode`.

---

## Types

### QuizAnswerInput

```graphql
input QuizAnswerInput {
  questionPk: Int!
  answerPk: Int!
}
```

Used by `submitQuizAttempt.answers`. Frontend TS shape:

```ts
type QuizAnswerInput = { questionPk: number; answerPk: number }
```

One entry per answered question. If the quiz supports multi-select
answers per question (not currently rendered), extend to
`answerPks: [Int!]!` in a follow-up — do NOT overload `answerPk`.

### VideoPlaybackInfo (object type)

```graphql
type VideoPlaybackInfo {
  # Discriminator. One of: "vimeo" | "vdocipher" | "meeting"
  kind: String!
  # Vimeo
  videoId: String
  hash: String
  # VdoCipher
  otp: String
  playbackInfo: String
  # Meetings
  embedUrl: String
  meetingType: String  # "zoom" | "jitsi" | ...
}
```

Every field other than `kind` is nullable; the backend fills only the
subset relevant to `kind`. The frontend narrows via the discriminant in
`src/composables/classroom/useVideoPlaybackInfo.ts`.

### ResourceNode / AllResourcesForEnrollmentConnection

```graphql
type ResourceNode implements Node {
  id: ID!
  pk: Int
  file: String       # absolute URL to the download
  title: String
  unit: CourseUnitNode
}

type ResourceNodeConnection {
  pageInfo: PageInfo!
  edges: [ResourceNodeEdge]!
  totalCount: Int
  edgeCount: Int
}
type ResourceNodeEdge { cursor: String!, node: ResourceNode }
```

Implementation note: this is a **view** over `ContentFileNode`, joined
back to its owning `CourseUnitContentNode -> CourseUnitNode`. Alternatively,
the backend may simply reuse `ContentFileNode` with an added `unit`
resolver — whichever is cheaper; the frontend only needs
`{ id, pk, file, title, unit { id, pk, title } }`.

### Error shape

Reuse the existing `Scalars['ExpectedErrorType']` scalar — the FE just
passes it through to the error-toast component.

---

## Ops

### Query: `enrollment(enrollmentPk)`

**Purpose**: Fetch a single enrollment (and the entire curriculum tree +
progress rows) by its primary key, for the authenticated learner.

**Why a new field?** The existing `enrollment(id: ID!)` takes the Relay
global id and requires the FE to double-encode the id in the URL. The
classroom router already has `enrollmentPk` on the route.

```graphql
type RootQuery {
  # Returns the enrollment by pk. Requires authentication. Returns null
  # (not an error) if the enrollment exists but belongs to another user,
  # so callers cannot enumerate pks.
  enrollment(enrollmentPk: Int!): EnrollmentNode
}
```

**Frontend query:**

```graphql
query GetClassroomEnrollment($enrollmentPk: Int!) {
  enrollment(enrollmentPk: $enrollmentPk) {
    id
    pk
    course {
      id
      pk
      title
      cover
      courseunitSet {
        edges {
          node {
            id
            pk
            title
            order
            courseunitcontentSet {
              edges {
                node {
                  id
                  pk
                  isFree
                  isMandatory
                  modelName
                  content {
                    __typename
                    ... on ContentVideoNode {
                      id pk title videoType videoMetadata
                      cipherIframe
                      isMeeting meetingType videoTime
                    }
                    ... on ContentQuizNode { id pk quizTitle isMandatory }
                    ... on ContentArticleNode { id pk articleTitle article }
                    ... on ContentFileNode { id pk title attachment }
                  }
                }
              }
            }
          }
        }
      }
    }
    learningprogressSet {
      edges {
        node {
          id
          pk
          begin
          complete
          courseUnitContent { pk }
        }
      }
    }
  }
}
```

**Semantics / acceptance:**

- Returns `null` if not found OR if found-but-not-owned (no error leak).
- Orders `courseunitSet` by `order ASC, pk ASC`.
- Orders `courseunitcontentSet` by `order ASC, pk ASC`.
- Resolves `content` to the concrete variant of `ContentUnion`.
- `learningprogressSet` is scoped to `(enrollment, user)` — do NOT
  include other learners' progress rows even if somehow joined.
- **Auth**: login required. 401 if anonymous, null if not-owned.

### Query: `contentQuiz(contentPk)`

**Purpose**: Fetch the quiz definition (questions + answer options) for a
given content-pk. Must **NOT** include `isCorrect` or `why` on the answer
rows — correctness ships only via `submitQuizAttempt.perQuestion`.

```graphql
type RootQuery {
  contentQuiz(contentPk: Int!): ContentQuizNode
}
```

**Frontend query:**

```graphql
query GetContentQuizDetails($contentPk: Int!) {
  contentQuiz(contentPk: $contentPk) {
    id
    pk
    quizTitle
    isMandatory
    contentquizquestionSet {
      edges {
        node {
          id
          pk
          question
          imageQuestion
          order
          contentquizquestionanswerSet {
            edges {
              node {
                id
                pk
                answer
                order
              }
            }
          }
        }
      }
    }
  }
}
```

**Semantics / acceptance:**

- The server MUST filter `isCorrect` and `why` out of the answer rows on
  this endpoint (or use a dedicated `LearnerContentQuizAnswerNode` type
  that simply doesn't declare those fields).
- Questions ordered by `order ASC, pk ASC`; answers ordered likewise.
- Resolves `contentPk` → `CourseUnitContent.content` where
  `content.__typename == 'ContentQuizNode'`.
- **Auth**: login required; learner must be enrolled in the quiz's course.

### Query: `allResourcesForEnrollment(enrollmentPk)`

**Purpose**: One flat list of every `ContentFileNode` attached to any
unit of the enrollment's course, for the classroom "Resources" tab.

```graphql
type RootQuery {
  allResourcesForEnrollment(enrollmentPk: Int!): ResourceNodeConnection
}
```

**Frontend query:**

```graphql
query AllResourcesForEnrollment($enrollmentPk: Int!) {
  allResourcesForEnrollment(enrollmentPk: $enrollmentPk) {
    edges {
      node {
        id
        pk
        file
        title
        unit { id pk title }
      }
    }
  }
}
```

**Semantics / acceptance:**

- Includes only content-files the learner is allowed to see (e.g. hide
  non-free resources if the enrollment is expired per
  `EnrollmentNode.isExpired`).
- Order: unit `order`, then file `order`, then pk.
- `file` is a URL. If files are stored on private S3, resolver issues a
  short-lived signed URL per request (TTL 10 min).
- **Auth**: login required; learner owns the enrollment.

### Query: `videoPlaybackInfo(contentPk)`

**Purpose**: Issue a short-lived playback credential for a content-video
without leaking provider secrets into the curriculum tree. This is
fetched on demand, on the player page, and never cached (`fetchPolicy:
network-only`).

```graphql
type RootQuery {
  videoPlaybackInfo(contentPk: Int!): VideoPlaybackInfo
}
```

**Frontend query:**

```graphql
query GetVideoPlaybackInfo($contentPk: Int!) {
  videoPlaybackInfo(contentPk: $contentPk) {
    kind
    videoId
    hash
    otp
    playbackInfo
    hlsUrl
    keyUrl
    embedUrl
    meetingType
  }
}
```

**Semantics / acceptance:**

- Discriminator-based shape. Exactly one provider's subset of fields is
  non-null per response, matching `kind`:
  - `"vimeo"`     → `videoId`, optional `hash`
  - `"vdocipher"` → `otp`, `playbackInfo`
  - `"meeting"`   → `embedUrl`, `meetingType`
- VdoCipher OTP TTL ≤ 5 minutes (VdoCipher default).
- For meetings, `embedUrl` may be a join URL for the learner with SSO
  token baked in — redact from server logs.
- Returns `null` if the content is not a video/meeting, or the learner
  isn't entitled.
- **Auth**: login required; learner owns an enrollment covering the
  video's course.

### Mutation: `markContentBegin(contentPk)`

**Purpose**: Upsert the `LearningProgressNode` row for `(user, content)`
with `begin = now`. Called when a video first plays, when an article is
opened, or when a quiz's question list is rendered.

```graphql
type MarkContentBeginPayload {
  success: Boolean
  errors: ExpectedErrorType
  learningProgress: LearningProgressNode
}

type RootMutation {
  markContentBegin(contentPk: Int!): MarkContentBeginPayload
}
```

**Frontend mutation:**

```graphql
mutation MarkContentBegin($contentPk: Int!) {
  markContentBegin(contentPk: $contentPk) {
    success
    errors
    learningProgress {
      id
      pk
      begin
      complete
      courseUnitContent { pk }
    }
  }
}
```

**Semantics / acceptance:**

- **Idempotent**: if a row exists, return it unchanged. Do NOT touch
  `begin` on a second call (keep the first-play timestamp).
- Never modify `complete` here.
- **Auth**: login required; learner owns an enrollment covering the
  content's course.
- Concurrency: safe under duplicate mutation races (e.g. player firing on
  `playing` AND `timeupdate`). Use `get_or_create` or a unique-together
  `(enrollment, courseUnitContent)` constraint.

### Mutation: `markContentComplete(contentPk)`

**Purpose**: Stamp `complete = now` on the `LearningProgressNode`. Sets
`begin` too if it was not previously set.

```graphql
type MarkContentCompletePayload {
  success: Boolean
  errors: ExpectedErrorType
  learningProgress: LearningProgressNode
  enrollment: EnrollmentNode  # convenience for FE to refetch totals
}

type RootMutation {
  markContentComplete(contentPk: Int!): MarkContentCompletePayload
}
```

**Frontend mutation:**

```graphql
mutation MarkContentComplete($contentPk: Int!) {
  markContentComplete(contentPk: $contentPk) {
    success
    errors
    learningProgress {
      id pk begin complete courseUnitContent { pk }
    }
    enrollment { id pk }
  }
}
```

**Semantics / acceptance:**

- **Idempotent**: re-calling does NOT overwrite an earlier `complete`.
- Sets `begin` if null (learner skipped the begin call).
- Triggers downstream side effects:
  - If this completes the last mandatory content of the enrollment,
    issue certificate eligibility check.
  - Emit a `learning_progress.completed` domain event (the FE doesn't
    consume this; noted for other services).
- **Auth**: login required; learner owns the enrollment.

### Mutation: `submitQuizAttempt(contentPk, answers)`

**Purpose**: Grade a quiz submission and return per-question correctness.

```graphql
type SubmitQuizAttemptPerQuestion {
  questionPk: Int!
  isCorrect: Boolean!
  correctAnswerPk: Int     # null if the question is multi-correct (future)
}

type SubmitQuizAttemptPayload {
  success: Boolean
  errors: ExpectedErrorType
  score: Int               # number of correct answers
  total: Int               # total questions in the quiz
  passed: Boolean          # server-defined pass threshold
  completesContent: Boolean  # did this submission also flip LearningProgress.complete?
  perQuestion: [SubmitQuizAttemptPerQuestion!]
}

type RootMutation {
  submitQuizAttempt(
    contentPk: Int!
    answers: [QuizAnswerInput!]!
  ): SubmitQuizAttemptPayload
}
```

**Frontend mutation:**

```graphql
mutation SubmitQuizAttempt($contentPk: Int!, $answers: [QuizAnswerInput!]!) {
  submitQuizAttempt(contentPk: $contentPk, answers: $answers) {
    success errors score total passed completesContent
    perQuestion { questionPk isCorrect correctAnswerPk }
  }
}
```

**Semantics / acceptance:**

- Persists one `CourseQuizSolution` per (user, enrollment, attempt).
- Pass threshold: configurable per course; default 70%.
- If `passed && quiz.isMandatory`, also marks the content as complete
  (same effect as `markContentComplete(contentPk)`), and
  `completesContent` is true.
- Unanswered questions count as incorrect; the FE MAY omit them from
  `answers` and the server treats the omission as `isCorrect: false`.
- **Auth**: login required; learner owns the enrollment.
- Rate limit: 1 submission per 3 seconds per (user, contentPk) to stop
  brute-force answer-enumeration.

### Mutation: `submitEnrollmentFeedback(enrollmentPk, rating, feedback)`

**Purpose**: Collect the rating/feedback shown after the learner
completes the course.

```graphql
type EnrollmentFeedbackNode implements Node {
  id: ID!
  pk: Int
  rating: Int
  feedback: String
  created: DateTime
  updated: DateTime
}

type SubmitEnrollmentFeedbackPayload {
  success: Boolean
  errors: ExpectedErrorType
  enrollmentFeedback: EnrollmentFeedbackNode
}

type RootMutation {
  submitEnrollmentFeedback(
    enrollmentPk: Int!
    rating: Int!
    feedback: String
  ): SubmitEnrollmentFeedbackPayload
}
```

**Frontend mutation:**

```graphql
mutation SubmitEnrollmentFeedback(
  $enrollmentPk: Int!
  $rating: Int!
  $feedback: String
) {
  submitEnrollmentFeedback(
    enrollmentPk: $enrollmentPk
    rating: $rating
    feedback: $feedback
  ) {
    success
    errors
    enrollmentFeedback { id pk rating feedback }
  }
}
```

**Semantics / acceptance:**

- `rating` MUST be in `[1, 5]`. Otherwise return `success: false` with
  an error shape.
- **Upsert**, not insert-only: (user, enrollment) has at most one
  feedback row; subsequent calls update it.
- `feedback` optional, trimmed, max length 2000 chars.
- **Auth**: login required; learner owns the enrollment.

---

## Open questions

1. **Relay id vs pk on `enrollment`**: Do we add `enrollment(enrollmentPk: Int!)`
   as a sibling to the existing `enrollment(id: ID!)`, or rename? Suggest
   sibling to avoid breaking any existing consumer.

2. **Multi-answer quiz questions**: `QuizAnswerInput.answerPk` is singular.
   Are there quizzes with multiple correct answers per question? If yes,
   we need `answerPks: [Int!]!` before GA — breaking the input shape later
   is painful.

3. **Quiz attempt history**: `submitQuizAttempt` currently doesn't return
   attempt number or prior-best score. Do learners see their history? If
   yes, we need a `attempts: [QuizAttemptNode]` list on the content query
   (scoped to the learner).

4. **Resources signed URL TTL**: 10 min plausible but will break if the
   learner opens a new tab with a stale list and clicks much later. Should
   the FE re-fetch `allResourcesForEnrollment` on download click, or should
   the URL be long-lived?

5. **Video playback for meetings**: Does `embedUrl` include the learner's
   SSO token, or is that a separate handshake endpoint? If the former,
   confirm it's safe to include in an Apollo response (server-side
   `network-only` caching is already in place).

6. **Progress on non-leaf content types (`CourseUnitNode` appears in
   `ContentUnion`)**: A unit content can point at another unit (nested).
   The FE currently ignores that case. Confirm whether the classroom needs
   to traverse those for progress purposes.

7. **Enrollment expiry**: `EnrollmentNode.isExpired` is already on the
   schema. Should the mutations above 403 if `isExpired == true`, or
   allow read-only continued access? Current FE assumes they succeed.

8. **i18n of quiz `question` / `answer`**: Text currently not translated
   server-side. Out of scope for this classroom milestone; flagged for
   tracking.
