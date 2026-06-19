import gql from 'graphql-tag'

// Lazy per-unit contents fetched by the classroom CurriculumRail when the
// user expands a unit. The slim bootstrap (GetCourseByIDSlim) intentionally
// omits the courseunitcontentSet edges so the initial classroom payload
// stays small; this query backfills a single unit's lessons on demand.
//
// `first: 200` is the practical "all" — the heaviest course unit in the
// catalogue today has 97 lessons, so pagination is plumbed but rarely
// exercised. We still expose cursor + hasNextPage so a future page can fetch
// more without a schema change.
export const GetCourseUnitContents = gql`
query GetCourseUnitContents($unitPk: Int!, $cursor: String, $limit: Int) {
  allCourseUnitContentsByCourseUnit(courseUnitId: $unitPk, after: $cursor, first: $limit) {
    totalCount,
    pageInfo {
      endCursor,
      hasNextPage
    },
    edges {
      node {
        id,
        pk,
        order,
        isFree,
        isMandatory,
        modelName,
        modelValue
      }
    }
  }
}
`
