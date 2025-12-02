import { c as createSingleton, l as logger, C as ChartCoordinateService, U as UniversalSpacing } from "./SingletonBase-MBQ3miuj.js";
import { s as sanitizeHtml } from "./sanitization-HfsXpoG7.js";
import { T as TooltipManager } from "./TooltipManager-CDwk_ImJ.js";
import { ChartReadyDetector } from "./chartReadyDetection-DpyqN7co.js";
import { R as ResizeObserverManager } from "./resizeObserverManager-CDko58AG.js";
class TooltipPlugin {
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
  constructor(container, _chartId) {
    this.tooltipElement = null;
    this._coordinateService = null;
    this._hideTimeoutId = null;
    this.container = container;
    TooltipManager.getInstance().registerRenderer(this);
  }
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
  get coordinateService() {
    if (!this._coordinateService) {
      this._coordinateService = createSingleton(ChartCoordinateService);
    }
    if (!this._coordinateService) {
      throw new Error("Failed to initialize ChartCoordinateService");
    }
    return this._coordinateService;
  }
  /**
   * Show tooltip with pre-rendered content
   *
   * @param content - HTML content (plugin provides)
   * @param style - CSS styles (plugin provides)
   * @param position - Mouse position
   * @param cssClasses - Optional CSS classes
   */
  show(content, style, position, cssClasses) {
    try {
      if (!this.tooltipElement) {
        this.ensureTooltipElement();
      }
      if (!this.tooltipElement) {
        logger.warn("Failed to create tooltip element", "TooltipPlugin");
        return;
      }
      this.tooltipElement.innerHTML = sanitizeHtml(content);
      this.applyStyle(this.tooltipElement, style);
      if (cssClasses && cssClasses.length > 0) {
        this.tooltipElement.className = `lw-tooltip ${cssClasses.join(" ")}`;
      } else {
        this.tooltipElement.className = "lw-tooltip";
      }
      this.tooltipElement.style.display = "block";
      this.tooltipElement.style.opacity = "0";
      void this.tooltipElement.offsetHeight;
      this.position(position);
      requestAnimationFrame(() => {
        if (this.tooltipElement) {
          this.tooltipElement.style.opacity = "1";
        }
      });
    } catch (error) {
      logger.error("Failed to show tooltip", "TooltipPlugin", error);
    }
  }
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
  hide() {
    if (this.tooltipElement) {
      if (this._hideTimeoutId !== null) {
        clearTimeout(this._hideTimeoutId);
        this._hideTimeoutId = null;
      }
      this.tooltipElement.style.opacity = "0";
      this._hideTimeoutId = setTimeout(() => {
        if (this.tooltipElement) {
          this.tooltipElement.style.display = "none";
        }
        this._hideTimeoutId = null;
      }, 150);
    }
  }
  /**
   * Create minimal tooltip element
   */
  ensureTooltipElement() {
    if (this.tooltipElement) return;
    this.tooltipElement = document.createElement("div");
    this.tooltipElement.className = "lw-tooltip";
    this.tooltipElement.style.cssText = `
        position: absolute;
        z-index: 1000;
        pointer-events: none;
        user-select: none;
      opacity: 0;
      transition: opacity 0.15s ease;
        display: none;
    `;
    this.container.appendChild(this.tooltipElement);
  }
  /**
   * Apply styles provided by plugin
   */
  applyStyle(element, style) {
    try {
      if (typeof style === "string") {
        const existingStyle = element.style.cssText;
        element.style.cssText = existingStyle + ";" + style;
      } else {
        Object.entries(style).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            element.style[key] = value;
          }
        });
      }
    } catch (error) {
      logger.error("Failed to apply tooltip style", "TooltipPlugin", error);
    }
  }
  /**
   * Position tooltip using ChartCoordinateService
   */
  position(point) {
    if (!this.tooltipElement) return;
    try {
      const containerBounds = this.container.getBoundingClientRect();
      const tooltipWidth = this.tooltipElement.offsetWidth || 200;
      const tooltipHeight = this.tooltipElement.offsetHeight || 100;
      const position = this.coordinateService.calculateTooltipPosition(
        point.x,
        point.y,
        tooltipWidth,
        tooltipHeight,
        {
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          right: containerBounds.width,
          bottom: containerBounds.height,
          width: containerBounds.width,
          height: containerBounds.height
        },
        "top"
        // Preferred anchor
      );
      this.coordinateService.applyPositionToElement(this.tooltipElement, {
        top: position.y,
        left: position.x
      });
    } catch (error) {
      logger.error("Failed to position tooltip", "TooltipPlugin", error);
    }
  }
  /**
   * Update tooltip position (for following cursor)
   */
  updatePosition(position) {
    if (this.tooltipElement && this.tooltipElement.style.display !== "none") {
      this.position(position);
    }
  }
  /**
   * Cleanup and destroy tooltip
   */
  destroy() {
    try {
      if (this._hideTimeoutId !== null) {
        clearTimeout(this._hideTimeoutId);
        this._hideTimeoutId = null;
      }
      if (this.tooltipElement && this.tooltipElement.parentNode) {
        this.tooltipElement.parentNode.removeChild(this.tooltipElement);
        this.tooltipElement = null;
      }
      TooltipManager.getInstance().unregisterRenderer();
      logger.info("TooltipPlugin destroyed", "TooltipPlugin");
    } catch (error) {
      logger.error("Failed to destroy TooltipPlugin", "TooltipPlugin", error);
    }
  }
  /**
   * Remove tooltip (alias for destroy)
   */
  remove() {
    this.destroy();
  }
}
class RectangleOverlayPlugin {
  constructor() {
    this.rectangles = [];
    this.chart = null;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.isDisposed = false;
    this.isInitialized = false;
    this.redrawTimeout = null;
    this.lastCanvasSize = { width: 0, height: 0 };
    this.resizeObserverManager = new ResizeObserverManager();
  }
  setChart(chart, _series) {
    this.chart = chart;
    void this.init();
  }
  // Public method for testing compatibility
  addToChart(chart) {
    this.setChart(chart);
  }
  remove() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.container = null;
    this.chart = null;
    this.isInitialized = false;
  }
  setRectangles(rectangles) {
    this.rectangles = rectangles;
    if (this.isInitialized) {
      this.render();
    }
  }
  render() {
    if (!this.canvas || !this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const ctx = this.ctx;
    this.rectangles.forEach((rect, _index) => {
      ctx.fillStyle = rect.color || "#000000";
      const x = Math.min(rect.x1, rect.x2);
      const y = Math.min(rect.y1, rect.y2);
      const width = Math.abs(rect.x2 - rect.x1);
      const height = Math.abs(rect.y2 - rect.y1);
      ctx.fillRect(x, y, width, height);
    });
  }
  async init() {
    if (!this.chart) return;
    try {
      const container = this.chart.chartElement();
      if (!container) {
        return;
      }
      const isReady = await ChartReadyDetector.waitForChartReady(this.chart, container, {
        minWidth: 200,
        minHeight: 200
      });
      if (!isReady) {
        return;
      }
      this.container = container;
      this.createCanvas();
      this.setupResizeObserver();
      this.setupEventListeners();
      this.isInitialized = true;
      if (this.rectangles.length > 0) {
        this.render();
      }
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  createCanvas() {
    if (!this.container) return;
    try {
      this.canvas = document.createElement("canvas");
      this.canvas.style.position = "absolute";
      this.canvas.style.top = "0";
      this.canvas.style.left = "0";
      this.canvas.style.pointerEvents = "none";
      const defaultZIndex = 20;
      this.canvas.style.zIndex = defaultZIndex.toString();
      if (this.container && this.container.style) {
        this.container.style.position = "relative";
        this.container.appendChild(this.canvas);
      }
      this.ctx = this.canvas.getContext("2d");
      if (!this.ctx) {
        throw new Error("Failed to get canvas context");
      }
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  setupResizeObserver() {
    if (!this.container || !this.canvas) return;
    this.resizeObserverManager.addObserver(
      "rectangle-plugin",
      this.container,
      (entry) => {
        if (this.isDisposed) return;
        const entries = Array.isArray(entry) ? entry : [entry];
        entries.forEach((singleEntry) => {
          const { width, height } = singleEntry.contentRect;
          if (width > 100 && height > 100) {
            void this.handleResize();
          }
        });
      },
      { throttleMs: 100, debounceMs: 50 }
    );
  }
  setupEventListeners() {
    if (!this.chart) return;
    try {
      let lastRedrawSchedule = 0;
      const redrawThrottleDelay = 16;
      this.chart.timeScale().subscribeVisibleTimeRangeChange(() => {
        if (!this.isDisposed) {
          const now = Date.now();
          if (now - lastRedrawSchedule >= redrawThrottleDelay) {
            lastRedrawSchedule = now;
            this.scheduleRedraw();
          }
        }
      });
      this.chart.subscribeCrosshairMove(() => {
        if (!this.isDisposed) {
          this.scheduleRedraw();
        }
      });
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  async resizeCanvas() {
    if (!this.canvas || !this.container || !this.chart) return;
    try {
      const coordinateService = ChartCoordinateService.getInstance();
      const dimensions = await coordinateService.getChartDimensionsWithFallback(
        this.chart,
        this.container,
        { minWidth: 200, minHeight: 200 }
      );
      const { width, height } = dimensions.container;
      if (width !== this.lastCanvasSize.width || height !== this.lastCanvasSize.height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.lastCanvasSize = { width, height };
        this.scheduleRedraw();
      }
    } catch {
      this.fallbackResizeCanvas();
    }
  }
  fallbackResizeCanvas() {
    if (!this.canvas || !this.container) return;
    try {
      let width = 0;
      let height = 0;
      try {
        const rect = this.container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      } catch {
        width = this.container.offsetWidth;
        height = this.container.offsetHeight;
      }
      if (!width || !height) {
        width = this.container.offsetWidth || 800;
        height = this.container.offsetHeight || 600;
      }
      if ((!width || !height) && this.chart) {
        try {
          const chartElement = this.chart.chartElement();
          if (chartElement) {
            const chartRect = chartElement.getBoundingClientRect();
            if (chartRect.width > 0 && chartRect.height > 0) {
              width = chartRect.width;
              height = chartRect.height;
            }
          }
        } catch {
        }
      }
      width = Math.max(width, 200);
      height = Math.max(height, 200);
      if (width !== this.lastCanvasSize.width || height !== this.lastCanvasSize.height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.lastCanvasSize = { width, height };
        this.scheduleRedraw();
      }
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  async handleResize() {
    if (this.isDisposed) return;
    try {
      await this.resizeCanvas();
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  scheduleRedraw() {
    if (this.redrawTimeout) {
      clearTimeout(this.redrawTimeout);
    }
    this.redrawTimeout = setTimeout(() => {
      if (!this.isDisposed) {
        this.redraw();
      }
    }, 16);
  }
  redraw() {
    if (!this.ctx || !this.canvas || this.isDisposed) return;
    try {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.rectangles.forEach((rect) => {
        this.drawRectangle(rect);
      });
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  drawRectangle(rect) {
    if (!this.ctx || !this.canvas) return;
    try {
      const { x1, y1, x2, y2, color, borderColor, borderWidth, fillOpacity, borderOpacity } = rect;
      const actualCoords = this.calculateActualCoordinates(x1, y1, x2, y2);
      if (!actualCoords) return;
      const { ax1, ay1, ax2, ay2 } = actualCoords;
      const rectX = Math.min(ax1, ax2);
      const rectY = Math.min(ay1, ay2);
      const rectWidth = Math.abs(ax2 - ax1);
      const rectHeight = Math.abs(ay2 - ay1);
      this.ctx.fillStyle = color;
      if (fillOpacity !== void 0) {
        this.ctx.globalAlpha = fillOpacity;
      }
      this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      this.ctx.globalAlpha = 1;
      if (borderColor && borderWidth) {
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderWidth;
        if (borderOpacity !== void 0) {
          this.ctx.globalAlpha = borderOpacity;
        }
        this.ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        this.ctx.globalAlpha = 1;
      }
      if (rect.label) {
        this.drawLabel(rect, rectX, rectY, rectX + rectWidth, rectY + rectHeight);
      }
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  calculateActualCoordinates(x1, y1, x2, y2) {
    if (!this.chart || !this.canvas) return null;
    try {
      try {
      } catch (error) {
        logger.error("Rectangle operation failed", "RectangleOverlayPlugin", error);
      }
      return {
        ax1: x1,
        ay1: y1,
        ax2: x2,
        ay2: y2
      };
    } catch {
      return null;
    }
  }
  drawLabel(rect, x1, y1, x2, y2) {
    if (!this.ctx || !rect.label) return;
    try {
      const labelX = (x1 + x2) / 2;
      const labelY = Math.min(y1, y2) - 10;
      this.ctx.font = `${rect.labelFontSize || 12}px Arial`;
      this.ctx.fillStyle = rect.labelColor || "#000000";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "bottom";
      if (rect.labelBackground) {
        const textMetrics = this.ctx.measureText(rect.label);
        const padding = rect.labelPadding || UniversalSpacing.DEFAULT_PADDING;
        const bgWidth = textMetrics.width + padding * 2;
        const bgHeight = (rect.labelFontSize || 12) + padding * 2;
        this.ctx.fillStyle = rect.labelBackground;
        this.ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight + padding, bgWidth, bgHeight);
        this.ctx.fillStyle = rect.labelColor || "#000000";
      }
      this.ctx.fillText(rect.label, labelX, labelY);
    } catch (error) {
      logger.error("Rectangle overlay operation failed", "RectangleOverlayPlugin", error);
    }
  }
  /**
   * Update canvas Z-index based on the highest Z-index of all rectangles
   * Default Z-index is 20 if no rectangles have Z-index specified
   */
  updateCanvasZIndex() {
    if (!this.canvas) return;
    const defaultZIndex = 20;
    let maxZIndex = defaultZIndex;
    for (const rect of this.rectangles) {
      if (rect.zIndex !== void 0 && rect.zIndex > maxZIndex) {
        maxZIndex = rect.zIndex;
      }
    }
    this.canvas.style.zIndex = maxZIndex.toString();
  }
  addRectangle(rect) {
    this.rectangles.push(rect);
    this.updateCanvasZIndex();
    this.scheduleRedraw();
  }
  removeRectangle(id) {
    const index = this.rectangles.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.rectangles.splice(index, 1);
      this.updateCanvasZIndex();
      this.scheduleRedraw();
    }
  }
  updateRectangle(id, updates) {
    const rect = this.rectangles.find((r) => r.id === id);
    if (rect) {
      Object.assign(rect, updates);
      this.updateCanvasZIndex();
      this.scheduleRedraw();
    }
  }
  clearRectangles() {
    this.rectangles = [];
    this.updateCanvasZIndex();
    this.scheduleRedraw();
  }
  getRectangles() {
    return [...this.rectangles];
  }
  dispose() {
    this.isDisposed = true;
    this.resizeObserverManager.cleanup();
    if (this.redrawTimeout) {
      clearTimeout(this.redrawTimeout);
      this.redrawTimeout = null;
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.chart = null;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.rectangles = [];
  }
}
export {
  RectangleOverlayPlugin as R,
  TooltipPlugin as T
};
//# sourceMappingURL=rectanglePlugin-BJ1xCgeR.js.map
