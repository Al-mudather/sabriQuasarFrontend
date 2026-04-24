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
    enrollmentCount
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
          courseunitcontentSet {
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
