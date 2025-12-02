import { IChartApi, ISeriesPrimitive, SeriesAttachedParameter, IPrimitivePaneView, ISeriesPrimitiveAxisView, ISeriesApi, Time, PrimitivePaneViewZOrder } from 'lightweight-charts';
/**
 * Base interface for series primitive options
 */
export interface BaseSeriesPrimitiveOptions {
    zIndex?: number;
    visible?: boolean;
    priceScaleId?: string;
}
/**
 * Base interface for processed data
 */
export interface BaseProcessedData {
    time: Time;
}
/**
 * Base interface for series primitive source
 */
export interface BaseSeriesPrimitiveSource<TData extends BaseProcessedData> {
    getChart(): IChartApi;
    getAttachedSeries(): ISeriesApi<any> | null;
    getOptions(): BaseSeriesPrimitiveOptions;
    getProcessedData(): TData[];
}
/**
 * Abstract base class for all series primitives
 *
 * Provides common functionality to eliminate DRY violations:
 * - Standardized lifecycle management
 * - Consistent data synchronization
 * - Unified z-order handling
 * - Common view management patterns
 */
export declare abstract class BaseSeriesPrimitive<TData extends BaseProcessedData, TOptions extends BaseSeriesPrimitiveOptions> implements ISeriesPrimitive<Time>, BaseSeriesPrimitiveSource<TData> {
    protected _chart: IChartApi;
    protected _series: ISeriesApi<any> | null;
    protected _options: TOptions;
    protected _data: TData[];
    protected _paneViews: IPrimitivePaneView[];
    protected _priceAxisViews: ISeriesPrimitiveAxisView[];
    constructor(chart: IChartApi, options: TOptions);
    /**
     * Initialize views for this primitive
     * Subclasses must implement this to create their specific views
     */
    protected abstract _initializeViews(): void;
    /**
     * Process raw data into processed data format
     * Subclasses must implement this to handle their specific data format
     */
    protected abstract _processData(rawData: any[]): TData[];
    /**
     * Get the default z-order for this primitive
     * Subclasses can override to provide custom defaults
     */
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
    /**
     * Called when primitive is attached to a series
     * Standardized implementation - subclasses can override for custom behavior
     */
    attached(params: SeriesAttachedParameter<Time>): void;
    /**
     * Called when primitive is detached from a series
     * Standardized implementation - subclasses can override for custom behavior
     */
    detached(): void;
    /**
     * Get pane views for this primitive
     * Standardized implementation
     */
    paneViews(): IPrimitivePaneView[];
    /**
     * Get price axis views for this primitive
     * Standardized implementation
     */
    priceAxisViews(): ISeriesPrimitiveAxisView[];
    /**
     * Update all views
     * Standardized implementation - subclasses can override for custom behavior
     */
    updateAllViews(): void;
    /**
     * Get chart instance
     */
    getChart(): IChartApi;
    /**
     * Get attached series instance
     */
    getAttachedSeries(): ISeriesApi<any> | null;
    /**
     * Get options
     */
    getOptions(): TOptions;
    /**
     * Get processed data
     */
    getProcessedData(): TData[];
    /**
     * Apply new options
     * Standardized implementation with data reprocessing
     */
    applyOptions(options: Partial<TOptions>): void;
    /**
     * Set data directly (for testing or manual data management)
     */
    setData(rawData: any[]): void;
    /**
     * Destroy the primitive (cleanup)
     * Standardized implementation - subclasses can override for custom cleanup
     */
    destroy(): void;
    /**
     * Sync data from attached series
     * Standardized implementation
     */
    protected _syncDataFromSeries(): void;
    /**
     * Add a pane view to this primitive
     * Helper method for subclasses
     */
    protected _addPaneView(view: IPrimitivePaneView): void;
    /**
     * Add a price axis view to this primitive
     * Helper method for subclasses
     */
    protected _addPriceAxisView(view: ISeriesPrimitiveAxisView): void;
    /**
     * Get z-order based on options
     * Standardized implementation with consistent mapping
     */
    protected _getZOrder(): PrimitivePaneViewZOrder;
}
/**
 * Base class for series primitive pane views
 * Eliminates DRY violations in view implementations
 */
export declare abstract class BaseSeriesPrimitivePaneView<TData extends BaseProcessedData, TOptions extends BaseSeriesPrimitiveOptions> implements IPrimitivePaneView {
    protected _source: BaseSeriesPrimitive<TData, TOptions>;
    constructor(source: BaseSeriesPrimitive<TData, TOptions>);
    /**
     * Get renderer for this view
     * Subclasses must implement this
     */
    abstract renderer(): any;
    /**
     * Get z-order for this view
     * Standardized implementation using source's z-order
     */
    zOrder(): PrimitivePaneViewZOrder;
    /**
     * Update this view
     * Standardized implementation - subclasses can override for custom behavior
     */
    update(): void;
}
/**
 * Base class for series primitive axis views
 * Eliminates DRY violations in axis view implementations
 */
export declare abstract class BaseSeriesPrimitiveAxisView<TData extends BaseProcessedData, TOptions extends BaseSeriesPrimitiveOptions> implements ISeriesPrimitiveAxisView {
    protected _source: BaseSeriesPrimitive<TData, TOptions>;
    constructor(source: BaseSeriesPrimitive<TData, TOptions>);
    /**
     * Get coordinate for this axis view
     * Subclasses must implement this
     */
    abstract coordinate(): number;
    /**
     * Get text for this axis view
     * Subclasses must implement this
     */
    abstract text(): string;
    /**
     * Get text color for this axis view
     * Standardized implementation - subclasses can override
     */
    textColor(): string;
    /**
     * Get background color for this axis view
     * Subclasses must implement this
     */
    abstract backColor(): string;
    /**
     * Check if this axis view is visible
     * Standardized implementation - subclasses can override
     * Checks lastValueVisible since axis view shows the last value label
     */
    visible(): boolean;
    /**
     * Check if tick is visible
     * Standardized implementation - subclasses can override
     */
    tickVisible(): boolean;
    /**
     * Get the last visible item using time-based range detection
     * Standardized implementation following TradingView best practices
     */
    protected _getLastVisibleItem(): TData | null;
}
/**
 * Factory function for creating primitive axis view classes with identical structure.
 *
 * This factory eliminates code duplication across primitive axis views (Band, Ribbon, GradientRibbon)
 * by generating axis view classes with consistent implementation patterns.
 *
 * Before this factory, each primitive had 2-3 axis view classes with ~25 lines each (175 lines total).
 * Now we generate these classes dynamically, reducing code by ~150 lines.
 *
 * @template TData - The processed data type for the primitive
 * @template TOptions - The options type for the primitive
 *
 * @param field - The field name to access in the data (e.g., 'upper', 'middle', 'lower')
 * @param colorField - The color field name in options (e.g., 'upperLineColor', 'middleLineColor')
 *
 * @returns A class extending BaseSeriesPrimitiveAxisView with the specified field and color mappings
 *
 * @example
 * ```typescript
 * // Before: 75 lines of duplicate code for 3 axis views
 * class BandUpperAxisView extends BaseSeriesPrimitiveAxisView<BandProcessedData, BandPrimitiveOptions> {
 *   coordinate(): number {
 *     const lastItem = this._getLastVisibleItem();
 *     if (!lastItem) return 0;
 *     const series = this._source.getAttachedSeries();
 *     if (!series) return 0;
 *     const coordinate = series.priceToCoordinate(lastItem.upper);
 *     return coordinate ?? 0;
 *   }
 *   text(): string {
 *     const lastItem = this._getLastVisibleItem();
 *     if (!lastItem) return '';
 *     return lastItem.upper.toFixed(2);
 *   }
 *   backColor(): string {
 *     const options = this._source.getOptions();
 *     return getSolidColorFromFill(options.upperLineColor);
 *   }
 * }
 * // ... repeat for middle and lower (50 more lines)
 *
 * // After: 3 lines using factory
 * const BandUpperAxisView = createPrimitiveAxisView<BandProcessedData, BandPrimitiveOptions>('upper', 'upperLineColor');
 * const BandMiddleAxisView = createPrimitiveAxisView<BandProcessedData, BandPrimitiveOptions>('middle', 'middleLineColor');
 * const BandLowerAxisView = createPrimitiveAxisView<BandProcessedData, BandPrimitiveOptions>('lower', 'lowerLineColor');
 * ```
 */
export declare function createPrimitiveAxisView<TData extends BaseProcessedData, TOptions extends BaseSeriesPrimitiveOptions>(field: string, colorField: string): new (source: BaseSeriesPrimitive<TData, TOptions>) => BaseSeriesPrimitiveAxisView<TData, TOptions>;
//# sourceMappingURL=BaseSeriesPrimitive.d.ts.map