import gql from 'graphql-tag'

export const JoinPlatform = gql`
mutation JoinPlatform($marketingCode: String!, $input: JoinPlatformInput!) {

  joinPlatform(marketingCode:$marketingCode, input: $input) {

      success,
      errors,
      pyramidAffiliate: instance {
        pk,
        id,
        user {
          id,
          pk,
          email
        }
      },
      clientMutationId

  }

}
`
