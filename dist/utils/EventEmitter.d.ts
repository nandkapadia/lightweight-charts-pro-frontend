/**
 * @fileoverview Browser-Compatible Event Emitter Implementation
 *
 * This module provides a lightweight event emitter that works in browser environments
 * without depending on Node.js's 'events' module. It implements the core EventEmitter
 * API pattern for pub-sub (publish-subscribe) functionality.
 *
 * Key Features:
 * - Add/remove event listeners with .on() and .off()
 * - One-time listeners with .once()
 * - Event emission with .emit()
 * - Listener introspection
 * - Error handling for listener execution
 * - Browser-compatible (no Node.js dependencies)
 *
 * Architecture:
 * - Uses Map for O(1) event lookup
 * - Each event name maps to an array of listener functions
 * - Listeners are executed in the order they were registered
 * - Errors in one listener don't affect others
 *
 * @example
 * ```typescript
 * const emitter = new EventEmitter();
 *
 * // Subscribe to an event
 * emitter.on('data', (value) => console.log('Got data:', value));
 *
 * // Subscribe once
 * emitter.once('connect', () => console.log('Connected!'));
 *
 * // Emit an event
 * emitter.emit('data', { id: 1, value: 42 });
 * ```
 */
/**
 * Type definition for event listener functions.
 *
 * Event listeners can accept any number of arguments of any type and don't
 * return a value (void). This flexibility allows the EventEmitter to work
 * with any kind of event payload.
 *
 * @param args - Variable number of arguments passed when event is emitted
 * @returns void - Listeners don't return values
 */
type EventListener = (...args: any[]) => void;
/**
 * Browser-compatible event emitter for publish-subscribe patterns.
 *
 * This class provides a simple implementation of the EventEmitter pattern
 * commonly used in Node.js, but without requiring Node.js dependencies.
 * It's suitable for use in browser environments where you need event-driven
 * communication between components.
 *
 * @remarks
 * This implementation stores event listeners in a Map where:
 * - Keys are event names (strings)
 * - Values are arrays of listener functions
 *
 * The class is designed to be memory-efficient by:
 * - Removing empty listener arrays when the last listener is removed
 * - Providing methods to clean up all listeners
 * - Not storing metadata unless necessary
 *
 * @example
 * ```typescript
 * const emitter = new EventEmitter();
 *
 * // Add a listener
 * const handler = (data) => console.log('Received:', data);
 * emitter.on('message', handler);
 *
 * // Emit event
 * emitter.emit('message', { text: 'Hello' });
 *
 * // Remove listener
 * emitter.off('message', handler);
 * ```
 */
export declare class EventEmitter {
    /**
     * Internal storage for event listeners.
     * Maps event names to arrays of listener functions.
     * Using Map provides O(1) lookup time for events.
     */
    private events;
    /**
     * Maximum number of listeners per event (for Node.js API compatibility).
     * Note: This implementation doesn't enforce the limit, it's just stored
     * for API compatibility with Node.js EventEmitter.
     */
    private maxListeners;
    /**
     * Add an event listener for the specified event.
     *
     * Registers a function to be called every time the specified event is emitted.
     * The listener will remain active until explicitly removed with .off() or
     * .removeAllListeners().
     *
     * @param event - The name of the event to listen for
     * @param listener - The function to call when the event is emitted
     * @returns this - Returns the EventEmitter instance for method chaining
     *
     * @example
     * ```typescript
     * emitter.on('data', (value) => {
     *   console.log('Received:', value);
     * });
     *
     * // Method chaining
     * emitter
     *   .on('start', () => console.log('Starting'))
     *   .on('end', () => console.log('Ending'));
     * ```
     */
    on(event: string, listener: EventListener): this;
    /**
     * Add a one-time event listener for the specified event.
     *
     * Registers a function that will be called only the first time the event is emitted,
     * then automatically removes itself. This is useful for events that should only be
     * handled once (e.g., 'connect', 'ready', 'error').
     *
     * @param event - The name of the event to listen for
     * @param listener - The function to call when the event is emitted (called only once)
     * @returns this - Returns the EventEmitter instance for method chaining
     *
     * @example
     * ```typescript
     * // This will only log the first time 'ready' is emitted
     * emitter.once('ready', () => {
     *   console.log('System ready!');
     * });
     *
     * emitter.emit('ready'); // Logs "System ready!"
     * emitter.emit('ready'); // Does nothing (listener removed)
     * ```
     */
    once(event: string, listener: EventListener): this;
    /**
     * Remove a specific event listener for the specified event.
     *
     * Unregisters a previously added listener function. If the listener was added
     * multiple times, this removes only one instance. If no listeners remain for
     * an event after removal, the event entry is cleaned up from memory.
     *
     * @param event - The name of the event
     * @param listener - The exact listener function to remove (must be same reference)
     * @returns this - Returns the EventEmitter instance for method chaining
     *
     * @example
     * ```typescript
     * const handler = (data) => console.log(data);
     *
     * emitter.on('data', handler);
     * emitter.emit('data', 'Hello'); // Logs "Hello"
     *
     * emitter.off('data', handler);
     * emitter.emit('data', 'World'); // Does nothing (listener removed)
     * ```
     *
     * @remarks
     * Important: You must pass the exact same function reference that was used with .on().
     * Arrow functions or inline functions can't be removed unless you save a reference.
     */
    off(event: string, listener: EventListener): this;
    /**
     * Remove all listeners for a specific event, or all listeners for all events.
     *
     * If an event name is provided, removes all listeners for that specific event.
     * If no event name is provided, removes all listeners for all events (complete reset).
     *
     * @param event - Optional event name. If omitted, all listeners are removed
     * @returns this - Returns the EventEmitter instance for method chaining
     *
     * @example
     * ```typescript
     * // Remove all listeners for 'data' event
     * emitter.removeAllListeners('data');
     *
     * // Remove all listeners for all events (reset everything)
     * emitter.removeAllListeners();
     * ```
     *
     * @remarks
     * This is useful for cleanup when destroying components or resetting state.
     * Be careful when calling without arguments - it removes ALL listeners!
     */
    removeAllListeners(event?: string): this;
    /**
     * Emit an event, calling all registered listeners with the provided arguments.
     *
     * Synchronously calls all listeners registered for the event, in the order they
     * were registered. If a listener throws an error, the error is logged to the
     * console but doesn't prevent other listeners from executing.
     *
     * @param event - The name of the event to emit
     * @param args - Variable number of arguments to pass to each listener
     * @returns boolean - true if the event had listeners, false if no listeners
     *
     * @example
     * ```typescript
     * // Emit event with single argument
     * emitter.emit('data', { value: 42 });
     *
     * // Emit event with multiple arguments
     * emitter.emit('update', 'user', 123, { name: 'John' });
     *
     * // Check if event had listeners
     * const hadListeners = emitter.emit('custom-event');
     * if (!hadListeners) {
     *   console.log('No one was listening');
     * }
     * ```
     *
     * @remarks
     * Error Handling: If a listener throws an error, it's caught and logged to the
     * console, but execution continues with the next listener. This prevents one
     * broken listener from breaking all others.
     */
    emit(event: string, ...args: any[]): boolean;
    /**
     * Get the number of listeners registered for a specific event.
     *
     * Returns the count of listener functions currently registered for the event.
     * Useful for debugging or for checking if an event has any listeners before emitting.
     *
     * @param event - The name of the event
     * @returns number - The number of listeners (0 if no listeners)
     *
     * @example
     * ```typescript
     * emitter.on('data', handler1);
     * emitter.on('data', handler2);
     *
     * console.log(emitter.listenerCount('data')); // 2
     * console.log(emitter.listenerCount('unknown')); // 0
     * ```
     */
    listenerCount(event: string): number;
    /**
     * Get a copy of the array of listeners for a specific event.
     *
     * Returns a shallow copy of the listeners array to prevent external modifications
     * to the internal listener storage. Returns an empty array if no listeners exist.
     *
     * @param event - The name of the event
     * @returns EventListener[] - Array of listener functions (may be empty)
     *
     * @example
     * ```typescript
     * const dataListeners = emitter.listeners('data');
     * console.log(`Found ${dataListeners.length} listeners`);
     *
     * // Safe to modify - doesn't affect internal storage
     * dataListeners.push(() => {}); // Doesn't add to emitter
     * ```
     *
     * @remarks
     * This returns a copy (using .slice()) to prevent callers from directly
     * modifying the internal listeners array. This maintains encapsulation.
     */
    listeners(event: string): EventListener[];
    /**
     * Set the maximum number of listeners (Node.js API compatibility).
     *
     * This method exists for API compatibility with Node.js EventEmitter but doesn't
     * enforce the limit in this implementation. In Node.js, this would warn when the
     * limit is exceeded to help detect memory leaks.
     *
     * @param n - The maximum number of listeners (not enforced in this implementation)
     * @returns this - Returns the EventEmitter instance for method chaining
     *
     * @example
     * ```typescript
     * emitter.setMaxListeners(20); // Stores value but doesn't enforce limit
     * ```
     *
     * @remarks
     * This is a no-op (no operation) in this implementation. It's provided only
     * for API compatibility with Node.js EventEmitter. The value is stored but
     * never checked or enforced.
     */
    setMaxListeners(n: number): this;
    /**
     * Get the maximum number of listeners limit.
     *
     * Returns the max listeners value that was set with setMaxListeners().
     * This exists for Node.js API compatibility.
     *
     * @returns number - The maximum listeners limit (default: 10)
     *
     * @example
     * ```typescript
     * console.log(emitter.getMaxListeners()); // 10 (default)
     * emitter.setMaxListeners(20);
     * console.log(emitter.getMaxListeners()); // 20
     * ```
     */
    getMaxListeners(): number;
}
export {};
//# sourceMappingURL=EventEmitter.d.ts.map