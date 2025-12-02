import { CustomData, Time, CustomSeriesOptions, LineWidth, IChartApi } from 'lightweight-charts';
import { LineStyle } from '../../utils/renderingUtils';
/**
 * Data point for Gradient Ribbon series
 *
 * @property time - Timestamp for the data point
 * @property upper - Y value of the upper line
 * @property lower - Y value of the lower line
 * @property fill - Optional override color for this point's fill (matches Python property name)
 */
export interface GradientRibbonData extends CustomData<Time> {
    time: Time;
    upper: number;
    lower: number;
    fill?: string;
    gradient?: number;
}
/**
 * Configuration options for Gradient Ribbon series
 */
export interface GradientRibbonSeriesOptions extends CustomSeriesOptions {
    upperLineColor: string;
    upperLineWidth: LineWidth;
    upperLineStyle: LineStyle;
    upperLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: LineWidth;
    lowerLineStyle: LineStyle;
    lowerLineVisible: boolean;
    fillVisible: boolean;
    gradientStartColor: string;
    gradientEndColor: string;
    normalizeGradients: boolean;
    lastValueVisible: boolean;
    title: string;
    visible: boolean;
    priceLineVisible: boolean;
    _usePrimitive?: boolean;
}
/**
 * Factory function to create Gradient Ribbon series with optional primitive
 *
 * Two rendering modes:
 * 1. **Direct ICustomSeries rendering (default, usePrimitive: false)**
 *    - Series renders lines and gradient fill directly
 *    - Normal z-order with other series
 *    - Best for most use cases
 *
 * 2. **Primitive rendering mode (usePrimitive: true)**
 *    - Series provides autoscaling only (no rendering)
 *    - Primitive handles rendering with custom z-order
 *    - Can render in background (zIndex: -100) or foreground
 *    - Best for background indicators
 *
 * @param chart - Chart instance
 * @param options - Gradient Ribbon series options
 * @param options.upperLineColor - Upper line color (default: '#4CAF50')
 * @param options.lowerLineColor - Lower line color (default: '#F44336')
 * @param options.gradientStartColor - Gradient start color (default: '#4CAF50')
 * @param options.gradientEndColor - Gradient end color (default: '#F44336')
 * @param options.normalizeGradients - Normalize gradient by spread (default: true)
 * @param options.usePrimitive - Enable primitive rendering mode
 * @param options.zIndex - Z-order for primitive mode (default: -100)
 * @param options.data - Initial data
 * @returns ICustomSeries instance
 *
 * @example Standard usage
 * ```typescript
 * const series = createGradientRibbonSeries(chart, {
 *   gradientStartColor: '#4CAF50',
 *   gradientEndColor: '#F44336',
 *   normalizeGradients: true,
 * });
 * series.setData(data);
 * ```
 *
 * @example Background rendering with primitive
 * ```typescript
 * const series = createGradientRibbonSeries(chart, {
 *   usePrimitive: true,
 *   zIndex: -100,
 *   data: gradientRibbonData,
 * });
 * ```
 */
export declare function createGradientRibbonSeries(chart: IChartApi, options?: {
    upperLineColor?: string;
    upperLineWidth?: LineWidth;
    upperLineStyle?: LineStyle;
    upperLineVisible?: boolean;
    lowerLineColor?: string;
    lowerLineWidth?: LineWidth;
    lowerLineStyle?: LineStyle;
    lowerLineVisible?: boolean;
    fillVisible?: boolean;
    gradientStartColor?: string;
    gradientEndColor?: string;
    normalizeGradients?: boolean;
    priceScaleId?: string;
    lastValueVisible?: boolean;
    title?: string;
    visible?: boolean;
    priceLineVisible?: boolean;
    usePrimitive?: boolean;
    zIndex?: number;
    data?: GradientRibbonData[];
    paneId?: number;
}): any;
//# sourceMappingURL=gradientRibbonSeriesPlugin.d.ts.map