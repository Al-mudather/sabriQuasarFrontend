import gql from 'graphql-tag'

export const GetTotalUsersStatistics = gql`
query TotalUsers{
  totalUsers
}
`
