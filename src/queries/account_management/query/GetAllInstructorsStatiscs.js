import gql from 'graphql-tag'

export const GetAllInstructorsStatiscs = gql`
query GetAllInstructors {
  allInstructors {
    totalCount,
    edgeCount
  }
}
`
