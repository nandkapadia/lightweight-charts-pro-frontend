import { t as LayoutSpacing, C as ChartCoordinateService } from "./SingletonBase-MBQ3miuj.js";
import { K as KeyedSingletonManager, a as createInstanceKey, c as cleanupInstance } from "./Disposable-BRvCF1V2.js";
class CornerLayoutManager extends KeyedSingletonManager {
  constructor(chartId, paneId) {
    super();
    this.config = {
      edgePadding: LayoutSpacing.EDGE_PADDING,
      widgetGap: LayoutSpacing.WIDGET_GAP,
      baseZIndex: LayoutSpacing.BASE_Z_INDEX
    };
    this.cornerStates = {
      "top-left": { widgets: [], totalHeight: 0, totalWidth: 0 },
      "top-right": { widgets: [], totalHeight: 0, totalWidth: 0 },
      "bottom-left": { widgets: [], totalHeight: 0, totalWidth: 0 },
      "bottom-right": { widgets: [], totalHeight: 0, totalWidth: 0 }
    };
    this.chartDimensions = {
      container: { width: 0, height: 0 },
      axis: {
        priceScale: {
          left: { width: 0, height: 0 },
          right: { width: 0, height: 0 }
        },
        timeScale: { width: 0, height: 0 }
      }
    };
    this.events = {};
    this.chartApi = null;
    this.chartId = chartId;
    this.coordinateService = ChartCoordinateService.getInstance();
    this.paneId = paneId;
  }
  static getInstance(chartId, paneId) {
    const key = createInstanceKey(chartId, "pane", paneId);
    return KeyedSingletonManager.getOrCreateInstance(
      "CornerLayoutManager",
      key,
      () => new CornerLayoutManager(chartId || "default", paneId || 0)
    );
  }
  static cleanup(chartId, paneId) {
    if (paneId !== void 0) {
      const key = createInstanceKey(chartId, "pane", paneId);
      KeyedSingletonManager.destroyInstanceByKey("CornerLayoutManager", key);
    } else {
      const allKeys = KeyedSingletonManager.getInstanceKeys("CornerLayoutManager");
      const keysToDelete = allKeys.filter((key) => key.startsWith(`${chartId}-pane-`));
      keysToDelete.forEach((key) => {
        KeyedSingletonManager.destroyInstanceByKey("CornerLayoutManager", key);
      });
    }
  }
  /**
   * Configure layout settings
   */
  configure(config) {
    this.config = { ...this.config, ...config };
    this.recalculateAllLayouts();
  }
  /**
   * Set chart API reference for pane coordinate calculations
   */
  setChartApi(chartApi) {
    this.chartApi = chartApi;
    this.recalculateAllLayouts();
  }
  /**
   * Set event handlers
   */
  on(events) {
    this.events = { ...this.events, ...events };
  }
  /**
   * Update chart dimensions and recalculate layouts
   */
  updateChartDimensions(dimensions) {
    this.chartDimensions.container = dimensions;
    this.recalculateAllLayouts();
  }
  /**
   * Update chart dimensions immediately from chart element (for fast resize)
   */
  updateChartDimensionsFromElement() {
    if (this.chartApi) {
      try {
        const chartElement = this.chartApi.chartElement();
        if (chartElement) {
          const rect = chartElement.getBoundingClientRect();
          this.chartDimensions.container = {
            width: rect.width || chartElement.offsetWidth || 800,
            height: rect.height || chartElement.offsetHeight || 600
          };
          this.recalculateAllLayouts();
        }
      } catch {
      }
    }
  }
  /**
   * Update chart layout with axis dimensions and recalculate layouts
   */
  updateChartLayout(dimensions) {
    this.chartDimensions = dimensions;
    this.recalculateAllLayouts();
  }
  /**
   * Register a widget for positioning management
   */
  registerWidget(widget) {
    const corner = widget.corner;
    const state = this.cornerStates[corner];
    this.unregisterWidget(widget.id);
    state.widgets.push(widget);
    state.widgets.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return 0;
    });
    this.recalculateCornerLayout(corner);
  }
  /**
   * Unregister a widget
   */
  unregisterWidget(widgetId) {
    for (const corner of Object.keys(this.cornerStates)) {
      const state = this.cornerStates[corner];
      const initialLength = state.widgets.length;
      state.widgets = state.widgets.filter((w) => w.id !== widgetId);
      if (state.widgets.length !== initialLength) {
        this.recalculateCornerLayout(corner);
        break;
      }
    }
  }
  /**
   * Update widget visibility and recalculate layout
   */
  updateWidgetVisibility(widgetId, visible) {
    for (const corner of Object.keys(this.cornerStates)) {
      const state = this.cornerStates[corner];
      const widget = state.widgets.find((w) => w.id === widgetId);
      if (widget && widget.visible !== visible) {
        widget.visible = visible;
        this.recalculateCornerLayout(corner);
        break;
      }
    }
  }
  /**
   * Get the calculated position for a specific widget
   */
  getWidgetPosition(widgetId) {
    for (const corner of Object.keys(this.cornerStates)) {
      const state = this.cornerStates[corner];
      const widgetIndex = state.widgets.findIndex((w) => w.id === widgetId && w.visible);
      if (widgetIndex !== -1) {
        return this.calculateWidgetPosition(corner, widgetIndex, state.widgets[widgetIndex]);
      }
    }
    return null;
  }
  /**
   * Recalculate layouts for all corners
   */
  recalculateAllLayouts() {
    for (const corner of Object.keys(this.cornerStates)) {
      this.recalculateCornerLayout(corner);
    }
  }
  /**
   * Recalculate layout for a specific corner
   */
  recalculateCornerLayout(corner) {
    const state = this.cornerStates[corner];
    const visibleWidgets = state.widgets.filter((w) => w.visible);
    state.totalHeight = this.calculateTotalHeight(visibleWidgets);
    state.totalWidth = this.calculateTotalWidth(visibleWidgets);
    const overflowingWidgets = this.detectOverflow(corner, visibleWidgets);
    if (overflowingWidgets.length > 0 && this.events.onOverflow) {
      this.events.onOverflow(corner, overflowingWidgets);
    }
    visibleWidgets.forEach((widget, index) => {
      const position = this.calculateWidgetPosition(corner, index, widget);
      widget.updatePosition(position);
    });
    if (this.events.onLayoutChanged) {
      this.events.onLayoutChanged(corner, visibleWidgets);
    }
  }
  /**
   * Calculate position for a widget at specific index in corner
   * OPTIMIZED: Direct synchronous calculation for immediate resize performance
   */
  calculateWidgetPosition(corner, index, widget) {
    const visibleWidgets = this.cornerStates[corner].widgets.filter((w) => w.visible);
    const widgetsBeforeThis = visibleWidgets.slice(0, index);
    let cumulativeHeight = 0;
    for (let i = 0; i < widgetsBeforeThis.length; i++) {
      const prevWidget = widgetsBeforeThis[i];
      cumulativeHeight += prevWidget.getDimensions().height;
      cumulativeHeight += this.config.widgetGap;
    }
    let top, left;
    if (this.chartApi) {
      const paneCoords = this.coordinateService.getPaneCoordinates(this.chartApi, this.paneId);
      if (paneCoords) {
        const widgetDimensions2 = widget.getDimensions();
        const bounds = {
          top: paneCoords.y,
          left: paneCoords.x,
          right: paneCoords.x + paneCoords.width,
          bottom: paneCoords.y + paneCoords.height
        };
        switch (corner) {
          case "top-left":
            top = bounds.top + this.config.edgePadding + cumulativeHeight;
            left = bounds.left + this.config.edgePadding;
            break;
          case "top-right":
            top = bounds.top + this.config.edgePadding + cumulativeHeight;
            left = bounds.right - widgetDimensions2.width - this.config.edgePadding;
            break;
          case "bottom-left":
            top = bounds.bottom - this.config.edgePadding - this.calculateTotalHeight(visibleWidgets) + cumulativeHeight;
            left = bounds.left + this.config.edgePadding;
            break;
          case "bottom-right":
            top = bounds.bottom - this.config.edgePadding - this.calculateTotalHeight(visibleWidgets) + cumulativeHeight;
            left = bounds.right - widgetDimensions2.width - this.config.edgePadding;
            break;
          default:
            top = bounds.top + this.config.edgePadding;
            left = bounds.left + this.config.edgePadding;
        }
        return {
          top,
          left,
          zIndex: this.config.baseZIndex + index
        };
      }
    }
    const containerWidth = this.chartDimensions.container.width || 800;
    const containerHeight = this.chartDimensions.container.height || 600;
    const widgetDimensions = widget.getDimensions();
    switch (corner) {
      case "top-left":
        top = this.config.edgePadding + cumulativeHeight;
        left = this.config.edgePadding;
        break;
      case "top-right":
        top = this.config.edgePadding + cumulativeHeight;
        left = containerWidth - widgetDimensions.width - this.config.edgePadding;
        break;
      case "bottom-left":
        top = containerHeight - this.config.edgePadding - this.calculateTotalHeight(visibleWidgets) + cumulativeHeight;
        left = this.config.edgePadding;
        break;
      case "bottom-right":
        top = containerHeight - this.config.edgePadding - this.calculateTotalHeight(visibleWidgets) + cumulativeHeight;
        left = containerWidth - widgetDimensions.width - this.config.edgePadding;
        break;
      default:
        top = this.config.edgePadding;
        left = this.config.edgePadding;
    }
    return {
      top,
      left,
      zIndex: this.config.baseZIndex + index
    };
  }
  /**
   * Calculate total height needed for all widgets in corner
   */
  calculateTotalHeight(widgets) {
    if (widgets.length === 0) return 0;
    const totalWidgetHeight = widgets.reduce((sum, widget) => {
      return sum + widget.getDimensions().height;
    }, 0);
    const totalGaps = Math.max(0, widgets.length - 1) * this.config.widgetGap;
    const totalPadding = this.config.edgePadding * 2;
    return totalWidgetHeight + totalGaps + totalPadding;
  }
  /**
   * Calculate total width needed for all widgets in corner
   */
  calculateTotalWidth(widgets) {
    if (widgets.length === 0) return 0;
    const maxWidgetWidth = Math.max(...widgets.map((w) => w.getDimensions().width));
    return maxWidgetWidth + this.config.edgePadding * 2;
  }
  /**
   * Detect widgets that would overflow the chart area
   * OPTIMIZED: Direct synchronous overflow detection for immediate resize performance
   */
  detectOverflow(corner, widgets) {
    const overflowingWidgets = [];
    const containerWidth = this.chartDimensions.container.width || 800;
    const containerHeight = this.chartDimensions.container.height || 600;
    widgets.forEach((widget, index) => {
      const position = this.calculateWidgetPosition(corner, index, widget);
      const dimensions = widget.getDimensions();
      const left = position.left ?? 0;
      const top = position.top ?? 0;
      const rightEdge = left + dimensions.width;
      const bottomEdge = top + dimensions.height;
      if (rightEdge > containerWidth || bottomEdge > containerHeight || left < 0 || top < 0) {
        overflowingWidgets.push(widget);
      }
    });
    return overflowingWidgets;
  }
  /**
   * Get the chart ID this layout manager is associated with
   */
  getChartId() {
    return this.chartId;
  }
  /**
   * Cleanup instance resources
   */
  destroy() {
    Object.keys(this.cornerStates).forEach((corner) => {
      this.cornerStates[corner].widgets = [];
      this.cornerStates[corner].totalHeight = 0;
      this.cornerStates[corner].totalWidth = 0;
    });
    this.events = {};
    cleanupInstance(this, ["chartApi", "coordinateService", "config"]);
  }
}
const _PrimitiveEventManager = class _PrimitiveEventManager {
  constructor(chartId) {
    this.chart = null;
    this.eventListeners = /* @__PURE__ */ new Map();
    this.chartEventCleanup = [];
    this._isDestroyed = false;
    this.lastCrosshairPosition = null;
    this.chartId = chartId;
  }
  /**
   * Get or create event manager for a chart
   */
  static getInstance(chartId) {
    if (!_PrimitiveEventManager.instances.has(chartId)) {
      _PrimitiveEventManager.instances.set(chartId, new _PrimitiveEventManager(chartId));
    }
    const instance = _PrimitiveEventManager.instances.get(chartId);
    if (!instance) {
      throw new Error(`PrimitiveEventManager instance not found for chartId: ${chartId}`);
    }
    return instance;
  }
  /**
   * Clean up event manager for a chart
   */
  static cleanup(chartId) {
    const instance = _PrimitiveEventManager.instances.get(chartId);
    if (instance) {
      instance.destroy();
      _PrimitiveEventManager.instances.delete(chartId);
    }
  }
  /**
   * Initialize with chart API
   */
  initialize(chart) {
    if (this._isDestroyed) {
      throw new Error("Cannot initialize destroyed PrimitiveEventManager");
    }
    this.chart = chart;
    this.setupChartEventListeners();
  }
  /**
   * Subscribe to primitive event
   */
  subscribe(eventType, listener) {
    if (this._isDestroyed) {
      throw new Error("Cannot subscribe to destroyed PrimitiveEventManager");
    }
    const eventKey = eventType;
    if (!this.eventListeners.has(eventKey)) {
      this.eventListeners.set(eventKey, /* @__PURE__ */ new Set());
    }
    const listeners = this.eventListeners.get(eventKey);
    const internalListener = listener;
    if (listeners) {
      listeners.add(internalListener);
    }
    return {
      unsubscribe: () => {
        const listeners2 = this.eventListeners.get(eventKey);
        if (listeners2) {
          listeners2.delete(internalListener);
          if (listeners2.size === 0) {
            this.eventListeners.delete(eventKey);
          }
        }
      }
    };
  }
  /**
   * Emit event to subscribers
   */
  emit(eventType, event) {
    if (this._isDestroyed) {
      return;
    }
    const eventKey = eventType;
    const listeners = this.eventListeners.get(eventKey);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch {
        }
      });
    }
  }
  /**
   * Setup chart event listeners
   */
  setupChartEventListeners() {
    if (!this.chart) return;
    let lastCrosshairUpdate = 0;
    const crosshairThrottleDelay = 16;
    const crosshairMoveHandler = (param) => {
      const now = Date.now();
      if (now - lastCrosshairUpdate >= crosshairThrottleDelay) {
        lastCrosshairUpdate = now;
        this.handleCrosshairMove(param);
      }
    };
    this.chart.subscribeCrosshairMove(crosshairMoveHandler);
    this.chartEventCleanup.push(() => {
      if (this.chart) {
        this.chart.unsubscribeCrosshairMove(crosshairMoveHandler);
      }
    });
    const clickHandler = (param) => {
      this.handleChartClick(param);
    };
    this.chart.subscribeClick(clickHandler);
    this.chartEventCleanup.push(() => {
      if (this.chart) {
        this.chart.unsubscribeClick(clickHandler);
      }
    });
    let lastTimeScaleUpdate = 0;
    const timeScaleThrottleDelay = 16;
    const timeScaleHandler = () => {
      const now = Date.now();
      if (now - lastTimeScaleUpdate >= timeScaleThrottleDelay) {
        lastTimeScaleUpdate = now;
        this.handleTimeScaleChange();
      }
    };
    this.chart.timeScale().subscribeVisibleTimeRangeChange(timeScaleHandler);
    this.chartEventCleanup.push(() => {
      if (this.chart) {
        const timeScale = this.chart.timeScale();
        if (timeScale) {
          timeScale.unsubscribeVisibleTimeRangeChange(timeScaleHandler);
        }
      }
    });
    this.setupResizeObserver();
  }
  /**
   * Handle crosshair move events
   */
  handleCrosshairMove(param) {
    const time = param.time ?? null;
    const point = param.point ?? null;
    const seriesData = /* @__PURE__ */ new Map();
    if (param.seriesData) {
      param.seriesData.forEach((data, series) => {
        seriesData.set(series, data);
      });
    }
    this.lastCrosshairPosition = { time, point };
    this.emit("crosshairMove", {
      time,
      point,
      seriesData
    });
    if (point && time) {
      this.emit("hover", {
        time,
        point,
        seriesData
      });
    }
  }
  /**
   * Handle chart click events
   */
  handleChartClick(param) {
    const time = param.time ?? null;
    const point = param.point ?? null;
    if (!point || !time) return;
    const seriesData = /* @__PURE__ */ new Map();
    if (param.seriesData) {
      param.seriesData.forEach((data, series) => {
        seriesData.set(series, data);
      });
    }
    this.emit("click", {
      time,
      point,
      seriesData
    });
  }
  /**
   * Handle time scale changes
   */
  handleTimeScaleChange() {
    if (!this.chart) return;
    const visibleRange = this.chart.timeScale().getVisibleRange();
    if (visibleRange) {
      this.emit("timeScaleChange", {
        from: visibleRange.from,
        to: visibleRange.to
      });
    }
  }
  /**
   * Setup resize observer for chart container
   */
  setupResizeObserver() {
    if (!this.chart) return;
    const chartElement = this.chart.chartElement();
    if (!chartElement || !window.ResizeObserver) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.emit("resize", { width, height });
      }
    });
    resizeObserver.observe(chartElement);
    this.chartEventCleanup.push(() => resizeObserver.disconnect());
  }
  /**
   * Emit primitive visibility change event
   */
  emitVisibilityChange(primitiveId, visible) {
    this.emit("visibilityChange", { primitiveId, visible });
  }
  /**
   * Emit primitive configuration change event
   */
  emitConfigChange(primitiveId, config) {
    this.emit("configChange", { primitiveId, config });
  }
  /**
   * Emit custom primitive event
   */
  emitCustomEvent(eventType, data) {
    this.emit("custom", { eventType, data });
  }
  /**
   * Get current crosshair position
   */
  getCurrentCrosshairPosition() {
    return this.lastCrosshairPosition;
  }
  /**
   * Get chart API reference
   */
  getChart() {
    return this.chart;
  }
  /**
   * Get chart ID
   */
  getChartId() {
    return this.chartId;
  }
  /**
   * Check if event manager is destroyed
   */
  isDestroyed() {
    return this._isDestroyed;
  }
  /**
   * Get event listener count for debugging
   */
  getEventListenerCount() {
    const counts = {};
    this.eventListeners.forEach((listeners, eventType) => {
      counts[eventType] = listeners.size;
    });
    return counts;
  }
  /**
   * Destroy event manager
   */
  destroy() {
    if (this._isDestroyed) return;
    this.chartEventCleanup.forEach((cleanup) => {
      try {
        cleanup();
      } catch {
      }
    });
    this.chartEventCleanup = [];
    this.eventListeners.clear();
    this.chart = null;
    this.lastCrosshairPosition = null;
    this._isDestroyed = true;
  }
};
_PrimitiveEventManager.instances = /* @__PURE__ */ new Map();
let PrimitiveEventManager = _PrimitiveEventManager;
export {
  CornerLayoutManager as C,
  PrimitiveEventManager as P
};
//# sourceMappingURL=PrimitiveEventManager-D3Jlw88f.js.map
