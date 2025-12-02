/**
 * Simple browser-compatible EventEmitter
 *
 * Provides basic event emitter functionality without depending on Node.js 'events' module.
 * Suitable for use in browser environments.
 */
type EventListener = (...args: any[]) => void;
export declare class EventEmitter {
    private events;
    private maxListeners;
    /**
     * Add an event listener
     * @param event Event name
     * @param listener Listener function
     */
    on(event: string, listener: EventListener): this;
    /**
     * Add a one-time event listener
     * @param event Event name
     * @param listener Listener function
     */
    once(event: string, listener: EventListener): this;
    /**
     * Remove an event listener
     * @param event Event name
     * @param listener Listener function
     */
    off(event: string, listener: EventListener): this;
    /**
     * Remove all listeners for an event
     * @param event Event name (optional - if not provided, removes all listeners)
     */
    removeAllListeners(event?: string): this;
    /**
     * Emit an event
     * @param event Event name
     * @param args Arguments to pass to listeners
     */
    emit(event: string, ...args: any[]): boolean;
    /**
     * Get the number of listeners for an event
     * @param event Event name
     */
    listenerCount(event: string): number;
    /**
     * Get all listeners for an event
     * @param event Event name
     */
    listeners(event: string): EventListener[];
    /**
     * Set the maximum number of listeners (for Node.js compatibility)
     * Note: This is a no-op in this implementation, just for API compatibility
     * @param n Maximum number of listeners
     */
    setMaxListeners(n: number): this;
    /**
     * Get the maximum number of listeners
     */
    getMaxListeners(): number;
}
export {};
//# sourceMappingURL=EventEmitter.d.ts.map