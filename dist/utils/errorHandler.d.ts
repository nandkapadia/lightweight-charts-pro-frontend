/**
 * @fileoverview Unified Error Handling System
 *
 * Provides consistent error handling with severity levels across the application.
 * Uses the existing logger utility for all logging operations.
 *
 * Features:
 * - Severity-based error handling (SILENT, WARNING, ERROR, CRITICAL)
 * - Consistent error propagation strategy
 * - Structured error logging with context
 * - Type-safe error handling helpers
 *
 * Usage:
 * ```typescript
 * import { handleError, ErrorSeverity } from './utils/errorHandler';
 *
 * // Silent - log only, don't propagate
 * handleError(error, 'MyComponent', ErrorSeverity.SILENT);
 *
 * // Warning - log warning, continue execution
 * handleError(error, 'MyComponent', ErrorSeverity.WARNING);
 *
 * // Error - log error, throw to propagate
 * handleError(error, 'MyComponent', ErrorSeverity.ERROR);
 *
 * // Critical - log error with extra context, throw to propagate
 * handleError(error, 'MyComponent', ErrorSeverity.CRITICAL);
 * ```
 */
/**
 * Error severity levels
 *
 * Determines how errors are logged and whether they propagate
 */
export declare enum ErrorSeverity {
    /**
     * SILENT: No logging, no propagation
     * Use for expected errors that should be completely ignored
     */
    SILENT = 0,
    /**
     * WARNING: Log as warning, continue execution
     * Use for recoverable errors that don't affect functionality
     */
    WARNING = 1,
    /**
     * ERROR: Log as error, propagate by throwing
     * Use for errors that should be handled by caller (default)
     */
    ERROR = 2,
    /**
     * CRITICAL: Log as error with extra context, propagate by throwing
     * Use for critical errors that may require user notification
     */
    CRITICAL = 3
}
/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
    /** Error severity level */
    severity?: ErrorSeverity;
    /** Additional context data to log */
    data?: Record<string, unknown>;
    /** Custom error message (overrides error.message) */
    message?: string;
    /** Whether to include stack trace in logs */
    includeStack?: boolean;
}
/**
 * Handle error with consistent logging and propagation
 *
 * @param error - Error object or unknown value
 * @param context - Context string (e.g., component/service name)
 * @param severity - Error severity level (default: ERROR)
 */
export declare function handleError(error: Error | unknown, context: string, severity?: ErrorSeverity): void;
/**
 * Handle error with additional options
 *
 * @param error - Error object or unknown value
 * @param context - Context string
 * @param options - Error handling options
 */
export declare function handleErrorWithOptions(error: Error | unknown, context: string, options?: ErrorHandlingOptions): void;
/**
 * Safe execution wrapper with error handling
 *
 * Executes a function and handles any errors according to severity
 *
 * @param fn - Function to execute
 * @param context - Context string
 * @param severity - Error severity level
 * @returns Function result or undefined if error occurred
 */
export declare function safeExecute<T>(fn: () => T, context: string, severity?: ErrorSeverity): T | undefined;
/**
 * Async safe execution wrapper with error handling
 *
 * @param fn - Async function to execute
 * @param context - Context string
 * @param severity - Error severity level
 * @returns Promise with function result or undefined if error occurred
 */
export declare function safeExecuteAsync<T>(fn: () => Promise<T>, context: string, severity?: ErrorSeverity): Promise<T | undefined>;
/**
 * Create a context-specific error handler
 *
 * Returns a handleError function bound to a specific context
 *
 * @param context - Context string to use for all errors
 * @returns Context-bound error handler
 */
export declare function createErrorHandler(context: string): (error: Error | unknown, severity?: ErrorSeverity) => void;
/**
 * Validation error helper
 *
 * Creates and throws a validation error
 *
 * @param message - Error message
 * @param context - Context string
 * @param data - Validation data
 */
export declare function throwValidationError(message: string, context: string, data?: Record<string, unknown>): never;
/**
 * Assertion helper with error handling
 *
 * @param condition - Condition to assert
 * @param message - Error message if assertion fails
 * @param context - Context string
 */
export declare function assert(condition: boolean, message: string, context: string): asserts condition;
//# sourceMappingURL=errorHandler.d.ts.map