import { TooltipPlugin } from './tooltipPlugin';
/**
 * Tooltip request event data
 */
export interface TooltipRequestEvent {
    /** Source identifier (primitive ID, plugin name, etc.) */
    source: string;
    /** Priority (higher = takes precedence) */
    priority: number;
    /** Pre-rendered HTML content (plugin creates this) */
    content: string;
    /** Complete inline styles (plugin defines) */
    style: string | Partial<CSSStyleDeclaration>;
    /** Mouse position */
    position: {
        x: number;
        y: number;
    };
    /** Optional: Custom CSS classes */
    cssClasses?: string[];
}
/**
 * Tooltip shown event (for subscribers to react)
 */
export interface TooltipShownEvent {
    source: string;
    timestamp: number;
}
/**
 * Tooltip hidden event
 */
export interface TooltipHiddenEvent {
    source: string;
    timestamp: number;
}
/**
 * Singleton TooltipManager - Central coordinator for all tooltip display
 *
 * Acts as a mediator between tooltip requesters (primitives/plugins) and the
 * rendering system (TooltipPlugin). Manages priority conflicts, coordinates
 * multiple simultaneous requests, and emits lifecycle events.
 *
 * Architecture:
 * - Singleton pattern ensures single global coordinator
 * - Event-driven communication (extends EventEmitter)
 * - Priority-based conflict resolution (highest wins)
 * - RAF-based updates for optimal performance
 * - Completely decoupled from specific implementations
 *
 * Event Lifecycle:
 * 1. Primitive/plugin requests tooltip via requestTooltip()
 * 2. Manager stores request in activeRequests map
 * 3. Manager schedules RAF to process requests
 * 4. processRequests() selects highest priority request
 * 5. Delegates rendering to TooltipPlugin
 * 6. Emits 'tooltip:shown' or 'tooltip:hidden' events
 *
 * @export
 * @class TooltipManager
 * @extends {EventEmitter}
 *
 * @example
 * ```typescript
 * // Get singleton instance
 * const manager = TooltipManager.getInstance();
 *
 * // Subscribe to lifecycle events
 * manager.on('tooltip:shown', (event: TooltipShownEvent) => {
 *   console.log(`Tooltip shown from: ${event.source}`);
 * });
 *
 * // Request tooltip from a primitive
 * manager.requestTooltip({
 *   source: 'my-primitive',
 *   priority: 10,
 *   content: '<div>My tooltip</div>',
 *   style: 'background: black; color: white;',
 *   position: { x: 100, y: 200 }
 * });
 *
 * // Hide tooltip
 * manager.hideTooltip('my-primitive');
 * ```
 */
export declare class TooltipManager {
    /** Singleton instance (lazy initialized) */
    private static instance;
    /** Event emitter for pub-sub pattern (tooltip:shown, tooltip:hidden) */
    private eventEmitter;
    /** Active tooltip requests keyed by source identifier */
    private activeRequests;
    /** Currently displayed tooltip (null if hidden) */
    private currentTooltip;
    /** Reference to tooltip renderer plugin */
    private renderer;
    /** RAF ID for batched request processing (null if no RAF pending) */
    private rafId;
    /**
     * Private constructor (Singleton pattern)
     *
     * Initializes event emitter with increased max listeners to support
     * many concurrent primitives/plugins.
     *
     * @private
     */
    private constructor();
    /**
     * Get singleton instance (lazy initialization)
     *
     * Returns the global TooltipManager instance, creating it if it doesn't exist.
     * Thread-safe singleton pattern ensures only one manager exists globally.
     *
     * @static
     * @returns {TooltipManager} The singleton instance
     *
     * @example
     * ```typescript
     * const manager = TooltipManager.getInstance();
     * manager.requestTooltip({...});
     * ```
     */
    static getInstance(): TooltipManager;
    /**
     * Register tooltip renderer plugin
     *
     * Connects the rendering system (TooltipPlugin) to this manager.
     * Must be called before any tooltip requests will be displayed.
     *
     * @param {TooltipPlugin} renderer - TooltipPlugin instance to handle rendering
     *
     * @remarks
     * - Should be called once during chart initialization
     * - Logs registration for debugging
     * - Replaces any previously registered renderer
     */
    registerRenderer(renderer: TooltipPlugin): void;
    /**
     * Unregister tooltip renderer (cleanup)
     *
     * Removes the renderer reference during cleanup. Should be called
     * when the chart/component is being destroyed.
     *
     * @remarks
     * - Prevents memory leaks by clearing renderer reference
     * - Logs unregistration for debugging
     * - Safe to call even if no renderer is registered
     */
    unregisterRenderer(): void;
    /**
     * Request to show a tooltip
     *
     * @param request - Tooltip request with source, priority, content, style, position
     *
     * Multiple plugins can request tooltips simultaneously. The manager will:
     * 1. Store all active requests
     * 2. Select highest priority request
     * 3. Delegate rendering to TooltipPlugin
     *
     * Uses requestAnimationFrame for efficient, browser-synchronized updates.
     * This ensures tooltip updates are batched with the browser's render cycle
     * for optimal performance (typically 60fps).
     */
    requestTooltip(request: TooltipRequestEvent): void;
    /**
     * Hide tooltip from a specific source
     *
     * Removes the tooltip request from the specified source. If that source's
     * tooltip is currently displayed, schedules a reprocessing to either show
     * the next highest priority tooltip or hide the tooltip entirely.
     *
     * @param {string} source - Source identifier to hide tooltip from
     *
     * @remarks
     * - Uses RAF for smooth, synchronized hiding
     * - Only schedules RAF when actually needed (not if RAF already pending)
     * - Intelligently determines when to schedule based on tooltip state
     */
    hideTooltip(source: string): void;
    /**
     * Process all active requests and show highest priority tooltip
     *
     * Called via requestAnimationFrame to batch tooltip updates. Selects the
     * highest priority request from all active requests and delegates rendering
     * to the TooltipPlugin. If no requests are active, hides the tooltip.
     *
     * Priority resolution:
     * - Higher numeric priority wins
     * - If priorities are equal, lexicographic source order decides (for consistency)
     *
     * @private
     *
     * @remarks
     * - Only updates display if highest priority differs from current tooltip
     * - Prevents unnecessary DOM updates when tooltip doesn't change
     */
    private processRequests;
    /**
     * Show tooltip via renderer
     *
     * Delegates tooltip rendering to the TooltipPlugin and emits lifecycle events.
     * Updates currentTooltip tracking and handles rendering errors gracefully.
     *
     * @private
     * @param {TooltipRequestEvent} request - Tooltip request with content, style, position
     *
     * @remarks
     * - Emits 'tooltip:shown' event for monitoring
     * - Logs and catches rendering errors
     * - Updates currentTooltip before calling renderer
     */
    private showTooltip;
    /**
     * Hide current tooltip
     *
     * Hides the currently displayed tooltip via the renderer and emits a
     * lifecycle event. Handles errors gracefully and clears tooltip tracking.
     *
     * @private
     *
     * @remarks
     * - Emits 'tooltip:hidden' event with source and timestamp
     * - Logs and catches hiding errors
     * - Safe to call even if no tooltip is currently shown
     * - Clears currentTooltip reference
     */
    private hideCurrentTooltip;
    /**
     * Subscribe to tooltip lifecycle events
     *
     * @param event - Event name ('tooltip:shown' | 'tooltip:hidden')
     * @param callback - Callback function
     */
    on(event: 'tooltip:shown' | 'tooltip:hidden', callback: (data: any) => void): void;
    /**
     * Unsubscribe from events
     *
     * @param event - Event name
     * @param callback - Callback function to remove
     */
    off(event: 'tooltip:shown' | 'tooltip:hidden', callback: (data: any) => void): void;
    /**
     * Clear all active requests (e.g., on chart reset)
     */
    clearAll(): void;
    /**
     * Get current tooltip source (for debugging)
     */
    getCurrentSource(): string | null;
    /**
     * Get all active sources (for debugging)
     */
    getActiveSources(): string[];
    /**
     * Get active request count (for debugging)
     */
    getActiveCount(): number;
    /**
     * Check if a specific source has an active request
     */
    hasActiveRequest(source: string): boolean;
    /**
     * Cleanup and reset manager (for testing)
     */
    destroy(): void;
    /**
     * Reset singleton instance (for testing only)
     * @internal
     */
    static resetInstance(): void;
}
//# sourceMappingURL=TooltipManager.d.ts.map