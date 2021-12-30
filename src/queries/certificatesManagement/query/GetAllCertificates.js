import gql from 'graphql-tag'

export const AllCertificates = gql`
query AllCertificates($filters: JSONString) {

  allCertificates(
    filters: $filters
  ) {

      edges {

          node {
            id
            pk
            enrollment {
              pk
              id
              course {
                id
                pk
                title
              }
            }
            batch {
              id
              pk
              batchName
              courseName
            }
            user {
              id
              pk
              email
              fullName
            }
            serial
            startDate
            endDate
            issueDate
            period
            totalHours
            isManual
            isReady
            isPrinted
            isPrintable
            #
            created
            updated

          }

      }

  }

}
`
