import { Dimensions, Position, IPositionableWidget, LayoutConfig, LayoutManagerEvents, ChartLayoutDimensions } from '../types/layout';
import { IChartApi } from 'lightweight-charts';
import { KeyedSingletonManager } from '../utils/KeyedSingletonManager';
/**
 * CornerLayoutManager - Automatic corner-based widget positioning
 *
 * @export
 * @class CornerLayoutManager
 * @extends {KeyedSingletonManager<CornerLayoutManager>}
 */
export declare class CornerLayoutManager extends KeyedSingletonManager<CornerLayoutManager> {
    private config;
    private cornerStates;
    private chartDimensions;
    private events;
    private chartId;
    private paneId;
    private coordinateService;
    private chartApi;
    private constructor();
    static getInstance(chartId?: string, paneId?: number): CornerLayoutManager;
    static cleanup(chartId: string, paneId?: number): void;
    /**
     * Configure layout settings
     */
    configure(config: Partial<LayoutConfig>): void;
    /**
     * Set chart API reference for pane coordinate calculations
     */
    setChartApi(chartApi: IChartApi): void;
    /**
     * Set event handlers
     */
    on(events: Partial<LayoutManagerEvents>): void;
    /**
     * Update chart dimensions and recalculate layouts
     */
    updateChartDimensions(dimensions: Dimensions): void;
    /**
     * Update chart dimensions immediately from chart element (for fast resize)
     */
    updateChartDimensionsFromElement(): void;
    /**
     * Update chart layout with axis dimensions and recalculate layouts
     */
    updateChartLayout(dimensions: ChartLayoutDimensions): void;
    /**
     * Register a widget for positioning management
     */
    registerWidget(widget: IPositionableWidget): void;
    /**
     * Unregister a widget
     */
    unregisterWidget(widgetId: string): void;
    /**
     * Update widget visibility and recalculate layout
     */
    updateWidgetVisibility(widgetId: string, visible: boolean): void;
    /**
     * Get the calculated position for a specific widget
     */
    getWidgetPosition(widgetId: string): Position | null;
    /**
     * Recalculate layouts for all corners
     */
    recalculateAllLayouts(): void;
    /**
     * Recalculate layout for a specific corner
     */
    private recalculateCornerLayout;
    /**
     * Calculate position for a widget at specific index in corner
     * OPTIMIZED: Direct synchronous calculation for immediate resize performance
     */
    private calculateWidgetPosition;
    /**
     * Calculate total height needed for all widgets in corner
     */
    private calculateTotalHeight;
    /**
     * Calculate total width needed for all widgets in corner
     */
    private calculateTotalWidth;
    /**
     * Detect widgets that would overflow the chart area
     * OPTIMIZED: Direct synchronous overflow detection for immediate resize performance
     */
    private detectOverflow;
    /**
     * Get the chart ID this layout manager is associated with
     */
    getChartId(): string;
    /**
     * Cleanup instance resources
     */
    destroy(): void;
}
//# sourceMappingURL=CornerLayoutManager.d.ts.map