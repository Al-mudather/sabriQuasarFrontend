import gql from 'graphql-tag'

// Mirrors CourseClassRoom2/src/queries/certificatesManagement/mutation/
// CreateAutomaticCertificateMutation.js — the "Request to download" button
// in the classroom overview fires this with the learner's enrollment pk and
// an empty input object. Backend creates the certificate row server-side
// when course completion criteria are met.
export const CreateCertificate = gql`
  mutation CreateCertificate($enrollmentId: Int!, $input: CreateCertificateInput!) {
    createCertificate(enrollmentId: $enrollmentId, input: $input) {
      success
      errors
    }
  }
`
