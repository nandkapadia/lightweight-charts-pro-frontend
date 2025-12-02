/**
 * @fileoverview Unified data validation utilities for series plugins
 *
 * Provides DRY-compliant validation functions to eliminate code duplication
 * across series plugins and ensure consistent data validation.
 */
/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Data validation configuration
 */
export interface ValidationConfig {
    /** Required fields that must be present */
    required?: string[];
    /** Numeric fields that must be valid numbers */
    numeric?: string[];
    /** Fields that must be finite numbers */
    finite?: string[];
    /** Fields that can be null */
    nullable?: string[];
    /** Fields that can be undefined */
    optional?: string[];
    /** Custom validation functions */
    custom?: Array<{
        field: string;
        validator: (value: any, data: any) => boolean;
        message: string;
    }>;
}
/**
 * Validate data object against configuration
 *
 * @param data - Data object to validate
 * @param config - Validation configuration
 * @returns Validation result with errors and warnings
 */
export declare function validateData(data: Record<string, any>, config: ValidationConfig): ValidationResult;
/**
 * Validate array of data objects
 *
 * @param dataArray - Array of data objects to validate
 * @param config - Validation configuration
 * @returns Array of validation results
 */
export declare function validateDataArray(dataArray: Record<string, any>[], config: ValidationConfig): ValidationResult[];
/**
 * Filter valid data items from array
 *
 * @param dataArray - Array of data objects to filter
 * @param config - Validation configuration
 * @returns Array of valid data objects
 */
export declare function filterValidData<T extends Record<string, any>>(dataArray: T[], config: ValidationConfig): T[];
/**
 * Predefined validation configurations for common series types
 */
export declare const ValidationConfigs: {
    /** Configuration for ribbon data (upper, lower values) */
    ribbon: ValidationConfig;
    /** Configuration for band data (upper, middle, lower values) */
    band: ValidationConfig;
    /** Configuration for gradient ribbon data */
    gradientRibbon: ValidationConfig;
    /** Configuration for single value data */
    singleValue: ValidationConfig;
    /** Configuration for OHLC data */
    ohlc: ValidationConfig;
};
/**
 * Quick validation functions for common patterns
 */
export declare const QuickValidators: {
    /** Check if value is a valid number */
    isNumber: (value: any) => boolean;
    /** Check if value is a valid finite number */
    isFiniteNumber: (value: any) => boolean;
    /** Check if value is null or valid number */
    isNumberOrNull: (value: any) => boolean;
    /** Check if value is undefined or valid number */
    isNumberOrUndefined: (value: any) => boolean;
    /** Check if all values in object are valid numbers */
    areAllNumbers: (data: Record<string, any>, keys: string[]) => boolean;
    /** Check if all values in object are finite numbers */
    areAllFiniteNumbers: (data: Record<string, any>, keys: string[]) => boolean;
};
//# sourceMappingURL=dataValidation.d.ts.map