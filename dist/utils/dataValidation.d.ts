/**
 * @fileoverview Unified Data Validation for Trading Chart Series
 *
 * This module provides comprehensive, reusable validation utilities for chart series data.
 * It eliminates code duplication across series plugins and ensures consistent data validation
 * with clear error reporting.
 *
 * Key Features:
 * - Declarative validation configuration
 * - Required field validation
 * - Numeric type validation
 * - Finite number validation (no Infinity, -Infinity)
 * - Nullable/optional field support
 * - Custom validator functions
 * - Batch validation for data arrays
 * - Filtering of valid data points
 * - Predefined configs for common series types
 * - Quick validator utilities
 *
 * Architecture:
 * - Configuration-based validation (declarative, not imperative)
 * - Separation of validation logic and data processing
 * - Clear error/warning distinction
 * - Reusable validation configs
 * - Type-safe generic filtering
 *
 * Validation Workflow:
 * 1. Define validation config (required, numeric, finite, custom)
 * 2. Run validateData() or validateDataArray()
 * 3. Check result.isValid
 * 4. Log/display errors and warnings
 * 5. Use filterValidData() to remove invalid points
 *
 * @example
 * ```typescript
 * import { validateData, ValidationConfigs, filterValidData } from './dataValidation';
 *
 * // Validate single data point
 * const result = validateData(
 *   { time: 1234567890, upper: 100, lower: 90 },
 *   ValidationConfigs.ribbon
 * );
 *
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 *
 * // Filter array to keep only valid points
 * const validData = filterValidData(chartData, ValidationConfigs.band);
 * series.setData(validData);
 * ```
 */
/**
 * Result object returned by validation functions.
 *
 * Contains validation status, error messages, and warning messages.
 * Errors indicate invalid data that should be rejected.
 * Warnings indicate questionable data that may still be usable.
 *
 * @property isValid - true if no errors, false if any errors present
 * @property errors - Array of error messages (validation failures)
 * @property warnings - Array of warning messages (suspicious but valid data)
 *
 * @example
 * ```typescript
 * const result: ValidationResult = {
 *   isValid: false,
 *   errors: ['Required field "time" is missing'],
 *   warnings: ['Field "color" is expected to be string, got number']
 * };
 *
 * if (!result.isValid) {
 *   logger.error('Data validation failed', 'DataValidator', { errors: result.errors });
 * }
 *
 * if (result.warnings.length > 0) {
 *   logger.warn('Data validation warnings', 'DataValidator', { warnings: result.warnings });
 * }
 * ```
 */
export interface ValidationResult {
    /**
     * Whether the data passed validation (no errors).
     * false if any errors are present, true otherwise.
     */
    isValid: boolean;
    /**
     * Array of error messages describing validation failures.
     * Empty array if no errors.
     */
    errors: string[];
    /**
     * Array of warning messages for suspicious but technically valid data.
     * Empty array if no warnings.
     */
    warnings: string[];
}
/**
 * Configuration object defining validation rules.
 *
 * Specifies which fields to validate and what rules to apply.
 * All properties are optional - specify only the validations you need.
 *
 * @property required - Fields that must be present (not undefined)
 * @property numeric - Fields that must be numbers (not NaN)
 * @property finite - Fields that must be finite numbers (not Infinity)
 * @property nullable - Fields that can be null or numeric
 * @property optional - Fields that can be undefined
 * @property custom - Custom validation functions for complex rules
 *
 * @example
 * ```typescript
 * const config: ValidationConfig = {
 *   required: ['time', 'value'],
 *   numeric: ['value'],
 *   finite: ['value'],
 *   custom: [{
 *     field: 'value',
 *     validator: (val) => val >= 0,
 *     message: 'value must be non-negative'
 *   }]
 * };
 * ```
 */
export interface ValidationConfig {
    /**
     * Required fields that must be present in data.
     * Validation fails if field is undefined or not in object.
     */
    required?: string[];
    /**
     * Fields that must be valid numbers.
     * Checks: typeof value === 'number' && !isNaN(value)
     */
    numeric?: string[];
    /**
     * Fields that must be finite numbers (not Infinity or -Infinity).
     * Checks: isFinite(value)
     */
    finite?: string[];
    /**
     * Fields that can be null.
     * Generates warnings if non-null and non-numeric.
     */
    nullable?: string[];
    /**
     * Fields that can be undefined.
     * Doesn't generate errors if missing.
     */
    optional?: string[];
    /**
     * Custom validation functions for complex rules.
     * Each validator receives the field value and entire data object.
     */
    custom?: Array<{
        /** Field name to validate */
        field: string;
        /** Validation function - return true if valid, false if invalid */
        validator: (value: any, data: any) => boolean;
        /** Error message if validation fails */
        message: string;
    }>;
}
/**
 * Validate a single data object against configuration rules.
 *
 * Runs all configured validations and returns a result with errors and warnings.
 * This is the primary validation function used throughout the codebase.
 *
 * @param data - Data object to validate (chart data point)
 * @param config - Validation configuration defining rules
 * @returns ValidationResult with isValid flag and error/warning messages
 *
 * @example
 * ```typescript
 * // Validate ribbon data point
 * const data = { time: 1234567890, upper: 100, lower: 90 };
 * const result = validateData(data, ValidationConfigs.ribbon);
 *
 * if (result.isValid) {
 *   console.log('Data is valid');
 * } else {
 *   console.error('Validation failed:', result.errors);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Custom validation config
 * const config: ValidationConfig = {
 *   required: ['time', 'price'],
 *   numeric: ['price'],
 *   finite: ['price'],
 *   custom: [{
 *     field: 'price',
 *     validator: (val) => val > 0,
 *     message: 'price must be positive'
 *   }]
 * };
 *
 * const result = validateData({ time: 123, price: -10 }, config);
 * // result.isValid = false
 * // result.errors = ['Custom validation failed for "price": price must be positive']
 * ```
 *
 * @remarks
 * Validation Order:
 * 1. Required fields check
 * 2. Numeric type check
 * 3. Finite number check
 * 4. Nullable field warnings
 * 5. Custom validators
 *
 * Error vs Warning:
 * - Errors: Data is invalid and should be rejected
 * - Warnings: Data is suspicious but may still be usable
 */
export declare function validateData(data: Record<string, any>, config: ValidationConfig): ValidationResult;
/**
 * Validate an array of data objects.
 *
 * Runs validateData() on each element and returns an array of results.
 * Each result includes the array index in error messages for easy debugging.
 *
 * @param dataArray - Array of data objects to validate
 * @param config - Validation configuration to apply to each element
 * @returns Array of ValidationResult objects (one per data point)
 *
 * @example
 * ```typescript
 * const data = [
 *   { time: 1, upper: 100, lower: 90 },
 *   { time: 2, upper: 'invalid', lower: 85 }, // Invalid
 *   { time: 3, upper: 110, lower: 95 }
 * ];
 *
 * const results = validateDataArray(data, ValidationConfigs.ribbon);
 *
 * results.forEach((result, index) => {
 *   if (!result.isValid) {
 *     console.error(`Data point ${index} invalid:`, result.errors);
 *   }
 * });
 *
 * // Output: "Data point 1 invalid: ["[1]: Field 'upper' must be a number, got string"]"
 * ```
 *
 * @remarks
 * Error Message Format:
 * Each error message is prefixed with `[index]:` to indicate which
 * array element failed validation. This makes debugging large datasets easier.
 *
 * Performance:
 * This validates all elements even if some fail. For early-exit behavior
 * on first error, use a custom loop with validateData().
 */
export declare function validateDataArray(dataArray: Record<string, any>[], config: ValidationConfig): ValidationResult[];
/**
 * Filter an array to keep only valid data points.
 *
 * Validates each element and returns a new array containing only points that
 * pass validation. Invalid points are silently filtered out.
 *
 * @template T - Type of data objects (must extend Record<string, any>)
 * @param dataArray - Array of data objects to filter
 * @param config - Validation configuration
 * @returns Array containing only valid data points
 *
 * @example
 * ```typescript
 * const rawData = [
 *   { time: 1, value: 100 },
 *   { time: 2, value: NaN },      // Filtered out
 *   { time: 3 },                  // Filtered out (missing value)
 *   { time: 4, value: 110 }
 * ];
 *
 * const validData = filterValidData(rawData, ValidationConfigs.singleValue);
 * // validData = [{ time: 1, value: 100 }, { time: 4, value: 110 }]
 *
 * series.setData(validData); // Only valid points
 * ```
 *
 * @example
 * ```typescript
 * // With custom type
 * interface RibbonData {
 *   time: number;
 *   upper: number;
 *   lower: number;
 *   color?: string;
 * }
 *
 * const data: RibbonData[] = [...];
 * const valid = filterValidData<RibbonData>(data, ValidationConfigs.ribbon);
 * // valid has type RibbonData[]
 * ```
 *
 * @remarks
 * Silent Filtering:
 * This function doesn't log or report invalid points. Use validateDataArray()
 * if you need to know which points were invalid and why.
 *
 * Type Safety:
 * The generic parameter T ensures the returned array has the same type as
 * the input array, maintaining type safety through the filtering operation.
 */
export declare function filterValidData<T extends Record<string, any>>(dataArray: T[], config: ValidationConfig): T[];
/**
 * Predefined validation configurations for common chart series types.
 *
 * These configs eliminate the need to manually define validation rules for
 * standard series types. Import and use them directly with validation functions.
 *
 * Available Configurations:
 * - ribbon: Upper/lower values (filled area between two lines)
 * - band: Upper/middle/lower values (Bollinger Bands style)
 * - gradientRibbon: Upper/lower with optional fill color
 * - singleValue: Single value series (line, area)
 * - ohlc: Open/High/Low/Close (candlestick, bar)
 *
 * @example
 * ```typescript
 * import { ValidationConfigs, filterValidData } from './dataValidation';
 *
 * // Use predefined config
 * const validRibbonData = filterValidData(data, ValidationConfigs.ribbon);
 * const validBandData = filterValidData(data, ValidationConfigs.band);
 * const validOHLC = filterValidData(data, ValidationConfigs.ohlc);
 * ```
 */
export declare const ValidationConfigs: {
    /**
     * Validation config for ribbon data (upper and lower values).
     *
     * Required: time, upper, lower
     * Must be numeric and finite.
     *
     * Use for: Ribbon series, channel indicators, prediction intervals
     */
    ribbon: ValidationConfig;
    /**
     * Validation config for band data (upper, middle, and lower values).
     *
     * Required: time, upper, middle, lower
     * Must be numeric and finite.
     *
     * Use for: Bollinger Bands, Keltner Channels, moving average envelopes
     */
    band: ValidationConfig;
    /**
     * Validation config for gradient ribbon data.
     *
     * Required: time, upper, lower
     * Optional: fillColor (must be string if present)
     * Must be numeric and finite.
     *
     * Use for: Gradient-filled ribbons with dynamic colors
     */
    gradientRibbon: ValidationConfig;
    /**
     * Validation config for single value data.
     *
     * Required: time, value
     * Must be numeric and finite.
     *
     * Use for: Line series, area series, histogram
     */
    singleValue: ValidationConfig;
    /**
     * Validation config for OHLC (candlestick) data.
     *
     * Required: time, open, high, low, close
     * Must be numeric and finite.
     * Custom validators ensure high >= max(open, close) and low <= min(open, close).
     *
     * Use for: Candlestick series, bar series
     */
    ohlc: ValidationConfig;
};
/**
 * Quick validator utility functions for common validation patterns.
 *
 * These are simple, composable functions for inline validation checks.
 * Use them when you need quick validation without full config-based validation.
 *
 * @example
 * ```typescript
 * import { QuickValidators } from './dataValidation';
 *
 * if (!QuickValidators.isNumber(value)) {
 *   throw new Error('Value must be a number');
 * }
 *
 * if (QuickValidators.areAllNumbers(data, ['open', 'high', 'low', 'close'])) {
 *   processOHLC(data);
 * }
 * ```
 */
export declare const QuickValidators: {
    /**
     * Check if value is a valid number (not NaN, not Infinity).
     *
     * @param value - Value to check
     * @returns true if number and finite, false otherwise
     */
    isNumber: (value: any) => boolean;
    /**
     * Check if value is a finite number.
     *
     * @param value - Value to check
     * @returns true if number and finite, false otherwise
     */
    isFiniteNumber: (value: any) => boolean;
    /**
     * Check if value is null or a valid number.
     *
     * @param value - Value to check
     * @returns true if null or valid number, false otherwise
     */
    isNumberOrNull: (value: any) => boolean;
    /**
     * Check if value is undefined or a valid number.
     *
     * @param value - Value to check
     * @returns true if undefined or valid number, false otherwise
     */
    isNumberOrUndefined: (value: any) => boolean;
    /**
     * Check if all specified fields in object are valid numbers.
     *
     * @param data - Object containing fields to check
     * @param keys - Array of field names to validate
     * @returns true if all fields are valid numbers, false otherwise
     */
    areAllNumbers: (data: Record<string, any>, keys: string[]) => boolean;
    /**
     * Check if all specified fields in object are finite numbers.
     *
     * @param data - Object containing fields to check
     * @param keys - Array of field names to validate
     * @returns true if all fields are finite numbers, false otherwise
     */
    areAllFiniteNumbers: (data: Record<string, any>, keys: string[]) => boolean;
};
//# sourceMappingURL=dataValidation.d.ts.map