/**
 * Marketing content feature — source of truth for home page sliders
 * and promotional static content.
 */
import type {
  AllHomePageSlidersQuery,
  AllHomePageSlidersQueryVariables,
} from 'src/graphql/generated'

// Extract the connection edge node as the domain entity
export type HomePageSlider = NonNullable<
  NonNullable<NonNullable<AllHomePageSlidersQuery['allHomePageSliders']>['edges'][number]>['node']
>

export type AllHomePageSlidersResult = AllHomePageSlidersQuery
export type AllHomePageSlidersVars = AllHomePageSlidersQueryVariables
