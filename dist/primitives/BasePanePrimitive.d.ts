import { IChartApi, ISeriesApi, IPanePrimitive, Time } from 'lightweight-charts';
import { CornerLayoutManager } from '../services/CornerLayoutManager';
import { ChartCoordinateService } from '../services/ChartCoordinateService';
import { TemplateEngine, TemplateResult } from '../services/TemplateEngine';
import { TemplateContext } from '../types/ChartInterfaces';
import { PrimitiveEventManager, EventSubscription } from '../services/PrimitiveEventManager';
import { Corner, Position, IPositionableWidget, WidgetDimensions } from '../types/layout';
/**
 * Base configuration for all pane primitives
 */
export interface BasePrimitiveConfig {
    /**
     * Position in chart corner
     */
    corner?: Corner;
    /**
     * Priority for stacking order (lower = higher priority)
     */
    priority?: number;
    /**
     * Whether the primitive is visible
     */
    visible?: boolean;
    /**
     * Styling configuration
     */
    style?: {
        backgroundColor?: string;
        color?: string;
        fontSize?: number;
        fontFamily?: string;
        borderRadius?: number;
        padding?: number;
        margin?: number;
        zIndex?: number;
    };
}
/**
 * Interface for template data used in primitives
 */
export interface TemplateData {
    [key: string]: any;
}
/**
 * Abstract base class for all pane primitives
 *
 * This class provides:
 * - Layout Management System - built-in positioning and stacking
 * - React Integration Layer - hybrid primitives that can render React components
 * - Event System Integration - built-in event handling
 * - Template processing system for dynamic content
 *
 * Following DRY principles with single source of truth architecture
 */
export declare abstract class BasePanePrimitive<TConfig extends BasePrimitiveConfig = BasePrimitiveConfig> implements IPanePrimitive<Time>, IPositionableWidget {
    readonly id: string;
    readonly corner: Corner;
    readonly priority: number;
    visible: boolean;
    protected config: TConfig;
    protected chart: IChartApi | null;
    protected series: ISeriesApi<any> | null;
    protected requestUpdate: (() => void) | null;
    protected layoutManager: CornerLayoutManager | null;
    private _coordinateService;
    private _templateEngine;
    protected eventManager: PrimitiveEventManager | null;
    /**
     * Lazy getter for coordinate service - avoids module loading order issues
     */
    protected get coordinateService(): ChartCoordinateService;
    /**
     * Lazy getter for template engine - avoids module loading order issues
     */
    protected get templateEngine(): TemplateEngine;
    protected currentPosition: Position | null;
    protected containerElement: HTMLElement | null;
    protected mounted: boolean;
    protected eventSubscriptions: EventSubscription[];
    protected templateData: TemplateData;
    protected templateContext: TemplateContext;
    protected lastTemplateResult: TemplateResult | null;
    constructor(id: string, config: TConfig);
    /**
     * Called when primitive is attached to a pane
     */
    attached(params: {
        chart: IChartApi;
        series: ISeriesApi<any>;
        requestUpdate: () => void;
    }): void;
    /**
     * Called when primitive is detached from a pane
     */
    detached(): void;
    private lastPaneCoords;
    /**
     * IPanePrimitive interface - integrates with chart's rendering pipeline
     *
     * The draw() method is called automatically by the chart on every render cycle,
     * allowing smooth position updates without manual DOM manipulation.
     */
    paneViews(): any[];
    /**
     * Check if pane coordinates changed (ignoring sub-pixel jitter)
     */
    private hasCoordinatesChanged;
    /**
     * Main primitive update method - handles rendering
     */
    updateAllViews(): void;
    /**
     * Get current dimensions of the primitive's container
     */
    getDimensions(): WidgetDimensions;
    /**
     * Called by layout manager to update position
     * Now properly integrates with lightweight-charts coordinate updates
     */
    updatePosition(position: Position): void;
    /**
     * Initialize layout management integration
     */
    private initializeLayoutManagement;
    /**
     * Get the pane ID for this primitive
     * Defaults to 0 (main pane) - can be overridden by subclasses if needed
     */
    protected getPaneId(): number;
    /**
     * Get the chart ID for this primitive
     */
    protected getChartId(): string;
    /**
     * Ensure container element exists
     */
    private ensureContainer;
    /**
     * Apply position to container using CSS (no chart re-render)
     * Uses PrimitiveStylingUtils.applyPosition for DRY compliance
     */
    private applyPositionToContainer;
    /**
     * Apply base container styling
     */
    private applyBaseContainerStyling;
    /**
     * Destroy container element
     */
    private destroyContainer;
    /**
     * Set template data for processing
     */
    setTemplateData(data: TemplateData): void;
    /**
     * Update template context for processing
     */
    updateTemplateContext(context: Partial<TemplateContext>): void;
    /**
     * Process template with current data using TemplateEngine
     */
    protected processTemplate(): void;
    /**
     * Get processed template content
     */
    protected getProcessedContent(): string;
    /**
     * Get template processing result for debugging
     */
    getTemplateResult(): TemplateResult | null;
    /**
     * Initialize event management
     */
    private initializeEventManagement;
    /**
     * Setup default event subscriptions
     */
    private setupDefaultEventSubscriptions;
    /**
     * Cleanup event subscriptions
     */
    private cleanupEventSubscriptions;
    /**
     * Handle crosshair move events
     */
    protected handleCrosshairMove(event: {
        time: any;
        point: {
            x: number;
            y: number;
        } | null;
        seriesData: Map<any, any>;
    }): void;
    /**
     * Handle chart resize events
     */
    protected handleChartResize(event: {
        width: number;
        height: number;
    }): void;
    /**
     * Get event manager instance
     */
    getEventManager(): PrimitiveEventManager | null;
    /**
     * Set primitive visibility
     */
    setVisible(visible: boolean): void;
    /**
     * Toggle primitive visibility
     */
    toggle(): void;
    /**
     * Update primitive configuration
     */
    updateConfig(newConfig: Partial<TConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): TConfig;
    /**
     * Get the template string for this primitive
     */
    protected abstract getTemplate(): string;
    /**
     * Render content to the container
     */
    protected abstract renderContent(): void;
    /**
     * Get CSS class name for the container
     */
    protected abstract getContainerClassName(): string;
    /**
     * Called when primitive is attached to chart
     */
    protected onAttached(_params: {
        chart: IChartApi;
        series: ISeriesApi<any>;
        requestUpdate: () => void;
    }): void;
    /**
     * Called when primitive is detached from chart
     */
    protected onDetached(): void;
    /**
     * Called during each update cycle
     */
    protected onUpdate(): void;
    /**
     * Called when position is updated by layout manager
     */
    protected onPositionUpdate(_position: Position): void;
    /**
     * Called when container element is created
     */
    protected onContainerCreated(_container: HTMLElement): void;
    /**
     * Called when visibility changes
     */
    protected onVisibilityChanged(_visible: boolean): void;
    /**
     * Called when configuration is updated
     */
    protected onConfigUpdate(_newConfig: Partial<TConfig>): void;
    /**
     * Called when crosshair moves over the chart
     */
    protected onCrosshairMove(_event: {
        time: any;
        point: {
            x: number;
            y: number;
        } | null;
        seriesData: Map<any, any>;
    }): void;
    /**
     * Called when chart is resized
     */
    protected onChartResize(_event: {
        width: number;
        height: number;
    }): void;
    /**
     * Setup custom event subscriptions - override in subclasses
     */
    protected setupCustomEventSubscriptions(): void;
    /**
     * Get current position
     */
    getPosition(): Position | null;
    /**
     * Get container element
     */
    getContainer(): HTMLElement | null;
    /**
     * Check if primitive is mounted
     */
    isMounted(): boolean;
    /**
     * Get chart API reference
     */
    getChart(): IChartApi | null;
    /**
     * Get series API reference
     */
    getSeries(): ISeriesApi<any> | null;
}
/**
 * Priority levels for common primitives
 */
export declare const PrimitivePriority: {
    readonly RANGE_SWITCHER: 1;
    readonly MINIMIZE_BUTTON: 2;
    readonly LEGEND: 3;
    readonly CUSTOM: 10;
    readonly DEBUG: 999;
};
/**
 * Primitive type identifiers
 */
export declare const PrimitiveType: {
    readonly LEGEND: "legend";
    readonly RANGE_SWITCHER: "range-switcher";
    readonly BUTTON: "button";
    readonly CUSTOM: "custom";
};
//# sourceMappingURL=BasePanePrimitive.d.ts.map