import { CustomData, Time, CustomSeriesOptions, LineWidth, IChartApi } from 'lightweight-charts';
import { LineStyle } from '../../utils/renderingUtils';
/**
 * Data point for Ribbon series
 *
 * @property time - Timestamp for the data point
 * @property upper - Y value of the upper line
 * @property lower - Y value of the lower line
 */
export interface RibbonData extends CustomData<Time> {
    time: Time;
    upper: number;
    lower: number;
}
/**
 * Configuration options for Ribbon series
 */
export interface RibbonSeriesOptions extends CustomSeriesOptions {
    upperLineColor: string;
    upperLineWidth: LineWidth;
    upperLineStyle: LineStyle;
    upperLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: LineWidth;
    lowerLineStyle: LineStyle;
    lowerLineVisible: boolean;
    fillColor: string;
    fillVisible: boolean;
    lastValueVisible: boolean;
    title: string;
    visible: boolean;
    priceLineVisible: boolean;
    _usePrimitive?: boolean;
}
/**
 * Factory function to create Ribbon series with optional primitive
 *
 * Two rendering modes:
 * 1. **Direct ICustomSeries rendering (default, usePrimitive: false)**
 *    - Series renders lines and fill directly
 *    - Normal z-order with other series
 *    - Best for most use cases
 *
 * 2. **Primitive rendering mode (usePrimitive: true)**
 *    - Series provides autoscaling only (no rendering)
 *    - Primitive handles rendering with custom z-order
 *    - Can render in background (zIndex: -100) or foreground
 *    - Best for background indicators like Bollinger Bands
 *
 * @param chart - Chart instance
 * @param options - Ribbon series options
 * @param options.upperLineColor - Upper line color (default: '#4CAF50')
 * @param options.lowerLineColor - Lower line color (default: '#F44336')
 * @param options.fillColor - Fill color (default: 'rgba(76, 175, 80, 0.1)')
 * @param options.usePrimitive - Enable primitive rendering mode
 * @param options.zIndex - Z-order for primitive mode (default: -100)
 * @param options.data - Initial data
 * @returns ICustomSeries instance
 *
 * @example Standard usage
 * ```typescript
 * const series = createRibbonSeries(chart, {
 *   upperLineColor: '#4CAF50',
 *   lowerLineColor: '#F44336',
 *   fillColor: 'rgba(76, 175, 80, 0.1)',
 * });
 * series.setData(data);
 * ```
 *
 * @example Background rendering with primitive
 * ```typescript
 * const series = createRibbonSeries(chart, {
 *   usePrimitive: true,
 *   zIndex: -100,
 *   data: ribbonData,
 * });
 * ```
 */
export declare function createRibbonSeries(chart: IChartApi, options?: {
    upperLineColor?: string;
    upperLineWidth?: LineWidth;
    upperLineStyle?: LineStyle;
    upperLineVisible?: boolean;
    lowerLineColor?: string;
    lowerLineWidth?: LineWidth;
    lowerLineStyle?: LineStyle;
    lowerLineVisible?: boolean;
    fillColor?: string;
    fillVisible?: boolean;
    priceScaleId?: string;
    lastValueVisible?: boolean;
    title?: string;
    visible?: boolean;
    priceLineVisible?: boolean;
    usePrimitive?: boolean;
    zIndex?: number;
    data?: RibbonData[];
    paneId?: number;
}): any;
//# sourceMappingURL=ribbonSeriesPlugin.d.ts.map