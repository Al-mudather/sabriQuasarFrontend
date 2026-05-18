# Backend bug: cannot fetch a single course-unit's lessons

## Summary

The frontend classroom (course player) is forced to ship the entire
`course → courseunitSet → courseunitcontentSet` tree in one monolithic
query because **no root-level path the back-end exposes for fetching a
single unit's lessons returns the expected data.** Both candidate root
fields exist in the schema introspection, type-check successfully through
graphql-codegen, and the resolver runs without errors — but the response
payload is always `null` (or empty edges) regardless of the unit id we
pass.

Without a working per-unit fetch we can't implement lazy loading in the
classroom rail. Heavy courses (Microbiology has 96 lessons in one unit,
General Pathology has 36, etc.) pay the full payload on every classroom
mount even though only one lesson is being watched at a time.

## Endpoint

`POST https://stc.training/api/graphql/`

## Schema (per published introspection / `src/graphql/generated.ts`)

```graphql
type RootQuery {
  # ...
  courseUnit(id: Int): CourseUnitNode
  courseUnitContent(id: Int): CourseUnitContentNode
  allCourseUnitContentsByCourseUnit(
    courseUnitId: Int
    after: String
    before: String
    first: Int
    last: Int
    offset: Int
    orderBy: [String]
    filters: JSONString
    execludeIds: [Int]
  ): CourseUnitContentNodeConnection
  # ...
}

type CourseUnitNode {
  id: ID!         # Relay Global ID, e.g. "Q291cnNlVW5pdE5vZGU6MjM="
  pk: Int         # Numeric Django primary key, e.g. 23
  title: String
  courseunitcontentSet(after: String, first: Int): CourseUnitContentNodeConnection
  # ...
}
```

## Attempt 1 — `allCourseUnitContentsByCourseUnit(courseUnitId: Int)`

```graphql
query GetCourseUnitContents($unitPk: Int!, $cursor: String, $limit: Int) {
  allCourseUnitContentsByCourseUnit(
    courseUnitId: $unitPk
    after: $cursor
    first: $limit
  ) {
    totalCount
    pageInfo { endCursor, hasNextPage }
    edges {
      node {
        id
        pk
        order
        isFree
        isMandatory
        modelName
        modelValue
        courseUnit { id, pk }
      }
    }
  }
}
```

Variables: `{ "unitPk": 23, "cursor": null, "limit": 50 }`

**Observed response:**
```json
{
  "data": {
    "allCourseUnitContentsByCourseUnit": {
      "totalCount": null,
      "edges": []
    }
  }
}
```

No `errors` array. Just empty edges. Same result for every unit pk we
tried (`23`, others — every Microbiology, General Pathology, etc.).

## Attempt 2 — `courseUnit(id: Int).courseunitcontentSet`

```graphql
query GetCourseUnitContents($unitPk: Int!, $cursor: String, $limit: Int) {
  courseUnit(id: $unitPk) {
    id
    pk
    title
    courseunitcontentSet(after: $cursor, first: $limit) {
      totalCount
      pageInfo { endCursor, hasNextPage }
      edges {
        node {
          id
          pk
          order
          isFree
          isMandatory
          modelName
          modelValue
        }
      }
    }
  }
}
```

Variables: `{ "unitPk": 23, "cursor": null, "limit": 200 }`

**Observed response (captured via our log relay at /tmp/devlog.log):**
```json
{
  "data": { "courseUnit": null }
}
```

```
[classroom][unit-contents] fetch ← {
  "unitPk": 23,
  "unitFound": false,
  "totalCount": null,
  "rawEdgeCount": 0,
  "firstEdgeSample": null
}
```

The pk `23` is a known-valid unit because the SAME backend returns it
nested inside the monolithic `course(id: $coursePk).courseunitSet.edges[*].node.pk`
response — i.e. the unit exists, it's owned by the course, the
authenticated user has access. But the `courseUnit(id: 23)` resolver
returns `null`.

We tried passing the Relay Global ID instead (`"Q291cnNlVW5pdE5vZGU6MjM="`),
but the schema strictly types `id: Int` and graphql-codegen rejects the
query at validation time, so we cannot wire it up from the FE.

## Attempt 3 — single content lookup via `courseUnitContent(id: Int)`

```graphql
query GetCourseUnitContent($contentPk: Int!) {
  courseUnitContent(id: $contentPk) {
    id
    pk
    modelName
    modelValue
    courseUnit { id, pk }
  }
}
```

Not exercised in production — we backed out before exercising it because
it shares the same root-arg pattern as `courseUnit(id: Int)` and we
expected the same null result. Backend team please confirm whether this
one actually resolves.

## What works (the heavy monolithic path)

```graphql
query GetCourseClassroomBootstrap($coursePk: Int) {
  course(id: $coursePk) {
    id
    pk
    title
    cover
    telegramLink
    hasCertificate
    courseunitSet {
      edges {
        node {
          id
          pk
          title
          order
          courseunitcontentSet(first: 50) {
            totalCount
            edges {
              node {
                id
                pk
                order
                isFree
                isMandatory
                modelName
                modelValue
              }
            }
          }
        }
      }
    }
  }
}
```

This returns the expected data and is what the FE currently uses. The
problem: it ships every unit's first 50 lessons in a single payload
even when the user only opens one unit. For a 5-unit course with
50 + 36 + 24 + 18 + 10 = 138 lessons, every classroom mount carries
138 × `modelValue` blobs (each `modelValue` is a JSON-string holding
video / quiz / file metadata — typically 0.5-2 KB per row).

## What we want from the back-end team

One of the following — whichever fits the existing resolver architecture:

1. **Fix `courseUnit(id: Int)`** to return the matching `CourseUnitNode`
   when the int matches `CourseUnit.pk`. Today it returns `null` for
   every pk we try.

2. **Fix `allCourseUnitContentsByCourseUnit(courseUnitId: Int)`** to
   actually filter the connection by the supplied unit pk. Today it
   returns an empty edges list regardless of the value.

3. **Or expose a new field** explicitly intended for lazy classroom
   loading, e.g. `courseUnitContentsByUnitPk(coursePk: Int!, unitPk: Int!): CourseUnitContentNodeConnection`
   with cursor pagination (`first`, `after`, `pageInfo.{endCursor,hasNextPage}`).

Any of those unblocks per-unit lazy fetching in the classroom rail.

## Reproduction

```bash
curl -sS -X POST https://stc.training/api/graphql/ \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <user-token>' \
  --data '{
    "query":"query Probe($unitPk: Int!){ courseUnit(id: $unitPk) { id pk title courseunitcontentSet(first: 5) { totalCount edges { node { pk modelName } } } } }",
    "variables": { "unitPk": 23 }
  }'
```

Replace `23` with any unit pk that the same user can reach via
`course(id: <coursePk>).courseunitSet.edges[*].node.pk`. Expect:
`{"data":{"courseUnit":null}}`. Expected response: a populated
`CourseUnitNode` with its `courseunitcontentSet` lessons.

## FE workaround currently shipped

`src/graphql/course_management/query/GetCourseClassroomBootstrap.js`
fetches the slim version of the monolithic query (drops the
instructor / language / pricing subtree that the classroom UI does not
read). This trims ~20-30% of bytes without changing the underlying
architecture. Once the back-end exposes a working per-unit lookup we
will move to true lazy hydration.
