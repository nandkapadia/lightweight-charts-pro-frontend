import { LineStyle } from 'lightweight-charts';
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
export declare const validateLineStyle: (lineStyle: any) => LineStyle | undefined;
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
export declare const cleanLineStyleOptions: (options: any) => any;
//# sourceMappingURL=lineStyle.d.ts.map