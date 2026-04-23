// src/types/{domain}/index.ts
// Barrel export template for type directories

// Domain types
export type {
  {Domain},
  {Domain}Details,
  {Domain}Summary,
} from "./{domain}-types";

// Result types
export type {
  {Domain}Result,
  {Domain}ListResult,
  {Domain}MutationResult,
} from "./{domain}-types";

// Enum/Union types
export type {
  {Domain}Status,
  {Domain}Type,
} from "./{domain}-types";

// Transformer functions
export {
  transform{Domain},
  transform{Domain}Details,
  transform{Domain}Summary,
} from "./{domain}-types";

// Input types (from validation.ts)
export type {
  Create{Domain}Input,
  Update{Domain}Input,
  {Domain}FilterInput,
} from "./validation";

// Validation schemas (from validation.ts)
export {
  Create{Domain}Schema,
  Update{Domain}Schema,
  {Domain}FilterSchema,
} from "./validation";
