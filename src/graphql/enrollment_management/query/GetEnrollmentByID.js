import gql from 'graphql-tag'

export const GetEnrollmentByID = gql`
query GetEnrollment($id: Int!){
  enrollment(id: $id) {
    pk
  }
}
`
