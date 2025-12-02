import { IChartApi, UTCTimestamp, PrimitivePaneViewZOrder, ISeriesPrimitiveAxisView, ISeriesApi, SeriesType } from 'lightweight-charts';
import { BaseSeriesPrimitive, BaseSeriesPrimitiveOptions } from './BaseSeriesPrimitive';
/**
 * Data structure for trend fill primitive
 * Supports both snake_case (Python) and camelCase (JavaScript) field names
 */
export interface TrendFillPrimitiveData {
    time: number | string;
    base_line?: number | null;
    trend_line?: number | null;
    trend_direction?: number | null;
    baseLine?: number | null;
    trendLine?: number | null;
    trendDirection?: number | null;
}
/**
 * Options for trend fill primitive
 *
 * @property zIndex - Z-order for rendering (default: -100, negative values render behind series)
 * @property uptrendFillColor - Fill color for uptrend areas (supports rgba with transparency)
 * @property downtrendFillColor - Fill color for downtrend areas (supports rgba with transparency)
 * @property fillVisible - Toggle fill visibility
 *
 * @property uptrendLineColor - Line color for uptrends
 * @property uptrendLineWidth - Line width (1-4 pixels)
 * @property uptrendLineStyle - Line style: 0=Solid, 1=Dotted, 2=Dashed (LargeDashed and SparseDotted not supported)
 * @property uptrendLineVisible - Show/hide uptrend line
 *
 * @property downtrendLineColor - Line color for downtrends
 * @property downtrendLineWidth - Line width (1-4 pixels)
 * @property downtrendLineStyle - Line style: 0=Solid, 1=Dotted, 2=Dashed (LargeDashed and SparseDotted not supported)
 * @property downtrendLineVisible - Show/hide downtrend line
 *
 * @property baseLineColor - Base line color
 * @property baseLineWidth - Base line width (1-4 pixels)
 * @property baseLineStyle - Base line style: 0=Solid, 1=Dotted, 2=Dashed
 * @property baseLineVisible - Show/hide base line
 * @property visible - Master visibility toggle for entire primitive
 * @property priceScaleId - Price scale ID ('left', 'right', or custom)
 * @property useHalfBarWidth - When true, fills extend half bar width on each side (default: false = full bar width)
 */
export interface TrendFillPrimitiveOptions extends BaseSeriesPrimitiveOptions {
    uptrendFillColor: string;
    downtrendFillColor: string;
    fillVisible: boolean;
    uptrendLineColor: string;
    uptrendLineWidth: 1 | 2 | 3 | 4;
    uptrendLineStyle: 0 | 1 | 2;
    uptrendLineVisible: boolean;
    downtrendLineColor: string;
    downtrendLineWidth: 1 | 2 | 3 | 4;
    downtrendLineStyle: 0 | 1 | 2;
    downtrendLineVisible: boolean;
    baseLineColor: string;
    baseLineWidth: 1 | 2 | 3 | 4;
    baseLineStyle: 0 | 1 | 2;
    baseLineVisible: boolean;
    useHalfBarWidth?: boolean;
}
/**
 * Internal processed data structure
 */
interface TrendFillItem {
    time: UTCTimestamp;
    baseLine: number;
    trendLine: number;
    trendDirection: number;
    fillColor: string;
    lineColor: string;
    lineWidth: number;
    lineStyle: number;
}
/**
 * Trend Fill Primitive
 * ISeriesPrimitive implementation with z-order control and price axis label
 */
export declare class TrendFillPrimitive extends BaseSeriesPrimitive<TrendFillItem, TrendFillPrimitiveOptions> {
    private trendFillItems;
    /** Raw input data before processing */
    private _rawData;
    constructor(chart: IChartApi, options?: TrendFillPrimitiveOptions);
    protected _initializeViews(): void;
    protected _processData(_rawData: TrendFillPrimitiveData[]): TrendFillItem[];
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
    setData(data: TrendFillPrimitiveData[]): void;
    private processData;
    applyOptions(options: Partial<TrendFillPrimitiveOptions>): void;
    destroy(): void;
    getOptions(): TrendFillPrimitiveOptions;
    getChart(): IChartApi;
    getProcessedData(): TrendFillItem[];
    getAttachedSeries(): ISeriesApi<SeriesType> | null;
    updateAllViews(): void;
    timeAxisViews(): ISeriesPrimitiveAxisView[];
}
export {};
//# sourceMappingURL=TrendFillPrimitive.d.ts.map