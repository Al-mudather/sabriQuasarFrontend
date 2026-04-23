// Component props template

import type { {Domain} } from "@/types/{domain}";
import type { I18nMessage } from "@/types";

/**
 * Props for {Component} component
 *
 * @example
 * ```tsx
 * <{Component}
 *   {domain}={{domain}Data}
 *   onAction={handleAction}
 *   loading={isLoading}
 * />
 * ```
 */
export interface {Component}Props {
  // Domain data (use domain types, not GraphQL types)
  {domain}: {Domain};

  // Optional data
  {domain}Details?: {Domain}Details;

  // Callbacks
  onAction?: (id: string) => void;
  onRefresh?: () => void;
  onDelete?: (id: string) => Promise<void>;

  // State
  loading?: boolean;
  error?: I18nMessage;

  // Styling
  className?: string;
  variant?: "default" | "compact" | "detailed";

  // Feature flags
  showActions?: boolean;
  readOnly?: boolean;
}

/**
 * Example component using the props
 */
export function {Component}({
  {domain},
  {domain}Details,
  onAction,
  onRefresh,
  loading = false,
  error,
  className,
  variant = "default",
  showActions = true,
}: {Component}Props) {
  // Component implementation
  return (
    <div className={className}>
      {/* Use domain type properties */}
      <h2>{{domain}.name}</h2>
      <p>{{domain}.description}</p>

      {/* Date objects work directly */}
      <p>Created: {{domain}.createdAt.toLocaleDateString()}</p>

      {error && <p className="error">{error.en}</p>}
    </div>
  );
}
