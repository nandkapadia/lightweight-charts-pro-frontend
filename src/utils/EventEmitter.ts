/**
 * Simple browser-compatible EventEmitter
 *
 * Provides basic event emitter functionality without depending on Node.js 'events' module.
 * Suitable for use in browser environments.
 */

type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventListener[]> = new Map();
  private maxListeners: number = 10;

  /**
   * Add an event listener
   * @param event Event name
   * @param listener Listener function
   */
  on(event: string, listener: EventListener): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return this;
  }

  /**
   * Add a one-time event listener
   * @param event Event name
   * @param listener Listener function
   */
  once(event: string, listener: EventListener): this {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
    return this;
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param listener Listener function
   */
  off(event: string, listener: EventListener): this {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }

  /**
   * Remove all listeners for an event
   * @param event Event name (optional - if not provided, removes all listeners)
   */
  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  /**
   * Emit an event
   * @param event Event name
   * @param args Arguments to pass to listeners
   */
  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error);
        }
      });
      return true;
    }
    return false;
  }

  /**
   * Get the number of listeners for an event
   * @param event Event name
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.length ?? 0;
  }

  /**
   * Get all listeners for an event
   * @param event Event name
   */
  listeners(event: string): EventListener[] {
    return this.events.get(event)?.slice() ?? [];
  }

  /**
   * Set the maximum number of listeners (for Node.js compatibility)
   * Note: This is a no-op in this implementation, just for API compatibility
   * @param n Maximum number of listeners
   */
  setMaxListeners(n: number): this {
    this.maxListeners = n;
    return this;
  }

  /**
   * Get the maximum number of listeners
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }
}
