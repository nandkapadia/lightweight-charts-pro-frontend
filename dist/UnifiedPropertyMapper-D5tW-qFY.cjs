"use strict";
const lightweightCharts = require("lightweight-charts");
const trendFillSeriesPlugin = require("./trendFillSeriesPlugin-DogJ13XL.cjs");
const lineStyle = require("./lineStyle-Cx61JCTP.cjs");
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
const tradeVisualization = require("./tradeVisualization-CeKL58vO.cjs");
const PropertyDescriptors = {
  /**
   * Create a line property descriptor with proper API mapping
   */
  line(label, defaultColor, defaultWidth, defaultStyle, apiMapping) {
    return {
      type: "line",
      label,
      default: {
        color: defaultColor,
        lineWidth: defaultWidth,
        lineStyle: defaultStyle
      },
      apiMapping
    };
  },
  /**
   * Create a color property descriptor
   */
  color(label, defaultValue, group) {
    return {
      type: "color",
      label,
      default: defaultValue,
      group
    };
  },
  /**
   * Create a boolean property descriptor
   */
  boolean(label, defaultValue, group) {
    return {
      type: "boolean",
      label,
      default: defaultValue,
      group
    };
  },
  /**
   * Create a number property descriptor
   */
  number(label, defaultValue, group, hidden) {
    return {
      type: "number",
      label,
      default: defaultValue,
      group,
      hidden
    };
  },
  /**
   * Create a lineStyle property descriptor
   */
  lineStyle(label, defaultValue, group) {
    return {
      type: "lineStyle",
      label,
      default: defaultValue,
      group
    };
  },
  /**
   * Create a lineWidth property descriptor
   */
  lineWidth(label, defaultValue, group) {
    return {
      type: "lineWidth",
      label,
      default: defaultValue,
      group
    };
  }
};
const STANDARD_SERIES_PROPERTIES = {
  // Common properties (hardcoded in SeriesSettingsDialog, hidden from SeriesSettingsRenderer)
  // These are rendered in the "Common Settings" section of the dialog
  visible: {
    ...PropertyDescriptors.boolean("Visible", true, "General"),
    hidden: true
    // Rendered in "Common Settings" section
  },
  lastValueVisible: {
    ...PropertyDescriptors.boolean("Show Last Value", true, "General"),
    hidden: true
    // Rendered in "Common Settings" section
  },
  priceLineVisible: {
    ...PropertyDescriptors.boolean("Show Price Line", true, "General"),
    hidden: true
    // Rendered in "Common Settings" section
  },
  title: {
    type: "color",
    // Using color type as string input (will be improved in future)
    label: "Title",
    default: void 0,
    group: "General",
    description: "Technical name shown on chart axis/legend",
    hidden: true
    // Not shown in UI, only used internally
  },
  // Hidden properties (not shown in UI but passed through for consistency)
  // These ensure dialog updates don't lose properties set via JSON from Python
  zIndex: {
    type: "number",
    label: "Z-Index",
    default: 0,
    group: "General",
    hidden: true,
    description: "Rendering order (higher values render on top). Official Lightweight Charts API property."
  },
  priceLineSource: {
    type: "number",
    label: "Price Line Source",
    default: 0,
    group: "General",
    hidden: true,
    description: "Source for price line data"
  },
  priceLineWidth: {
    type: "number",
    label: "Price Line Width",
    default: 1,
    group: "General",
    hidden: true,
    description: "Width of the price line in pixels"
  },
  priceLineColor: {
    type: "color",
    label: "Price Line Color",
    default: "",
    group: "General",
    hidden: true,
    description: "Color of the price line"
  },
  priceScaleId: {
    type: "color",
    // Using color type as string input (will be improved in future)
    label: "Price Scale ID",
    default: "right",
    group: "General",
    hidden: true,
    description: 'ID of the price scale for this series (e.g., "left", "right", or custom ID). Official Lightweight Charts API property. NOTE: To configure price scale properties (margins, mode, etc.), use the priceScale object at the top level of series config.'
  },
  priceLineStyle: {
    type: "lineStyle",
    label: "Price Line Style",
    default: 2,
    // LineStyle.Dashed
    group: "General",
    hidden: true,
    description: "Style of the price line"
  }
};
function extractDefaultOptions(descriptor) {
  const options = { ...descriptor.defaultOptions };
  for (const [propName, propDesc] of Object.entries(descriptor.properties)) {
    if (propDesc.type === "line" && propDesc.apiMapping) {
      const lineDefault = propDesc.default;
      if (propDesc.apiMapping.colorKey) {
        options[propDesc.apiMapping.colorKey] = lineDefault.color;
      }
      if (propDesc.apiMapping.widthKey) {
        options[propDesc.apiMapping.widthKey] = lineDefault.lineWidth;
      }
      if (propDesc.apiMapping.styleKey) {
        options[propDesc.apiMapping.styleKey] = lineDefault.lineStyle;
      }
    } else if (propDesc.default !== void 0) {
      options[propName] = propDesc.default;
    }
  }
  return options;
}
function dialogConfigToApiOptions$1(descriptor, dialogConfig) {
  const apiOptions = {};
  for (const [propName, propDesc] of Object.entries(descriptor.properties)) {
    if (dialogConfig[propName] === void 0) continue;
    if (propDesc.type === "line" && propDesc.apiMapping) {
      const lineConfig = dialogConfig[propName];
      if (lineConfig && typeof lineConfig === "object") {
        if (lineConfig.color !== void 0 && propDesc.apiMapping.colorKey) {
          apiOptions[propDesc.apiMapping.colorKey] = lineConfig.color;
        }
        if (lineConfig.lineWidth !== void 0 && propDesc.apiMapping.widthKey) {
          apiOptions[propDesc.apiMapping.widthKey] = lineConfig.lineWidth;
        }
        if (lineConfig.lineStyle !== void 0 && propDesc.apiMapping.styleKey) {
          apiOptions[propDesc.apiMapping.styleKey] = lineConfig.lineStyle;
        }
      }
    } else {
      apiOptions[propName] = dialogConfig[propName];
    }
  }
  if (dialogConfig.displayName !== void 0) apiOptions.displayName = dialogConfig.displayName;
  return apiOptions;
}
function apiOptionsToDialogConfig$1(descriptor, apiOptions) {
  const dialogConfig = {};
  if (apiOptions.visible !== void 0) dialogConfig.visible = apiOptions.visible;
  if (apiOptions.lastValueVisible !== void 0)
    dialogConfig.lastValueVisible = apiOptions.lastValueVisible;
  if (apiOptions.priceLineVisible !== void 0)
    dialogConfig.priceLineVisible = apiOptions.priceLineVisible;
  if (apiOptions.title !== void 0) dialogConfig.title = apiOptions.title;
  if (apiOptions.displayName !== void 0) dialogConfig.displayName = apiOptions.displayName;
  for (const [propName, propDesc] of Object.entries(descriptor.properties)) {
    if (propDesc.type === "line" && propDesc.apiMapping) {
      const lineConfig = {};
      let hasValue = false;
      if (propDesc.apiMapping.colorKey && apiOptions[propDesc.apiMapping.colorKey] !== void 0) {
        lineConfig.color = apiOptions[propDesc.apiMapping.colorKey];
        hasValue = true;
      }
      if (propDesc.apiMapping.widthKey && apiOptions[propDesc.apiMapping.widthKey] !== void 0) {
        lineConfig.lineWidth = apiOptions[propDesc.apiMapping.widthKey];
        hasValue = true;
      }
      if (propDesc.apiMapping.styleKey && apiOptions[propDesc.apiMapping.styleKey] !== void 0) {
        lineConfig.lineStyle = apiOptions[propDesc.apiMapping.styleKey];
        hasValue = true;
      }
      if (hasValue) {
        dialogConfig[propName] = lineConfig;
      }
    } else if (apiOptions[propName] !== void 0) {
      dialogConfig[propName] = apiOptions[propName];
    }
  }
  return dialogConfig;
}
function sortDataByTime(data) {
  const parseTime = (item) => {
    if (typeof item.time === "number") {
      return item.time;
    }
    if (typeof item.time === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(item.time)) {
        return null;
      }
      const timestamp = new Date(item.time).getTime();
      if (isNaN(timestamp)) {
        return null;
      }
      return timestamp / 1e3;
    }
    return null;
  };
  const MAX_SAFE_VALUE = 900719925474099e-1;
  const isValidValue = (value) => {
    return typeof value === "number" && !isNaN(value) && isFinite(value) && value >= -MAX_SAFE_VALUE && value <= MAX_SAFE_VALUE;
  };
  const isValidItem = (item) => {
    if (parseTime(item) === null) {
      return false;
    }
    if ("value" in item) {
      return isValidValue(item.value);
    }
    if ("open" in item || "high" in item || "low" in item || "close" in item) {
      return isValidValue(item.open) && isValidValue(item.high) && isValidValue(item.low) && isValidValue(item.close);
    }
    if ("color" in item) {
      return !("value" in item) || isValidValue(item.value);
    }
    return true;
  };
  const validItems = data.filter(isValidItem).map((item) => ({
    ...item,
    _parsedTime: parseTime(item)
  })).filter((item) => item._parsedTime !== null);
  const sorted = validItems.sort((a, b) => a._parsedTime - b._parsedTime);
  const timeMap = /* @__PURE__ */ new Map();
  sorted.forEach((item) => {
    timeMap.set(item._parsedTime, item);
  });
  return Array.from(timeMap.values()).map(({ _parsedTime, ...item }) => item);
}
const LINE_SERIES_DESCRIPTOR = {
  type: "Line",
  displayName: "Line Series",
  isCustom: false,
  category: "Basic",
  description: "Standard line chart series",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Line-specific properties
    mainLine: PropertyDescriptors.line(
      "Line",
      "#2962FF",
      // default color
      2,
      // default lineWidth
      lightweightCharts.LineStyle.Solid,
      // default lineStyle
      {
        colorKey: "color",
        widthKey: "lineWidth",
        styleKey: "lineStyle"
      }
    )
  },
  defaultOptions: {
    color: "#2962FF",
    lineWidth: 2,
    lineStyle: lightweightCharts.LineStyle.Solid,
    lineVisible: true,
    pointMarkersVisible: false,
    crosshairMarkerVisible: false,
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.LineSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const AREA_SERIES_DESCRIPTOR = {
  type: "Area",
  displayName: "Area Series",
  isCustom: false,
  category: "Basic",
  description: "Area chart series with fill",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Area-specific properties
    mainLine: PropertyDescriptors.line(
      "Line",
      "#2962FF",
      // default color
      2,
      // default lineWidth
      lightweightCharts.LineStyle.Solid,
      // default lineStyle
      {
        colorKey: "lineColor",
        widthKey: "lineWidth",
        styleKey: "lineStyle"
      }
    ),
    topColor: PropertyDescriptors.color("Top Color", "rgba(41, 98, 255, 0.28)", "Fill"),
    bottomColor: PropertyDescriptors.color("Bottom Color", "rgba(41, 98, 255, 0.05)", "Fill"),
    invertFilledArea: PropertyDescriptors.boolean("Invert Filled Area", false, "Fill"),
    relativeGradient: PropertyDescriptors.boolean("Relative Gradient", false, "Fill")
  },
  defaultOptions: {
    lineColor: "#2962FF",
    lineWidth: 2,
    lineStyle: lightweightCharts.LineStyle.Solid,
    lineVisible: true,
    pointMarkersVisible: false,
    crosshairMarkerVisible: false,
    topColor: "rgba(41, 98, 255, 0.28)",
    bottomColor: "rgba(41, 98, 255, 0.05)",
    invertFilledArea: false,
    relativeGradient: false,
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.AreaSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const HISTOGRAM_SERIES_DESCRIPTOR = {
  type: "Histogram",
  displayName: "Histogram Series",
  isCustom: false,
  category: "Basic",
  description: "Histogram chart series",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Histogram-specific properties
    color: PropertyDescriptors.color("Color", "#26a69a"),
    base: PropertyDescriptors.number("Base Value", 0, void 0, true)
    // hidden from dialog
  },
  defaultOptions: {
    color: "#26a69a",
    base: 0,
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.HistogramSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const BAR_SERIES_DESCRIPTOR = {
  type: "Bar",
  displayName: "Bar Series",
  isCustom: false,
  category: "Basic",
  description: "OHLC bar chart series",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Bar-specific properties
    upColor: PropertyDescriptors.color("Up Color", "#26a69a", "Colors"),
    downColor: PropertyDescriptors.color("Down Color", "#ef5350", "Colors"),
    openVisible: PropertyDescriptors.boolean("Show Open Tick", true, "Display"),
    thinBars: PropertyDescriptors.boolean("Thin Bars", true, "Display")
  },
  defaultOptions: {
    upColor: "#26a69a",
    downColor: "#ef5350",
    openVisible: true,
    thinBars: true,
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.BarSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const CANDLESTICK_SERIES_DESCRIPTOR = {
  type: "Candlestick",
  displayName: "Candlestick Series",
  isCustom: false,
  category: "Basic",
  description: "Candlestick chart series",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Candlestick-specific properties
    upColor: PropertyDescriptors.color("Up Color", "#26a69a", "Body"),
    downColor: PropertyDescriptors.color("Down Color", "#ef5350", "Body"),
    borderVisible: PropertyDescriptors.boolean("Border Visible", true, "Border"),
    borderColor: PropertyDescriptors.color("Border Color", "#378658", "Border"),
    borderUpColor: PropertyDescriptors.color("Border Up Color", "#26a69a", "Border"),
    borderDownColor: PropertyDescriptors.color("Border Down Color", "#ef5350", "Border"),
    wickVisible: PropertyDescriptors.boolean("Wick Visible", true, "Wick"),
    wickColor: PropertyDescriptors.color("Wick Color", "#737375", "Wick"),
    wickUpColor: PropertyDescriptors.color("Wick Up Color", "#26a69a", "Wick"),
    wickDownColor: PropertyDescriptors.color("Wick Down Color", "#ef5350", "Wick")
  },
  defaultOptions: {
    upColor: "#26a69a",
    downColor: "#ef5350",
    borderVisible: true,
    borderColor: "#378658",
    borderUpColor: "#26a69a",
    borderDownColor: "#ef5350",
    wickVisible: true,
    wickColor: "#737375",
    wickUpColor: "#26a69a",
    wickDownColor: "#ef5350",
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.CandlestickSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const BASELINE_SERIES_DESCRIPTOR = {
  type: "Baseline",
  displayName: "Baseline Series",
  isCustom: false,
  category: "Basic",
  description: "Baseline chart series with above/below coloring",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Baseline-specific properties
    baseValue: PropertyDescriptors.number("Base Value", 0, "Base", true),
    // hidden from dialog
    topLineColor: PropertyDescriptors.color("Top Line Color", "#26a69a", "Top"),
    topFillColor1: PropertyDescriptors.color("Top Fill Color 1", "rgba(38, 166, 154, 0.28)", "Top"),
    topFillColor2: PropertyDescriptors.color("Top Fill Color 2", "rgba(38, 166, 154, 0.05)", "Top"),
    bottomLineColor: PropertyDescriptors.color("Bottom Line Color", "#ef5350", "Bottom"),
    bottomFillColor1: PropertyDescriptors.color(
      "Bottom Fill Color 1",
      "rgba(239, 83, 80, 0.05)",
      "Bottom"
    ),
    bottomFillColor2: PropertyDescriptors.color(
      "Bottom Fill Color 2",
      "rgba(239, 83, 80, 0.28)",
      "Bottom"
    ),
    lineWidth: PropertyDescriptors.lineWidth("Line Width", 2, "Base"),
    lineVisible: PropertyDescriptors.boolean("Line Visible", true, "Base"),
    relativeGradient: PropertyDescriptors.boolean("Relative Gradient", false, "Base")
  },
  defaultOptions: {
    baseValue: { type: "price", price: 0 },
    topLineColor: "#26a69a",
    topFillColor1: "rgba(38, 166, 154, 0.28)",
    topFillColor2: "rgba(38, 166, 154, 0.05)",
    bottomLineColor: "#ef5350",
    bottomFillColor1: "rgba(239, 83, 80, 0.05)",
    bottomFillColor2: "rgba(239, 83, 80, 0.28)",
    lineWidth: 2,
    lineVisible: true,
    pointMarkersVisible: false,
    crosshairMarkerVisible: false,
    relativeGradient: false,
    lastValueVisible: true,
    priceLineVisible: true
  },
  create: (chart, data, options, paneId = 0) => {
    const series = chart.addSeries(lightweightCharts.BaselineSeries, options, paneId);
    if (data && data.length > 0) {
      series.setData(sortDataByTime(data));
    }
    return series;
  }
};
const BUILTIN_SERIES_DESCRIPTORS = {
  Line: LINE_SERIES_DESCRIPTOR,
  Area: AREA_SERIES_DESCRIPTOR,
  Histogram: HISTOGRAM_SERIES_DESCRIPTOR,
  Bar: BAR_SERIES_DESCRIPTOR,
  Candlestick: CANDLESTICK_SERIES_DESCRIPTOR,
  Baseline: BASELINE_SERIES_DESCRIPTOR
};
const BAND_SERIES_DESCRIPTOR = {
  type: "Band",
  displayName: "Band Series",
  isCustom: true,
  category: "Custom",
  description: "Three-line band with filled areas (e.g., Bollinger Bands)",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Band-specific properties
    upperLine: PropertyDescriptors.line("Upper Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "upperLineColor",
      widthKey: "upperLineWidth",
      styleKey: "upperLineStyle"
    }),
    upperLineVisible: PropertyDescriptors.boolean("Upper Line Visible", true, "Upper Line"),
    middleLine: PropertyDescriptors.line("Middle Line", "#F7931A", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "middleLineColor",
      widthKey: "middleLineWidth",
      styleKey: "middleLineStyle"
    }),
    middleLineVisible: PropertyDescriptors.boolean("Middle Line Visible", true, "Middle Line"),
    lowerLine: PropertyDescriptors.line("Lower Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "lowerLineColor",
      widthKey: "lowerLineWidth",
      styleKey: "lowerLineStyle"
    }),
    lowerLineVisible: PropertyDescriptors.boolean("Lower Line Visible", true, "Lower Line"),
    upperFillColor: PropertyDescriptors.color("Upper Fill Color", "rgba(41, 98, 255, 0.1)", "Fill"),
    upperFill: PropertyDescriptors.boolean("Upper Fill Visible", true, "Fill"),
    lowerFillColor: PropertyDescriptors.color("Lower Fill Color", "rgba(41, 98, 255, 0.1)", "Fill"),
    lowerFill: PropertyDescriptors.boolean("Lower Fill Visible", true, "Fill")
  },
  defaultOptions: {
    // Standard defaults
    visible: true,
    lastValueVisible: false,
    priceLineVisible: false,
    title: "",
    // Band-specific defaults
    upperLineColor: "#2962FF",
    upperLineWidth: 2,
    upperLineStyle: lightweightCharts.LineStyle.Solid,
    upperLineVisible: true,
    middleLineColor: "#F7931A",
    middleLineWidth: 2,
    middleLineStyle: lightweightCharts.LineStyle.Solid,
    middleLineVisible: true,
    lowerLineColor: "#2962FF",
    lowerLineWidth: 2,
    lowerLineStyle: lightweightCharts.LineStyle.Solid,
    lowerLineVisible: true,
    upperFillColor: "rgba(41, 98, 255, 0.1)",
    upperFill: true,
    lowerFillColor: "rgba(41, 98, 255, 0.1)",
    lowerFill: true,
    usePrimitive: true
    // Enable primitive rendering (factory-specific option)
  },
  // Factory accepts additional options beyond primitive options
  create: (chart, data, options, paneId = 0) => {
    return trendFillSeriesPlugin.createBandSeries(chart, { ...options, data, paneId });
  }
};
const RIBBON_SERIES_DESCRIPTOR = {
  type: "Ribbon",
  displayName: "Ribbon Series",
  isCustom: true,
  category: "Custom",
  description: "Two-line ribbon with filled area between lines",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Ribbon-specific properties
    upperLine: PropertyDescriptors.line("Upper Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "upperLineColor",
      widthKey: "upperLineWidth",
      styleKey: "upperLineStyle"
    }),
    upperLineVisible: PropertyDescriptors.boolean("Upper Line Visible", true, "Upper Line"),
    lowerLine: PropertyDescriptors.line("Lower Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "lowerLineColor",
      widthKey: "lowerLineWidth",
      styleKey: "lowerLineStyle"
    }),
    lowerLineVisible: PropertyDescriptors.boolean("Lower Line Visible", true, "Lower Line"),
    fillColor: PropertyDescriptors.color("Fill Color", "rgba(41, 98, 255, 0.1)", "Fill"),
    fillVisible: PropertyDescriptors.boolean("Fill Visible", true, "Fill")
  },
  defaultOptions: {
    // Standard defaults
    visible: true,
    lastValueVisible: false,
    priceLineVisible: false,
    title: "",
    // Ribbon-specific defaults
    upperLineColor: "#2962FF",
    upperLineWidth: 2,
    upperLineStyle: lightweightCharts.LineStyle.Solid,
    upperLineVisible: true,
    lowerLineColor: "#2962FF",
    lowerLineWidth: 2,
    lowerLineStyle: lightweightCharts.LineStyle.Solid,
    lowerLineVisible: true,
    fillColor: "rgba(41, 98, 255, 0.1)",
    fillVisible: true,
    usePrimitive: true
    // Enable primitive rendering (factory-specific option)
  },
  // Factory accepts additional options beyond primitive options
  create: (chart, data, options, paneId = 0) => {
    return trendFillSeriesPlugin.createRibbonSeries(chart, { ...options, data, paneId });
  }
};
const GRADIENT_RIBBON_SERIES_DESCRIPTOR = {
  type: "GradientRibbon",
  displayName: "Gradient Ribbon Series",
  isCustom: true,
  category: "Custom",
  description: "Two-line ribbon with gradient-filled area",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // GradientRibbon-specific properties
    upperLine: PropertyDescriptors.line("Upper Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "upperLineColor",
      widthKey: "upperLineWidth",
      styleKey: "upperLineStyle"
    }),
    upperLineVisible: PropertyDescriptors.boolean("Upper Line Visible", true, "Upper Line"),
    lowerLine: PropertyDescriptors.line("Lower Line", "#2962FF", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "lowerLineColor",
      widthKey: "lowerLineWidth",
      styleKey: "lowerLineStyle"
    }),
    lowerLineVisible: PropertyDescriptors.boolean("Lower Line Visible", true, "Lower Line"),
    fillVisible: PropertyDescriptors.boolean("Fill Visible", true, "Fill"),
    gradientStartColor: PropertyDescriptors.color(
      "Gradient Start Color",
      "rgba(41, 98, 255, 0.5)",
      "Gradient"
    ),
    gradientEndColor: PropertyDescriptors.color(
      "Gradient End Color",
      "rgba(239, 83, 80, 0.5)",
      "Gradient"
    ),
    normalizeGradients: {
      ...PropertyDescriptors.boolean("Normalize Gradients", false, "Gradient"),
      hidden: true
    }
  },
  defaultOptions: {
    // Standard defaults
    visible: true,
    lastValueVisible: false,
    priceLineVisible: false,
    title: "",
    // GradientRibbon-specific defaults
    upperLineColor: "#2962FF",
    upperLineWidth: 2,
    upperLineStyle: lightweightCharts.LineStyle.Solid,
    upperLineVisible: true,
    lowerLineColor: "#2962FF",
    lowerLineWidth: 2,
    lowerLineStyle: lightweightCharts.LineStyle.Solid,
    lowerLineVisible: true,
    fillVisible: true,
    gradientStartColor: "rgba(41, 98, 255, 0.5)",
    gradientEndColor: "rgba(239, 83, 80, 0.5)",
    normalizeGradients: false,
    usePrimitive: true
    // Enable primitive rendering (factory-specific option)
  },
  // Factory accepts additional options beyond primitive options
  create: (chart, data, options, paneId = 0) => {
    return trendFillSeriesPlugin.createGradientRibbonSeries(chart, {
      ...options,
      data,
      paneId
    });
  }
};
const SIGNAL_SERIES_DESCRIPTOR = {
  type: "Signal",
  displayName: "Signal Series",
  isCustom: true,
  category: "Custom",
  description: "Vertical background bands for trading signals",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // Signal-specific properties
    neutralColor: PropertyDescriptors.color("Neutral Color", "rgba(128, 128, 128, 0.3)", "Colors"),
    signalColor: PropertyDescriptors.color("Signal Color", "rgba(41, 98, 255, 0.3)", "Colors"),
    alertColor: PropertyDescriptors.color("Alert Color", "rgba(239, 83, 80, 0.3)", "Colors")
  },
  defaultOptions: {
    // Standard defaults
    visible: true,
    lastValueVisible: false,
    priceLineVisible: false,
    title: "",
    // Signal-specific defaults
    neutralColor: "rgba(128, 128, 128, 0.3)",
    signalColor: "rgba(41, 98, 255, 0.3)",
    alertColor: "rgba(239, 83, 80, 0.3)",
    usePrimitive: true
    // Enable primitive rendering (factory-specific option)
  },
  // Factory accepts additional options beyond primitive options
  create: (chart, data, options, paneId = 0) => {
    return trendFillSeriesPlugin.createSignalSeries(chart, { ...options, data, paneId });
  }
};
const TREND_FILL_SERIES_DESCRIPTOR = {
  type: "TrendFill",
  displayName: "Trend Fill Series",
  isCustom: true,
  category: "Custom",
  description: "Filled area between trend and base lines with direction-based coloring",
  properties: {
    // Standard series properties
    ...STANDARD_SERIES_PROPERTIES,
    // TrendFill-specific properties
    uptrendFillColor: PropertyDescriptors.color(
      "Uptrend Fill Color",
      "rgba(76, 175, 80, 0.3)",
      "Fill"
    ),
    downtrendFillColor: PropertyDescriptors.color(
      "Downtrend Fill Color",
      "rgba(244, 67, 54, 0.3)",
      "Fill"
    ),
    fillVisible: PropertyDescriptors.boolean("Fill Visible", true, "Fill"),
    uptrendLine: PropertyDescriptors.line("Uptrend Line", "#4CAF50", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "uptrendLineColor",
      widthKey: "uptrendLineWidth",
      styleKey: "uptrendLineStyle"
    }),
    uptrendLineVisible: PropertyDescriptors.boolean("Uptrend Line Visible", true, "Uptrend Line"),
    downtrendLine: PropertyDescriptors.line("Downtrend Line", "#F44336", 2, lightweightCharts.LineStyle.Solid, {
      colorKey: "downtrendLineColor",
      widthKey: "downtrendLineWidth",
      styleKey: "downtrendLineStyle"
    }),
    downtrendLineVisible: PropertyDescriptors.boolean(
      "Downtrend Line Visible",
      true,
      "Downtrend Line"
    ),
    baseLine: PropertyDescriptors.line("Base Line", "#666666", 1, lightweightCharts.LineStyle.Dotted, {
      colorKey: "baseLineColor",
      widthKey: "baseLineWidth",
      styleKey: "baseLineStyle"
    }),
    baseLineVisible: PropertyDescriptors.boolean("Base Line Visible", false, "Base Line")
  },
  defaultOptions: {
    // Standard defaults
    visible: true,
    lastValueVisible: false,
    priceLineVisible: false,
    title: "",
    // TrendFill-specific defaults
    uptrendFillColor: "rgba(76, 175, 80, 0.3)",
    downtrendFillColor: "rgba(244, 67, 54, 0.3)",
    fillVisible: true,
    uptrendLineColor: "#4CAF50",
    uptrendLineWidth: 2,
    uptrendLineStyle: lightweightCharts.LineStyle.Solid,
    uptrendLineVisible: true,
    downtrendLineColor: "#F44336",
    downtrendLineWidth: 2,
    downtrendLineStyle: lightweightCharts.LineStyle.Solid,
    downtrendLineVisible: true,
    baseLineColor: "#666666",
    baseLineWidth: 1,
    baseLineStyle: lightweightCharts.LineStyle.Dotted,
    baseLineVisible: false,
    usePrimitive: true
    // Enable primitive rendering (factory-specific option)
  },
  // Factory accepts additional options beyond primitive options
  create: (chart, data, options, _paneId = 0) => {
    return trendFillSeriesPlugin.createTrendFillSeries(chart, { ...options, data });
  }
};
const CUSTOM_SERIES_DESCRIPTORS = {
  Band: BAND_SERIES_DESCRIPTOR,
  Ribbon: RIBBON_SERIES_DESCRIPTOR,
  GradientRibbon: GRADIENT_RIBBON_SERIES_DESCRIPTOR,
  Signal: SIGNAL_SERIES_DESCRIPTOR,
  TrendFill: TREND_FILL_SERIES_DESCRIPTOR
};
function normalizeSeriesType(seriesType) {
  const lower = seriesType.toLowerCase();
  const typeMapping = {
    // Built-in series
    line: "Line",
    area: "Area",
    histogram: "Histogram",
    bar: "Bar",
    candlestick: "Candlestick",
    baseline: "Baseline",
    // Custom series
    band: "Band",
    ribbon: "Ribbon",
    gradient_ribbon: "GradientRibbon",
    gradientribbon: "GradientRibbon",
    signal: "Signal",
    // Not implemented
    trend_fill: "TrendFill",
    trendfill: "TrendFill"
  };
  if (typeMapping[lower]) {
    return typeMapping[lower];
  }
  return seriesType.charAt(0).toUpperCase() + seriesType.slice(1);
}
class SeriesCreationError extends Error {
  constructor(seriesType, reason, originalError) {
    super(`Failed to create ${seriesType} series: ${reason}`);
    this.seriesType = seriesType;
    this.reason = reason;
    this.originalError = originalError;
    this.name = "SeriesCreationError";
  }
}
const SERIES_REGISTRY = /* @__PURE__ */ new Map([
  // Built-in series
  ["Line", BUILTIN_SERIES_DESCRIPTORS.Line],
  ["Area", BUILTIN_SERIES_DESCRIPTORS.Area],
  ["Histogram", BUILTIN_SERIES_DESCRIPTORS.Histogram],
  ["Bar", BUILTIN_SERIES_DESCRIPTORS.Bar],
  ["Candlestick", BUILTIN_SERIES_DESCRIPTORS.Candlestick],
  ["Baseline", BUILTIN_SERIES_DESCRIPTORS.Baseline],
  // Custom series
  ["Band", CUSTOM_SERIES_DESCRIPTORS.Band],
  ["Ribbon", CUSTOM_SERIES_DESCRIPTORS.Ribbon],
  ["GradientRibbon", CUSTOM_SERIES_DESCRIPTORS.GradientRibbon],
  ["Signal", CUSTOM_SERIES_DESCRIPTORS.Signal],
  ["TrendFill", CUSTOM_SERIES_DESCRIPTORS.TrendFill]
]);
function getSeriesDescriptor(seriesType) {
  return SERIES_REGISTRY.get(seriesType);
}
function getAvailableSeriesTypes() {
  return Array.from(SERIES_REGISTRY.keys());
}
function isCustomSeries(seriesType) {
  const descriptor = SERIES_REGISTRY.get(seriesType);
  return descriptor?.isCustom ?? false;
}
function flattenLineOptions(options, descriptor) {
  const flattened = { ...options };
  if (options.lineOptions) {
    const linePropertyEntry = Object.entries(descriptor.properties).find(
      ([, propDesc]) => propDesc.type === "line" && propDesc.apiMapping
    );
    if (linePropertyEntry) {
      const [, linePropDesc] = linePropertyEntry;
      const lineObj = options.lineOptions;
      delete flattened.lineOptions;
      if (typeof lineObj === "object" && lineObj !== null && !Array.isArray(lineObj)) {
        const lineObjTyped = lineObj;
        if (lineObjTyped.color !== void 0 && linePropDesc.apiMapping?.colorKey) {
          flattened[linePropDesc.apiMapping.colorKey] = lineObjTyped.color;
        }
        if (lineObjTyped.lineWidth !== void 0 && linePropDesc.apiMapping?.widthKey) {
          flattened[linePropDesc.apiMapping.widthKey] = lineObjTyped.lineWidth;
        }
        if (lineObjTyped.lineStyle !== void 0 && linePropDesc.apiMapping?.styleKey) {
          flattened[linePropDesc.apiMapping.styleKey] = lineObjTyped.lineStyle;
        }
        if (lineObjTyped.lineVisible !== void 0) {
          flattened.lineVisible = lineObjTyped.lineVisible;
        }
        if (lineObjTyped.lineType !== void 0) {
          flattened.lineType = lineObjTyped.lineType;
        }
        if (lineObjTyped.pointMarkersVisible !== void 0) {
          flattened.pointMarkersVisible = lineObjTyped.pointMarkersVisible;
        }
        if (lineObjTyped.pointMarkersRadius !== void 0) {
          flattened.pointMarkersRadius = lineObjTyped.pointMarkersRadius;
        }
        if (lineObjTyped.crosshairMarkerVisible !== void 0) {
          flattened.crosshairMarkerVisible = lineObjTyped.crosshairMarkerVisible;
        }
        if (lineObjTyped.crosshairMarkerRadius !== void 0) {
          flattened.crosshairMarkerRadius = lineObjTyped.crosshairMarkerRadius;
        }
        if (lineObjTyped.crosshairMarkerBorderColor !== void 0) {
          flattened.crosshairMarkerBorderColor = lineObjTyped.crosshairMarkerBorderColor;
        }
        if (lineObjTyped.crosshairMarkerBackgroundColor !== void 0) {
          flattened.crosshairMarkerBackgroundColor = lineObjTyped.crosshairMarkerBackgroundColor;
        }
        if (lineObjTyped.crosshairMarkerBorderWidth !== void 0) {
          flattened.crosshairMarkerBorderWidth = lineObjTyped.crosshairMarkerBorderWidth;
        }
        if (lineObjTyped.lastPriceAnimation !== void 0) {
          flattened.lastPriceAnimation = lineObjTyped.lastPriceAnimation;
        }
      }
    }
  }
  for (const [propName, propDesc] of Object.entries(descriptor.properties)) {
    if (propDesc.type === "line" && propDesc.apiMapping && options[propName]) {
      const lineObj = options[propName];
      if (typeof lineObj === "object" && lineObj !== null && !Array.isArray(lineObj)) {
        delete flattened[propName];
        const lineObjTyped = lineObj;
        if (lineObjTyped.color !== void 0 && propDesc.apiMapping.colorKey) {
          flattened[propDesc.apiMapping.colorKey] = lineObjTyped.color;
        }
        if (lineObjTyped.lineWidth !== void 0 && propDesc.apiMapping.widthKey) {
          flattened[propDesc.apiMapping.widthKey] = lineObjTyped.lineWidth;
        }
        if (lineObjTyped.lineStyle !== void 0 && propDesc.apiMapping.styleKey) {
          flattened[propDesc.apiMapping.styleKey] = lineObjTyped.lineStyle;
        }
        if (lineObjTyped.lineVisible !== void 0) {
          const visibilityKey = propName + "Visible";
          flattened[visibilityKey] = lineObjTyped.lineVisible;
        }
        if (lineObjTyped.lineType !== void 0) {
          flattened[propName + "Type"] = lineObjTyped.lineType;
        }
        if (lineObjTyped.pointMarkersVisible !== void 0) {
          flattened[propName + "PointMarkersVisible"] = lineObjTyped.pointMarkersVisible;
        }
        if (lineObjTyped.pointMarkersRadius !== void 0) {
          flattened[propName + "PointMarkersRadius"] = lineObjTyped.pointMarkersRadius;
        }
        if (lineObjTyped.crosshairMarkerVisible !== void 0) {
          flattened[propName + "CrosshairMarkerVisible"] = lineObjTyped.crosshairMarkerVisible;
        }
        if (lineObjTyped.crosshairMarkerRadius !== void 0) {
          flattened[propName + "CrosshairMarkerRadius"] = lineObjTyped.crosshairMarkerRadius;
        }
        if (lineObjTyped.crosshairMarkerBorderColor !== void 0) {
          flattened[propName + "CrosshairMarkerBorderColor"] = lineObjTyped.crosshairMarkerBorderColor;
        }
        if (lineObjTyped.crosshairMarkerBackgroundColor !== void 0) {
          flattened[propName + "CrosshairMarkerBackgroundColor"] = lineObjTyped.crosshairMarkerBackgroundColor;
        }
        if (lineObjTyped.crosshairMarkerBorderWidth !== void 0) {
          flattened[propName + "CrosshairMarkerBorderWidth"] = lineObjTyped.crosshairMarkerBorderWidth;
        }
        if (lineObjTyped.lastPriceAnimation !== void 0) {
          flattened[propName + "LastPriceAnimation"] = lineObjTyped.lastPriceAnimation;
        }
      }
    }
  }
  return flattened;
}
function createSeries(chart, seriesType, data, userOptions = {}, paneId = 0) {
  try {
    if (!chart) {
      throw new SeriesCreationError(seriesType, "Chart instance is required");
    }
    if (!seriesType || typeof seriesType !== "string") {
      throw new SeriesCreationError(
        seriesType || "unknown",
        "Series type must be a non-empty string"
      );
    }
    const mappedType = normalizeSeriesType(seriesType);
    const descriptor = SERIES_REGISTRY.get(mappedType);
    if (!descriptor) {
      const availableTypes = Array.from(SERIES_REGISTRY.keys()).join(", ");
      throw new SeriesCreationError(
        seriesType,
        `Unknown series type '${seriesType}' (normalized to '${mappedType}'). Available types: ${availableTypes}`
      );
    }
    const defaultOptions = extractDefaultOptions(descriptor);
    const flattenedUserOptions = flattenLineOptions(userOptions, descriptor);
    const { displayName, ...apiOptions } = flattenedUserOptions;
    const options = {
      ...defaultOptions,
      ...apiOptions,
      // Use apiOptions (with custom properties filtered out)
      // Add _seriesType property so we can identify series type later via series.options()
      _seriesType: mappedType
    };
    return descriptor.create(chart, data, options, paneId);
  } catch (error) {
    if (error instanceof SeriesCreationError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    SingletonBase.logger.error(
      `Series creation failed for ${seriesType}: ${errorMessage}`,
      "UnifiedSeriesFactory",
      error
    );
    throw new SeriesCreationError(
      seriesType,
      `Series creation failed: ${errorMessage}`,
      error
    );
  }
}
function getDefaultOptions(seriesType) {
  const descriptor = SERIES_REGISTRY.get(seriesType);
  if (!descriptor) {
    const availableTypes = Array.from(SERIES_REGISTRY.keys()).join(", ");
    throw new SeriesCreationError(
      seriesType,
      `Unknown series type. Available types: ${availableTypes}`
    );
  }
  return extractDefaultOptions(descriptor);
}
function registerSeriesDescriptor(descriptor) {
  SERIES_REGISTRY.set(descriptor.type, descriptor);
}
function unregisterSeriesDescriptor(seriesType) {
  return SERIES_REGISTRY.delete(seriesType);
}
function getSeriesDescriptorsByCategory(category) {
  return Array.from(SERIES_REGISTRY.values()).filter((desc) => desc.category === category);
}
function createSeriesWithConfig(chart, config) {
  try {
    const {
      type,
      data = [],
      options = {},
      paneId = 0,
      priceScale,
      priceLines,
      markers,
      legend,
      seriesId,
      chartId,
      title
      // Extract top-level title from config
    } = config;
    const mergedOptions = title !== void 0 ? { ...options, title } : options;
    const series = createSeries(chart, type, data, mergedOptions, paneId);
    if (priceScale) {
      try {
        const cleanedPriceScale = lineStyle.cleanLineStyleOptions(priceScale);
        series.priceScale().applyOptions(cleanedPriceScale);
      } catch (error) {
        SingletonBase.logger.warn("Failed to configure price scale", "UnifiedSeriesFactory", error);
      }
    }
    if (priceLines && Array.isArray(priceLines)) {
      priceLines.forEach((priceLine) => {
        try {
          series.createPriceLine(priceLine);
        } catch (error) {
          SingletonBase.logger.warn("Failed to create price line", "UnifiedSeriesFactory", error);
        }
      });
    }
    if (markers && Array.isArray(markers) && markers.length > 0) {
      try {
        const snappedMarkers = applyTimestampSnapping(markers, data);
        lightweightCharts.createSeriesMarkers(series, snappedMarkers);
      } catch (error) {
        SingletonBase.logger.warn("Failed to set markers", "UnifiedSeriesFactory", error);
      }
    }
    series.paneId = paneId;
    if (seriesId) {
      series.seriesId = seriesId;
    }
    if (legend) {
      series.legendConfig = legend;
    }
    const optionsWithCustomProps = options;
    if (optionsWithCustomProps.displayName) {
      series.displayName = optionsWithCustomProps.displayName;
    }
    if (optionsWithCustomProps.title) {
      series.title = optionsWithCustomProps.title;
    }
    if (legend && legend.visible && chartId) {
      try {
        const legendManager = window.paneLegendManagers?.[chartId]?.[paneId];
        if (legendManager && typeof legendManager.addSeriesLegend === "function") {
          legendManager.addSeriesLegend(seriesId || `series-${Date.now()}`, config);
        }
      } catch (error) {
        SingletonBase.logger.warn("Failed to register series legend", "UnifiedSeriesFactory", error);
      }
    }
    const { trades, tradeVisualizationOptions } = config;
    if (trades && tradeVisualizationOptions && trades.length > 0) {
      try {
        const visualElements = tradeVisualization.createTradeVisualElements(trades, tradeVisualizationOptions, data);
        if (visualElements.markers && visualElements.markers.length > 0) {
          lightweightCharts.createSeriesMarkers(series, visualElements.markers);
        }
        if (visualElements.rectangles && visualElements.rectangles.length > 0 && chartId) {
          const extendedChart = chart;
          if (!extendedChart._pendingTradeRectangles) {
            extendedChart._pendingTradeRectangles = [];
          }
          extendedChart._pendingTradeRectangles.push({
            rectangles: visualElements.rectangles,
            series,
            chartId
          });
        }
      } catch (error) {
        SingletonBase.logger.warn("Failed to create trade visualization", "UnifiedSeriesFactory", error);
      }
    }
    return series;
  } catch (error) {
    SingletonBase.logger.error("Series creation with config failed", "UnifiedSeriesFactory", error);
    return null;
  }
}
function applyTimestampSnapping(markers, chartData) {
  if (!chartData || chartData.length === 0) {
    return markers;
  }
  const availableTimes = chartData.map((item) => {
    if (typeof item.time === "number") {
      return item.time;
    } else if (typeof item.time === "string") {
      return Math.floor(new Date(item.time).getTime() / 1e3);
    }
    return null;
  }).filter((time) => time !== null);
  if (availableTimes.length === 0) {
    return markers;
  }
  return markers.map((marker) => {
    if (marker.time && typeof marker.time === "number") {
      const nearestTime = availableTimes.reduce((nearest, current) => {
        const currentDiff = Math.abs(current - marker.time);
        const nearestDiff = Math.abs(nearest - marker.time);
        return currentDiff < nearestDiff ? current : nearest;
      });
      return {
        ...marker,
        time: nearestTime
      };
    }
    return marker;
  });
}
function updateSeriesData(series, data) {
  try {
    series.setData(data);
  } catch (error) {
    SingletonBase.logger.error("Failed to update series data", "UnifiedSeriesFactory", error);
    throw error;
  }
}
function updateSeriesMarkers(series, markers, data) {
  try {
    const snappedMarkers = data ? applyTimestampSnapping(markers, data) : markers;
    lightweightCharts.createSeriesMarkers(series, snappedMarkers);
  } catch (error) {
    SingletonBase.logger.error("Failed to update series markers", "UnifiedSeriesFactory", error);
    throw error;
  }
}
function updateSeriesOptions(series, options) {
  try {
    const cleanedOptions = lineStyle.cleanLineStyleOptions(options);
    series.applyOptions(cleanedOptions);
  } catch (error) {
    SingletonBase.logger.error("Failed to update series options", "UnifiedSeriesFactory", error);
    throw error;
  }
}
const SeriesFactory = {
  createSeries,
  createSeriesWithConfig,
  getSeriesDescriptor,
  getDefaultOptions,
  isCustomSeries,
  getAvailableSeriesTypes,
  updateSeriesData,
  updateSeriesMarkers,
  updateSeriesOptions
};
const LINE_STYLE_TO_STRING = {
  0: "solid",
  1: "dotted",
  2: "dashed",
  3: "large_dashed",
  4: "sparse_dotted"
};
const STRING_TO_LINE_STYLE = {
  solid: 0,
  dotted: 1,
  dashed: 2,
  large_dashed: 3,
  sparse_dotted: 4
};
function apiOptionsToDialogConfig(seriesType, apiOptions) {
  const normalizedType = normalizeSeriesType(seriesType);
  const descriptor = getSeriesDescriptor(normalizedType);
  if (!descriptor) {
    SingletonBase.logger.warn(
      `Unknown series type: ${seriesType} (normalized to ${normalizedType})`,
      "UnifiedPropertyMapper"
    );
    return apiOptions;
  }
  return apiOptionsToDialogConfig$1(descriptor, apiOptions);
}
function dialogConfigToApiOptions(seriesType, dialogConfig) {
  const normalizedType = normalizeSeriesType(seriesType);
  const descriptor = getSeriesDescriptor(normalizedType);
  if (!descriptor) {
    SingletonBase.logger.warn(
      `Unknown series type: ${seriesType} (normalized to ${normalizedType})`,
      "UnifiedPropertyMapper"
    );
    return dialogConfig;
  }
  const apiOptions = dialogConfigToApiOptions$1(descriptor, dialogConfig);
  return apiOptions;
}
const PropertyMapper = {
  apiOptionsToDialogConfig,
  dialogConfigToApiOptions,
  LINE_STYLE_TO_STRING,
  STRING_TO_LINE_STYLE
};
exports.AREA_SERIES_DESCRIPTOR = AREA_SERIES_DESCRIPTOR;
exports.BAND_SERIES_DESCRIPTOR = BAND_SERIES_DESCRIPTOR;
exports.BAR_SERIES_DESCRIPTOR = BAR_SERIES_DESCRIPTOR;
exports.BASELINE_SERIES_DESCRIPTOR = BASELINE_SERIES_DESCRIPTOR;
exports.BUILTIN_SERIES_DESCRIPTORS = BUILTIN_SERIES_DESCRIPTORS;
exports.CANDLESTICK_SERIES_DESCRIPTOR = CANDLESTICK_SERIES_DESCRIPTOR;
exports.CUSTOM_SERIES_DESCRIPTORS = CUSTOM_SERIES_DESCRIPTORS;
exports.GRADIENT_RIBBON_SERIES_DESCRIPTOR = GRADIENT_RIBBON_SERIES_DESCRIPTOR;
exports.HISTOGRAM_SERIES_DESCRIPTOR = HISTOGRAM_SERIES_DESCRIPTOR;
exports.LINE_SERIES_DESCRIPTOR = LINE_SERIES_DESCRIPTOR;
exports.PropertyDescriptors = PropertyDescriptors;
exports.PropertyMapper = PropertyMapper;
exports.RIBBON_SERIES_DESCRIPTOR = RIBBON_SERIES_DESCRIPTOR;
exports.SIGNAL_SERIES_DESCRIPTOR = SIGNAL_SERIES_DESCRIPTOR;
exports.STANDARD_SERIES_PROPERTIES = STANDARD_SERIES_PROPERTIES;
exports.SeriesCreationError = SeriesCreationError;
exports.SeriesFactory = SeriesFactory;
exports.TREND_FILL_SERIES_DESCRIPTOR = TREND_FILL_SERIES_DESCRIPTOR;
exports.apiOptionsToDialogConfig = apiOptionsToDialogConfig$1;
exports.createSeries = createSeries;
exports.createSeriesWithConfig = createSeriesWithConfig;
exports.dialogConfigToApiOptions = dialogConfigToApiOptions$1;
exports.extractDefaultOptions = extractDefaultOptions;
exports.getAvailableSeriesTypes = getAvailableSeriesTypes;
exports.getDefaultOptions = getDefaultOptions;
exports.getSeriesDescriptor = getSeriesDescriptor;
exports.getSeriesDescriptorsByCategory = getSeriesDescriptorsByCategory;
exports.isCustomSeries = isCustomSeries;
exports.normalizeSeriesType = normalizeSeriesType;
exports.registerSeriesDescriptor = registerSeriesDescriptor;
exports.unregisterSeriesDescriptor = unregisterSeriesDescriptor;
exports.updateSeriesData = updateSeriesData;
exports.updateSeriesMarkers = updateSeriesMarkers;
exports.updateSeriesOptions = updateSeriesOptions;
//# sourceMappingURL=UnifiedPropertyMapper-D5tW-qFY.cjs.map
