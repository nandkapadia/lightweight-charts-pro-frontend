import { CustomData, Time, CustomSeriesOptions, LineWidth, IChartApi } from 'lightweight-charts';
import { LineStyle } from '../../utils/renderingUtils';
/**
 * Data point for Band series
 *
 * @property time - Timestamp for the data point
 * @property upper - Y value of the upper line
 * @property middle - Y value of the middle line
 * @property lower - Y value of the lower line
 */
export interface BandData extends CustomData<Time> {
    time: Time;
    upper: number;
    middle: number;
    lower: number;
}
/**
 * Configuration options for Band series
 */
export interface BandSeriesOptions extends CustomSeriesOptions {
    upperLineColor: string;
    upperLineWidth: LineWidth;
    upperLineStyle: LineStyle;
    upperLineVisible: boolean;
    middleLineColor: string;
    middleLineWidth: LineWidth;
    middleLineStyle: LineStyle;
    middleLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: LineWidth;
    lowerLineStyle: LineStyle;
    lowerLineVisible: boolean;
    upperFillColor: string;
    upperFill: boolean;
    lowerFillColor: string;
    lowerFill: boolean;
    lastValueVisible: boolean;
    title: string;
    visible: boolean;
    priceLineVisible: boolean;
    _usePrimitive?: boolean;
}
/**
 * Factory function to create Band series with optional primitive
 *
 * Two rendering modes:
 * 1. **Direct ICustomSeries rendering (default, usePrimitive: false)**
 *    - Series renders lines and fills directly
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
 * @param options - Band series options
 * @param options.upperLineColor - Upper line color (default: '#4CAF50')
 * @param options.middleLineColor - Middle line color (default: '#2196F3')
 * @param options.lowerLineColor - Lower line color (default: '#F44336')
 * @param options.upperFillColor - Upper fill color (default: 'rgba(76, 175, 80, 0.1)')
 * @param options.lowerFillColor - Lower fill color (default: 'rgba(244, 67, 54, 0.1)')
 * @param options.usePrimitive - Enable primitive rendering mode
 * @param options.zIndex - Z-order for primitive mode (default: -100)
 * @param options.data - Initial data
 * @returns ICustomSeries instance
 *
 * @example Standard usage
 * ```typescript
 * const series = createBandSeries(chart, {
 *   upperLineColor: '#4CAF50',
 *   middleLineColor: '#2196F3',
 *   lowerLineColor: '#F44336',
 * });
 * series.setData(data);
 * ```
 *
 * @example Background rendering with primitive
 * ```typescript
 * const series = createBandSeries(chart, {
 *   usePrimitive: true,
 *   zIndex: -100,
 *   data: bandData,
 * });
 * ```
 */
export declare function createBandSeries(chart: IChartApi, options?: {
    upperLineColor?: string;
    upperLineWidth?: LineWidth;
    upperLineStyle?: LineStyle;
    upperLineVisible?: boolean;
    middleLineColor?: string;
    middleLineWidth?: LineWidth;
    middleLineStyle?: LineStyle;
    middleLineVisible?: boolean;
    lowerLineColor?: string;
    lowerLineWidth?: LineWidth;
    lowerLineStyle?: LineStyle;
    lowerLineVisible?: boolean;
    upperFillColor?: string;
    upperFill?: boolean;
    lowerFillColor?: string;
    lowerFill?: boolean;
    priceScaleId?: string;
    lastValueVisible?: boolean;
    title?: string;
    visible?: boolean;
    priceLineVisible?: boolean;
    paneId?: number;
    usePrimitive?: boolean;
    zIndex?: number;
    data?: BandData[];
}): any;
//# sourceMappingURL=bandSeriesPlugin.d.ts.map