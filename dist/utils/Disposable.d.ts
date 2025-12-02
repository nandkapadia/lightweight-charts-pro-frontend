/**
 * @fileoverview Disposable utilities for resource cleanup
 *
 * Provides interfaces and utilities for safely disposing objects and
 * nullifying instance properties during cleanup.
 */
/**
 * Interface for objects that can be disposed/cleaned up
 */
export interface Disposable {
    destroy(): void;
}
/**
 * Utility to safely nullify instance properties during cleanup
 * @param instance - The instance to clean up
 * @param properties - Property names to set to null (accepts private property names)
 */
export declare function cleanupInstance<T extends object>(instance: T, properties: string[]): void;
//# sourceMappingURL=Disposable.d.ts.map