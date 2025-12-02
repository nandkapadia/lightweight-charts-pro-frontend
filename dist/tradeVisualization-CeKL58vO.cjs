"use strict";
const TradeTemplateProcessor = require("./TradeTemplateProcessor-Dadi3Bon.cjs");
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
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
      if (time.includes("T") || time.includes("Z") || time.includes("+")) {
        const date2 = new Date(time);
        if (isNaN(date2.getTime())) {
          return null;
        }
        return Math.floor(date2.getTime() / 1e3);
      }
      const date = new Date(time);
      if (isNaN(date.getTime())) {
        return null;
      }
      return Math.floor(date.getTime() / 1e3);
    }
    return null;
  } catch {
    return null;
  }
}
function findNearestTime(targetTime, chartData) {
  if (!chartData || chartData.length === 0) {
    return null;
  }
  let nearestTime = null;
  let minDiff = Infinity;
  for (const item of chartData) {
    if (!item.time) continue;
    let itemTime = null;
    if (typeof item.time === "number") {
      itemTime = item.time > 1e12 ? Math.floor(item.time / 1e3) : item.time;
    } else if (typeof item.time === "string") {
      itemTime = parseTime(item.time);
    }
    if (itemTime === null) continue;
    const diff = Math.abs(itemTime - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      nearestTime = itemTime;
    }
  }
  return nearestTime;
}
function createTradeRectangles(trades, options, chartData) {
  const rectangles = [];
  trades.forEach((trade, _index) => {
    if (!trade.entryTime || typeof trade.entryPrice !== "number" || typeof trade.exitPrice !== "number") {
      return;
    }
    const time1 = parseTime(trade.entryTime);
    if (time1 === null) {
      return;
    }
    let time2 = null;
    if (trade.exitTime) {
      time2 = parseTime(trade.exitTime);
      if (time2 === null) {
        return;
      }
    } else {
      if (chartData && chartData.length > 0) {
        const lastTime = chartData[chartData.length - 1]?.time;
        if (lastTime) {
          time2 = parseTime(lastTime);
        }
      }
      if (time2 === null) {
        return;
      }
    }
    let adjustedTime1 = time1;
    let adjustedTime2 = time2;
    if (chartData && chartData.length > 0) {
      const nearestTime1 = findNearestTime(time1, chartData);
      const nearestTime2 = findNearestTime(time2, chartData);
      if (nearestTime1) adjustedTime1 = nearestTime1;
      if (nearestTime2) adjustedTime2 = nearestTime2;
    }
    if (trade.entryPrice <= 0 || trade.exitPrice <= 0) {
      return;
    }
    const isProfitable = trade.isProfitable ?? false;
    const color = isProfitable ? options.rectangleColorProfit || "#4CAF50" : options.rectangleColorLoss || "#F44336";
    const opacity = options.rectangleFillOpacity || 0.25;
    const minTime = Math.min(adjustedTime1, adjustedTime2);
    const maxTime = Math.max(adjustedTime1, adjustedTime2);
    const minPrice = Math.min(trade.entryPrice, trade.exitPrice);
    const maxPrice = Math.max(trade.entryPrice, trade.exitPrice);
    const rectangle = {
      time1: minTime,
      // Always the earlier time
      price1: minPrice,
      // Always the lower price
      time2: maxTime,
      // Always the later time
      price2: maxPrice,
      // Always the higher price
      fillColor: color,
      borderColor: color,
      borderWidth: options.rectangleBorderWidth || 3,
      borderStyle: "solid",
      opacity,
      // Pass all additional trade data for template access
      ...trade
      // Spread all trade properties for flexible template access
    };
    rectangles.push(rectangle);
  });
  return rectangles;
}
function createTradeMarkers(trades, options, chartData) {
  const markers = [];
  trades.forEach((trade, _index) => {
    if (!trade.entryTime || typeof trade.entryPrice !== "number" || typeof trade.exitPrice !== "number") {
      return;
    }
    const entryTime = parseTime(trade.entryTime);
    if (!entryTime) {
      return;
    }
    let exitTime = null;
    if (trade.exitTime) {
      exitTime = parseTime(trade.exitTime);
      if (!exitTime) {
        return;
      }
    }
    let adjustedEntryTime = entryTime;
    let adjustedExitTime = exitTime;
    if (chartData && chartData.length > 0) {
      const nearestEntryTime = findNearestTime(entryTime, chartData);
      if (nearestEntryTime) adjustedEntryTime = nearestEntryTime;
      if (exitTime) {
        const nearestExitTime = findNearestTime(exitTime, chartData);
        if (nearestExitTime) adjustedExitTime = nearestExitTime;
      }
    }
    const tradeType = trade.trade_type || trade.tradeType || "long";
    const entryColor = tradeType === "long" ? options.entryMarkerColorLong || "#2196F3" : options.entryMarkerColorShort || "#FF9800";
    let entryMarkerText = "";
    if (options.showMarkerText !== false) {
      if (options.entryMarkerTemplate) {
        const result = TradeTemplateProcessor.TradeTemplateProcessor.processTemplate(
          options.entryMarkerTemplate,
          trade
          // Pass entire trade object for flexible template access
        );
        entryMarkerText = result.content;
      } else if (options.showPnlInMarkers && trade.text && typeof trade.text === "string") {
        entryMarkerText = trade.text;
      } else if (options.showPnlInMarkers && trade.pnl !== void 0) {
        entryMarkerText = `$${trade.pnl.toFixed(2)}`;
      } else {
        entryMarkerText = `$${trade.entryPrice.toFixed(2)}`;
      }
    }
    const entryMarker = {
      time: adjustedEntryTime,
      position: options.entryMarkerPosition || (tradeType === "long" ? "belowBar" : "aboveBar"),
      color: entryColor,
      shape: options.entryMarkerShape || (tradeType === "long" ? "arrowUp" : "arrowDown"),
      text: entryMarkerText,
      size: options.markerSize || 1
    };
    markers.push(entryMarker);
    if (adjustedExitTime) {
      const isProfit = trade.isProfitable ?? false;
      const exitColor = isProfit ? options.exitMarkerColorProfit || "#4CAF50" : options.exitMarkerColorLoss || "#F44336";
      let exitMarkerText = "";
      if (options.showMarkerText !== false) {
        if (options.exitMarkerTemplate) {
          const result = TradeTemplateProcessor.TradeTemplateProcessor.processTemplate(
            options.exitMarkerTemplate,
            trade
            // Pass entire trade object for flexible template access
          );
          exitMarkerText = result.content;
        } else {
          exitMarkerText = `$${trade.exitPrice.toFixed(2)}`;
        }
      }
      const exitMarker = {
        time: adjustedExitTime,
        position: options.exitMarkerPosition || (tradeType === "long" ? "aboveBar" : "belowBar"),
        color: exitColor,
        shape: options.exitMarkerShape || (tradeType === "long" ? "arrowDown" : "arrowUp"),
        text: exitMarkerText,
        size: options.markerSize || 1
      };
      markers.push(exitMarker);
    }
  });
  return markers;
}
function createTradeVisualElements(trades, options, chartData, _priceScaleId) {
  const markers = [];
  const rectangles = [];
  const annotations = [];
  if (!trades || trades.length === 0) {
    return { markers, rectangles, annotations };
  }
  if (options && (options.style === "markers" || options.style === "both")) {
    markers.push(...createTradeMarkers(trades, options, chartData));
  }
  if (options && (options.style === "rectangles" || options.style === "both")) {
    const newRectangles = createTradeRectangles(trades, options, chartData);
    rectangles.push(...newRectangles);
  }
  if (options.showAnnotations) {
    trades.forEach((trade) => {
      const textParts = [];
      if (options.showTradeId && trade.id) {
        textParts.push(`#${trade.id}`);
      }
      if (options.showTradeType && trade.tradeType) {
        textParts.push(trade.tradeType.toUpperCase());
      }
      if (options.showQuantity) {
        textParts.push(`Qty: ${trade.quantity}`);
      }
      if (trade.pnlPercentage !== void 0) {
        textParts.push(`P&L: ${trade.pnlPercentage.toFixed(1)}%`);
      }
      const entryTime = parseTime(trade.entryTime);
      const exitTime = parseTime(trade.exitTime);
      if (entryTime === null || exitTime === null) {
        return;
      }
      const midTime = (entryTime + exitTime) / 2;
      const midPrice = (trade.entryPrice + trade.exitPrice) / 2;
      annotations.push({
        type: "text",
        time: midTime,
        price: midPrice,
        text: textParts.join(" | "),
        fontSize: options.annotationFontSize || 12,
        backgroundColor: options.annotationBackground || "rgba(255, 255, 255, 0.8)",
        color: "#000000",
        padding: SingletonBase.UniversalSpacing.DEFAULT_PADDING
      });
    });
  }
  return { markers, rectangles, annotations };
}
function convertTradeRectanglesToPluginFormat(tradeRectangles, chart, series) {
  if (!chart || !series) {
    return [];
  }
  const timeScale = chart.timeScale();
  const timeScaleWidth = timeScale.width();
  if (timeScaleWidth === 0) {
    return [];
  }
  const { ChartCoordinateService } = require("../services/ChartCoordinateService");
  const coordinateService = ChartCoordinateService.getInstance();
  return tradeRectangles.map((rect, index) => {
    try {
      const boundingBox = coordinateService.calculateOverlayPosition(
        rect.time1,
        rect.time2,
        rect.price1,
        rect.price2,
        chart,
        series,
        0
        // paneId
      );
      if (!boundingBox) {
        return null;
      }
      const pluginRect = {
        id: `trade-rect-${index}`,
        x1: boundingBox.x,
        y1: boundingBox.y,
        x2: boundingBox.x + boundingBox.width,
        y2: boundingBox.y + boundingBox.height,
        color: rect.fillColor,
        borderColor: rect.borderColor,
        borderWidth: rect.borderWidth,
        fillOpacity: rect.opacity,
        borderOpacity: 1,
        label: `Trade ${index + 1}`,
        labelColor: "#000000",
        labelFontSize: 12,
        labelBackground: "rgba(255, 255, 255, 0.8)",
        labelPadding: 4,
        zIndex: 10
      };
      return pluginRect;
    } catch {
      return null;
    }
  }).filter((rect) => rect !== null);
}
async function convertTradeRectanglesToPluginFormatWhenReady(tradeRectangles, chart, series) {
  if (!chart || !series) {
    return [];
  }
  const { ChartReadyDetector } = await Promise.resolve().then(() => require("./chartReadyDetection-XWRDMitZ.cjs"));
  try {
    const container = chart.chartElement();
    if (!container) {
      return [];
    }
    const isReady = await ChartReadyDetector.waitForChartReady(chart, container, {
      minWidth: 200,
      minHeight: 200,
      maxAttempts: 10,
      baseDelay: 200
    });
    if (!isReady) {
      return [];
    }
    return convertTradeRectanglesToPluginFormat(tradeRectangles, chart, series);
  } catch {
    return convertTradeRectanglesToPluginFormat(tradeRectangles, chart, series);
  }
}
exports.convertTradeRectanglesToPluginFormat = convertTradeRectanglesToPluginFormat;
exports.convertTradeRectanglesToPluginFormatWhenReady = convertTradeRectanglesToPluginFormatWhenReady;
exports.createTradeVisualElements = createTradeVisualElements;
//# sourceMappingURL=tradeVisualization-CeKL58vO.cjs.map
