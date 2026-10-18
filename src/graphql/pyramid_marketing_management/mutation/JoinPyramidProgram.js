import gql from 'graphql-tag'
 
export const JoinPyramidProgram = gql`
mutation JoinPyramidProgram($input: JoinPyramidProgramInput!) {

  joinPyramidProgram(input: $input) {

      success
      errors
      instance {
        pk
        pyramidCode
      }

  }

}
`
