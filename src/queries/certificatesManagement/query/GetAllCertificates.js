import gql from 'graphql-tag'

export const AllCertificates = gql`
query AllCertificates($filters: JSONString) {

  allCertificates(
    filters: $filters
  ) {

      edges {

          node {

            pk
            id
            enrollment {
              pk
              id
              user {
                pk
                email
                fullName
              }
              
              course {
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
