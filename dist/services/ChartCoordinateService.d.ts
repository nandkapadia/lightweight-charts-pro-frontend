import { IChartApi, ISeriesApi, Time, PriceToCoordinateConverter } from 'lightweight-charts';
import { ChartCoordinates, PaneCoordinates, LegendCoordinates, ElementPosition, CoordinateOptions, BoundingBox, Margins } from '../types/coordinates';
import { PaneBounds, ChartLayoutDimensions, WidgetPosition, LayoutWidget } from '../types';
/**
 * Configuration for chart dimensions validation
 */
export interface ChartDimensionsOptions {
    minWidth?: number;
    minHeight?: number;
    maxAttempts?: number;
    baseDelay?: number;
}
/**
 * Configuration for pane dimensions options
 */
export interface PaneDimensionsOptions {
    includeMargins?: boolean;
    includeScales?: boolean;
    validateDimensions?: boolean;
}
/**
 * Configuration for positioning calculations (from PositioningEngine)
 */
export interface PositioningConfig {
    margins?: Partial<Margins>;
    dimensions?: {
        width?: number;
        height?: number;
    };
    zIndex?: number;
    alignment?: 'start' | 'center' | 'end';
    offset?: {
        x?: number;
        y?: number;
    };
}
/**
 * Tooltip positioning configuration (from PositioningEngine)
 */
export interface TooltipPosition {
    x: number;
    y: number;
    anchor: 'top' | 'bottom' | 'left' | 'right';
    offset: {
        x: number;
        y: number;
    };
}
/**
 * Configuration for series data coordinate conversion
 */
export interface SeriesDataConversionConfig {
    /** Keys to extract from data for conversion */
    valueKeys: string[];
    /** Whether to validate numeric values */
    validateNumbers?: boolean;
    /** Whether to check for finite values */
    checkFinite?: boolean;
    /** Custom validation function */
    customValidator?: (data: any) => boolean;
}
/**
 * Result of series data coordinate conversion
 */
export interface SeriesDataConversionResult {
    x: number | null;
    [key: string]: number | null;
}
/**
 * ChartCoordinateService - Centralized coordinate and positioning system
 *
 * Manages all coordinate conversions, dimension calculations, and positioning
 * logic for chart features. Uses caching and validation to ensure accuracy
 * and performance across pan, zoom, and resize operations.
 *
 * Architecture:
 * - Singleton pattern with global instance
 * - Per-chart registration and tracking
 * - Multi-layer caching (coordinates, dimensions)
 * - Automatic cache invalidation and cleanup
 * - Integration with chart lifecycle
 *
 * Core Responsibilities:
 * - Time/price to screen coordinate conversion
 * - Screen to time/price coordinate conversion
 * - Pane dimension calculations
 * - Legend positioning (corners, relative)
 * - Tooltip smart positioning
 * - Overlay bounding box calculations
 * - Margin and spacing management
 *
 * Caching Strategy:
 * - Coordinates cached with staleness detection
 * - Dimensions cached with expiration
 * - Automatic cleanup every 60 seconds
 * - Manual invalidation on chart changes
 *
 * @export
 * @class ChartCoordinateService
 *
 * @example
 * ```typescript
 * const service = ChartCoordinateService.getInstance();
 *
 * // Register chart
 * service.registerChart('my-chart', chartApi);
 *
 * // Get coordinates
 * const coords = await service.getCoordinates(chartApi, container);
 *
 * // Convert data to screen
 * const screenX = service.convertDataToScreen(
 *   'my-chart', timestamp, price, seriesApi
 * );
 *
 * // Calculate tooltip position
 * const pos = service.calculateTooltipPosition(
 *   mouseX, mouseY, 200, 100, container, 'top'
 * );
 * ```
 */
export declare class ChartCoordinateService {
    /** Singleton instance */
    private static instance;
    /** Cache for coordinate calculations (per chart/container) */
    private coordinateCache;
    /** Cache for pane dimensions (per chart) */
    private paneDimensionsCache;
    /** Registry of chart instances by ID */
    private chartRegistry;
    /** Update callbacks for chart changes */
    private updateCallbacks;
    /** Cache cleanup interval ID for proper cleanup */
    private cacheCleanupIntervalId;
    /**
     * Get singleton instance (lazy initialization)
     *
     * @static
     * @returns {ChartCoordinateService} The singleton instance
     */
    static getInstance(): ChartCoordinateService;
    /**
     * Private constructor (Singleton pattern)
     *
     * Initializes the service and starts cache cleanup timer.
     *
     * @private
     */
    private constructor();
    /**
     * Register a chart for coordinate tracking
     */
    registerChart(chartId: string, chart: IChartApi): void;
    /**
     * Unregister a chart
     */
    unregisterChart(chartId: string): void;
    /**
     * Get coordinates for a chart with caching and validation
     */
    getCoordinates(chart: IChartApi, container: HTMLElement, options?: CoordinateOptions): Promise<ChartCoordinates>;
    /**
     * Get full pane bounds including price scale areas (for collapse buttons)
     */
    getFullPaneBounds(chart: IChartApi, paneId: number): PaneBounds | null;
    /**
     * Get coordinates for a specific pane
     */
    getPaneCoordinates(chart: IChartApi, paneId: number): PaneCoordinates | null;
    /**
     * Get pane coordinates with enhanced fallback methods
     */
    getPaneCoordinatesWithFallback(chart: IChartApi, paneId: number, container: HTMLElement, options?: PaneDimensionsOptions & ChartDimensionsOptions): Promise<PaneCoordinates | null>;
    /**
     * Get pane coordinates using DOM measurements (fallback method)
     */
    private getPaneCoordinatesFromDOM;
    /**
     * Check if a point is within a pane
     */
    isPointInPane(point: {
        x: number;
        y: number;
    }, paneCoords: PaneCoordinates): boolean;
    /**
     * Check if chart dimensions are valid
     */
    areChartDimensionsValid(dimensions: ChartCoordinates, minWidth?: number, minHeight?: number): boolean;
    /**
     * Check if chart dimensions object is valid
     */
    areChartDimensionsObjectValid(dimensions: {
        container: {
            width: number;
            height: number;
        };
    }, minWidth?: number, minHeight?: number): boolean;
    /**
     * Get validated chart coordinates
     */
    getValidatedCoordinates(chart: IChartApi, container: HTMLElement, options?: ChartDimensionsOptions): Promise<ChartCoordinates | null>;
    /**
     * Get chart dimensions with multiple fallback methods
     */
    getChartDimensionsWithFallback(chart: IChartApi, container: HTMLElement, options?: ChartDimensionsOptions): Promise<{
        container: {
            width: number;
            height: number;
        };
        timeScale: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        priceScale: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    }>;
    /**
     * Get chart dimensions using chart API (most accurate)
     */
    private getChartDimensionsFromAPI;
    /**
     * Get chart dimensions using DOM measurements (fallback method)
     */
    private getChartDimensionsFromDOM;
    /**
     * Get default chart dimensions (last resort)
     */
    private getDefaultChartDimensions;
    /**
     * Get validated chart dimensions
     */
    getValidatedChartDimensions(chart: IChartApi, container: HTMLElement, options?: ChartDimensionsOptions): Promise<{
        container: {
            width: number;
            height: number;
        };
        timeScale: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        priceScale: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    } | null>;
    /**
     * Calculate range switcher position for the entire chart
     */
    getRangeSwitcherPosition(chart: IChartApi, position: ElementPosition, containerDimensions?: {
        width: number;
        height: number;
    }): LegendCoordinates | null;
    /**
     * Calculate legend position within a pane
     */
    getLegendPosition(chart: IChartApi, paneId: number, position: ElementPosition): LegendCoordinates | null;
    /**
     * Subscribe to coordinate updates
     */
    onCoordinateUpdate(chartId: string, callback: () => void): () => void;
    /**
     * Invalidate cache for a specific chart
     */
    invalidateCache(chartId?: string): void;
    /**
     * Calculate coordinates for a chart
     */
    private calculateCoordinates;
    /**
     * Get container dimensions
     */
    private getContainerDimensions;
    /**
     * Get time scale dimensions
     */
    private getTimeScaleDimensions;
    /**
     * Get price scale dimensions
     */
    private getPriceScaleDimensions;
    /**
     * Get all pane coordinates
     */
    private getAllPaneCoordinates;
    /**
     * Calculate content area
     */
    private calculateContentArea;
    /**
     * Get price scale width helper
     */
    private getPriceScaleWidth;
    /**
     * Get time scale height helper
     */
    private getTimeScaleHeight;
    /**
     * Generate cache key
     */
    private generateCacheKey;
    /**
     * Notify update callbacks
     */
    private notifyUpdateCallbacks;
    /**
     * Start cache cleanup timer
     */
    private startCacheCleanup;
    /**
     * Stop cache cleanup timer and clean up resources
     * Call this when destroying the service instance
     */
    destroy(): void;
    /**
     * Reset the singleton instance (useful for testing)
     */
    static resetInstance(): void;
    /**
     * Get current pane dimensions for comparison
     */
    getCurrentPaneDimensions(chart: IChartApi): {
        [paneId: number]: {
            width: number;
            height: number;
        };
    };
    /**
     * Check if pane dimensions have changed and notify listeners
     */
    checkPaneSizeChanges(chart: IChartApi, chartId: string): boolean;
    /**
     * Enhanced pane size change detection with better performance
     */
    checkPaneSizeChangesOptimized(chart: IChartApi, chartId: string): boolean;
    /**
     * Force refresh of coordinates for a specific chart
     * Useful when external changes affect chart layout
     */
    forceRefreshCoordinates(chartId: string): void;
    /**
     * Check if pane dimensions have changed
     */
    private hasPaneSizeChanges;
    /**
     * Integration with CornerLayoutManager
     * Get chart dimensions for layout manager
     */
    getChartDimensionsForLayout(chart: IChartApi): {
        width: number;
        height: number;
    } | null;
    /**
     * Get chart layout dimensions including axis information for layout manager
     */
    getChartLayoutDimensionsForManager(chart: IChartApi): ChartLayoutDimensions | null;
    /**
     * Convert ElementPosition to Corner for layout manager
     */
    positionToCorner(position: ElementPosition): string;
    /**
     * ================================
     * POSITIONING ENGINE FUNCTIONALITY
     * Absorbed from PositioningEngine to ensure single source of truth
     * ================================
     */
    /**
     * Calculate legend position with consistent logic
     */
    calculateLegendPosition(chart: IChartApi, paneId: number, position: ElementPosition, config?: PositioningConfig): LegendCoordinates | null;
    /**
     * Recalculate legend position with actual element dimensions
     */
    recalculateLegendPosition(chart: IChartApi, paneId: number, position: ElementPosition, legendElement: HTMLElement, config?: PositioningConfig): LegendCoordinates | null;
    /**
     * Calculate tooltip position relative to cursor
     */
    calculateTooltipPosition(cursorX: number, cursorY: number, tooltipWidth: number, tooltipHeight: number, containerBounds: BoundingBox, preferredAnchor?: 'top' | 'bottom' | 'left' | 'right'): TooltipPosition;
    /**
     * Calculate overlay position (for rectangles, annotations, etc.)
     * Note: This requires a series to convert prices to coordinates
     */
    calculateOverlayPosition(startTime: Time, endTime: Time, startPrice: number, endPrice: number, chart: IChartApi, series?: ISeriesApi<any>, _paneId?: number): BoundingBox | null;
    /**
     * Calculate multi-pane layout positions
     */
    calculateMultiPaneLayout(totalHeight: number, paneHeights: number[] | 'equal' | {
        [key: number]: number;
    }): {
        [paneId: number]: BoundingBox;
    };
    /**
     * Calculate crosshair label position
     */
    calculateCrosshairLabelPosition(crosshairX: number, crosshairY: number, labelWidth: number, labelHeight: number, containerBounds: BoundingBox, axis: 'x' | 'y'): {
        x: number;
        y: number;
    };
    /**
     * Calculate element position within bounds
     */
    private calculateElementPosition;
    /**
     * Validate positioning constraints
     */
    validatePositioning(element: BoundingBox, container: BoundingBox): {
        isValid: boolean;
        adjustments: {
            x?: number;
            y?: number;
        };
    };
    /**
     * Apply positioning to DOM element
     */
    applyPositionToElement(element: HTMLElement, coordinates: LegendCoordinates | {
        top: number;
        left: number;
        right?: number;
        bottom?: number;
    }): void;
    /**
     * Calculate responsive scaling factor
     */
    calculateScalingFactor(currentWidth: number, currentHeight: number, baseWidth?: number, baseHeight?: number): {
        x: number;
        y: number;
        uniform: number;
    };
    /**
     * Calculate widget stack position for layout manager support
     */
    calculateWidgetStackPosition(chart: IChartApi, paneId: number, corner: string, widgets: LayoutWidget[], index: number): WidgetPosition | null;
    /**
     * Get actual axis dimensions from lightweight-charts APIs
     */
    private getAxisDimensions;
    /**
     * Check if the given pane is the last pane in the chart
     */
    private isLastPane;
    /**
     * Calculate cumulative offset for widget stacking
     */
    calculateCumulativeOffset(widgets: LayoutWidget[], index: number, gap?: number): number;
    /**
     * Validate stacking bounds for overflow detection
     */
    validateStackingBounds(corner: string, widgets: LayoutWidget[], containerBounds: BoundingBox): {
        isValid: boolean;
        overflowingWidgets: LayoutWidget[];
    };
    /**
     * Setup automatic layout manager updates when chart dimensions change
     */
    setupLayoutManagerIntegration(chart: IChartApi, layoutManager: any): void;
    /**
     * Convert series data items to screen coordinates with unified validation
     *
     * This method provides DRY-compliant coordinate conversion for series plugins,
     * eliminating the need for duplicated conversion logic across different series.
     *
     * @param data - Data items to convert (from series pane view data)
     * @param scope - Bitmap coordinates rendering scope
     * @param priceConverter - Price to coordinate converter
     * @param config - Conversion configuration
     * @returns Array of converted coordinates
     */
    convertSeriesDataToScreenCoordinates(data: Array<{
        x: number;
        originalData: Record<string, any>;
    }>, scope: {
        horizontalPixelRatio: number;
        verticalPixelRatio: number;
    }, priceConverter: PriceToCoordinateConverter, config: SeriesDataConversionConfig): SeriesDataConversionResult[];
    /**
     * Validate numeric data values for series
     *
     * @param data - Data object to validate
     * @param keys - Keys to validate
     * @param options - Validation options
     * @returns True if all values are valid
     */
    validateSeriesNumericData(data: Record<string, any>, keys: string[], options?: {
        allowNull?: boolean;
        allowUndefined?: boolean;
        checkFinite?: boolean;
    }): boolean;
    /**
     * Convert price values to coordinates with error handling
     *
     * @param values - Price values to convert
     * @param priceConverter - Price to coordinate converter
     * @param pixelRatio - Vertical pixel ratio for scaling
     * @returns Converted coordinates or null if conversion fails
     */
    convertPricesToCoordinates(values: Record<string, number>, priceConverter: PriceToCoordinateConverter, pixelRatio: number): Record<string, number> | null;
    /**
     * Predefined configurations for common series types
     */
    static readonly SeriesDataConfigs: {
        /** Configuration for ribbon series (upper, lower) */
        ribbon: SeriesDataConversionConfig;
        /** Configuration for band series (upper, middle, lower) */
        band: SeriesDataConversionConfig;
        /** Configuration for gradient ribbon series (upper, lower with fillColor) */
        gradientRibbon: SeriesDataConversionConfig;
        /** Configuration for single value series */
        singleValue: SeriesDataConversionConfig;
    };
}
//# sourceMappingURL=ChartCoordinateService.d.ts.map