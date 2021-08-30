import gql from 'graphql-tag'
 
export const MyAttachmentTransactions = gql`
query MyAttachmentTransactions {

  myAttachmentTransactions {

      edges {

          node {

            pk
            order {
              pk
              orderTotal
              totalAmount
              invoiceNumber
              currency
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
