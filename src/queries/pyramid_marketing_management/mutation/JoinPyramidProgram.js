import gql from 'graphql-tag'

export const ArchiveUserAccount = gql`
mutation JoinPyramidProgram($input: JoinPyramidProgramInput!) {

  joinPyramidProgram(input: $input) {

      success
      errors
      pyramid: instance {

          %s

      }

  }

}
`
