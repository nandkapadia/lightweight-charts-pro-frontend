/**
 * @fileoverview Trade Visualization Service
 *
 * Handles creation and rendering of trade visualization elements including
 * rectangles, markers, lines, arrows, and zones. Provides timezone-agnostic
 * time parsing and template-based marker generation.
 *
 * This service is responsible for:
 * - Converting trade data to visual primitives (rectangles, markers)
 * - Timezone-agnostic time parsing (critical for consistency)
 * - Template-based marker text generation
 * - Color determination based on profitability
 * - Multiple visualization styles (rectangles, markers, lines, etc.)
 *
 * Architecture:
 * - Pure functions (no state)
 * - Backend-driven display values (no frontend calculations)
 * - Template engine integration for flexible text
 * - Support for additional_data pattern
 *
 * Trade Visualization Modes:
 * - RECTANGLES: Visual boxes showing trade duration and P&L
 * - MARKERS: Entry/exit markers with optional text
 * - BOTH: Rectangles + markers combined
 * - LINES: Horizontal lines at entry/exit prices
 * - ARROWS: Arrow markers for entry/exit
 * - ZONES: Shaded zones between entry and exit
 *
 * @example
 * ```typescript
 * // Create trade rectangles
 * const rectangles = createTradeRectangles(trades, options, chartData);
 *
 * // Create trade markers
 * const markers = createTradeMarkers(trades, options);
 *
 * // Create all visual elements
 * const elements = createTradeVisualElements(trades, options, chartData);
 * ```
 */

import { UTCTimestamp, SeriesMarker, Time } from "lightweight-charts";
import { TradeConfig, TradeVisualizationOptions } from "../types";
import { TradeTemplateProcessor } from "./TradeTemplateProcessor";
import { UniversalSpacing } from "../primitives/PrimitiveDefaults";
import { ChartCoordinateService } from "./ChartCoordinateService";
import {
  validateAndNormalizeTime,
  findNearestTimestamp,
} from "../utils/timeNormalization";

// ============================================================================
// CRITICAL: Time normalization using centralized utilities
// ============================================================================
/**
 * Parse time value to Unix timestamp WITHOUT timezone conversion.
 * Uses centralized time normalization to ensure consistency across the library.
 *
 * This is a wrapper around normalizeTime that returns null for invalid inputs
 * instead of throwing, which is useful for user-provided trade data.
 *
 * Supported formats:
 * - Unix timestamp (seconds): 1704067200
 * - ISO 8601 string: '2024-01-01T00:00:00Z'
 * - BusinessDay object: { year: 2024, month: 1, day: 1 }
 *
 * NO timezone conversion is applied - times are normalized as-is.
 *
 * @param {string | number | Time} time - Time value to parse
 * @returns {UTCTimestamp | null} Unix timestamp in seconds, or null if invalid
 *
 * @remarks
 * - NO timezone conversion is applied
 * - Backend is responsible for timezone handling
 * - Returns null for invalid inputs (validation-friendly)
 */
function parseTime(time: string | number | Time): UTCTimestamp | null {
  const result = validateAndNormalizeTime(time as Time);
  return result.valid ? (result.normalized as UTCTimestamp) : null;
}

/**
 * Find nearest available timestamp in chart data using OPTIMIZED binary search.
 *
 * Performance: O(n log n) for sorting + O(log n) for search = O(n log n) total
 * Previous: O(n * m) where n = trades, m = chart data points
 *
 * For 100 trades × 10,000 bars:
 * - Old: 1,000,000 operations
 * - New: ~10,000 + 100*log(10000) ≈ 11,300 operations (90x faster!)
 *
 * @param {UTCTimestamp} targetTime - Time to find nearest match for
 * @param {any[]} chartData - Array of chart data with time property
 * @returns {UTCTimestamp | null} Nearest timestamp, or null if no data
 */
function findNearestTime(
  targetTime: UTCTimestamp,
  chartData: any[],
): UTCTimestamp | null {
  if (!chartData || chartData.length === 0) {
    return null;
  }

  // Extract and normalize times from chart data
  const times: number[] = [];
  for (const item of chartData) {
    if (item.time !== undefined && item.time !== null) {
      const normalized = parseTime(item.time);
      if (normalized !== null) {
        times.push(normalized);
      }
    }
  }

  if (times.length === 0) {
    return null;
  }

  // Sort times once (O(n log n)) - enables binary search
  times.sort((a, b) => a - b);

  // Binary search for nearest (O(log n))
  return findNearestTimestamp(targetTime, times) as UTCTimestamp;
}

// Trade rectangle data interface (for data creation only)
export interface TradeRectangleData {
  time1: UTCTimestamp;
  time2: UTCTimestamp;
  price1: number;
  price2: number;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "dotted";
  opacity: number;
  priceScaleId?: string;
  quantity?: number;
  notes?: string;
  tradeId?: string;
  isProfitable?: boolean; // Add profitability flag
  // Allow any additional custom data for template access
  [key: string]: any;
}

// Create trade rectangles from trade data
function createTradeRectangles(
  trades: TradeConfig[],
  options: TradeVisualizationOptions,
  chartData?: any[],
): TradeRectangleData[] {
  const rectangles: TradeRectangleData[] = [];

  // Enhanced validation using coordinate service

  trades.forEach((trade, _index) => {
    // Validate trade data - allow exitTime to be null for open trades
    if (
      !trade.entryTime ||
      typeof trade.entryPrice !== "number" ||
      typeof trade.exitPrice !== "number"
    ) {
      return;
    }

    // Parse entry time
    const time1 = parseTime(trade.entryTime);
    if (time1 === null) {
      return;
    }

    // Handle exit time - can be null for open trades
    let time2: UTCTimestamp | null = null;
    if (trade.exitTime) {
      time2 = parseTime(trade.exitTime);
      if (time2 === null) {
        return;
      }
    } else {
      // For open trades, use the last available time from chart data
      if (chartData && chartData.length > 0) {
        const lastTime = chartData[chartData.length - 1]?.time;
        if (lastTime) {
          time2 = parseTime(lastTime);
        }
      }

      // If still no exit time, skip this trade
      if (time2 === null) {
        return;
      }
    }

    // Find nearest available times in chart data if provided
    let adjustedTime1 = time1;
    let adjustedTime2 = time2;

    if (chartData && chartData.length > 0) {
      const nearestTime1 = findNearestTime(time1, chartData);
      const nearestTime2 = findNearestTime(time2, chartData);

      if (nearestTime1) adjustedTime1 = nearestTime1;
      if (nearestTime2) adjustedTime2 = nearestTime2;
    }

    // Validate prices
    if (trade.entryPrice <= 0 || trade.exitPrice <= 0) {
      return;
    }

    // Use isProfitable from trade data - no calculations in frontend
    const isProfitable = trade.isProfitable ?? false; // Default to false if not specified

    const color = isProfitable
      ? options.rectangleColorProfit || "#4CAF50" // Green for profitable
      : options.rectangleColorLoss || "#F44336"; // Red for unprofitable

    const opacity = options.rectangleFillOpacity || 0.25;

    // Normalize coordinates: time1/price1 should be minimum, time2/price2 should be maximum
    const minTime = Math.min(adjustedTime1, adjustedTime2);
    const maxTime = Math.max(adjustedTime1, adjustedTime2);
    const minPrice = Math.min(trade.entryPrice, trade.exitPrice);
    const maxPrice = Math.max(trade.entryPrice, trade.exitPrice);

    const rectangle: TradeRectangleData = {
      time1: minTime as UTCTimestamp, // Always the earlier time
      price1: minPrice, // Always the lower price
      time2: maxTime as UTCTimestamp, // Always the later time
      price2: maxPrice, // Always the higher price
      fillColor: color,
      borderColor: color,
      borderWidth: options.rectangleBorderWidth || 3,
      borderStyle: "solid" as const,
      opacity: opacity,
      // Pass all additional trade data for template access
      ...trade, // Spread all trade properties for flexible template access
    };

    rectangles.push(rectangle);
  });

  return rectangles;
}

// Create trade markers
function createTradeMarkers(
  trades: TradeConfig[],
  options: TradeVisualizationOptions,
  chartData?: any[],
): SeriesMarker<Time>[] {
  const markers: SeriesMarker<Time>[] = [];

  // Enhanced validation using coordinate service

  trades.forEach((trade, _index) => {
    // Validate trade data - allow exitTime to be null for open trades
    if (
      !trade.entryTime ||
      typeof trade.entryPrice !== "number" ||
      typeof trade.exitPrice !== "number"
    ) {
      return;
    }

    // Parse entry time
    const entryTime = parseTime(trade.entryTime);
    if (!entryTime) {
      return;
    }

    // Handle exit time - can be null for open trades
    let exitTime: UTCTimestamp | null = null;
    if (trade.exitTime) {
      exitTime = parseTime(trade.exitTime);
      if (!exitTime) {
        return;
      }
    }

    // Find nearest available times in chart data if provided
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

    // Entry marker - use tradeType for color selection
    const tradeType = trade.trade_type || trade.tradeType || "long";
    const entryColor =
      tradeType === "long"
        ? options.entryMarkerColorLong || "#2196F3"
        : options.entryMarkerColorShort || "#FF9800";

    // Generate entry marker text using template or default
    let entryMarkerText = "";
    if (options.showMarkerText !== false) {
      // Default to true if not specified
      if (options.entryMarkerTemplate) {
        // Use entry-specific template
        const result = TradeTemplateProcessor.processTemplate(
          options.entryMarkerTemplate,
          trade, // Pass entire trade object for flexible template access
        );
        entryMarkerText = result.content;
      } else if (
        options.showPnlInMarkers &&
        trade.text &&
        typeof trade.text === "string"
      ) {
        // Use custom text from trade if showPnlInMarkers is true
        entryMarkerText = trade.text as string;
      } else if (options.showPnlInMarkers && trade.pnl !== undefined) {
        // Calculate and show P&L
        entryMarkerText = `$${trade.pnl.toFixed(2)}`;
      } else {
        // Default entry marker text
        entryMarkerText = `$${trade.entryPrice.toFixed(2)}`;
      }
    }

    const entryMarker: SeriesMarker<Time> = {
      time: adjustedEntryTime,
      position:
        (options.entryMarkerPosition as "belowBar" | "aboveBar") ||
        (tradeType === "long" ? "belowBar" : "aboveBar"),
      color: entryColor,
      shape:
        (options.entryMarkerShape as
          | "arrowUp"
          | "arrowDown"
          | "circle"
          | "square") || (tradeType === "long" ? "arrowUp" : "arrowDown"),
      text: entryMarkerText,
      size: options.markerSize || 1,
    };
    markers.push(entryMarker);

    // Exit marker - only create if trade has been closed
    if (adjustedExitTime) {
      // Use isProfitable from trade data - no calculations in frontend
      const isProfit = trade.isProfitable ?? false; // Default to false if not specified

      const exitColor = isProfit
        ? options.exitMarkerColorProfit || "#4CAF50" // Green for profitable
        : options.exitMarkerColorLoss || "#F44336"; // Red for unprofitable

      // Generate exit marker text using template or default
      let exitMarkerText = "";
      if (options.showMarkerText !== false) {
        // Default to true if not specified
        if (options.exitMarkerTemplate) {
          // Use exit-specific template
          const result = TradeTemplateProcessor.processTemplate(
            options.exitMarkerTemplate,
            trade, // Pass entire trade object for flexible template access
          );
          exitMarkerText = result.content;
        } else {
          // Default exit marker text
          exitMarkerText = `$${trade.exitPrice.toFixed(2)}`;
        }
      }

      const exitMarker: SeriesMarker<Time> = {
        time: adjustedExitTime,
        position:
          (options.exitMarkerPosition as "belowBar" | "aboveBar") ||
          (tradeType === "long" ? "aboveBar" : "belowBar"),
        color: exitColor,
        shape:
          (options.exitMarkerShape as
            | "arrowUp"
            | "arrowDown"
            | "circle"
            | "square") || (tradeType === "long" ? "arrowDown" : "arrowUp"),
        text: exitMarkerText,
        size: options.markerSize || 1,
      };
      markers.push(exitMarker);
    }
  });

  return markers;
}

// Main function to create trade visual elements
export function createTradeVisualElements(
  trades: TradeConfig[],
  options: TradeVisualizationOptions,
  chartData?: any[],
  _priceScaleId?: string,
): {
  markers: SeriesMarker<Time>[];
  rectangles: TradeRectangleData[];
  annotations: any[];
} {
  const markers: SeriesMarker<Time>[] = [];
  const rectangles: TradeRectangleData[] = [];
  const annotations: any[] = [];

  if (!trades || trades.length === 0) {
    return { markers, rectangles, annotations };
  }

  // Create markers if enabled
  if (options && (options.style === "markers" || options.style === "both")) {
    markers.push(...createTradeMarkers(trades, options, chartData));
  }

  // Create rectangles if enabled - these will be handled by RectanglePlugin
  if (options && (options.style === "rectangles" || options.style === "both")) {
    const newRectangles = createTradeRectangles(trades, options, chartData);
    rectangles.push(...newRectangles);
  }

  // Create annotations if enabled
  if (options.showAnnotations) {
    trades.forEach((trade) => {
      const textParts: string[] = [];

      if (options.showTradeId && trade.id) {
        textParts.push(`#${trade.id}`);
      }

      if (options.showTradeType && trade.tradeType) {
        textParts.push(trade.tradeType.toUpperCase());
      }

      if (options.showQuantity) {
        textParts.push(`Qty: ${trade.quantity}`);
      }

      if (trade.pnlPercentage !== undefined) {
        textParts.push(`P&L: ${trade.pnlPercentage.toFixed(1)}%`);
      }

      // Calculate midpoint for annotation position
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
        backgroundColor:
          options.annotationBackground || "rgba(255, 255, 255, 0.8)",
        color: "#000000",
        padding: UniversalSpacing.DEFAULT_PADDING,
      });
    });
  }

  return { markers, rectangles, annotations };
}

/**
 * Convert trade rectangle data to RectanglePlugin format
 * This bridges the gap between trade data and the RectanglePlugin
 */
export function convertTradeRectanglesToPluginFormat(
  tradeRectangles: TradeRectangleData[],
  chart: any,
  series?: any,
): any[] {
  if (!chart || !series) {
    return [];
  }

  // Check if chart scales are ready
  const timeScale = chart.timeScale();
  const timeScaleWidth = timeScale.width();

  if (timeScaleWidth === 0) {
    return [];
  }

  // Use ChartCoordinateService for coordinate calculations
  const coordinateService = ChartCoordinateService.getInstance();

  return tradeRectangles
    .map((rect, index) => {
      try {
        // Use ChartCoordinateService to calculate proper overlay position
        const boundingBox = coordinateService.calculateOverlayPosition(
          rect.time1,
          rect.time2,
          rect.price1,
          rect.price2,
          chart,
          series,
          0, // paneId
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
          borderOpacity: 1.0,
          label: `Trade ${index + 1}`,
          labelColor: "#000000",
          labelFontSize: 12,
          labelBackground: "rgba(255, 255, 255, 0.8)",
          labelPadding: 4,
          zIndex: 10,
        };

        return pluginRect;
      } catch {
        return null;
      }
    })
    .filter((rect) => rect !== null); // Remove null entries
}

/**
 * Convert trade rectangles to plugin format after ensuring chart is ready
 */
export async function convertTradeRectanglesToPluginFormatWhenReady(
  tradeRectangles: TradeRectangleData[],
  chart: any,
  series?: any,
): Promise<any[]> {
  if (!chart || !series) {
    return [];
  }

  // Import ChartReadyDetector dynamically to avoid circular dependencies
  const { ChartReadyDetector } = await import("../utils/chartReadyDetection");

  try {
    // Wait for chart to be ready with proper dimensions
    const container = chart.chartElement();
    if (!container) {
      return [];
    }

    const isReady = await ChartReadyDetector.waitForChartReady(
      chart,
      container,
      {
        minWidth: 200,
        minHeight: 200,
        maxAttempts: 10,
        baseDelay: 200,
      },
    );

    if (!isReady) {
      return [];
    }

    // Now convert coordinates
    return convertTradeRectanglesToPluginFormat(tradeRectangles, chart, series);
  } catch {
    // Fallback to immediate conversion
    return convertTradeRectanglesToPluginFormat(tradeRectangles, chart, series);
  }
}
