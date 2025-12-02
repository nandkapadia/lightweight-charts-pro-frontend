"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const primitives_index = require("./primitives/index.cjs");
const TrendFillPrimitive = require("./TrendFillPrimitive-CtORNuw-.cjs");
const BandPrimitive = require("./BandPrimitive-B-FZ-yCS.cjs");
const RibbonPrimitive = require("./RibbonPrimitive-CTwl-n6e.cjs");
const GradientRibbonPrimitive = require("./GradientRibbonPrimitive-CS1Z2c97.cjs");
const SignalPrimitive = require("./SignalPrimitive-DKmHoKb-.cjs");
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
const UnifiedPropertyMapper = require("./UnifiedPropertyMapper-D5tW-qFY.cjs");
const PrimitiveEventManager = require("./PrimitiveEventManager-CwtmooxI.cjs");
const services_index = require("./services/index.cjs");
const TradeTemplateProcessor = require("./TradeTemplateProcessor-Dadi3Bon.cjs");
const tradeVisualization = require("./tradeVisualization-CeKL58vO.cjs");
const Disposable = require("./Disposable-2YszKtdL.cjs");
const chartReadyDetection = require("./chartReadyDetection-XWRDMitZ.cjs");
const performance = require("./performance-D2kNEQh1.cjs");
const signalColorUtils = require("./signalColorUtils-pcf1rMp6.cjs");
const lineStyle = require("./lineStyle-Cx61JCTP.cjs");
const errorHandler = require("./errorHandler-Qr51wwfv.cjs");
const resizeObserverManager = require("./resizeObserverManager-Dwxf8nkG.cjs");
const trendFillSeriesPlugin = require("./trendFillSeriesPlugin-DogJ13XL.cjs");
const TooltipManager = require("./TooltipManager-BQr3hh4S.cjs");
const rectanglePlugin = require("./rectanglePlugin-DGmZnJrQ.cjs");
function propertyTypeToSettingType(propertyType) {
  return propertyType;
}
function getSeriesSettings(seriesType, primitive) {
  if (!seriesType) return {};
  const mappedType = UnifiedPropertyMapper.normalizeSeriesType(seriesType);
  if (primitive?.constructor?.getSettings) {
    try {
      return primitive.constructor.getSettings();
    } catch (error) {
      SingletonBase.logger.warn(`Error calling getSettings on ${seriesType}`, "seriesSettingsRegistry", error);
    }
  }
  const descriptor = UnifiedPropertyMapper.getSeriesDescriptor(mappedType);
  if (!descriptor) {
    SingletonBase.logger.warn(
      `Unknown series type: ${seriesType} (normalized to ${mappedType})`,
      "seriesSettingsRegistry"
    );
    return {};
  }
  const settings = {};
  for (const [propName, propDesc] of Object.entries(descriptor.properties)) {
    if (propDesc.hidden) {
      continue;
    }
    settings[propName] = propertyTypeToSettingType(propDesc.type);
  }
  return settings;
}
exports.BasePanePrimitive = primitives_index.BasePanePrimitive;
exports.DefaultLegendConfigs = primitives_index.DefaultLegendConfigs;
exports.DefaultRangeConfigs = primitives_index.DefaultRangeConfigs;
exports.LegendPrimitive = primitives_index.LegendPrimitive;
exports.PrimitivePriority = primitives_index.PrimitivePriority;
exports.PrimitiveStylingUtils = primitives_index.PrimitiveStylingUtils;
exports.RangeSwitcherPrimitive = primitives_index.RangeSwitcherPrimitive;
exports.TimeRange = primitives_index.TimeRange;
exports.TradeRectanglePrimitive = primitives_index.TradeRectanglePrimitive;
exports.createLegendPrimitive = primitives_index.createLegendPrimitive;
exports.createRangeSwitcherPrimitive = primitives_index.createRangeSwitcherPrimitive;
exports.BaseSeriesPrimitive = TrendFillPrimitive.BaseSeriesPrimitive;
exports.TrendFillPrimitive = TrendFillPrimitive.TrendFillPrimitive;
exports.BandPrimitive = BandPrimitive.BandPrimitive;
exports.RibbonPrimitive = RibbonPrimitive.RibbonPrimitive;
exports.GradientRibbonPrimitive = GradientRibbonPrimitive.GradientRibbonPrimitive;
exports.SignalPrimitive = SignalPrimitive.SignalPrimitive;
exports.ButtonDimensions = SingletonBase.ButtonDimensions;
exports.CSS_CLASSES = SingletonBase.CSS_CLASSES;
exports.ChartCoordinateService = SingletonBase.ChartCoordinateService;
exports.DIMENSIONS = SingletonBase.DIMENSIONS;
exports.FALLBACKS = SingletonBase.FALLBACKS;
exports.LogLevel = SingletonBase.LogLevel;
exports.MARGINS = SingletonBase.MARGINS;
exports.Singleton = SingletonBase.Singleton;
exports.SingletonBase = SingletonBase.SingletonBase;
exports.TIMING = SingletonBase.TIMING;
exports.UniversalSpacing = SingletonBase.UniversalSpacing;
exports.Z_INDEX = SingletonBase.Z_INDEX;
exports.areCoordinatesStale = SingletonBase.areCoordinatesStale;
exports.chartLog = SingletonBase.chartLog;
exports.createBoundingBox = SingletonBase.createBoundingBox;
exports.createSingleton = SingletonBase.createSingleton;
exports.getCoordinateDebugInfo = SingletonBase.getCoordinateDebugInfo;
exports.getDimensions = SingletonBase.getDimensions;
exports.getFallback = SingletonBase.getFallback;
exports.getMargins = SingletonBase.getMargins;
exports.logValidationResult = SingletonBase.logValidationResult;
exports.logger = SingletonBase.logger;
exports.perfLog = SingletonBase.perfLog;
exports.primitiveLog = SingletonBase.primitiveLog;
exports.sanitizeCoordinates = SingletonBase.sanitizeCoordinates;
exports.validateBoundingBox = SingletonBase.validateBoundingBox;
exports.validateChartCoordinates = SingletonBase.validateChartCoordinates;
exports.validateConfiguration = SingletonBase.validateConfiguration;
exports.validatePaneCoordinates = SingletonBase.validatePaneCoordinates;
exports.validateScaleDimensions = SingletonBase.validateScaleDimensions;
exports.PropertyMapper = UnifiedPropertyMapper.PropertyMapper;
exports.SeriesCreationError = UnifiedPropertyMapper.SeriesCreationError;
exports.SeriesFactory = UnifiedPropertyMapper.SeriesFactory;
exports.createSeries = UnifiedPropertyMapper.createSeries;
exports.createSeriesWithConfig = UnifiedPropertyMapper.createSeriesWithConfig;
exports.getAvailableSeriesTypes = UnifiedPropertyMapper.getAvailableSeriesTypes;
exports.getDefaultOptions = UnifiedPropertyMapper.getDefaultOptions;
exports.getSeriesDescriptor = UnifiedPropertyMapper.getSeriesDescriptor;
exports.getSeriesDescriptorsByCategory = UnifiedPropertyMapper.getSeriesDescriptorsByCategory;
exports.isCustomSeries = UnifiedPropertyMapper.isCustomSeries;
exports.registerSeriesDescriptor = UnifiedPropertyMapper.registerSeriesDescriptor;
exports.unregisterSeriesDescriptor = UnifiedPropertyMapper.unregisterSeriesDescriptor;
exports.updateSeriesData = UnifiedPropertyMapper.updateSeriesData;
exports.updateSeriesMarkers = UnifiedPropertyMapper.updateSeriesMarkers;
exports.updateSeriesOptions = UnifiedPropertyMapper.updateSeriesOptions;
exports.CornerLayoutManager = PrimitiveEventManager.CornerLayoutManager;
exports.PrimitiveEventManager = PrimitiveEventManager.PrimitiveEventManager;
exports.PaneCollapseManager = services_index.PaneCollapseManager;
exports.createAnnotationVisualElements = services_index.createAnnotationVisualElements;
Object.defineProperty(exports, "TemplateEngine", {
  enumerable: true,
  get: () => TradeTemplateProcessor.TemplateEngine
});
exports.TradeTemplateProcessor = TradeTemplateProcessor.TradeTemplateProcessor;
exports.createTradeVisualElements = tradeVisualization.createTradeVisualElements;
exports.KeyedSingletonManager = Disposable.KeyedSingletonManager;
exports.ChartReadyDetector = chartReadyDetection.ChartReadyDetector;
exports.QuickValidators = performance.QuickValidators;
exports.ValidationConfigs = performance.ValidationConfigs;
exports.asLineStyle = performance.asLineStyle;
exports.asLineWidth = performance.asLineWidth;
exports.asPriceLineSource = performance.asPriceLineSource;
exports.batchDOMUpdates = performance.batchDOMUpdates;
exports.createOptimizedStylesAdvanced = performance.createOptimizedStylesAdvanced;
exports.createSeriesOptions = performance.createSeriesOptions;
exports.deepCompare = performance.deepCompare;
exports.filterValidData = performance.filterValidData;
exports.getCachedDOMElement = performance.getCachedDOMElement;
exports.getCachedDimensions = performance.getCachedDimensions;
exports.memoize = performance.memoize;
exports.perfLogFn = performance.perfLogFn;
exports.safeSeriesOptions = performance.safeSeriesOptions;
exports.throttle = performance.throttle;
exports.validateData = performance.validateData;
exports.validateDataArray = performance.validateDataArray;
exports.SignalColorCalculator = signalColorUtils.SignalColorCalculator;
exports.calculateGradientColor = signalColorUtils.calculateGradientColor;
exports.clamp = signalColorUtils.clamp;
exports.cssToHex = signalColorUtils.cssToHex;
exports.debounce = signalColorUtils.debounce;
exports.extractColorAndOpacity = signalColorUtils.extractColorAndOpacity;
exports.generateColorPalette = signalColorUtils.generateColorPalette;
exports.getContrastColor = signalColorUtils.getContrastColor;
exports.getSolidColorFromFill = signalColorUtils.getSolidColorFromFill;
exports.hexToRgba = signalColorUtils.hexToRgba;
exports.hexToRgbaString = signalColorUtils.hexToRgbaString;
exports.interpolateColor = signalColorUtils.interpolateColor;
exports.isTransparent = signalColorUtils.isTransparent;
exports.isValidHexColor = signalColorUtils.isValidHexColor;
exports.parseCssColor = signalColorUtils.parseCssColor;
exports.parseHexColor = signalColorUtils.parseHexColor;
exports.rgbaToHex = signalColorUtils.rgbaToHex;
exports.sanitizeHexColor = signalColorUtils.sanitizeHexColor;
exports.toCss = signalColorUtils.toCss;
exports.cleanLineStyleOptions = lineStyle.cleanLineStyleOptions;
exports.validateLineStyle = lineStyle.validateLineStyle;
exports.ErrorSeverity = errorHandler.ErrorSeverity;
exports.assert = errorHandler.assert;
exports.createErrorHandler = errorHandler.createErrorHandler;
exports.handleError = errorHandler.handleError;
exports.handleErrorWithOptions = errorHandler.handleErrorWithOptions;
exports.safeExecute = errorHandler.safeExecute;
exports.safeExecuteAsync = errorHandler.safeExecuteAsync;
exports.throwValidationError = errorHandler.throwValidationError;
exports.ResizeObserverManager = resizeObserverManager.ResizeObserverManager;
exports.SignalSeries = trendFillSeriesPlugin.SignalSeries;
exports.SignalSeriesPlugin = trendFillSeriesPlugin.SignalSeriesPlugin;
exports.createBandSeries = trendFillSeriesPlugin.createBandSeries;
exports.createGradientRibbonSeries = trendFillSeriesPlugin.createGradientRibbonSeries;
exports.createRibbonSeries = trendFillSeriesPlugin.createRibbonSeries;
exports.createSignalSeries = trendFillSeriesPlugin.createSignalSeries;
exports.createSignalSeriesPlugin = trendFillSeriesPlugin.createSignalSeriesPlugin;
exports.createTrendFillSeries = trendFillSeriesPlugin.createTrendFillSeries;
exports.defaultSignalOptions = trendFillSeriesPlugin.defaultSignalOptions;
exports.TooltipManager = TooltipManager.TooltipManager;
exports.RectangleOverlayPlugin = rectanglePlugin.RectangleOverlayPlugin;
exports.TooltipPlugin = rectanglePlugin.TooltipPlugin;
exports.getSeriesSettings = getSeriesSettings;
//# sourceMappingURL=index.cjs.map
