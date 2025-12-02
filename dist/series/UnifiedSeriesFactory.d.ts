import { ISeriesApi, IChartApi, SeriesOptionsCommon, SeriesMarker, Time, SeriesOptionsMap } from 'lightweight-charts';
import { UnifiedSeriesDescriptor } from './core/UnifiedSeriesDescriptor';
import { TradeConfig, TradeVisualizationOptions } from '../types';
import { SeriesDataPoint } from '../types/seriesFactory';
/**
 * Custom error class for series creation failures
 */
export declare class SeriesCreationError extends Error {
    seriesType: string;
    reason: string;
    originalError?: Error | undefined;
    constructor(seriesType: string, reason: string, originalError?: Error | undefined);
}
/**
 * Get series descriptor by type
 */
export declare function getSeriesDescriptor(seriesType: string): UnifiedSeriesDescriptor | undefined;
/**
 * Get all available series types
 */
export declare function getAvailableSeriesTypes(): string[];
/**
 * Check if a series type is custom
 */
export declare function isCustomSeries(seriesType: string): boolean;
/**
 * Create a series using the unified descriptor system
 *
 * @param chart - LightweightCharts chart instance
 * @param seriesType - Type of series to create (e.g., 'Line', 'Band')
 * @param data - Series data
 * @param userOptions - User-provided options (merged with defaults)
 * @returns Created series instance
 * @throws {SeriesCreationError} If series creation fails
 */
export declare function createSeries(chart: IChartApi, seriesType: string, data: unknown[], userOptions?: Partial<SeriesOptionsCommon>, paneId?: number): ISeriesApi<keyof SeriesOptionsMap>;
/**
 * Get default options for a series type
 *
 * @param seriesType - Type of series
 * @returns Default options object
 * @throws {SeriesCreationError} If series type is unknown
 */
export declare function getDefaultOptions(seriesType: string): Partial<SeriesOptionsCommon>;
/**
 * Register a custom series descriptor (for extensibility)
 *
 * @param descriptor - Custom series descriptor
 */
export declare function registerSeriesDescriptor(descriptor: UnifiedSeriesDescriptor): void;
/**
 * Unregister a series descriptor
 *
 * @param seriesType - Type of series to unregister
 */
export declare function unregisterSeriesDescriptor(seriesType: string): boolean;
/**
 * Get series descriptors by category
 *
 * @param category - Category name (e.g., 'Basic', 'Custom')
 * @returns Array of descriptors in that category
 */
export declare function getSeriesDescriptorsByCategory(category: string): UnifiedSeriesDescriptor[];
/**
 * Extended series configuration for full-featured series creation
 * This interface matches the old SeriesConfig for backward compatibility
 * Uses flexible typing for maximum compatibility with existing code
 */
export interface ExtendedSeriesConfig {
    /** Series type (e.g., 'Line', 'Area', 'Band') */
    type: string;
    /** Series data (flexible type for all series data formats) */
    data?: unknown[];
    /** Series options (flexible to accept various options structures) */
    options?: Record<string, unknown> | SeriesOptionsCommon;
    /** Pane ID for multi-pane charts */
    paneId?: number;
    /** Price scale configuration */
    priceScale?: Record<string, unknown>;
    /** Price scale ID for series attachment */
    priceScaleId?: string;
    /** Price lines to add */
    priceLines?: Array<Record<string, unknown>>;
    /** Markers to add */
    markers?: SeriesMarker<Time>[];
    /** Legend configuration */
    legend?: Record<string, unknown> | null;
    /** Series ID for identification */
    seriesId?: string;
    /** Chart ID for global identification */
    chartId?: string;
    /** Series title (technical name for chart axis/legend) */
    title?: string;
    /** Display name (user-friendly name for UI elements like dialog tabs) */
    displayName?: string;
    /** Series visibility */
    visible?: boolean;
    /** Z-index for rendering order */
    zIndex?: number;
    /** Show last value on price scale */
    lastValueVisible?: boolean;
    /** Show price line */
    priceLineVisible?: boolean;
    /** Price line source (0 = lastBar, 1 = lastVisible, or string 'lastBar'/'lastVisible') */
    priceLineSource?: number | 'lastBar' | 'lastVisible';
    /** Price line width */
    priceLineWidth?: number;
    /** Price line color */
    priceLineColor?: string;
    /** Price line style */
    priceLineStyle?: number;
    /** Trade configurations for visualization */
    trades?: TradeConfig[];
    /** Trade visualization options */
    tradeVisualizationOptions?: TradeVisualizationOptions;
    /** Allow additional properties from SeriesConfig */
    [key: string]: unknown;
}
/**
 * Extended series API with metadata
 */
export interface ExtendedSeriesApi extends ISeriesApi<keyof SeriesOptionsMap> {
    paneId?: number;
    seriesId?: string;
    legendConfig?: Record<string, unknown>;
    /** Display name (user-friendly name for UI elements like dialog tabs) */
    displayName?: string;
    /** Series title (technical name for chart axis/legend) */
    title?: string;
}
/**
 * Create series with full configuration (data, markers, price lines, etc.)
 * This is the enhanced API that handles all auxiliary functionality
 *
 * @param chart - LightweightCharts chart instance
 * @param config - Extended series configuration
 * @returns Created series instance with metadata
 * @throws {SeriesCreationError} If series creation fails
 */
export declare function createSeriesWithConfig(chart: IChartApi, config: ExtendedSeriesConfig): ExtendedSeriesApi | null;
/**
 * Update series data
 *
 * @param series - Series instance
 * @param data - New data to set
 */
export declare function updateSeriesData(series: ISeriesApi<keyof SeriesOptionsMap>, data: SeriesDataPoint[]): void;
/**
 * Update series markers
 *
 * @param series - Series instance
 * @param markers - New markers to set
 * @param data - Optional data for timestamp snapping
 */
export declare function updateSeriesMarkers(series: ISeriesApi<keyof SeriesOptionsMap>, markers: SeriesMarker<Time>[], data?: SeriesDataPoint[]): void;
/**
 * Update series options
 *
 * @param series - Series instance
 * @param options - New options to apply
 */
export declare function updateSeriesOptions(series: ISeriesApi<keyof SeriesOptionsMap>, options: Partial<SeriesOptionsCommon>): void;
/**
 * Legacy compatibility layer for existing code
 * This allows gradual migration from old factory to new factory
 */
export declare const SeriesFactory: {
    createSeries: typeof createSeries;
    createSeriesWithConfig: typeof createSeriesWithConfig;
    getSeriesDescriptor: typeof getSeriesDescriptor;
    getDefaultOptions: typeof getDefaultOptions;
    isCustomSeries: typeof isCustomSeries;
    getAvailableSeriesTypes: typeof getAvailableSeriesTypes;
    updateSeriesData: typeof updateSeriesData;
    updateSeriesMarkers: typeof updateSeriesMarkers;
    updateSeriesOptions: typeof updateSeriesOptions;
};
export default SeriesFactory;
//# sourceMappingURL=UnifiedSeriesFactory.d.ts.map