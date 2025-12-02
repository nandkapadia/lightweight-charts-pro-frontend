"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const signalColorUtils = require("./signalColorUtils-pcf1rMp6.cjs");
const TrendFillPrimitive = require("./TrendFillPrimitive-CtORNuw-.cjs");
function interpolateColor(startColor, endColor, factor) {
  factor = Math.max(0, Math.min(1, factor));
  const parseHex = (hex) => {
    const clean = hex.replace("#", "");
    return {
      r: parseInt(clean.substr(0, 2), 16),
      g: parseInt(clean.substr(2, 2), 16),
      b: parseInt(clean.substr(4, 2), 16)
    };
  };
  try {
    const start = parseHex(startColor);
    const end = parseHex(endColor);
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } catch {
    return startColor;
  }
}
class GradientRibbonPrimitivePaneView extends TrendFillPrimitive.BaseSeriesPrimitivePaneView {
  renderer() {
    return new GradientRibbonPrimitiveRenderer(this._source);
  }
}
class GradientRibbonPrimitiveRenderer {
  constructor(source) {
    this._source = source;
  }
  /**
   * Draw method - handles LINE drawing (foreground elements)
   * This method renders upper and lower boundary lines
   * that should appear on top of fills and other series
   */
  draw(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const hRatio = scope.horizontalPixelRatio;
      const vRatio = scope.verticalPixelRatio;
      const data = this._source.getProcessedData();
      const series = this._source.getAttachedSeries();
      if (!series || data.length === 0) return;
      const options = series.options();
      if (!options || options.visible === false) return;
      ctx.save();
      const chart = this._source.getChart();
      const baseCoordinates = TrendFillPrimitive.convertToCoordinates(data, chart, series, ["upper", "lower"]);
      const scaledCoordsForLines = baseCoordinates.map((coord) => ({
        x: coord.x !== null ? coord.x * hRatio : null,
        upper: coord.upper !== null ? coord.upper * vRatio : null,
        lower: coord.lower !== null ? coord.lower * vRatio : null
      }));
      if (options.upperLineVisible) {
        TrendFillPrimitive.drawMultiLine(
          ctx,
          scaledCoordsForLines,
          "upper",
          options.upperLineColor,
          options.upperLineWidth * hRatio,
          options.upperLineStyle
        );
      }
      if (options.lowerLineVisible) {
        TrendFillPrimitive.drawMultiLine(
          ctx,
          scaledCoordsForLines,
          "lower",
          options.lowerLineColor,
          options.lowerLineWidth * hRatio,
          options.lowerLineStyle
        );
      }
      ctx.restore();
    });
  }
  /**
   * Draw background method - handles FILL rendering (background elements)
   * This method renders the gradient filled area between upper and lower lines
   * that should appear behind lines and other series
   */
  drawBackground(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const hRatio = scope.horizontalPixelRatio;
      const vRatio = scope.verticalPixelRatio;
      const data = this._source.getProcessedData();
      const series = this._source.getAttachedSeries();
      if (!series || data.length === 0) return;
      const options = series.options();
      if (!options || options.visible === false) return;
      ctx.save();
      const chart = this._source.getChart();
      const baseCoordinates = TrendFillPrimitive.convertToCoordinates(data, chart, series, ["upper", "lower"]);
      const coordinates = baseCoordinates.map((coord, idx) => {
        const dataPoint = data[idx];
        let fillColor = options.gradientStartColor;
        if (dataPoint) {
          if (dataPoint.fillOverride) {
            fillColor = dataPoint.fillOverride;
          } else {
            fillColor = interpolateColor(
              options.gradientStartColor,
              options.gradientEndColor,
              dataPoint.gradientFactor
            );
          }
        }
        return {
          x: coord.x,
          upper: coord.upper,
          lower: coord.lower,
          fillColor
        };
      });
      const scaledCoordsForFills = coordinates.map((coord) => ({
        x: coord.x !== null ? coord.x * hRatio : null,
        upper: coord.upper !== null ? coord.upper * vRatio : null,
        lower: coord.lower !== null ? coord.lower * vRatio : null,
        fillColor: coord.fillColor
      }));
      if (options.fillVisible && scaledCoordsForFills.length > 1) {
        this._drawGradientFill(ctx, scaledCoordsForFills, options);
      }
      ctx.restore();
    });
  }
  _drawGradientFill(ctx, coordinates, options) {
    const validCoords = coordinates.filter(
      (coord) => coord.x !== null && coord.upper !== null && coord.lower !== null
    );
    if (validCoords.length < 2) return;
    const firstX = validCoords[0].x;
    const lastX = validCoords[validCoords.length - 1].x;
    const gradient = ctx.createLinearGradient(firstX, 0, lastX, 0);
    for (let i = 0; i < validCoords.length; i++) {
      const coord = validCoords[i];
      const position = (coord.x - firstX) / (lastX - firstX);
      const clampedPosition = Math.max(0, Math.min(1, position));
      const color = coord.fillColor || options.gradientStartColor;
      gradient.addColorStop(clampedPosition, color);
    }
    ctx.beginPath();
    ctx.moveTo(validCoords[0].x, validCoords[0].upper);
    for (let i = 1; i < validCoords.length; i++) {
      ctx.lineTo(validCoords[i].x, validCoords[i].upper);
    }
    for (let i = validCoords.length - 1; i >= 0; i--) {
      ctx.lineTo(validCoords[i].x, validCoords[i].lower);
    }
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
class GradientRibbonUpperAxisView extends TrendFillPrimitive.BaseSeriesPrimitiveAxisView {
  coordinate() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) return 0;
    const series = this._source.getAttachedSeries();
    if (!series) return 0;
    const coordinate = series.priceToCoordinate(lastItem.upper);
    return coordinate ?? 0;
  }
  text() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) return "";
    return lastItem.upper.toFixed(2);
  }
  textColor() {
    return "#FFFFFF";
  }
  backColor() {
    const options = this._source.getOptions();
    return signalColorUtils.getSolidColorFromFill(options.upperLineColor);
  }
}
class GradientRibbonLowerAxisView extends TrendFillPrimitive.BaseSeriesPrimitiveAxisView {
  coordinate() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) return 0;
    const series = this._source.getAttachedSeries();
    if (!series) return 0;
    const coordinate = series.priceToCoordinate(lastItem.lower);
    return coordinate ?? 0;
  }
  text() {
    const lastItem = this._getLastVisibleItem();
    if (!lastItem) return "";
    return lastItem.lower.toFixed(2);
  }
  textColor() {
    return "#FFFFFF";
  }
  backColor() {
    const options = this._source.getOptions();
    return signalColorUtils.getSolidColorFromFill(options.lowerLineColor);
  }
}
class GradientRibbonPrimitive extends TrendFillPrimitive.BaseSeriesPrimitive {
  constructor(chart, options) {
    super(chart, options);
  }
  /**
   * Returns settings schema for series dialog
   * Maps property names to their types for automatic UI generation
   */
  static getSettings() {
    return {
      upperLine: "line",
      lowerLine: "line",
      fillVisible: "boolean",
      gradientStartColor: "color",
      gradientEndColor: "color",
      normalizeGradients: "boolean"
    };
  }
  // Required: Initialize views
  _initializeViews() {
    this._addPaneView(new GradientRibbonPrimitivePaneView(this));
    this._addPriceAxisView(new GradientRibbonUpperAxisView(this));
    this._addPriceAxisView(new GradientRibbonLowerAxisView(this));
  }
  // Required: Process raw data
  _processData(rawData) {
    let maxSpread = 0;
    let minGradient = 0;
    let maxGradient = 1;
    let gradientRange = 1;
    const gradientValues = rawData.map((item) => item.gradient).filter((val) => val !== void 0 && val !== null);
    if (gradientValues.length > 0 && this._options.normalizeGradients) {
      minGradient = Math.min(...gradientValues);
      maxGradient = Math.max(...gradientValues);
      gradientRange = maxGradient - minGradient;
    }
    if (this._options.normalizeGradients && gradientValues.length === 0) {
      for (const item of rawData) {
        if (typeof item.upper === "number" && typeof item.lower === "number" && isFinite(item.upper) && isFinite(item.lower)) {
          const spread = Math.abs(item.upper - item.lower);
          maxSpread = Math.max(maxSpread, spread);
        }
      }
    }
    return rawData.map((item) => {
      const upper = item.upper;
      const lower = item.lower;
      if (upper === null || upper === void 0 || isNaN(upper) || lower === null || lower === void 0 || isNaN(lower)) {
        return null;
      }
      let gradientFactor = 0;
      const fillOverride = item.fill || void 0;
      if (!fillOverride) {
        if (item.gradient !== void 0 && item.gradient !== null) {
          if (this._options.normalizeGradients && gradientRange > 0) {
            gradientFactor = (item.gradient - minGradient) / gradientRange;
            gradientFactor = Math.max(0, Math.min(1, gradientFactor));
          } else {
            gradientFactor = Math.max(0, Math.min(1, item.gradient));
          }
        } else if (this._options.normalizeGradients && maxSpread > 0) {
          const spread = Math.abs(upper - lower);
          gradientFactor = spread / maxSpread;
        }
      }
      const processed = {
        time: item.time,
        upper,
        lower,
        gradientFactor
      };
      if (fillOverride) {
        processed.fillOverride = fillOverride;
      }
      return processed;
    }).filter((item) => item !== null);
  }
  // Optional: Custom z-order default
  _getDefaultZOrder() {
    return "normal";
  }
}
exports.GradientRibbonPrimitive = GradientRibbonPrimitive;
//# sourceMappingURL=GradientRibbonPrimitive-CS1Z2c97.cjs.map
