/**
 * @fileoverview Base Singleton Pattern Implementation
 *
 * This module provides a reusable singleton pattern implementation to eliminate
 * code duplication across services and utilities that need singleton behavior.
 *
 * Key Features:
 * - Abstract base class for singleton pattern
 * - Support for multiple instances with different keys
 * - Decorator for automatic singleton implementation
 * - Factory function for creating singletons
 * - Testing support with instance clearing
 *
 * Singleton Pattern:
 * The singleton pattern ensures that a class has only one instance and provides
 * a global point of access to it. This is useful for:
 * - Shared services (logging, configuration)
 * - Resource managers (connection pools, caches)
 * - Coordinating actions across the system
 *
 * Architecture:
 * - Static Map stores all singleton instances across all classes
 * - Each instance is keyed by class name or custom key
 * - Supports multiple instances of same class with different keys
 * - Type-safe generics ensure correct instance types
 *
 * @example
 * ```typescript
 * // Using base class
 * class Logger extends SingletonBase<Logger> {
 *   log(message: string) { console.log(message); }
 * }
 * const logger = SingletonBase.getInstance(Logger);
 *
 * // Using decorator
 * @Singleton()
 * class ConfigService {
 *   get(key: string) { return config[key]; }
 * }
 * const config = (ConfigService as any).getInstance();
 *
 * // Using factory
 * const service = createSingleton(MyService);
 * ```
 */

// ============================================================================
// Base Singleton Class
// ============================================================================

/**
 * Base singleton class with common singleton functionality.
 *
 * This abstract class provides the foundation for implementing the singleton pattern.
 * Subclasses inherit getInstance(), clearInstance(), and other utility methods.
 *
 * The class uses a static Map to store instances, where:
 * - Key: string (class name or custom key)
 * - Value: singleton instance
 *
 * @template T - The class type that extends this base (must be the subclass itself)
 *
 * @remarks
 * Why Generic Parameter?
 * The generic parameter T allows type-safe getInstance() calls. By making T
 * extend SingletonBase<T>, we ensure that getInstance() returns the correct
 * subclass type, not just SingletonBase.
 *
 * @example
 * ```typescript
 * class MyService extends SingletonBase<MyService> {
 *   private data: string[] = [];
 *
 *   addData(item: string) {
 *     this.data.push(item);
 *   }
 *
 *   getData() {
 *     return this.data;
 *   }
 * }
 *
 * // Get singleton instance - type is MyService, not SingletonBase
 * const service = SingletonBase.getInstance(MyService);
 * service.addData('test'); // Fully typed!
 * ```
 */
export abstract class SingletonBase<T extends SingletonBase<T>> {
  /**
   * Static map storing all singleton instances across all classes.
   * - Key: instance key (class name or custom key)
   * - Value: singleton instance
   * This is shared across all subclasses.
   */
  private static instances: Map<string, SingletonBase<any>> = new Map();

  /**
   * Get singleton instance for a specific class.
   *
   * Creates a new instance if one doesn't exist, otherwise returns the existing
   * instance. This is the main method for accessing singleton instances.
   *
   * @template T - The class type extending SingletonBase
   * @param constructor - The class constructor (e.g., MyService)
   * @param key - Optional custom key for multiple instances of same class (defaults to class name)
   * @returns T - The singleton instance with correct type
   *
   * @example
   * ```typescript
   * // Basic usage - one instance per class
   * const logger = SingletonBase.getInstance(Logger);
   *
   * // Multiple instances with different keys
   * const chart1 = SingletonBase.getInstance(ChartManager, 'chart-1');
   * const chart2 = SingletonBase.getInstance(ChartManager, 'chart-2');
   * ```
   *
   * @remarks
   * Thread Safety: This implementation is NOT thread-safe, but JavaScript is
   * single-threaded so this isn't an issue in normal browser/Node.js environments.
   */
  public static getInstance<T extends SingletonBase<T>>(
    constructor: new () => T,
    key: string = constructor.name,
  ): T {
    // Check if an instance already exists for this key
    if (!SingletonBase.instances.has(key)) {
      // No instance exists - create a new one using the constructor
      // The 'new constructor()' creates an instance of the subclass
      SingletonBase.instances.set(key, new constructor());
    }

    // Return the existing instance (guaranteed to exist now)
    // Cast to T because we know the instance is of the correct type
    return SingletonBase.instances.get(key) as T;
  }

  /**
   * Clear singleton instance (useful for testing and cleanup).
   *
   * Removes a singleton instance from the registry. If no key is provided,
   * clears ALL singleton instances. This is particularly useful in unit tests
   * where you need to reset state between tests.
   *
   * @param key - The key to clear, or undefined to clear all instances
   * @returns void
   *
   * @example
   * ```typescript
   * // Clear specific instance
   * SingletonBase.clearInstance('MyService');
   *
   * // Clear all instances (useful in test cleanup)
   * afterEach(() => {
   *   SingletonBase.clearInstance();
   * });
   * ```
   *
   * @remarks
   * Warning: Clearing an instance doesn't automatically clean up resources
   * held by the instance. If your singleton holds resources (timers, connections),
   * call cleanup methods before clearing the instance.
   */
  public static clearInstance(key?: string): void {
    if (key) {
      // Clear specific instance by key
      SingletonBase.instances.delete(key);
    } else {
      // Clear ALL instances (complete reset)
      SingletonBase.instances.clear();
    }
  }

  /**
   * Check if instance exists for a given key.
   *
   * Returns true if a singleton instance exists for the specified key,
   * false otherwise. Useful for conditional logic or debugging.
   *
   * @param key - The key to check
   * @returns boolean - true if instance exists, false otherwise
   *
   * @example
   * ```typescript
   * if (SingletonBase.hasInstance('MyService')) {
   *   console.log('Service already initialized');
   * } else {
   *   console.log('Service not yet created');
   * }
   * ```
   */
  public static hasInstance(key: string): boolean {
    return SingletonBase.instances.has(key);
  }

  /**
   * Get all instance keys (useful for debugging and monitoring).
   *
   * Returns an array of all keys for currently registered singleton instances.
   * This is helpful for debugging, logging, or understanding what singletons
   * are currently active in the system.
   *
   * @returns string[] - Array of all instance keys
   *
   * @example
   * ```typescript
   * const keys = SingletonBase.getInstanceKeys();
   * console.log('Active singletons:', keys);
   * // Output: ['Logger', 'ConfigService', 'chart-1', 'chart-2']
   * ```
   *
   * @remarks
   * Protected: This method is protected, so it's only accessible from subclasses
   * or via static calls on SingletonBase itself. This prevents external code
   * from inspecting the instance registry.
   */
  protected static getInstanceKeys(): string[] {
    // Convert Map keys to array using Array.from()
    return Array.from(SingletonBase.instances.keys());
  }

  /**
   * Get count of active singleton instances (useful for monitoring).
   *
   * Returns the total number of singleton instances currently registered.
   * Useful for monitoring, debugging, or detecting memory leaks.
   *
   * @returns number - Number of active singleton instances
   *
   * @example
   * ```typescript
   * console.log(`Active instances: ${SingletonBase.getInstanceCount()}`);
   *
   * // Monitor for memory leaks
   * if (SingletonBase.getInstanceCount() > 100) {
   *   console.warn('Too many singleton instances!');
   * }
   * ```
   */
  protected static getInstanceCount(): number {
    // Map.size returns the number of entries
    return SingletonBase.instances.size;
  }
}

// ============================================================================
// Singleton Decorator
// ============================================================================

/**
 * Decorator for automatic singleton implementation.
 *
 * This TypeScript decorator automatically adds getInstance(), clearInstance(),
 * and hasInstance() static methods to a class, making it a singleton without
 * requiring inheritance from SingletonBase.
 *
 * @param key - Optional custom key for the singleton instance (defaults to class name)
 * @returns ClassDecorator - The decorator function
 *
 * @example
 * ```typescript
 * @Singleton()
 * class ConfigService {
 *   private config: Record<string, any> = {};
 *
 *   set(key: string, value: any) {
 *     this.config[key] = value;
 *   }
 *
 *   get(key: string) {
 *     return this.config[key];
 *   }
 * }
 *
 * // Access singleton instance
 * const config = (ConfigService as any).getInstance();
 * config.set('apiUrl', 'https://api.example.com');
 * ```
 *
 * @example
 * ```typescript
 * // With custom key
 * @Singleton('main-logger')
 * class Logger {
 *   log(msg: string) { console.log(msg); }
 * }
 *
 * const logger = (Logger as any).getInstance();
 * ```
 *
 * @remarks
 * Type Casting: You need to cast to 'any' when calling getInstance() because
 * TypeScript decorators don't modify the class type signature. This is a
 * limitation of TypeScript decorators.
 *
 * Experimental: Decorators are still an experimental feature in TypeScript.
 * Make sure to enable "experimentalDecorators" in tsconfig.json.
 */
export function Singleton(key?: string) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    // Determine the instance key (custom key or class name)
    const instanceKey = key || constructor.name;

    // Add static getInstance method to the class
    // This allows calling: MyClass.getInstance()
    (constructor as any).getInstance = function () {
      return SingletonBase.getInstance(constructor, instanceKey);
    };

    // Add static clearInstance method to the class
    // This allows calling: MyClass.clearInstance()
    (constructor as any).clearInstance = function () {
      return SingletonBase.clearInstance(instanceKey);
    };

    // Add static hasInstance method to the class
    // This allows calling: MyClass.hasInstance()
    (constructor as any).hasInstance = function () {
      return SingletonBase.hasInstance(instanceKey);
    };

    // Return the modified constructor
    return constructor;
  };
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Factory function for creating singleton instances.
 *
 * This is a convenience function that wraps SingletonBase.getInstance() with
 * a simpler API. It's useful when you don't want to call the verbose
 * SingletonBase.getInstance() method.
 *
 * @template T - The type of the singleton instance
 * @param constructor - The class constructor (must extend SingletonBase)
 * @param key - Optional custom key for the singleton (defaults to class name)
 * @returns T - The singleton instance
 *
 * @example
 * ```typescript
 * class Logger extends SingletonBase<Logger> {
 *   log(msg: string) { console.log(msg); }
 * }
 *
 * // Shorter syntax using factory
 * const logger = createSingleton(Logger);
 * logger.log('Hello');
 *
 * // With custom key
 * const chartLogger = createSingleton(Logger, 'chart-logger');
 * ```
 *
 * @remarks
 * This function uses 'any' types internally because it needs to work with
 * the dynamic getInstance() mechanism. The return type is properly typed
 * as T, so consumers get full type safety.
 */
export function createSingleton<T>(constructor: any, key?: string): T {
  // Determine the instance key (custom key or class name)
  const instanceKey = key || constructor.name;

  // Use SingletonBase.getInstance to get or create the instance
  // Cast to 'any' because constructor type is 'any'
  // Final cast to T gives type safety to the caller
  return SingletonBase.getInstance(constructor as any, instanceKey) as any;
}
