import gql from 'graphql-tag'

export const GetCourseByID = gql`
query GetCourseByID($coursePk:Int) {
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
          courseunitcontentSet {
            totalCount,
            edges {
              node {
                id,
                modelName,
                modelValue
              }
            }
          }
        }
      }
    },
    courseSpeciality {
      id,
      pk
    }, 
    enrollmentSet{
      edgeCount,
      totalCount
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
