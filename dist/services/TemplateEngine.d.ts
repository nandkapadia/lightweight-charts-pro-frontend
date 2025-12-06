import { UTCTimestamp } from 'lightweight-charts';
import { TemplateContext } from '../types/ChartInterfaces';
import { TimeFormatter } from '../utils/timeNormalization';
/**
 * Interface for series data used in template processing
 */
export interface SeriesDataValue {
    time?: UTCTimestamp | string | number;
    value?: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    upper?: number;
    middle?: number;
    lower?: number;
    volume?: number;
    [key: string]: unknown;
}
/**
 * Template processing options
 */
export interface TemplateOptions {
    /**
     * Whether to process placeholders (default: true)
     */
    processPlaceholders?: boolean;
    /**
     * Whether to escape HTML (default: false)
     */
    escapeHtml?: boolean;
    /**
     * Default value for missing placeholders
     */
    defaultValue?: string;
    /**
     * Whether to throw on missing placeholder data (default: false)
     */
    strict?: boolean;
    /**
     * Custom time formatter function.
     * If not provided, timestamps are formatted as ISO 8601 UTC strings.
     * NO timezone conversion is applied - times are displayed as-is.
     *
     * @example
     * ```typescript
     * // Display in user's local timezone
     * timeFormatter: (ts) => new Date(ts * 1000).toLocaleString()
     *
     * // Display in specific timezone
     * timeFormatter: (ts) => new Date(ts * 1000).toLocaleString('en-US', {
     *   timeZone: 'America/New_York'
     * })
     *
     * // Custom format
     * timeFormatter: (ts) => `${new Date(ts * 1000).toISOString().slice(0, 10)}`
     * ```
     */
    timeFormatter?: TimeFormatter;
}
/**
 * Template processing result
 */
export interface TemplateResult {
    /**
     * Processed template content
     */
    content: string;
    /**
     * List of placeholders that were processed
     */
    processedPlaceholders: string[];
    /**
     * List of placeholders that had no data
     */
    missingPlaceholders: string[];
    /**
     * Whether errors occurred during processing
     */
    hasErrors: boolean;
    /**
     * Error messages if errors occurred
     */
    errors: string[];
}
/**
 * TemplateEngine - Centralized template processor for all primitives
 *
 * Provides unified HTML template processing with placeholder replacement
 * for legends, tooltips, trade markers, and other primitives. This is the
 * single source of truth for all template processing in the application.
 *
 * Architecture:
 * - Singleton pattern (shared across all primitives)
 * - Placeholder syntax: $$placeholder_name$$
 * - Supports chart data, custom data, and formatting
 * - Type-safe with comprehensive error handling
 *
 * Supported Placeholders:
 * - **Chart values**: $$value$$, $$open$$, $$high$$, $$low$$, $$close$$
 * - **Band/Ribbon**: $$upper$$, $$middle$$, $$lower$$
 * - **Volume**: $$volume$$
 * - **Time**: $$time$$
 * - **Custom**: $$custom_key$$ (from customData)
 * - **Trade**: $$pnl$$, $$entry_price$$, etc. (flexible)
 *
 * Features:
 * - Automatic number formatting with precision
 * - HTML escaping for security
 * - Missing placeholder detection
 * - Strict mode for validation
 * - Comprehensive error reporting
 *
 * @export
 * @class TemplateEngine
 *
 * @example
 * ```typescript
 * const engine = TemplateEngine.getInstance();
 *
 * const result = engine.processTemplate(
 *   '<div>Price: $$close$$ ($$time$$)</div>',
 *   {
 *     seriesData: { close: 100.50, time: 1704067200 },
 *     formatting: { precision: 2 }
 *   }
 * );
 *
 * console.log(result.content);
 * // '<div>Price: 100.50 (2024-01-01)</div>'
 * ```
 */
export declare class TemplateEngine {
    /** Singleton instance getter (set by @Singleton decorator) */
    static getInstance: () => TemplateEngine;
    /**
     * Private constructor (Singleton pattern)
     *
     * @private
     */
    private constructor();
    /**
     * Process HTML template with placeholder replacement
     *
     * Replaces all $$placeholder$$ tokens in the template with values from
     * the provided context. Supports chart data, custom data, and formatting
     * options. Returns comprehensive result with processed content and errors.
     *
     * Processing order:
     * 1. Check if processing is enabled
     * 2. Extract all placeholders from template
     * 3. For each placeholder, resolve value from context
     * 4. Apply formatting (precision, HTML escaping)
     * 5. Replace placeholder with formatted value
     * 6. Return result with processed content and metadata
     *
     * @public
     * @param {string} template - HTML template with $$placeholder$$ syntax
     * @param {TemplateContext} [context={}] - Data context for replacement
     * @param {TemplateOptions} [options={}] - Processing options
     * @returns {TemplateResult} Result with content, placeholders, and errors
     *
     * @example
     * ```typescript
     * const result = engine.processTemplate(
     *   '<span>$$title$$: $$value$$</span>',
     *   {
     *     seriesData: { value: 123.45 },
     *     customData: { title: 'Price' },
     *     formatting: { precision: 2 }
     *   },
     *   { strict: true }
     * );
     *
     * console.log(result.content); // '<span>Price: 123.45</span>'
     * console.log(result.processedPlaceholders); // ['title', 'value']
     * ```
     */
    processTemplate(template: string, context?: TemplateContext, options?: TemplateOptions): TemplateResult;
    /**
     * Extract value for a specific placeholder key
     */
    private extractPlaceholderValue;
    /**
     * Smart value extraction for $$value$$ placeholder
     * Falls back through different value types based on series data structure
     */
    private extractSmartValue;
    /**
     * Format value according to type and formatting options
     */
    private formatValue;
    /**
     * Format number according to format specification
     */
    private formatNumber;
    /**
     * Format time value WITHOUT timezone conversion.
     * Times are normalized to Unix timestamps and formatted as-is.
     * No automatic timezone conversion is applied.
     *
     * @param time - Time value in any supported format
     * @param formatter - Optional custom time formatter function
     * @returns Formatted time string
     */
    private formatTimeValue;
    /**
     * Format date with custom format string
     */
    private formatDateWithCustomFormat;
    /**
     * Escape special regex characters
     */
    private escapeRegex;
    /**
     * Escape HTML characters
     */
    private escapeHtml;
    /**
     * Validate template syntax
     */
    validateTemplate(template: string): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Get list of placeholders in template
     */
    getPlaceholders(template: string): string[];
    /**
     * Create template context from series data
     */
    createContextFromSeriesData(seriesData: SeriesDataValue, customData?: Record<string, unknown>, formatting?: TemplateContext["formatting"]): TemplateContext;
}
//# sourceMappingURL=TemplateEngine.d.ts.map