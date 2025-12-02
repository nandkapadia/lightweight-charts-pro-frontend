"use strict";
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
class ResizeObserverManager {
  constructor() {
    this.observers = /* @__PURE__ */ new Map();
    this.callbacks = /* @__PURE__ */ new Map();
    this.timeouts = /* @__PURE__ */ new Map();
    this.targets = /* @__PURE__ */ new Map();
  }
  /**
   * Add a resize observer for a specific target
   */
  addObserver(id, target, callback, options = {}) {
    this.removeObserver(id);
    const { throttleMs = 100, debounceMs = 0 } = options;
    let lastCallTime = 0;
    const wrappedCallback = (entry) => {
      const now = Date.now();
      if (throttleMs > 0 && now - lastCallTime < throttleMs) {
        return;
      }
      lastCallTime = now;
      if (debounceMs > 0) {
        const existingTimeout = this.timeouts.get(id);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        const timeoutId = setTimeout(() => {
          callback(entry);
          this.timeouts.delete(id);
        }, debounceMs);
        this.timeouts.set(id, timeoutId);
      } else {
        callback(entry);
      }
    };
    try {
      const observer = new ResizeObserver((entries) => {
        if (entries.length === 1) {
          wrappedCallback(entries[0]);
        } else {
          entries.forEach(wrappedCallback);
        }
      });
      observer.observe(target);
      this.observers.set(id, observer);
      this.callbacks.set(id, callback);
      this.targets.set(id, target);
    } catch (error) {
      SingletonBase.logger.error("ResizeObserver operation failed", "ResizeObserverManager", error);
    }
  }
  /**
   * Remove a specific observer
   */
  removeObserver(id) {
    const observer = this.observers.get(id);
    if (observer) {
      try {
        observer.disconnect();
        this.observers.delete(id);
        this.callbacks.delete(id);
        this.targets.delete(id);
        const timeout = this.timeouts.get(id);
        if (timeout) {
          clearTimeout(timeout);
          this.timeouts.delete(id);
        }
      } catch (error) {
        SingletonBase.logger.error("ResizeObserver operation failed", "ResizeObserverManager", error);
      }
    }
  }
  /**
   * Check if an observer exists
   */
  hasObserver(id) {
    return this.observers.has(id);
  }
  /**
   * Get the number of active observers
   */
  getObserverCount() {
    return this.observers.size;
  }
  /**
   * Cleanup all observers
   */
  cleanup() {
    this.observers.forEach((observer, id) => {
      try {
        observer.disconnect();
      } catch (error) {
        SingletonBase.logger.debug(
          `Failed to disconnect observer ${id}: ${error instanceof Error ? error.message : "Unknown error"}`,
          "ResizeObserverManager"
        );
      }
    });
    this.timeouts.forEach((timeout, id) => {
      try {
        clearTimeout(timeout);
      } catch (error) {
        SingletonBase.logger.debug(
          `Failed to clear timeout for ${id}: ${error instanceof Error ? error.message : "Unknown error"}`,
          "ResizeObserverManager"
        );
      }
    });
    this.observers.clear();
    this.callbacks.clear();
    this.timeouts.clear();
    this.targets.clear();
  }
  /**
   * Get all observer IDs
   */
  getObserverIds() {
    return Array.from(this.observers.keys());
  }
  /**
   * Pause all observers temporarily.
   *
   * Note: This unobserves all targets but keeps the observers in the map.
   * After calling pauseAll(), you must call resumeAll() to re-observe targets.
   */
  pauseAll() {
    this.observers.forEach((observer, id) => {
      try {
        observer.disconnect();
      } catch (error) {
        SingletonBase.logger.debug(
          `Failed to pause observer ${id}: ${error instanceof Error ? error.message : "Unknown error"}`,
          "ResizeObserverManager"
        );
      }
    });
  }
  /**
   * Resume all observers after pauseAll().
   *
   * Re-observes all stored targets with their respective observers.
   */
  resumeAll() {
    this.observers.forEach((observer, id) => {
      const target = this.targets.get(id);
      if (target) {
        try {
          observer.observe(target);
        } catch (error) {
          SingletonBase.logger.debug(
            `Failed to resume observer ${id}, recreating: ${error instanceof Error ? error.message : "Unknown error"}`,
            "ResizeObserverManager"
          );
          const callback = this.callbacks.get(id);
          if (callback) {
            try {
              const newObserver = new ResizeObserver((entries) => {
                if (entries.length === 1) {
                  callback(entries[0]);
                } else {
                  callback(entries);
                }
              });
              newObserver.observe(target);
              this.observers.set(id, newObserver);
            } catch (recreateError) {
              SingletonBase.logger.error(
                `Failed to recreate observer ${id}: ${recreateError instanceof Error ? recreateError.message : "Unknown error"}`,
                "ResizeObserverManager"
              );
            }
          }
        }
      }
    });
  }
}
exports.ResizeObserverManager = ResizeObserverManager;
//# sourceMappingURL=resizeObserverManager-Dwxf8nkG.cjs.map
