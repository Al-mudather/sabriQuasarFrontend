import gql from 'graphql-tag'

export const SocialAuth = gql`
mutation SocialAuth($provider: String!, $accessToken: String!, $email: String!) {
  socialAuth(provider: $provider, accessToken: $accessToken, email: $email) {
    
    social{
    
      user{
        email
        fullName,
        username,
        email,
        firstName,
        lastName,
        fullName,
        verified,
        isAttachmentTransactionManager
        isPyramidAdmin
        isPyramidMarketer
        isInstructor
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
