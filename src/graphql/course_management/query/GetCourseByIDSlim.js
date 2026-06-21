import gql from 'graphql-tag'

// Slim variant of GetCourseByID used by the classroom (course player) only.
//
// The shared GetCourseByID also fans out into the CourseDetails landing page,
// which renders the instructor block — so it has to keep the deep
// courseinstructorSet.instructor.user subtree. The classroom does NOT render
// instructor metadata or the eager per-unit content list, so we route it
// through this slim operation instead. Two structural omissions vs the full
// query:
//
//   1. courseunitcontentSet.edges is gone. Only totalCount remains per unit
//      so the rail can render "N lessons" chips before contents lazy-load.
//   2. courseinstructorSet is gone entirely. This is also the historical
//      source of the AUTHENTICATION_ERROR-on-anonymous failure mode
//      (instructor.user.username is restricted for anonymous viewers).
//
// Lessons per unit are fetched on-demand via GetCourseUnitContents when the
// CurriculumRail accordion expands that unit.
export const GetCourseByIDSlim = gql`
query GetCourseByIDSlim($coursePk:Int) {
  course(id:$coursePk) {
    id,
    pk,
    title,
    telegramLink,
    hasCertificate,
    courseunitSet {
      edges {
        node {
          id,
          pk,
          title,
          order,
          courseunitcontentSet {
            totalCount
          }
        }
      }
    }
  }
}
`
