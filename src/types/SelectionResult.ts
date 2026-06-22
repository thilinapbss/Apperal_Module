/**
 * Result of a selection operation (dropdown, table, etc.)
 */
export interface SelectionResult {
  success: boolean;
  selectedValue: string;
  selectedIndex: number;
  message: string;
}

/**
 * Result of a form fill operation
 */
export interface FormFillResult {
  fieldName: string;
  value: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Result of bulk operations (multiple rows, fields, etc.)
 */
export interface BulkOperationResult {
  totalItems: number;
  successCount: number;
  failureCount: number;
  allSuccess: boolean;
  errors: Array<{ item: string; error: string }>;
  message: string;
}

/**
 * Options for dropdown selection
 */
export interface DropdownSelectionOptions {
  searchCriteria: 'text' | 'index' | 'random';
  value?: string;
  index?: number;
  timeout?: number;
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

/**
 * Options for table operations
 */
export interface TableOperationOptions {
  timeout?: number;
  maxRetries?: number;
  scrollIntoView?: boolean;
  logDetails?: boolean;
}

/**
 * Generic response wrapper for operations
 */
export interface OperationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
