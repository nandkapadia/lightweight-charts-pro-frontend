var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["INFO"] = 1] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 2] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 3] = "ERROR";
  return LogLevel2;
})(LogLevel || {});
class Logger {
  constructor() {
    this.logLevel = 2;
  }
  shouldLog(level) {
    return level >= this.logLevel;
  }
  formatMessage(entry) {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const context = entry.context ? `[${entry.context}] ` : "";
    return `${timestamp} ${levelName} ${context}${entry.message}`;
  }
  log(level, message, context, data) {
    if (!this.shouldLog(level)) return;
    const entry = {
      level,
      message,
      context,
      data,
      timestamp: /* @__PURE__ */ new Date()
    };
    const formattedMessage = this.formatMessage(entry);
    switch (level) {
      case 0:
        console.debug(formattedMessage);
        break;
      case 1:
        console.info(formattedMessage);
        break;
      case 2:
        console.warn(formattedMessage, data);
        break;
      case 3:
        console.error(formattedMessage, data);
        break;
    }
  }
  debug(message, context, data) {
    this.log(0, message, context, data);
  }
  info(message, context, data) {
    this.log(1, message, context, data);
  }
  warn(message, context, data) {
    this.log(2, message, context, data);
  }
  error(message, context, data) {
    this.log(3, message, context, data);
  }
  // Specialized methods for common contexts
  chartError(message, error) {
    this.error(message, "Chart", error);
  }
  primitiveError(message, primitiveId, error) {
    this.error(message, `Primitive:${primitiveId}`, error);
  }
  performanceWarn(message, data) {
    this.warn(message, "Performance", data);
  }
  renderDebug(message, componentName, data) {
    this.debug(message, `Render:${componentName}`, data);
  }
}
const logger = new Logger();
const chartLog = {
  debug: (message, data) => logger.debug(message, "Chart", data),
  info: (message, data) => logger.info(message, "Chart", data),
  warn: (message, data) => logger.warn(message, "Chart", data),
  error: (message, error) => logger.chartError(message, error)
};
const primitiveLog = {
  debug: (message, primitiveId, data) => logger.debug(message, `Primitive:${primitiveId}`, data),
  error: (message, primitiveId, error) => logger.primitiveError(message, primitiveId, error)
};
const perfLog = {
  warn: (message, data) => logger.performanceWarn(message, data),
  debug: (message, data) => logger.debug(message, "Performance", data)
};
const TimeRangeSeconds = {
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  ONE_HOUR: 3600,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_MONTH: 2592e3,
  THREE_MONTHS: 7776e3,
  SIX_MONTHS: 15552e3,
  ONE_YEAR: 31536e3,
  FIVE_YEARS: 15768e4
};
const UniversalSpacing = {
  EDGE_PADDING: 6,
  // Universal padding for widget edges and container spacing
  WIDGET_GAP: 6,
  // Gap between stacked widgets
  WIDGET_HORIZONTAL_GAP: 6,
  // Gap between horizontally stacked widgets
  DEFAULT_PADDING: 6,
  // Default padding inside widgets
  BASE_Z_INDEX: 1e3
};
const ButtonDimensions = {
  DEFAULT_WIDTH: 24,
  DEFAULT_HEIGHT: 24,
  PANE_ACTION_WIDTH: 18,
  PANE_ACTION_HEIGHT: 18,
  MIN_WIDTH_RANGE: 40,
  BORDER_RADIUS: 4,
  PANE_ACTION_BORDER_RADIUS: 3,
  FONT_SIZE: 14,
  RANGE_FONT_SIZE: 12
};
const ButtonSpacing = {
  CONTAINER_PADDING: UniversalSpacing.EDGE_PADDING,
  CONTAINER_GAP: 2,
  // Reduced from 4 for more compact layout
  RANGE_CONTAINER_GAP: 2,
  // Reduced from 4 for tighter spacing
  BUTTON_PADDING: "4px 12px",
  // Standard button padding (not affected by 6px widget margin rule)
  RANGE_BUTTON_PADDING: "3px 8px",
  // More compact padding for range buttons
  PANE_ACTION_PADDING: "0",
  BUTTON_MARGIN: "0",
  RANGE_BUTTON_MARGIN: "0 1px"
  // Reduced margin between buttons
};
const ButtonColors = {
  DEFAULT_BACKGROUND: "rgba(255, 255, 255, 0.1)",
  DEFAULT_COLOR: "#666",
  HOVER_BACKGROUND: "rgba(255, 255, 255, 0.2)",
  HOVER_COLOR: "#333",
  PRESSED_BACKGROUND: "#007AFF",
  PRESSED_COLOR: "white",
  DISABLED_BACKGROUND: "rgba(128, 128, 128, 0.1)",
  DISABLED_COLOR: "#999",
  PANE_ACTION_BACKGROUND: "rgba(255, 255, 255, 0.1)",
  PANE_ACTION_COLOR: "#6b7280",
  PANE_ACTION_HOVER_BACKGROUND: "rgba(255, 255, 255, 1)",
  PANE_ACTION_PRESSED_BACKGROUND: "rgba(229, 231, 235, 1)",
  PANE_ACTION_BORDER: "#d1d5db",
  ACTION_BACKGROUND: "#007AFF",
  ACTION_HOVER_BACKGROUND: "#0056CC"
};
const ButtonEffects = {
  DEFAULT_BORDER: "1px solid rgba(255, 255, 255, 0.2)",
  RANGE_BORDER: "1px solid rgba(0, 0, 0, 0.1)",
  // Subtle border for range buttons
  DEFAULT_TRANSITION: "all 0.2s ease",
  HOVER_BOX_SHADOW: "0 2px 4px rgba(0, 0, 0, 0.1)",
  RANGE_HOVER_BOX_SHADOW: "0 1px 3px rgba(0, 0, 0, 0.12)",
  // Subtle shadow for range buttons
  PRESSED_BOX_SHADOW: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  FOCUS_OUTLINE: "2px solid #007AFF"
};
const LegendDimensions = {
  DEFAULT_PADDING: UniversalSpacing.DEFAULT_PADDING,
  OHLC_PADDING: UniversalSpacing.DEFAULT_PADDING,
  BAND_PADDING: UniversalSpacing.DEFAULT_PADDING,
  BORDER_RADIUS: 4,
  MAX_WIDTH: 200,
  FONT_SIZE: 12,
  OHLC_FONT_SIZE: 11,
  BAND_FONT_SIZE: 11
};
const LayoutSpacing = {
  EDGE_PADDING: UniversalSpacing.EDGE_PADDING,
  WIDGET_GAP: UniversalSpacing.WIDGET_GAP,
  BASE_Z_INDEX: UniversalSpacing.BASE_Z_INDEX
};
const LegendColors = {
  DEFAULT_BACKGROUND: "rgba(0, 0, 0, 0.8)",
  DEFAULT_COLOR: "white",
  VOLUME_BACKGROUND: "rgba(100, 100, 100, 0.8)",
  BAND_BACKGROUND: "rgba(0, 50, 100, 0.8)",
  DEFAULT_OPACITY: 0.8
};
const RangeSwitcherLayout = {
  CONTAINER_PADDING: 0,
  // No internal padding - edge margin is handled by positioning logic
  CONTAINER_GAP: ButtonSpacing.RANGE_CONTAINER_GAP,
  // Use the compact gap setting
  FLEX_DIRECTION: "row",
  ALIGN_ITEMS: "center",
  JUSTIFY_CONTENT: "flex-end"
};
const FormatDefaults = {
  VALUE_FORMAT: ".2f",
  VOLUME_FORMAT: ".0f",
  BAND_FORMAT: ".3f",
  TIME_FORMAT: "YYYY-MM-DD HH:mm:ss"
};
const ContainerDefaults = {
  BACKGROUND: "transparent",
  FONT_FAMILY: "Arial, sans-serif",
  FONT_WEIGHT: "normal",
  TEXT_ALIGN: "left",
  USER_SELECT: "none",
  POINTER_EVENTS: "auto",
  POSITION: "absolute"
};
const CommonValues = {
  NONE: "none",
  AUTO: "auto",
  POINTER: "pointer",
  DEFAULT_CURSOR: "default",
  ZERO: "0",
  FONT_WEIGHT_MEDIUM: "500",
  FONT_WEIGHT_NORMAL: "normal",
  FONT_WEIGHT_BOLD: "bold",
  NOWRAP: "nowrap",
  HIDDEN: "hidden",
  ELLIPSIS: "ellipsis"
};
const AnimationTiming = {
  DEFAULT_TRANSITION: "all 0.2s ease",
  FAST_TRANSITION: "all 0.1s ease",
  SLOW_TRANSITION: "all 0.3s ease"
};
const DefaultButtonConfig = {
  dimensions: ButtonDimensions,
  spacing: ButtonSpacing,
  colors: ButtonColors,
  effects: ButtonEffects,
  animation: AnimationTiming
};
const DefaultLegendConfig = {
  dimensions: LegendDimensions,
  colors: LegendColors,
  formats: FormatDefaults,
  animation: AnimationTiming
};
const DefaultRangeSwitcherConfig = {
  layout: RangeSwitcherLayout,
  button: DefaultButtonConfig,
  timeRanges: TimeRangeSeconds,
  animation: AnimationTiming
};
const DefaultContainerConfig = {
  styling: ContainerDefaults,
  animation: AnimationTiming
};
const MARGINS = {
  legend: {
    top: UniversalSpacing.EDGE_PADDING,
    right: UniversalSpacing.EDGE_PADDING,
    bottom: UniversalSpacing.WIDGET_GAP,
    left: UniversalSpacing.EDGE_PADDING
  },
  pane: {
    top: UniversalSpacing.EDGE_PADDING,
    right: UniversalSpacing.EDGE_PADDING,
    bottom: UniversalSpacing.EDGE_PADDING,
    left: UniversalSpacing.EDGE_PADDING
  },
  content: {
    top: UniversalSpacing.EDGE_PADDING,
    right: UniversalSpacing.EDGE_PADDING,
    bottom: UniversalSpacing.EDGE_PADDING,
    left: UniversalSpacing.EDGE_PADDING
  },
  tooltip: {
    top: UniversalSpacing.EDGE_PADDING,
    right: UniversalSpacing.EDGE_PADDING,
    bottom: UniversalSpacing.EDGE_PADDING,
    left: UniversalSpacing.EDGE_PADDING
  }
};
const DIMENSIONS = {
  timeAxis: {
    defaultHeight: 35,
    minHeight: 25,
    maxHeight: 50
  },
  priceScale: {
    defaultWidth: 70,
    minWidth: 50,
    maxWidth: 100,
    rightScaleDefaultWidth: 0
  },
  legend: {
    defaultHeight: 80,
    minHeight: 60,
    maxHeight: 120,
    defaultWidth: 200,
    minWidth: 150
  },
  pane: {
    defaultHeight: 200,
    minHeight: 100,
    maxHeight: 1e3,
    minWidth: 200,
    maxWidth: 2e3,
    collapsedHeight: 30
    // Height when pane is collapsed (30px is minimum per lightweight-charts API)
  },
  chart: {
    defaultWidth: 800,
    defaultHeight: 600,
    minWidth: 300,
    minHeight: 200
  }
};
const FALLBACKS = {
  paneHeight: 200,
  paneWidth: 800,
  chartWidth: 800,
  chartHeight: 600,
  timeScaleHeight: 35,
  priceScaleWidth: 70,
  containerWidth: 800,
  containerHeight: 600
};
const Z_INDEX = {
  background: 0,
  chart: 1,
  pane: 10,
  series: 20,
  overlay: 30,
  legend: 40,
  tooltip: 50,
  modal: 100
};
const TIMING = {
  cacheExpiration: 5e3,
  // 5 seconds
  cacheCleanupInterval: 1e4,
  // 10 seconds
  debounceDelay: 100,
  // 100ms
  throttleDelay: 50,
  // 50ms
  animationDuration: 200,
  // 200ms
  chartReadyDelay: 300,
  // 300ms - Delay for chart initialization
  backendSyncDebounce: 300
  // 300ms - Debounce for backend sync operations
};
function getMargins(feature) {
  return MARGINS[feature] || MARGINS.content;
}
function getDimensions(component) {
  return DIMENSIONS[component] || DIMENSIONS.chart;
}
function getFallback(type) {
  return FALLBACKS[type] || 0;
}
function validateConfiguration() {
  for (const [, value] of Object.entries(DIMENSIONS)) {
    for (const [, val] of Object.entries(value)) {
      if (typeof val === "number" && val < 0) {
        return false;
      }
    }
  }
  if (DIMENSIONS.timeAxis.minHeight > DIMENSIONS.timeAxis.maxHeight) {
    return false;
  }
  if (DIMENSIONS.priceScale.minWidth > DIMENSIONS.priceScale.maxWidth) {
    return false;
  }
  return true;
}
const CSS_CLASSES = {
  /**
   * Generate series configuration dialog container class name
   */
  seriesDialogContainer: (paneId) => `series-config-dialog-container-${paneId}`,
  /**
   * Generate pane button panel container class name
   */
  paneButtonPanelContainer: (paneId) => `pane-button-panel-container-${paneId}`
};
if (process.env.NODE_ENV === "development") {
  validateConfiguration();
}
function validateChartCoordinates(coordinates) {
  const errors = [];
  const warnings = [];
  if (!coordinates.container) {
    errors.push("Missing container dimensions");
  } else {
    if (coordinates.container.width <= 0) {
      errors.push(`Invalid container width: ${coordinates.container.width}`);
    }
    if (coordinates.container.height <= 0) {
      errors.push(`Invalid container height: ${coordinates.container.height}`);
    }
    if (coordinates.container.width < DIMENSIONS.chart.minWidth) {
      warnings.push(
        `Container width (${coordinates.container.width}) is below recommended minimum (${DIMENSIONS.chart.minWidth})`
      );
    }
    if (coordinates.container.height < DIMENSIONS.chart.minHeight) {
      warnings.push(
        `Container height (${coordinates.container.height}) is below recommended minimum (${DIMENSIONS.chart.minHeight})`
      );
    }
  }
  if (!coordinates.timeScale) {
    errors.push("Missing time scale dimensions");
  } else {
    const timeScaleErrors = validateScaleDimensions(coordinates.timeScale, "timeScale");
    errors.push(...timeScaleErrors.errors);
    warnings.push(...timeScaleErrors.warnings);
    if (coordinates.timeScale.height < DIMENSIONS.timeAxis.minHeight) {
      warnings.push(
        `Time scale height (${coordinates.timeScale.height}) is below minimum (${DIMENSIONS.timeAxis.minHeight})`
      );
    }
    if (coordinates.timeScale.height > DIMENSIONS.timeAxis.maxHeight) {
      warnings.push(
        `Time scale height (${coordinates.timeScale.height}) exceeds maximum (${DIMENSIONS.timeAxis.maxHeight})`
      );
    }
  }
  const priceScales = coordinates.priceScales;
  if (priceScales) {
    if (priceScales.right) {
      const rightScaleErrors = validateScaleDimensions(priceScales.right, "priceScaleRight");
      errors.push(...rightScaleErrors.errors);
      warnings.push(...rightScaleErrors.warnings);
    }
    if (priceScales.left) {
      const leftScaleErrors = validateScaleDimensions(priceScales.left, "priceScaleLeft");
      errors.push(...leftScaleErrors.errors);
      warnings.push(...leftScaleErrors.warnings);
    }
  } else {
    if (!coordinates.priceScaleLeft) {
      warnings.push("Missing left price scale dimensions");
    } else {
      const priceScaleErrors = validateScaleDimensions(
        coordinates.priceScaleLeft,
        "priceScaleLeft"
      );
      errors.push(...priceScaleErrors.errors);
      warnings.push(...priceScaleErrors.warnings);
    }
    if (coordinates.priceScaleRight) {
      const priceScaleErrors = validateScaleDimensions(
        coordinates.priceScaleRight,
        "priceScaleRight"
      );
      errors.push(...priceScaleErrors.errors);
      warnings.push(...priceScaleErrors.warnings);
    }
  }
  if (!coordinates.panes) {
    errors.push("No panes defined");
  } else {
    if (Array.isArray(coordinates.panes)) {
      if (coordinates.panes.length === 0) {
        errors.push("No panes defined");
      } else {
        coordinates.panes.forEach((pane, index) => {
          const paneErrors = validatePaneCoordinates(pane, index);
          errors.push(...paneErrors.errors);
          warnings.push(...paneErrors.warnings);
        });
      }
    } else {
      const paneKeys = Object.keys(coordinates.panes);
      if (paneKeys.length === 0) {
        errors.push("No panes defined");
      } else {
        paneKeys.forEach((key) => {
          const pane = coordinates.panes[key];
          const paneErrors = validatePaneCoordinates(pane, parseInt(key));
          errors.push(...paneErrors.errors);
          warnings.push(...paneErrors.warnings);
        });
      }
    }
  }
  if (!coordinates.contentArea) {
    errors.push("Missing content area dimensions");
  } else {
    const contentErrors = validateBoundingBox(coordinates.contentArea, "contentArea");
    errors.push(...contentErrors.errors);
    warnings.push(...contentErrors.warnings);
  }
  if (!coordinates.timestamp || coordinates.timestamp <= 0) {
    warnings.push("Invalid or missing timestamp");
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
function validateScaleDimensions(scale, name) {
  const errors = [];
  const warnings = [];
  if (!scale) {
    errors.push(`${name}: Missing scale dimensions`);
    return { isValid: false, errors, warnings };
  }
  if (scale.width <= 0) {
    errors.push(`${name}: Invalid width (${scale.width})`);
  }
  if (scale.height <= 0) {
    errors.push(`${name}: Invalid height (${scale.height})`);
  }
  if (typeof scale.x === "number" && scale.x < 0) {
    warnings.push(`${name}: Negative x position (${scale.x})`);
  }
  if (typeof scale.y === "number" && scale.y < 0) {
    warnings.push(`${name}: Negative y position (${scale.y})`);
  }
  return { isValid: errors.length === 0, errors, warnings };
}
function validatePaneCoordinates(pane, index) {
  const errors = [];
  const warnings = [];
  const prefix = index !== void 0 ? `Pane ${index}: ` : "";
  if (!pane) {
    errors.push(`${prefix}Missing pane data`);
    return { isValid: false, errors, warnings };
  }
  if (typeof pane.width === "number" && typeof pane.height === "number") {
    if (pane.width <= 0) {
      errors.push(`${prefix}Invalid width (${pane.width})`);
    }
    if (pane.height <= 0) {
      errors.push(`${prefix}Invalid height (${pane.height})`);
    }
    if (typeof pane.contentArea?.top === "number" && pane.contentArea.top < 0) {
      errors.push(`${prefix}Invalid top position (${pane.contentArea.top})`);
    }
    if (typeof pane.contentArea?.left === "number" && pane.contentArea.left < 0) {
      errors.push(`${prefix}Invalid left position (${pane.contentArea.left})`);
    }
    return { isValid: errors.length === 0, errors, warnings };
  }
  if (typeof pane.paneId === "number" && pane.paneId < 0) {
    errors.push(`${prefix}Invalid pane ID`);
  }
  if (pane.width <= 0) {
    errors.push(`${prefix}Invalid width (${pane.width})`);
  }
  if (pane.height <= 0) {
    errors.push(`${prefix}Invalid height (${pane.height})`);
  }
  if (!pane.contentArea) {
    errors.push(`${prefix}Missing pane content area`);
  } else if (pane.contentArea.width <= 0 || pane.contentArea.height <= 0) {
    errors.push(`${prefix}Invalid content area dimensions`);
  } else {
    const contentErrors = validateBoundingBox(pane.contentArea, "contentArea");
    errors.push(...contentErrors.errors.map((e) => `${prefix}${e}`));
    warnings.push(...contentErrors.warnings.map((w) => `${prefix}${w}`));
  }
  if (pane.contentArea) {
    if (pane.contentArea.width > pane.width) {
      errors.push(`${prefix}Content area width exceeds pane width`);
    }
    if (pane.contentArea.height > pane.height) {
      errors.push(`${prefix}Content area height exceeds pane height`);
    }
  }
  return { isValid: errors.length === 0, errors, warnings };
}
function validateBoundingBox(box, name = "BoundingBox") {
  const errors = [];
  const warnings = [];
  if (!box) {
    errors.push(`${name}: Missing bounding box data`);
    return { isValid: false, errors, warnings };
  }
  if (box.width !== void 0 && box.width <= 0) {
    errors.push(`${name}: Invalid width (${box.width})`);
  }
  if (box.height !== void 0 && box.height <= 0) {
    errors.push(`${name}: Invalid height (${box.height})`);
  }
  if (box.x !== void 0 && box.x < 0) {
    warnings.push(`${name}: Negative x position (${box.x})`);
  }
  if (box.y !== void 0 && box.y < 0) {
    warnings.push(`${name}: Negative y position (${box.y})`);
  }
  if (box.x !== void 0 && box.width !== void 0) {
    if (box.right !== void 0 && Math.abs(box.x + box.width - box.right) > 1) {
      warnings.push(`${name}: Inconsistent right bound`);
    }
  }
  if (box.y !== void 0 && box.height !== void 0) {
    if (box.bottom !== void 0 && Math.abs(box.y + box.height - box.bottom) > 1) {
      warnings.push(`${name}: Inconsistent bottom bound`);
    }
  }
  return { isValid: errors.length === 0, errors, warnings };
}
function sanitizeCoordinates(coordinates) {
  const now = Date.now();
  const container = coordinates.container ? {
    width: coordinates.container.width <= 0 ? FALLBACKS.containerWidth : coordinates.container.width,
    height: coordinates.container.height <= 0 ? FALLBACKS.containerHeight : coordinates.container.height,
    offsetTop: coordinates.container.offsetTop || 0,
    offsetLeft: coordinates.container.offsetLeft || 0
  } : {
    width: FALLBACKS.containerWidth,
    height: FALLBACKS.containerHeight,
    offsetTop: 0,
    offsetLeft: 0
  };
  const timeScale = coordinates.timeScale ? {
    x: coordinates.timeScale.x ?? 0,
    y: coordinates.timeScale.y ?? container.height - FALLBACKS.timeScaleHeight,
    width: coordinates.timeScale.width <= 0 ? container.width : coordinates.timeScale.width,
    height: coordinates.timeScale.height <= 0 ? FALLBACKS.timeScaleHeight : coordinates.timeScale.height
  } : {
    x: 0,
    y: container.height - FALLBACKS.timeScaleHeight,
    width: container.width,
    height: FALLBACKS.timeScaleHeight
  };
  const needsValidation = validateChartCoordinates(coordinates);
  const appliedFallbacks = !needsValidation.isValid;
  return {
    container,
    timeScale,
    priceScaleLeft: coordinates.priceScaleLeft || {
      x: 0,
      y: 0,
      width: FALLBACKS.priceScaleWidth,
      height: container.height - timeScale.height
    },
    priceScaleRight: coordinates.priceScaleRight || {
      x: container.width - DIMENSIONS.priceScale.rightScaleDefaultWidth,
      y: 0,
      width: DIMENSIONS.priceScale.rightScaleDefaultWidth,
      height: container.height - timeScale.height
    },
    panes: Array.isArray(coordinates.panes) && coordinates.panes.length > 0 ? coordinates.panes.map((pane) => ({
      ...pane,
      x: pane.x < 0 ? 0 : pane.x,
      y: pane.y < 0 ? 0 : pane.y,
      width: pane.width <= 0 ? FALLBACKS.paneWidth : pane.width,
      height: pane.height <= 0 ? FALLBACKS.paneHeight : pane.height,
      contentArea: pane.contentArea ? {
        ...pane.contentArea,
        top: pane.contentArea.top < 0 ? 0 : pane.contentArea.top,
        left: pane.contentArea.left < 0 ? FALLBACKS.priceScaleWidth : pane.contentArea.left,
        width: pane.contentArea.width <= 0 ? FALLBACKS.paneWidth - FALLBACKS.priceScaleWidth : pane.contentArea.width,
        height: pane.contentArea.height <= 0 ? FALLBACKS.paneHeight - FALLBACKS.timeScaleHeight : pane.contentArea.height
      } : {
        top: 0,
        left: FALLBACKS.priceScaleWidth,
        width: FALLBACKS.paneWidth - FALLBACKS.priceScaleWidth,
        height: FALLBACKS.paneHeight - FALLBACKS.timeScaleHeight
      }
    })) : [
      {
        paneId: 0,
        x: 0,
        y: 0,
        width: FALLBACKS.paneWidth,
        height: FALLBACKS.paneHeight,
        absoluteX: 0,
        absoluteY: 0,
        isMainPane: true,
        isLastPane: true,
        contentArea: {
          top: 0,
          left: FALLBACKS.priceScaleWidth,
          width: FALLBACKS.paneWidth - FALLBACKS.priceScaleWidth,
          height: FALLBACKS.paneHeight - FALLBACKS.timeScaleHeight
        },
        margins: { top: 10, right: 10, bottom: 10, left: 10 }
      }
    ],
    contentArea: coordinates.contentArea || {
      x: FALLBACKS.priceScaleWidth,
      y: 0,
      width: container.width - FALLBACKS.priceScaleWidth,
      height: container.height - timeScale.height
    },
    timestamp: coordinates.timestamp || now,
    isValid: !appliedFallbacks
    // Valid if no fallbacks were needed
  };
}
function createBoundingBox(x, y, width, height) {
  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height
  };
}
function areCoordinatesStale(coordinates, maxAge = 5e3) {
  const now = Date.now();
  return now - coordinates.timestamp > maxAge;
}
function logValidationResult(result, _context = "") {
  if (process.env.NODE_ENV !== "development") return;
  if (!result.isValid) {
    logger.error("Coordinate validation failed", "CoordinateValidation", result.errors);
  }
  if (result.warnings.length > 0) {
    logger.warn("Coordinate validation warnings", "CoordinateValidation", result.warnings);
  }
}
function getCoordinateDebugInfo(coordinates) {
  const validation = validateChartCoordinates(coordinates);
  return {
    container: coordinates.container,
    timeScale: coordinates.timeScale,
    panes: coordinates.panes,
    priceScales: {
      left: coordinates.priceScaleLeft,
      right: coordinates.priceScaleRight
    },
    validation,
    summary: [
      `Container: ${coordinates.container?.width || 0}x${coordinates.container?.height || 0}`,
      `TimeScale: ${coordinates.timeScale?.width || 0}x${coordinates.timeScale?.height || 0}`,
      `Panes: ${Array.isArray(coordinates.panes) ? coordinates.panes.length : Object.keys(coordinates.panes || {}).length}`,
      `PriceScales: ${(coordinates.priceScaleLeft ? 1 : 0) + (coordinates.priceScaleRight ? 1 : 0)}`
    ].join(", ")
  };
}
const _ChartCoordinateService = class _ChartCoordinateService {
  /**
   * Private constructor (Singleton pattern)
   *
   * Initializes the service and starts cache cleanup timer.
   *
   * @private
   */
  constructor() {
    this.coordinateCache = /* @__PURE__ */ new Map();
    this.paneDimensionsCache = /* @__PURE__ */ new Map();
    this.chartRegistry = /* @__PURE__ */ new Map();
    this.updateCallbacks = /* @__PURE__ */ new Map();
    this.cacheCleanupIntervalId = null;
    this.startCacheCleanup();
  }
  /**
   * Get singleton instance (lazy initialization)
   *
   * @static
   * @returns {ChartCoordinateService} The singleton instance
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new _ChartCoordinateService();
    }
    return this.instance;
  }
  /**
   * Register a chart for coordinate tracking
   */
  registerChart(chartId, chart) {
    this.chartRegistry.set(chartId, chart);
    this.invalidateCache(chartId);
  }
  /**
   * Unregister a chart
   */
  unregisterChart(chartId) {
    this.chartRegistry.delete(chartId);
    this.coordinateCache.delete(chartId);
    this.updateCallbacks.delete(chartId);
  }
  /**
   * Get coordinates for a chart with caching and validation
   */
  async getCoordinates(chart, container, options = {}) {
    const {
      includeMargins = true,
      useCache = true,
      validateResult = true,
      fallbackOnError = true
    } = options;
    const cacheKey = this.generateCacheKey(chart, container);
    if (useCache) {
      const cached = this.coordinateCache.get(cacheKey);
      if (cached && !areCoordinatesStale(cached, TIMING.cacheExpiration)) {
        return cached;
      }
    }
    try {
      const coordinates = await this.calculateCoordinates(chart, container, includeMargins);
      if (validateResult) {
        const validation = validateChartCoordinates(coordinates);
        logValidationResult(validation, "ChartCoordinateService");
        if (!validation.isValid && fallbackOnError) {
          return sanitizeCoordinates(coordinates);
        }
      }
      const cacheEntry = {
        ...coordinates,
        cacheKey,
        expiresAt: Date.now() + TIMING.cacheExpiration
      };
      this.coordinateCache.set(cacheKey, cacheEntry);
      this.notifyUpdateCallbacks(cacheKey);
      return coordinates;
    } catch (error) {
      if (fallbackOnError) {
        return sanitizeCoordinates({});
      }
      throw error;
    }
  }
  /**
   * Get full pane bounds including price scale areas (for collapse buttons)
   */
  getFullPaneBounds(chart, paneId) {
    try {
      if (!chart || typeof paneId !== "number" || paneId < 0) {
        return null;
      }
      let paneSize = null;
      try {
        paneSize = chart.paneSize(paneId);
      } catch {
        return null;
      }
      if (!paneSize || typeof paneSize.height !== "number" || typeof paneSize.width !== "number") {
        return null;
      }
      let offsetY = 0;
      for (let i = 0; i < paneId; i++) {
        try {
          const size = chart.paneSize(i);
          if (size && typeof size.height === "number") {
            offsetY += size.height;
          }
        } catch {
        }
      }
      const paneWidth = paneSize.width || getFallback("paneWidth");
      return createBoundingBox(
        0,
        // Full pane starts at 0
        offsetY,
        paneWidth,
        // Full pane width including price scales
        paneSize.height
      );
    } catch {
      return null;
    }
  }
  /**
   * Get coordinates for a specific pane
   */
  getPaneCoordinates(chart, paneId) {
    try {
      if (!chart || typeof paneId !== "number" || paneId < 0) {
        return null;
      }
      let paneSize = null;
      try {
        paneSize = chart.paneSize(paneId);
      } catch {
        return null;
      }
      if (!paneSize || typeof paneSize.height !== "number" || typeof paneSize.width !== "number") {
        return null;
      }
      let offsetY = 0;
      for (let i = 0; i < paneId; i++) {
        try {
          const size = chart.paneSize(i);
          if (size && typeof size.height === "number") {
            offsetY += size.height;
          }
        } catch {
        }
      }
      const timeScaleHeight = this.getTimeScaleHeight(chart);
      const axisDimensions = this.getAxisDimensions(chart);
      const legendOffsetX = 0;
      const legendOffsetY = offsetY;
      const paneWidth = paneSize.width || getFallback("paneWidth");
      const bounds = createBoundingBox(
        legendOffsetX,
        legendOffsetY,
        paneWidth,
        // Use full pane width - no price scale adjustment
        paneSize.height
      );
      const contentArea = createBoundingBox(
        axisDimensions.leftPriceScaleWidth,
        // Start after the left Y-axis (price scale)
        legendOffsetY,
        paneWidth - axisDimensions.leftPriceScaleWidth - axisDimensions.rightPriceScaleWidth,
        // Width excluding both price scales
        paneSize.height - (paneId === 0 ? 0 : timeScaleHeight)
      );
      const margins = getMargins("pane");
      if (paneId === 0) {
      }
      return {
        paneId,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        absoluteX: bounds.x,
        absoluteY: bounds.y,
        contentArea: {
          top: contentArea.y,
          left: contentArea.x,
          width: contentArea.width,
          height: contentArea.height
        },
        margins,
        isMainPane: paneId === 0,
        isLastPane: false
        // Will need to be calculated if needed
      };
    } catch {
      return null;
    }
  }
  /**
   * Get pane coordinates with enhanced fallback methods
   */
  async getPaneCoordinatesWithFallback(chart, paneId, container, options = {}) {
    const { ...paneOptions } = options;
    let paneCoords = this.getPaneCoordinates(chart, paneId);
    if (paneCoords) {
      return paneCoords;
    }
    paneCoords = this.getPaneCoordinates(chart, paneId);
    if (paneCoords) {
      return paneCoords;
    }
    return this.getPaneCoordinatesFromDOM(chart, container, paneId, paneOptions);
  }
  /**
   * Get pane coordinates using DOM measurements (fallback method)
   */
  getPaneCoordinatesFromDOM(chart, container, paneId, options = {}) {
    try {
      const chartElement = chart.chartElement();
      if (!chartElement) {
        return null;
      }
      const paneElements = chartElement.querySelectorAll(".tv-lightweight-charts-pane");
      if (paneElements.length <= paneId) {
        return null;
      }
      const paneElement = paneElements[paneId];
      const paneRect = paneElement.getBoundingClientRect();
      const chartRect = chartElement.getBoundingClientRect();
      const offsetY = paneRect.top - chartRect.top;
      const width = paneRect.width;
      const height = paneRect.height;
      if (options.validateDimensions && (width < 10 || height < 10)) {
        return null;
      }
      const legendOffsetX = 0;
      const legendOffsetY = offsetY;
      const bounds = createBoundingBox(legendOffsetX, legendOffsetY, width, height);
      const priceScaleWidth = this.getPriceScaleWidth(chart);
      const timeScaleHeight = this.getTimeScaleHeight(chart);
      const contentArea = createBoundingBox(
        priceScaleWidth,
        // Start after the left Y-axis (price scale)
        legendOffsetY,
        width - priceScaleWidth,
        // Width is the remaining area after price scale
        height - (paneId === 0 ? 0 : timeScaleHeight)
      );
      const margins = getMargins("pane");
      return {
        paneId,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        absoluteX: bounds.x,
        absoluteY: bounds.y,
        contentArea: {
          top: contentArea.y,
          left: contentArea.x,
          width: contentArea.width,
          height: contentArea.height
        },
        margins,
        isMainPane: paneId === 0,
        isLastPane: false
        // Will need to be calculated if needed
      };
    } catch {
      return null;
    }
  }
  /**
   * Check if a point is within a pane
   */
  isPointInPane(point, paneCoords) {
    return point.x >= paneCoords.x && point.x <= paneCoords.x + paneCoords.width && point.y >= paneCoords.y && point.y <= paneCoords.y + paneCoords.height;
  }
  /**
   * Check if chart dimensions are valid
   */
  areChartDimensionsValid(dimensions, minWidth = 200, minHeight = 200) {
    try {
      const { container } = dimensions;
      return container.width >= minWidth && container.height >= minHeight;
    } catch {
      return false;
    }
  }
  /**
   * Check if chart dimensions object is valid
   */
  areChartDimensionsObjectValid(dimensions, minWidth = 200, minHeight = 200) {
    try {
      const { container } = dimensions;
      return container.width >= minWidth && container.height >= minHeight;
    } catch {
      return false;
    }
  }
  /**
   * Get validated chart coordinates
   */
  async getValidatedCoordinates(chart, container, options = {}) {
    try {
      const coordinates = await this.getCoordinates(chart, container, {
        validateResult: true
      });
      if (this.areChartDimensionsValid(coordinates, options.minWidth, options.minHeight)) {
        return coordinates;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  /**
   * Get chart dimensions with multiple fallback methods
   */
  async getChartDimensionsWithFallback(chart, container, options = {}) {
    const { minWidth = 200, minHeight = 200 } = options;
    try {
      const chartElement = chart.chartElement();
      if (chartElement) {
        const chartRect = chartElement.getBoundingClientRect();
        if (chartRect.width >= minWidth && chartRect.height >= minHeight) {
          return this.getChartDimensionsFromAPI(chart, {
            width: chartRect.width,
            height: chartRect.height
          });
        }
      }
    } catch {
    }
    try {
      const result = this.getChartDimensionsFromDOM(chart, container);
      if (result.container.width >= minWidth && result.container.height >= minHeight) {
        return result;
      }
    } catch {
    }
    return this.getDefaultChartDimensions();
  }
  /**
   * Get chart dimensions using chart API (most accurate)
   */
  getChartDimensionsFromAPI(chart, chartSize) {
    let timeScaleHeight = 35;
    let timeScaleWidth = chartSize.width;
    try {
      const timeScale = chart.timeScale();
      timeScaleHeight = timeScale.height() || 35;
      timeScaleWidth = timeScale.width() || chartSize.width;
    } catch {
    }
    let priceScaleWidth = 70;
    try {
      const priceScale = chart.priceScale("left");
      priceScaleWidth = priceScale.width() || 70;
    } catch {
    }
    return {
      timeScale: {
        x: 0,
        y: chartSize.height - timeScaleHeight,
        height: timeScaleHeight,
        width: timeScaleWidth
      },
      priceScale: {
        x: 0,
        y: 0,
        height: chartSize.height - timeScaleHeight,
        width: priceScaleWidth
      },
      container: chartSize
    };
  }
  /**
   * Get chart dimensions using DOM measurements (fallback method)
   */
  getChartDimensionsFromDOM(chart, container) {
    let width = 0;
    let height = 0;
    try {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    } catch (error) {
      logger.error("Chart coordinate operation failed", "ChartCoordinateService", error);
    }
    if (!width || !height) {
      width = container.offsetWidth;
      height = container.offsetHeight;
    }
    if (!width || !height) {
      width = container.clientWidth;
      height = container.clientHeight;
    }
    if (!width || !height) {
      width = container.scrollWidth;
      height = container.scrollHeight;
    }
    width = Math.max(width || 800, 200);
    height = Math.max(height || 600, 200);
    let timeScaleHeight = 35;
    let timeScaleWidth = width;
    try {
      const timeScale = chart.timeScale();
      timeScaleHeight = timeScale.height() || 35;
      timeScaleWidth = timeScale.width() || width;
    } catch (error) {
      logger.error("Chart coordinate operation failed", "ChartCoordinateService", error);
    }
    let priceScaleWidth = 70;
    try {
      const priceScale = chart.priceScale("left");
      priceScaleWidth = priceScale.width() || 70;
    } catch (error) {
      logger.error("Chart coordinate operation failed", "ChartCoordinateService", error);
    }
    return {
      timeScale: {
        x: 0,
        y: height - timeScaleHeight,
        height: timeScaleHeight,
        width: timeScaleWidth
      },
      priceScale: {
        x: 0,
        y: 0,
        height: height - timeScaleHeight,
        width: priceScaleWidth
      },
      container: { width, height }
    };
  }
  /**
   * Get default chart dimensions (last resort)
   */
  getDefaultChartDimensions() {
    return {
      timeScale: {
        x: 0,
        y: 565,
        // 600 - 35
        height: 35,
        width: 800
      },
      priceScale: {
        x: 0,
        y: 0,
        height: 565,
        // 600 - 35
        width: 70
      },
      container: {
        width: 800,
        height: 600
      }
    };
  }
  /**
   * Get validated chart dimensions
   */
  async getValidatedChartDimensions(chart, container, options = {}) {
    try {
      const dimensions = await this.getChartDimensionsWithFallback(chart, container, options);
      if (this.areChartDimensionsObjectValid(dimensions, options.minWidth, options.minHeight)) {
        return dimensions;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  /**
   * Calculate range switcher position for the entire chart
   */
  getRangeSwitcherPosition(chart, position, containerDimensions) {
    try {
      const paneCoords = this.getPaneCoordinates(chart, 0);
      if (!paneCoords) return null;
      const chartElement = chart.chartElement();
      const container = containerDimensions || {
        width: chartElement.clientWidth || chartElement.offsetWidth || 800,
        height: chartElement.clientHeight || chartElement.offsetHeight || 600
      };
      try {
        chart.chartElement().querySelector(".tv-lightweight-charts")?.getBoundingClientRect();
      } catch {
      }
      let actualTimeScaleHeight = 35;
      let actualPriceScaleWidth = 70;
      try {
        actualTimeScaleHeight = chart.timeScale().height();
        const rightPriceScale = chart.priceScale("right");
        if (rightPriceScale) {
          actualPriceScaleWidth = rightPriceScale.width();
        } else {
          const leftPriceScale = chart.priceScale("left");
          if (leftPriceScale) {
            actualPriceScaleWidth = leftPriceScale.width();
          }
        }
      } catch {
      }
      const priceScaleLabelHeight = 20;
      const getTotalPaneCount = () => {
        let paneCount = 0;
        try {
          while (true) {
            const paneSize = chart.paneSize(paneCount);
            if (!paneSize || typeof paneSize.height !== "number") {
              break;
            }
            paneCount++;
          }
        } catch {
        }
        return paneCount;
      };
      const totalPanes = getTotalPaneCount();
      const getMarginForPosition = (pos) => {
        const baseMargin = UniversalSpacing.EDGE_PADDING;
        const margins2 = {
          top: baseMargin + priceScaleLabelHeight,
          // Add space for price scale labels at top
          right: baseMargin + actualPriceScaleWidth,
          // Add space for price scale width
          bottom: baseMargin,
          // Base margin for bottom
          left: baseMargin
        };
        if (pos.includes("bottom") && totalPanes === 1) {
          margins2.bottom += actualTimeScaleHeight;
        }
        return margins2;
      };
      const margins = getMarginForPosition(position);
      const rangeSwitcherDimensions = { width: 200, height: 40 };
      let top = 0;
      let left = 0;
      let right;
      let bottom;
      switch (position) {
        case "top-left":
          top = margins.top;
          left = margins.left;
          right = void 0;
          break;
        case "top-right":
          top = margins.top;
          left = void 0;
          right = margins.right;
          break;
        case "bottom-left":
          top = paneCoords.y + paneCoords.height - margins.bottom - rangeSwitcherDimensions.height;
          left = margins.left;
          right = void 0;
          bottom = void 0;
          break;
        case "bottom-right":
          top = paneCoords.y + paneCoords.height - margins.bottom - rangeSwitcherDimensions.height;
          left = void 0;
          right = margins.right;
          bottom = void 0;
          break;
        default:
          top = paneCoords.y + paneCoords.height - margins.bottom - rangeSwitcherDimensions.height;
          left = void 0;
          right = margins.right;
          break;
      }
      if (bottom !== void 0 && top === 0) {
        top = container.height - bottom - rangeSwitcherDimensions.height;
        bottom = void 0;
      }
      return {
        top,
        left: left ?? 0,
        right,
        bottom,
        width: rangeSwitcherDimensions.width,
        height: rangeSwitcherDimensions.height,
        zIndex: 1e3
      };
    } catch {
      return null;
    }
  }
  /**
   * Calculate legend position within a pane
   */
  getLegendPosition(chart, paneId, position) {
    const paneCoords = this.getPaneCoordinates(chart, paneId);
    if (!paneCoords) return null;
    const margins = getMargins("legend");
    const legendDimensions = DIMENSIONS.legend;
    let top = 0;
    let left = 0;
    let right;
    let bottom;
    switch (position) {
      case "top-left":
        top = paneCoords.contentArea.top + margins.top;
        left = paneCoords.contentArea.left + margins.left;
        break;
      case "top-right":
        top = paneCoords.contentArea.top + margins.top;
        right = margins.right;
        break;
      case "top-center":
        top = paneCoords.contentArea.top + margins.top;
        left = paneCoords.contentArea.left + (paneCoords.contentArea.width - legendDimensions.defaultWidth) / 2;
        break;
      case "bottom-left":
        bottom = margins.bottom;
        left = paneCoords.contentArea.left + margins.left;
        break;
      case "bottom-right":
        bottom = margins.bottom;
        right = margins.right;
        break;
      case "bottom-center":
        bottom = margins.bottom;
        left = paneCoords.contentArea.left + (paneCoords.contentArea.width - legendDimensions.defaultWidth) / 2;
        break;
      case "center":
        top = paneCoords.contentArea.top + (paneCoords.contentArea.height - legendDimensions.defaultHeight) / 2;
        left = paneCoords.contentArea.left + (paneCoords.contentArea.width - legendDimensions.defaultWidth) / 2;
        break;
    }
    if (bottom !== void 0 && top === 0) {
      top = bottom;
      bottom = void 0;
    }
    return {
      top,
      left,
      right,
      bottom,
      width: legendDimensions.defaultWidth,
      height: legendDimensions.defaultHeight,
      zIndex: Z_INDEX.legend
    };
  }
  /**
   * Subscribe to coordinate updates
   */
  onCoordinateUpdate(chartId, callback) {
    if (!this.updateCallbacks.has(chartId)) {
      this.updateCallbacks.set(chartId, /* @__PURE__ */ new Set());
    }
    const callbacks = this.updateCallbacks.get(chartId);
    if (callbacks) {
      callbacks.add(callback);
    }
    return () => {
      const callbacks2 = this.updateCallbacks.get(chartId);
      if (callbacks2) {
        callbacks2.delete(callback);
      }
    };
  }
  /**
   * Invalidate cache for a specific chart
   */
  invalidateCache(chartId) {
    if (chartId) {
      const keysToDelete = [];
      this.coordinateCache.forEach((entry, key) => {
        if (key.includes(chartId)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.coordinateCache.delete(key));
    } else {
      this.coordinateCache.clear();
    }
  }
  /**
   * Calculate coordinates for a chart
   */
  async calculateCoordinates(chart, container, includeMargins) {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        try {
          const containerDimensions = this.getContainerDimensions(container);
          const timeScale = this.getTimeScaleDimensions(chart, containerDimensions);
          const priceScaleLeft = this.getPriceScaleDimensions(chart, "left", containerDimensions);
          const priceScaleRight = this.getPriceScaleDimensions(chart, "right", containerDimensions);
          const panes = this.getAllPaneCoordinates(chart);
          const contentArea = this.calculateContentArea(
            containerDimensions,
            timeScale,
            priceScaleLeft,
            includeMargins
          );
          const coordinates = {
            container: containerDimensions,
            timeScale,
            priceScaleLeft,
            priceScaleRight,
            panes,
            contentArea,
            timestamp: Date.now(),
            isValid: true
          };
          resolve(coordinates);
        } catch {
          resolve(sanitizeCoordinates({}));
        }
      });
    });
  }
  /**
   * Get container dimensions
   */
  getContainerDimensions(container) {
    const rect = container.getBoundingClientRect();
    return {
      width: rect.width || container.offsetWidth || getFallback("containerWidth"),
      height: rect.height || container.offsetHeight || getFallback("containerHeight"),
      offsetTop: container.offsetTop || 0,
      offsetLeft: container.offsetLeft || 0
    };
  }
  /**
   * Get time scale dimensions
   */
  getTimeScaleDimensions(chart, container) {
    try {
      const timeScale = chart.timeScale();
      const height = timeScale.height() || getFallback("timeScaleHeight");
      const width = timeScale.width() || container.width;
      return {
        x: 0,
        y: container.height - height,
        width,
        height
      };
    } catch {
      return {
        x: 0,
        y: container.height - getFallback("timeScaleHeight"),
        width: container.width,
        height: getFallback("timeScaleHeight")
      };
    }
  }
  /**
   * Get price scale dimensions
   */
  getPriceScaleDimensions(chart, side, container) {
    try {
      const priceScale = chart.priceScale(side);
      const width = priceScale.width() || (side === "left" ? getFallback("priceScaleWidth") : 0);
      return {
        x: side === "left" ? 0 : container.width - width,
        y: 0,
        width,
        height: container.height - getFallback("timeScaleHeight")
      };
    } catch {
      const defaultWidth = side === "left" ? getFallback("priceScaleWidth") : 0;
      return {
        x: side === "left" ? 0 : container.width - defaultWidth,
        y: 0,
        width: defaultWidth,
        height: container.height - getFallback("timeScaleHeight")
      };
    }
  }
  /**
   * Get all pane coordinates
   */
  getAllPaneCoordinates(chart) {
    const panes = [];
    let paneIndex = 0;
    while (paneIndex < 10) {
      try {
        const paneSize = chart.paneSize(paneIndex);
        if (!paneSize) break;
        const paneCoords = this.getPaneCoordinates(chart, paneIndex);
        if (paneCoords) {
          panes.push(paneCoords);
        }
        paneIndex++;
      } catch {
        break;
      }
    }
    if (panes.length === 0) {
      const fallbackWidth = getFallback("paneWidth");
      const fallbackHeight = getFallback("paneHeight");
      const priceScaleWidth = getFallback("priceScaleWidth");
      const timeScaleHeight = getFallback("timeScaleHeight");
      panes.push({
        paneId: 0,
        x: 0,
        y: 0,
        width: fallbackWidth,
        height: fallbackHeight,
        absoluteX: 0,
        absoluteY: 0,
        contentArea: {
          top: 0,
          left: priceScaleWidth,
          width: fallbackWidth - priceScaleWidth,
          height: fallbackHeight - timeScaleHeight
        },
        margins: getMargins("pane"),
        isMainPane: true,
        isLastPane: true
      });
    }
    return panes;
  }
  /**
   * Calculate content area
   */
  calculateContentArea(container, timeScale, priceScaleLeft, includeMargins) {
    const margins = includeMargins ? getMargins("content") : { top: 0, right: 0, bottom: 0, left: 0 };
    const x = priceScaleLeft.width + margins.left;
    const y = margins.top;
    const width = container.width - priceScaleLeft.width - margins.left - margins.right;
    const height = container.height - timeScale.height - margins.top - margins.bottom;
    return createBoundingBox(x, y, width, height);
  }
  /**
   * Get price scale width helper
   */
  getPriceScaleWidth(chart, side = "left") {
    try {
      const priceScale = chart.priceScale(side);
      const width = priceScale.width();
      if (!width || width === 0) {
        return 0;
      }
      return width;
    } catch {
      return 0;
    }
  }
  /**
   * Get time scale height helper
   */
  getTimeScaleHeight(chart) {
    try {
      const timeScale = chart.timeScale();
      return timeScale.height() || getFallback("timeScaleHeight");
    } catch {
      return getFallback("timeScaleHeight");
    }
  }
  /**
   * Generate cache key
   */
  generateCacheKey(chart, container) {
    const chartId = chart?.chartElement?.()?.id || "unknown";
    const containerId = container?.id || "unknown";
    return `${chartId}-${containerId}`;
  }
  /**
   * Notify update callbacks
   */
  notifyUpdateCallbacks(cacheKey) {
    const chartId = cacheKey.split("-")[0];
    const callbacks = this.updateCallbacks.get(chartId);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          logger.error("Callback execution failed", "ChartCoordinateService", error);
        }
      });
    }
  }
  /**
   * Start cache cleanup timer
   */
  startCacheCleanup() {
    if (this.cacheCleanupIntervalId !== null) {
      clearInterval(this.cacheCleanupIntervalId);
    }
    this.cacheCleanupIntervalId = setInterval(() => {
      const now = Date.now();
      const keysToDelete = [];
      this.coordinateCache.forEach((entry, key) => {
        if (entry.expiresAt < now) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => this.coordinateCache.delete(key));
    }, TIMING.cacheExpiration);
  }
  /**
   * Stop cache cleanup timer and clean up resources
   * Call this when destroying the service instance
   */
  destroy() {
    if (this.cacheCleanupIntervalId !== null) {
      clearInterval(this.cacheCleanupIntervalId);
      this.cacheCleanupIntervalId = null;
    }
    this.coordinateCache.clear();
    this.paneDimensionsCache.clear();
    this.chartRegistry.clear();
    this.updateCallbacks.clear();
  }
  /**
   * Reset the singleton instance (useful for testing)
   */
  static resetInstance() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
  /**
   * Get current pane dimensions for comparison
   */
  getCurrentPaneDimensions(chart) {
    const dimensions = {};
    let paneIndex = 0;
    while (paneIndex < 10) {
      try {
        const paneSize = chart.paneSize(paneIndex);
        if (!paneSize) break;
        dimensions[paneIndex] = {
          width: paneSize.width || 0,
          height: paneSize.height || 0
        };
        paneIndex++;
      } catch {
        break;
      }
    }
    return dimensions;
  }
  /**
   * Check if pane dimensions have changed and notify listeners
   */
  checkPaneSizeChanges(chart, chartId) {
    const currentDimensions = this.getCurrentPaneDimensions(chart);
    const cacheKey = this.generateCacheKey(chart, chart.chartElement());
    const cachedPaneDimensions = this.paneDimensionsCache.get(cacheKey);
    if (!cachedPaneDimensions) {
      this.paneDimensionsCache.set(cacheKey, {
        dimensions: currentDimensions,
        expiresAt: Date.now() + TIMING.cacheExpiration
      });
      return false;
    }
    const hasChanges = this.hasPaneSizeChanges(cachedPaneDimensions.dimensions, currentDimensions);
    if (hasChanges) {
      cachedPaneDimensions.dimensions = currentDimensions;
      cachedPaneDimensions.expiresAt = Date.now() + TIMING.cacheExpiration;
      this.invalidateCache(chartId);
      this.notifyUpdateCallbacks(cacheKey);
      return true;
    }
    return false;
  }
  /**
   * Enhanced pane size change detection with better performance
   */
  checkPaneSizeChangesOptimized(chart, chartId) {
    const currentDimensions = this.getCurrentPaneDimensions(chart);
    const cacheKey = this.generateCacheKey(chart, chart.chartElement());
    const cachedPaneDimensions = this.paneDimensionsCache.get(cacheKey);
    if (!cachedPaneDimensions) {
      this.paneDimensionsCache.set(cacheKey, {
        dimensions: currentDimensions,
        expiresAt: Date.now() + TIMING.cacheExpiration
      });
      return false;
    }
    const hasChanges = this.hasPaneSizeChanges(cachedPaneDimensions.dimensions, currentDimensions);
    if (hasChanges) {
      cachedPaneDimensions.dimensions = currentDimensions;
      cachedPaneDimensions.expiresAt = Date.now() + TIMING.cacheExpiration;
      this.invalidateCache(chartId);
      this.notifyUpdateCallbacks(cacheKey);
      return true;
    }
    return false;
  }
  /**
   * Force refresh of coordinates for a specific chart
   * Useful when external changes affect chart layout
   */
  forceRefreshCoordinates(chartId) {
    const keysToDelete = [];
    this.coordinateCache.forEach((entry, key) => {
      if (key.includes(chartId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.coordinateCache.delete(key));
    const paneKeysToDelete = [];
    this.paneDimensionsCache.forEach((entry, key) => {
      if (key.includes(chartId)) {
        paneKeysToDelete.push(key);
      }
    });
    paneKeysToDelete.forEach((key) => this.paneDimensionsCache.delete(key));
    this.updateCallbacks.forEach((callbacks, key) => {
      if (key.includes(chartId)) {
        callbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            logger.error("Cache cleanup callback failed", "ChartCoordinateService", error);
          }
        });
      }
    });
  }
  /**
   * Check if pane dimensions have changed
   */
  hasPaneSizeChanges(oldDimensions, newDimensions) {
    const oldKeys = Object.keys(oldDimensions);
    const newKeys = Object.keys(newDimensions);
    if (oldKeys.length !== newKeys.length) {
      return true;
    }
    for (const paneId of oldKeys) {
      const oldDim = oldDimensions[parseInt(paneId)];
      const newDim = newDimensions[parseInt(paneId)];
      if (!oldDim || !newDim) {
        return true;
      }
      if (oldDim.width !== newDim.width || oldDim.height !== newDim.height) {
        return true;
      }
    }
    return false;
  }
  /**
   * Integration with CornerLayoutManager
   * Get chart dimensions for layout manager
   */
  getChartDimensionsForLayout(chart) {
    try {
      const chartElement = chart.chartElement();
      if (!chartElement) return null;
      const rect = chartElement.getBoundingClientRect();
      return {
        width: rect.width || chartElement.offsetWidth || 800,
        height: rect.height || chartElement.offsetHeight || 600
      };
    } catch {
      return null;
    }
  }
  /**
   * Get chart layout dimensions including axis information for layout manager
   */
  getChartLayoutDimensionsForManager(chart) {
    try {
      const chartElement = chart.chartElement();
      if (!chartElement) return null;
      const rect = chartElement.getBoundingClientRect();
      const container = {
        width: rect.width || chartElement.offsetWidth || 800,
        height: rect.height || chartElement.offsetHeight || 600
      };
      let leftPriceScaleWidth = 0;
      let rightPriceScaleWidth = 0;
      let timeScaleHeight = 0;
      try {
        const timeScale = chart.timeScale();
        timeScaleHeight = timeScale.height() || 35;
        const leftPriceScale = chart.priceScale("left");
        if (leftPriceScale) {
          leftPriceScaleWidth = leftPriceScale.width() || 0;
        }
        const rightPriceScale = chart.priceScale("right");
        if (rightPriceScale) {
          rightPriceScaleWidth = rightPriceScale.width() || 0;
        }
        if (leftPriceScaleWidth === 0 && rightPriceScaleWidth === 0) {
          rightPriceScaleWidth = 70;
        }
      } catch {
        rightPriceScaleWidth = 70;
        timeScaleHeight = 35;
      }
      return {
        container,
        axis: {
          priceScale: {
            left: {
              width: leftPriceScaleWidth,
              height: container.height - timeScaleHeight
            },
            right: {
              width: rightPriceScaleWidth,
              height: container.height - timeScaleHeight
            }
          },
          timeScale: {
            width: container.width,
            height: timeScaleHeight
          }
        }
      };
    } catch {
      return {
        container: { width: 800, height: 600 },
        axis: {
          priceScale: {
            left: { width: 0, height: 565 },
            right: { width: 70, height: 565 }
          },
          timeScale: { width: 800, height: 35 }
        }
      };
    }
  }
  /**
   * Convert ElementPosition to Corner for layout manager
   */
  positionToCorner(position) {
    switch (position) {
      case "top-left":
        return "top-left";
      case "top-right":
        return "top-right";
      case "bottom-left":
        return "bottom-left";
      case "bottom-right":
        return "bottom-right";
      case "top-center":
        return "top-right";
      // Fallback to top-right
      case "bottom-center":
        return "bottom-right";
      // Fallback to bottom-right
      case "center":
        return "top-right";
      // Fallback to top-right
      default:
        return "top-right";
    }
  }
  /**
   * ================================
   * POSITIONING ENGINE FUNCTIONALITY
   * Absorbed from PositioningEngine to ensure single source of truth
   * ================================
   */
  /**
   * Calculate legend position with consistent logic
   */
  calculateLegendPosition(chart, paneId, position, config) {
    const paneCoords = this.getPaneCoordinates(chart, paneId);
    if (!paneCoords) return null;
    const margins = { ...getMargins("legend"), ...config?.margins || {} };
    const dimensions = {
      width: config?.dimensions?.width || DIMENSIONS.legend.defaultWidth,
      height: config?.dimensions?.height || DIMENSIONS.legend.defaultHeight
    };
    const zIndex = config?.zIndex || Z_INDEX.legend;
    const offset = config?.offset || { x: 0, y: 0 };
    const coords = this.calculateElementPosition(
      {
        x: paneCoords.x,
        y: paneCoords.y,
        width: paneCoords.width,
        height: paneCoords.height,
        top: paneCoords.y,
        left: paneCoords.x,
        right: paneCoords.x + paneCoords.width,
        bottom: paneCoords.y + paneCoords.height
      },
      dimensions,
      position,
      margins,
      offset
    );
    return {
      ...coords,
      width: dimensions.width,
      height: dimensions.height,
      zIndex
    };
  }
  /**
   * Recalculate legend position with actual element dimensions
   */
  recalculateLegendPosition(chart, paneId, position, legendElement, config) {
    const paneCoords = this.getPaneCoordinates(chart, paneId);
    if (!paneCoords) return null;
    let actualDimensions = {
      width: legendElement.offsetWidth || legendElement.scrollWidth || 0,
      height: legendElement.offsetHeight || legendElement.scrollHeight || 0
    };
    if (actualDimensions.width === 0 || actualDimensions.height === 0) {
      const computedStyle = window.getComputedStyle(legendElement);
      actualDimensions = {
        width: parseInt(computedStyle.width) || legendElement.clientWidth || DIMENSIONS.legend.defaultWidth,
        height: parseInt(computedStyle.height) || legendElement.clientHeight || DIMENSIONS.legend.defaultHeight
      };
    }
    actualDimensions.width = Math.max(actualDimensions.width, DIMENSIONS.legend.minWidth);
    actualDimensions.height = Math.max(actualDimensions.height, DIMENSIONS.legend.minHeight);
    const margins = { ...getMargins("legend"), ...config?.margins || {} };
    const zIndex = config?.zIndex || Z_INDEX.legend;
    const offset = config?.offset || { x: 0, y: 0 };
    const coords = this.calculateElementPosition(
      {
        x: paneCoords.x,
        y: paneCoords.y,
        width: paneCoords.width,
        height: paneCoords.height,
        top: paneCoords.y,
        left: paneCoords.x,
        right: paneCoords.x + paneCoords.width,
        bottom: paneCoords.y + paneCoords.height
      },
      actualDimensions,
      position,
      margins,
      offset
    );
    return {
      ...coords,
      width: actualDimensions.width,
      height: actualDimensions.height,
      zIndex
    };
  }
  /**
   * Calculate tooltip position relative to cursor
   */
  calculateTooltipPosition(cursorX, cursorY, tooltipWidth, tooltipHeight, containerBounds, preferredAnchor = "top") {
    const margins = getMargins("tooltip");
    const offset = { x: 10, y: 10 };
    let x = cursorX;
    let y = cursorY;
    let anchor = preferredAnchor;
    switch (preferredAnchor) {
      case "top":
        x = cursorX - tooltipWidth / 2;
        y = cursorY - tooltipHeight - offset.y;
        break;
      case "bottom":
        x = cursorX - tooltipWidth / 2;
        y = cursorY + offset.y;
        break;
      case "left":
        x = cursorX - tooltipWidth - offset.x;
        y = cursorY - tooltipHeight / 2;
        break;
      case "right":
        x = cursorX + offset.x;
        y = cursorY - tooltipHeight / 2;
        break;
    }
    if (x < containerBounds.left + margins.left) {
      x = containerBounds.left + margins.left;
      if (anchor === "left") anchor = "right";
    }
    if (x + tooltipWidth > containerBounds.right - margins.right) {
      x = containerBounds.right - tooltipWidth - margins.right;
      if (anchor === "right") anchor = "left";
    }
    if (y < containerBounds.top + margins.top) {
      y = containerBounds.top + margins.top;
      if (anchor === "top") anchor = "bottom";
    }
    if (y + tooltipHeight > containerBounds.bottom - margins.bottom) {
      y = containerBounds.bottom - tooltipHeight - margins.bottom;
      if (anchor === "bottom") anchor = "top";
    }
    return { x, y, anchor, offset };
  }
  /**
   * Calculate overlay position (for rectangles, annotations, etc.)
   * Note: This requires a series to convert prices to coordinates
   */
  calculateOverlayPosition(startTime, endTime, startPrice, endPrice, chart, series, _paneId = 0) {
    try {
      const timeScale = chart.timeScale();
      const x1 = timeScale.timeToCoordinate(startTime);
      const x2 = timeScale.timeToCoordinate(endTime);
      let y1 = null;
      let y2 = null;
      if (series) {
        y1 = series.priceToCoordinate(startPrice);
        y2 = series.priceToCoordinate(endPrice);
      } else {
        const chartElement = chart.chartElement();
        if (chartElement) {
          const height2 = chartElement.clientHeight;
          y1 = height2 * 0.3;
          y2 = height2 * 0.7;
        }
      }
      if (x1 === null || x2 === null || y1 === null || y2 === null) {
        return null;
      }
      const x = Math.min(x1, x2);
      const y = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      return createBoundingBox(x, y, width, height);
    } catch {
      return null;
    }
  }
  /**
   * Calculate multi-pane layout positions
   */
  calculateMultiPaneLayout(totalHeight, paneHeights) {
    const layout = {};
    if (paneHeights === "equal") {
      const paneCount = Object.keys(layout).length || 1;
      const heightPerPane = totalHeight / paneCount;
      for (let i = 0; i < paneCount; i++) {
        layout[i] = createBoundingBox(
          0,
          i * heightPerPane,
          0,
          // Width will be set by chart
          heightPerPane
        );
      }
    } else if (Array.isArray(paneHeights)) {
      let currentY = 0;
      paneHeights.forEach((height, index) => {
        layout[index] = createBoundingBox(
          0,
          currentY,
          0,
          // Width will be set by chart
          height
        );
        currentY += height;
      });
    } else {
      let currentY = 0;
      for (const [paneId, height] of Object.entries(paneHeights)) {
        layout[Number(paneId)] = createBoundingBox(
          0,
          currentY,
          0,
          // Width will be set by chart
          height
        );
        currentY += height;
      }
    }
    return layout;
  }
  /**
   * Calculate crosshair label position
   */
  calculateCrosshairLabelPosition(crosshairX, crosshairY, labelWidth, labelHeight, containerBounds, axis) {
    const margins = getMargins("content");
    if (axis === "x") {
      return {
        x: Math.max(
          containerBounds.left + margins.left,
          Math.min(crosshairX - labelWidth / 2, containerBounds.right - labelWidth - margins.right)
        ),
        y: containerBounds.bottom - labelHeight - margins.bottom
      };
    } else {
      return {
        x: containerBounds.right - labelWidth - margins.right,
        y: Math.max(
          containerBounds.top + margins.top,
          Math.min(
            crosshairY - labelHeight / 2,
            containerBounds.bottom - labelHeight - margins.bottom
          )
        )
      };
    }
  }
  /**
   * Calculate element position within bounds
   */
  calculateElementPosition(bounds, dimensions, position, margins, offset) {
    const offsetX = offset.x || 0;
    const offsetY = offset.y || 0;
    switch (position) {
      case "top-left":
        return {
          top: bounds.top + margins.top + offsetY,
          left: bounds.left + margins.left + offsetX
        };
      case "top-right":
        return {
          top: bounds.top + margins.top + offsetY,
          left: bounds.right - dimensions.width - margins.right - offsetX,
          right: margins.right + offsetX
        };
      case "bottom-left":
        return {
          top: bounds.bottom - dimensions.height - margins.bottom - offsetY,
          left: bounds.left + margins.left + offsetX,
          bottom: margins.bottom + offsetY
        };
      case "bottom-right":
        return {
          top: bounds.bottom - dimensions.height - margins.bottom - offsetY,
          left: bounds.right - dimensions.width - margins.right - offsetX,
          right: margins.right + offsetX,
          bottom: margins.bottom + offsetY
        };
      case "center":
        return {
          top: bounds.top + (bounds.height - dimensions.height) / 2 + offsetY,
          left: bounds.left + (bounds.width - dimensions.width) / 2 + offsetX
        };
      default:
        return {
          top: bounds.top + margins.top + offsetY,
          left: bounds.left + margins.left + offsetX
        };
    }
  }
  /**
   * Validate positioning constraints
   */
  validatePositioning(element, container) {
    const adjustments = {};
    let isValid = true;
    if (element.left < container.left) {
      adjustments.x = container.left - element.left;
      isValid = false;
    } else if (element.right > container.right) {
      adjustments.x = container.right - element.right;
      isValid = false;
    }
    if (element.top < container.top) {
      adjustments.y = container.top - element.top;
      isValid = false;
    } else if (element.bottom > container.bottom) {
      adjustments.y = container.bottom - element.bottom;
      isValid = false;
    }
    return { isValid, adjustments };
  }
  /**
   * Apply positioning to DOM element
   */
  applyPositionToElement(element, coordinates) {
    element.style.top = "auto";
    element.style.left = "auto";
    element.style.right = "auto";
    element.style.bottom = "auto";
    if (coordinates.top !== void 0) {
      element.style.top = `${coordinates.top}px`;
    }
    if (coordinates.left !== void 0) {
      element.style.left = `${coordinates.left}px`;
    }
    if (coordinates.right !== void 0) {
      element.style.right = `${coordinates.right}px`;
    }
    if (coordinates.bottom !== void 0) {
      element.style.bottom = `${coordinates.bottom}px`;
    }
    if ("zIndex" in coordinates && coordinates.zIndex !== void 0) {
      element.style.zIndex = String(coordinates.zIndex);
    }
    if (!element.style.position || element.style.position === "static") {
      element.style.position = "absolute";
    }
  }
  /**
   * Calculate responsive scaling factor
   */
  calculateScalingFactor(currentWidth, currentHeight, baseWidth = DIMENSIONS.chart.defaultWidth, baseHeight = DIMENSIONS.chart.defaultHeight) {
    const scaleX = currentWidth / baseWidth;
    const scaleY = currentHeight / baseHeight;
    const uniform = Math.min(scaleX, scaleY);
    return { x: scaleX, y: scaleY, uniform };
  }
  /**
   * Calculate widget stack position for layout manager support
   */
  calculateWidgetStackPosition(chart, paneId, corner, widgets, index) {
    const paneCoords = this.getPaneCoordinates(chart, paneId);
    if (!paneCoords) return null;
    const isTopCorner = corner.startsWith("top");
    const isRightCorner = corner.endsWith("right");
    const axisDimensions = this.getAxisDimensions(chart);
    let cumulativeHeight = 0;
    for (let i = 0; i < index; i++) {
      const prevWidget = widgets[i];
      if (prevWidget && prevWidget.visible && prevWidget.getDimensions) {
        const dims = prevWidget.getDimensions();
        let height = dims.height;
        if (height === 0) {
          if (prevWidget.getContainerClassName && prevWidget.getContainerClassName().includes("legend")) {
            height = 24;
          } else if (prevWidget.getContainerClassName && prevWidget.getContainerClassName().includes("button")) {
            height = 16;
          } else {
            height = 20;
          }
        }
        cumulativeHeight += height + UniversalSpacing.WIDGET_GAP;
      }
    }
    const position = {
      zIndex: 1e3 + index
    };
    const edgePadding = UniversalSpacing.EDGE_PADDING;
    if (isRightCorner) {
      position.right = edgePadding + axisDimensions.rightPriceScaleWidth;
    } else {
      position.left = edgePadding + axisDimensions.leftPriceScaleWidth;
    }
    if (isTopCorner) {
      position.top = paneCoords.y + edgePadding + cumulativeHeight;
    } else {
      let bottomOffset = edgePadding + cumulativeHeight;
      const isLastPane = this.isLastPane(chart, paneId);
      if (isLastPane) {
        bottomOffset += axisDimensions.timeScaleHeight;
      }
      position.bottom = bottomOffset;
    }
    return position;
  }
  /**
   * Get actual axis dimensions from lightweight-charts APIs
   */
  getAxisDimensions(chart) {
    let timeScaleHeight = 35;
    let leftPriceScaleWidth = 0;
    let rightPriceScaleWidth = 70;
    try {
      timeScaleHeight = chart.timeScale().height();
    } catch {
    }
    try {
      const leftPriceScale = chart.priceScale("left");
      if (leftPriceScale) {
        leftPriceScaleWidth = leftPriceScale.width();
      }
    } catch {
    }
    try {
      const rightPriceScale = chart.priceScale("right");
      if (rightPriceScale) {
        rightPriceScaleWidth = rightPriceScale.width();
      }
    } catch {
    }
    return {
      timeScaleHeight,
      leftPriceScaleWidth,
      rightPriceScaleWidth
    };
  }
  /**
   * Check if the given pane is the last pane in the chart
   */
  isLastPane(chart, paneId) {
    try {
      chart.paneSize(paneId + 1);
      return false;
    } catch {
      return true;
    }
  }
  /**
   * Calculate cumulative offset for widget stacking
   */
  calculateCumulativeOffset(widgets, index, gap = 8) {
    let cumulativeHeight = 0;
    for (let i = 0; i < index; i++) {
      const prevWidget = widgets[i];
      if (prevWidget && prevWidget.visible && prevWidget.getDimensions) {
        const dims = prevWidget.getDimensions();
        cumulativeHeight += dims.height + gap;
      }
    }
    return cumulativeHeight;
  }
  /**
   * Validate stacking bounds for overflow detection
   */
  validateStackingBounds(corner, widgets, containerBounds) {
    const overflowing = [];
    const isTopCorner = corner.startsWith("top");
    let cumulativeHeight = UniversalSpacing.EDGE_PADDING;
    for (const widget of widgets) {
      if (!widget.visible || !widget.getDimensions) continue;
      const dims = widget.getDimensions();
      const totalHeightRequired = cumulativeHeight + dims.height + UniversalSpacing.EDGE_PADDING;
      if (isTopCorner) {
        if (totalHeightRequired > containerBounds.height) {
          overflowing.push(widget);
        }
      } else {
        if (totalHeightRequired > containerBounds.height) {
          overflowing.push(widget);
        }
      }
      cumulativeHeight += dims.height + UniversalSpacing.WIDGET_GAP;
    }
    return {
      isValid: overflowing.length === 0,
      overflowingWidgets: overflowing
    };
  }
  /**
   * Setup automatic layout manager updates when chart dimensions change
   */
  setupLayoutManagerIntegration(chart, layoutManager) {
    const updateLayoutManager = () => {
      const layoutDimensions = this.getChartLayoutDimensionsForManager(chart);
      if (layoutDimensions) {
        layoutManager.updateChartLayout(layoutDimensions);
      }
    };
    const fastUpdateLayoutManager = () => {
      if (layoutManager.updateChartDimensionsFromElement) {
        layoutManager.updateChartDimensionsFromElement();
      } else {
        updateLayoutManager();
      }
    };
    updateLayoutManager();
    requestAnimationFrame(() => {
      updateLayoutManager();
    });
    try {
      const chartElement = chart.chartElement();
      if (chartElement && typeof ResizeObserver !== "undefined") {
        let lastLayoutUpdate = 0;
        const layoutThrottleDelay = 16;
        const resizeObserver = new ResizeObserver(() => {
          const now = Date.now();
          if (now - lastLayoutUpdate >= layoutThrottleDelay) {
            lastLayoutUpdate = now;
            fastUpdateLayoutManager();
          }
        });
        resizeObserver.observe(chartElement);
      }
      let lastPaneSizes = [];
      const checkPaneChanges = () => {
        try {
          const currentPaneSizes = [];
          for (let i = 0; i < 10; i++) {
            try {
              const paneSize = chart.paneSize(i);
              if (paneSize) {
                currentPaneSizes[i] = { width: paneSize.width, height: paneSize.height };
              }
            } catch {
              break;
            }
          }
          let changed = currentPaneSizes.length !== lastPaneSizes.length;
          if (!changed) {
            for (let i = 0; i < currentPaneSizes.length; i++) {
              const current = currentPaneSizes[i];
              const last = lastPaneSizes[i];
              if (!last || current.width !== last.width || current.height !== last.height) {
                changed = true;
                break;
              }
            }
          }
          if (changed) {
            lastPaneSizes = currentPaneSizes;
            updateLayoutManager();
          }
        } catch {
        }
      };
      const paneCheckInterval = setInterval(checkPaneChanges, 250);
      setTimeout(() => {
        clearInterval(paneCheckInterval);
      }, 3e5);
    } catch {
      const intervalId = setInterval(updateLayoutManager, 1e3);
      setTimeout(() => {
        clearInterval(intervalId);
      }, 6e4);
    }
  }
  // ============================================================================
  // Series Data Coordinate Conversion Methods
  // ============================================================================
  /**
   * Convert series data items to screen coordinates with unified validation
   *
   * This method provides DRY-compliant coordinate conversion for series plugins,
   * eliminating the need for duplicated conversion logic across different series.
   *
   * @param data - Data items to convert (from series pane view data)
   * @param scope - Bitmap coordinates rendering scope
   * @param priceConverter - Price to coordinate converter
   * @param config - Conversion configuration
   * @returns Array of converted coordinates
   */
  convertSeriesDataToScreenCoordinates(data, scope, priceConverter, config) {
    if (!data) return [];
    const coordinates = [];
    const { valueKeys, validateNumbers = true, checkFinite = true, customValidator } = config;
    for (const item of data) {
      const originalData = item.originalData;
      if (customValidator && !customValidator(originalData)) {
        continue;
      }
      if (validateNumbers) {
        const hasInvalidValues = valueKeys.some((key) => {
          const value = originalData[key];
          return typeof value !== "number" || isNaN(value) || checkFinite && !isFinite(value);
        });
        if (hasInvalidValues) {
          continue;
        }
      }
      const convertedValues = {};
      let hasAnyInvalidConversion = false;
      for (const key of valueKeys) {
        const value = originalData[key];
        const y = priceConverter(value);
        if (y == null || isNaN(y) || checkFinite && !isFinite(y)) {
          hasAnyInvalidConversion = true;
          convertedValues[key] = null;
        } else {
          convertedValues[key] = y * scope.verticalPixelRatio;
        }
      }
      coordinates.push({
        x: hasAnyInvalidConversion ? null : item.x * scope.horizontalPixelRatio,
        ...convertedValues
      });
    }
    return coordinates;
  }
  /**
   * Validate numeric data values for series
   *
   * @param data - Data object to validate
   * @param keys - Keys to validate
   * @param options - Validation options
   * @returns True if all values are valid
   */
  validateSeriesNumericData(data, keys, options = {}) {
    const { allowNull = false, allowUndefined = false, checkFinite = true } = options;
    return keys.every((key) => {
      const value = data[key];
      if (value === null && allowNull) return true;
      if (value === void 0 && allowUndefined) return true;
      if (typeof value !== "number") return false;
      if (isNaN(value)) return false;
      if (checkFinite && !isFinite(value)) return false;
      return true;
    });
  }
  /**
   * Convert price values to coordinates with error handling
   *
   * @param values - Price values to convert
   * @param priceConverter - Price to coordinate converter
   * @param pixelRatio - Vertical pixel ratio for scaling
   * @returns Converted coordinates or null if conversion fails
   */
  convertPricesToCoordinates(values, priceConverter, pixelRatio) {
    const result = {};
    for (const [key, value] of Object.entries(values)) {
      const y = priceConverter(value);
      if (y == null || isNaN(y) || !isFinite(y)) {
        return null;
      }
      result[key] = y * pixelRatio;
    }
    return result;
  }
};
_ChartCoordinateService.SeriesDataConfigs = {
  /** Configuration for ribbon series (upper, lower) */
  ribbon: {
    valueKeys: ["upper", "lower"],
    validateNumbers: true,
    checkFinite: true
  },
  /** Configuration for band series (upper, middle, lower) */
  band: {
    valueKeys: ["upper", "middle", "lower"],
    validateNumbers: true,
    checkFinite: true
  },
  /** Configuration for gradient ribbon series (upper, lower with fillColor) */
  gradientRibbon: {
    valueKeys: ["upper", "lower"],
    validateNumbers: true,
    checkFinite: true,
    customValidator: (data) => {
      return data.fillColor !== void 0 || data.upper !== void 0;
    }
  },
  /** Configuration for single value series */
  singleValue: {
    valueKeys: ["value"],
    validateNumbers: true,
    checkFinite: true
  }
};
let ChartCoordinateService = _ChartCoordinateService;
const _SingletonBase = class _SingletonBase {
  /**
   * Get singleton instance for a specific class
   *
   * @param constructor - The class constructor
   * @param key - Optional key for multiple instances of same class
   * @returns Singleton instance
   */
  static getInstance(constructor, key = constructor.name) {
    if (!_SingletonBase.instances.has(key)) {
      _SingletonBase.instances.set(key, new constructor());
    }
    return _SingletonBase.instances.get(key);
  }
  /**
   * Clear singleton instance (useful for testing)
   *
   * @param key - The key to clear, or clear all if not provided
   */
  static clearInstance(key) {
    if (key) {
      _SingletonBase.instances.delete(key);
    } else {
      _SingletonBase.instances.clear();
    }
  }
  /**
   * Check if instance exists
   *
   * @param key - The key to check
   * @returns True if instance exists
   */
  static hasInstance(key) {
    return _SingletonBase.instances.has(key);
  }
  /**
   * Get all instance keys (useful for debugging)
   *
   * @returns Array of instance keys
   */
  static getInstanceKeys() {
    return Array.from(_SingletonBase.instances.keys());
  }
  /**
   * Get instance count (useful for monitoring)
   *
   * @returns Number of active instances
   */
  static getInstanceCount() {
    return _SingletonBase.instances.size;
  }
};
_SingletonBase.instances = /* @__PURE__ */ new Map();
let SingletonBase = _SingletonBase;
function Singleton(key) {
  return function(constructor) {
    const instanceKey = key || constructor.name;
    constructor.getInstance = function() {
      return SingletonBase.getInstance(constructor, instanceKey);
    };
    constructor.clearInstance = function() {
      return SingletonBase.clearInstance(instanceKey);
    };
    constructor.hasInstance = function() {
      return SingletonBase.hasInstance(instanceKey);
    };
    return constructor;
  };
}
function createSingleton(constructor, key) {
  const instanceKey = key || constructor.name;
  return SingletonBase.getInstance(constructor, instanceKey);
}
export {
  TimeRangeSeconds as A,
  ButtonDimensions as B,
  ChartCoordinateService as C,
  DIMENSIONS as D,
  ButtonSpacing as E,
  FALLBACKS as F,
  ButtonEffects as G,
  ButtonColors as H,
  DefaultRangeSwitcherConfig as I,
  AnimationTiming as J,
  DefaultButtonConfig as K,
  LogLevel as L,
  MARGINS as M,
  DefaultLegendConfig as N,
  DefaultContainerConfig as O,
  RangeSwitcherLayout as R,
  SingletonBase as S,
  TIMING as T,
  UniversalSpacing as U,
  Z_INDEX as Z,
  Singleton as a,
  chartLog as b,
  createSingleton as c,
  perfLog as d,
  validateScaleDimensions as e,
  validatePaneCoordinates as f,
  validateBoundingBox as g,
  createBoundingBox as h,
  areCoordinatesStale as i,
  logValidationResult as j,
  getCoordinateDebugInfo as k,
  logger as l,
  getMargins as m,
  getDimensions as n,
  getFallback as o,
  primitiveLog as p,
  validateConfiguration as q,
  CSS_CLASSES as r,
  sanitizeCoordinates as s,
  LayoutSpacing as t,
  LegendDimensions as u,
  validateChartCoordinates as v,
  LegendColors as w,
  FormatDefaults as x,
  ContainerDefaults as y,
  CommonValues as z
};
//# sourceMappingURL=SingletonBase-MBQ3miuj.js.map
