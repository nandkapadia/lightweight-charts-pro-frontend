/**
 * TooltipPlugin - Pure DOM renderer for tooltips
 *
 * Design Philosophy:
 * - Pure rendering concern only
 * - Receives pre-rendered content from plugins
 * - Applies styles provided by plugins
 * - Positions using ChartCoordinateService
 * - Does NOT decide what to show (TooltipManager decides)
 * - Does NOT format content (plugins provide HTML)
 * - Does NOT handle hit detection (plugins handle)
 *
 * Responsibilities:
 * - DOM element creation and management
 * - Content injection (innerHTML)
 * - Style application
 * - Position calculation and updates
 * - Show/hide with transitions
 *
 * @example
 * ```typescript
 * // Create tooltip renderer
 * const tooltipPlugin = new TooltipPlugin(container, 'chart-1');
 *
 * // TooltipManager will call these methods:
 * tooltipPlugin.show(
 *   '<div>My tooltip content</div>',
 *   'background: black; color: white;',
 *   { x: 100, y: 200 }
 * );
 * ```
 */
/**
 * TooltipPlugin - Pure DOM rendering layer for tooltips
 *
 * Implements the rendering side of the tooltip system. This class is solely
 * responsible for DOM manipulation (create, position, show, hide) and receives
 * all content and styling from the TooltipManager.
 *
 * Architecture:
 * - Rendering only (no business logic or hit detection)
 * - Managed by TooltipManager (registered on construction)
 * - Uses ChartCoordinateService for intelligent positioning
 * - Supports custom HTML content and CSS styling
 * - Handles smooth transitions (fade in/out)
 *
 * Responsibilities:
 * - Create and manage tooltip DOM element
 * - Inject HTML content provided by plugins
 * - Apply CSS styles provided by plugins
 * - Calculate optimal position (avoid viewport edges)
 * - Show/hide with smooth transitions
 * - Cleanup on destroy
 *
 * @export
 * @class TooltipPlugin
 *
 * @example
 * ```typescript
 * // Create tooltip plugin (auto-registers with TooltipManager)
 * const tooltipPlugin = new TooltipPlugin(chartContainer, 'chart-1');
 *
 * // TooltipManager calls show/hide automatically
 * // Plugins don't call this directly
 * ```
 */
export declare class TooltipPlugin {
    /** Container element (chart container) for tooltip */
    private container;
    /** Tooltip DOM element (lazy-created) */
    private tooltipElement;
    /** Coordinate service for positioning (lazy-initialized) */
    private _coordinateService;
    /** Timeout ID for hide animation - tracked for cleanup */
    private _hideTimeoutId;
    /**
     * Creates a new TooltipPlugin
     *
     * Initializes the plugin and automatically registers it with the
     * TooltipManager singleton. The tooltip DOM element is created lazily
     * on first show() call.
     *
     * @param {HTMLElement} container - Chart container element
     * @param {string} _chartId - Chart identifier (unused, for future use)
     *
     * @remarks
     * - Auto-registers with TooltipManager
     * - Tooltip element is not created until first use (lazy initialization)
     * - ChartCoordinateService is also lazy-initialized
     */
    constructor(container: HTMLElement, _chartId: string);
    /**
     * Lazy getter for ChartCoordinateService
     *
     * Returns the coordinate service singleton, initializing it on first access.
     * Lazy initialization avoids module loading order issues and improves startup time.
     *
     * @private
     * @returns {ChartCoordinateService} Coordinate service singleton
     * @throws {Error} If coordinate service fails to initialize
     *
     * @remarks
     * - Uses createSingleton utility for lazy initialization
     * - Throws error if initialization fails (should never happen)
     * - Cached after first access
     */
    private get coordinateService();
    /**
     * Show tooltip with pre-rendered content
     *
     * @param content - HTML content (plugin provides)
     * @param style - CSS styles (plugin provides)
     * @param position - Mouse position
     * @param cssClasses - Optional CSS classes
     */
    show(content: string, style: string | Partial<CSSStyleDeclaration>, position: {
        x: number;
        y: number;
    }, cssClasses?: string[]): void;
    /**
     * Hide tooltip with fade-out transition
     *
     * Sets opacity to 0 for fade-out effect, then hides element after animation
     * completes (150ms delay).
     *
     * @remarks
     * - Fade-out duration: 150ms (matches CSS transition)
     * - Display is set to 'none' after fade completes
     * - Safe to call even if tooltip is already hidden
     */
    hide(): void;
    /**
     * Create minimal tooltip element
     */
    private ensureTooltipElement;
    /**
     * Apply styles provided by plugin
     */
    private applyStyle;
    /**
     * Position tooltip using ChartCoordinateService
     */
    private position;
    /**
     * Update tooltip position (for following cursor)
     */
    updatePosition(position: {
        x: number;
        y: number;
    }): void;
    /**
     * Cleanup and destroy tooltip
     */
    destroy(): void;
    /**
     * Remove tooltip (alias for destroy)
     */
    remove(): void;
}
//# sourceMappingURL=tooltipPlugin.d.ts.map