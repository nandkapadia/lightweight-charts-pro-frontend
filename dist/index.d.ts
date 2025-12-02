/**
 * @fileoverview Lightweight Charts Pro Core
 *
 * Framework-agnostic core library for TradingView Lightweight Charts.
 * Provides custom series plugins, UI primitives, services, and utilities.
 *
 * @packageDocumentation
 */
export { createBandSeries, createRibbonSeries, createGradientRibbonSeries, SignalSeries, SignalSeriesPlugin, createSignalSeries, createSignalSeriesPlugin, defaultSignalOptions, createTrendFillSeries, } from './plugins/series';
export type { BandData, BandSeriesOptions, RibbonData, RibbonSeriesOptions, GradientRibbonData, GradientRibbonSeriesOptions, SignalData, SignalSeriesOptions, TrendFillData, TrendFillSeriesOptions, } from './plugins/series';
export { TooltipManager, TooltipPlugin } from './plugins/chart';
export { RectangleOverlayPlugin } from './plugins/overlay';
export { BasePanePrimitive, BaseSeriesPrimitive, LegendPrimitive, createLegendPrimitive, DefaultLegendConfigs, RangeSwitcherPrimitive, createRangeSwitcherPrimitive, DefaultRangeConfigs, TimeRange, TradeRectanglePrimitive, BandPrimitive, RibbonPrimitive, GradientRibbonPrimitive, SignalPrimitive, TrendFillPrimitive, PrimitiveStylingUtils, UniversalSpacing, ButtonDimensions, PrimitivePriority, } from './primitives';
export type { BasePrimitiveConfig } from './primitives';
export { SeriesFactory, SeriesCreationError, getSeriesDescriptor, getAvailableSeriesTypes, isCustomSeries, createSeries, getDefaultOptions, registerSeriesDescriptor, unregisterSeriesDescriptor, getSeriesDescriptorsByCategory, createSeriesWithConfig, updateSeriesData, updateSeriesMarkers, updateSeriesOptions, PropertyMapper, } from './series';
export type { ExtendedSeriesConfig, ExtendedSeriesApi } from './series';
export { ChartCoordinateService, CornerLayoutManager, PaneCollapseManager, PrimitiveEventManager, TemplateEngine, TradeTemplateProcessor, createAnnotationVisualElements, createTradeVisualElements, } from './services';
export * from './types';
export * from './config';
export { KeyedSingletonManager, SingletonBase, Singleton, createSingleton, ChartReadyDetector, logger, LogLevel, chartLog, primitiveLog, perfLog, ResizeObserverManager, } from './utils';
export * from './utils/lightweightChartsUtils';
export * from './utils/colorUtils';
export * from './utils/signalColorUtils';
export { validateChartCoordinates, validateScaleDimensions, validatePaneCoordinates, validateBoundingBox, sanitizeCoordinates, createBoundingBox, areCoordinatesStale, logValidationResult, getCoordinateDebugInfo, } from './utils/coordinateValidation';
export { validateData, validateDataArray, filterValidData, ValidationConfigs, QuickValidators, } from './utils/dataValidation';
export type { ValidationConfig } from './utils/dataValidation';
export * from './utils/lineStyle';
export * from './utils/errorHandler';
export { perfLogFn, deepCompare, getCachedDOMElement, throttle, memoize, batchDOMUpdates, getCachedDimensions, createOptimizedStylesAdvanced, } from './utils/performance';
//# sourceMappingURL=index.d.ts.map