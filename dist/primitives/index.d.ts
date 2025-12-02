/**
 * @fileoverview Primitives module - UI primitive components for chart overlays
 *
 * Exports all primitive classes and utilities for creating chart UI elements
 * like legends, buttons, range switchers, and custom series primitives.
 */
export { BasePanePrimitive, PrimitivePriority } from './BasePanePrimitive';
export type { BasePrimitiveConfig } from './BasePanePrimitive';
export { BaseSeriesPrimitive } from './BaseSeriesPrimitive';
export { LegendPrimitive, createLegendPrimitive, DefaultLegendConfigs } from './LegendPrimitive';
export { RangeSwitcherPrimitive, createRangeSwitcherPrimitive, DefaultRangeConfigs, TimeRange, } from './RangeSwitcherPrimitive';
export type { RangeConfig } from './RangeSwitcherPrimitive';
export { TradeRectanglePrimitive } from './TradeRectanglePrimitive';
export { BandPrimitive } from './BandPrimitive';
export { RibbonPrimitive } from './RibbonPrimitive';
export { GradientRibbonPrimitive } from './GradientRibbonPrimitive';
export { SignalPrimitive } from './SignalPrimitive';
export { TrendFillPrimitive } from './TrendFillPrimitive';
export { PrimitiveStylingUtils } from './PrimitiveStylingUtils';
export type { BaseStyleConfig, TypographyConfig, BorderConfig } from './PrimitiveStylingUtils';
export * from './PrimitiveDefaults';
//# sourceMappingURL=index.d.ts.map