"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
class ChartReadyDetector {
  /**
   * Wait for chart to be fully ready with proper dimensions (legacy method)
   */
  static async waitForChartReady(chart, container, options = {}) {
    const { minWidth = 100, minHeight = 100, maxAttempts = 15, baseDelay = 200 } = options;
    if (!chart || !container) {
      SingletonBase.logger.warn("waitForChartReady called with null chart or container", "ChartReadyDetector");
      return false;
    }
    const chartRef = chart;
    const containerRef = container;
    return new Promise((resolve) => {
      const checkReady = (attempts = 0) => {
        try {
          if (!chartRef || !containerRef) {
            SingletonBase.logger.warn("Chart or container reference became invalid", "ChartReadyDetector");
            resolve(false);
            return;
          }
          try {
            const chartElement = chartRef.chartElement();
            if (chartElement) {
              const chartRect = chartElement.getBoundingClientRect();
              if (chartRect.width >= minWidth && chartRect.height >= minHeight) {
                resolve(true);
                return;
              }
            }
          } catch (chartApiError) {
            SingletonBase.logger.debug(
              `Chart API method failed on attempt ${attempts}: ${chartApiError instanceof Error ? chartApiError.message : "Unknown error"}`,
              "ChartReadyDetector"
            );
          }
          try {
            const containerRect = containerRef.getBoundingClientRect();
            if (containerRect.width >= minWidth && containerRect.height >= minHeight) {
              resolve(true);
              return;
            }
          } catch (domError) {
            SingletonBase.logger.debug(
              `DOM method failed on attempt ${attempts}: ${domError instanceof Error ? domError.message : "Unknown error"}`,
              "ChartReadyDetector"
            );
          }
          if (attempts < maxAttempts) {
            const delay = baseDelay * Math.pow(1.5, attempts);
            setTimeout(() => checkReady(attempts + 1), delay);
          } else {
            SingletonBase.logger.warn(
              `Chart ready detection failed after ${maxAttempts} attempts`,
              "ChartReadyDetector"
            );
            resolve(false);
          }
        } catch (error) {
          SingletonBase.logger.error(
            `Unexpected error in checkReady: ${error instanceof Error ? error.message : "Unknown error"}`,
            "ChartReadyDetector"
          );
          if (attempts < maxAttempts) {
            const delay = baseDelay * Math.pow(1.5, attempts);
            setTimeout(() => checkReady(attempts + 1), delay);
          } else {
            resolve(false);
          }
        }
      };
      checkReady();
    });
  }
  /**
   * Comprehensive chart readiness check for primitives attachment
   * Uses existing coordinate services for consistency and performance
   */
  static async waitForChartReadyForPrimitives(chart, series, options = {}) {
    const { testTime, testPrice, maxAttempts = 30, baseDelay = 150, requireData = true } = options;
    if (!chart || !series) {
      SingletonBase.logger.warn("waitForChartReadyForPrimitives called with null chart or series", "ChartReadyDetector");
      return false;
    }
    const chartRef = chart;
    const seriesRef = series;
    const coordinateService = SingletonBase.ChartCoordinateService.getInstance();
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const chartElement = chartRef.chartElement();
        if (!chartElement) {
          throw new Error("Chart element not found");
        }
        const validatedDimensions = await coordinateService.getValidatedChartDimensions(
          chartRef,
          chartElement,
          {
            minWidth: 200,
            minHeight: 200,
            maxAttempts: 1,
            // We handle retries at this level
            baseDelay: 0
          }
        );
        if (!validatedDimensions) {
          throw new Error("Chart dimensions validation failed");
        }
        const timeScale = chartRef.timeScale();
        const visibleRange = timeScale.getVisibleRange();
        const logicalRange = timeScale.getVisibleLogicalRange();
        if (!visibleRange || !logicalRange) {
          throw new Error(
            `Missing ranges - visible: ${!!visibleRange}, logical: ${!!logicalRange}`
          );
        }
        if (requireData) {
          const seriesData = seriesRef.data();
          if (!seriesData || seriesData.length === 0) {
            throw new Error("No series data");
          }
        }
        let timeForTest = testTime;
        let priceForTest = testPrice;
        if (timeForTest === void 0 || priceForTest === void 0) {
          try {
            const seriesData = seriesRef.data();
            if (seriesData && seriesData.length > 0) {
              const midIndex = Math.floor(seriesData.length / 2);
              const midPoint = seriesData[midIndex];
              if (timeForTest === void 0) {
                timeForTest = midPoint?.time || (visibleRange.from + visibleRange.to) / 2;
              }
              if (priceForTest === void 0) {
                priceForTest = midPoint?.value ?? midPoint?.close ?? midPoint?.high ?? midPoint?.low ?? 100;
              }
            } else {
              timeForTest = (visibleRange.from + visibleRange.to) / 2;
              priceForTest = 100;
            }
          } catch (dataError) {
            SingletonBase.logger.debug(
              `Failed to get series data for test: ${dataError instanceof Error ? dataError.message : "Unknown error"}`,
              "ChartReadyDetector"
            );
            timeForTest = (visibleRange.from + visibleRange.to) / 2;
            priceForTest = 100;
          }
        }
        const logicalForTest = (logicalRange.from + logicalRange.to) / 2;
        const testX = timeScale.timeToCoordinate(timeForTest);
        const testLogicalX = timeScale.logicalToCoordinate(logicalForTest);
        const testY = priceForTest !== void 0 ? seriesRef.priceToCoordinate(priceForTest) : null;
        if (testX === null || testLogicalX === null || testY === null || !isFinite(testX) || !isFinite(testLogicalX) || !isFinite(testY)) {
          throw new Error(
            `Coordinate conversion failed - X: ${testX}, LogicalX: ${testLogicalX}, Y: ${testY}`
          );
        }
        return true;
      } catch (error) {
        SingletonBase.logger.debug(
          `Primitives readiness check attempt ${attempt + 1}/${maxAttempts} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          "ChartReadyDetector"
        );
      }
      if (attempt < maxAttempts - 1) {
        const delay = baseDelay * Math.pow(1.2, attempt) + Math.random() * 50;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    SingletonBase.logger.warn(
      `Chart ready for primitives detection failed after ${maxAttempts} attempts`,
      "ChartReadyDetector"
    );
    return false;
  }
  /**
   * Quick synchronous check if chart is ready for primitives
   * Uses existing coordinate service for consistency
   */
  static isChartReadyForPrimitivesSync(chart, series, options = {}) {
    const { testTime, testPrice, requireData = true } = options;
    if (!chart || !series) {
      return false;
    }
    const coordinateService = SingletonBase.ChartCoordinateService.getInstance();
    try {
      const chartElement = chart.chartElement();
      if (!chartElement) return false;
      const testDimensions = {
        container: {
          width: chartElement.getBoundingClientRect().width,
          height: chartElement.getBoundingClientRect().height
        }
      };
      if (!coordinateService.areChartDimensionsObjectValid(testDimensions, 200, 200)) {
        return false;
      }
      const timeScale = chart.timeScale();
      const visibleRange = timeScale.getVisibleRange();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (!visibleRange || !logicalRange) return false;
      if (requireData) {
        const seriesData = series.data();
        if (!seriesData || seriesData.length === 0) return false;
      }
      if (testTime !== void 0 && testPrice !== void 0) {
        const testX = timeScale.timeToCoordinate(testTime);
        const testY = series.priceToCoordinate(testPrice);
        if (testX === null || testY === null || isNaN(testX) || isNaN(testY)) return false;
        const chartRect = chartElement.getBoundingClientRect();
        if (testX < 0 || testY < 0 || testX > chartRect.width || testY > chartRect.height)
          return false;
      }
      return true;
    } catch (error) {
      SingletonBase.logger.debug(
        `isChartReadyForPrimitivesSync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "ChartReadyDetector"
      );
      return false;
    }
  }
  /**
   * Check if chart is ready synchronously (for immediate checks)
   */
  static isChartReadySync(chart, container, minWidth = 100, minHeight = 100) {
    try {
      if (!chart || !container) return false;
      try {
        const chartElement = chart.chartElement();
        if (chartElement) {
          const chartRect = chartElement.getBoundingClientRect();
          if (chartRect.width >= minWidth && chartRect.height >= minHeight) {
            return true;
          }
        }
      } catch (chartApiError) {
        SingletonBase.logger.debug(
          `Chart API method failed in isChartReadySync: ${chartApiError instanceof Error ? chartApiError.message : "Unknown error"}`,
          "ChartReadyDetector"
        );
      }
      try {
        const containerRect = container.getBoundingClientRect();
        return containerRect.width >= minWidth && containerRect.height >= minHeight;
      } catch (domError) {
        SingletonBase.logger.debug(
          `DOM method failed in isChartReadySync: ${domError instanceof Error ? domError.message : "Unknown error"}`,
          "ChartReadyDetector"
        );
        return false;
      }
    } catch (error) {
      SingletonBase.logger.debug(
        `isChartReadySync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "ChartReadyDetector"
      );
      return false;
    }
  }
  /**
   * Wait for specific chart element to be ready
   */
  static async waitForElementReady(selector, container, options = {}) {
    const { maxAttempts = 10, baseDelay = 100 } = options;
    if (!container) {
      SingletonBase.logger.warn("waitForElementReady called with null container", "ChartReadyDetector");
      return null;
    }
    const containerRef = container;
    return new Promise((resolve) => {
      const checkElement = (attempts = 0) => {
        try {
          const element = containerRef.querySelector(selector);
          if (element) {
            resolve(element);
            return;
          }
          if (attempts < maxAttempts) {
            const delay = baseDelay * Math.pow(1.5, attempts);
            setTimeout(() => checkElement(attempts + 1), delay);
          } else {
            SingletonBase.logger.debug(
              `Element "${selector}" not found after ${maxAttempts} attempts`,
              "ChartReadyDetector"
            );
            resolve(null);
          }
        } catch (error) {
          SingletonBase.logger.debug(
            `Error in waitForElementReady attempt ${attempts}: ${error instanceof Error ? error.message : "Unknown error"}`,
            "ChartReadyDetector"
          );
          if (attempts < maxAttempts) {
            const delay = baseDelay * Math.pow(1.5, attempts);
            setTimeout(() => checkElement(attempts + 1), delay);
          } else {
            resolve(null);
          }
        }
      };
      checkElement();
    });
  }
}
exports.ChartReadyDetector = ChartReadyDetector;
//# sourceMappingURL=chartReadyDetection-XWRDMitZ.cjs.map
