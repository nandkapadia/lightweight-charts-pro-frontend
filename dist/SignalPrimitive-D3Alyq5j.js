import { S as SignalColorCalculator, f as isTransparent } from "./signalColorUtils-Coc3RHvl.js";
import { B as BaseSeriesPrimitive, h as BaseSeriesPrimitivePaneView, g as getBarSpacing, t as timeToCoordinate } from "./TrendFillPrimitive-DHivyY9P.js";
class SignalPrimitivePaneView extends BaseSeriesPrimitivePaneView {
  renderer() {
    return new SignalPrimitiveRenderer(this._source);
  }
  zOrder() {
    return "bottom";
  }
}
class SignalPrimitiveRenderer {
  constructor(source) {
    this._hasNonBooleanValues = false;
    this._source = source;
  }
  /**
   * Check if data contains any values that are not 0 or 1
   * This determines whether alertColor should be used
   * Handles both boolean (true/false) and numeric (0/1) values
   */
  _checkForNonBooleanValues(data) {
    const values = data.map((item) => item.value);
    return SignalColorCalculator.checkForNonBooleanValues(values);
  }
  /**
   * Draw method - not used for signal series
   * Signals render entirely in background
   */
  draw() {
  }
  /**
   * Draw background method - handles vertical band rendering
   * This method renders vertical bands spanning full chart height
   * that should appear behind all other series
   */
  drawBackground(target) {
    target.useBitmapCoordinateSpace((scope) => {
      const data = this._source.getProcessedData();
      const series = this._source.getAttachedSeries();
      if (!series || data.length === 0) return;
      const options = series.options();
      if (!options || options.visible === false) return;
      this._hasNonBooleanValues = this._checkForNonBooleanValues(data);
      const chart = this._source.getChart();
      const barSpacing = getBarSpacing(chart);
      const halfBarSpacing = barSpacing / 2;
      const chartHeight = scope.bitmapSize.height;
      const ctx = scope.context;
      ctx.save();
      for (const item of data) {
        const x = timeToCoordinate(item.time, chart);
        if (x === null) continue;
        let value = item.value;
        if (typeof value === "boolean") {
          value = value ? 1 : 0;
        }
        let color = item.color;
        if (!color) {
          color = this.getColorForValue(value, options);
        }
        if (isTransparent(color)) {
          continue;
        }
        const xScaled = x * scope.horizontalPixelRatio;
        const startX = Math.floor(xScaled - halfBarSpacing * scope.horizontalPixelRatio);
        const endX = Math.floor(xScaled + halfBarSpacing * scope.horizontalPixelRatio);
        ctx.fillStyle = color;
        ctx.fillRect(startX, 0, endX - startX, chartHeight);
      }
      ctx.restore();
    });
  }
  getColorForValue(value, options) {
    return SignalColorCalculator.getColorForValue(value, options, this._hasNonBooleanValues);
  }
}
class SignalPrimitive extends BaseSeriesPrimitive {
  constructor(chart, options) {
    super(chart, options);
  }
  /**
   * Returns settings schema for series dialog
   * Maps property names to their types for automatic UI generation
   */
  static getSettings() {
    return {
      neutralColor: "color",
      signalColor: "color",
      alertColor: "color"
    };
  }
  // Required: Initialize views
  _initializeViews() {
    this._addPaneView(new SignalPrimitivePaneView(this));
  }
  // Required: Process raw data
  _processData(rawData) {
    return rawData.flatMap((item) => {
      let value = item.value ?? 0;
      if (typeof value === "boolean") {
        value = value ? 1 : 0;
      }
      if (isNaN(value)) {
        console.warn(`[SignalPrimitive] Invalid signal value at time ${item.time}:`, item.value);
        return [];
      }
      return [
        {
          // Cast time to Time since lightweight-charts accepts number | string | Date
          time: item.time,
          value,
          // Convert null to undefined since SignalProcessedData.color doesn't accept null
          color: item.color ?? void 0
        }
      ];
    });
  }
  // Optional: Custom z-order default
  _getDefaultZOrder() {
    return "bottom";
  }
}
export {
  SignalPrimitive
};
//# sourceMappingURL=SignalPrimitive-D3Alyq5j.js.map
