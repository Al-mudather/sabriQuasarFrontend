import gql from 'graphql-tag'

export const ArchiveUserAccount = gql`
mutation WithdrawPyramidBalance($amount: Float!, $input: MakePyramidWithdrawInput!) {

  makePyramidWithdraw(amount:$amount, input: $input) {

      success
      errors
      pyramidWithdraw: instance {

          %s

      }

  }

}
`
