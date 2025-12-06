/**
 * @fileoverview Line Style Validation and Cleaning Utilities
 *
 * This module provides utilities for validating and cleaning line style options
 * for TradingView Lightweight Charts. It handles the complexity of accepting
 * line styles in multiple formats (numbers, strings, arrays) and standardizing
 * them to the correct LineStyle enum values.
 *
 * Key Features:
 * - Multi-format line style validation (numeric, string, array)
 * - Recursive option object cleaning
 * - Debug property removal for production builds
 * - Special handling for nested line configurations
 * - Type-safe LineStyle enum conversion
 *
 * Input Format Support:
 * 1. Numbers: 0-4 (LineStyle enum values directly)
 * 2. Strings: 'solid', 'dotted', 'dashed', 'large-dashed', 'sparse-dotted'
 * 3. Arrays: Custom dash patterns like [5, 5] (converted to Solid)
 *
 * Use Cases:
 * - Validating user-provided line style configurations
 * - Cleaning chart options before passing to TradingView API
 * - Converting Python-style options (snake_case) to JavaScript (camelCase)
 * - Removing development/debug properties from production builds
 *
 * @example
 * ```typescript
 * import { validateLineStyle, cleanLineStyleOptions } from './lineStyle';
 *
 * // Validate different input formats
 * validateLineStyle(2);              // LineStyle.Dashed
 * validateLineStyle('dotted');       // LineStyle.Dotted
 * validateLineStyle([5, 5]);         // LineStyle.Solid (custom pattern)
 * validateLineStyle('invalid');      // undefined
 *
 * // Clean nested configuration
 * const options = {
 *   lineStyle: 'dashed',
 *   debug: true,                     // Will be removed
 *   upperLine: {
 *     lineStyle: 2,                  // Will be converted to LineStyle.Dashed
 *     color: '#ff0000'
 *   },
 *   middleLine: {
 *     lineStyle: 'solid',            // Will be converted to LineStyle.Solid
 *     color: '#00ff00'
 *   }
 * };
 *
 * const cleaned = cleanLineStyleOptions(options);
 * // Result: All lineStyles are LineStyle enums, debug is removed
 * ```
 */

// ============================================================================
// Third Party Imports
// ============================================================================

import { LineStyle } from "lightweight-charts";

// ============================================================================
// Line Style Validation
// ============================================================================

/**
 * Validates and converts line style from various input formats to LineStyle enum.
 *
 * This function is the core validator for line style inputs. It accepts multiple
 * formats for developer convenience and converts them all to the standard
 * TradingView LineStyle enum.
 *
 * Supported Formats:
 * 1. Number (0-4): Direct LineStyle enum values
 *    - 0 = Solid
 *    - 1 = Dotted
 *    - 2 = Dashed
 *    - 3 = LargeDashed
 *    - 4 = SparseDotted
 *
 * 2. String: Human-readable names (case-insensitive)
 *    - 'solid' → LineStyle.Solid
 *    - 'dotted' → LineStyle.Dotted
 *    - 'dashed' → LineStyle.Dashed
 *    - 'large-dashed' → LineStyle.LargeDashed
 *    - 'sparse-dotted' → LineStyle.SparseDotted
 *
 * 3. Array: Custom dash patterns (e.g., [5, 5] for 5px dash, 5px gap)
 *    - Currently converts to LineStyle.Solid
 *    - All array elements must be non-negative numbers
 *
 * @param lineStyle - Line style in any supported format
 * @returns LineStyle enum value, or undefined if invalid
 *
 * @example
 * ```typescript
 * // Numeric format (enum values)
 * validateLineStyle(0);              // LineStyle.Solid
 * validateLineStyle(2);              // LineStyle.Dashed
 * validateLineStyle(4);              // LineStyle.SparseDotted
 *
 * // String format (case-insensitive)
 * validateLineStyle('SOLID');        // LineStyle.Solid
 * validateLineStyle('Dashed');       // LineStyle.Dashed
 * validateLineStyle('large-dashed'); // LineStyle.LargeDashed
 *
 * // Array format (custom dash patterns)
 * validateLineStyle([5, 5]);         // LineStyle.Solid
 * validateLineStyle([10, 2, 5, 2]);  // LineStyle.Solid
 *
 * // Invalid inputs return undefined
 * validateLineStyle('invalid');      // undefined
 * validateLineStyle(-1);             // undefined
 * validateLineStyle(null);           // undefined
 * validateLineStyle('');             // undefined
 * validateLineStyle([5, -1]);        // undefined (negative value)
 * ```
 *
 * @remarks
 * Null/Undefined Handling: Returns undefined for null, undefined, or empty string.
 * This allows callers to distinguish between "no style provided" and "invalid style".
 *
 * Array Pattern Limitation: Currently, custom dash patterns (arrays) are converted
 * to LineStyle.Solid because TradingView's lightweight-charts library has limited
 * support for custom dash patterns in some contexts.
 *
 * Case Sensitivity: String matching is case-insensitive for user convenience.
 * Both 'SOLID' and 'solid' are valid inputs.
 */
export const validateLineStyle = (lineStyle: any): LineStyle | undefined => {
  // Handle null, undefined, or empty string - return undefined
  // This distinguishes "no value" from "invalid value"
  if (lineStyle === null || lineStyle === undefined || lineStyle === "") {
    return undefined;
  }

  // Case 1: Numeric input (direct enum values 0-4)
  // Check if it's a number and if it's a valid LineStyle enum value
  if (
    typeof lineStyle === "number" &&
    LineStyle &&
    Object.values(LineStyle).includes(lineStyle)
  ) {
    // Valid numeric LineStyle enum value - return as-is
    return lineStyle;
  }

  // Case 2: String input (human-readable names)
  if (typeof lineStyle === "string" && LineStyle) {
    // Map of lowercase string names to LineStyle enum values
    // This allows case-insensitive matching
    const styleMap: { [key: string]: LineStyle } = {
      solid: LineStyle.Solid, // 0
      dotted: LineStyle.Dotted, // 1
      dashed: LineStyle.Dashed, // 2
      "large-dashed": LineStyle.LargeDashed, // 3
      "sparse-dotted": LineStyle.SparseDotted, // 4
    };

    // Convert input to lowercase and look up in map
    return styleMap[lineStyle.toLowerCase()];
  }

  // Case 3: Array input (custom dash pattern)
  // Example: [5, 5] means 5px dash, 5px gap
  if (Array.isArray(lineStyle)) {
    // Validate that:
    // 1. Array is not empty
    // 2. All values are numbers
    // 3. All values are non-negative
    if (
      lineStyle.length > 0 &&
      lineStyle.every((val) => typeof val === "number" && val >= 0) &&
      LineStyle
    ) {
      // Valid custom pattern - return Solid
      // Note: TradingView has limited custom pattern support, so we use Solid
      return LineStyle.Solid;
    }
  }

  // Invalid input - return undefined
  return undefined;
};

// ============================================================================
// Option Cleaning
// ============================================================================

/**
 * Recursively cleans and validates chart options object.
 *
 * This function performs deep cleaning of configuration objects by:
 * 1. Removing debug properties (not needed in production)
 * 2. Validating and converting lineStyle properties
 * 3. Recursively processing nested objects
 * 4. Handling special nested properties (upperLine, middleLine, lowerLine, style)
 *
 * The function is recursive and processes all nested objects to ensure
 * complete validation throughout the configuration tree.
 *
 * @param options - Chart options object to clean (can be any structure)
 * @returns Cleaned options object with validated line styles
 *
 * @example
 * ```typescript
 * // Simple options cleaning
 * const simple = cleanLineStyleOptions({
 *   lineStyle: 'dashed',
 *   color: '#ff0000',
 *   debug: true        // Will be removed
 * });
 * // Result: { lineStyle: LineStyle.Dashed, color: '#ff0000' }
 *
 * // Nested options with special properties
 * const nested = cleanLineStyleOptions({
 *   lineStyle: 2,      // Will be validated (LineStyle.Dashed)
 *   debug: true,       // Will be removed
 *   upperLine: {
 *     lineStyle: 'solid',
 *     color: '#ff0000'
 *   },
 *   middleLine: {
 *     lineStyle: 0,
 *     color: '#00ff00'
 *   },
 *   lowerLine: {
 *     lineStyle: 'dotted',
 *     color: '#0000ff'
 *   }
 * });
 * // All lineStyles converted to enum values, debug removed
 *
 * // Deep nesting with arbitrary objects
 * const deep = cleanLineStyleOptions({
 *   series: {
 *     main: {
 *       lineStyle: 'dashed',
 *       style: {
 *         lineStyle: 'solid'
 *       }
 *     }
 *   }
 * });
 * // All lineStyles validated recursively
 * ```
 *
 * @example
 * ```typescript
 * // Handling invalid line styles
 * const invalid = cleanLineStyleOptions({
 *   lineStyle: 'invalid-style',  // Will be removed
 *   color: '#ff0000'              // Preserved
 * });
 * // Result: { color: '#ff0000' } (invalid lineStyle removed)
 * ```
 *
 * @remarks
 * Mutation: This function creates a shallow copy of the top-level object but
 * may mutate nested objects during cleaning. If you need to preserve the original,
 * pass a deep clone.
 *
 * Debug Properties: The 'debug' property is automatically removed at all nesting
 * levels. This is useful for removing development-only flags before sending
 * options to production APIs.
 *
 * Special Properties: The following properties receive special recursive treatment:
 * - style: General style container
 * - upperLine: Upper line in band/ribbon indicators
 * - middleLine: Middle line in band indicators
 * - lowerLine: Lower line in band/ribbon indicators
 *
 * Generic Recursion: After handling special properties, the function recursively
 * processes all other object properties, ensuring deep validation.
 */
export const cleanLineStyleOptions = (options: any): any => {
  // Handle null/undefined input
  if (!options) {
    return options;
  }

  // Create shallow copy of options to avoid mutating input
  // Note: Nested objects will be recursively copied
  const cleaned: any = { ...options };

  // Remove debug properties (not needed in production)
  // These are typically used during development for logging/testing
  if (cleaned.debug !== undefined) {
    delete cleaned.debug;
  }

  // Validate and convert lineStyle property if present
  if (cleaned.lineStyle !== undefined) {
    // Attempt to validate the lineStyle value
    const validLineStyle = validateLineStyle(cleaned.lineStyle);

    if (validLineStyle !== undefined) {
      // Valid line style - replace with validated enum value
      cleaned.lineStyle = validLineStyle;
    } else {
      // Invalid line style - remove the property entirely
      // This prevents invalid values from being passed to TradingView API
      delete cleaned.lineStyle;
    }
  }

  // Recursively clean special nested properties
  // These properties commonly contain line style configurations

  // Style container (general styling object)
  if (cleaned.style && typeof cleaned.style === "object") {
    cleaned.style = cleanLineStyleOptions(cleaned.style);
  }

  // Band/Ribbon line properties
  // These are specific to band and ribbon series types
  if (cleaned.upperLine && typeof cleaned.upperLine === "object") {
    cleaned.upperLine = cleanLineStyleOptions(cleaned.upperLine);
  }
  if (cleaned.middleLine && typeof cleaned.middleLine === "object") {
    cleaned.middleLine = cleanLineStyleOptions(cleaned.middleLine);
  }
  if (cleaned.lowerLine && typeof cleaned.lowerLine === "object") {
    cleaned.lowerLine = cleanLineStyleOptions(cleaned.lowerLine);
  }

  // Recursively clean all other nested objects
  // This ensures we catch any lineStyle properties in arbitrary nested structures
  for (const key in cleaned) {
    // Check if property is an object (but not an array)
    // Arrays are left as-is (e.g., data arrays, custom patterns)
    if (
      cleaned[key] &&
      typeof cleaned[key] === "object" &&
      !Array.isArray(cleaned[key])
    ) {
      // Recursively clean this nested object
      cleaned[key] = cleanLineStyleOptions(cleaned[key]);
    }
  }

  // Return the cleaned options object
  return cleaned;
};
