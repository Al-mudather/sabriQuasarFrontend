import gql from 'graphql-tag'
 
export const GetAllMyNotificationsCount = gql`
query GetAllMyNotifications{
	myNotifications{
    totalCount
  }
}
`
 