import gql from 'graphql-tag'

export const CreateNewOrderWithBulkOrderDetails = gql`
mutation CreateNewOrderWithBulkOrderDetails($courseIds: [Int!]!){
  createNewOrderWithBulkOrderDetails(courseIds: $courseIds) {
    success,
    errors,
    order {
      pk
    }

  }
}
`
