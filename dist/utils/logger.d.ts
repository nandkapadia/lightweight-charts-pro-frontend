/**
 * @fileoverview Centralized Logging Utility
 *
 * Structured logging system for the frontend with configurable log levels
 * and context-based organization. Replaces direct console statements with
 * consistent, filterable logging.
 *
 * This module provides:
 * - Structured logging with log levels (DEBUG, INFO, WARN, ERROR)
 * - Context-based logging (Chart, Primitive, Performance, etc.)
 * - Timestamp formatting with ISO format
 * - Specialized logging methods for common use cases
 * - Singleton logger instance
 *
 * Architecture:
 * - Singleton pattern for global logger
 * - Log level filtering (configurable threshold)
 * - Structured log entries with metadata
 * - Convenience exports for common contexts
 *
 * Features:
 * - Automatic timestamp formatting
 * - Context tagging for easy filtering
 * - Data payload support for debugging
 * - Specialized methods (chartError, primitiveError, etc.)
 * - Production-friendly (default: WARN level)
 *
 * @example
 * ```typescript
 * import { logger, chartLog } from './logger';
 *
 * // General logging
 * logger.info('Chart initialized', 'MyComponent');
 * logger.error('Rendering failed', 'MyComponent', error);
 *
 * // Context-specific logging
 * chartLog.info('Series added');
 * primitiveLog.error('Update failed', 'legend-1', error);
 * ```
 */
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
declare class Logger {
    private logLevel;
    constructor();
    private shouldLog;
    private formatMessage;
    private log;
    debug(message: string, context?: string, data?: unknown): void;
    info(message: string, context?: string, data?: unknown): void;
    warn(message: string, context?: string, data?: unknown): void;
    error(message: string, context?: string, data?: unknown): void;
    chartError(message: string, error?: Error): void;
    primitiveError(message: string, primitiveId: string, error?: Error): void;
    performanceWarn(message: string, data?: unknown): void;
    renderDebug(message: string, componentName: string, data?: unknown): void;
}
export declare const logger: Logger;
export declare const chartLog: {
    debug: (message: string, data?: unknown) => void;
    info: (message: string, data?: unknown) => void;
    warn: (message: string, data?: unknown) => void;
    error: (message: string, error?: Error) => void;
};
export declare const primitiveLog: {
    debug: (message: string, primitiveId: string, data?: unknown) => void;
    error: (message: string, primitiveId: string, error?: Error) => void;
};
export declare const perfLog: {
    warn: (message: string, data?: unknown) => void;
    debug: (message: string, data?: unknown) => void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map