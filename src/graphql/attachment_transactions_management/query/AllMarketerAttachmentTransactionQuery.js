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
              # Only fields a marketer may read: username, email and phone numbers
              # are owner/staff-only on the backend, and one denied field nulls
              # the whole (non-null) user, order and transaction row.
              user {
                pk
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
