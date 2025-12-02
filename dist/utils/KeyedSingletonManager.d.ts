/**
 * @fileoverview Keyed Singleton Manager
 *
 * Provides a reusable keyed singleton pattern for classes that need multiple
 * instances identified by keys (e.g., chartId, paneId combinations).
 *
 * Eliminates code duplication across manager classes that implement
 * manual keyed singleton patterns.
 *
 * Features:
 * - Support for constructor arguments
 * - Key-based instance management
 * - Automatic cleanup with destroy() pattern
 * - Type-safe API
 *
 * Usage:
 * ```typescript
 * class MyManager extends KeyedSingletonManager<MyManager> {
 *   constructor(arg1: string, arg2: number) {
 *     super();
 *     // ... initialization
 *   }
 *
 *   public destroy(): void {
 *     // ... cleanup
 *   }
 * }
 *
 * // Get or create instance
 * const instance = MyManager.getInstance('key', () => new MyManager('foo', 42));
 *
 * // Destroy instance
 * MyManager.destroyInstance('key');
 * ```
 */
/**
 * Interface for classes that can be destroyed
 */
export interface Destroyable {
    destroy(): void;
}
/**
 * Base class for keyed singleton pattern with constructor arguments
 *
 * Provides reusable getInstance/destroyInstance pattern that eliminates
 * code duplication across manager classes.
 *
 * @template _T - The class type (should be the subclass itself)
 */
export declare abstract class KeyedSingletonManager<_T extends Destroyable> implements Destroyable {
    private static instanceMaps;
    /**
     * Get or create a singleton instance for a given key
     *
     * @param className - Class name for instance mapping
     * @param key - Unique identifier for the instance
     * @param factory - Factory function to create new instance if needed
     * @returns The singleton instance
     */
    protected static getOrCreateInstance<T>(className: string, key: string, factory: () => T): T;
    /**
     * Destroy a singleton instance for a given key
     *
     * @param className - Class name for instance mapping
     * @param key - Unique identifier for the instance
     */
    protected static destroyInstanceByKey(className: string, key: string): void;
    /**
     * Check if an instance exists for a given key
     *
     * @param className - Class name for instance mapping
     * @param key - Unique identifier to check
     * @returns True if instance exists
     */
    protected static hasInstanceWithKey(className: string, key: string): boolean;
    /**
     * Get all instance keys for this class
     *
     * @param className - Class name for instance mapping
     * @returns Array of instance keys
     */
    protected static getInstanceKeys(className: string): string[];
    /**
     * Clear all instances for this class
     *
     * @param className - Class name for instance mapping
     */
    protected static clearAllInstances(className: string): void;
    /**
     * Abstract destroy method - subclasses must implement
     */
    abstract destroy(): void;
}
/**
 * Helper function to create instance keys from multiple parameters
 *
 * @param parts - Parts to join into a key
 * @returns Composite key string
 */
export declare function createInstanceKey(...parts: (string | number | undefined)[]): string;
//# sourceMappingURL=KeyedSingletonManager.d.ts.map