import gql from 'graphql-tag'

export const WithdrawPyramidBalance = gql`
mutation WithdrawPyramidBalance($amount: Float!, $input: MakePyramidWithdrawInput!) {

  makePyramidWithdraw(amount:$amount, input: $input) {

      success
      errors
      pyramidWithdraw: instance {
        id
        pk
        pyramidAccount {
            pk
        }
        amount
        isDone
        created
        updated
      }

  }

}
`
