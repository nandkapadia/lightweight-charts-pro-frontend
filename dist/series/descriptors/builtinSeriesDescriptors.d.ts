import { LineSeriesOptions, AreaSeriesOptions, HistogramSeriesOptions, BarSeriesOptions, CandlestickSeriesOptions, BaselineSeriesOptions } from 'lightweight-charts';
import { UnifiedSeriesDescriptor } from '../core/UnifiedSeriesDescriptor';
/**
 * Line Series Descriptor
 */
export declare const LINE_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<LineSeriesOptions>;
/**
 * Area Series Descriptor
 */
export declare const AREA_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<AreaSeriesOptions>;
/**
 * Histogram Series Descriptor
 */
export declare const HISTOGRAM_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<HistogramSeriesOptions>;
/**
 * Bar Series Descriptor
 */
export declare const BAR_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<BarSeriesOptions>;
/**
 * Candlestick Series Descriptor
 */
export declare const CANDLESTICK_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<CandlestickSeriesOptions>;
/**
 * Baseline Series Descriptor
 */
export declare const BASELINE_SERIES_DESCRIPTOR: UnifiedSeriesDescriptor<BaselineSeriesOptions>;
/**
 * Registry of all built-in series descriptors
 */
export declare const BUILTIN_SERIES_DESCRIPTORS: {
    readonly Line: UnifiedSeriesDescriptor<LineSeriesOptions>;
    readonly Area: UnifiedSeriesDescriptor<AreaSeriesOptions>;
    readonly Histogram: UnifiedSeriesDescriptor<HistogramSeriesOptions>;
    readonly Bar: UnifiedSeriesDescriptor<BarSeriesOptions>;
    readonly Candlestick: UnifiedSeriesDescriptor<CandlestickSeriesOptions>;
    readonly Baseline: UnifiedSeriesDescriptor<BaselineSeriesOptions>;
};
//# sourceMappingURL=builtinSeriesDescriptors.d.ts.map