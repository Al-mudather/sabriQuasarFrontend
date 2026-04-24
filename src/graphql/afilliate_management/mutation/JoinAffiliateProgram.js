import gql from "graphql-tag";

export const JoinAffiliateProgram = gql`
  mutation JoinAffiliateProgram {
    joinAffiliateProgram {
      success
      errors
      affiliate {
        id
        pk,
        affiliateLink
      }
    }
  }
`;
