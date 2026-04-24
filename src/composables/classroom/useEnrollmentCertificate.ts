// Fetches the learner's certificate (if any) for a given enrollment.
//
// Backed by the existing `AllCertificates` query which accepts a JSONString
// `filters` argument. We filter by `enrollment__pk` and expect either 0 or
// 1 certificate rows back. The first edge is surfaced as `certificate`.

import { computed, isRef, unref, type ComputedRef, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { AllCertificates } from 'src/graphql/certificatesManagement/query/GetAllCertificates'
import type {
  AllCertificatesResult,
  AllCertificatesVars,
  Certificate,
} from 'src/types/certificates/types'

type PkLike = number | Ref<number | null | undefined> | null | undefined

export function useEnrollmentCertificate(enrollmentPk: PkLike): {
  certificate: ComputedRef<Certificate | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
} {
  const variables = computed<AllCertificatesVars>(() => {
    const v = isRef(enrollmentPk) ? unref(enrollmentPk) : enrollmentPk
    const pk = typeof v === 'number' ? v : 0
    // codegen maps the JSONString scalar to Record<string, number>, but the
    // runtime op wants a JSON-serialised string. Cast through unknown.
    return { filters: JSON.stringify({ enrollment__pk: pk }) as unknown as AllCertificatesVars['filters'] }
  })

  const enabled = computed(() => {
    const v = isRef(enrollmentPk) ? unref(enrollmentPk) : enrollmentPk
    return typeof v === 'number' && v > 0
  })

  const { result, loading, error } = useQuery<
    AllCertificatesResult,
    AllCertificatesVars
  >(AllCertificates, variables, () => ({
    enabled: enabled.value,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  }))

  const certificate = computed<Certificate | null>(() => {
    const edges = result.value?.allCertificates?.edges ?? []
    for (const edge of edges) {
      if (edge?.node) return edge.node
    }
    return null
  })

  return {
    certificate,
    loading,
    error: error as Ref<Error | null>,
  }
}
