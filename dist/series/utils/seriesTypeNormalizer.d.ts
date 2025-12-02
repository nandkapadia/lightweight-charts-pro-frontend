/**
 * @fileoverview Series Type Normalization Utility
 *
 * Centralizes series type normalization to prevent duplication.
 * Handles lowercase → capitalized mapping for descriptor registry lookup.
 */
/**
 * Normalize series type string to match descriptor registry keys
 *
 * @param seriesType - Raw series type (case-insensitive, may have underscores)
 * @returns Normalized type matching registry keys
 *
 * @example
 * normalizeSeriesType('line') → 'Line'
 * normalizeSeriesType('gradient_ribbon') → 'GradientRibbon'
 * normalizeSeriesType('candlestick') → 'Candlestick'
 */
export declare function normalizeSeriesType(seriesType: string): string;
//# sourceMappingURL=seriesTypeNormalizer.d.ts.map