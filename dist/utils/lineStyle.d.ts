import { LineStyle } from 'lightweight-charts';
/**
 * Validates and converts line style to TradingView format.
 *
 * Accepts multiple input formats:
 * - Numbers: 0-4 (LineStyle enum values)
 * - Strings: 'solid', 'dotted', 'dashed', 'large-dashed', 'sparse-dotted'
 * - Arrays: Custom dash patterns (returns Solid)
 *
 * @param lineStyle - Line style in various formats
 * @returns Validated LineStyle enum value or undefined if invalid
 *
 * @example
 * ```typescript
 * validateLineStyle(0) // LineStyle.Solid
 * validateLineStyle('dashed') // LineStyle.Dashed
 * validateLineStyle([5, 5]) // LineStyle.Solid (custom pattern)
 * validateLineStyle('invalid') // undefined
 * ```
 */
export declare const validateLineStyle: (lineStyle: any) => LineStyle | undefined;
/**
 * Recursively cleans and validates chart options.
 *
 * Removes debug properties and validates line styles in nested option objects.
 * Handles special properties like upperLine, middleLine, lowerLine.
 *
 * @param options - Chart options object to clean
 * @returns Cleaned options object with validated line styles
 *
 * @example
 * ```typescript
 * const cleaned = cleanLineStyleOptions({
 *   lineStyle: 'dashed',
 *   debug: true,
 *   upperLine: {
 *     lineStyle: 2,
 *     color: '#ff0000'
 *   },
 *   nestedConfig: {
 *     lineStyle: 'solid'
 *   }
 * });
 * // Returns: { lineStyle: LineStyle.Dashed, upperLine: { ... }, nestedConfig: { ... } }
 * ```
 */
export declare const cleanLineStyleOptions: (options: any) => any;
//# sourceMappingURL=lineStyle.d.ts.map