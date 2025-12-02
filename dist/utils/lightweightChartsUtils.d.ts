/**
 * @fileoverview Lightweight Charts Utility Functions
 *
 * Type compatibility utilities for TradingView Lightweight Charts library.
 * Handles DeepPartial interface compatibility and type conversions.
 *
 * This module provides:
 * - Type-safe converters for chart options
 * - Series options compatibility helpers
 * - Line width, style, and source converters
 * - Safe options update wrappers
 *
 * @example
 * ```typescript
 * import { createSeriesOptions, asLineWidth } from './lightweightChartsUtils';
 *
 * const options = createSeriesOptions({
 *   lineWidth: 2,
 *   lineStyle: 0,
 *   color: '#2196F3'
 * });
 *
 * series.applyOptions(options);
 * ```
 */
/**
 * Utility type helpers for LightweightCharts compatibility
 */
export declare function asLineWidth(value: number): any;
export declare function asLineStyle(value: number | string): any;
export declare function asPriceLineSource(value: string): any;
/**
 * Comprehensive series options converter for LightweightCharts compatibility
 */
export declare function createSeriesOptions(options: Record<string, any>): Record<string, any>;
/**
 * Safe series options update that handles DeepPartial compatibility
 */
export declare function safeSeriesOptions<T>(options: T): T;
//# sourceMappingURL=lightweightChartsUtils.d.ts.map