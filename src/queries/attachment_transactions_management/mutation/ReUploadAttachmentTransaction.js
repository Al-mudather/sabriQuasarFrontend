import gql from 'graphql-tag'

export const ReUploadAttachmentTransaction = gql`
mutation ReUploadAttachmentTransaction(
  $id: Int!, 
  $input: ReUploadAttachmentTransactionInput!
) {

  reUploadAttachmentTransaction(
      id: $id, 
      input: $input
  ) {

      success
      errors
      attachmentTransaction: instance {

        pk
        order {
          pk
        }
        attachment
        marketer {
          pk
        }
        marketerEndorse
        retryPlease
        pyramidManager {
          pk
        }
        pyramidManagerEndorse
        pyramidRetryPlease
        doneVerification
        # time stamping
        created
        updated

      }

  }

}
`
