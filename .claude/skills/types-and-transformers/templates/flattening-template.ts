// Template for flattening nested GraphQL structures

import type { App{Operation}Query } from "@/__generated__/graphql";

/**
 * Extract GraphQL type (deeply nested structure)
 */
type GraphQL{Domain} = NonNullable<App{Operation}Query['APP_{operation}']>;

/**
 * Flattened domain type - easier for UI consumption
 *
 * Transformations:
 * - Flattened nested.object.field → nestedObjectField
 * - Flattened deep.nested.structure → deepNestedStructure
 * - Dates: string → Date
 */
export interface {Domain}Flattened {
  // Top-level fields
  id: string;

  // Flattened from nested.object
  nestedObjectId: string;
  nestedObjectName: string;

  // Flattened from deep.nested.structure
  deepNestedStructureId: string;
  deepNestedStructureValue: string;

  // Transformed dates
  createdAt: Date;
}

/**
 * Transform nested GraphQL structure to flat domain type
 *
 * Example GraphQL structure:
 * {
 *   id: "123",
 *   nested: {
 *     object: {
 *       id: "456",
 *       name: "Example"
 *     }
 *   },
 *   deep: {
 *     nested: {
 *       structure: {
 *         id: "789",
 *         value: "Data"
 *       }
 *     }
 *   },
 *   createdAt: "2024-01-01T00:00:00Z"
 * }
 */
export function transform{Domain}(gql: GraphQL{Domain}): {Domain}Flattened {
  return {
    id: gql.id,

    // Flatten nested.object
    nestedObjectId: gql.nested.object.id,
    nestedObjectName: gql.nested.object.name,

    // Flatten deep.nested.structure
    deepNestedStructureId: gql.deep.nested.structure.id,
    deepNestedStructureValue: gql.deep.nested.structure.value,

    // Transform dates
    createdAt: new Date(gql.createdAt),
  };
}

/**
 * Alternative: Selective flattening (keep some nesting)
 *
 * Use when partial nesting makes sense for the UI
 */
export interface {Domain}SelectiveFlat {
  id: string;

  // Flattened fields for common access
  nestedObjectId: string;
  nestedObjectName: string;

  // Keep this nested for grouped access
  deepStructure: {
    id: string;
    value: string;
  };

  createdAt: Date;
}

export function transform{Domain}Selective(gql: GraphQL{Domain}): {Domain}SelectiveFlat {
  return {
    id: gql.id,
    nestedObjectId: gql.nested.object.id,
    nestedObjectName: gql.nested.object.name,

    // Keep some nesting
    deepStructure: {
      id: gql.deep.nested.structure.id,
      value: gql.deep.nested.structure.value,
    },

    createdAt: new Date(gql.createdAt),
  };
}
