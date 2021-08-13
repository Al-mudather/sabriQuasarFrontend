import gql from 'graphql-tag'
 
export const JoinPyramidProgram = gql`
mutation JoinPyramidProgram($input: JoinPyramidProgramInput!) {

  joinPyramidProgram(input: $input) {

      success
      errors
      pyramid: instance {
        pyramidId
        user {
          pk
        }
        parent {
          pk
        }
        pyramidCode
        created
        updated

      }

  }

}
`
