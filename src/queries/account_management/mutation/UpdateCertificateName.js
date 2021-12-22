import gql from 'graphql-tag'

export const UpdateCertificateNameQuery = gql`
mutation UpdateCertificateName($input: UpdateCertificateNameInput!) {

  updateCertificateName(input: $input) {

    success
    errors

  }

}
`
