import gql from 'graphql-tag'

export const ClaimPyramidLedgerBalance = gql`
mutation ClaimPyramidLedgerBalance($input: ClaimPyramidLedgerBalanceInput!) {

  claimPyramidLedgerBalance(input: $input) {

      success
      errors
      pyramidBalance: instance {

        id
        pk
        balance
        created
        updated

      }

  }

}
`
 