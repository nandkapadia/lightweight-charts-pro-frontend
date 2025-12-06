/**
 * @fileoverview Unified Error Handling System
 *
 * This module provides a consistent, centralized error handling system with
 * severity-based categorization. It integrates with the logger utility to provide
 * structured error logging and implements various error propagation strategies.
 *
 * Key Features:
 * - Severity-based error classification (SILENT, WARNING, ERROR, CRITICAL)
 * - Consistent error logging with context
 * - Flexible error propagation (continue vs throw)
 * - Safe execution wrappers for error-prone operations
 * - Context-specific error handler factories
 * - Type-safe validation helpers
 *
 * Error Severity Levels:
 * 1. SILENT (0): No logging, no propagation - for completely ignored errors
 * 2. WARNING (1): Log as warning, continue execution - for recoverable errors
 * 3. ERROR (2): Log as error, throw to propagate - for errors requiring handling
 * 4. CRITICAL (3): Log with extra context, throw - for critical system errors
 *
 * Architecture:
 * - Integrates with centralized logger utility
 * - Provides both simple and advanced error handling APIs
 * - Supports sync and async execution wrappers
 * - Enables creation of context-bound error handlers
 *
 * @example
 * ```typescript
 * import { handleError, ErrorSeverity, safeExecute } from './errorHandler';
 *
 * // Basic error handling
 * try {
 *   riskyOperation();
 * } catch (error) {
 *   // Log and throw
 *   handleError(error, 'MyComponent', ErrorSeverity.ERROR);
 * }
 *
 * // Safe execution wrapper
 * const result = safeExecute(
 *   () => JSON.parse(jsonString),
 *   'DataParser',
 *   ErrorSeverity.WARNING
 * );
 * // Returns parsed data or undefined if error
 *
 * // Context-specific handler
 * const handleChartError = createErrorHandler('ChartComponent');
 * handleChartError(error, ErrorSeverity.ERROR);
 * ```
 */

// ============================================================================
// Local Imports
// ============================================================================

import { logger } from "./logger";

// ============================================================================
// Error Severity Enumeration
// ============================================================================

/**
 * Error severity levels for categorizing and handling errors.
 *
 * This enum defines four levels of error severity, each with different
 * logging and propagation behavior. The severity level determines:
 * - Whether the error is logged
 * - What log level is used (warn vs error)
 * - Whether the error is thrown (propagated) or swallowed
 *
 * @remarks
 * Choosing the Right Severity:
 * - SILENT: Use for completely expected errors that should be ignored
 *   (e.g., optional feature unavailable, user cancellation)
 * - WARNING: Use for recoverable errors that don't affect core functionality
 *   (e.g., failed to load optional data, degraded performance)
 * - ERROR: Use for errors that should be handled by the caller
 *   (e.g., invalid input, failed API call)
 * - CRITICAL: Use for errors that may require user notification or system restart
 *   (e.g., database connection lost, critical service unavailable)
 *
 * @example
 * ```typescript
 * // Silent - completely ignore
 * handleError(error, 'OptionalFeature', ErrorSeverity.SILENT);
 *
 * // Warning - log but continue
 * handleError(error, 'CacheLoad', ErrorSeverity.WARNING);
 *
 * // Error - log and throw (default)
 * handleError(error, 'DataValidation', ErrorSeverity.ERROR);
 *
 * // Critical - log with emphasis and throw
 * handleError(error, 'DatabaseConnection', ErrorSeverity.CRITICAL);
 * ```
 */
export enum ErrorSeverity {
  /**
   * SILENT: No logging, no propagation.
   * Use for expected errors that should be completely ignored.
   * The error is swallowed without any logging or throwing.
   */
  SILENT = 0,

  /**
   * WARNING: Log as warning, continue execution.
   * Use for recoverable errors that don't affect core functionality.
   * The error is logged at WARNING level but not thrown.
   */
  WARNING = 1,

  /**
   * ERROR: Log as error, propagate by throwing.
   * Use for errors that should be handled by the caller (default level).
   * The error is logged at ERROR level and then thrown.
   */
  ERROR = 2,

  /**
   * CRITICAL: Log as error with extra context, propagate by throwing.
   * Use for critical errors that may require user notification.
   * The error is logged at ERROR level with "CRITICAL" prefix and then thrown.
   */
  CRITICAL = 3,
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Options for advanced error handling with additional configuration.
 *
 * This interface allows fine-grained control over error handling behavior,
 * including custom messages, additional context data, and stack trace inclusion.
 *
 * @property severity - Error severity level (default: ERROR)
 * @property data - Additional context data to include in logs
 * @property message - Custom error message to override error.message
 * @property includeStack - Whether to include stack trace in logs (default: false)
 *
 * @example
 * ```typescript
 * handleErrorWithOptions(error, 'UserService', {
 *   severity: ErrorSeverity.WARNING,
 *   data: { userId: 123, action: 'updateProfile' },
 *   message: 'Failed to update user profile',
 *   includeStack: true
 * });
 * ```
 */
export interface ErrorHandlingOptions {
  /**
   * Error severity level.
   * Determines logging level and whether error is thrown.
   * Default: ErrorSeverity.ERROR
   */
  severity?: ErrorSeverity;

  /**
   * Additional context data to include in logs.
   * Useful for debugging with relevant state information.
   */
  data?: Record<string, unknown>;

  /**
   * Custom error message to override error.message.
   * Useful for providing user-friendly or context-specific messages.
   */
  message?: string;

  /**
   * Whether to include stack trace in log data.
   * Default: false (stack traces can be verbose)
   */
  includeStack?: boolean;
}

// ============================================================================
// Core Error Handling Functions
// ============================================================================

/**
 * Handle error with consistent logging and propagation.
 *
 * This is the primary error handling function. It logs errors with the specified
 * severity and either throws them (ERROR/CRITICAL) or swallows them (SILENT/WARNING).
 *
 * @param error - Error object or unknown value to handle
 * @param context - Context string for logging (e.g., component/service name)
 * @param severity - Error severity level (default: ERROR)
 * @returns void
 *
 * @throws {Error} If severity is ERROR or CRITICAL, the original error is thrown
 *
 * @example
 * ```typescript
 * // Log and throw (default behavior)
 * try {
 *   const data = fetchData();
 * } catch (error) {
 *   handleError(error, 'DataFetcher'); // Logs and throws
 * }
 *
 * // Log as warning, continue execution
 * try {
 *   loadOptionalData();
 * } catch (error) {
 *   handleError(error, 'OptionalLoader', ErrorSeverity.WARNING);
 *   // Execution continues here
 * }
 *
 * // Completely silent
 * try {
 *   trackAnalytics();
 * } catch (error) {
 *   handleError(error, 'Analytics', ErrorSeverity.SILENT);
 *   // No logging, no throwing
 * }
 * ```
 *
 * @remarks
 * Error Type Handling:
 * - If error is an Error object, uses error.message for logging
 * - If error is any other type, converts to string with String(error)
 * - Original error object is always included in log data
 *
 * Default Behavior:
 * If no severity is specified, defaults to ErrorSeverity.ERROR,
 * which logs the error and throws it for the caller to handle.
 */
export function handleError(
  error: Error | unknown,
  context: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
): void {
  // Extract message from Error object or convert unknown value to string
  const message = error instanceof Error ? error.message : String(error);

  // Prepare error data for logging
  // Keep original error structure for debugging
  const errorData = error instanceof Error ? error : { value: error };

  // Handle error based on severity level
  switch (severity) {
    case ErrorSeverity.SILENT:
      // No logging, no propagation
      // Error is completely ignored
      break;

    case ErrorSeverity.WARNING:
      // Log as warning, continue execution
      logger.warn(message, context, errorData);
      // Don't throw - execution continues after this function
      break;

    case ErrorSeverity.ERROR:
      // Log as error, then throw to propagate
      logger.error(message, context, errorData);
      throw error;

    case ErrorSeverity.CRITICAL:
      // Log as critical error with prefix, then throw
      logger.error(`CRITICAL: ${message}`, context, errorData);
      // Future enhancement: Could trigger user notification here
      throw error;
  }
}

/**
 * Handle error with additional configuration options.
 *
 * This is an advanced error handling function that provides more control over
 * error logging and propagation. It supports custom messages, additional context
 * data, and optional stack trace inclusion.
 *
 * @param error - Error object or unknown value to handle
 * @param context - Context string for logging
 * @param options - Error handling configuration options
 * @returns void
 *
 * @throws {Error} If severity is ERROR or CRITICAL, the original error is thrown
 *
 * @example
 * ```typescript
 * // With custom message and data
 * handleErrorWithOptions(error, 'UserService', {
 *   severity: ErrorSeverity.WARNING,
 *   message: 'Failed to update user preferences',
 *   data: { userId: 123, preferences: {...} }
 * });
 *
 * // With stack trace
 * handleErrorWithOptions(error, 'CriticalOperation', {
 *   severity: ErrorSeverity.CRITICAL,
 *   includeStack: true,
 *   data: { operation: 'processPayment', amount: 99.99 }
 * });
 * ```
 *
 * @remarks
 * Options Defaults:
 * - severity: ErrorSeverity.ERROR
 * - data: {} (empty object)
 * - message: error.message (or String(error))
 * - includeStack: false
 *
 * Data Merging:
 * The function merges:
 * 1. Custom data from options.data
 * 2. Original error object
 * 3. Stack trace (if includeStack is true)
 * into a single object for logging.
 */
export function handleErrorWithOptions(
  error: Error | unknown,
  context: string,
  options: ErrorHandlingOptions = {},
): void {
  // Destructure options with defaults
  const {
    severity = ErrorSeverity.ERROR,
    data,
    message: customMessage,
    includeStack = false,
  } = options;

  // Use custom message or extract from error
  const errorMessage =
    customMessage || (error instanceof Error ? error.message : String(error));

  // Build comprehensive error data object
  const errorData = {
    // Include any custom context data provided
    ...(data || {}),
    // Include the original error
    originalError: error instanceof Error ? error : { value: error },
    // Conditionally include stack trace if requested
    ...(includeStack && error instanceof Error ? { stack: error.stack } : {}),
  };

  // Handle error based on severity level
  switch (severity) {
    case ErrorSeverity.SILENT:
      // No logging, no propagation
      break;

    case ErrorSeverity.WARNING:
      // Log as warning, continue execution
      logger.warn(errorMessage, context, errorData);
      break;

    case ErrorSeverity.ERROR:
      // Log as error, then throw
      logger.error(errorMessage, context, errorData);
      throw error;

    case ErrorSeverity.CRITICAL:
      // Log as critical error with prefix, then throw
      logger.error(`CRITICAL: ${errorMessage}`, context, errorData);
      throw error;
  }
}

// ============================================================================
// Safe Execution Wrappers
// ============================================================================

/**
 * Safe execution wrapper for synchronous functions.
 *
 * Executes a function and handles any errors according to the specified severity.
 * Returns the function result on success, or undefined if an error occurred.
 *
 * @template T - The return type of the function
 * @param fn - Synchronous function to execute safely
 * @param context - Context string for error logging
 * @param severity - Error severity level (default: WARNING)
 * @returns T | undefined - Function result or undefined if error occurred
 *
 * @example
 * ```typescript
 * // Parse JSON safely
 * const data = safeExecute(
 *   () => JSON.parse(jsonString),
 *   'JSONParser',
 *   ErrorSeverity.WARNING
 * );
 * if (data) {
 *   processData(data);
 * } else {
 *   useDefaultData();
 * }
 *
 * // Safe DOM access
 * const element = safeExecute(
 *   () => document.querySelector('.chart-container'),
 *   'DOMAccess',
 *   ErrorSeverity.SILENT
 * );
 * ```
 *
 * @remarks
 * Return Value:
 * - On success: Returns the function's return value
 * - On error: Returns undefined (after logging based on severity)
 *
 * Default Severity:
 * Defaults to WARNING, which logs errors but doesn't throw.
 * This makes it safe for optional operations that shouldn't crash the app.
 */
export function safeExecute<T>(
  fn: () => T,
  context: string,
  severity: ErrorSeverity = ErrorSeverity.WARNING,
): T | undefined {
  try {
    // Execute the function and return its result
    return fn();
  } catch (error) {
    // Handle error according to severity
    // If severity is WARNING or SILENT, this won't throw
    handleError(error, context, severity);
    // Return undefined to indicate error occurred
    return undefined;
  }
}

/**
 * Safe execution wrapper for asynchronous functions.
 *
 * Executes an async function and handles any errors according to the specified
 * severity. Returns a Promise that resolves to the function result on success,
 * or undefined if an error occurred.
 *
 * @template T - The return type of the async function
 * @param fn - Asynchronous function to execute safely
 * @param context - Context string for error logging
 * @param severity - Error severity level (default: WARNING)
 * @returns Promise<T | undefined> - Promise with function result or undefined
 *
 * @example
 * ```typescript
 * // Safe API call
 * const data = await safeExecuteAsync(
 *   () => fetch('/api/data').then(r => r.json()),
 *   'APIFetch',
 *   ErrorSeverity.WARNING
 * );
 * if (data) {
 *   displayData(data);
 * } else {
 *   showError('Failed to load data');
 * }
 *
 * // Safe async file read
 * const config = await safeExecuteAsync(
 *   async () => {
 *     const text = await fs.readFile('config.json', 'utf-8');
 *     return JSON.parse(text);
 *   },
 *   'ConfigLoader',
 *   ErrorSeverity.WARNING
 * );
 * ```
 *
 * @remarks
 * Async/Await:
 * This function is async and must be awaited. It catches both synchronous
 * errors (thrown in function body) and async errors (rejected promises).
 *
 * Error Handling:
 * Errors are handled the same way as safeExecute(), but in an async context.
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  context: string,
  severity: ErrorSeverity = ErrorSeverity.WARNING,
): Promise<T | undefined> {
  try {
    // Await the async function and return its result
    return await fn();
  } catch (error) {
    // Handle error according to severity
    handleError(error, context, severity);
    // Return undefined to indicate error occurred
    return undefined;
  }
}

// ============================================================================
// Error Handler Factories
// ============================================================================

/**
 * Create a context-specific error handler function.
 *
 * Returns a handleError function that is bound to a specific context string.
 * This is useful for creating reusable error handlers in classes or modules.
 *
 * @param context - Context string to use for all errors
 * @returns Function - Error handler bound to the specified context
 *
 * @example
 * ```typescript
 * class ChartComponent {
 *   private handleError = createErrorHandler('ChartComponent');
 *
 *   render() {
 *     try {
 *       this.drawChart();
 *     } catch (error) {
 *       this.handleError(error, ErrorSeverity.ERROR);
 *     }
 *   }
 *
 *   loadData() {
 *     try {
 *       this.fetchData();
 *     } catch (error) {
 *       this.handleError(error, ErrorSeverity.WARNING);
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Module-level error handler
 * const handleDataError = createErrorHandler('DataModule');
 *
 * function processData(data: any) {
 *   try {
 *     validateData(data);
 *   } catch (error) {
 *     handleDataError(error, ErrorSeverity.ERROR);
 *   }
 * }
 * ```
 *
 * @remarks
 * Benefits:
 * - Reduces repetition of context strings
 * - Ensures consistent context across a module/class
 * - Makes error handling code more concise
 * - Easier to refactor (context in one place)
 */
export function createErrorHandler(context: string) {
  // Return a function that calls handleError with the bound context
  return (
    error: Error | unknown,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
  ) => {
    handleError(error, context, severity);
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validation error helper - creates and throws a validation error.
 *
 * This is a convenience function for throwing validation errors with proper
 * logging and context. It creates an Error with name 'ValidationError' and
 * throws it after logging.
 *
 * @param message - Error message describing the validation failure
 * @param context - Context string for logging
 * @param data - Optional validation data to include in logs
 * @returns never - This function never returns (always throws)
 *
 * @throws {Error} Always throws a ValidationError
 *
 * @example
 * ```typescript
 * function validateUser(user: any) {
 *   if (!user.email) {
 *     throwValidationError(
 *       'Email is required',
 *       'UserValidator',
 *       { userId: user.id }
 *     );
 *   }
 *
 *   if (!isValidEmail(user.email)) {
 *     throwValidationError(
 *       'Invalid email format',
 *       'UserValidator',
 *       { email: user.email }
 *     );
 *   }
 * }
 * ```
 *
 * @remarks
 * Error Name:
 * The created error has name 'ValidationError', which can be useful for
 * catching and handling validation errors specifically.
 *
 * Never Returns:
 * The return type is 'never' because this function always throws.
 * TypeScript uses this for control flow analysis.
 */
export function throwValidationError(
  message: string,
  context: string,
  data?: Record<string, unknown>,
): never {
  // Create Error instance with ValidationError name
  const error = new Error(message);
  error.name = "ValidationError";

  // Log and throw the error using handleErrorWithOptions
  handleErrorWithOptions(error, context, {
    severity: ErrorSeverity.ERROR,
    data,
  });

  // TypeScript requires this throw for 'never' return type
  // handleErrorWithOptions already throws, but we throw again for type safety
  throw error;
}

/**
 * Assertion helper with automatic error throwing.
 *
 * Asserts that a condition is true, throwing a validation error if it's false.
 * Uses TypeScript's 'asserts' keyword for type narrowing.
 *
 * @param condition - Condition to assert as true
 * @param message - Error message if assertion fails
 * @param context - Context string for logging
 * @returns void - Returns nothing if assertion passes
 *
 * @throws {Error} If condition is false, throws a ValidationError
 *
 * @example
 * ```typescript
 * function processValue(value: string | null) {
 *   assert(value !== null, 'Value cannot be null', 'ValueProcessor');
 *   // TypeScript knows value is string here (not null)
 *   return value.toUpperCase();
 * }
 *
 * function divide(a: number, b: number) {
 *   assert(b !== 0, 'Cannot divide by zero', 'MathOperations');
 *   return a / b;
 * }
 * ```
 *
 * @remarks
 * Type Narrowing:
 * The 'asserts condition' return type tells TypeScript that if this function
 * returns normally, the condition is true. This enables type narrowing.
 *
 * Use Cases:
 * - Runtime type checking
 * - Precondition validation
 * - Null/undefined checks
 * - Invariant enforcement
 */
export function assert(
  condition: boolean,
  message: string,
  context: string,
): asserts condition {
  // If condition is false, throw validation error
  if (!condition) {
    throwValidationError(message, context);
  }
  // If we reach here, condition is true (no action needed)
}
