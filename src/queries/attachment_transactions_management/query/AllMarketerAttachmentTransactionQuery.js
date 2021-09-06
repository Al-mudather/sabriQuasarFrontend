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
              orderTotal
              invoiceNumber
              currency
              user {
                pk
                username
                email,
                fullName
              }
              orderdetailsSet {
                edges {
                  node {
                    pk,
                    course{
                      pk,
                      title
                    }
                  }
                }
              }
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
