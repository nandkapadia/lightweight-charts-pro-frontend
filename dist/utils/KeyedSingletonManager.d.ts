/**
 * @fileoverview Keyed Singleton Manager Pattern
 *
 * This module provides a keyed singleton pattern for classes that need multiple
 * instances identified by unique keys (e.g., chart IDs, pane IDs, or composite keys).
 *
 * Key Features:
 * - Multiple instances per class, identified by keys
 * - Support for constructor arguments via factory functions
 * - Automatic cleanup with destroy() pattern
 * - Type-safe generic API
 * - Instance introspection (get keys, check existence)
 *
 * Keyed Singleton Pattern:
 * Unlike regular singletons (one instance per class), keyed singletons allow
 * multiple instances of the same class, each identified by a unique key. This is
 * useful for:
 * - Per-chart managers (one instance per chart ID)
 * - Per-pane services (one instance per pane ID)
 * - Scoped resources (one instance per scope)
 *
 * Architecture:
 * - Two-level Map: className → (key → instance)
 * - Supports Destroyable interface for cleanup
 * - Abstract base class with protected static methods
 * - Subclasses implement getInstance/destroyInstance wrappers
 *
 * @example
 * ```typescript
 * class ChartManager extends KeyedSingletonManager<ChartManager> {
 *   constructor(private chartId: string, private options: ChartOptions) {
 *     super();
 *   }
 *
 *   public static getInstance(chartId: string, options: ChartOptions): ChartManager {
 *     return super.getOrCreateInstance(
 *       'ChartManager',
 *       chartId,
 *       () => new ChartManager(chartId, options)
 *     );
 *   }
 *
 *   public static destroyInstance(chartId: string): void {
 *     super.destroyInstanceByKey('ChartManager', chartId);
 *   }
 *
 *   public destroy(): void {
 *     // Cleanup logic here
 *   }
 * }
 *
 * // Usage
 * const chart1 = ChartManager.getInstance('chart-1', {...});
 * const chart2 = ChartManager.getInstance('chart-2', {...});
 * ChartManager.destroyInstance('chart-1');
 * ```
 */
/**
 * Interface for classes that can be destroyed/cleaned up.
 *
 * Similar to the Disposable interface but named differently to match
 * the common "destroy" naming convention used in this codebase.
 *
 * @remarks
 * This interface should be implemented by any class that:
 * - Holds resources that need cleanup (timers, listeners, connections)
 * - Needs to break circular references
 * - Manages DOM elements or external APIs
 *
 * @example
 * ```typescript
 * class ResourceManager implements Destroyable {
 *   private timers: number[] = [];
 *   private listeners: Array<() => void> = [];
 *
 *   destroy(): void {
 *     // Clear timers
 *     this.timers.forEach(id => clearInterval(id));
 *     this.timers = [];
 *
 *     // Remove listeners
 *     this.listeners.forEach(cleanup => cleanup());
 *     this.listeners = [];
 *   }
 * }
 * ```
 */
export interface Destroyable {
    /**
     * Cleanup method to release resources.
     *
     * @returns void
     */
    destroy(): void;
}
/**
 * Base class for keyed singleton pattern with constructor arguments.
 *
 * This abstract class provides infrastructure for implementing the keyed singleton
 * pattern. Unlike regular singletons, it allows multiple instances of a class,
 * each identified by a unique key.
 *
 * The class maintains a two-level map structure:
 * - First level: class name → instance map
 * - Second level: key → instance
 *
 * @template _T - The class type (should be the subclass itself, must implement Destroyable)
 *
 * @remarks
 * Why Abstract?
 * This class is abstract because subclasses need to implement:
 * 1. The destroy() method (from Destroyable)
 * 2. Static getInstance() wrapper with their specific arguments
 * 3. Static destroyInstance() wrapper
 *
 * Why Generic _T?
 * The generic parameter ensures type safety when extending this class.
 * The underscore prefix indicates it's not directly used but required for
 * type constraints.
 *
 * @example
 * ```typescript
 * class PaneManager extends KeyedSingletonManager<PaneManager> {
 *   constructor(private paneId: string, private config: Config) {
 *     super();
 *   }
 *
 *   public static getInstance(paneId: string, config: Config): PaneManager {
 *     return super.getOrCreateInstance(
 *       'PaneManager',
 *       paneId,
 *       () => new PaneManager(paneId, config)
 *     );
 *   }
 *
 *   public static destroyInstance(paneId: string): void {
 *     super.destroyInstanceByKey('PaneManager', paneId);
 *   }
 *
 *   public destroy(): void {
 *     console.log(`Destroying pane ${this.paneId}`);
 *   }
 * }
 * ```
 */
export declare abstract class KeyedSingletonManager<_T extends Destroyable> implements Destroyable {
    /**
     * Two-level map storing all keyed singleton instances.
     * - Outer Map: className → inner Map
     * - Inner Map: key → instance
     * This structure allows multiple classes to use the same key without conflicts.
     */
    private static instanceMaps;
    /**
     * Get or create a singleton instance for a given key.
     *
     * This is the core method for the keyed singleton pattern. It checks if an
     * instance exists for the given key, and if not, creates one using the
     * provided factory function.
     *
     * @template T - The type of the instance being created
     * @param className - Class name for instance mapping (typically the subclass name)
     * @param key - Unique identifier for the instance (e.g., 'chart-1', 'pane-main')
     * @param factory - Factory function to create new instance if needed
     * @returns T - The singleton instance (existing or newly created)
     *
     * @throws Error if the instance map cannot be retrieved
     *
     * @example
     * ```typescript
     * class MyManager extends KeyedSingletonManager<MyManager> {
     *   constructor(private id: string, private data: any) {
     *     super();
     *   }
     *
     *   public static getInstance(id: string, data: any): MyManager {
     *     return super.getOrCreateInstance(
     *       'MyManager',
     *       id,
     *       () => new MyManager(id, data)
     *     );
     *   }
     * }
     *
     * // First call creates instance
     * const mgr1 = MyManager.getInstance('id-1', { value: 42 });
     * // Second call returns existing instance (factory not called)
     * const mgr2 = MyManager.getInstance('id-1', { value: 99 });
     * // mgr1 === mgr2 is true
     * ```
     *
     * @remarks
     * Factory Pattern: The factory function is only called if a new instance needs
     * to be created. This allows lazy initialization and supports constructor
     * arguments without storing them.
     */
    protected static getOrCreateInstance<T>(className: string, key: string, factory: () => T): T;
    /**
     * Destroy a singleton instance for a given key.
     *
     * Removes the instance from the registry after calling its destroy() method
     * for cleanup. If the instance doesn't exist, this is a no-op (safe to call).
     *
     * @param className - Class name for instance mapping
     * @param key - Unique identifier for the instance to destroy
     * @returns void
     *
     * @example
     * ```typescript
     * class MyManager extends KeyedSingletonManager<MyManager> {
     *   public static destroyInstance(id: string): void {
     *     super.destroyInstanceByKey('MyManager', id);
     *   }
     *
     *   public destroy(): void {
     *     // Cleanup logic
     *     console.log('Cleaning up');
     *   }
     * }
     *
     * const mgr = MyManager.getInstance('id-1', {...});
     * MyManager.destroyInstance('id-1'); // Calls mgr.destroy() then removes it
     * ```
     *
     * @remarks
     * Cleanup Order:
     * 1. Call instance.destroy() for cleanup
     * 2. Remove instance from registry
     * This ensures the instance can clean up before being removed.
     */
    protected static destroyInstanceByKey(className: string, key: string): void;
    /**
     * Check if an instance exists for a given key.
     *
     * Returns true if an instance is registered for the specified key, false otherwise.
     * Useful for conditional logic or debugging.
     *
     * @param className - Class name for instance mapping
     * @param key - Unique identifier to check
     * @returns boolean - true if instance exists, false otherwise
     *
     * @example
     * ```typescript
     * class MyManager extends KeyedSingletonManager<MyManager> {
     *   public static hasInstance(id: string): boolean {
     *     return super.hasInstanceWithKey('MyManager', id);
     *   }
     * }
     *
     * if (MyManager.hasInstance('chart-1')) {
     *   console.log('Chart manager already exists');
     * }
     * ```
     */
    protected static hasInstanceWithKey(className: string, key: string): boolean;
    /**
     * Get all instance keys for this class.
     *
     * Returns an array of all keys for currently registered instances of this class.
     * Useful for debugging, iteration, or cleanup operations.
     *
     * @param className - Class name for instance mapping
     * @returns string[] - Array of instance keys (may be empty)
     *
     * @example
     * ```typescript
     * class MyManager extends KeyedSingletonManager<MyManager> {
     *   public static getKeys(): string[] {
     *     return super.getInstanceKeys('MyManager');
     *   }
     * }
     *
     * const keys = MyManager.getKeys();
     * console.log(`Active instances: ${keys.join(', ')}`);
     * // Output: "Active instances: chart-1, chart-2, chart-3"
     *
     * // Iterate over all instances
     * keys.forEach(key => {
     *   console.log(`Processing ${key}`);
     * });
     * ```
     */
    protected static getInstanceKeys(className: string): string[];
    /**
     * Clear all instances for this class.
     *
     * Destroys all instances by calling their destroy() methods, then clears
     * the instance map. This is useful for testing or complete cleanup.
     *
     * @param className - Class name for instance mapping
     * @returns void
     *
     * @example
     * ```typescript
     * class MyManager extends KeyedSingletonManager<MyManager> {
     *   public static clearAll(): void {
     *     super.clearAllInstances('MyManager');
     *   }
     *
     *   public destroy(): void {
     *     console.log('Cleanup');
     *   }
     * }
     *
     * // Create multiple instances
     * MyManager.getInstance('id-1', {...});
     * MyManager.getInstance('id-2', {...});
     * MyManager.getInstance('id-3', {...});
     *
     * // Clean up all at once
     * MyManager.clearAll();
     * // Logs: "Cleanup", "Cleanup", "Cleanup"
     * ```
     *
     * @remarks
     * Use Cases:
     * - Test cleanup (afterEach hooks)
     * - Application shutdown
     * - Resetting global state
     *
     * Warning: This destroys ALL instances of the class. Use with caution
     * in production code.
     */
    protected static clearAllInstances(className: string): void;
    /**
     * Abstract destroy method - subclasses must implement.
     *
     * This method is required by the Destroyable interface and must be
     * implemented by all subclasses to define their cleanup logic.
     *
     * @returns void
     */
    abstract destroy(): void;
}
/**
 * Helper function to create instance keys from multiple parameters.
 *
 * This utility creates composite keys by joining multiple parts with hyphens.
 * Undefined values are converted to 'default'. This is useful for creating
 * keys from multiple identifiers (chartId + paneId, userId + sessionId, etc.).
 *
 * @param parts - Variable number of parts to join (strings, numbers, or undefined)
 * @returns string - Composite key string
 *
 * @example
 * ```typescript
 * // Simple key
 * const key1 = createInstanceKey('chart-1');
 * // Result: "chart-1"
 *
 * // Composite key
 * const key2 = createInstanceKey('chart-1', 'pane-main');
 * // Result: "chart-1-pane-main"
 *
 * // With undefined (becomes 'default')
 * const key3 = createInstanceKey('chart-1', undefined);
 * // Result: "chart-1-default"
 *
 * // With numbers (converted to strings)
 * const key4 = createInstanceKey('user', 123, 'session', 456);
 * // Result: "user-123-session-456"
 * ```
 *
 * @example
 * ```typescript
 * class PaneManager extends KeyedSingletonManager<PaneManager> {
 *   public static getInstance(chartId: string, paneId?: string): PaneManager {
 *     // Create composite key from both IDs
 *     const key = createInstanceKey(chartId, paneId);
 *     return super.getOrCreateInstance('PaneManager', key, () => new PaneManager(chartId, paneId));
 *   }
 * }
 *
 * const mgr1 = PaneManager.getInstance('chart-1', 'pane-1');
 * // Key: "chart-1-pane-1"
 *
 * const mgr2 = PaneManager.getInstance('chart-1');
 * // Key: "chart-1-default"
 * ```
 *
 * @remarks
 * Key Format: Parts are joined with hyphens ('-'). This creates readable keys
 * that are easy to debug. Make sure individual parts don't contain hyphens
 * to avoid ambiguity.
 *
 * Type Conversion: Numbers are converted to strings, undefined becomes 'default'.
 * This ensures all keys are valid strings.
 */
export declare function createInstanceKey(...parts: (string | number | undefined)[]): string;
//# sourceMappingURL=KeyedSingletonManager.d.ts.map