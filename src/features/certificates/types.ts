// Type-only source of truth for the CERTIFICATES feature.
// Derived from codegen output in src/graphql/generated.ts — do not add runtime.
//
// NOTE: Requested op names in the brief were `AllCertificates` /
// `CreateManualeCertificateMutation`. After grepping generated.ts, the real
// exported names are `AllCertificatesQuery` and `CreateManualCertificateMutation`
// (no trailing "e" on "Manual"). We re-export under feature-local aliases so
// callers can stay stable if the codegen names ever shift again.

import type {
  AllCertificatesQuery,
  AllCertificatesQueryVariables,
  CreateManualCertificateMutation,
  CreateManualCertificateMutationVariables,
} from 'src/graphql/generated'

export type Certificate = NonNullable<
  NonNullable<
    NonNullable<AllCertificatesQuery['allCertificates']>['edges'][number]
  >['node']
>

export type AllCertificatesResult = AllCertificatesQuery
export type AllCertificatesVars = AllCertificatesQueryVariables

export type CreateCertificateResult = CreateManualCertificateMutation
export type CreateCertificateVars = CreateManualCertificateMutationVariables
