import { D as DIMENSIONS, l as logger } from "../SingletonBase-U-nNeQaU.js";
import { C } from "../SingletonBase-U-nNeQaU.js";
import { C as C2, P } from "../PrimitiveEventManager-DHN3p0kt.js";
import { K as KeyedSingletonManager, c as cleanupInstance } from "../Disposable-s5YYE-pO.js";
import { h as handleError, E as ErrorSeverity } from "../errorHandler-DjpPYQWq.js";
import { T, a } from "../TradeTemplateProcessor-DJ0neu6a.js";
import { a as a2, b, c } from "../tradeVisualization-4xAgQEzX.js";
class PaneCollapseManager extends KeyedSingletonManager {
  constructor(chartApi, config = {}) {
    super();
    this.states = /* @__PURE__ */ new Map();
    this.chartApi = chartApi;
    this.config = {
      collapsedHeight: DIMENSIONS.pane.collapsedHeight,
      chartId: config.chartId || "default",
      ...config
    };
  }
  /**
   * Get or create singleton instance for a chart
   */
  static getInstance(chartApi, chartId, config = {}) {
    const key = chartId || "default";
    return KeyedSingletonManager.getOrCreateInstance(
      "PaneCollapseManager",
      key,
      () => new PaneCollapseManager(chartApi, { ...config, chartId: key })
    );
  }
  /**
   * Destroy singleton instance for a chart
   */
  static destroyInstance(chartId) {
    const key = chartId || "default";
    KeyedSingletonManager.destroyInstanceByKey("PaneCollapseManager", key);
  }
  /**
   * Initialize state for a pane with optional callbacks
   *
   * Callbacks are stored per-pane to support multiple panes with different handlers.
   * This fixes the singleton issue where only the first pane's callbacks were used.
   */
  initializePane(paneId, callbacks) {
    if (!this.states.has(paneId)) {
      this.states.set(paneId, {
        isCollapsed: false,
        originalHeight: 0,
        collapsedHeight: this.config?.collapsedHeight || DIMENSIONS.pane.collapsedHeight,
        // Use per-pane callbacks if provided, otherwise fallback to config callbacks
        onPaneCollapse: callbacks?.onPaneCollapse || this.config?.onPaneCollapse,
        onPaneExpand: callbacks?.onPaneExpand || this.config?.onPaneExpand
      });
    }
  }
  /**
   * Get collapse state for a pane
   */
  getState(paneId) {
    return this.states.get(paneId);
  }
  /**
   * Check if a pane is collapsed
   */
  isCollapsed(paneId) {
    return this.states.get(paneId)?.isCollapsed || false;
  }
  /**
   * Toggle pane collapse state
   */
  toggle(paneId) {
    const state = this.states.get(paneId);
    if (!state) {
      logger.error("Pane state not initialized", "PaneCollapseManager", {
        paneId
      });
      return;
    }
    try {
      if (state.isCollapsed) {
        this.expand(paneId);
      } else {
        this.collapse(paneId);
      }
    } catch (error) {
      handleError(error, "PaneCollapseManager.toggle", ErrorSeverity.WARNING);
    }
  }
  /**
   * Collapse a pane using manual redistribution to non-collapsed panes
   *
   * MANUAL REDISTRIBUTION STRATEGY:
   * 1. Save original height of collapsing pane
   * 2. Calculate freed space: originalHeight - collapsedHeight
   * 3. Find all EXPANDED (non-collapsed) panes
   * 4. Distribute freed space ONLY among expanded panes
   * 5. Set ALL pane heights (collapsed + expanded) to prevent chart's auto-redistribution
   *
   * This ensures collapsed panes stay collapsed when collapsing additional panes!
   */
  collapse(paneId) {
    const state = this.states.get(paneId);
    if (!state || state.isCollapsed) return;
    try {
      const panes = this.chartApi.panes();
      if (!panes || !panes[paneId]) {
        logger.error("Pane not found in chart.panes()", "PaneCollapseManager", {
          paneId
        });
        return;
      }
      const currentSizes = /* @__PURE__ */ new Map();
      let paneIndex = 0;
      while (paneIndex < 10) {
        try {
          const size = this.chartApi.paneSize(paneIndex);
          if (!size) break;
          currentSizes.set(paneIndex, size.height);
          paneIndex++;
        } catch {
          break;
        }
      }
      if (state.originalHeight === 0) {
        state.originalHeight = currentSizes.get(paneId) || 0;
      }
      const expandedPanes = [];
      for (const [id, paneState] of this.states.entries()) {
        if (id !== paneId && !paneState.isCollapsed) {
          expandedPanes.push(id);
        }
      }
      if (expandedPanes.length === 0) {
        for (let i = 0; i < currentSizes.size; i++) {
          if (i !== paneId) {
            expandedPanes.push(i);
          }
        }
      }
      const freedSpace = state.originalHeight - state.collapsedHeight;
      const spacePerExpandedPane = freedSpace / expandedPanes.length;
      panes[paneId].setHeight(state.collapsedHeight);
      for (const expandedPaneId of expandedPanes) {
        const currentHeight = currentSizes.get(expandedPaneId) || 0;
        const newHeight = currentHeight + spacePerExpandedPane;
        if (panes[expandedPaneId]) {
          panes[expandedPaneId].setHeight(newHeight);
        }
      }
      for (const [id, paneState] of this.states.entries()) {
        if (id !== paneId && paneState.isCollapsed && panes[id]) {
          panes[id].setHeight(paneState.collapsedHeight);
        }
      }
      state.isCollapsed = true;
      if (state.onPaneCollapse) {
        state.onPaneCollapse(paneId, true);
      }
    } catch (error) {
      handleError(error, "PaneCollapseManager.collapse", ErrorSeverity.ERROR);
    }
  }
  /**
   * Expand a pane using manual redistribution from non-collapsed panes
   *
   * MANUAL REDISTRIBUTION STRATEGY:
   * 1. Calculate space to reclaim: originalHeight - collapsedHeight
   * 2. Find all EXPANDED (non-collapsed) panes
   * 3. Take space EQUALLY from expanded panes only
   * 4. Set ALL pane heights (collapsed + expanded) to prevent chart's auto-redistribution
   *
   * This ensures collapsed panes stay collapsed when expanding other panes!
   */
  expand(paneId) {
    const state = this.states.get(paneId);
    if (!state || !state.isCollapsed) return;
    try {
      const panes = this.chartApi.panes();
      if (!panes || !panes[paneId]) {
        logger.error("Pane not found in chart.panes()", "PaneCollapseManager", {
          paneId
        });
        return;
      }
      const currentSizes = /* @__PURE__ */ new Map();
      let paneIndex = 0;
      while (paneIndex < 10) {
        try {
          const size = this.chartApi.paneSize(paneIndex);
          if (!size) break;
          currentSizes.set(paneIndex, size.height);
          paneIndex++;
        } catch {
          break;
        }
      }
      const expandedPanes = [];
      for (const [id, paneState] of this.states.entries()) {
        if (id !== paneId && !paneState.isCollapsed) {
          expandedPanes.push(id);
        }
      }
      if (expandedPanes.length === 0) {
        for (let i = 0; i < currentSizes.size; i++) {
          if (i !== paneId && currentSizes.has(i)) {
            expandedPanes.push(i);
          }
        }
      }
      const spaceToReclaim = state.originalHeight - state.collapsedHeight;
      const spacePerExpandedPane = spaceToReclaim / expandedPanes.length;
      for (const expandedPaneId of expandedPanes) {
        const currentHeight = currentSizes.get(expandedPaneId) || 0;
        const newHeight = currentHeight - spacePerExpandedPane;
        if (panes[expandedPaneId] && newHeight > 30) {
          panes[expandedPaneId].setHeight(newHeight);
        }
      }
      if (state.originalHeight > 0) {
        panes[paneId].setHeight(state.originalHeight);
      }
      for (const [id, paneState] of this.states.entries()) {
        if (id !== paneId && paneState.isCollapsed && panes[id]) {
          panes[id].setHeight(paneState.collapsedHeight);
        }
      }
      state.isCollapsed = false;
      state.originalHeight = 0;
      if (state.onPaneExpand) {
        state.onPaneExpand(paneId, false);
      }
    } catch (error) {
      handleError(error, "PaneCollapseManager.expand", ErrorSeverity.ERROR);
    }
  }
  /**
   * Cleanup resources
   */
  destroy() {
    this.states.clear();
    cleanupInstance(this, ["chartApi", "config"]);
  }
}
const createAnnotationVisualElements = (annotations) => {
  const markers = [];
  const shapes = [];
  const texts = [];
  if (!annotations || typeof annotations !== "object") {
    return { markers, shapes, texts };
  }
  try {
    if (!Array.isArray(annotations)) {
      return { markers, shapes, texts };
    }
    try {
      if (typeof annotations.forEach !== "function") {
        return { markers, shapes, texts };
      }
    } catch {
      return { markers, shapes, texts };
    }
    let annotationsArray;
    try {
      annotationsArray = Array.from(annotations);
    } catch {
      return { markers, shapes, texts };
    }
    if (!Array.isArray(annotationsArray) || typeof annotationsArray.forEach !== "function") {
      return { markers, shapes, texts };
    }
    try {
      annotationsArray.forEach((annotation, _index) => {
        try {
          if (!annotation || typeof annotation !== "object") {
            return;
          }
          if (annotation.type === "arrow" || annotation.type === "shape" || annotation.type === "circle") {
            const marker = {
              time: parseTime(annotation.time),
              position: normalizePosition(annotation.position),
              color: annotation.color || "#2196F3",
              shape: annotation.type === "arrow" ? "arrowUp" : "circle",
              text: annotation.text || "",
              size: annotation.fontSize || 1
            };
            markers.push(marker);
          }
          if (annotation.type === "rectangle" || annotation.type === "line") {
            const shape = {
              type: annotation.type,
              points: [
                {
                  time: parseTime(annotation.time),
                  price: annotation.price ?? 0
                }
              ],
              color: annotation.color || "#2196F3",
              fillColor: annotation.backgroundColor || "#2196F3",
              borderWidth: annotation.borderWidth || 1,
              text: annotation.text || ""
            };
            shapes.push(shape);
          }
          if (annotation.type === "text") {
            const text = {
              time: parseTime(annotation.time),
              price: annotation.price,
              text: annotation.text,
              color: annotation.textColor || "#131722",
              backgroundColor: annotation.backgroundColor || "rgba(255, 255, 255, 0.9)",
              fontSize: annotation.fontSize || 12,
              fontFamily: "Arial",
              position: normalizePosition(annotation.position)
            };
            texts.push(text);
          }
        } catch (error) {
          logger.error(
            "Annotation text extraction failed",
            "AnnotationSystem",
            error
          );
        }
      });
    } catch (forEachError) {
      logger.error(
        "Annotation forEach operation failed",
        "AnnotationSystem",
        forEachError
      );
    }
  } catch (outerError) {
    logger.error(
      "Annotation system outer operation failed",
      "AnnotationSystem",
      outerError
    );
  }
  return { markers, shapes, texts };
};
function parseTime(time) {
  if (typeof time === "number") {
    return time;
  }
  if (typeof time === "string") {
    const date = new Date(time);
    return Math.floor(date.getTime() / 1e3);
  }
  if (typeof time === "object" && "year" in time && "month" in time && "day" in time) {
    const date = new Date(time.year, time.month - 1, time.day);
    return Math.floor(date.getTime() / 1e3);
  }
  return Math.floor(Date.now() / 1e3);
}
function normalizePosition(position) {
  if (position === "above") return "aboveBar";
  if (position === "below") return "belowBar";
  return position || "aboveBar";
}
function filterAnnotationsByTimeRange(annotations, startTime, endTime) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  return annotations.filter((annotation) => {
    const time = parseTime(annotation.time);
    return time >= start && time <= end;
  });
}
function filterAnnotationsByPriceRange(annotations, minPrice, maxPrice) {
  return annotations.filter((annotation) => {
    if (annotation.price === void 0) return false;
    return annotation.price >= minPrice && annotation.price <= maxPrice;
  });
}
function createAnnotationLayer(name, annotations = []) {
  return {
    name,
    annotations,
    visible: true,
    opacity: 1
  };
}
export {
  C as ChartCoordinateService,
  C2 as CornerLayoutManager,
  PaneCollapseManager,
  P as PrimitiveEventManager,
  T as TemplateEngine,
  a as TradeTemplateProcessor,
  a2 as convertTradeRectanglesToPluginFormat,
  b as convertTradeRectanglesToPluginFormatWhenReady,
  createAnnotationLayer,
  createAnnotationVisualElements,
  c as createTradeVisualElements,
  filterAnnotationsByPriceRange,
  filterAnnotationsByTimeRange
};
//# sourceMappingURL=index.js.map
