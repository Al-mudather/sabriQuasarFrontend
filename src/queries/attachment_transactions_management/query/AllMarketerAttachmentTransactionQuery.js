import gql from 'graphql-tag'

export const AllMarketerAttachmentTransaction = gql`
query AllMarketerAttachmentTransaction {

  allMarketerAttachmentTransaction {

      edges {

          node {

            pk
            order {
              pk
              totalAmount
              invoiceNumber
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

}
`
