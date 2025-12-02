import { customSeriesDefaultOptions } from "lightweight-charts";
import { e as isWhitespaceDataMultiField, b as drawFillArea, a as drawMultiLine, T as TrendFillPrimitive } from "./TrendFillPrimitive-DHivyY9P.js";
import { L as LineStyle, S as SignalColorCalculator, f as isTransparent } from "./signalColorUtils-Coc3RHvl.js";
import { l as logger, C as ChartCoordinateService } from "./SingletonBase-MBQ3miuj.js";
const defaultBandOptions = {
  ...customSeriesDefaultOptions,
  upperLineColor: "#4CAF50",
  upperLineWidth: 2,
  upperLineStyle: LineStyle.Solid,
  upperLineVisible: true,
  middleLineColor: "#2196F3",
  middleLineWidth: 2,
  middleLineStyle: LineStyle.Solid,
  middleLineVisible: true,
  lowerLineColor: "#F44336",
  lowerLineWidth: 2,
  lowerLineStyle: LineStyle.Solid,
  lowerLineVisible: true,
  upperFillColor: "rgba(76, 175, 80, 0.1)",
  upperFill: true,
  // Changed from upperFillVisible
  lowerFillColor: "rgba(244, 67, 54, 0.1)",
  lowerFill: true
  // Changed from lowerFillVisible
};
class BandSeries {
  constructor() {
    this._renderer = new BandSeriesRenderer();
  }
  priceValueBuilder(plotRow) {
    return [plotRow.lower, plotRow.middle, plotRow.upper];
  }
  isWhitespace(data) {
    return isWhitespaceDataMultiField(data, ["upper", "middle", "lower"]);
  }
  renderer() {
    return this._renderer;
  }
  update(data, options) {
    this._renderer.update(data, options);
  }
  defaultOptions() {
    return defaultBandOptions;
  }
}
class BandSeriesRenderer {
  constructor() {
    this._data = null;
    this._options = null;
  }
  update(data, options) {
    this._data = data;
    this._options = options;
  }
  draw(target, priceConverter) {
    target.useBitmapCoordinateSpace((scope) => {
      this._drawImpl(scope, priceConverter);
    });
  }
  /**
   * Main drawing implementation following TradingView's plugin pattern
   * Converts all bars to screen coordinates once, then draws visible range
   */
  _drawImpl(renderingScope, priceToCoordinate) {
    if (this._data === null || this._data.bars.length === 0 || this._data.visibleRange === null || this._options === null) {
      return;
    }
    if (this._options._usePrimitive) {
      return;
    }
    const options = this._options;
    const visibleRange = this._data.visibleRange;
    const bars = this._data.bars.map((bar) => {
      const { upper, middle, lower } = bar.originalData;
      return {
        x: bar.x * renderingScope.horizontalPixelRatio,
        upperY: (priceToCoordinate(upper) ?? 0) * renderingScope.verticalPixelRatio,
        middleY: (priceToCoordinate(middle) ?? 0) * renderingScope.verticalPixelRatio,
        lowerY: (priceToCoordinate(lower) ?? 0) * renderingScope.verticalPixelRatio
      };
    });
    const ctx = renderingScope.context;
    ctx.save();
    if (options.upperFill) {
      drawFillArea(
        ctx,
        bars,
        "upperY",
        "middleY",
        options.upperFillColor,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.lowerFill) {
      drawFillArea(
        ctx,
        bars,
        "middleY",
        "lowerY",
        options.lowerFillColor,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.upperLineVisible) {
      drawMultiLine(
        ctx,
        bars,
        "upperY",
        options.upperLineColor,
        options.upperLineWidth * renderingScope.horizontalPixelRatio,
        options.upperLineStyle,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.middleLineVisible) {
      drawMultiLine(
        ctx,
        bars,
        "middleY",
        options.middleLineColor,
        options.middleLineWidth * renderingScope.horizontalPixelRatio,
        options.middleLineStyle,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.lowerLineVisible) {
      drawMultiLine(
        ctx,
        bars,
        "lowerY",
        options.lowerLineColor,
        options.lowerLineWidth * renderingScope.horizontalPixelRatio,
        options.lowerLineStyle,
        visibleRange.from,
        visibleRange.to
      );
    }
    ctx.restore();
  }
}
function createBandSeries(chart, options = {}) {
  const paneId = options.paneId ?? 0;
  const series = chart.addCustomSeries(new BandSeries(), {
    _seriesType: "Band",
    // Internal property for series type identification
    upperLineColor: options.upperLineColor ?? "#4CAF50",
    upperLineWidth: options.upperLineWidth ?? 2,
    upperLineStyle: options.upperLineStyle ?? LineStyle.Solid,
    upperLineVisible: options.upperLineVisible !== false,
    middleLineColor: options.middleLineColor ?? "#2196F3",
    middleLineWidth: options.middleLineWidth ?? 2,
    middleLineStyle: options.middleLineStyle ?? LineStyle.Solid,
    middleLineVisible: options.middleLineVisible !== false,
    lowerLineColor: options.lowerLineColor ?? "#F44336",
    lowerLineWidth: options.lowerLineWidth ?? 2,
    lowerLineStyle: options.lowerLineStyle ?? LineStyle.Solid,
    lowerLineVisible: options.lowerLineVisible !== false,
    upperFillColor: options.upperFillColor ?? "rgba(76, 175, 80, 0.1)",
    upperFill: options.upperFill !== false,
    // Changed from upperFillVisible
    lowerFillColor: options.lowerFillColor ?? "rgba(244, 67, 54, 0.1)",
    lowerFill: options.lowerFill !== false,
    // Changed from lowerFillVisible
    priceScaleId: options.priceScaleId ?? "right",
    lastValueVisible: options.lastValueVisible ?? false,
    priceLineVisible: options.priceLineVisible ?? false,
    visible: options.visible ?? true,
    title: options.title,
    _usePrimitive: options.usePrimitive ?? false
    // Internal flag to disable rendering
  }, paneId);
  if (options.data && options.data.length > 0) {
    series.setData(options.data);
  }
  if (options.usePrimitive) {
    void import("./BandPrimitive-BJsNeyNJ.js").then(({ BandPrimitive }) => {
      const primitive = new BandPrimitive(chart, {
        upperLineColor: options.upperLineColor ?? "#4CAF50",
        upperLineWidth: options.upperLineWidth ?? 2,
        upperLineStyle: Math.min(options.upperLineStyle ?? LineStyle.Solid, 2),
        upperLineVisible: options.upperLineVisible !== false,
        middleLineColor: options.middleLineColor ?? "#2196F3",
        middleLineWidth: options.middleLineWidth ?? 2,
        middleLineStyle: Math.min(options.middleLineStyle ?? LineStyle.Solid, 2),
        middleLineVisible: options.middleLineVisible !== false,
        lowerLineColor: options.lowerLineColor ?? "#F44336",
        lowerLineWidth: options.lowerLineWidth ?? 2,
        lowerLineStyle: Math.min(options.lowerLineStyle ?? LineStyle.Solid, 2),
        lowerLineVisible: options.lowerLineVisible !== false,
        upperFillColor: options.upperFillColor ?? "rgba(76, 175, 80, 0.1)",
        upperFill: options.upperFill !== false,
        // Changed from upperFillVisible
        lowerFillColor: options.lowerFillColor ?? "rgba(244, 67, 54, 0.1)",
        lowerFill: options.lowerFill !== false,
        // Changed from lowerFillVisible
        visible: true,
        priceScaleId: options.priceScaleId ?? "right",
        zIndex: options.zIndex ?? 0
      });
      series.attachPrimitive(primitive);
    }).catch((error) => {
      logger.error("Failed to load BandPrimitive", "BandSeries", error);
    });
  }
  return series;
}
const defaultRibbonOptions = {
  ...customSeriesDefaultOptions,
  upperLineColor: "#4CAF50",
  upperLineWidth: 2,
  upperLineStyle: LineStyle.Solid,
  upperLineVisible: true,
  lowerLineColor: "#F44336",
  lowerLineWidth: 2,
  lowerLineStyle: LineStyle.Solid,
  lowerLineVisible: true,
  fillColor: "rgba(76, 175, 80, 0.1)",
  fillVisible: true
};
class RibbonSeries {
  constructor() {
    this._renderer = new RibbonSeriesRenderer();
  }
  priceValueBuilder(plotRow) {
    return [plotRow.lower, plotRow.upper];
  }
  isWhitespace(data) {
    return isWhitespaceDataMultiField(data, ["upper", "lower"]);
  }
  renderer() {
    return this._renderer;
  }
  update(data, options) {
    this._renderer.update(data, options);
  }
  defaultOptions() {
    return defaultRibbonOptions;
  }
}
class RibbonSeriesRenderer {
  constructor() {
    this._data = null;
    this._options = null;
  }
  update(data, options) {
    this._data = data;
    this._options = options;
  }
  draw(target, priceConverter) {
    target.useBitmapCoordinateSpace((scope) => {
      this._drawImpl(scope, priceConverter);
    });
  }
  /**
   * Main drawing implementation following TradingView's plugin pattern
   * Converts all bars to screen coordinates once, then draws visible range
   */
  _drawImpl(renderingScope, priceToCoordinate) {
    if (this._data === null || this._data.bars.length === 0 || this._data.visibleRange === null || this._options === null) {
      return;
    }
    if (this._options._usePrimitive) {
      return;
    }
    const options = this._options;
    const visibleRange = this._data.visibleRange;
    const bars = this._data.bars.map((bar) => {
      const { upper, lower } = bar.originalData;
      return {
        x: bar.x * renderingScope.horizontalPixelRatio,
        upperY: (priceToCoordinate(upper) ?? 0) * renderingScope.verticalPixelRatio,
        lowerY: (priceToCoordinate(lower) ?? 0) * renderingScope.verticalPixelRatio
      };
    });
    const ctx = renderingScope.context;
    ctx.save();
    if (options.fillVisible) {
      drawFillArea(
        ctx,
        bars,
        "upperY",
        "lowerY",
        options.fillColor,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.upperLineVisible) {
      drawMultiLine(
        ctx,
        bars,
        "upperY",
        options.upperLineColor,
        options.upperLineWidth * renderingScope.horizontalPixelRatio,
        options.upperLineStyle,
        visibleRange.from,
        visibleRange.to
      );
    }
    if (options.lowerLineVisible) {
      drawMultiLine(
        ctx,
        bars,
        "lowerY",
        options.lowerLineColor,
        options.lowerLineWidth * renderingScope.horizontalPixelRatio,
        options.lowerLineStyle,
        visibleRange.from,
        visibleRange.to
      );
    }
    ctx.restore();
  }
}
function createRibbonSeries(chart, options = {}) {
  const paneId = options.paneId ?? 0;
  const series = chart.addCustomSeries(new RibbonSeries(), {
    _seriesType: "Ribbon",
    // Internal property for series type identification
    upperLineColor: options.upperLineColor ?? "#4CAF50",
    upperLineWidth: options.upperLineWidth ?? 2,
    upperLineStyle: options.upperLineStyle ?? LineStyle.Solid,
    upperLineVisible: options.upperLineVisible !== false,
    lowerLineColor: options.lowerLineColor ?? "#F44336",
    lowerLineWidth: options.lowerLineWidth ?? 2,
    lowerLineStyle: options.lowerLineStyle ?? LineStyle.Solid,
    lowerLineVisible: options.lowerLineVisible !== false,
    fillColor: options.fillColor ?? "rgba(76, 175, 80, 0.1)",
    fillVisible: options.fillVisible !== false,
    priceScaleId: options.priceScaleId ?? "right",
    lastValueVisible: options.lastValueVisible ?? false,
    priceLineVisible: options.priceLineVisible ?? false,
    visible: options.visible ?? true,
    title: options.title,
    _usePrimitive: options.usePrimitive ?? false
    // Internal flag to disable rendering
  }, paneId);
  if (options.data && options.data.length > 0) {
    series.setData(options.data);
  }
  if (options.usePrimitive) {
    void import("./RibbonPrimitive-hcLJbxIK.js").then(({ RibbonPrimitive }) => {
      const primitive = new RibbonPrimitive(chart, {
        upperLineColor: options.upperLineColor ?? "#4CAF50",
        upperLineWidth: options.upperLineWidth ?? 2,
        upperLineStyle: Math.min(options.upperLineStyle ?? LineStyle.Solid, 2),
        upperLineVisible: options.upperLineVisible !== false,
        lowerLineColor: options.lowerLineColor ?? "#F44336",
        lowerLineWidth: options.lowerLineWidth ?? 2,
        lowerLineStyle: Math.min(options.lowerLineStyle ?? LineStyle.Solid, 2),
        lowerLineVisible: options.lowerLineVisible !== false,
        fillColor: options.fillColor ?? "rgba(76, 175, 80, 0.1)",
        fillVisible: options.fillVisible !== false,
        visible: true,
        priceScaleId: options.priceScaleId ?? "right",
        zIndex: options.zIndex ?? 0
      });
      series.attachPrimitive(primitive);
    }).catch((error) => {
      logger.error("Failed to load RibbonPrimitive", "RibbonSeries", error);
    });
  }
  return series;
}
const defaultGradientRibbonOptions = {
  ...customSeriesDefaultOptions,
  upperLineColor: "#4CAF50",
  upperLineWidth: 2,
  upperLineStyle: LineStyle.Solid,
  upperLineVisible: true,
  lowerLineColor: "#F44336",
  lowerLineWidth: 2,
  lowerLineStyle: LineStyle.Solid,
  lowerLineVisible: true,
  fillVisible: true,
  gradientStartColor: "#4CAF50",
  gradientEndColor: "#F44336",
  normalizeGradients: true
};
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
class GradientRibbonSeries {
  constructor() {
    this._renderer = new GradientRibbonSeriesRenderer();
  }
  priceValueBuilder(plotRow) {
    return [plotRow.lower, plotRow.upper];
  }
  isWhitespace(data) {
    return isWhitespaceDataMultiField(data, ["upper", "lower"]);
  }
  renderer() {
    return this._renderer;
  }
  update(data, options) {
    this._renderer.update(data, options);
  }
  defaultOptions() {
    return defaultGradientRibbonOptions;
  }
}
class GradientRibbonSeriesRenderer {
  constructor() {
    this._data = null;
    this._options = null;
  }
  update(data, options) {
    this._data = data;
    this._options = options;
  }
  draw(target, priceConverter) {
    target.useBitmapCoordinateSpace((scope) => {
      if (!this._data || !this._options || !this._data.bars.length) return;
      if (this._options._usePrimitive) return;
      const ctx = scope.context;
      const hRatio = scope.horizontalPixelRatio;
      ctx.save();
      const coordinates = this._convertToScreenCoordinates(scope, priceConverter);
      if (this._options.fillVisible && coordinates.length > 1) {
        this._drawGradientFill(ctx, coordinates, hRatio);
      }
      const lineCoordinates = coordinates.map((coord) => ({
        x: coord.x,
        upper: coord.upper,
        lower: coord.lower
      }));
      if (this._options.upperLineVisible) {
        drawMultiLine(
          ctx,
          lineCoordinates,
          "upper",
          this._options.upperLineColor,
          this._options.upperLineWidth * hRatio,
          this._options.upperLineStyle
        );
      }
      if (this._options.lowerLineVisible) {
        drawMultiLine(
          ctx,
          lineCoordinates,
          "lower",
          this._options.lowerLineColor,
          this._options.lowerLineWidth * hRatio,
          this._options.lowerLineStyle
        );
      }
      ctx.restore();
    });
  }
  _convertToScreenCoordinates(scope, priceConverter) {
    if (!this._data || !this._options) return [];
    const coordinateService = ChartCoordinateService.getInstance();
    const baseCoordinates = coordinateService.convertSeriesDataToScreenCoordinates(
      this._data.bars,
      scope,
      priceConverter,
      ChartCoordinateService.SeriesDataConfigs.gradientRibbon
    );
    let maxSpread = 0;
    let minGradient = 0;
    let maxGradient = 1;
    let gradientRange = 1;
    const gradientValues = this._data.bars.map((bar) => bar.originalData.gradient).filter((val) => val !== void 0 && val !== null);
    if (gradientValues.length > 0 && this._options.normalizeGradients) {
      minGradient = Math.min(...gradientValues);
      maxGradient = Math.max(...gradientValues);
      gradientRange = maxGradient - minGradient;
    }
    if (this._options.normalizeGradients && gradientValues.length === 0) {
      for (const bar of this._data.bars) {
        const data = bar.originalData;
        if (typeof data.upper === "number" && typeof data.lower === "number" && isFinite(data.upper) && isFinite(data.lower)) {
          const spread = Math.abs(data.upper - data.lower);
          maxSpread = Math.max(maxSpread, spread);
        }
      }
    }
    const coordinates = [];
    for (let i = 0; i < baseCoordinates.length; i++) {
      const coord = baseCoordinates[i];
      const originalData = this._data.bars[i].originalData;
      let gradientFactor = 0;
      const fillOverride = originalData.fill || void 0;
      if (!fillOverride) {
        if (originalData.gradient !== void 0) {
          if (this._options.normalizeGradients && gradientRange > 0) {
            gradientFactor = (originalData.gradient - minGradient) / gradientRange;
            gradientFactor = Math.max(0, Math.min(1, gradientFactor));
          } else {
            gradientFactor = Math.max(0, Math.min(1, originalData.gradient));
          }
        } else if (this._options && this._options.normalizeGradients && maxSpread > 0) {
          const spread = Math.abs(originalData.upper - originalData.lower);
          gradientFactor = spread / maxSpread;
        }
      }
      if (coord.x !== null && coord.upper !== null && coord.lower !== null) {
        coordinates.push({
          x: coord.x,
          upper: coord.upper,
          lower: coord.lower,
          gradientFactor,
          fillOverride
        });
      }
    }
    const coordinatesWithColors = coordinates.map((coord) => {
      let fillColor = this._options?.gradientStartColor ?? "#4CAF50";
      if (coord.fillOverride) {
        fillColor = coord.fillOverride;
      } else if (this._options) {
        fillColor = interpolateColor(
          this._options.gradientStartColor,
          this._options.gradientEndColor,
          coord.gradientFactor
        );
      }
      return {
        x: coord.x,
        upper: coord.upper,
        lower: coord.lower,
        fillColor
      };
    });
    return coordinatesWithColors;
  }
  _drawGradientFill(ctx, coordinates, _hRatio) {
    if (coordinates.length < 2) return;
    const firstX = coordinates[0].x;
    const lastX = coordinates[coordinates.length - 1].x;
    const gradient = ctx.createLinearGradient(firstX, 0, lastX, 0);
    for (let i = 0; i < coordinates.length; i++) {
      const coord = coordinates[i];
      const position = (coord.x - firstX) / (lastX - firstX);
      const clampedPosition = Math.max(0, Math.min(1, position));
      gradient.addColorStop(clampedPosition, coord.fillColor);
    }
    ctx.beginPath();
    ctx.moveTo(coordinates[0].x, coordinates[0].upper);
    for (let i = 1; i < coordinates.length; i++) {
      ctx.lineTo(coordinates[i].x, coordinates[i].upper);
    }
    for (let i = coordinates.length - 1; i >= 0; i--) {
      ctx.lineTo(coordinates[i].x, coordinates[i].lower);
    }
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
function createGradientRibbonSeries(chart, options = {}) {
  const paneId = options.paneId ?? 0;
  const series = chart.addCustomSeries(new GradientRibbonSeries(), {
    _seriesType: "GradientRibbon",
    // Internal property for series type identification
    upperLineColor: options.upperLineColor ?? "#4CAF50",
    upperLineWidth: options.upperLineWidth ?? 2,
    upperLineStyle: options.upperLineStyle ?? LineStyle.Solid,
    upperLineVisible: options.upperLineVisible !== false,
    lowerLineColor: options.lowerLineColor ?? "#F44336",
    lowerLineWidth: options.lowerLineWidth ?? 2,
    lowerLineStyle: options.lowerLineStyle ?? LineStyle.Solid,
    lowerLineVisible: options.lowerLineVisible !== false,
    fillVisible: options.fillVisible !== false,
    gradientStartColor: options.gradientStartColor ?? "#4CAF50",
    gradientEndColor: options.gradientEndColor ?? "#F44336",
    normalizeGradients: options.normalizeGradients !== false,
    priceScaleId: options.priceScaleId ?? "right",
    lastValueVisible: options.lastValueVisible ?? false,
    priceLineVisible: options.priceLineVisible ?? false,
    visible: options.visible ?? true,
    title: options.title,
    _usePrimitive: options.usePrimitive ?? false
    // Internal flag to disable rendering
  }, paneId);
  if (options.data && options.data.length > 0) {
    series.setData(options.data);
  }
  if (options.usePrimitive) {
    void import("./GradientRibbonPrimitive-95ttgdAP.js").then(({ GradientRibbonPrimitive }) => {
      const primitive = new GradientRibbonPrimitive(chart, {
        upperLineColor: options.upperLineColor ?? "#4CAF50",
        upperLineWidth: options.upperLineWidth ?? 2,
        upperLineStyle: Math.min(options.upperLineStyle ?? LineStyle.Solid, 2),
        upperLineVisible: options.upperLineVisible !== false,
        lowerLineColor: options.lowerLineColor ?? "#F44336",
        lowerLineWidth: options.lowerLineWidth ?? 2,
        lowerLineStyle: Math.min(options.lowerLineStyle ?? LineStyle.Solid, 2),
        lowerLineVisible: options.lowerLineVisible !== false,
        fillVisible: options.fillVisible !== false,
        gradientStartColor: options.gradientStartColor ?? "#4CAF50",
        gradientEndColor: options.gradientEndColor ?? "#F44336",
        normalizeGradients: options.normalizeGradients !== false,
        visible: true,
        priceScaleId: options.priceScaleId ?? "right",
        zIndex: options.zIndex ?? 0
      });
      series.attachPrimitive(primitive);
    }).catch((error) => {
      logger.error("Failed to load GradientRibbonPrimitive", "GradientRibbonSeries", error);
    });
  }
  return series;
}
const defaultSignalOptions = {
  ...customSeriesDefaultOptions,
  neutralColor: "rgba(128, 128, 128, 0.1)",
  signalColor: "rgba(76, 175, 80, 0.2)",
  alertColor: void 0,
  lastValueVisible: false,
  title: "Signal",
  visible: true,
  priceLineVisible: false
};
class SignalSeriesRenderer {
  constructor() {
    this._data = null;
    this._options = null;
    this._hasNonBooleanValues = false;
  }
  update(data, options) {
    this._data = data;
    this._options = options;
    this._hasNonBooleanValues = this._checkForNonBooleanValues(data);
  }
  /**
   * Check if data contains any values that are not 0 or 1
   * This determines whether alertColor should be used
   * Handles both boolean (true/false) and numeric (0/1) values
   */
  _checkForNonBooleanValues(data) {
    if (!data || !data.bars) return false;
    const values = data.bars.map((bar) => bar.originalData.value);
    return SignalColorCalculator.checkForNonBooleanValues(values);
  }
  draw(target) {
    target.useBitmapCoordinateSpace((scope) => {
      this._drawImpl(scope);
    });
  }
  _drawImpl(renderingScope) {
    if (!this._data || !this._options || !this._options.visible) {
      return;
    }
    if (this._options._usePrimitive) {
      return;
    }
    if (this._data.bars.length === 0) {
      return;
    }
    const ctx = renderingScope.context;
    const barSpacing = this._data.barSpacing;
    const halfBarSpacing = barSpacing / 2;
    const chartHeight = renderingScope.bitmapSize.height;
    ctx.save();
    for (const bar of this._data.bars) {
      const signalData = bar.originalData;
      let value = signalData.value;
      if (typeof value === "boolean") {
        value = value ? 1 : 0;
      }
      let color = signalData.color;
      if (!color) {
        color = this.getColorForValue(value, this._options);
      }
      if (isTransparent(color)) {
        continue;
      }
      const x = bar.x * renderingScope.horizontalPixelRatio;
      const startX = Math.floor(x - halfBarSpacing * renderingScope.horizontalPixelRatio);
      const endX = Math.floor(x + halfBarSpacing * renderingScope.horizontalPixelRatio);
      ctx.fillStyle = color;
      ctx.fillRect(startX, 0, endX - startX, chartHeight);
    }
    ctx.restore();
  }
  getColorForValue(value, options) {
    return SignalColorCalculator.getColorForValue(value, options, this._hasNonBooleanValues);
  }
}
class SignalSeries {
  constructor() {
    this._renderer = new SignalSeriesRenderer();
  }
  /**
   * Build price values for autoscaling
   *
   * Signals don't have meaningful price values.
   * When using primitive mode, we return empty array to not affect autoscaling.
   * When not using primitive, we return the signal value to prevent errors.
   *
   * @param _plotRow - Data point (unused)
   * @returns Price value (empty when primitive is used)
   */
  priceValueBuilder(_plotRow) {
    return [];
  }
  /**
   * Check if data point is whitespace
   *
   * @param data - Data point to check
   * @returns True if value is null/undefined
   */
  isWhitespace(data) {
    return data.value === void 0 || data.value === null;
  }
  /**
   * Update renderer with new data
   *
   * @param data - Renderer data from chart
   * @param options - Series options
   */
  update(data, options) {
    this._renderer.update(data, options);
  }
  /**
   * Get default options
   *
   * @returns Default options object
   */
  defaultOptions() {
    return defaultSignalOptions;
  }
  /**
   * Get renderer
   *
   * @returns Renderer instance
   */
  renderer() {
    return this._renderer;
  }
}
function SignalSeriesPlugin() {
  return new SignalSeries();
}
function createSignalSeries(chart, options = {}) {
  const paneId = options.paneId ?? 0;
  const usePrimitive = options.usePrimitive ?? false;
  const series = chart.addCustomSeries(SignalSeriesPlugin(), {
    _seriesType: "Signal",
    // Internal property for series type identification
    neutralColor: options.neutralColor ?? "rgba(128, 128, 128, 0.1)",
    signalColor: options.signalColor ?? "rgba(76, 175, 80, 0.2)",
    alertColor: options.alertColor,
    // No default - only use if explicitly provided
    priceScaleId: options.priceScaleId ?? "right",
    lastValueVisible: options.lastValueVisible ?? false,
    title: options.title ?? "Signal",
    visible: options.visible !== false,
    priceLineVisible: options.priceLineVisible ?? false,
    _usePrimitive: usePrimitive
    // Internal flag to disable rendering
  }, paneId);
  if (options.data && options.data.length > 0) {
    series.setData(options.data);
  }
  if (usePrimitive) {
    void import("./SignalPrimitive-D3Alyq5j.js").then(({ SignalPrimitive }) => {
      const primitive = new SignalPrimitive(chart, {
        neutralColor: options.neutralColor ?? "rgba(128, 128, 128, 0.1)",
        signalColor: options.signalColor ?? "rgba(76, 175, 80, 0.2)",
        alertColor: options.alertColor,
        // No default - only use if explicitly provided
        visible: options.visible !== false,
        zIndex: options.zIndex ?? -100
      });
      series.attachPrimitive(primitive);
    }).catch((error) => {
      logger.error("Failed to load SignalPrimitive", "SignalSeries", error);
    });
  }
  return series;
}
function createSignalSeriesPlugin() {
  return SignalSeriesPlugin();
}
class TrendFillSeriesRenderer {
  constructor() {
    this._data = null;
    this._options = null;
  }
  draw(target, priceConverter) {
    target.useBitmapCoordinateSpace(
      (scope) => this._drawImpl(scope, priceConverter)
    );
  }
  update(data, options) {
    this._data = data;
    this._options = options;
  }
  /**
   * Main drawing implementation
   *
   * Transforms data to bitmap coordinates and delegates to drawing methods.
   * Called by draw() within useBitmapCoordinateSpace for proper pixel rendering.
   *
   * @param renderingScope - Bitmap rendering scope with pixel ratios
   * @param priceToCoordinate - Function to convert price to Y coordinate
   */
  _drawImpl(renderingScope, priceToCoordinate) {
    if (this._data === null || this._data.bars.length === 0 || this._data.visibleRange === null || this._options === null) {
      return;
    }
    if (this._options._usePrimitive) {
      return;
    }
    const options = this._options;
    const visibleRange = this._data.visibleRange;
    const bars = this._data.bars.map((bar) => {
      const { baseLine, trendLine, trendDirection } = bar.originalData;
      const isUptrend = trendDirection > 0;
      return {
        x: bar.x * renderingScope.horizontalPixelRatio,
        baseLineY: (priceToCoordinate(baseLine) ?? 0) * renderingScope.verticalPixelRatio,
        trendLineY: (priceToCoordinate(trendLine) ?? 0) * renderingScope.verticalPixelRatio,
        trendDirection,
        fillColor: isUptrend ? options.uptrendFillColor : options.downtrendFillColor,
        lineColor: isUptrend ? options.uptrendLineColor : options.downtrendLineColor,
        lineWidth: isUptrend ? options.uptrendLineWidth : options.downtrendLineWidth,
        lineStyle: isUptrend ? options.uptrendLineStyle : options.downtrendLineStyle
      };
    });
    const ctx = renderingScope.context;
    if (options.fillVisible) {
      this._drawFills(ctx, bars, visibleRange);
    }
    if (options.baseLineVisible) {
      this._drawBaseLine(ctx, bars, visibleRange);
    }
    if (options.uptrendLineVisible || options.downtrendLineVisible) {
      this._drawTrendLine(ctx, bars, visibleRange);
    }
  }
  /**
   * Draw filled areas between trend and base lines
   */
  _drawFills(ctx, bars, visibleRange) {
    let currentGroup = [];
    let currentColor = null;
    let currentDirection = null;
    const flushGroup = () => {
      if (currentGroup.length < 1 || !currentColor) return;
      ctx.fillStyle = currentColor;
      ctx.beginPath();
      const firstBar = currentGroup[0];
      ctx.moveTo(firstBar.x, firstBar.trendLineY);
      for (let i = 1; i < currentGroup.length; i++) {
        ctx.lineTo(currentGroup[i].x, currentGroup[i].trendLineY);
      }
      for (let i = currentGroup.length - 1; i >= 0; i--) {
        ctx.lineTo(currentGroup[i].x, currentGroup[i].baseLineY);
      }
      ctx.closePath();
      ctx.fill();
    };
    for (let i = visibleRange.from; i < visibleRange.to; i++) {
      const bar = bars[i];
      if (bar.trendDirection === 0) {
        flushGroup();
        currentGroup = [];
        currentColor = null;
        currentDirection = null;
        continue;
      }
      if (bar.fillColor !== currentColor || bar.trendDirection !== currentDirection) {
        flushGroup();
        currentGroup = [bar];
        currentColor = bar.fillColor;
        currentDirection = bar.trendDirection;
      } else {
        currentGroup.push(bar);
      }
    }
    flushGroup();
  }
  /**
   * Draw trend line with direction-based coloring and styling
   */
  _drawTrendLine(ctx, bars, visibleRange) {
    if (!this._options) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let currentColor = null;
    let currentWidth = null;
    let currentStyle = null;
    let currentPath = null;
    for (let i = visibleRange.from; i < visibleRange.to; i++) {
      const bar = bars[i];
      const x = bar.x;
      const y = bar.trendLineY;
      if (bar.lineColor !== currentColor || bar.lineWidth !== currentWidth || bar.lineStyle !== currentStyle) {
        if (currentPath && currentColor && currentWidth && currentStyle !== null) {
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = currentWidth;
          this._applyLineStyle(ctx, currentStyle);
          ctx.stroke(currentPath);
        }
        currentColor = bar.lineColor;
        currentWidth = bar.lineWidth;
        currentStyle = bar.lineStyle;
        currentPath = new Path2D();
        currentPath.moveTo(x, y);
      } else if (currentPath) {
        currentPath.lineTo(x, y);
      }
    }
    if (currentPath && currentColor && currentWidth && currentStyle !== null) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
      this._applyLineStyle(ctx, currentStyle);
      ctx.stroke(currentPath);
    }
  }
  /**
   * Draw base line
   */
  _drawBaseLine(ctx, bars, visibleRange) {
    if (!this._options) return;
    const baseLine = new Path2D();
    const firstBar = bars[visibleRange.from];
    baseLine.moveTo(firstBar.x, firstBar.baseLineY);
    for (let i = visibleRange.from + 1; i < visibleRange.to; i++) {
      baseLine.lineTo(bars[i].x, bars[i].baseLineY);
    }
    ctx.lineJoin = "round";
    ctx.strokeStyle = this._options.baseLineColor;
    ctx.lineWidth = this._options.baseLineWidth;
    this._applyLineStyle(ctx, this._options.baseLineStyle);
    ctx.stroke(baseLine);
  }
  /**
   * Apply line dash pattern based on LineStyle
   */
  _applyLineStyle(ctx, style) {
    switch (style) {
      case LineStyle.Solid:
        ctx.setLineDash([]);
        break;
      case LineStyle.Dotted:
        ctx.setLineDash([1, 1]);
        break;
      case LineStyle.Dashed:
        ctx.setLineDash([4, 2]);
        break;
      case LineStyle.LargeDashed:
        ctx.setLineDash([8, 4]);
        break;
      case LineStyle.SparseDotted:
        ctx.setLineDash([1, 4]);
        break;
      default:
        ctx.setLineDash([]);
    }
  }
}
class TrendFillSeries {
  constructor() {
    this._renderer = new TrendFillSeriesRenderer();
  }
  /**
   * Build price values for autoscaling
   *
   * Returns [min, max] to ensure both trend and base lines are visible.
   *
   * @param plotRow - Data point
   * @returns Price values array
   */
  priceValueBuilder(plotRow) {
    return [
      Math.min(plotRow.baseLine, plotRow.trendLine),
      Math.max(plotRow.baseLine, plotRow.trendLine),
      plotRow.trendLine
      // Primary value for last value marker
    ];
  }
  /**
   * Determine if data point is whitespace (gap)
   *
   * A point is considered whitespace if either baseLine or trendLine is missing.
   *
   * @param data - Data point to check
   * @returns True if whitespace
   */
  isWhitespace(data) {
    return isWhitespaceDataMultiField(data, ["baseLine", "trendLine"]);
  }
  renderer() {
    return this._renderer;
  }
  update(data, options) {
    this._renderer.update(data, options);
  }
  /**
   * Default options for TrendFill series
   *
   * @returns Default configuration with green uptrend and red downtrend fills and lines
   */
  defaultOptions() {
    return {
      ...customSeriesDefaultOptions,
      uptrendFillColor: "rgba(76, 175, 80, 0.3)",
      downtrendFillColor: "rgba(244, 67, 54, 0.3)",
      fillVisible: true,
      uptrendLineColor: "#4CAF50",
      // Green for uptrend
      uptrendLineWidth: 2,
      uptrendLineStyle: LineStyle.Solid,
      uptrendLineVisible: true,
      downtrendLineColor: "#F44336",
      // Red for downtrend
      downtrendLineWidth: 2,
      downtrendLineStyle: LineStyle.Solid,
      downtrendLineVisible: true,
      baseLineColor: "#666666",
      baseLineWidth: 1,
      baseLineStyle: LineStyle.Dotted,
      baseLineVisible: false
      // Hide base line by default
    };
  }
}
function createTrendFillSeries(chart, options = {}) {
  const series = chart.addCustomSeries(new TrendFillSeries(), {
    _seriesType: "TrendFill",
    // Internal property for series type identification
    uptrendFillColor: options.uptrendFillColor ?? "rgba(76, 175, 80, 0.3)",
    downtrendFillColor: options.downtrendFillColor ?? "rgba(244, 67, 54, 0.3)",
    fillVisible: options.fillVisible !== false,
    uptrendLineColor: options.uptrendLineColor ?? "#4CAF50",
    uptrendLineWidth: options.uptrendLineWidth ?? 2,
    uptrendLineStyle: options.uptrendLineStyle ?? LineStyle.Solid,
    uptrendLineVisible: options.uptrendLineVisible !== false,
    downtrendLineColor: options.downtrendLineColor ?? "#F44336",
    downtrendLineWidth: options.downtrendLineWidth ?? 2,
    downtrendLineStyle: options.downtrendLineStyle ?? LineStyle.Solid,
    downtrendLineVisible: options.downtrendLineVisible !== false,
    baseLineColor: options.baseLineColor ?? "#666666",
    baseLineWidth: options.baseLineWidth ?? 1,
    baseLineStyle: options.baseLineStyle ?? LineStyle.Dotted,
    baseLineVisible: options.baseLineVisible === true,
    priceScaleId: options.priceScaleId ?? "right",
    lastValueVisible: options.lastValueVisible ?? false,
    priceLineVisible: options.priceLineVisible ?? false,
    visible: options.visible ?? true,
    title: options.title,
    _usePrimitive: options.usePrimitive ?? false
    // Internal flag to disable rendering
  });
  if (options.data && options.data.length > 0) {
    series.setData(options.data);
  }
  if (options.usePrimitive) {
    const primitiveOptions = {
      // Fill options
      uptrendFillColor: options.uptrendFillColor ?? "rgba(76, 175, 80, 0.3)",
      downtrendFillColor: options.downtrendFillColor ?? "rgba(244, 67, 54, 0.3)",
      fillVisible: options.fillVisible ?? true,
      // Uptrend line options (flat)
      uptrendLineColor: options.uptrendLineColor ?? "#4CAF50",
      uptrendLineWidth: options.uptrendLineWidth ?? 2,
      uptrendLineStyle: Math.min(options.uptrendLineStyle ?? LineStyle.Solid, 2),
      uptrendLineVisible: options.uptrendLineVisible !== false,
      // Downtrend line options (flat)
      downtrendLineColor: options.downtrendLineColor ?? "#F44336",
      downtrendLineWidth: options.downtrendLineWidth ?? 2,
      downtrendLineStyle: Math.min(options.downtrendLineStyle ?? LineStyle.Solid, 2),
      downtrendLineVisible: options.downtrendLineVisible !== false,
      // Base line options (flat)
      baseLineColor: options.baseLineColor ?? "#666666",
      baseLineWidth: options.baseLineWidth ?? 1,
      baseLineStyle: Math.min(options.baseLineStyle ?? LineStyle.Dotted, 2),
      baseLineVisible: options.baseLineVisible === true,
      visible: true,
      priceScaleId: options.priceScaleId ?? "right",
      useHalfBarWidth: options.useHalfBarWidth !== false,
      zIndex: options.zIndex ?? 0
    };
    const primitive = new TrendFillPrimitive(chart, primitiveOptions);
    series.attachPrimitive(primitive);
    if (options.data && options.data.length > 0) {
      primitive.setData(options.data);
    }
  }
  return series;
}
export {
  SignalSeries as S,
  createRibbonSeries as a,
  createGradientRibbonSeries as b,
  createBandSeries as c,
  SignalSeriesPlugin as d,
  createSignalSeries as e,
  createSignalSeriesPlugin as f,
  defaultSignalOptions as g,
  createTrendFillSeries as h
};
//# sourceMappingURL=trendFillSeriesPlugin-KufklRJL.js.map
