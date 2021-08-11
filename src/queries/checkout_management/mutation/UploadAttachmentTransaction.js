import gql from 'graphql-tag'

export const UploadAttachmentTransaction = gql`
mutation UploadAttachmentTransaction($order: Int!, $attachment: Upload!) {

  uploadAttachmentTransaction(order: $order, attachment: $attachment) {

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
