/**
 * @fileoverview Lightweight Charts Type Compatibility Utilities
 *
 * This module provides type-safe utility functions for working with TradingView's
 * Lightweight Charts library. It handles DeepPartial interface compatibility,
 * type conversions, and safe options updates to prevent TypeScript errors when
 * applying chart and series configurations.
 *
 * Key Features:
 * - Type-safe converters for chart options
 * - Series options compatibility helpers
 * - Line width, style, and source converters
 * - Safe options update wrappers
 * - DeepPartial compatibility layer
 *
 * Why This Module Exists:
 * TradingView's Lightweight Charts library uses complex type definitions with
 * DeepPartial wrappers that can cause TypeScript strict mode errors. This module
 * provides a compatibility layer that allows safe option updates while maintaining
 * type safety.
 *
 * Common Use Cases:
 * - Converting user-provided options to chart-compatible format
 * - Updating series styling without type errors
 * - Handling line width, style, and price line configurations
 * - Wrapping options for safe applyOptions() calls
 *
 * @example
 * ```typescript
 * import {
 *   createSeriesOptions,
 *   asLineWidth,
 *   safeSeriesOptions
 * } from './lightweightChartsUtils';
 *
 * // Convert options for series
 * const options = createSeriesOptions({
 *   lineWidth: 2,
 *   lineStyle: 0,
 *   color: '#2196F3',
 *   priceLineSource: 'close'
 * });
 *
 * // Apply safely to series
 * series.applyOptions(safeSeriesOptions(options));
 * ```
 *
 * @see https://tradingview.github.io/lightweight-charts/
 */
/**
 * Convert number to type-safe line width for Lightweight Charts.
 *
 * TradingView's Lightweight Charts uses specific types for line widths that
 * may not directly accept raw numbers in strict TypeScript mode. This function
 * provides a type-safe conversion.
 *
 * @param value - Line width in pixels (typically 1-10)
 * @returns Type-safe line width value for chart API
 *
 * @example
 * ```typescript
 * // Without converter (may cause TypeScript error in strict mode)
 * // series.applyOptions({ lineWidth: 2 }); // TS Error
 *
 * // With converter (type-safe)
 * series.applyOptions({
 *   lineWidth: asLineWidth(2)  // Works in strict mode
 * });
 *
 * // Common line widths
 * const thin = asLineWidth(1);      // Thin line
 * const normal = asLineWidth(2);    // Normal line
 * const thick = asLineWidth(4);     // Thick line
 * ```
 *
 * @remarks
 * Use Cases:
 * - Series line width (lineWidth property)
 * - Price line width (priceLineWidth property)
 * - Base line width (baseLineWidth property)
 *
 * Return Type: The function returns `any` to bypass strict type checking
 * while maintaining runtime safety. This is necessary due to Lightweight
 * Charts' complex type definitions.
 */
export declare function asLineWidth(value: number): any;
/**
 * Convert line style to type-safe value for Lightweight Charts.
 *
 * Handles both numeric and string line style inputs, converting them to
 * the format expected by Lightweight Charts API. Line styles control the
 * dash pattern of lines (solid, dotted, dashed, etc.).
 *
 * Supported Line Styles:
 * - 0 = Solid (no dashes)
 * - 1 = Dotted (small dots)
 * - 2 = Dashed (medium dashes)
 * - 3 = Large Dashed (long dashes)
 * - 4 = Sparse Dotted (widely spaced dots)
 *
 * @param value - Line style as number (0-4) or string representation
 * @returns Type-safe line style value for chart API
 *
 * @example
 * ```typescript
 * // Numeric input (LineStyle enum values)
 * series.applyOptions({
 *   lineStyle: asLineStyle(0)   // Solid
 * });
 *
 * series.applyOptions({
 *   lineStyle: asLineStyle(2)   // Dashed
 * });
 *
 * // String input (converted to numeric)
 * series.applyOptions({
 *   lineStyle: asLineStyle('2')  // Parsed to 2 (Dashed)
 * });
 *
 * // Common patterns
 * const solid = asLineStyle(0);         // Continuous line
 * const dashed = asLineStyle(2);        // Dashed line for support/resistance
 * const dotted = asLineStyle(1);        // Dotted line for secondary indicators
 * ```
 *
 * @remarks
 * String Conversion: When a string is provided, parseInt() is used with
 * base 10 to convert it to a number. Invalid strings will result in NaN,
 * which may cause rendering issues.
 *
 * Validation: This function does not validate the numeric range. Callers
 * should ensure values are 0-4 for standard line styles.
 */
export declare function asLineStyle(value: number | string): any;
/**
 * Convert price line source to type-safe value for Lightweight Charts.
 *
 * Price line source determines which price value is used for the horizontal
 * price line on OHLC series. This is typically 'close' for most series.
 *
 * Common Price Line Sources:
 * - 'close': Use closing price (most common)
 * - 'open': Use opening price
 * - 'high': Use high price
 * - 'low': Use low price
 *
 * @param value - Price line source field name
 * @returns Type-safe price line source value for chart API
 *
 * @example
 * ```typescript
 * // Candlestick series using close price
 * candlestickSeries.applyOptions({
 *   priceLineSource: asPriceLineSource('close')
 * });
 *
 * // Line series typically uses close
 * lineSeries.applyOptions({
 *   priceLineSource: asPriceLineSource('close')
 * });
 *
 * // Bar series using high price
 * barSeries.applyOptions({
 *   priceLineSource: asPriceLineSource('high')
 * });
 * ```
 *
 * @remarks
 * Use Case: This is primarily used with OHLC series types (candlestick, bar).
 * Line series typically only have a single value, so this property may not
 * apply.
 *
 * No Validation: The function does not validate that the source value is
 * a valid field name. Ensure it matches your data structure.
 */
export declare function asPriceLineSource(value: string): any;
/**
 * Convert series options object to type-safe format for Lightweight Charts.
 *
 * This is the primary utility for converting user-provided options to chart
 * API compatible format. It automatically detects and converts special
 * properties like line widths, line styles, and price line sources.
 *
 * Converted Properties:
 * - lineWidth → asLineWidth()
 * - priceLineWidth → asLineWidth()
 * - baseLineWidth → asLineWidth()
 * - lineStyle → asLineStyle()
 * - priceLineStyle → asLineStyle()
 * - baseLineStyle → asLineStyle()
 * - priceLineSource → asPriceLineSource()
 * - All other properties → passed through unchanged
 *
 * @param options - Raw options object (can be from user input, config, etc.)
 * @returns Converted options safe for series.applyOptions()
 *
 * @example
 * ```typescript
 * // Basic usage
 * const userOptions = {
 *   lineWidth: 2,
 *   lineStyle: 0,
 *   color: '#2196F3',
 *   priceLineVisible: true
 * };
 *
 * const converted = createSeriesOptions(userOptions);
 * series.applyOptions(converted);
 *
 * // Complex configuration
 * const advancedOptions = {
 *   // Line styling
 *   lineWidth: 3,
 *   lineStyle: 2,  // Dashed
 *   color: '#FF5722',
 *
 *   // Price line configuration
 *   priceLineVisible: true,
 *   priceLineWidth: 2,
 *   priceLineStyle: 1,  // Dotted
 *   priceLineSource: 'close',
 *   priceLineColor: '#4CAF50',
 *
 *   // Base line (for baseline series)
 *   baseLineVisible: true,
 *   baseLineWidth: 1,
 *   baseLineStyle: 0,  // Solid
 *   baseLineColor: '#9E9E9E',
 *
 *   // Other properties (passed through)
 *   title: 'My Series',
 *   priceFormat: { type: 'price', precision: 2 },
 *   lastValueVisible: true,
 *   priceScaleId: 'right'
 * };
 *
 * const converted = createSeriesOptions(advancedOptions);
 * series.applyOptions(converted);
 * ```
 *
 * @example
 * ```typescript
 * // String line style inputs (automatically converted)
 * const options = createSeriesOptions({
 *   lineWidth: 2,
 *   lineStyle: '2',  // String '2' → number 2
 *   color: '#2196F3'
 * });
 * // Result: { lineWidth: 2, lineStyle: 2, color: '#2196F3' }
 *
 * // Mixed property types
 * const mixedOptions = createSeriesOptions({
 *   // Converted properties
 *   lineWidth: 3,
 *   priceLineWidth: 1,
 *
 *   // Regular properties (not converted)
 *   color: '#FF0000',
 *   visible: true,
 *   crosshairMarkerVisible: false,
 *
 *   // Nested objects (preserved as-is)
 *   priceFormat: {
 *     type: 'custom',
 *     formatter: (price) => `$${price.toFixed(2)}`
 *   }
 * });
 * ```
 *
 * @remarks
 * Property Iteration: The function iterates through all properties in the
 * input object using Object.entries(). This creates a shallow copy, so
 * nested objects are preserved by reference.
 *
 * Switch Statement: Uses switch for clarity and performance. Each special
 * property is explicitly handled, making it easy to add new conversions.
 *
 * Default Case: Properties not listed in the switch statement are copied
 * to the output unchanged. This ensures all valid chart options pass through.
 *
 * Type Safety: Returns Record<string, any> to accommodate the flexible
 * options structure while maintaining runtime safety.
 */
export declare function createSeriesOptions(options: Record<string, any>): Record<string, any>;
/**
 * Wrap options in type-safe container for Lightweight Charts API.
 *
 * This is a pass-through wrapper that provides type safety when passing
 * options to series.applyOptions() or chart.applyOptions(). It's primarily
 * used to satisfy TypeScript's type checker when dealing with complex
 * DeepPartial types.
 *
 * Why This Exists:
 * Lightweight Charts uses DeepPartial<T> for its options types, which can
 * cause TypeScript errors in strict mode. This wrapper explicitly casts
 * the options to the expected type, providing a clean API surface.
 *
 * @template T - The options type (usually inferred from context)
 * @param options - Options object to wrap
 * @returns Type-safe options ready for applyOptions()
 *
 * @example
 * ```typescript
 * // Basic usage
 * const options = {
 *   lineWidth: 2,
 *   color: '#2196F3'
 * };
 *
 * // Without wrapper (may cause TS error in strict mode)
 * // series.applyOptions(options); // Potential type error
 *
 * // With wrapper (type-safe)
 * series.applyOptions(safeSeriesOptions(options));
 * ```
 *
 * @example
 * ```typescript
 * // Combined with createSeriesOptions
 * const userOptions = {
 *   lineWidth: 2,
 *   lineStyle: 0,
 *   color: '#FF5722',
 *   priceLineWidth: 1
 * };
 *
 * // First convert, then wrap for safety
 * const converted = createSeriesOptions(userOptions);
 * series.applyOptions(safeSeriesOptions(converted));
 *
 * // Or combine in one line
 * series.applyOptions(
 *   safeSeriesOptions(createSeriesOptions(userOptions))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Chart options (not just series)
 * const chartOptions = {
 *   layout: {
 *     background: { color: '#FFFFFF' },
 *     textColor: '#333333'
 *   },
 *   grid: {
 *     vertLines: { color: '#E0E0E0' },
 *     horzLines: { color: '#E0E0E0' }
 *   }
 * };
 *
 * chart.applyOptions(safeSeriesOptions(chartOptions));
 * ```
 *
 * @remarks
 * Generic Type: The function is generic and preserves the type of the input
 * options. TypeScript will infer the type from context when possible.
 *
 * Type Casting: Internally, this function performs a type assertion (as T).
 * This is safe because we're not modifying the options, just changing how
 * TypeScript perceives them.
 *
 * No Runtime Effect: This function has zero runtime cost. It's purely for
 * TypeScript type safety and compiles away in JavaScript.
 *
 * Use Cases:
 * - Applying options from external configuration
 * - Updating series after user input
 * - Programmatic option updates in strict TypeScript projects
 * - Working around DeepPartial type complexities
 */
export declare function safeSeriesOptions<T>(options: T): T;
//# sourceMappingURL=lightweightChartsUtils.d.ts.map