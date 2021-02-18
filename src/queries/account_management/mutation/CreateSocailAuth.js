import gql from 'graphql-tag'

export const SocialAuth = gql`
mutation SocialAuth($provider: String!, $accessToken: String!, $email: String!) {
  socialAuth(provider: $provider, accessToken: $accessToken, email: $email) {
    
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
