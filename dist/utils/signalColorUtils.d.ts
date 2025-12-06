/**
 * @fileoverview Signal Color Utilities for Trading Indicators
 *
 * This module provides color determination logic for Signal series, which display
 * trading signals as colored markers on charts. The utility ensures consistent color
 * rendering across different rendering modes (series plugin vs primitive rendering).
 *
 * Key Features:
 * - Boolean signal handling (true/false converted to 1/0)
 * - Numeric signal handling (positive, negative, zero)
 * - Smart alertColor usage (only for non-boolean datasets)
 * - Consistent color logic shared between SignalSeriesPlugin and SignalPrimitive
 *
 * Signal Types:
 * 1. Boolean Signals: Only 0/1 or true/false values
 *    - 0/false → neutralColor (no signal)
 *    - 1/true → signalColor (signal active)
 *
 * 2. Numeric Signals: Can include negative values, 0, and positive values
 *    - 0 → neutralColor (no signal)
 *    - Positive → signalColor (bullish signal)
 *    - Negative → alertColor (bearish signal)
 *
 * Use Cases:
 * - Buy/sell signals (1 = buy, 0 = neutral, -1 = sell)
 * - Indicator states (1 = overbought, 0 = neutral, -1 = oversold)
 * - Trade direction markers (1 = long, -1 = short)
 *
 * @example
 * ```typescript
 * // Boolean signals (only 0 and 1)
 * const boolData = [0, 1, 0, 1, 0];
 * const hasNonBoolean = SignalColorCalculator.checkForNonBooleanValues(boolData);
 * // hasNonBoolean = false
 *
 * // Numeric signals (includes negative)
 * const numData = [0, 1, -1, 1, 0];
 * const hasNonBoolean2 = SignalColorCalculator.checkForNonBooleanValues(numData);
 * // hasNonBoolean2 = true (contains -1)
 *
 * const color = SignalColorCalculator.getColorForValue(
 *   -1,
 *   { neutralColor: 'gray', signalColor: 'green', alertColor: 'red' },
 *   true
 * );
 * // color = 'red' (alertColor for negative value)
 * ```
 *
 * @see signalSeriesPlugin.ts - Uses this for series rendering
 * @see SignalPrimitive.ts - Uses this for primitive rendering
 */
/**
 * Color configuration options for signal visualization.
 *
 * These colors define the appearance of different signal states in trading charts.
 * Each color is optional and will fall back to 'transparent' if not provided.
 *
 * @property neutralColor - Color for zero/no signal state (typically gray or transparent)
 * @property signalColor - Color for positive signals (typically green for bullish)
 * @property alertColor - Color for negative signals (typically red for bearish)
 *
 * @example
 * ```typescript
 * // Standard traffic light colors
 * const options: SignalColorOptions = {
 *   neutralColor: '#808080',  // Gray for neutral
 *   signalColor: '#00FF00',   // Green for buy/bullish
 *   alertColor: '#FF0000'     // Red for sell/bearish
 * };
 *
 * // Subtle colors for background indicators
 * const subtleOptions: SignalColorOptions = {
 *   neutralColor: 'transparent',
 *   signalColor: 'rgba(0, 255, 0, 0.2)',  // Semi-transparent green
 *   alertColor: 'rgba(255, 0, 0, 0.2)'    // Semi-transparent red
 * };
 * ```
 */
export interface SignalColorOptions {
    /**
     * Color for zero/neutral signal state.
     * Used when signal value is 0 or false.
     */
    neutralColor?: string;
    /**
     * Color for positive signal state.
     * Used when signal value is > 0 or true.
     */
    signalColor?: string;
    /**
     * Color for negative/alert signal state.
     * Only used when dataset contains non-boolean values.
     * Falls back to signalColor if not provided.
     */
    alertColor?: string;
}
/**
 * Signal Color Calculator - Determines colors for trading signals.
 *
 * This static utility class handles the color determination logic for Signal series.
 * It detects whether data contains only boolean values (0/1) or includes other numeric
 * values, which affects whether the alertColor should be used.
 *
 * @remarks
 * Why Static?
 * This class only contains static methods because it doesn't maintain any state.
 * All methods are pure functions that depend only on their input arguments.
 *
 * Boolean Detection:
 * The class converts values to numbers before checking, which means it handles both:
 * - JavaScript booleans: Number(true) = 1, Number(false) = 0
 * - Numeric values: 0, 1, -1, 2, etc.
 *
 * @example
 * ```typescript
 * // Check if data is boolean-only
 * const data1 = [0, 1, 0, 1];
 * const isBooleanOnly = !SignalColorCalculator.checkForNonBooleanValues(data1);
 * // isBooleanOnly = true
 *
 * // Check if data has other values
 * const data2 = [0, 1, -1, 0];
 * const hasOtherValues = SignalColorCalculator.checkForNonBooleanValues(data2);
 * // hasOtherValues = true (because of -1)
 *
 * // Get color for a value
 * const options = {
 *   neutralColor: 'gray',
 *   signalColor: 'green',
 *   alertColor: 'red'
 * };
 *
 * const color1 = SignalColorCalculator.getColorForValue(1, options, false);
 * // color1 = 'green'
 *
 * const color2 = SignalColorCalculator.getColorForValue(-1, options, true);
 * // color2 = 'red'
 * ```
 */
export declare class SignalColorCalculator {
    /**
     * Check if data contains any values that are not 0 or 1.
     *
     * This method determines whether the dataset is "boolean-only" (contains only
     * 0 and 1 values) or includes other numeric values. This affects color selection:
     * - Boolean-only data doesn't use alertColor
     * - Data with other values uses alertColor for negative values
     *
     * @param values - Array of signal values to analyze
     * @returns boolean - true if any value is not 0 or 1, false if all are 0 or 1
     *
     * @example
     * ```typescript
     * // Boolean-only data
     * const boolData = [0, 1, 0, 1, 0, 1];
     * const result1 = SignalColorCalculator.checkForNonBooleanValues(boolData);
     * // result1 = false (all values are 0 or 1)
     *
     * // Data with negative values
     * const numData = [0, 1, -1, 0, 1];
     * const result2 = SignalColorCalculator.checkForNonBooleanValues(numData);
     * // result2 = true (contains -1)
     *
     * // Data with values > 1
     * const multiData = [0, 1, 2, 0, 1];
     * const result3 = SignalColorCalculator.checkForNonBooleanValues(multiData);
     * // result3 = true (contains 2)
     *
     * // Mixed boolean types (JavaScript true/false)
     * const jsData = [false, true, false, true] as any[];
     * const result4 = SignalColorCalculator.checkForNonBooleanValues(jsData);
     * // result4 = false (Number(false)=0, Number(true)=1)
     * ```
     *
     * @remarks
     * Type Conversion: The method converts each value to a number using Number().
     * This handles both:
     * - JavaScript booleans: Number(true) = 1, Number(false) = 0
     * - Numeric strings: Number('1') = 1
     * - Actual numbers: Number(1) = 1
     *
     * Performance: The method short-circuits as soon as it finds a non-boolean value,
     * so it doesn't need to check the entire array in most cases.
     */
    static checkForNonBooleanValues(values: number[]): boolean;
    /**
     * Get the appropriate color for a signal value.
     *
     * This method implements the core color selection logic based on the signal value
     * and dataset characteristics. The color mapping adapts based on whether the dataset
     * contains only boolean values or includes other numeric values.
     *
     * Color Selection Rules:
     * 1. If value === 0: Use neutralColor (no signal)
     * 2. If value > 0: Use signalColor (positive/bullish signal)
     * 3. If value < 0:
     *    - Use alertColor if hasNonBooleanValues (bearish signal)
     *    - Use signalColor if boolean-only data (shouldn't happen, but failsafe)
     *
     * @param value - The signal value (can be boolean true/false or numeric)
     * @param options - Color configuration options
     * @param hasNonBooleanValues - Whether the dataset contains non-boolean values
     * @returns string - The appropriate color (CSS color string or 'transparent')
     *
     * @example
     * ```typescript
     * const options = {
     *   neutralColor: '#808080',  // Gray
     *   signalColor: '#00FF00',   // Green
     *   alertColor: '#FF0000'     // Red
     * };
     *
     * // Boolean-only dataset (hasNonBooleanValues = false)
     * const color1 = SignalColorCalculator.getColorForValue(0, options, false);
     * // color1 = '#808080' (neutralColor)
     *
     * const color2 = SignalColorCalculator.getColorForValue(1, options, false);
     * // color2 = '#00FF00' (signalColor)
     *
     * // Numeric dataset (hasNonBooleanValues = true)
     * const color3 = SignalColorCalculator.getColorForValue(1, options, true);
     * // color3 = '#00FF00' (signalColor for positive)
     *
     * const color4 = SignalColorCalculator.getColorForValue(-1, options, true);
     * // color4 = '#FF0000' (alertColor for negative)
     *
     * const color5 = SignalColorCalculator.getColorForValue(0, options, true);
     * // color5 = '#808080' (neutralColor for zero)
     *
     * // Handling JavaScript booleans
     * const color6 = SignalColorCalculator.getColorForValue(true as any, options, false);
     * // color6 = '#00FF00' (Number(true) = 1, so signalColor)
     *
     * const color7 = SignalColorCalculator.getColorForValue(false as any, options, false);
     * // color7 = '#808080' (Number(false) = 0, so neutralColor)
     * ```
     *
     * @example
     * ```typescript
     * // Handling missing colors (falls back to 'transparent')
     * const minimalOptions = {};
     * const color = SignalColorCalculator.getColorForValue(1, minimalOptions, false);
     * // color = 'transparent'
     *
     * // Partial options (alertColor missing)
     * const partialOptions = {
     *   neutralColor: 'gray',
     *   signalColor: 'green'
     * };
     * const color2 = SignalColorCalculator.getColorForValue(-1, partialOptions, true);
     * // color2 = 'green' (falls back to signalColor)
     * ```
     *
     * @remarks
     * Fallback Chain:
     * - neutralColor → 'transparent'
     * - signalColor → 'transparent'
     * - alertColor → signalColor → 'transparent'
     *
     * This ensures the function always returns a valid color string even if
     * no colors are provided in the options.
     *
     * Boolean Conversion:
     * JavaScript booleans are automatically converted to numbers:
     * - Number(true) = 1
     * - Number(false) = 0
     * This allows the method to work with both boolean and numeric signal values.
     */
    static getColorForValue(value: number, options: SignalColorOptions, hasNonBooleanValues: boolean): string;
}
//# sourceMappingURL=signalColorUtils.d.ts.map