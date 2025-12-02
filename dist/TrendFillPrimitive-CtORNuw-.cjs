"use strict";
const signalColorUtils = require("./signalColorUtils-pcf1rMp6.cjs");
function timeToCoordinate(time, chart) {
  const timeScale = chart.timeScale();
  return timeScale.timeToCoordinate(time);
}
function priceToCoordinate(price, series) {
  return series.priceToCoordinate(price);
}
function isValidCoordinate(point) {
  if (point.x === null) return false;
  for (const key in point) {
    const value = point[key];
    if (key !== "x" && value === null) {
      return false;
    }
  }
  return true;
}
function drawLine(ctx, coordinates, color, lineWidth, lineStyle = 0, startIndex, endIndex) {
  if (coordinates.length === 0) return;
  const start = startIndex ?? 0;
  const end = endIndex ?? coordinates.length;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  switch (lineStyle) {
    case 1:
      ctx.setLineDash([lineWidth, lineWidth * 2]);
      break;
    case 2:
      ctx.setLineDash([lineWidth * 4, lineWidth * 2]);
      break;
    default:
      ctx.setLineDash([]);
  }
  const rangeCoords = coordinates.slice(start, end);
  const hasNulls = rangeCoords.some((c) => c.x == null || c.y == null);
  if (hasNulls) {
    let segmentStart = -1;
    for (let i = start; i < end; i++) {
      const coord = coordinates[i];
      const isValid = coord.x !== null && coord.y !== null;
      if (isValid) {
        if (segmentStart === -1) segmentStart = i;
      } else if (segmentStart !== -1) {
        drawLineSegment(ctx, coordinates, segmentStart, i - 1);
        segmentStart = -1;
      }
    }
    if (segmentStart !== -1) {
      drawLineSegment(ctx, coordinates, segmentStart, end - 1);
    }
  } else {
    drawLineSegment(ctx, coordinates, start, end - 1);
  }
  ctx.restore();
}
function drawLineSegment(ctx, coordinates, startIdx, endIdx) {
  if (endIdx < startIdx) return;
  const firstCoord = coordinates[startIdx];
  ctx.beginPath();
  ctx.moveTo(firstCoord.x, firstCoord.y);
  for (let i = startIdx + 1; i <= endIdx; i++) {
    const coord = coordinates[i];
    ctx.lineTo(coord.x, coord.y);
  }
  ctx.stroke();
}
function drawMultiLine(ctx, coordinates, lineKey, color, lineWidth, lineStyle = 0, startIndex, endIndex) {
  const lineCoords = coordinates.map((coord) => ({
    x: coord.x,
    y: coord[lineKey]
  }));
  drawLine(ctx, lineCoords, color, lineWidth, lineStyle, startIndex, endIndex);
}
function drawFillArea(ctx, coordinates, upperKey, lowerKey, fillColor, startIndex, endIndex) {
  if (coordinates.length === 0) return;
  const start = startIndex ?? 0;
  const end = endIndex ?? coordinates.length;
  if (end - start < 2) return;
  ctx.save();
  ctx.fillStyle = fillColor;
  const rangeCoords = coordinates.slice(start, end);
  const hasNulls = rangeCoords.some((c) => c.x == null || c[upperKey] == null || c[lowerKey] == null);
  if (hasNulls) {
    let segmentStart = -1;
    for (let i = start; i < end; i++) {
      const coord = coordinates[i];
      const isValid = coord.x !== null && coord[upperKey] !== null && coord[lowerKey] !== null;
      if (isValid) {
        if (segmentStart === -1) segmentStart = i;
      } else if (segmentStart !== -1) {
        drawSegment(ctx, coordinates, segmentStart, i - 1, upperKey, lowerKey);
        segmentStart = -1;
      }
    }
    if (segmentStart !== -1) {
      drawSegment(ctx, coordinates, segmentStart, end - 1, upperKey, lowerKey);
    }
  } else {
    drawSegment(ctx, coordinates, start, end - 1, upperKey, lowerKey);
  }
  ctx.restore();
}
function drawSegment(ctx, coordinates, startIdx, endIdx, upperKey, lowerKey) {
  if (endIdx - startIdx < 1) return;
  ctx.beginPath();
  const firstCoord = coordinates[startIdx];
  ctx.moveTo(firstCoord.x, firstCoord[upperKey]);
  for (let i = startIdx + 1; i <= endIdx; i++) {
    const coord = coordinates[i];
    ctx.lineTo(coord.x, coord[upperKey]);
  }
  for (let i = endIdx; i >= startIdx; i--) {
    const coord = coordinates[i];
    ctx.lineTo(coord.x, coord[lowerKey]);
  }
  ctx.closePath();
  ctx.fill();
}
function convertToCoordinates(items, chart, series, valueKeys) {
  return items.map((item) => {
    const x = timeToCoordinate(item.time, chart);
    const coord = { x };
    for (const key of valueKeys) {
      const value = item[key];
      coord[key] = typeof value === "number" ? priceToCoordinate(value, series) : null;
    }
    return coord;
  });
}
function getBarSpacing(chart) {
  const timeScale = chart.timeScale();
  const options = timeScale.options();
  return options.barSpacing ?? 6;
}
function isWhitespaceDataMultiField(data, fields) {
  return fields.every((field) => {
    const value = data[field];
    return value === null || value === void 0;
  });
}
class BaseSeriesPrimitive {
  constructor(chart, options) {
    this._series = null;
    this._data = [];
    this._paneViews = [];
    this._priceAxisViews = [];
    this._chart = chart;
    this._options = { ...options };
    this._initializeViews();
  }
  /**
   * Get the default z-order for this primitive
   * Subclasses can override to provide custom defaults
   */
  _getDefaultZOrder() {
    return "normal";
  }
  // ===== ISeriesPrimitive Implementation =====
  /**
   * Called when primitive is attached to a series
   * Standardized implementation - subclasses can override for custom behavior
   */
  attached(params) {
    this._series = params.series;
    this._syncDataFromSeries();
  }
  /**
   * Called when primitive is detached from a series
   * Standardized implementation - subclasses can override for custom behavior
   */
  detached() {
    this._series = null;
    this._data = [];
  }
  /**
   * Get pane views for this primitive
   * Standardized implementation
   */
  paneViews() {
    return this._paneViews;
  }
  /**
   * Get price axis views for this primitive
   * Standardized implementation
   */
  priceAxisViews() {
    return this._priceAxisViews;
  }
  /**
   * Update all views
   * Standardized implementation - subclasses can override for custom behavior
   */
  updateAllViews() {
    this._paneViews.forEach((pv) => {
      if (typeof pv.update === "function") {
        pv.update();
      }
    });
  }
  // ===== BaseSeriesPrimitiveSource Implementation =====
  /**
   * Get chart instance
   */
  getChart() {
    return this._chart;
  }
  /**
   * Get attached series instance
   */
  getAttachedSeries() {
    return this._series;
  }
  /**
   * Get options
   */
  getOptions() {
    return this._options;
  }
  /**
   * Get processed data
   */
  getProcessedData() {
    return this._data;
  }
  // ===== Public API =====
  /**
   * Apply new options
   * Standardized implementation with data reprocessing
   */
  applyOptions(options) {
    this._options = { ...this._options, ...options };
    this._syncDataFromSeries();
    this.updateAllViews();
  }
  /**
   * Set data directly (for testing or manual data management)
   */
  setData(rawData) {
    this._data = this._processData(rawData);
    this.updateAllViews();
  }
  /**
   * Destroy the primitive (cleanup)
   * Standardized implementation - subclasses can override for custom cleanup
   */
  destroy() {
    this._series = null;
    this._data = [];
    this._paneViews = [];
    this._priceAxisViews = [];
  }
  // ===== Protected Helper Methods =====
  /**
   * Sync data from attached series
   * Standardized implementation
   */
  _syncDataFromSeries() {
    if (!this._series) {
      this._data = [];
      return;
    }
    const seriesData = this._series.data();
    this._data = this._processData(seriesData);
  }
  /**
   * Add a pane view to this primitive
   * Helper method for subclasses
   */
  _addPaneView(view) {
    this._paneViews.push(view);
  }
  /**
   * Add a price axis view to this primitive
   * Helper method for subclasses
   */
  _addPriceAxisView(view) {
    this._priceAxisViews.push(view);
  }
  /**
   * Get z-order based on options
   * Standardized implementation with consistent mapping
   */
  _getZOrder() {
    const zIndex = this._options.zIndex;
    if (typeof zIndex === "number") {
      if (zIndex < 0) return "bottom";
      if (zIndex >= 1e3) return "top";
      return "normal";
    }
    return this._getDefaultZOrder();
  }
}
class BaseSeriesPrimitivePaneView {
  constructor(source) {
    this._source = source;
  }
  /**
   * Get z-order for this view
   * Standardized implementation using source's z-order
   */
  zOrder() {
    return this._source._getZOrder();
  }
  /**
   * Update this view
   * Standardized implementation - subclasses can override for custom behavior
   */
  update() {
  }
}
class BaseSeriesPrimitiveAxisView {
  constructor(source) {
    this._source = source;
  }
  /**
   * Get text color for this axis view
   * Standardized implementation - subclasses can override
   */
  textColor() {
    return "#FFFFFF";
  }
  /**
   * Check if this axis view is visible
   * Standardized implementation - subclasses can override
   * Checks lastValueVisible since axis view shows the last value label
   */
  visible() {
    const series = this._source.getAttachedSeries();
    if (series) {
      const seriesOptions = series.options();
      if (seriesOptions) {
        return seriesOptions.lastValueVisible ?? true;
      }
    }
    return true;
  }
  /**
   * Check if tick is visible
   * Standardized implementation - subclasses can override
   */
  tickVisible() {
    return true;
  }
  /**
   * Get the last visible item using time-based range detection
   * Standardized implementation following TradingView best practices
   */
  _getLastVisibleItem() {
    const items = this._source.getProcessedData();
    if (items.length === 0) {
      return null;
    }
    const chart = this._source.getChart();
    const timeScale = chart.timeScale();
    const visibleTimeRange = timeScale.getVisibleRange();
    if (!visibleTimeRange) {
      return items[items.length - 1];
    }
    for (let i = items.length - 1; i >= 0; i--) {
      const itemTime = items[i].time;
      if (itemTime <= visibleTimeRange.to) {
        return items[i];
      }
    }
    return items[0];
  }
}
function createPrimitiveAxisView(field, colorField) {
  return class extends BaseSeriesPrimitiveAxisView {
    /**
     * Get the Y-coordinate for this axis view by converting the field value to screen coordinates
     */
    coordinate() {
      const lastItem = this._getLastVisibleItem();
      if (!lastItem) return 0;
      const series = this._source.getAttachedSeries();
      if (!series) return 0;
      const fieldValue = lastItem[field];
      if (fieldValue === null || fieldValue === void 0) return 0;
      const coordinate = series.priceToCoordinate(fieldValue);
      return coordinate ?? 0;
    }
    /**
     * Get the text to display on the price axis (formatted to 2 decimal places)
     */
    text() {
      const lastItem = this._getLastVisibleItem();
      if (!lastItem) return "";
      const fieldValue = lastItem[field];
      if (fieldValue === null || fieldValue === void 0) return "";
      return fieldValue.toFixed(2);
    }
    /**
     * Get the background color for this axis label from the options
     * Uses getSolidColorFromFill to extract solid color from rgba/hex strings
     */
    backColor() {
      const options = this._source.getOptions();
      const color = options[colorField];
      return signalColorUtils.getSolidColorFromFill(color);
    }
  };
}
function parseTime(time) {
  try {
    if (typeof time === "number") {
      if (time > 1e12) {
        return Math.floor(time / 1e3);
      }
      return Math.floor(time);
    }
    if (typeof time === "string") {
      const timestamp = parseInt(time, 10);
      if (!isNaN(timestamp)) {
        if (timestamp > 1e12) {
          return Math.floor(timestamp / 1e3);
        }
        return Math.floor(timestamp);
      }
      const date = new Date(time);
      if (isNaN(date.getTime())) {
        return 0;
      }
      return Math.floor(date.getTime() / 1e3);
    }
    return 0;
  } catch {
    return 0;
  }
}
class TrendFillPrimitiveRenderer {
  constructor(data) {
    this._viewData = data;
  }
  /**
   * Draw method - handles LINE drawing (foreground elements)
   * This method renders lines, markers, and other foreground elements
   * that should appear on top of fills and other series
   */
  draw(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      if (this._viewData.series) {
        const seriesOptions2 = this._viewData.series.options();
        if (seriesOptions2 && seriesOptions2.visible === false) return;
      }
      const hRatio = scope.horizontalPixelRatio;
      const vRatio = scope.verticalPixelRatio;
      ctx.save();
      const series = this._viewData.series;
      const seriesOptions = series ? series.options() : null;
      const uptrendLineVisible = seriesOptions?.uptrendLineVisible ?? this._viewData.options.uptrendLineVisible ?? true;
      const downtrendLineVisible = seriesOptions?.downtrendLineVisible ?? this._viewData.options.downtrendLineVisible ?? true;
      const baseLineVisible = seriesOptions?.baseLineVisible ?? this._viewData.options.baseLineVisible ?? false;
      if (uptrendLineVisible || downtrendLineVisible) {
        this._drawTrendLines(ctx, hRatio, vRatio);
      }
      if (baseLineVisible) {
        this._drawBaseLines(ctx, hRatio, vRatio);
      }
      ctx.restore();
    });
  }
  /**
   * Draw background method - handles FILL rendering (background elements)
   * This method renders fills, areas, and other background elements
   * that should appear behind lines and other series
   */
  drawBackground(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      if (this._viewData.series) {
        const seriesOptions2 = this._viewData.series.options();
        if (seriesOptions2 && seriesOptions2.visible === false) return;
      }
      const hRatio = scope.horizontalPixelRatio;
      const vRatio = scope.verticalPixelRatio;
      ctx.save();
      const series = this._viewData.series;
      const seriesOptions = series ? series.options() : null;
      const fillVisible = seriesOptions?.fillVisible ?? true;
      if (fillVisible) {
        this._drawTrendFills(ctx, hRatio, vRatio);
      }
      ctx.restore();
    });
  }
  /**
   * Draw filled areas between trend and base lines
   * Groups consecutive bars with same trend direction into continuous fills
   */
  _drawTrendFills(ctx, hRatio, vRatio) {
    const { items, visibleRange, useHalfBarWidth, barSpacing } = this._viewData.data;
    if (items.length === 0 || visibleRange === null) {
      return;
    }
    const series = this._viewData.series;
    const seriesOptions = series ? series.options() : null;
    const uptrendColor = seriesOptions?.uptrendFillColor || this._viewData.options.uptrendFillColor || "rgba(76, 175, 80, 0.3)";
    const downtrendColor = seriesOptions?.downtrendFillColor || this._viewData.options.downtrendFillColor || "rgba(244, 67, 54, 0.3)";
    const halfBarSpacing = barSpacing / 2;
    const calculateExtension = (xBitmap) => {
      if (!useHalfBarWidth) return 0;
      const xMedia = xBitmap / hRatio;
      return xBitmap - Math.round((xMedia - halfBarSpacing) * hRatio);
    };
    let currentGroup = [];
    let currentDirection = null;
    const flushGroup = () => {
      if (currentGroup.length < 1 || currentDirection === null) return;
      const fillColor = currentDirection > 0 ? uptrendColor : downtrendColor;
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      const firstBar = currentGroup[0];
      const lastBar = currentGroup[currentGroup.length - 1];
      const firstTransitionData = firstBar.transitionData;
      const lastTransitionData = lastBar.transitionData;
      let startX, startTrendY, startBaseY;
      if (firstTransitionData) {
        startX = firstTransitionData.x * hRatio;
        startTrendY = firstTransitionData.trendLineY * vRatio;
        startBaseY = firstTransitionData.baseLineY * vRatio;
      } else {
        const firstBarX = (firstBar.x ?? 0) * hRatio;
        startX = firstBarX - calculateExtension(firstBarX);
        startTrendY = (firstBar.trendLineY ?? 0) * vRatio;
        startBaseY = (firstBar.baseLineY ?? 0) * vRatio;
      }
      ctx.moveTo(startX, startTrendY);
      for (let i = 0; i < currentGroup.length; i++) {
        const bar = currentGroup[i];
        const x = (bar.x ?? 0) * hRatio;
        const y = (bar.trendLineY ?? 0) * vRatio;
        ctx.lineTo(x, y);
      }
      let endX, endTrendY, endBaseY;
      if (lastTransitionData) {
        endX = lastTransitionData.x * hRatio;
        endTrendY = lastTransitionData.trendLineY * vRatio;
        endBaseY = lastTransitionData.baseLineY * vRatio;
      } else {
        const lastBarX = (lastBar.x ?? 0) * hRatio;
        const lastXMedia = lastBarX / hRatio;
        endX = Math.round((lastXMedia + halfBarSpacing) * hRatio);
        endTrendY = (lastBar.trendLineY ?? 0) * vRatio;
        endBaseY = (lastBar.baseLineY ?? 0) * vRatio;
      }
      ctx.lineTo(endX, endTrendY);
      ctx.lineTo(endX, endBaseY);
      for (let i = currentGroup.length - 1; i >= 0; i--) {
        const bar = currentGroup[i];
        const x = (bar.x ?? 0) * hRatio;
        const y = (bar.baseLineY ?? 0) * vRatio;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(startX, startBaseY);
      ctx.closePath();
      ctx.fill();
    };
    let transitionData = null;
    for (let i = visibleRange.from; i < visibleRange.to; i++) {
      const bar = items[i];
      const nextBar = i + 1 < items.length ? items[i + 1] : null;
      if (!this._isValidCoordinates(bar) || bar.trendDirection === 0) {
        flushGroup();
        currentGroup = [];
        currentDirection = null;
        transitionData = null;
        continue;
      }
      const isDirectionChange = nextBar && this._isValidCoordinates(nextBar) && nextBar.trendDirection !== 0 && nextBar.trendDirection !== bar.trendDirection;
      if (bar.trendDirection !== currentDirection) {
        flushGroup();
        const barToAdd = transitionData ? {
          ...bar,
          transitionData: { ...transitionData }
        } : bar;
        currentGroup = [barToAdd];
        currentDirection = bar.trendDirection;
        transitionData = null;
      } else {
        currentGroup.push(bar);
      }
      if (isDirectionChange && nextBar && currentGroup.length > 0) {
        const currentX = bar.x ?? 0;
        const nextX = nextBar.x ?? 0;
        const transitionX = (currentX + nextX) / 2;
        const currentTrendY = bar.trendLineY ?? 0;
        const nextTrendY = nextBar.trendLineY ?? 0;
        const transitionTrendY = signalColorUtils.interpolateY(
          transitionX,
          currentX,
          currentTrendY,
          nextX,
          nextTrendY
        );
        const currentBaseY = bar.baseLineY ?? 0;
        const nextBaseY = nextBar.baseLineY ?? 0;
        const transitionBaseY = signalColorUtils.interpolateY(transitionX, currentX, currentBaseY, nextX, nextBaseY);
        const lastItem = currentGroup[currentGroup.length - 1];
        currentGroup[currentGroup.length - 1] = {
          ...lastItem,
          transitionData: {
            x: transitionX,
            trendLineY: transitionTrendY,
            baseLineY: transitionBaseY
          }
        };
        transitionData = {
          x: transitionX,
          trendLineY: transitionTrendY,
          baseLineY: transitionBaseY
        };
      }
    }
    flushGroup();
  }
  /**
   * Draw trend lines with direction-based coloring and styling
   * Matches ICustomSeries implementation:
   * - Groups consecutive bars by trend direction
   * - Uses moveTo when direction/style changes (creates gap, no connection)
   * - Uses Path2D for efficient rendering
   * - Supports different line widths and styles for uptrend vs downtrend
   */
  _drawTrendLines(ctx, hRatio, vRatio) {
    const { items, visibleRange } = this._viewData.data;
    if (items.length === 0 || visibleRange === null) {
      return;
    }
    const series = this._viewData.series;
    const seriesOptions = series ? series.options() : null;
    const uptrendLineColor = seriesOptions?.uptrendLineColor ?? this._viewData.options.uptrendLineColor ?? "#4CAF50";
    const uptrendLineWidth = seriesOptions?.uptrendLineWidth ?? this._viewData.options.uptrendLineWidth ?? 2;
    const uptrendLineStyle = seriesOptions?.uptrendLineStyle ?? this._viewData.options.uptrendLineStyle ?? 0;
    const uptrendLineVisible = seriesOptions?.uptrendLineVisible ?? this._viewData.options.uptrendLineVisible ?? true;
    const downtrendLineColor = seriesOptions?.downtrendLineColor ?? this._viewData.options.downtrendLineColor ?? "#F44336";
    const downtrendLineWidth = seriesOptions?.downtrendLineWidth ?? this._viewData.options.downtrendLineWidth ?? 2;
    const downtrendLineStyle = seriesOptions?.downtrendLineStyle ?? this._viewData.options.downtrendLineStyle ?? 0;
    const downtrendLineVisible = seriesOptions?.downtrendLineVisible ?? this._viewData.options.downtrendLineVisible ?? true;
    if (!uptrendLineVisible && !downtrendLineVisible) {
      return;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let currentDirection = null;
    let currentPath = null;
    for (let i = visibleRange.from; i < visibleRange.to; i++) {
      const item = items[i];
      if (!this._isValidCoordinates(item)) continue;
      const x = (item.x ?? 0) * hRatio;
      const y = (item.trendLineY ?? 0) * vRatio;
      if (item.trendDirection !== currentDirection) {
        if (currentPath && currentDirection !== null) {
          const isUptrend = currentDirection > 0;
          const lineColor = isUptrend ? uptrendLineColor : downtrendLineColor;
          const lineWidth = isUptrend ? uptrendLineWidth : downtrendLineWidth;
          const lineStyle = isUptrend ? uptrendLineStyle : downtrendLineStyle;
          const lineVisible = isUptrend ? uptrendLineVisible : downtrendLineVisible;
          if (lineVisible) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth * hRatio;
            this._setLineStyle(ctx, lineStyle);
            ctx.stroke(currentPath);
          }
        }
        currentDirection = item.trendDirection;
        currentPath = new Path2D();
        currentPath.moveTo(x, y);
      } else if (currentPath) {
        currentPath.lineTo(x, y);
      }
    }
    if (currentPath && currentDirection !== null) {
      const isUptrend = currentDirection > 0;
      const lineColor = isUptrend ? uptrendLineColor : downtrendLineColor;
      const lineWidth = isUptrend ? uptrendLineWidth : downtrendLineWidth;
      const lineStyle = isUptrend ? uptrendLineStyle : downtrendLineStyle;
      const lineVisible = isUptrend ? uptrendLineVisible : downtrendLineVisible;
      if (lineVisible) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth * hRatio;
        this._setLineStyle(ctx, lineStyle);
        ctx.stroke(currentPath);
      }
    }
  }
  /**
   * Draw base lines
   * Base line is drawn as a continuous line (no direction-based coloring)
   */
  _drawBaseLines(ctx, hRatio, vRatio) {
    const { items, visibleRange } = this._viewData.data;
    if (items.length === 0 || visibleRange === null) {
      return;
    }
    const series = this._viewData.series;
    const seriesOptions = series ? series.options() : null;
    const baseLineColor = seriesOptions?.baseLineColor ?? this._viewData.options.baseLineColor ?? "#666666";
    const baseLineWidth = seriesOptions?.baseLineWidth ?? this._viewData.options.baseLineWidth ?? 1;
    const baseLineStyle = seriesOptions?.baseLineStyle ?? this._viewData.options.baseLineStyle ?? 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = baseLineWidth * hRatio;
    ctx.strokeStyle = baseLineColor;
    this._setLineStyle(ctx, baseLineStyle);
    const path = new Path2D();
    let hasFirstPoint = false;
    for (let i = visibleRange.from; i < visibleRange.to; i++) {
      const item = items[i];
      if (!this._isValidCoordinates(item)) continue;
      const x = (item.x ?? 0) * hRatio;
      const y = (item.baseLineY ?? 0) * vRatio;
      if (!hasFirstPoint) {
        path.moveTo(x, y);
        hasFirstPoint = true;
      } else {
        path.lineTo(x, y);
      }
    }
    if (hasFirstPoint) {
      ctx.stroke(path);
    }
  }
  /**
   * Apply line dash pattern
   */
  _setLineStyle(ctx, lineStyle) {
    switch (lineStyle) {
      case 0:
        ctx.setLineDash([]);
        break;
      case 1:
        ctx.setLineDash([5, 5]);
        break;
      case 2:
        ctx.setLineDash([10, 5]);
        break;
      default:
        ctx.setLineDash([]);
    }
  }
  /**
   * Validate coordinates
   */
  _isValidCoordinates(item) {
    if (item.x === null || item.baseLineY === null || item.trendLineY === null) {
      return false;
    }
    const chartWidth = this._viewData.data.chartWidth || 800;
    const tolerance = 100;
    if (item.x < -tolerance || item.x > chartWidth + tolerance) {
      return false;
    }
    if (Math.abs(item.baseLineY) > 1e4 || Math.abs(item.trendLineY) > 1e4) {
      return false;
    }
    return true;
  }
}
class TrendFillPrimitiveView extends BaseSeriesPrimitivePaneView {
  constructor(source) {
    super(source);
    this._data = {
      data: {
        items: [],
        timeScale: null,
        priceScale: null,
        chartWidth: 0,
        lineWidth: 1,
        lineStyle: 0,
        visibleRange: null,
        barSpacing: 1,
        useHalfBarWidth: false
      },
      options: this._source.getOptions(),
      series: this._source.getAttachedSeries()
    };
  }
  update() {
    const chart = this._source.getChart();
    const timeScale = chart.timeScale();
    const chartElement = chart.chartElement();
    const attachedSeries = this._source.getAttachedSeries();
    if (!timeScale || !chartElement || !attachedSeries) {
      return;
    }
    const seriesOptions = attachedSeries.options();
    this._data.options = seriesOptions;
    this._data.series = attachedSeries;
    this._data.data.timeScale = timeScale;
    this._data.data.priceScale = attachedSeries;
    this._data.data.chartWidth = chartElement?.clientWidth || 800;
    this._data.data.useHalfBarWidth = seriesOptions.useHalfBarWidth ?? false;
    try {
      const extendedChart = chart;
      if (extendedChart._model?.timeScale?.barSpacing) {
        this._data.data.barSpacing = extendedChart._model.timeScale.barSpacing();
      } else {
        this._data.data.barSpacing = 6;
      }
    } catch {
      this._data.data.barSpacing = 6;
    }
    const items = this._source.getProcessedData();
    const convertedItems = this._batchConvertCoordinates(items, timeScale, attachedSeries);
    this._data.data.visibleRange = this._calculateVisibleRange(convertedItems);
    this._data.data.items = convertedItems;
  }
  _batchConvertCoordinates(items, timeScale, attachedSeries) {
    if (!timeScale || !attachedSeries) {
      return [];
    }
    return items.map((item) => {
      try {
        const x = timeScale.timeToCoordinate(item.time);
        const baseLineY = attachedSeries.priceToCoordinate(item.baseLine);
        const trendLineY = attachedSeries.priceToCoordinate(item.trendLine);
        if (x === null || baseLineY === null || trendLineY === null) {
          return null;
        }
        return {
          x,
          baseLineY,
          trendLineY,
          fillColor: item.fillColor,
          lineColor: item.lineColor,
          lineWidth: item.lineWidth,
          lineStyle: item.lineStyle,
          trendDirection: item.trendDirection
        };
      } catch {
        return null;
      }
    }).filter((item) => item !== null);
  }
  _calculateVisibleRange(items) {
    if (items.length === 0) return null;
    return { from: 0, to: items.length };
  }
  renderer() {
    return new TrendFillPrimitiveRenderer(this._data);
  }
  zIndex() {
    const zIndex = this._source.getOptions().zIndex;
    if (typeof zIndex === "number" && zIndex >= 0) {
      return zIndex;
    }
    return 0;
  }
}
class TrendFillPriceAxisView {
  constructor(source) {
    this._source = source;
  }
  /**
   * Get Y-coordinate for the price axis label
   * Uses the trend line value of the last visible item
   */
  coordinate() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) {
      return 0;
    }
    const attachedSeries = this._source.getAttachedSeries();
    if (!attachedSeries) {
      return 0;
    }
    const coordinate = attachedSeries.priceToCoordinate(lastItem.trendLine);
    return coordinate ?? 0;
  }
  /**
   * Get text to display on price axis
   * Shows the trend line value formatted to 2 decimal places
   */
  text() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) {
      return "";
    }
    return lastItem.trendLine.toFixed(2);
  }
  /**
   * Get text color for price axis label
   * Always returns white for optimal contrast against colored backgrounds
   */
  textColor() {
    return "#FFFFFF";
  }
  /**
   * Get background color for price axis label
   * Uses solid version of uptrend/downtrend fill color based on trend direction
   * Transparency is removed from fill color for better visibility
   */
  backColor() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) {
      return "transparent";
    }
    const attachedSeries = this._source.getAttachedSeries();
    const seriesOptions = attachedSeries ? attachedSeries.options() : null;
    const isUptrend = lastItem.trendDirection > 0;
    const uptrendColor = seriesOptions?.uptrendFillColor || this._source.getOptions().uptrendFillColor;
    const downtrendColor = seriesOptions?.downtrendFillColor || this._source.getOptions().downtrendFillColor;
    const fillColor = isUptrend ? uptrendColor : downtrendColor;
    return signalColorUtils.getSolidColorFromFill(fillColor);
  }
  /**
   * Determine if price axis label should be visible
   * Returns true when:
   * - We have data to display
   * - The primitive is visible (options.visible)
   * - At least one visual element is visible (fill or lines)
   * - The series' lastValueVisible option is true
   */
  visible() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) {
      return false;
    }
    const options = this._source.getOptions();
    if (!options.visible) {
      return false;
    }
    const attachedSeries = this._source.getAttachedSeries();
    const seriesOptions = attachedSeries ? attachedSeries.options() : null;
    const fillVisible = seriesOptions?.fillVisible ?? options.fillVisible ?? true;
    const uptrendLineVisible = seriesOptions?.uptrendLineVisible ?? options.uptrendLineVisible ?? true;
    const downtrendLineVisible = seriesOptions?.downtrendLineVisible ?? options.downtrendLineVisible ?? true;
    if (!fillVisible && !uptrendLineVisible && !downtrendLineVisible) {
      return false;
    }
    if (attachedSeries) {
      const seriesOptions2 = attachedSeries.options();
      if (seriesOptions2 && seriesOptions2.lastValueVisible === false) {
        return false;
      }
    }
    return true;
  }
  tickVisible() {
    return true;
  }
  /**
   * Get the last visible item based on the chart's visible time range
   *
   * This method intelligently detects which data item is actually visible
   * on the chart, not just the last item in the data array. This is critical
   * for price axis labels to show the correct value when the chart is zoomed
   * or scrolled.
   *
   * Algorithm:
   * 1. Get the visible time range from the chart's time scale
   * 2. Work backwards from the end of the data array
   * 3. Find the first item whose time is <= the visible range's end time
   * 4. Return that item as the last visible item
   *
   * Why time-based instead of index-based:
   * - getVisibleRange() returns time coordinates (what user sees)
   * - getVisibleLogicalRange() returns bar indices (can be misleading when zoomed)
   *
   * @returns The last visible TrendFillItem, or null if no data
   */
  _getLastVisibleItem() {
    const items = this._source.getProcessedData();
    if (items.length === 0) {
      return null;
    }
    const chart = this._source.getChart();
    const timeScale = chart.timeScale();
    const visibleTimeRange = timeScale.getVisibleRange();
    if (!visibleTimeRange) {
      return items[items.length - 1];
    }
    for (let i = items.length - 1; i >= 0; i--) {
      const itemTime = items[i].time;
      if (itemTime <= visibleTimeRange.to) {
        return items[i];
      }
    }
    return items[0];
  }
}
class TrendFillPrimitive extends BaseSeriesPrimitive {
  constructor(chart, options = {
    // Fill options
    uptrendFillColor: "rgba(76, 175, 80, 0.3)",
    downtrendFillColor: "rgba(244, 67, 54, 0.3)",
    fillVisible: true,
    // Uptrend line options (flat)
    uptrendLineColor: "#4CAF50",
    // Green for uptrend
    uptrendLineWidth: 2,
    uptrendLineStyle: 0,
    uptrendLineVisible: true,
    // Downtrend line options (flat)
    downtrendLineColor: "#F44336",
    // Red for downtrend
    downtrendLineWidth: 2,
    downtrendLineStyle: 0,
    downtrendLineVisible: true,
    // Base line options (flat)
    baseLineColor: "#666666",
    baseLineWidth: 1,
    baseLineStyle: 1,
    baseLineVisible: false,
    visible: true,
    priceScaleId: "right",
    useHalfBarWidth: true,
    // Enable to fill full bar width without gaps
    zIndex: 0
    // Default to normal layer (in front of grid)
  }) {
    super(chart, options);
    this.trendFillItems = [];
    this._rawData = [];
  }
  // Required: Initialize views
  _initializeViews() {
    this._addPaneView(new TrendFillPrimitiveView(this));
    this._addPriceAxisView(new TrendFillPriceAxisView(this));
  }
  // Required: Process raw data
  _processData(_rawData) {
    return this.trendFillItems;
  }
  // Optional: Custom z-order default
  _getDefaultZOrder() {
    return "normal";
  }
  setData(data) {
    this._rawData = data;
    this.processData();
    this.updateAllViews();
  }
  processData() {
    this.trendFillItems = [];
    if (!this._rawData || this._rawData.length === 0) {
      return;
    }
    const sortedData = [...this._rawData].sort((a, b) => {
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    });
    for (const item of sortedData) {
      const time = parseTime(item.time);
      const baseLine = item.base_line ?? item.baseLine;
      const trendLine = item.trend_line ?? item.trendLine;
      const trendDirection = item.trend_direction ?? item.trendDirection;
      if (baseLine === null || baseLine === void 0 || trendDirection === null || trendDirection === void 0 || trendDirection === 0 || trendLine === null || trendLine === void 0) {
        continue;
      }
      const isUptrend = trendDirection > 0;
      const fillColor = isUptrend ? this._options.uptrendFillColor : this._options.downtrendFillColor;
      const lineColor = isUptrend ? this._options.uptrendLineColor : this._options.downtrendLineColor;
      const lineWidth = isUptrend ? this._options.uptrendLineWidth : this._options.downtrendLineWidth;
      const lineStyle = isUptrend ? this._options.uptrendLineStyle : this._options.downtrendLineStyle;
      this.trendFillItems.push({
        time,
        baseLine,
        trendLine,
        trendDirection,
        fillColor,
        lineColor,
        lineWidth,
        lineStyle
      });
    }
  }
  applyOptions(options) {
    this._options = { ...this._options, ...options };
    this.processData();
    this.updateAllViews();
  }
  destroy() {
  }
  // Getters
  getOptions() {
    return this._options;
  }
  getChart() {
    return this._chart;
  }
  getProcessedData() {
    return this.trendFillItems;
  }
  getAttachedSeries() {
    return this._series;
  }
  // Override updateAllViews to also update pane views
  updateAllViews() {
    super.updateAllViews();
    this._paneViews.forEach((pv) => {
      if ("update" in pv && typeof pv.update === "function") {
        pv.update();
      }
    });
  }
  timeAxisViews() {
    return [];
  }
}
exports.BaseSeriesPrimitive = BaseSeriesPrimitive;
exports.BaseSeriesPrimitiveAxisView = BaseSeriesPrimitiveAxisView;
exports.BaseSeriesPrimitivePaneView = BaseSeriesPrimitivePaneView;
exports.TrendFillPrimitive = TrendFillPrimitive;
exports.convertToCoordinates = convertToCoordinates;
exports.createPrimitiveAxisView = createPrimitiveAxisView;
exports.drawFillArea = drawFillArea;
exports.drawLine = drawLine;
exports.drawMultiLine = drawMultiLine;
exports.getBarSpacing = getBarSpacing;
exports.isValidCoordinate = isValidCoordinate;
exports.isWhitespaceDataMultiField = isWhitespaceDataMultiField;
exports.priceToCoordinate = priceToCoordinate;
exports.timeToCoordinate = timeToCoordinate;
//# sourceMappingURL=TrendFillPrimitive-CtORNuw-.cjs.map
