function convertToRendererCoordinates(data, timeScale, seriesMap, config) {
  return data.map((item) => {
    const timeValue = item[config.timeField];
    const result = {
      x: timeScale.timeToCoordinate(timeValue) ?? -100
    };
    config.coordinateFields.forEach((field) => {
      const series = seriesMap[field];
      const fieldValue = item[field];
      if (series && fieldValue !== void 0 && typeof fieldValue === "number") {
        result[`${field}Y`] = series.priceToCoordinate(fieldValue) ?? -100;
      }
    });
    return result;
  });
}
function convertTwoLineCoordinates(data, timeScale, upperSeries, lowerSeries) {
  if (!upperSeries || !lowerSeries || !timeScale) {
    return [];
  }
  return data.map((item) => ({
    x: timeScale.timeToCoordinate(item.time) ?? -100,
    upperY: upperSeries.priceToCoordinate(item.upper) ?? -100,
    lowerY: lowerSeries.priceToCoordinate(item.lower) ?? -100,
    ...item
    // Include original data for additional properties (like fillColor)
  }));
}
function convertThreeLineCoordinates(data, timeScale, upperSeries, middleSeries, lowerSeries) {
  if (!upperSeries || !middleSeries || !lowerSeries || !timeScale) {
    return [];
  }
  return data.map((item) => ({
    x: timeScale.timeToCoordinate(item.time) ?? -100,
    upperY: upperSeries.priceToCoordinate(item.upper) ?? -100,
    middleY: middleSeries.priceToCoordinate(item.middle) ?? -100,
    lowerY: lowerSeries.priceToCoordinate(item.lower) ?? -100
  }));
}
function batchConvertCoordinates(items, timeScale, seriesMap, coordinateFields) {
  return items.map((item, _index) => {
    try {
      const x = timeScale.timeToCoordinate(item.time);
      if (!isValidCoordinate(x)) {
        return null;
      }
      const result = { x };
      for (const field of coordinateFields) {
        const series = seriesMap[field];
        const fieldValue = item[field];
        if (series && fieldValue !== void 0 && typeof fieldValue === "number") {
          const coord = series.priceToCoordinate(fieldValue) ?? -100;
          if (isValidCoordinate(coord)) {
            result[`${field}Y`] = coord;
          }
        }
      }
      return result;
    } catch {
      return null;
    }
  });
}
function isValidCoordinate(coord) {
  return coord !== null && coord !== void 0 && coord > -100;
}
function isValidRenderPoint(point) {
  return point !== null && point.x !== null && point.y !== null && typeof point.x === "number" && typeof point.y === "number" && !isNaN(point.x) && !isNaN(point.y);
}
function filterValidRenderPoints(points) {
  return points.filter(
    (point) => point && point.x !== null && point.y !== null && typeof point.x === "number" && typeof point.y === "number" && !isNaN(point.x) && !isNaN(point.y)
  );
}
function filterValidCoordinates(points) {
  return points.filter(
    (point) => isValidCoordinate(point.x) && Object.keys(point).some((key) => key !== "x" && isValidCoordinate(point[key]))
  );
}
function calculateVisibleRange(points) {
  if (points.length === 0) return null;
  let from = 0;
  let to = points.length;
  for (let i = 0; i < points.length; i++) {
    if (points[i] && points[i].x !== null && isValidCoordinate(points[i].x)) {
      from = i;
      break;
    }
  }
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i] && points[i].x !== null && isValidCoordinate(points[i].x)) {
      to = i + 1;
      break;
    }
  }
  return { from, to };
}
function setupCanvasContext(target, zIndex) {
  return (callback) => {
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      ctx.scale(scope.horizontalPixelRatio, scope.verticalPixelRatio);
      if (typeof zIndex === "number") {
        ctx.globalCompositeOperation = "source-over";
      }
      callback(ctx);
    });
  };
}
function renderWithScaledCanvas(target, callback) {
  target.useBitmapCoordinateSpace((scope) => {
    const ctx = scope.context;
    if (!ctx) return;
    ctx.scale(scope.horizontalPixelRatio, scope.verticalPixelRatio);
    callback(ctx, scope);
  });
}
function createFillPath(ctx, upperPoints, lowerPoints, fillStyle) {
  const validUpperPoints = filterValidRenderPoints(upperPoints);
  const validLowerPoints = filterValidRenderPoints(lowerPoints);
  if (validUpperPoints.length === 0 || validLowerPoints.length === 0) return;
  ctx.beginPath();
  const firstUpper = validUpperPoints[0];
  if (firstUpper.x !== null && firstUpper.y !== null) {
    ctx.moveTo(firstUpper.x, firstUpper.y);
  }
  for (let i = 1; i < validUpperPoints.length; i++) {
    const point = validUpperPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  for (let i = validLowerPoints.length - 1; i >= 0; i--) {
    const point = validLowerPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
}
function createGradientFillPath(ctx, upperPoints, lowerPoints, coloredPoints) {
  const validUpperPoints = filterValidRenderPoints(upperPoints);
  const validLowerPoints = filterValidRenderPoints(lowerPoints);
  const validColoredPoints = coloredPoints.filter((p) => p.x !== null && p.y !== null && p.color);
  if (validUpperPoints.length === 0 || validLowerPoints.length === 0 || validColoredPoints.length === 0)
    return;
  ctx.beginPath();
  const firstUpper = validUpperPoints[0];
  if (firstUpper.x !== null && firstUpper.y !== null) {
    ctx.moveTo(firstUpper.x, firstUpper.y);
  }
  for (let i = 1; i < validUpperPoints.length; i++) {
    const point = validUpperPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  for (let i = validLowerPoints.length - 1; i >= 0; i--) {
    const point = validLowerPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  ctx.closePath();
  const firstPoint = validColoredPoints[0];
  const lastPoint = validColoredPoints[validColoredPoints.length - 1];
  const gradient = ctx.createLinearGradient(firstPoint.x || 0, 0, lastPoint.x || 0, 0);
  for (let i = 0; i < validColoredPoints.length; i++) {
    const point = validColoredPoints[i];
    const position = i / (validColoredPoints.length - 1);
    if (point.color) {
      gradient.addColorStop(position, point.color);
    }
  }
  ctx.fillStyle = gradient;
  ctx.fill();
}
var LineStyle = /* @__PURE__ */ ((LineStyle2) => {
  LineStyle2[LineStyle2["Solid"] = 0] = "Solid";
  LineStyle2[LineStyle2["Dotted"] = 1] = "Dotted";
  LineStyle2[LineStyle2["Dashed"] = 2] = "Dashed";
  LineStyle2[LineStyle2["LargeDashed"] = 3] = "LargeDashed";
  LineStyle2[LineStyle2["SparseDotted"] = 4] = "SparseDotted";
  return LineStyle2;
})(LineStyle || {});
function applyLineDashPattern(ctx, lineStyle = 0) {
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
    case 3:
      ctx.setLineDash([15, 10]);
      break;
    case 4:
      ctx.setLineDash([2, 8]);
      break;
    default:
      ctx.setLineDash([]);
  }
}
function applyLineStyle(ctx, config) {
  ctx.strokeStyle = config.color;
  ctx.lineWidth = config.lineWidth;
  if (config.lineStyle !== void 0) {
    applyLineDashPattern(ctx, config.lineStyle);
  }
  if (config.lineCap) {
    ctx.lineCap = config.lineCap;
  }
  if (config.lineJoin) {
    ctx.lineJoin = config.lineJoin;
  }
}
function drawContinuousLine(ctx, points, config, options) {
  const validPoints = options?.skipInvalid ? filterValidRenderPoints(points) : points;
  if (validPoints.length === 0) return;
  ctx.save();
  applyLineStyle(ctx, config);
  ctx.beginPath();
  const firstPoint = validPoints[0];
  const lastPoint = validPoints[validPoints.length - 1];
  let startX = firstPoint.x;
  let startY = firstPoint.y;
  if (options?.extendStart) {
    startX = firstPoint.x - options.extendStart;
    if (options.prevPoint && options.prevPoint.x !== null && options.prevPoint.y !== null) {
      startY = interpolateY(
        startX,
        options.prevPoint.x,
        options.prevPoint.y,
        firstPoint.x,
        firstPoint.y
      );
    }
  }
  ctx.moveTo(startX, startY);
  for (let i = 0; i < validPoints.length; i++) {
    const point = validPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  if (options?.extendEnd && lastPoint.x !== null && lastPoint.y !== null) {
    const endX = lastPoint.x + options.extendEnd;
    let endY = lastPoint.y;
    if (options.nextPoint && options.nextPoint.x !== null && options.nextPoint.y !== null) {
      endY = interpolateY(
        endX,
        lastPoint.x,
        lastPoint.y,
        options.nextPoint.x,
        options.nextPoint.y
      );
    }
    ctx.lineTo(endX, endY);
  }
  ctx.stroke();
  ctx.restore();
}
function calculateBarWidthExtensions(firstPoint, lastPoint, barSpacing, hRatio) {
  const halfBarSpacing = barSpacing / 2;
  const firstXMedia = firstPoint.x / hRatio;
  const extendStart = firstPoint.x - Math.round((firstXMedia - halfBarSpacing) * hRatio);
  const lastXMedia = lastPoint.x / hRatio;
  const extendEnd = Math.round((lastXMedia + halfBarSpacing) * hRatio) - lastPoint.x;
  return { extendStart, extendEnd };
}
function interpolateY(x, x1, y1, x2, y2) {
  return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}
function drawSegmentedLine(ctx, segments) {
  for (const segment of segments) {
    if (segment.points.length > 0) {
      drawContinuousLine(ctx, segment.points, segment.style, { skipInvalid: true });
    }
  }
}
function fillBetweenLines(ctx, upperPoints, lowerPoints, config) {
  const validUpperPoints = filterValidRenderPoints(upperPoints);
  const validLowerPoints = filterValidRenderPoints(lowerPoints);
  if (validUpperPoints.length === 0 || validLowerPoints.length === 0) return;
  ctx.save();
  if (config.opacity !== void 0) {
    ctx.globalAlpha = config.opacity;
  }
  ctx.beginPath();
  const firstUpper = validUpperPoints[0];
  const lastUpper = validUpperPoints[validUpperPoints.length - 1];
  const startX = config.edgeExtension?.start ? firstUpper.x - config.edgeExtension.start : firstUpper.x;
  const endX = config.edgeExtension?.end ? lastUpper.x + config.edgeExtension.end : lastUpper.x;
  ctx.moveTo(startX, firstUpper.y);
  for (const point of validUpperPoints) {
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  if (config.edgeExtension?.end) {
    ctx.lineTo(endX, lastUpper.y);
  }
  for (let i = validLowerPoints.length - 1; i >= 0; i--) {
    const point = validLowerPoints[i];
    if (point.x !== null && point.y !== null) {
      ctx.lineTo(point.x, point.y);
    }
  }
  if (config.edgeExtension?.start) {
    const firstLower = validLowerPoints[0];
    ctx.lineTo(startX, firstLower.y);
  }
  ctx.closePath();
  ctx.fillStyle = config.fillStyle;
  ctx.fill();
  ctx.restore();
}
function fillTrapezoidalSegments(ctx, segments) {
  for (const seg of segments) {
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1Upper);
    ctx.lineTo(seg.x2, seg.y2Upper);
    ctx.lineTo(seg.x2, seg.y2Lower);
    ctx.lineTo(seg.x1, seg.y1Lower);
    ctx.closePath();
    ctx.fillStyle = seg.fillStyle;
    ctx.fill();
  }
}
function createHorizontalGradient(ctx, startX, endX, coloredPoints) {
  const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
  const validPoints = coloredPoints.filter((p) => p.x !== null && p.color).sort((a, b) => a.x - b.x);
  if (validPoints.length === 0) {
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    return gradient;
  }
  for (const point of validPoints) {
    const position = (point.x - startX) / (endX - startX);
    const clampedPosition = Math.max(0, Math.min(1, position));
    if (point.color) {
      gradient.addColorStop(clampedPosition, point.color);
    }
  }
  return gradient;
}
function createVerticalGradient(ctx, startY, endY, stops) {
  const gradient = ctx.createLinearGradient(0, startY, 0, endY);
  for (const stop of stops) {
    gradient.addColorStop(stop.position, stop.color);
  }
  return gradient;
}
function withSavedState(ctx, callback) {
  ctx.save();
  try {
    callback(ctx);
  } finally {
    ctx.restore();
  }
}
function applyCanvasState(ctx, state) {
  if (state.fillStyle) ctx.fillStyle = state.fillStyle;
  if (state.strokeStyle) ctx.strokeStyle = state.strokeStyle;
  if (state.lineWidth !== void 0) ctx.lineWidth = state.lineWidth;
  if (state.globalAlpha !== void 0) ctx.globalAlpha = state.globalAlpha;
  if (state.globalCompositeOperation) ctx.globalCompositeOperation = state.globalCompositeOperation;
  if (state.lineCap) ctx.lineCap = state.lineCap;
  if (state.lineJoin) ctx.lineJoin = state.lineJoin;
  if (state.lineDash) ctx.setLineDash(state.lineDash);
}
function drawRectangle(ctx, config) {
  ctx.save();
  if (config.fillColor) {
    ctx.fillStyle = config.fillColor;
    if (config.fillOpacity !== void 0) {
      ctx.globalAlpha = config.fillOpacity;
    }
    ctx.fillRect(config.x, config.y, config.width, config.height);
    ctx.globalAlpha = 1;
  }
  if (config.strokeColor && config.strokeWidth) {
    ctx.strokeStyle = config.strokeColor;
    ctx.lineWidth = config.strokeWidth;
    if (config.strokeOpacity !== void 0) {
      ctx.globalAlpha = config.strokeOpacity;
    }
    ctx.strokeRect(config.x, config.y, config.width, config.height);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function fillVerticalBand(ctx, x1, x2, y1, y2, fillStyle) {
  ctx.fillStyle = fillStyle;
  const width = Math.max(1, x2 - x1);
  const height = y2 - y1;
  ctx.fillRect(x1, y1, width, height);
}
function isValidCoordinateWithBounds(coord, bounds) {
  if (!isValidCoordinate(coord)) return false;
  const value = coord;
  const tolerance = bounds?.tolerance ?? 0;
  if (bounds?.minX !== void 0 && value < bounds.minX - tolerance) return false;
  if (bounds?.maxX !== void 0 && value > bounds.maxX + tolerance) return false;
  if (bounds?.minY !== void 0 && value < bounds.minY - tolerance) return false;
  if (bounds?.maxY !== void 0 && value > bounds.maxY + tolerance) return false;
  return true;
}
function filterPointsByBounds(points, bounds) {
  return points.filter(
    (point) => isValidCoordinateWithBounds(point.x, bounds) && isValidCoordinateWithBounds(point.y, bounds)
  );
}
function calculateExtendedRange(firstPoint, lastPoint, config) {
  const halfBarWidth = config.barWidth / 2;
  const extension = config.extensionPixels ?? 50;
  return {
    startX: firstPoint.x - halfBarWidth - extension,
    endX: lastPoint.x + halfBarWidth + extension
  };
}
function parseHexColor(hex) {
  const cleanHex = hex.replace("#", "");
  let r, g, b, a;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
    a = 1;
  } else if (cleanHex.length === 4) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
    a = parseInt(cleanHex[3] + cleanHex[3], 16) / 255;
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
    a = 1;
  } else if (cleanHex.length === 8) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
    a = parseInt(cleanHex.substring(6, 8), 16) / 255;
  } else {
    return null;
  }
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }
  return { r, g, b, a };
}
function parseCssColor(cssColor) {
  if (cssColor.startsWith("#")) {
    return parseHexColor(cssColor);
  }
  const rgbaMatch = cssColor.match(/rgba?\(([^)]+)\)/);
  if (rgbaMatch) {
    const values = rgbaMatch[1].split(",").map((v) => parseFloat(v.trim()));
    if (values.length >= 3) {
      return {
        r: values[0],
        g: values[1],
        b: values[2],
        a: values[3] !== void 0 ? values[3] : 1
      };
    }
  }
  return null;
}
function hexToRgbaString(hex, alpha = 1) {
  const parsed = parseHexColor(hex);
  if (!parsed) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
}
function hexToRgba(hex) {
  return parseHexColor(hex);
}
function rgbaToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function cssToHex(cssColor) {
  const parsed = parseCssColor(cssColor);
  if (parsed) {
    return rgbaToHex(parsed.r, parsed.g, parsed.b);
  }
  return cssColor;
}
function extractColorAndOpacity(color) {
  const rgba = parseCssColor(color);
  if (!rgba) {
    return { color: color || "#2196F3", opacity: 100 };
  }
  const hexColor = rgbaToHex(rgba.r, rgba.g, rgba.b);
  const opacity = Math.round(rgba.a * 100);
  return { color: hexColor, opacity };
}
function toCss(color, opacity = 100) {
  const rgba = parseCssColor(color);
  if (!rgba) {
    return color;
  }
  if (opacity >= 100 && !color.startsWith("rgba")) {
    return rgbaToHex(rgba.r, rgba.g, rgba.b);
  }
  const alpha = Math.max(0, Math.min(1, opacity / 100));
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}
function interpolateColor(startColor, endColor, factor) {
  factor = Math.max(0, Math.min(1, factor));
  try {
    const start = parseHexColor(startColor);
    const end = parseHexColor(endColor);
    if (!start || !end) {
      return startColor;
    }
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return rgbaToHex(r, g, b);
  } catch {
    return startColor;
  }
}
function calculateGradientColor(value, allValues, index, startColor, endColor, normalize = true) {
  if (normalize) {
    const spread = Math.abs(value.upper - value.lower);
    const maxSpread = Math.max(...allValues.map((d) => Math.abs(d.upper - d.lower)));
    const factor = maxSpread > 0 ? Math.min(spread / maxSpread, 1) : 0;
    return interpolateColor(startColor, endColor, factor);
  } else {
    const factor = allValues.length > 1 ? index / (allValues.length - 1) : 0;
    return interpolateColor(startColor, endColor, factor);
  }
}
function isTransparent(color) {
  if (!color) return true;
  if (color === "transparent") return true;
  if (color.startsWith("rgba(")) {
    const match = color.match(/rgba\([^)]+,\s*([^)]+)\)/);
    if (match && parseFloat(match[1]) === 0) return true;
  }
  if (color.startsWith("#") && color.length === 9) {
    const alpha = color.substring(7, 9);
    if (alpha === "00") return true;
  }
  if (color.startsWith("#") && color.length === 5) {
    const alpha = color.substring(4, 5);
    if (alpha === "0") return true;
  }
  return false;
}
function isValidHexColor(color) {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
}
function sanitizeHexColor(input) {
  let color = input.startsWith("#") ? input : `#${input}`;
  color = color.toUpperCase();
  return isValidHexColor(color) ? color : "#2196F3";
}
function getContrastColor(backgroundColor) {
  const rgba = parseHexColor(backgroundColor);
  if (!rgba) {
    return "#333333";
  }
  const { r, g, b } = rgba;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#ffffff";
}
function generateColorPalette(baseColor, count = 5) {
  const rgba = parseHexColor(baseColor);
  if (!rgba) {
    return [baseColor];
  }
  const colors = [];
  const { r, g, b } = rgba;
  for (let i = 0; i < count; i++) {
    const factor = 0.2 + i / (count - 1) * 0.6;
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    colors.push(rgbaToHex(newR, newG, newB));
  }
  return colors;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function getSolidColorFromFill(fillColor) {
  const parsed = parseCssColor(fillColor);
  if (!parsed) {
    return fillColor;
  }
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, 1)`;
}
function debounce(func, wait) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}
class SignalColorCalculator {
  /**
   * Check if data contains any values that are not 0 or 1.
   * This determines whether alertColor should be used.
   *
   * Handles both boolean (true/false) and numeric (0/1) values by
   * converting to numbers first: Number(false) = 0, Number(true) = 1
   *
   * @param values - Array of values to check
   * @returns True if any value is not 0 or 1, false otherwise
   */
  static checkForNonBooleanValues(values) {
    for (const value of values) {
      const numValue = Number(value);
      if (numValue !== 0 && numValue !== 1) {
        return true;
      }
    }
    return false;
  }
  /**
   * Get color for a signal value
   *
   * Color mapping:
   * - value = 0 → neutralColor
   * - value > 0 → signalColor
   * - value < 0 → alertColor (only if hasNonBooleanValues), else signalColor
   *
   * Converts boolean values to numbers to handle both true/false and 0/1:
   * - Number(false) = 0 → neutralColor
   * - Number(true) = 1 → signalColor
   *
   * @param value - The signal value (can be boolean or number)
   * @param options - Color options
   * @param hasNonBooleanValues - Whether dataset contains non-boolean values
   * @returns The appropriate color string
   */
  static getColorForValue(value, options, hasNonBooleanValues) {
    const numValue = Number(value);
    if (numValue === 0) {
      return options.neutralColor || "transparent";
    } else if (numValue > 0) {
      return options.signalColor || "transparent";
    } else {
      if (hasNonBooleanValues) {
        return options.alertColor || options.signalColor || "transparent";
      } else {
        return options.signalColor || "transparent";
      }
    }
  }
}
export {
  calculateVisibleRange as A,
  setupCanvasContext as B,
  renderWithScaledCanvas as C,
  createFillPath as D,
  createGradientFillPath as E,
  applyLineDashPattern as F,
  applyLineStyle as G,
  drawContinuousLine as H,
  calculateBarWidthExtensions as I,
  interpolateY as J,
  drawSegmentedLine as K,
  LineStyle as L,
  fillBetweenLines as M,
  fillTrapezoidalSegments as N,
  createHorizontalGradient as O,
  createVerticalGradient as P,
  withSavedState as Q,
  applyCanvasState as R,
  SignalColorCalculator as S,
  drawRectangle as T,
  fillVerticalBand as U,
  isValidCoordinateWithBounds as V,
  filterPointsByBounds as W,
  calculateExtendedRange as X,
  parseCssColor as a,
  hexToRgba as b,
  cssToHex as c,
  calculateGradientColor as d,
  extractColorAndOpacity as e,
  isTransparent as f,
  isValidHexColor as g,
  hexToRgbaString as h,
  interpolateColor as i,
  getContrastColor as j,
  generateColorPalette as k,
  clamp as l,
  getSolidColorFromFill as m,
  debounce as n,
  convertToRendererCoordinates as o,
  parseHexColor as p,
  convertTwoLineCoordinates as q,
  rgbaToHex as r,
  sanitizeHexColor as s,
  toCss as t,
  convertThreeLineCoordinates as u,
  batchConvertCoordinates as v,
  isValidCoordinate as w,
  isValidRenderPoint as x,
  filterValidRenderPoints as y,
  filterValidCoordinates as z
};
//# sourceMappingURL=signalColorUtils-Coc3RHvl.js.map
