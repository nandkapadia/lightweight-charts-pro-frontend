import { IChartApi, ISeriesApi, Time, SeriesDataItemTypeMap } from 'lightweight-charts';
/**
 * Event types for primitive interactions
 *
 * @interface PrimitiveEventTypes
 */
/**
 * Series data map type for event payloads
 */
export type SeriesDataMap = Map<ISeriesApi<keyof SeriesDataItemTypeMap>, SeriesDataItemTypeMap[keyof SeriesDataItemTypeMap]>;
export interface PrimitiveEventTypes {
    /**
     * Crosshair position changed
     */
    crosshairMove: {
        time: Time | null;
        point: {
            x: number;
            y: number;
        } | null;
        seriesData: SeriesDataMap;
    };
    /**
     * Chart data updated
     */
    dataUpdate: {
        series: ISeriesApi<keyof SeriesDataItemTypeMap>;
        data: SeriesDataItemTypeMap[keyof SeriesDataItemTypeMap][];
    };
    /**
     * Chart resize event
     */
    resize: {
        width: number;
        height: number;
    };
    /**
     * Primitive visibility changed
     */
    visibilityChange: {
        primitiveId: string;
        visible: boolean;
    };
    /**
     * Primitive configuration changed
     */
    configChange: {
        primitiveId: string;
        config: Record<string, unknown>;
    };
    /**
     * Chart time scale visible range changed
     */
    timeScaleChange: {
        from: Time | null;
        to: Time | null;
    };
    /**
     * Chart click event
     */
    click: {
        time: Time | null;
        point: {
            x: number;
            y: number;
        };
        seriesData: SeriesDataMap;
    };
    /**
     * Chart hover event
     */
    hover: {
        time: Time | null;
        point: {
            x: number;
            y: number;
        };
        seriesData: SeriesDataMap;
    };
    /**
     * Custom primitive events
     */
    custom: {
        eventType: string;
        data: unknown;
    };
}
/**
 * Event listener type
 */
export type PrimitiveEventListener<K extends keyof PrimitiveEventTypes> = (event: PrimitiveEventTypes[K]) => void;
/**
 * Event subscription interface
 */
export interface EventSubscription {
    unsubscribe(): void;
}
/**
 * PrimitiveEventManager - Centralized event management for primitives
 *
 * Provides unified event handling for chart interactions and primitive lifecycle.
 * Integrates with lightweight-charts event system and provides abstracted events
 * for primitive implementations.
 *
 * Following DRY principles - single source of truth for event management
 */
export declare class PrimitiveEventManager {
    private static instances;
    private chart;
    private chartId;
    private eventListeners;
    private chartEventCleanup;
    private _isDestroyed;
    private lastCrosshairPosition;
    private constructor();
    /**
     * Get or create event manager for a chart
     */
    static getInstance(chartId: string): PrimitiveEventManager;
    /**
     * Clean up event manager for a chart
     */
    static cleanup(chartId: string): void;
    /**
     * Initialize with chart API
     */
    initialize(chart: IChartApi): void;
    /**
     * Subscribe to primitive event
     */
    subscribe<K extends keyof PrimitiveEventTypes>(eventType: K, listener: PrimitiveEventListener<K>): EventSubscription;
    /**
     * Emit event to subscribers
     */
    emit<K extends keyof PrimitiveEventTypes>(eventType: K, event: PrimitiveEventTypes[K]): void;
    /**
     * Setup chart event listeners
     */
    private setupChartEventListeners;
    /**
     * Handle crosshair move events
     */
    private handleCrosshairMove;
    /**
     * Handle chart click events
     */
    private handleChartClick;
    /**
     * Handle time scale changes
     */
    private handleTimeScaleChange;
    /**
     * Setup resize observer for chart container
     */
    private setupResizeObserver;
    /**
     * Emit primitive visibility change event
     */
    emitVisibilityChange(primitiveId: string, visible: boolean): void;
    /**
     * Emit primitive configuration change event
     */
    emitConfigChange(primitiveId: string, config: Record<string, unknown>): void;
    /**
     * Emit custom primitive event
     */
    emitCustomEvent(eventType: string, data: unknown): void;
    /**
     * Get current crosshair position
     */
    getCurrentCrosshairPosition(): {
        time: Time | null;
        point: {
            x: number;
            y: number;
        } | null;
    } | null;
    /**
     * Get chart API reference
     */
    getChart(): IChartApi | null;
    /**
     * Get chart ID
     */
    getChartId(): string;
    /**
     * Check if event manager is destroyed
     */
    isDestroyed(): boolean;
    /**
     * Get event listener count for debugging
     */
    getEventListenerCount(): {
        [eventType: string]: number;
    };
    /**
     * Destroy event manager
     */
    destroy(): void;
}
/**
 * Event manager integration mixin for primitives
 */
export interface EventManagerIntegration {
    /**
     * Get event manager for this primitive
     */
    getEventManager(): PrimitiveEventManager | null;
    /**
     * Subscribe to chart events
     */
    subscribeToEvents(): void;
    /**
     * Unsubscribe from chart events
     */
    unsubscribeFromEvents(): void;
}
/**
 * Helper function to create event manager integration
 */
export declare function createEventManagerIntegration(chartId: string, chart?: IChartApi): EventManagerIntegration;
//# sourceMappingURL=PrimitiveEventManager.d.ts.map