/**
 * @fileoverview Base singleton class to eliminate DRY violations
 *
 * Provides a reusable singleton pattern implementation to eliminate
 * code duplication across services and utilities.
 */
/**
 * Base singleton class with common singleton functionality
 *
 * @template T - The class type that extends this base
 */
export declare abstract class SingletonBase<T extends SingletonBase<T>> {
    private static instances;
    /**
     * Get singleton instance for a specific class
     *
     * @param constructor - The class constructor
     * @param key - Optional key for multiple instances of same class
     * @returns Singleton instance
     */
    static getInstance<T extends SingletonBase<T>>(constructor: new () => T, key?: string): T;
    /**
     * Clear singleton instance (useful for testing)
     *
     * @param key - The key to clear, or clear all if not provided
     */
    static clearInstance(key?: string): void;
    /**
     * Check if instance exists
     *
     * @param key - The key to check
     * @returns True if instance exists
     */
    static hasInstance(key: string): boolean;
    /**
     * Get all instance keys (useful for debugging)
     *
     * @returns Array of instance keys
     */
    protected static getInstanceKeys(): string[];
    /**
     * Get instance count (useful for monitoring)
     *
     * @returns Number of active instances
     */
    protected static getInstanceCount(): number;
}
/**
 * Decorator for automatic singleton implementation
 *
 * @param key - Optional key for the singleton instance
 */
export declare function Singleton(key?: string): <T extends new (...args: any[]) => any>(constructor: T) => T;
/**
 * Factory function for creating singleton classes
 *
 * @param constructor - The class constructor
 * @param key - Optional key for the singleton
 * @returns Singleton instance
 */
export declare function createSingleton<T>(constructor: any, key?: string): T;
//# sourceMappingURL=SingletonBase.d.ts.map