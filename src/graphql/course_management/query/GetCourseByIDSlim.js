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
//
// EXTERNAL units: a course unit can be a *reference* to another unit
// (`isExternal: true`) — it carries NO content of its own; its lessons live on
// the linked `external` unit. The admin + the old classroom resolve content via
// `external.courseunitcontentSet`. We therefore select `isExternal` + the
// external unit's pk + its content count, so the bootstrap can point content
// loading at the unit that actually owns the lessons (otherwise an external
// unit looks empty → the classroom hangs with nothing to play). See
// useCourseBootstrap for the resolution.
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
          isExternal,
          external {
            id,
            pk,
            courseunitcontentSet {
              totalCount
            }
          },
          courseunitcontentSet {
            totalCount
          }
        }
      }
    }
  }
}
`
