/**
 * @fileoverview Utils module - Utility functions and helpers
 *
 * Exports all utility functions for color manipulation, coordinate validation,
 * rendering, logging, and chart-related utilities.
 */
export type { Disposable } from './Disposable';
export { cleanupInstance } from './Disposable';
export { EventEmitter } from './EventEmitter';
export { KeyedSingletonManager } from './KeyedSingletonManager';
export { SingletonBase, createSingleton, Singleton } from './SingletonBase';
export { ChartReadyDetector } from './chartReadyDetection';
export * from './lightweightChartsUtils';
export * from './colorUtils';
export * from './signalColorUtils';
export * from './coordinateValidation';
export * from './dataValidation';
export * from './renderingUtils';
export * from './lineStyle';
export * from './errorHandler';
export { logger, LogLevel, chartLog, primitiveLog, perfLog } from './logger';
export * from './sanitization';
export { perfLogFn, deepCompare, getCachedDOMElement, getCachedDOMElementForTesting, throttle, memoize, batchDOMUpdates, getCachedDimensions, } from './performance';
export { ResizeObserverManager } from './resizeObserverManager';
//# sourceMappingURL=index.d.ts.map