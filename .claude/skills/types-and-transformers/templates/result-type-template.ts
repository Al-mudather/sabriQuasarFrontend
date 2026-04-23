// Result type templates for server actions

import type { I18nMessage } from "@/types";

/**
 * Standard result type for single item operations
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
 * Result type for list operations with pagination
 */
export interface {Domain}ListResult {
  success: boolean;
  data?: {Domain}[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
    totalPages: number;
  };
  error?: I18nMessage;
  errorCode?: string;
}

/**
 * Result type for mutation operations (create, update, delete)
 */
export interface {Domain}MutationResult {
  success: boolean;
  data?: {Domain};
  error?: I18nMessage;
  errorCode?: string;
  errorDetails?: {
    fields?: Record<string, string[]>;
  };
}
