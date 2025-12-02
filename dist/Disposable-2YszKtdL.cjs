"use strict";
const _KeyedSingletonManager = class _KeyedSingletonManager {
  /**
   * Get or create a singleton instance for a given key
   *
   * @param className - Class name for instance mapping
   * @param key - Unique identifier for the instance
   * @param factory - Factory function to create new instance if needed
   * @returns The singleton instance
   */
  static getOrCreateInstance(className, key, factory) {
    if (!_KeyedSingletonManager.instanceMaps.has(className)) {
      _KeyedSingletonManager.instanceMaps.set(className, /* @__PURE__ */ new Map());
    }
    const instanceMap = _KeyedSingletonManager.instanceMaps.get(className);
    if (!instanceMap) {
      throw new Error(`Failed to get instance map for class ${className}`);
    }
    if (!instanceMap.has(key)) {
      instanceMap.set(key, factory());
    }
    return instanceMap.get(key);
  }
  /**
   * Destroy a singleton instance for a given key
   *
   * @param className - Class name for instance mapping
   * @param key - Unique identifier for the instance
   */
  static destroyInstanceByKey(className, key) {
    const instanceMap = _KeyedSingletonManager.instanceMaps.get(className);
    if (instanceMap && instanceMap.has(key)) {
      const instance = instanceMap.get(key);
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
      instanceMap.delete(key);
    }
  }
  /**
   * Check if an instance exists for a given key
   *
   * @param className - Class name for instance mapping
   * @param key - Unique identifier to check
   * @returns True if instance exists
   */
  static hasInstanceWithKey(className, key) {
    const instanceMap = _KeyedSingletonManager.instanceMaps.get(className);
    return instanceMap ? instanceMap.has(key) : false;
  }
  /**
   * Get all instance keys for this class
   *
   * @param className - Class name for instance mapping
   * @returns Array of instance keys
   */
  static getInstanceKeys(className) {
    const instanceMap = _KeyedSingletonManager.instanceMaps.get(className);
    return instanceMap ? Array.from(instanceMap.keys()) : [];
  }
  /**
   * Clear all instances for this class
   *
   * @param className - Class name for instance mapping
   */
  static clearAllInstances(className) {
    const instanceMap = _KeyedSingletonManager.instanceMaps.get(className);
    if (instanceMap) {
      instanceMap.forEach((instance) => {
        if (instance && typeof instance.destroy === "function") {
          instance.destroy();
        }
      });
      instanceMap.clear();
    }
  }
};
_KeyedSingletonManager.instanceMaps = /* @__PURE__ */ new Map();
let KeyedSingletonManager = _KeyedSingletonManager;
function createInstanceKey(...parts) {
  return parts.map((part) => part === void 0 ? "default" : String(part)).join("-");
}
function cleanupInstance(instance, properties) {
  for (const prop of properties) {
    instance[prop] = null;
  }
}
exports.KeyedSingletonManager = KeyedSingletonManager;
exports.cleanupInstance = cleanupInstance;
exports.createInstanceKey = createInstanceKey;
//# sourceMappingURL=Disposable-2YszKtdL.cjs.map
