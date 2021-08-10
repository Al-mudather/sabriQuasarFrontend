import gql from 'graphql-tag'

export const ArchiveUserAccount = gql`
mutation ClaimPyramidLedgerBalance($input: ClaimPyramidLedgerBalanceInput!) {

  claimPyramidLedgerBalance(input: $input) {

      success
      errors
      pyramidBalance: instance {

          %s

      }

  }

}
`
