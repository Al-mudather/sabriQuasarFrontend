import gql from 'graphql-tag'

export const GetCourseByID = gql`
query GetCourseByID($coursePk:Int) {
  course(id:$coursePk) {
    id,
    pk,
    title,
    courseFee,
    brief,
    isPaid,
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
