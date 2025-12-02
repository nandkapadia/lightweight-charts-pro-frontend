/**
 * @fileoverview Series module - Unified series factory and descriptors
 *
 * Exports the unified series factory system for creating both built-in
 * and custom series types with consistent configuration.
 */
export { SeriesFactory, SeriesCreationError, getSeriesDescriptor, getAvailableSeriesTypes, isCustomSeries, createSeries, getDefaultOptions, registerSeriesDescriptor, unregisterSeriesDescriptor, getSeriesDescriptorsByCategory, createSeriesWithConfig, updateSeriesData, updateSeriesMarkers, updateSeriesOptions, } from './UnifiedSeriesFactory';
export type { ExtendedSeriesConfig, ExtendedSeriesApi } from './UnifiedSeriesFactory';
export { PropertyMapper } from './UnifiedPropertyMapper';
export * from './core';
export * from './descriptors';
export * from './utils';
//# sourceMappingURL=index.d.ts.map