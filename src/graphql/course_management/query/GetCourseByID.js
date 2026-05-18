import gql from 'graphql-tag'

// $unitContentsLimit caps the inner `courseunitcontentSet` per unit so a
// course with several 50+ lesson units doesn't ship the whole tree in a
// single payload. The classroom is the heavy consumer; CourseDetails
// only reads each unit's `totalCount` (not the inner edges), so it stays
// correct even when the inner connection is capped. Default of 50 mirrors
// the backend page-size cap we hit empirically.
export const GetCourseByID = gql`
query GetCourseByID($coursePk:Int, $unitContentsLimit: Int = 50) {
  course(id:$coursePk) {
    id,
    pk,
    courseHours,
    title,
    profile,
    cover,
    courseFee,
    courseFeeInSdg,
    currency,
    brief,
    isPaid,
    enrollmentCount,
    telegramLink,
    hasCertificate,
    courseinstructorSet {
      edges {
        node {
          id,
          pk,
          instructor {
            id,
            qualification,
            image,
            user {
              id,
              username,
              firstName,
              lastName
            }
          }
        }
      }
    },
    courseunitSet {
      edges {
        node{
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
    },
    enrolled,
    courseSpeciality {
      id,
      pk,
      speciality
    },
    courseLanguage{
      id,
      pk,
      languageName,
      languageCode
    }
  }
}
`
