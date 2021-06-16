import gql from 'graphql-tag'

export const GetTotalUsers = gql`
query TotalUsers{
  totalUsers
}
`
