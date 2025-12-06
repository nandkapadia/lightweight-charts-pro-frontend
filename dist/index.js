import { BasePanePrimitive, DefaultLegendConfigs, DefaultRangeConfigs, LegendPrimitive, PrimitivePriority, PrimitiveStylingUtils, RangeSwitcherPrimitive, TimeRange, TradeRectanglePrimitive, createLegendPrimitive, createRangeSwitcherPrimitive } from "./primitives/index.js";
import { B, T } from "./TrendFillPrimitive-CYhR28d5.js";
import { BandPrimitive } from "./BandPrimitive-qwRQsolj.js";
import { RibbonPrimitive } from "./RibbonPrimitive-CUS8OIAM.js";
import { GradientRibbonPrimitive } from "./GradientRibbonPrimitive-D9eS6vkT.js";
import { SignalPrimitive } from "./SignalPrimitive-BlYMaNR8.js";
import { l as logger } from "./SingletonBase-U-nNeQaU.js";
import { m, B as B2, n, u, C, D, F, L, M, a, S, T as T2, U, Z, i, b, h, c, k, q, r, o, j, d, p, s, g, v, t, f, e } from "./SingletonBase-U-nNeQaU.js";
import { x as normalizeSeriesType, g as getSeriesDescriptor } from "./UnifiedPropertyMapper-Clv9GlEt.js";
import { P, a as a2, S as S2, c as c2, f as f2, b as b2, d as d2, e as e2, i as i2, r as r2, u as u2, h as h2, j as j2, k as k2 } from "./UnifiedPropertyMapper-Clv9GlEt.js";
import { C as C2, P as P2 } from "./PrimitiveEventManager-DHN3p0kt.js";
import { PaneCollapseManager, createAnnotationVisualElements } from "./services/index.js";
import { T as T3, a as a3 } from "./TradeTemplateProcessor-8_VDoPqm.js";
import { c as c3 } from "./tradeVisualization-krm94H-H.js";
import { K } from "./Disposable-s5YYE-pO.js";
import { ChartReadyDetector } from "./chartReadyDetection-BHQW1Rce.js";
import { Q, V, f as f3, e as e3, h as h3, b as b3, l, i as i3, d as d3, k as k3, g as g2, c as c4, m as m2, p as p2, s as s2, t as t2, v as v2, j as j3 } from "./performance-CrlOj4rV.js";
import { S as S3, d as d4, l as l2, c as c5, n as n2, e as e4, k as k4, j as j4, m as m3, b as b4, h as h4, i as i4, f as f4, g as g3, a as a4, p as p3, r as r3, s as s3, t as t3 } from "./signalColorUtils-DHFOxfDI.js";
import { c as c6, v as v3 } from "./lineStyle-CLuQN0BQ.js";
import { E, d as d5, c as c7, h as h5, a as a5, s as s4, b as b5, t as t4 } from "./errorHandler-DjpPYQWq.js";
import { R } from "./resizeObserverManager-Cvxy9tba.js";
import { S as S4, d as d6, c as c8, b as b6, a as a6, e as e5, f as f5, h as h6, g as g4 } from "./trendFillSeriesPlugin-Dh6Xr_7M.js";
import { T as T4 } from "./TooltipManager-BHAViL7r.js";
import { R as R2, T as T5 } from "./rectanglePlugin-BDSiVFjR.js";
function propertyTypeToSettingType(propertyType) {
  return propertyType;
}
function getSeriesSettings(seriesType, primitive) {
  if (!seriesType) return {};
  const mappedType = normalizeSeriesType(seriesType);
  if (primitive?.constructor?.getSettings) {
    try {
      return primitive.constructor.getSettings();
    } catch (error) {
      logger.warn(`Error calling getSettings on ${seriesType}`, "seriesSettingsRegistry", error);
    }
  }
  const descriptor = getSeriesDescriptor(mappedType);
  if (!descriptor) {
    logger.warn(
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
export {
  BandPrimitive,
  BasePanePrimitive,
  B as BaseSeriesPrimitive,
  m as ButtonColors,
  B2 as ButtonDimensions,
  n as ButtonEffects,
  u as CSS_CLASSES,
  C as ChartCoordinateService,
  ChartReadyDetector,
  C2 as CornerLayoutManager,
  D as DIMENSIONS,
  DefaultLegendConfigs,
  DefaultRangeConfigs,
  E as ErrorSeverity,
  F as FALLBACKS,
  GradientRibbonPrimitive,
  K as KeyedSingletonManager,
  LegendPrimitive,
  L as LogLevel,
  M as MARGINS,
  PaneCollapseManager,
  P2 as PrimitiveEventManager,
  PrimitivePriority,
  PrimitiveStylingUtils,
  P as PropertyMapper,
  Q as QuickValidators,
  RangeSwitcherPrimitive,
  R2 as RectangleOverlayPlugin,
  R as ResizeObserverManager,
  RibbonPrimitive,
  a2 as SeriesCreationError,
  S2 as SeriesFactory,
  S3 as SignalColorCalculator,
  SignalPrimitive,
  S4 as SignalSeries,
  d6 as SignalSeriesPlugin,
  a as Singleton,
  S as SingletonBase,
  T2 as TIMING,
  T3 as TemplateEngine,
  TimeRange,
  T4 as TooltipManager,
  T5 as TooltipPlugin,
  TradeRectanglePrimitive,
  a3 as TradeTemplateProcessor,
  T as TrendFillPrimitive,
  U as UniversalSpacing,
  V as ValidationConfigs,
  Z as Z_INDEX,
  i as areCoordinatesStale,
  f3 as asLineStyle,
  e3 as asLineWidth,
  h3 as asPriceLineSource,
  d5 as assert,
  b3 as batchDOMUpdates,
  d4 as calculateGradientColor,
  b as chartLog,
  l2 as clamp,
  c6 as cleanLineStyleOptions,
  createAnnotationVisualElements,
  c8 as createBandSeries,
  h as createBoundingBox,
  c7 as createErrorHandler,
  b6 as createGradientRibbonSeries,
  createLegendPrimitive,
  l as createOptimizedStylesAdvanced,
  createRangeSwitcherPrimitive,
  a6 as createRibbonSeries,
  c2 as createSeries,
  i3 as createSeriesOptions,
  f2 as createSeriesWithConfig,
  e5 as createSignalSeries,
  f5 as createSignalSeriesPlugin,
  c as createSingleton,
  c3 as createTradeVisualElements,
  h6 as createTrendFillSeries,
  c5 as cssToHex,
  n2 as debounce,
  d3 as deepCompare,
  g4 as defaultSignalOptions,
  e4 as extractColorAndOpacity,
  k3 as filterValidData,
  k4 as generateColorPalette,
  b2 as getAvailableSeriesTypes,
  g2 as getCachedDOMElement,
  c4 as getCachedDimensions,
  j4 as getContrastColor,
  k as getCoordinateDebugInfo,
  d2 as getDefaultOptions,
  q as getDimensions,
  r as getFallback,
  o as getMargins,
  getSeriesDescriptor,
  e2 as getSeriesDescriptorsByCategory,
  getSeriesSettings,
  m3 as getSolidColorFromFill,
  h5 as handleError,
  a5 as handleErrorWithOptions,
  b4 as hexToRgba,
  h4 as hexToRgbaString,
  i4 as interpolateColor,
  i2 as isCustomSeries,
  f4 as isTransparent,
  g3 as isValidHexColor,
  j as logValidationResult,
  logger,
  m2 as memoize,
  a4 as parseCssColor,
  p3 as parseHexColor,
  d as perfLog,
  p2 as perfLogFn,
  p as primitiveLog,
  r2 as registerSeriesDescriptor,
  r3 as rgbaToHex,
  s4 as safeExecute,
  b5 as safeExecuteAsync,
  s2 as safeSeriesOptions,
  s as sanitizeCoordinates,
  s3 as sanitizeHexColor,
  t2 as throttle,
  t4 as throwValidationError,
  t3 as toCss,
  u2 as unregisterSeriesDescriptor,
  h2 as updateSeriesData,
  j2 as updateSeriesMarkers,
  k2 as updateSeriesOptions,
  g as validateBoundingBox,
  v as validateChartCoordinates,
  t as validateConfiguration,
  v2 as validateData,
  j3 as validateDataArray,
  v3 as validateLineStyle,
  f as validatePaneCoordinates,
  e as validateScaleDimensions
};
//# sourceMappingURL=index.js.map
