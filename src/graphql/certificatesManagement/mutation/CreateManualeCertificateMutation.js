import gql from 'graphql-tag'

export const CreateManualCertificate = gql`
mutation CreateManualCertificate($course: Int!, $userEmail: String!, $input: CreateManualCertificateInput!) {

  createManualCertificate(course: $course, userEmail: $userEmail, input: $input) {

    success
    errors

  }

}
`
