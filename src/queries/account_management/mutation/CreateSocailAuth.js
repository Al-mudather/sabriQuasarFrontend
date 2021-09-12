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
        phoneNumber,
        phoneNumber2,
        phoneNumber3,
        verified,
        isAttachmentTransactionManager
        isPyramidAdmin
        isPyramidMarketer
        userCurrency
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
