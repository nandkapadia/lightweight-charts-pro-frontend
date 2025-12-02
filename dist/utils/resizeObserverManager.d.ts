/**
 * @fileoverview Resize Observer Manager
 *
 * Utility class for managing ResizeObservers with automatic cleanup, throttling, and debouncing.
 * Provides centralized management of resize observations with memory leak prevention.
 *
 * This module provides:
 * - ResizeObserver lifecycle management
 * - Throttling and debouncing support
 * - Automatic cleanup on component unmount
 * - Multi-target observation
 *
 * Features:
 * - Centralized observer management
 * - Throttle (100ms default) to limit callback frequency
 * - Debounce support for delayed callbacks
 * - Memory leak prevention with automatic cleanup
 * - Error handling with logging
 *
 * @example
 * ```typescript
 * import { ResizeObserverManager } from './resizeObserverManager';
 *
 * const manager = new ResizeObserverManager();
 *
 * // Add observer with throttling
 * manager.addObserver(
 *   'chart-1',
 *   containerElement,
 *   (entry) => {
 *     chart.resize(entry.contentRect.width, entry.contentRect.height);
 *   },
 *   { throttleMs: 100, debounceMs: 50 }
 * );
 *
 * // Cleanup on unmount
 * manager.cleanup();
 * ```
 */
export declare class ResizeObserverManager {
    private observers;
    private callbacks;
    private timeouts;
    private targets;
    /**
     * Add a resize observer for a specific target
     */
    addObserver(id: string, target: Element, callback: (_entry: ResizeObserverEntry | ResizeObserverEntry[]) => void, options?: {
        throttleMs?: number;
        debounceMs?: number;
    }): void;
    /**
     * Remove a specific observer
     */
    removeObserver(id: string): void;
    /**
     * Check if an observer exists
     */
    hasObserver(id: string): boolean;
    /**
     * Get the number of active observers
     */
    getObserverCount(): number;
    /**
     * Cleanup all observers
     */
    cleanup(): void;
    /**
     * Get all observer IDs
     */
    getObserverIds(): string[];
    /**
     * Pause all observers temporarily.
     *
     * Note: This unobserves all targets but keeps the observers in the map.
     * After calling pauseAll(), you must call resumeAll() to re-observe targets.
     */
    pauseAll(): void;
    /**
     * Resume all observers after pauseAll().
     *
     * Re-observes all stored targets with their respective observers.
     */
    resumeAll(): void;
}
//# sourceMappingURL=resizeObserverManager.d.ts.map