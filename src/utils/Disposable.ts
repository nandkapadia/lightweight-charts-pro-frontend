/**
 * @fileoverview Disposable Pattern for Resource Management
 *
 * This module provides utilities for implementing the Disposable pattern, which ensures
 * proper cleanup of resources when objects are no longer needed. This pattern is crucial
 * for preventing memory leaks in long-running applications.
 *
 * Key Concepts:
 * - Disposable Interface: Contract for objects that can be cleaned up
 * - Property Cleanup: Utility to safely nullify properties during disposal
 * - Memory Management: Helps prevent memory leaks by breaking circular references
 *
 * Use Cases:
 * - Event listener cleanup
 * - Timer/interval cleanup
 * - Chart instance cleanup
 * - Subscription management
 * - Breaking circular references
 *
 * @example
 * ```typescript
 * class ChartManager implements Disposable {
 *   private chart: IChartApi;
 *   private subscription: Subscription;
 *
 *   destroy(): void {
 *     this.subscription.unsubscribe();
 *     this.chart.remove();
 *     cleanupInstance(this, ['chart', 'subscription']);
 *   }
 * }
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Interface for objects that can be disposed/cleaned up.
 *
 * Implementing this interface signals that an object holds resources that need
 * to be explicitly released. This is similar to IDisposable in C# or Closeable
 * in Java.
 *
 * @remarks
 * Best Practices:
 * - Always call destroy() when you're done with an object
 * - Make destroy() idempotent (safe to call multiple times)
 * - Clean up in reverse order of creation
 * - Nullify references to help garbage collection
 * - Don't throw errors from destroy() - log them instead
 *
 * @example
 * ```typescript
 * class EventManager implements Disposable {
 *   private listeners: Map<string, Function[]> = new Map();
 *
 *   destroy(): void {
 *     // Remove all event listeners
 *     this.listeners.forEach((listeners, event) => {
 *       listeners.forEach(listener => {
 *         removeEventListener(event, listener);
 *       });
 *     });
 *
 *     // Clear the map
 *     this.listeners.clear();
 *
 *     // Nullify the reference (helps GC)
 *     cleanupInstance(this, ['listeners']);
 *   }
 * }
 * ```
 */
export interface Disposable {
  /**
   * Cleanup method to release resources and break references.
   *
   * This method should:
   * 1. Remove event listeners
   * 2. Cancel pending operations (timers, requests)
   * 3. Release external resources (DOM elements, API connections)
   * 4. Nullify references to other objects
   * 5. Be safe to call multiple times (idempotent)
   *
   * @returns void
   *
   * @example
   * ```typescript
   * const manager = new ChartManager();
   * // ... use the manager ...
   * manager.destroy(); // Clean up when done
   * ```
   */
  destroy(): void;
}

// ============================================================================
// Cleanup Utilities
// ============================================================================

/**
 * Utility to safely nullify instance properties during cleanup.
 *
 * This function sets specified properties of an object to null, which helps
 * the garbage collector by breaking circular references. This is especially
 * important for objects that reference DOM elements or other large objects.
 *
 * @param instance - The object instance to clean up
 * @param properties - Array of property names to set to null (can include private properties)
 * @returns void
 *
 * @example
 * ```typescript
 * class ChartComponent implements Disposable {
 *   private chart: IChartApi;
 *   private container: HTMLElement;
 *   private data: any[];
 *
 *   destroy(): void {
 *     // First, do specific cleanup
 *     this.chart.remove();
 *     this.container.innerHTML = '';
 *
 *     // Then nullify all references to help garbage collection
 *     cleanupInstance(this, ['chart', 'container', 'data']);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * class ServiceManager implements Disposable {
 *   private services: Map<string, Service>;
 *   private config: Config;
 *
 *   destroy(): void {
 *     // Clean up each service
 *     this.services.forEach(service => service.destroy());
 *     this.services.clear();
 *
 *     // Nullify properties
 *     cleanupInstance(this, ['services', 'config']);
 *   }
 * }
 * ```
 *
 * @remarks
 * Why Nullify Properties?
 * - Breaks circular references that prevent garbage collection
 * - Makes it obvious if code tries to use a destroyed object
 * - Helps identify use-after-destroy bugs during development
 * - Reduces memory footprint of destroyed objects
 *
 * This function works with private properties because it uses type casting
 * to bypass TypeScript's access modifiers. The property names are provided
 * as strings to allow cleaning up private members.
 */
export function cleanupInstance<T extends object>(
  instance: T,
  properties: string[],
): void {
  // Loop through each property name provided
  for (const prop of properties) {
    // Cast the instance to a Record type to allow setting properties by string key
    // This bypasses TypeScript's type checking and allows us to set private properties
    // Setting to null helps the garbage collector by breaking references
    (instance as Record<string, unknown>)[prop] = null;
  }
}
