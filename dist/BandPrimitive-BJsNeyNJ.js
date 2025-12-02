import { B as BaseSeriesPrimitive, f as createPrimitiveAxisView, h as BaseSeriesPrimitivePaneView, c as convertToCoordinates, g as getBarSpacing } from "./TrendFillPrimitive-DHivyY9P.js";
import { H as drawContinuousLine, x as isValidRenderPoint, I as calculateBarWidthExtensions, M as fillBetweenLines, J as interpolateY } from "./signalColorUtils-Coc3RHvl.js";
class BandPrimitivePaneView extends BaseSeriesPrimitivePaneView {
  renderer() {
    return new BandPrimitiveRenderer(this._source);
  }
}
class BandPrimitiveRenderer {
  constructor(source) {
    this._source = source;
  }
  /**
   * Draw method - handles LINE drawing (foreground elements)
   * This method renders upper, middle, and lower boundary lines
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
      const coordinates = convertToCoordinates(data, chart, series, ["upper", "middle", "lower"]);
      const scaledCoords = coordinates.map((coord) => ({
        x: coord.x !== null ? coord.x * hRatio : null,
        upper: coord.upper !== null ? coord.upper * vRatio : null,
        middle: coord.middle !== null ? coord.middle * vRatio : null,
        lower: coord.lower !== null ? coord.lower * vRatio : null
      }));
      this._drawLineWithStyles(ctx, scaledCoords, data, "upper", "upperLineColor", options, hRatio);
      this._drawLineWithStyles(
        ctx,
        scaledCoords,
        data,
        "middle",
        "middleLineColor",
        options,
        hRatio
      );
      this._drawLineWithStyles(ctx, scaledCoords, data, "lower", "lowerLineColor", options, hRatio);
      ctx.restore();
    });
  }
  /**
   * Draw a single line with per-point color support
   *
   * @param ctx - Canvas rendering context
   * @param scaledCoords - Scaled screen coordinates
   * @param data - Processed data with optional per-point colors
   * @param coordField - Which coordinate to draw ('upper', 'middle', 'lower')
   * @param colorField - Which color property to check ('upperLineColor', 'middleLineColor', 'lowerLineColor')
   * @param options - Global options from attached series
   * @param hRatio - Horizontal pixel ratio for line width scaling
   */
  _drawLineWithStyles(ctx, scaledCoords, data, coordField, colorField, options, hRatio) {
    const globalVisibleField = `${coordField}LineVisible`;
    const globalColorField = `${coordField}LineColor`;
    const globalWidthField = `${coordField}LineWidth`;
    const globalStyleField = `${coordField}LineStyle`;
    if (!options[globalVisibleField]) return;
    const points = scaledCoords.map((coord) => ({
      x: coord.x,
      y: coord[coordField]
    }));
    const chart = this._source.getChart();
    const barSpacing = getBarSpacing(chart);
    const halfBarWidth = barSpacing * hRatio / 2;
    const hasPerPointColors = data.some((point) => point[colorField] !== void 0);
    if (!hasPerPointColors) {
      drawContinuousLine(
        ctx,
        points,
        {
          color: options[globalColorField],
          lineWidth: options[globalWidthField],
          lineStyle: options[globalStyleField]
        },
        {
          extendStart: halfBarWidth,
          extendEnd: halfBarWidth,
          skipInvalid: true
        }
      );
    } else {
      const segments = [];
      let currentColor = data[0][colorField] ?? options[globalColorField];
      let segmentStart = 0;
      for (let i = 1; i < data.length; i++) {
        const pointColor = data[i][colorField] ?? options[globalColorField];
        if (pointColor !== currentColor) {
          segments.push({
            startIdx: segmentStart,
            endIdx: i - 1,
            color: currentColor
          });
          currentColor = pointColor;
          segmentStart = i;
        }
      }
      segments.push({
        startIdx: segmentStart,
        endIdx: data.length - 1,
        color: currentColor
      });
      for (const segment of segments) {
        const segmentPoints = points.slice(segment.startIdx, segment.endIdx + 1);
        const validSegmentPoints = segmentPoints.filter(isValidRenderPoint);
        if (validSegmentPoints.length === 0) continue;
        const firstPoint = validSegmentPoints[0];
        const lastPoint = validSegmentPoints[validSegmentPoints.length - 1];
        const { extendStart, extendEnd } = calculateBarWidthExtensions(
          firstPoint,
          lastPoint,
          barSpacing,
          hRatio
        );
        const prevPoint = segment.startIdx > 0 ? points[segment.startIdx - 1] : void 0;
        const nextPoint = segment.endIdx + 1 < points.length ? points[segment.endIdx + 1] : void 0;
        drawContinuousLine(
          ctx,
          segmentPoints,
          {
            color: segment.color,
            lineWidth: options[globalWidthField],
            lineStyle: options[globalStyleField]
          },
          {
            extendStart,
            extendEnd,
            skipInvalid: true,
            prevPoint,
            nextPoint
          }
        );
      }
    }
  }
  /**
   * Draw a filled area with per-point color support using bar-width-aware rendering
   *
   * @param ctx - Canvas rendering context
   * @param scaledCoords - Scaled screen coordinates
   * @param data - Processed data with optional per-point fill colors
   * @param upperKey - Upper boundary key ('upper')
   * @param lowerKey - Lower boundary key ('middle' or 'lower')
   * @param colorField - Which color property to check ('upperFillColor' or 'lowerFillColor')
   * @param options - Global options from attached series
   */
  _drawFillWithStyles(ctx, scaledCoords, data, upperKey, lowerKey, colorField, options, hRatio) {
    const fillField = colorField === "upperFillColor" ? "upperFill" : "lowerFill";
    const globalVisibleField = fillField;
    const globalColorField = colorField;
    if (scaledCoords.length < 2) return;
    const upperPoints = scaledCoords.map((coord) => ({
      x: coord.x,
      y: coord[upperKey]
    }));
    const lowerPoints = scaledCoords.map((coord) => ({
      x: coord.x,
      y: coord[lowerKey]
    }));
    const chart = this._source.getChart();
    const barSpacing = getBarSpacing(chart);
    const halfBarSpacing = barSpacing / 2;
    const hasPerPointColors = data.some((point) => point[colorField] !== void 0);
    if (!hasPerPointColors) {
      if (!options[globalVisibleField]) return;
      const firstXMedia = upperPoints[0].x / hRatio;
      const lastXMedia = upperPoints[upperPoints.length - 1].x / hRatio;
      const startExtension = upperPoints[0].x - Math.round((firstXMedia - halfBarSpacing) * hRatio);
      const endExtension = Math.round((lastXMedia + halfBarSpacing) * hRatio) - upperPoints[upperPoints.length - 1].x;
      fillBetweenLines(ctx, upperPoints, lowerPoints, {
        fillStyle: options[globalColorField],
        edgeExtension: {
          start: startExtension,
          end: endExtension
        }
      });
    } else {
      const segments = [];
      let currentColor = data[0][colorField] ?? options[globalColorField];
      let segmentStart = 0;
      for (let i = 1; i < data.length; i++) {
        const pointColor = data[i][colorField] ?? options[globalColorField];
        if (pointColor !== currentColor) {
          segments.push({
            startIdx: segmentStart,
            endIdx: i - 1,
            color: currentColor
          });
          currentColor = pointColor;
          segmentStart = i;
        }
      }
      segments.push({
        startIdx: segmentStart,
        endIdx: data.length - 1,
        color: currentColor
      });
      for (const segment of segments) {
        const startIdx = segment.startIdx;
        const endIdx = segment.endIdx;
        const validUpper = upperPoints.slice(startIdx, endIdx + 1).filter(isValidRenderPoint);
        const validLower = lowerPoints.slice(startIdx, endIdx + 1).filter(isValidRenderPoint);
        if (validUpper.length === 0 || validLower.length === 0) continue;
        ctx.save();
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        const firstUpper = validUpper[0];
        const lastUpper = validUpper[validUpper.length - 1];
        const firstLower = validLower[0];
        const lastLower = validLower[validLower.length - 1];
        const firstXMedia = firstUpper.x / hRatio;
        const lastXMedia = lastUpper.x / hRatio;
        const startX = Math.round((firstXMedia - halfBarSpacing) * hRatio);
        const endX = Math.round((lastXMedia + halfBarSpacing) * hRatio);
        let startUpperY = firstUpper.y;
        let startLowerY = firstLower.y;
        let endUpperY = lastUpper.y;
        let endLowerY = lastLower.y;
        if (endIdx + 1 < upperPoints.length) {
          const nextUpper = upperPoints[endIdx + 1];
          const nextLower = lowerPoints[endIdx + 1];
          if (isValidRenderPoint(nextUpper)) {
            endUpperY = interpolateY(
              endX,
              lastUpper.x,
              lastUpper.y,
              nextUpper.x,
              nextUpper.y
            );
          }
          if (isValidRenderPoint(nextLower)) {
            endLowerY = interpolateY(
              endX,
              lastLower.x,
              lastLower.y,
              nextLower.x,
              nextLower.y
            );
          }
        }
        if (startIdx > 0) {
          const prevUpper = upperPoints[startIdx - 1];
          const prevLower = lowerPoints[startIdx - 1];
          if (isValidRenderPoint(prevUpper)) {
            startUpperY = interpolateY(
              startX,
              prevUpper.x,
              prevUpper.y,
              firstUpper.x,
              firstUpper.y
            );
          }
          if (isValidRenderPoint(prevLower)) {
            startLowerY = interpolateY(
              startX,
              prevLower.x,
              prevLower.y,
              firstLower.x,
              firstLower.y
            );
          }
        }
        ctx.moveTo(startX, startUpperY);
        for (const point of validUpper) {
          ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(endX, endUpperY);
        ctx.lineTo(endX, endLowerY);
        for (let j = validLower.length - 1; j >= 0; j--) {
          const point = validLower[j];
          ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(startX, startLowerY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }
  /**
   * Draw background method - handles FILL rendering (background elements)
   * This method renders the filled areas between upper-middle and middle-lower lines
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
      const coordinates = convertToCoordinates(data, chart, series, ["upper", "middle", "lower"]);
      const scaledCoords = coordinates.map((coord) => ({
        x: coord.x !== null ? coord.x * hRatio : null,
        upper: coord.upper !== null ? coord.upper * vRatio : null,
        middle: coord.middle !== null ? coord.middle * vRatio : null,
        lower: coord.lower !== null ? coord.lower * vRatio : null
      }));
      this._drawFillWithStyles(
        ctx,
        scaledCoords,
        data,
        "upper",
        "middle",
        "upperFillColor",
        options,
        hRatio
      );
      this._drawFillWithStyles(
        ctx,
        scaledCoords,
        data,
        "middle",
        "lower",
        "lowerFillColor",
        options,
        hRatio
      );
      ctx.restore();
    });
  }
}
const BandUpperAxisView = createPrimitiveAxisView(
  "upper",
  "upperLineColor"
);
const BandMiddleAxisView = createPrimitiveAxisView(
  "middle",
  "middleLineColor"
);
const BandLowerAxisView = createPrimitiveAxisView(
  "lower",
  "lowerLineColor"
);
class BandPrimitive extends BaseSeriesPrimitive {
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
      middleLine: "line",
      lowerLine: "line",
      upperFillColor: "color",
      upperFill: "boolean",
      lowerFillColor: "color",
      lowerFill: "boolean"
    };
  }
  // Required: Initialize views
  _initializeViews() {
    this._addPaneView(new BandPrimitivePaneView(this));
    this._addPriceAxisView(new BandUpperAxisView(this));
    this._addPriceAxisView(new BandMiddleAxisView(this));
    this._addPriceAxisView(new BandLowerAxisView(this));
  }
  // Required: Process raw data
  _processData(rawData) {
    return rawData.map((item) => {
      const upper = item.upper;
      const middle = item.middle;
      const lower = item.lower;
      if (upper === null || upper === void 0 || isNaN(upper) || middle === null || middle === void 0 || isNaN(middle) || lower === null || lower === void 0 || isNaN(lower)) {
        return null;
      }
      const result = {
        time: item.time,
        upper,
        middle,
        lower
      };
      if (item.upperLineColor !== void 0) {
        result.upperLineColor = item.upperLineColor;
      }
      if (item.middleLineColor !== void 0) {
        result.middleLineColor = item.middleLineColor;
      }
      if (item.lowerLineColor !== void 0) {
        result.lowerLineColor = item.lowerLineColor;
      }
      if (item.upperFillColor !== void 0) {
        result.upperFillColor = item.upperFillColor;
      }
      if (item.lowerFillColor !== void 0) {
        result.lowerFillColor = item.lowerFillColor;
      }
      return result;
    }).filter((item) => item !== null);
  }
  // Optional: Custom z-order default
  _getDefaultZOrder() {
    return "normal";
  }
}
export {
  BandPrimitive
};
//# sourceMappingURL=BandPrimitive-BJsNeyNJ.js.map
