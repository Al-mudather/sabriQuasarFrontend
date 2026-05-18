import gql from 'graphql-tag'

// Classroom-specific bootstrap. Same nested shape the original GetCourseByID
// returns (which we know works — courseunitSet.edges[*].node.courseunitcontentSet.edges
// is the only reliable per-unit lesson path the back-end exposes), but
// stripped to ONLY the fields the classroom UI reads:
//
//   course meta:  id, pk, title, cover, telegramLink, hasCertificate
//   per unit:     id, pk, title, order, courseunitcontentSet.totalCount
//   per lesson:   id, pk, order, isFree, isMandatory, modelName, modelValue
//
// Everything else the legacy GetCourseByID carried (courseinstructorSet,
// courseSpeciality, courseLanguage, brief, isPaid, enrollmentCount,
// courseFee, courseFeeInSdg, currency, profile, courseHours, enrolled) is
// dropped here. The CourseDetails landing page still uses the full
// GetCourseByID for its public marketing view.
//
// $unitContentsLimit caps the inner connection (back-end accepts up to 50
// rows per page). Microbiology-style 90+ lesson units are truncated to
// the first 50 until we plumb cursor pagination per unit in a follow-up.
export const GetCourseClassroomBootstrap = gql`
query GetCourseClassroomBootstrap($coursePk: Int, $unitContentsLimit: Int = 50) {
  course(id: $coursePk) {
    id,
    pk,
    title,
    cover,
    telegramLink,
    hasCertificate,
    courseunitSet {
      edges {
        node {
          id,
          pk,
          title,
          order,
          courseunitcontentSet(first: $unitContentsLimit) {
            totalCount,
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
    }
  }
}
`
