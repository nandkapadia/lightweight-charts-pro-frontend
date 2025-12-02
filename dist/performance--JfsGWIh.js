import { a as Singleton } from "./SingletonBase-MBQ3miuj.js";
function asLineWidth(value) {
  return value;
}
function asLineStyle(value) {
  return typeof value === "string" ? parseInt(value, 10) : value;
}
function asPriceLineSource(value) {
  return value;
}
function createSeriesOptions(options) {
  const converted = {};
  for (const [key, value] of Object.entries(options)) {
    switch (key) {
      case "lineWidth":
      case "priceLineWidth":
      case "baseLineWidth":
        converted[key] = asLineWidth(value);
        break;
      case "lineStyle":
      case "priceLineStyle":
      case "baseLineStyle":
        converted[key] = asLineStyle(value);
        break;
      case "priceLineSource":
        converted[key] = asPriceLineSource(value);
        break;
      default:
        converted[key] = value;
    }
  }
  return converted;
}
function safeSeriesOptions(options) {
  return options;
}
function validateData(data, config) {
  const errors = [];
  const warnings = [];
  if (config.required) {
    for (const field of config.required) {
      if (!(field in data) || data[field] === void 0) {
        errors.push(`Required field '${field}' is missing`);
      }
    }
  }
  if (config.numeric) {
    for (const field of config.numeric) {
      const value = data[field];
      if (value !== null && value !== void 0) {
        if (typeof value !== "number") {
          errors.push(`Field '${field}' must be a number, got ${typeof value}`);
        } else if (isNaN(value)) {
          errors.push(`Field '${field}' is NaN`);
        }
      }
    }
  }
  if (config.finite) {
    for (const field of config.finite) {
      const value = data[field];
      if (typeof value === "number" && !isFinite(value)) {
        errors.push(`Field '${field}' must be finite, got ${value}`);
      }
    }
  }
  if (config.nullable) {
    for (const field of config.nullable) {
      const value = data[field];
      if (value !== null && value !== void 0 && typeof value !== "number") {
        warnings.push(`Field '${field}' is expected to be numeric or null, got ${typeof value}`);
      }
    }
  }
  if (config.custom) {
    for (const { field, validator, message } of config.custom) {
      const value = data[field];
      if (!validator(value, data)) {
        errors.push(`Custom validation failed for '${field}': ${message}`);
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
function validateDataArray(dataArray, config) {
  return dataArray.map((data, index) => {
    const result = validateData(data, config);
    if (!result.isValid) {
      result.errors = result.errors.map((error) => `[${index}]: ${error}`);
    }
    return result;
  });
}
function filterValidData(dataArray, config) {
  return dataArray.filter((data, _index) => {
    const result = validateData(data, config);
    if (!result.isValid) {
      return false;
    }
    return true;
  });
}
const ValidationConfigs = {
  /** Configuration for ribbon data (upper, lower values) */
  ribbon: {
    required: ["time", "upper", "lower"],
    numeric: ["upper", "lower"],
    finite: ["upper", "lower"]
  },
  /** Configuration for band data (upper, middle, lower values) */
  band: {
    required: ["time", "upper", "middle", "lower"],
    numeric: ["upper", "middle", "lower"],
    finite: ["upper", "middle", "lower"]
  },
  /** Configuration for gradient ribbon data */
  gradientRibbon: {
    required: ["time", "upper", "lower"],
    numeric: ["upper", "lower"],
    finite: ["upper", "lower"],
    optional: ["fillColor"],
    custom: [
      {
        field: "fillColor",
        validator: (value) => value === void 0 || typeof value === "string",
        message: "fillColor must be a string or undefined"
      }
    ]
  },
  /** Configuration for single value data */
  singleValue: {
    required: ["time", "value"],
    numeric: ["value"],
    finite: ["value"]
  },
  /** Configuration for OHLC data */
  ohlc: {
    required: ["time", "open", "high", "low", "close"],
    numeric: ["open", "high", "low", "close"],
    finite: ["open", "high", "low", "close"],
    custom: [
      {
        field: "high",
        validator: (value, data) => value >= Math.max(data.open, data.close),
        message: "high must be >= max(open, close)"
      },
      {
        field: "low",
        validator: (value, data) => value <= Math.min(data.open, data.close),
        message: "low must be <= min(open, close)"
      }
    ]
  }
};
const QuickValidators = {
  /** Check if value is a valid number */
  isNumber: (value) => typeof value === "number" && !isNaN(value) && isFinite(value),
  /** Check if value is a valid finite number */
  isFiniteNumber: (value) => typeof value === "number" && isFinite(value),
  /** Check if value is null or valid number */
  isNumberOrNull: (value) => value === null || QuickValidators.isNumber(value),
  /** Check if value is undefined or valid number */
  isNumberOrUndefined: (value) => value === void 0 || QuickValidators.isNumber(value),
  /** Check if all values in object are valid numbers */
  areAllNumbers: (data, keys) => {
    return keys.every((key) => QuickValidators.isNumber(data[key]));
  },
  /** Check if all values in object are finite numbers */
  areAllFiniteNumbers: (data, keys) => {
    return keys.every((key) => QuickValidators.isFiniteNumber(data[key]));
  }
};
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata, fns) => ({ kind: __decoratorStrings[kind], name, metadata, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) fns[i].call(self);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var it, done, ctx, k = flags & 7, p = false;
  var j = 0;
  var extraInitializers = array[j] || (array[j] = []);
  var desc = k && (target = target.prototype, k < 5 && (k > 3 || !p) && __getOwnPropDesc(target, name));
  __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    it = (0, decorators[i])(target, ctx), done._ = 1;
    __expectFn(it) && (target = it);
  }
  return __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var _PerformanceMonitor_decorators, _init;
const isDevelopment = process.env.NODE_ENV === "development";
const perfLog = {
  log: (..._) => {
  },
  warn: (..._) => {
  },
  error: (..._) => {
  }
};
function perfLogFn(_operationName, fn) {
  const result = fn();
  return result;
}
function deepCompare(objA, objB) {
  if (objA === objB) return true;
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    const valA = objA[key];
    const valB = objB[key];
    if (typeof valA === "object" && typeof valB === "object") {
      if (!deepCompare(valA, valB)) return false;
    } else if (valA !== valB) {
      return false;
    }
  }
  return true;
}
const domQueryCache = /* @__PURE__ */ new Map();
function getCachedDOMElement(selector) {
  if (domQueryCache.has(selector)) {
    return domQueryCache.get(selector) || null;
  }
  const element = document.querySelector(selector);
  domQueryCache.set(selector, element);
  setTimeout(() => {
    domQueryCache.delete(selector);
  }, 5e3);
  return element;
}
function getCachedDOMElementForTesting(id, cache, createFn) {
  if (cache.has(id)) {
    return cache.get(id) || null;
  }
  if (!createFn || typeof createFn !== "function") {
    return null;
  }
  const element = createFn(id);
  if (element) {
    cache.set(id, element);
  }
  return element;
}
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(..._args) {
    if (!inThrottle) {
      func(..._args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
class LRUCache {
  constructor(maxSize = 100) {
    this.cache = /* @__PURE__ */ new Map();
    this.maxSize = maxSize;
  }
  get(key) {
    if (!this.cache.has(key)) {
      return void 0;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  has(key) {
    return this.cache.has(key);
  }
  clear() {
    this.cache.clear();
  }
  get size() {
    return this.cache.size;
  }
}
function memoize(func, resolver, maxCacheSize = 100) {
  const cache = new LRUCache(maxCacheSize);
  return ((..._args) => {
    const key = resolver ? resolver(..._args) : JSON.stringify(_args);
    const cached = cache.get(key);
    if (cached !== void 0) {
      return cached;
    }
    const result = func(..._args);
    cache.set(key, result);
    return result;
  });
}
function batchDOMUpdates(updates) {
  if (typeof window !== "undefined") {
    requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  } else {
    updates.forEach((update) => update());
  }
}
const getCachedDimensions = memoize(
  (element) => {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    };
  },
  (element) => `${element.offsetWidth}-${element.offsetHeight}`
);
_PerformanceMonitor_decorators = [Singleton()];
class PerformanceMonitor {
  constructor() {
    this.metrics = /* @__PURE__ */ new Map();
  }
  startTimer(name) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      const metrics = this.metrics.get(name);
      if (metrics) {
        metrics.push(duration);
      }
      if (isDevelopment && duration > 16) {
        perfLog.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  getMetrics(name) {
    const result = {};
    if (name) {
      const values = this.metrics.get(name);
      if (values && values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    } else {
      this.metrics.forEach((values, key) => {
        if (values.length > 0) {
          result[key] = {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      });
    }
    return result;
  }
  clearMetrics() {
    this.metrics.clear();
  }
}
_init = __decoratorStart();
PerformanceMonitor = __decorateElement(_init, 0, "PerformanceMonitor", _PerformanceMonitor_decorators, PerformanceMonitor);
__runInitializers(_init, 1, PerformanceMonitor);
const createOptimizedStylesAdvanced = memoize(
  (width, height, shouldAutoSize, chartOptions = {}) => {
    return {
      container: {
        position: "relative",
        border: "none",
        borderRadius: "0px",
        padding: "0px",
        width: shouldAutoSize || width === null ? "100%" : typeof width === "number" ? `${width}px` : "100%",
        height: shouldAutoSize ? "100%" : typeof height === "number" ? `${height}px` : "100%",
        minWidth: chartOptions.minWidth || (shouldAutoSize ? 200 : void 0),
        minHeight: chartOptions.minHeight || (shouldAutoSize ? 200 : void 0),
        maxWidth: chartOptions.maxWidth,
        maxHeight: chartOptions.maxHeight
      },
      chartContainer: {
        width: shouldAutoSize || width === null ? "100%" : typeof width === "number" ? `${width}px` : "100%",
        height: shouldAutoSize ? "100%" : typeof height === "number" ? `${height}px` : "100%",
        position: "relative"
      }
    };
  },
  (width, height, shouldAutoSize, chartOptions) => `${width}-${height}-${shouldAutoSize}-${JSON.stringify(chartOptions)}`
);
export {
  QuickValidators as Q,
  ValidationConfigs as V,
  getCachedDOMElementForTesting as a,
  batchDOMUpdates as b,
  getCachedDimensions as c,
  deepCompare as d,
  asLineWidth as e,
  asLineStyle as f,
  getCachedDOMElement as g,
  asPriceLineSource as h,
  createSeriesOptions as i,
  validateDataArray as j,
  filterValidData as k,
  createOptimizedStylesAdvanced as l,
  memoize as m,
  perfLogFn as p,
  safeSeriesOptions as s,
  throttle as t,
  validateData as v
};
//# sourceMappingURL=performance--JfsGWIh.js.map
