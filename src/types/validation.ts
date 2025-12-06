/**
 * @fileoverview Validation Types for Error Visibility
 *
 * Provides structured validation result types for trades, markers,
 * and other chart elements. Enables detailed error reporting instead
 * of silent failures.
 *
 * Key Features:
 * - Validation results with detailed error messages
 * - Optional error callbacks for debugging
 * - Warning channel for non-critical issues
 * - Backward compatible (errors are opt-in)
 *
 * @example
 * ```typescript
 * import { ValidationResult, ValidationCallback } from './validation';
 *
 * const result: ValidationResult<Trade> = validateTrade(trade);
 * if (!result.valid) {
 *   console.error('Trade validation failed:', result.errors);
 * }
 * ```
 */

/**
 * Severity level for validation issues
 */
export enum ValidationSeverity {
  /** Informational message */
  INFO = "info",

  /** Warning - non-critical issue */
  WARNING = "warning",

  /** Error - critical issue that prevents processing */
  ERROR = "error",
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Error message */
  message: string;

  /** Severity level */
  severity: ValidationSeverity;

  /** Field or property that failed validation */
  field?: string;

  /** Original value that failed validation */
  value?: unknown;

  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Generic validation result
 *
 * @template T - Type of the validated data
 */
export interface DataValidationResult<T = unknown> {
  /** Whether validation passed */
  valid: boolean;

  /** Validated data (only present if valid === true) */
  data?: T;

  /** Validation errors (only present if valid === false) */
  errors?: ValidationError[];

  /** Validation warnings (non-critical issues) */
  warnings?: ValidationError[];

  /** Original input that was validated */
  input?: unknown;
}

/**
 * Batch validation result for multiple items
 *
 * @template T - Type of validated items
 */
export interface BatchValidationResult<T = unknown> {
  /** All validated items that passed */
  valid: T[];

  /** Items that failed validation */
  invalid: Array<{
    /** Original item that failed */
    item: unknown;

    /** Validation errors */
    errors: ValidationError[];

    /** Index in original array */
    index: number;
  }>;

  /** Summary statistics */
  summary: {
    /** Total items processed */
    total: number;

    /** Number of valid items */
    validCount: number;

    /** Number of invalid items */
    invalidCount: number;

    /** Number of warnings */
    warningCount: number;
  };
}

/**
 * Validation callback for optional error handling
 *
 * Allows users to hook into validation errors without breaking changes.
 * Errors are still handled gracefully, but callbacks provide visibility.
 *
 * @example
 * ```typescript
 * const onValidationError: ValidationCallback = (errors) => {
 *   console.warn('Validation issues:', errors);
 *   // Send to error tracking service
 *   errorTracker.captureErrors(errors);
 * };
 * ```
 */
export type ValidationCallback = (errors: ValidationError[]) => void;

/**
 * Validation options
 */
export interface ValidationOptions {
  /**
   * Optional callback for validation errors
   * Provides visibility into validation failures without breaking changes
   */
  onValidationError?: ValidationCallback;

  /**
   * Whether to collect warnings (default: true)
   * Warnings are non-critical issues that don't prevent processing
   */
  collectWarnings?: boolean;

  /**
   * Whether to throw on validation errors (default: false)
   * When false, invalid items are silently filtered
   * When true, throws error on first validation failure
   */
  strict?: boolean;

  /**
   * Custom validation rules
   * Allows extending validation beyond defaults
   */
  customRules?: ValidationRule[];
}

/**
 * Custom validation rule
 */
export interface ValidationRule {
  /** Rule name/identifier */
  name: string;

  /** Validation function */
  validate: (value: unknown) => boolean;

  /** Error message when validation fails */
  message: string;

  /** Severity level */
  severity?: ValidationSeverity;
}

/**
 * Trade validation result
 */
export interface TradeValidationResult extends DataValidationResult<TradeConfig> {
  /** Trade ID (if available) */
  tradeId?: string;
}

/**
 * Marker validation result
 */
export interface MarkerValidationResult extends DataValidationResult<MarkerData> {
  /** Marker timestamp (if available) */
  time?: number;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult extends DataValidationResult<string> {
  /** Missing placeholders */
  missingPlaceholders?: string[];

  /** Invalid placeholders */
  invalidPlaceholders?: string[];
}

// Re-export from ChartInterfaces to avoid circular dependency
import type { MarkerData, TradeConfig } from "./ChartInterfaces";
