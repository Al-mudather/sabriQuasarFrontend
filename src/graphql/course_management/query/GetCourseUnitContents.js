import gql from 'graphql-tag'

// Lazy per-unit contents fetched by the classroom CurriculumRail when the
// user expands a unit. The slim bootstrap (GetCourseByIDSlim) intentionally
// omits the courseunitcontentSet edges so the initial classroom payload
// stays small; this query backfills a single unit's lessons on demand.
//
// We go through `courseUnit(id: $unitPk).courseunitcontentSet` (the same
// path the old monolithic GetCourseByID used to traverse) instead of the
// root-level `allCourseUnitContentsByCourseUnit(courseUnitId:)`. The
// connection-level filter is brand-new to this codebase and was returning
// empty results in practice — the unit-node-rooted query has been working
// for as long as the classroom has existed and is the safe choice.
export const GetCourseUnitContents = gql`
query GetCourseUnitContents($unitPk: Int!, $cursor: String, $limit: Int) {
  courseUnit(id: $unitPk) {
    id,
    pk,
    title,
    courseunitcontentSet(after: $cursor, first: $limit) {
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
}
`
