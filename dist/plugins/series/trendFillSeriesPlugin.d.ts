import { CustomData, Time, CustomSeriesOptions, LineWidth } from 'lightweight-charts';
import { LineStyle } from '../../utils/renderingUtils';
/**
 * Data point for TrendFill series
 *
 * @property time - Timestamp for the data point
 * @property baseLine - Y value of the base/reference line
 * @property trendLine - Y value of the trend line
 * @property trendDirection - Trend direction: -1 (downtrend), 0 (neutral), 1 (uptrend)
 */
export interface TrendFillData extends CustomData<Time> {
    time: Time;
    baseLine: number;
    trendLine: number;
    trendDirection: number;
}
/**
 * Configuration options for TrendFill series
 *
 * Fill Colors:
 * @property uptrendFillColor - Fill color for uptrend areas (supports rgba)
 * @property downtrendFillColor - Fill color for downtrend areas (supports rgba)
 * @property fillVisible - Toggle fill visibility
 *
 * Uptrend Line:
 * @property uptrendLineColor - Color of the uptrend line
 * @property uptrendLineWidth - Width of the uptrend line in pixels
 * @property uptrendLineStyle - Line style for uptrend (Solid, Dotted, Dashed, etc.)
 * @property uptrendLineVisible - Toggle uptrend line visibility
 *
 * Downtrend Line:
 * @property downtrendLineColor - Color of the downtrend line
 * @property downtrendLineWidth - Width of the downtrend line in pixels
 * @property downtrendLineStyle - Line style for downtrend (Solid, Dotted, Dashed, etc.)
 * @property downtrendLineVisible - Toggle downtrend line visibility
 *
 * Base Line:
 * @property baseLineColor - Color of the base/reference line
 * @property baseLineWidth - Width of the base line in pixels
 * @property baseLineStyle - Line style (Solid, Dotted, Dashed, etc.)
 * @property baseLineVisible - Toggle base line visibility
 */
export interface TrendFillSeriesOptions extends CustomSeriesOptions {
    uptrendFillColor: string;
    downtrendFillColor: string;
    fillVisible: boolean;
    uptrendLineColor: string;
    uptrendLineWidth: LineWidth;
    uptrendLineStyle: LineStyle;
    uptrendLineVisible: boolean;
    downtrendLineColor: string;
    downtrendLineWidth: LineWidth;
    downtrendLineStyle: LineStyle;
    downtrendLineVisible: boolean;
    baseLineColor: string;
    baseLineWidth: LineWidth;
    baseLineStyle: LineStyle;
    baseLineVisible: boolean;
    lastValueVisible: boolean;
    _usePrimitive?: boolean;
}
/**
 * Factory function to create TrendFill series instance
 *
 * This is the main entry point for creating a TrendFill custom series.
 * Called from seriesFactory to create the series with all options.
 *
 * Two rendering modes:
 * 1. **Direct ICustomSeries rendering (default)**
 *    - Series renders its own visuals
 *    - Renders on top of other series (normal z-order)
 *    - Best for most use cases
 *    - Price axis label managed by series
 *
 * 2. **Primitive rendering mode (usePrimitive: true)**
 *    - Series provides autoscaling only
 *    - Primitive attached to series handles rendering
 *    - Renders behind other series (negative z-index)
 *    - Price axis label managed by primitive
 *    - Series' lastValueVisible set to false (primitive handles it)
 *    - Best when you need background fills behind other indicators
 *
 * Default values:
 * - uptrendFillColor: 'rgba(76, 175, 80, 0.3)' (green)
 * - downtrendFillColor: 'rgba(244, 67, 54, 0.3)' (red)
 * - trendLineStyle: LineStyle.Solid
 * - baseLineStyle: LineStyle.Dotted
 * - zIndex: -100 (when using primitive)
 * - useHalfBarWidth: false (full bar width fills)
 *
 * Line style support:
 * - ICustomSeries: All LineStyle values (Solid, Dotted, Dashed, LargeDashed, SparseDotted)
 * - Primitive: Limited to Solid (0), Dotted (1), Dashed (2) - others clamped to Dashed
 *
 * @example Standard usage (via seriesFactory):
 * ```typescript
 * // In seriesFactory.ts
 * const series = createTrendFillSeries(chart, {
 *   uptrendFillColor: 'rgba(76, 175, 80, 0.3)',
 *   downtrendFillColor: 'rgba(244, 67, 54, 0.3)',
 * });
 * series.setData(data);
 * ```
 *
 * @example With primitive for background rendering:
 * ```typescript
 * const series = createTrendFillSeries(chart, {
 *   uptrendFillColor: 'rgba(76, 175, 80, 0.3)',
 *   downtrendFillColor: 'rgba(244, 67, 54, 0.3)',
 *   // Primitive-specific options
 *   usePrimitive: true,
 *   zIndex: -100, // Render behind series
 *   useHalfBarWidth: false, // Full width fills
 * });
 * series.setData(data); // Sets data on series for autoscaling
 * // Primitive automatically syncs data from series
 * ```
 *
 * @param chart - Chart instance from Lightweight Charts
 * @param options - Combined series and primitive options
 * @param options.uptrendFillColor - Fill color for uptrend areas (default: green rgba)
 * @param options.downtrendFillColor - Fill color for downtrend areas (default: red rgba)
 * @param options.fillVisible - Show/hide fills (default: true)
 * @param options.trendLineColor - Trend line color (default: blue)
 * @param options.trendLineWidth - Trend line width 1-4 (default: 2)
 * @param options.trendLineStyle - Line style (default: Solid)
 * @param options.trendLineVisible - Show/hide trend line (default: true)
 * @param options.baseLineColor - Base line color (default: gray)
 * @param options.baseLineWidth - Base line width 1-4 (default: 1)
 * @param options.baseLineStyle - Line style (default: Dotted)
 * @param options.baseLineVisible - Show/hide base line (default: false)
 * @param options.priceScaleId - Price scale ID (default: 'right')
 * @param options.usePrimitive - Enable primitive rendering mode (default: false)
 * @param options.zIndex - Z-order for primitive mode (default: -100)
 * @param options.useHalfBarWidth - Half bar width fills in primitive mode (default: false)
 * @param options.data - Initial data array (optional)
 * @returns ICustomSeries instance (with optional primitive attached)
 */
export declare function createTrendFillSeries(chart: any, options?: {
    uptrendFillColor?: string;
    downtrendFillColor?: string;
    fillVisible?: boolean;
    uptrendLineColor?: string;
    uptrendLineWidth?: LineWidth;
    uptrendLineStyle?: LineStyle;
    uptrendLineVisible?: boolean;
    downtrendLineColor?: string;
    downtrendLineWidth?: LineWidth;
    downtrendLineStyle?: LineStyle;
    downtrendLineVisible?: boolean;
    baseLineColor?: string;
    baseLineWidth?: LineWidth;
    baseLineStyle?: LineStyle;
    baseLineVisible?: boolean;
    priceScaleId?: string;
    lastValueVisible?: boolean;
    priceLineVisible?: boolean;
    visible?: boolean;
    title?: string;
    usePrimitive?: boolean;
    zIndex?: number;
    useHalfBarWidth?: boolean;
    data?: any[];
}): any;
//# sourceMappingURL=trendFillSeriesPlugin.d.ts.map