import gql from 'graphql-tag'

export const MarketerConfirmAttachmentTransaction = gql`
mutation MarketerAttachmentTransactionConfirmation(
  $id: Int!,
  $input: MarketerAttachmentTransactionConfirmationInput!,
) {

  marketerAttachmentTransactionConfirmation(
      id: $id,
      input: $input, 
  ) {

    success
    errors

  }

}
`
