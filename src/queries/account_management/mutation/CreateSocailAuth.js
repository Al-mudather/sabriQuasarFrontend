import gql from 'graphql-tag'

export const SocialAuth = gql`
mutation SocialAuth($provider: String!, $accessToken: String!) {
  socialAuth(provider: $provider, accessToken: $accessToken) {
    
    social{
    
      user{
        email
        fullName
      }
      
      provider
      uid
      extraData
      created
      modified
      
    }
    
    token
  
  }
}
`
