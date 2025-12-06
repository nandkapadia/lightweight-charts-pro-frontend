/**
 * @fileoverview Performance Optimization Utilities
 *
 * Performance utilities for optimizing chart rendering and operations.
 * Provides deep comparison, DOM caching, and timing helpers.
 *
 * This module provides:
 * - Deep object comparison without JSON.stringify
 * - DOM query caching for performance
 * - Performance timing wrappers
 * - Development-only logging
 *
 * Features:
 * - Optimized recursive comparison
 * - Automatic cache expiration (5s)
 * - Production-friendly (minimal overhead)
 * - Type-safe comparison helpers
 *
 * @example
 * ```typescript
 * import { deepCompare, getCachedDOMElement } from './performance';
 *
 * // Efficient comparison
 * if (!deepCompare(oldConfig, newConfig)) {
 *   updateChart(newConfig);
 * }
 *
 * // Cached DOM queries
 * const container = getCachedDOMElement('#chart-container');
 * ```
 */
export declare const perfLog: {
    log: (..._: unknown[]) => void;
    warn: (..._: unknown[]) => void;
    error: (..._: unknown[]) => void;
};
export declare function perfLogFn<T>(_operationName: string, fn: () => T): T;
export declare function deepCompare(objA: unknown, objB: unknown): boolean;
export declare function getCachedDOMElement(selector: string): HTMLElement | null;
export declare function getCachedDOMElementForTesting(id: string, cache: Map<string, HTMLElement>, createFn: ((_id: string) => HTMLElement | null) | null): HTMLElement | null;
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Memoization utility for expensive calculations with LRU cache eviction.
 *
 * @param func - The function to memoize
 * @param resolver - Optional custom key resolver function
 * @param maxCacheSize - Maximum number of entries to cache (default: 100)
 * @returns Memoized function with bounded cache
 *
 * @example
 * ```typescript
 * const expensiveCalc = memoize(
 *   (x: number, y: number) => x * y,
 *   (x, y) => `${x}-${y}`,
 *   50 // Cache up to 50 results
 * );
 * ```
 */
export declare function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: Parameters<T>) => string, maxCacheSize?: number): T;
export declare function batchDOMUpdates(updates: (() => void)[]): void;
export declare const getCachedDimensions: (element: HTMLElement) => {
    width: number;
    height: number;
    top: number;
    left: number;
};
export declare class PerformanceMonitor {
    private metrics;
    startTimer(name: string): () => void;
    getMetrics(name?: string): Record<string, {
        avg: number;
        min: number;
        max: number;
        count: number;
    }>;
    clearMetrics(): void;
}
export declare function shallowEqual(objA: unknown, objB: unknown): boolean;
export declare function deepEqual(objA: unknown, objB: unknown): boolean;
export declare function arrayEquals<T>(a: T[], b: T[]): boolean;
export declare function shallowClone<T>(obj: T): T;
export declare function createIntersectionObserver(callback: (_entries: IntersectionObserverEntry[]) => void, options?: IntersectionObserverInit): IntersectionObserver;
/**
 * Efficient event listener management with proper cleanup support.
 * Stores element references to enable removeAllListeners() to actually
 * remove the listeners from the DOM.
 */
export declare class EventManager {
    private listeners;
    private elementIdCounter;
    private elementIds;
    private getElementId;
    addEventListener(element: EventTarget, event: string, listener: EventListener): void;
    removeEventListener(element: EventTarget, event: string, listener: EventListener): void;
    removeAllListeners(): void;
    /**
     * Remove all listeners for a specific element.
     */
    removeAllListenersForElement(element: EventTarget): void;
}
export declare const globalEventManager: EventManager;
/** Style object type for CSS properties */
export type StyleObject = Record<string, string | number | undefined>;
export declare function createOptimizedStyles<T extends StyleObject | null | undefined>(styles: T): T extends null | undefined ? Record<string, never> : T;
/** Chart options for style calculation */
export interface ChartStyleOptions {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number | string;
    maxHeight?: number | string;
}
/** Optimized styles result */
export interface OptimizedStyles {
    container: {
        position: "relative";
        border: string;
        borderRadius: string;
        padding: string;
        width: string;
        height: string;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number | string;
        maxHeight?: number | string;
    };
    chartContainer: {
        width: string;
        height: string;
        position: "relative";
    };
}
export declare const createOptimizedStylesAdvanced: (width: number | null, height: number | null, shouldAutoSize: boolean, chartOptions?: ChartStyleOptions) => OptimizedStyles;
//# sourceMappingURL=performance.d.ts.map