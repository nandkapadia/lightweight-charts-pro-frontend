"use strict";
const sanitization = require("./sanitization-oV4kM94W.cjs");
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
const _TooltipManager = class _TooltipManager {
  /**
   * Private constructor (Singleton pattern)
   *
   * Initializes event emitter with increased max listeners to support
   * many concurrent primitives/plugins.
   *
   * @private
   */
  constructor() {
    this.activeRequests = /* @__PURE__ */ new Map();
    this.currentTooltip = null;
    this.renderer = null;
    this.rafId = null;
    this.eventEmitter = new sanitization.EventEmitter();
    this.eventEmitter.setMaxListeners(50);
  }
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
  static getInstance() {
    if (!_TooltipManager.instance) {
      _TooltipManager.instance = new _TooltipManager();
    }
    return _TooltipManager.instance;
  }
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
  registerRenderer(renderer) {
    this.renderer = renderer;
    SingletonBase.logger.info("TooltipRenderer registered", "TooltipManager");
  }
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
  unregisterRenderer() {
    if (this.renderer) {
      SingletonBase.logger.info("TooltipRenderer unregistered", "TooltipManager");
      this.renderer = null;
    }
  }
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
  requestTooltip(request) {
    if (!request.source || !request.content) {
      SingletonBase.logger.warn("Invalid tooltip request: missing source or content", "TooltipManager");
      return;
    }
    this.activeRequests.set(request.source, request);
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.processRequests();
        this.rafId = null;
      });
    }
  }
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
  hideTooltip(source) {
    const wasActive = this.activeRequests.has(source);
    this.activeRequests.delete(source);
    if (this.currentTooltip?.source === source && this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.processRequests();
        this.rafId = null;
      });
    } else if (wasActive && this.activeRequests.size === 0 && this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        this.processRequests();
        this.rafId = null;
      });
    }
  }
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
  processRequests() {
    this.rafId = null;
    if (this.activeRequests.size === 0) {
      this.hideCurrentTooltip();
      return;
    }
    let highestPriority = null;
    for (const [, request] of this.activeRequests) {
      if (!highestPriority || request.priority > highestPriority.priority) {
        highestPriority = request;
      } else if (request.priority === highestPriority.priority && request.source < highestPriority.source) {
        highestPriority = request;
      }
    }
    if (highestPriority && highestPriority.source !== this.currentTooltip?.source) {
      this.showTooltip(highestPriority);
    }
  }
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
  showTooltip(request) {
    if (!this.renderer) {
      SingletonBase.logger.warn("No tooltip renderer registered", "TooltipManager");
      return;
    }
    this.currentTooltip = request;
    try {
      this.renderer.show(request.content, request.style, request.position, request.cssClasses);
      this.eventEmitter.emit("tooltip:shown", {
        source: request.source,
        timestamp: Date.now()
      });
    } catch (error) {
      SingletonBase.logger.error("Failed to show tooltip", "TooltipManager", error);
    }
  }
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
  hideCurrentTooltip() {
    if (this.renderer) {
      try {
        this.renderer.hide();
      } catch (error) {
        SingletonBase.logger.error("Failed to hide tooltip", "TooltipManager", error);
      }
    }
    if (this.currentTooltip) {
      this.eventEmitter.emit("tooltip:hidden", {
        source: this.currentTooltip.source,
        timestamp: Date.now()
      });
    }
    this.currentTooltip = null;
  }
  /**
   * Subscribe to tooltip lifecycle events
   *
   * @param event - Event name ('tooltip:shown' | 'tooltip:hidden')
   * @param callback - Callback function
   */
  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
  /**
   * Unsubscribe from events
   *
   * @param event - Event name
   * @param callback - Callback function to remove
   */
  off(event, callback) {
    this.eventEmitter.off(event, callback);
  }
  /**
   * Clear all active requests (e.g., on chart reset)
   */
  clearAll() {
    this.activeRequests.clear();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.hideCurrentTooltip();
  }
  /**
   * Get current tooltip source (for debugging)
   */
  getCurrentSource() {
    return this.currentTooltip?.source || null;
  }
  /**
   * Get all active sources (for debugging)
   */
  getActiveSources() {
    return Array.from(this.activeRequests.keys());
  }
  /**
   * Get active request count (for debugging)
   */
  getActiveCount() {
    return this.activeRequests.size;
  }
  /**
   * Check if a specific source has an active request
   */
  hasActiveRequest(source) {
    return this.activeRequests.has(source);
  }
  /**
   * Cleanup and reset manager (for testing)
   */
  destroy() {
    this.clearAll();
    this.unregisterRenderer();
    this.eventEmitter.removeAllListeners();
  }
  /**
   * Reset singleton instance (for testing only)
   * @internal
   */
  static resetInstance() {
    if (_TooltipManager.instance) {
      _TooltipManager.instance.destroy();
      _TooltipManager.instance = null;
    }
  }
};
_TooltipManager.instance = null;
let TooltipManager = _TooltipManager;
exports.TooltipManager = TooltipManager;
//# sourceMappingURL=TooltipManager-BQr3hh4S.cjs.map
