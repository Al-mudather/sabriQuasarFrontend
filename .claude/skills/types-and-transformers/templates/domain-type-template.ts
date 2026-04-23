// src/types/{domain}/{domain}-types.ts

import type { App{Operation}Query } from "@/__generated__/graphql";
import type { I18nMessage } from "@/types";

/**
 * Extract the GraphQL type (handle nullability)
 */
type GraphQL{Domain} = NonNullable<App{Operation}Query['APP_{operation}']>;

/**
 * Domain type for {Domain} - transformed from GraphQL response
 *
 * Transformations:
 * - createdAt: string → Date (parse ISO string)
 * - updatedAt: string → Date (parse ISO string)
 * - Add other transformations as needed
 */
export interface {Domain} {
  id: string;
  // ... other fields from GraphQL
  createdAt: Date;      // Transformed from string
  updatedAt: Date;      // Transformed from string
}

/**
 * Transforms GraphQL {domain} data to domain type
 *
 * @param gql - GraphQL response data
 * @returns Transformed domain object
 */
export function transform{Domain}(gql: GraphQL{Domain}): {Domain} {
  return {
    id: gql.id,
    // ... map other fields
    createdAt: new Date(gql.createdAt),  // Transform string → Date
    updatedAt: new Date(gql.updatedAt),  // Transform string → Date
  };
}

/**
 * Standard result type for {domain} server actions
 */
export interface {Domain}Result {
  success: boolean;
  data?: {Domain};
  error?: I18nMessage;
  errorCode?: string;
  errorDetails?: {
    fields?: Record<string, string[]>;
    requiresRedirect?: boolean;
    redirectTo?: string;
  };
}

/**
 * Result type for list operations
 */
export interface {Domain}ListResult {
  success: boolean;
  data?: {Domain}[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
  error?: I18nMessage;
  errorCode?: string;
}
