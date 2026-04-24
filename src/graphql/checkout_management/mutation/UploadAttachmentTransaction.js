import gql from 'graphql-tag'

export const UploadAttachmentTransaction = gql`
mutation UploadAttachmentTransaction($input: UploadAttachmentTransactionInput!) {

  uploadAttachmentTransaction(input: $input) {

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
