import gql from 'graphql-tag'

export const AllCourseUnitContentsByCourseContentFile = gql`
query AllCourseUnitContentsByCourseContentFile($courseId: Int!){
  allCourseUnitContentsByCourseContentFile(courseId: $courseId){
    edges {
        node {
            pk
            modelName
            modelValue
        }
    }
  }
}
`
