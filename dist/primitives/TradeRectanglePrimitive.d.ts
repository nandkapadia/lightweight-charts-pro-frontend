import { IPrimitivePaneRenderer, IPrimitivePaneView, ISeriesPrimitive, IChartApi, ISeriesApi, Coordinate, UTCTimestamp, PrimitiveHoveredItem } from 'lightweight-charts';
/**
 * Trade rectangle data structure
 *
 * Represents a single trade visualization as a rectangular overlay on the chart.
 * The rectangle spans from entry time/price to exit time/price.
 *
 * @interface TradeRectangleData
 * @property {UTCTimestamp} time1 - Entry time (UNIX timestamp in seconds)
 * @property {UTCTimestamp} time2 - Exit time (UNIX timestamp in seconds)
 * @property {number} price1 - Entry price
 * @property {number} price2 - Exit price
 * @property {string} fillColor - Fill color (hex or rgba)
 * @property {string} borderColor - Border color (hex or rgba)
 * @property {number} borderWidth - Border width in pixels
 * @property {number} opacity - Fill opacity (0.0 to 1.0)
 * @property {number} [quantity] - Optional trade quantity
 * @property {string} [notes] - Optional trade notes
 * @property {string} [tradeId] - Optional unique trade identifier
 * @property {boolean} [isProfitable] - Optional profitability flag
 */
interface TradeRectangleData {
    time1: UTCTimestamp;
    time2: UTCTimestamp;
    price1: number;
    price2: number;
    fillColor: string;
    borderColor: string;
    borderWidth: number;
    opacity: number;
    quantity?: number;
    notes?: string;
    tradeId?: string;
    isProfitable?: boolean;
    [key: string]: any;
}
/**
 * Options for customizing trade rectangle tooltips
 *
 * Configures tooltip behavior and appearance for trade rectangles.
 * Integrates with the TooltipManager system for coordinated tooltip display.
 *
 * @interface TradeRectangleTooltipOptions
 * @property {number} [priority] - Tooltip priority (higher values take precedence when
 *   multiple elements are under the crosshair). Default: 10
 * @property {string} [customStyle] - Custom CSS styles to append to base tooltip styles.
 *   Use inline CSS format (e.g., "background: red; color: white;")
 * @property {boolean} [enabled] - Whether tooltips are enabled for this trade rectangle.
 *   Default: true
 * @property {string} [tooltipTemplate] - Custom HTML template for tooltip content.
 *   Supports placeholders like $$entry_price$$, $$exit_price$$, $$pnl$$, etc.
 *   If not provided, uses default tooltip format.
 *
 * @example
 * ```typescript
 * const options: TradeRectangleTooltipOptions = {
 *   priority: 15,
 *   enabled: true,
 *   tooltipTemplate: '<div>Trade: $$trade_type$$<br/>P&L: $$pnl$$</div>',
 *   customStyle: 'font-size: 12px; padding: 8px;'
 * };
 * ```
 */
export interface TradeRectangleTooltipOptions {
    /** Tooltip priority (higher = takes precedence) */
    priority?: number;
    /** Custom tooltip style CSS */
    customStyle?: string;
    /** Enable/disable tooltip */
    enabled?: boolean;
    /** Custom HTML template for tooltip content */
    tooltipTemplate?: string;
}
/**
 * Trade Rectangle Renderer - Canvas rendering layer for trade rectangles
 *
 * Implements IPrimitivePaneRenderer to handle the actual canvas drawing of
 * trade rectangles. This class is responsible for rendering filled rectangles
 * with borders using the HTML5 Canvas API in bitmap coordinate space.
 *
 * Architecture:
 * - Receives pre-calculated screen coordinates from TradeRectangleView
 * - Renders using useBitmapCoordinateSpace for pixel-perfect drawing
 * - Handles pixel ratio conversion for high-DPI displays
 * - Applies fill colors, borders, and opacity
 *
 * @class TradeRectangleRenderer
 * @implements {IPrimitivePaneRenderer}
 *
 * @remarks
 * This renderer only handles drawing - it does NOT:
 * - Calculate coordinates (done by TradeRectangleView)
 * - Handle hit testing (done by TradeRectanglePrimitive)
 * - Manage tooltips (done by TooltipManager)
 * - Render text labels (done by tooltip system)
 */
declare class TradeRectangleRenderer implements IPrimitivePaneRenderer {
    /** X coordinate of first corner (entry or exit) */
    private _x1;
    /** Y coordinate of first corner (entry or exit) */
    private _y1;
    /** X coordinate of second corner (entry or exit) */
    private _x2;
    /** Y coordinate of second corner (entry or exit) */
    private _y2;
    /** Rectangle fill color (hex or rgba) */
    private _fillColor;
    /** Rectangle border color (hex or rgba) */
    private _borderColor;
    /** Border width in pixels */
    private _borderWidth;
    /** Fill opacity (0.0 to 1.0) */
    private _opacity;
    /**
     * Creates a new TradeRectangleRenderer
     *
     * @param {Coordinate} x1 - X coordinate of first corner
     * @param {Coordinate} y1 - Y coordinate of first corner
     * @param {Coordinate} x2 - X coordinate of second corner
     * @param {Coordinate} y2 - Y coordinate of second corner
     * @param {string} fillColor - Fill color (hex or rgba format)
     * @param {string} borderColor - Border color (hex or rgba format)
     * @param {number} borderWidth - Border width in pixels
     * @param {number} opacity - Fill opacity from 0.0 (transparent) to 1.0 (opaque)
     */
    constructor(x1: Coordinate, y1: Coordinate, x2: Coordinate, y2: Coordinate, fillColor: string, borderColor: string, borderWidth: number, opacity: number);
    /**
     * Draw method (not used for rectangles)
     *
     * Required by IPrimitivePaneRenderer interface but not used.
     * Rectangles are drawn in drawBackground() to appear behind other elements.
     *
     * @param {any} _target - Rendering target (unused)
     */
    draw(_target: any): void;
    /**
     * Draw the trade rectangle on the canvas background layer
     *
     * Renders the rectangle using bitmap coordinate space for pixel-perfect drawing.
     * Applies fill color with opacity and border with specified width.
     *
     * Drawing process:
     * 1. Validate coordinates are not null/undefined
     * 2. Convert to bitmap coordinates with pixel ratio
     * 3. Calculate rectangle bounds (left, top, width, height)
     * 4. Draw filled rectangle with opacity
     * 5. Draw border if border width > 0
     *
     * @param {any} target - Rendering target with useBitmapCoordinateSpace method
     *
     * @remarks
     * - Uses drawBackground to render behind other chart elements
     * - Text labels are NOT rendered here (handled by tooltip system)
     * - Returns early if coordinates are invalid or rectangle is too small
     */
    drawBackground(target: any): void;
}
/**
 * Trade Rectangle View - Coordinate conversion layer
 *
 * Implements IPrimitivePaneView to handle coordinate conversion from
 * chart data space (time/price) to screen space (pixels). This class
 * acts as the bridge between trade data and visual rendering.
 *
 * Responsibilities:
 * - Convert trade times to X coordinates (timeToCoordinate)
 * - Convert trade prices to Y coordinates (priceToCoordinate)
 * - Validate coordinate conversion results
 * - Update coordinates when chart is panned/zoomed
 * - Create renderer with converted coordinates
 *
 * @class TradeRectangleView
 * @implements {IPrimitivePaneView}
 *
 * @remarks
 * This view layer separates coordinate math from rendering logic,
 * following the official TradingView primitive pattern.
 */
declare class TradeRectangleView implements IPrimitivePaneView {
    /** Reference to parent primitive for accessing chart and data */
    private _source;
    /** Cached X coordinate of first corner (screen pixels) */
    private _x1;
    /** Cached Y coordinate of first corner (screen pixels) */
    private _y1;
    /** Cached X coordinate of second corner (screen pixels) */
    private _x2;
    /** Cached Y coordinate of second corner (screen pixels) */
    private _y2;
    /**
     * Creates a new TradeRectangleView
     *
     * @param {TradeRectanglePrimitive} source - Parent primitive containing trade data
     */
    constructor(source: TradeRectanglePrimitive);
    /**
     * Update coordinates by converting trade data to screen coordinates
     *
     * Called by Lightweight Charts when the view needs to be updated (pan, zoom,
     * resize, etc.). Converts trade times and prices to screen coordinates using
     * the chart's time scale and price scale.
     *
     * Conversion process:
     * 1. Get trade data, chart API, and series API from source
     * 2. Convert entry/exit times to X coordinates
     * 3. Convert entry/exit prices to Y coordinates
     * 4. Validate all conversions succeeded
     * 5. Cache coordinates for renderer
     *
     * @remarks
     * - Returns silently if conversion fails (coordinates will be null)
     * - Validates coordinates are finite numbers
     * - Uses direct coordinate conversion (not ChartCoordinateService)
     */
    update(): void;
    /**
     * Create renderer with current coordinates
     *
     * Called by Lightweight Charts to get the renderer for drawing.
     * Creates a new TradeRectangleRenderer with the current screen coordinates
     * and styling properties from the trade data.
     *
     * @returns {TradeRectangleRenderer} Renderer instance for canvas drawing
     */
    renderer(): TradeRectangleRenderer;
}
/**
 * Trade Rectangle Primitive - Main primitive class for trade visualization
 *
 * Implements ISeriesPrimitive to provide interactive trade rectangle overlays
 * on Lightweight Charts. This class coordinates the view (coordinate conversion),
 * renderer (canvas drawing), and tooltip system (hover interactions).
 *
 * Architecture:
 * - Manages TradeRectangleView for coordinate conversion
 * - Provides hit testing for interactive tooltips
 * - Subscribes to chart events (crosshair, time scale changes)
 * - Integrates with TooltipManager for decoupled tooltip display
 * - Handles proper cleanup to prevent memory leaks
 *
 * Features:
 * - Event-driven coordinate updates on chart pan/zoom
 * - Interactive tooltip display on hover
 * - Template-based tooltip content
 * - Hit test tolerance for easier interaction
 * - Automatic retry logic for coordinate conversion
 * - Proper event listener cleanup
 *
 * @export
 * @class TradeRectanglePrimitive
 * @implements {ISeriesPrimitive}
 *
 * @example
 * ```typescript
 * const rectangleData: TradeRectangleData = {
 *   time1: 1704067200 as UTCTimestamp,
 *   time2: 1704153600 as UTCTimestamp,
 *   price1: 100.0,
 *   price2: 105.0,
 *   fillColor: 'rgba(76, 175, 80, 0.1)',
 *   borderColor: '#4CAF50',
 *   borderWidth: 2,
 *   opacity: 0.2,
 *   isProfitable: true,
 *   tradeId: 'TRADE-001'
 * };
 *
 * const tooltipOptions: TradeRectangleTooltipOptions = {
 *   enabled: true,
 *   priority: 10,
 *   tooltipTemplate: '<div>P&L: $$pnl$$</div>'
 * };
 *
 * const primitive = new TradeRectanglePrimitive(rectangleData, tooltipOptions);
 * series.attachPrimitive(primitive);
 * ```
 */
export declare class TradeRectanglePrimitive implements ISeriesPrimitive {
    /** Trade rectangle data (entry/exit time/price, colors, etc.) */
    private _data;
    /** Reference to chart API (set when primitive is attached) */
    private _chart;
    /** Reference to series API (set when primitive is attached) */
    private _series;
    /** View instance handling coordinate conversion */
    private _paneView;
    /** Callback to request view update from Lightweight Charts */
    private _requestUpdate?;
    /** Time scale change event callback (stored for cleanup) */
    private _timeScaleCallback?;
    /** Crosshair move event callback (stored for cleanup) */
    private _crosshairCallback?;
    /** Throttle flag to prevent excessive updates */
    private _updateThrottled;
    /** Unique identifier for this primitive instance */
    private _primitiveId;
    /** Tooltip configuration options */
    private _tooltipOptions;
    /**
     * Creates a new TradeRectanglePrimitive
     *
     * @param {TradeRectangleData} data - Trade rectangle data with time/price bounds
     * @param {TradeRectangleTooltipOptions} [tooltipOptions] - Optional tooltip configuration
     */
    constructor(data: TradeRectangleData, tooltipOptions?: TradeRectangleTooltipOptions);
    /**
     * Update all views (required by ISeriesPrimitive)
     *
     * Called by Lightweight Charts when the primitive needs to recalculate coordinates.
     * Triggers coordinate conversion in the view layer.
     */
    updateAllViews(): void;
    /**
     * Get all pane views (required by ISeriesPrimitive)
     *
     * @returns {TradeRectangleView[]} Array containing the single pane view
     */
    paneViews(): TradeRectangleView[];
    /**
     * Get unique primitive identifier
     *
     * Used by TooltipManager to track tooltip requests from this primitive.
     *
     * @returns {string} Unique primitive ID
     */
    getId(): string;
    /**
     * Create tooltip HTML content for this trade rectangle
     *
     * Generates HTML content for the tooltip using either a custom template
     * (if provided) or the default tooltip format. All data comes from the
     * backend - no calculations are performed in the frontend.
     *
     * Template processing:
     * 1. If custom template provided, use TradeTemplateProcessor
     * 2. Otherwise, generate default HTML with trade details
     * 3. Apply profitability colors (green for profit, red for loss)
     *
     * @private
     * @returns {string} HTML string for tooltip content
     *
     * @remarks
     * - Uses backend-provided isProfitable flag (no frontend calculations)
     * - Supports template placeholders like $$entry_price$$, $$pnl$$, etc.
     * - Spreads all trade data for maximum template flexibility
     */
    private createTooltipContent;
    /**
     * Create tooltip CSS style
     */
    /**
     * Create tooltip CSS styling
     *
     * Generates inline CSS for the tooltip with a modern dark theme.
     * Merges base styles with any custom styles from tooltip options.
     *
     * @private
     * @returns {string} CSS string for tooltip styling
     */
    private createTooltipStyle;
    /**
     * Hit test to check if mouse coordinates are inside the trade rectangle
     *
     * Performs precise hit testing by converting trade data coordinates to
     * screen coordinates and checking if the mouse position falls within
     * the rectangle bounds (with tolerance buffer).
     *
     * Process:
     * 1. Convert trade times/prices to screen coordinates
     * 2. Calculate rectangle bounds (left, right, top, bottom)
     * 3. Add 2px tolerance buffer for easier interaction
     * 4. Check if mouse (x, y) is within expanded bounds
     *
     * @param {number} x - Mouse X coordinate (screen pixels)
     * @param {number} y - Mouse Y coordinate (screen pixels)
     * @returns {PrimitiveHoveredItem | null} Hit result or null if not hit
     *
     * @remarks
     * - Returns null if chart/series not available
     * - Returns null if coordinate conversion fails
     * - Uses 2px tolerance buffer for better UX
     * - Silently catches and handles any conversion errors
     */
    hitTest(x: number, y: number): PrimitiveHoveredItem | null;
    /**
     * Handle crosshair move events for tooltip display
     *
     * Called whenever the crosshair moves on the chart. Performs hit testing
     * to determine if the crosshair is over this trade rectangle and requests/hides
     * the tooltip accordingly via the TooltipManager.
     *
     * Process:
     * 1. Validate tooltip is enabled and crosshair point is valid
     * 2. Perform hit test with current crosshair position
     * 3. If hit, request tooltip with content/style
     * 4. If not hit, hide tooltip
     *
     * @private
     * @param {any} param - Crosshair move event parameter with point property
     *
     * @remarks
     * - Returns early if tooltips are disabled
     * - Validates point coordinates are numbers before hit testing
     * - Uses TooltipManager for decoupled tooltip display
     * - Catches and logs hit test errors to prevent tooltip flickering
     */
    private handleCrosshairMove;
    /**
     * Lifecycle: Primitive attached to series
     *
     * Called by Lightweight Charts when this primitive is attached to a series.
     * Sets up chart/series references and subscribes to chart events for
     * coordinate updates and tooltip interactions.
     *
     * Event subscriptions:
     * - Time scale changes (for coordinate re-calculation on pan/zoom)
     * - Crosshair moves (for tooltip display on hover)
     *
     * @param {{ chart: IChartApi; series: ISeriesApi<any>; requestUpdate: () => void }} params
     *   - chart: Chart API reference
     *   - series: Series API reference
     *   - requestUpdate: Callback to request view update
     *
     * @remarks
     * - Stores callbacks for cleanup in detached()
     * - Triggers initial coordinate calculation
     */
    attached({ chart, series, requestUpdate, }: {
        chart: IChartApi;
        series: ISeriesApi<any>;
        requestUpdate: () => void;
    }): void;
    /**
     * Lifecycle: Primitive detached from series
     *
     * Called by Lightweight Charts when this primitive is detached from a series.
     * Performs cleanup to prevent memory leaks:
     * - Hides any active tooltips
     * - Unsubscribes from chart events
     * - Clears API references
     *
     * @remarks
     * - Critical for preventing memory leaks
     * - Errors during cleanup are logged but don't throw
     * - Nulls out all callbacks and references
     */
    detached(): void;
    /**
     * Get trade rectangle data
     *
     * @returns {TradeRectangleData} The trade data for this rectangle
     */
    data(): TradeRectangleData;
    /**
     * Get chart API reference
     *
     * @returns {IChartApi | null} Chart API or null if not attached
     */
    chart(): IChartApi | null;
    /**
     * Get series API reference
     *
     * @returns {ISeriesApi<any> | null} Series API or null if not attached
     */
    series(): ISeriesApi<any> | null;
    /**
     * Update trade rectangle data
     *
     * Updates the trade data and requests a view update to reflect the changes.
     * Merges new data with existing data, allowing partial updates.
     *
     * @param {Partial<TradeRectangleData>} newData - Partial trade data to update
     *
     * @example
     * ```typescript
     * // Update only colors to reflect new profitability
     * primitive.updateData({
     *   fillColor: 'rgba(76, 175, 80, 0.1)',
     *   borderColor: '#4CAF50',
     *   isProfitable: true
     * });
     * ```
     */
    updateData(newData: Partial<TradeRectangleData>): void;
}
/**
 * Factory function for creating trade rectangle primitives
 *
 * Converts an array of trade data into TradeRectanglePrimitive instances
 * with appropriate styling based on profitability. This is a convenience
 * function for bulk creation of trade rectangles.
 *
 * Process:
 * 1. For each trade, calculate profitability
 * 2. Apply colors based on profit/loss
 * 3. Create TradeRectangleData with all required fields
 * 4. Instantiate TradeRectanglePrimitive with data and tooltip options
 *
 * @export
 * @param {Array<TradeInput>} trades - Array of trade objects with entry/exit data
 * @param {TradeRectangleTooltipOptions} [tooltipOptions] - Optional tooltip configuration
 * @returns {TradeRectanglePrimitive[]} Array of primitives ready to attach to series
 *
 * @example
 * ```typescript
 * const trades = [
 *   {
 *     entryTime: '2024-01-01',
 *     exitTime: '2024-01-02',
 *     entryPrice: 100,
 *     exitPrice: 105,
 *     isProfitable: true
 *   }
 * ];
 *
 * const primitives = createTradeRectanglePrimitives(trades, {
 *   enabled: true,
 *   priority: 10
 * });
 *
 * primitives.forEach(p => series.attachPrimitive(p));
 * ```
 */
export declare function createTradeRectanglePrimitives(trades: Array<{
    entryTime: string | UTCTimestamp;
    exitTime?: string | UTCTimestamp;
    entryPrice: number;
    exitPrice: number;
    fillColor?: string;
    borderColor?: string;
    borderWidth?: number;
    opacity?: number;
    label?: string;
}>, chartData?: any[], tooltipOptions?: TradeRectangleTooltipOptions): TradeRectanglePrimitive[];
export {};
//# sourceMappingURL=TradeRectanglePrimitive.d.ts.map