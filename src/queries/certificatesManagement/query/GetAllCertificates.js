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
              user {
                id
                pk
                email
                fullName
              }
              
              course {
                id
                pk
                title
              }
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
