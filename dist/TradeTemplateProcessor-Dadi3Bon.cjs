"use strict";
const SingletonBase = require("./SingletonBase-BygEKI3I.cjs");
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
var _TemplateEngine_decorators, _init;
_TemplateEngine_decorators = [SingletonBase.Singleton()];
const _TemplateEngine = class _TemplateEngine {
  /**
   * Private constructor (Singleton pattern)
   *
   * @private
   */
  constructor() {
  }
  /**
   * Process HTML template with placeholder replacement
   *
   * Replaces all $$placeholder$$ tokens in the template with values from
   * the provided context. Supports chart data, custom data, and formatting
   * options. Returns comprehensive result with processed content and errors.
   *
   * Processing order:
   * 1. Check if processing is enabled
   * 2. Extract all placeholders from template
   * 3. For each placeholder, resolve value from context
   * 4. Apply formatting (precision, HTML escaping)
   * 5. Replace placeholder with formatted value
   * 6. Return result with processed content and metadata
   *
   * @public
   * @param {string} template - HTML template with $$placeholder$$ syntax
   * @param {TemplateContext} [context={}] - Data context for replacement
   * @param {TemplateOptions} [options={}] - Processing options
   * @returns {TemplateResult} Result with content, placeholders, and errors
   *
   * @example
   * ```typescript
   * const result = engine.processTemplate(
   *   '<span>$$title$$: $$value$$</span>',
   *   {
   *     seriesData: { value: 123.45 },
   *     customData: { title: 'Price' },
   *     formatting: { precision: 2 }
   *   },
   *   { strict: true }
   * );
   *
   * console.log(result.content); // '<span>Price: 123.45</span>'
   * console.log(result.processedPlaceholders); // ['title', 'value']
   * ```
   */
  processTemplate(template, context = {}, options = {}) {
    const result = {
      content: template,
      processedPlaceholders: [],
      missingPlaceholders: [],
      hasErrors: false,
      errors: []
    };
    if (options.processPlaceholders === false) {
      return result;
    }
    try {
      const placeholderRegex = /\$\$([a-zA-Z_][a-zA-Z0-9_]*)\$\$/g;
      const placeholders = [...template.matchAll(placeholderRegex)];
      for (const match of placeholders) {
        const fullPlaceholder = match[0];
        const placeholderKey = match[1];
        try {
          const value = this.extractPlaceholderValue(placeholderKey, context);
          if (value !== null && value !== void 0) {
            const formattedValue = this.formatValue(value, placeholderKey, context.formatting);
            result.content = result.content.replace(
              new RegExp(this.escapeRegex(fullPlaceholder), "g"),
              options.escapeHtml ? this.escapeHtml(formattedValue) : formattedValue
            );
            result.processedPlaceholders.push(fullPlaceholder);
          } else {
            const defaultValue = options.defaultValue || "";
            result.content = result.content.replace(
              new RegExp(this.escapeRegex(fullPlaceholder), "g"),
              defaultValue
            );
            result.missingPlaceholders.push(fullPlaceholder);
            if (options.strict) {
              throw new Error(`Missing data for placeholder: ${fullPlaceholder}`);
            }
          }
        } catch (error) {
          result.hasErrors = true;
          result.errors.push(`Error processing ${fullPlaceholder}: ${error}`);
          if (options.strict) {
            throw error;
          }
        }
      }
    } catch (error) {
      result.hasErrors = true;
      result.errors.push(`Template processing error: ${error}`);
      if (options.strict) {
        throw error;
      }
    }
    return result;
  }
  /**
   * Extract value for a specific placeholder key
   */
  extractPlaceholderValue(key, context) {
    const { seriesData, customData } = context;
    if (customData && Object.prototype.hasOwnProperty.call(customData, key)) {
      return customData[key];
    }
    if (seriesData) {
      const typedSeriesData = seriesData;
      switch (key) {
        case "value":
          return this.extractSmartValue(typedSeriesData);
        case "open":
          return typedSeriesData.open;
        case "high":
          return typedSeriesData.high;
        case "low":
          return typedSeriesData.low;
        case "close":
          return typedSeriesData.close;
        case "upper":
          return typedSeriesData.upper;
        case "middle":
          return typedSeriesData.middle;
        case "lower":
          return typedSeriesData.lower;
        case "volume":
          return typedSeriesData.volume;
        case "time":
          return typedSeriesData.time;
        default:
          if (Object.prototype.hasOwnProperty.call(typedSeriesData, key)) {
            return typedSeriesData[key];
          }
      }
    }
    return null;
  }
  /**
   * Smart value extraction for $$value$$ placeholder
   * Falls back through different value types based on series data structure
   */
  extractSmartValue(seriesData) {
    if (seriesData.close !== void 0) {
      return seriesData.close;
    }
    if (seriesData.value !== void 0) {
      return seriesData.value;
    }
    if (seriesData.middle !== void 0) {
      return seriesData.middle;
    }
    if (seriesData.upper !== void 0 && seriesData.lower !== void 0) {
      return (seriesData.upper + seriesData.lower) / 2;
    }
    if (seriesData.high !== void 0) {
      return seriesData.high;
    }
    return null;
  }
  /**
   * Format value according to type and formatting options
   */
  formatValue(value, key, formatting) {
    if (value === null || value === void 0) {
      return "";
    }
    if (key === "time") {
      return this.formatTime(value, formatting?.timeFormat);
    }
    if (typeof value === "number") {
      if (key.includes("price") || key.includes("pnl")) {
        const formatted = this.formatNumber(value, formatting?.valueFormat, formatting?.locale);
        if (key.includes("pnl") && value >= 0) {
          return `+${formatted}`;
        }
        return formatted;
      }
      if (key.includes("percentage") || key.includes("percent")) {
        const format = formatting?.percentageFormat || ".1f";
        return `${value.toFixed(format === ".1f" ? 1 : 2)}%`;
      }
      return this.formatNumber(value, formatting?.valueFormat, formatting?.locale);
    }
    return value.toString();
  }
  /**
   * Format number according to format specification
   */
  formatNumber(value, format, locale) {
    if (!format) {
      return value.toFixed(2);
    }
    const formatMatch = format.match(/\.(\d+)f/);
    if (formatMatch) {
      const decimals = parseInt(formatMatch[1]);
      return value.toFixed(decimals);
    }
    if (locale) {
      try {
        return value.toLocaleString(locale);
      } catch {
      }
    }
    return value.toFixed(2);
  }
  /**
   * Format time value
   */
  formatTime(time, format) {
    if (!time) return "";
    try {
      let date;
      if (time instanceof Date) {
        date = time;
      } else if (typeof time === "number") {
        date = new Date(time > 1e10 ? time : time * 1e3);
      } else if (typeof time === "string") {
        date = new Date(time);
      } else {
        return time.toString();
      }
      if (format) {
        return this.formatDateWithCustomFormat(date, format);
      }
      return date.toLocaleString();
    } catch {
      return time.toString();
    }
  }
  /**
   * Format date with custom format string
   */
  formatDateWithCustomFormat(date, format) {
    const formatMap = {
      YYYY: date.getFullYear().toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, "0"),
      DD: date.getDate().toString().padStart(2, "0"),
      HH: date.getHours().toString().padStart(2, "0"),
      mm: date.getMinutes().toString().padStart(2, "0"),
      ss: date.getSeconds().toString().padStart(2, "0")
    };
    let result = format;
    for (const [placeholder, value] of Object.entries(formatMap)) {
      result = result.replace(new RegExp(placeholder, "g"), value);
    }
    return result;
  }
  /**
   * Escape special regex characters
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  /**
   * Escape HTML characters
   */
  escapeHtml(str) {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return str.replace(/[&<>"']/g, (match) => escapeMap[match]);
  }
  /**
   * Validate template syntax
   */
  validateTemplate(template) {
    const errors = [];
    try {
      const placeholderRegex = /\$\$([a-zA-Z_][a-zA-Z0-9_]*)\$\$/g;
      const invalidPlaceholderRegex = /\$\$[^$]*\$\$/g;
      const validPlaceholders = [...template.matchAll(placeholderRegex)];
      const allDollarPairs = [...template.matchAll(invalidPlaceholderRegex)];
      if (allDollarPairs.length !== validPlaceholders.length) {
        errors.push("Template contains malformed placeholders");
      }
      const dollarCount = (template.match(/\$/g) || []).length;
      if (dollarCount % 4 !== 0) {
        errors.push("Template contains unmatched $$ pairs");
      }
    } catch (error) {
      errors.push(`Template validation error: ${error}`);
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Get list of placeholders in template
   */
  getPlaceholders(template) {
    const placeholderRegex = /\$\$([a-zA-Z_][a-zA-Z0-9_]*)\$\$/g;
    const matches = [...template.matchAll(placeholderRegex)];
    return matches.map((match) => match[0]);
  }
  /**
   * Create template context from series data
   */
  createContextFromSeriesData(seriesData, customData, formatting) {
    return {
      seriesData,
      customData,
      formatting
    };
  }
};
_TemplateEngine.getInstance = void 0;
let TemplateEngine = _TemplateEngine;
_init = __decoratorStart();
TemplateEngine = __decorateElement(_init, 0, "TemplateEngine", _TemplateEngine_decorators, TemplateEngine);
__runInitializers(_init, 1, TemplateEngine);
class TradeTemplateProcessor {
  /**
   * Process trade template with data
   *
   * Converts trade data to template context and processes using the
   * common TemplateEngine. Handles both TradeTemplateData and arbitrary
   * data objects with additional_data fields.
   *
   * @static
   * @param {string} template - HTML template with $$placeholder$$ syntax
   * @param {TradeTemplateData | Record<string, any>} data - Trade data object
   * @param {TemplateOptions} [options={}] - Optional processing options
   * @returns {TemplateResult} Processed template with content and errors
   *
   * @example
   * ```typescript
   * const result = TradeTemplateProcessor.processTemplate(
   *   '<span style="color: $$profit_color$$">$$side$$</span>',
   *   {
   *     isProfitable: true,
   *     side: 'BUY',
   *     profit_color: '#00ff88'
   *   }
   * );
   * ```
   */
  static processTemplate(template, data, options = {}) {
    const templateEngine = TemplateEngine.getInstance();
    const context = {
      customData: this.convertTradeDataToContext(data)
    };
    return templateEngine.processTemplate(template, context, options);
  }
  /**
   * Convert trade data to template context format
   * Now supports flexible data structure with additional_data fields
   */
  static convertTradeDataToContext(data) {
    const context = { ...data };
    const flexData = data;
    const isProfitable = flexData.isProfitable ?? flexData.is_profitable ?? false;
    const pnl = flexData.pnl ?? 0;
    const exitPrice = flexData.exitPrice ?? flexData.exit_price ?? 0;
    const entryPrice = flexData.entryPrice ?? flexData.entry_price ?? 0;
    const priceDifference = exitPrice - entryPrice;
    const tradeType = (flexData.tradeType || flexData.trade_type || "long").toString().toLowerCase();
    context.trade_type = tradeType.toUpperCase();
    context.trade_type_lower = tradeType.toLowerCase();
    context.entry_price = entryPrice;
    context.exit_price = exitPrice;
    context.pnl = pnl;
    context.pnl_percentage = flexData.pnlPercentage ?? flexData.pnl_percentage ?? 0;
    context.is_profitable = isProfitable;
    context.profit_loss = isProfitable ? "PROFIT" : "LOSS";
    context.profit_loss_lower = isProfitable ? "profit" : "loss";
    context.pnl_sign = pnl >= 0 ? "+" : "";
    context.price_difference = priceDifference;
    context.price_diff_sign = priceDifference >= 0 ? "+" : "";
    context.trade_id = flexData.tradeId ?? flexData.trade_id ?? flexData.id;
    context.id = flexData.id ?? flexData.tradeId ?? flexData.trade_id;
    return context;
  }
  /**
   * Get default tooltip template
   */
  static getDefaultTooltipTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 180px; padding: 4px;">
        <div style="font-weight: bold; font-size: 10px; margin-bottom: 3px; color: $$is_profitable$$ ? '#4CAF50' : '#F44336';">
          $$trade_type$$
        </div>
        <div style="font-size: 10px; line-height: 1.3;">
          <div>Entry: $$entry_price$$</div>
          <div>Exit: $$exit_price$$</div>
          <div style="color: $$is_profitable$$ ? '#4CAF50' : '#F44336'; font-weight: bold;">
            P&L: $$pnl$$ ($$pnl_percentage$$%)
          </div>
          $$notes$$ ? '<div style="margin-top: 2px; font-size: 9px; color: #888;">$$notes$$</div>' : ''
        </div>
      </div>
    `;
  }
  /**
   * Get default marker template
   */
  static getDefaultMarkerTemplate() {
    return "E: $$entry_price$$";
  }
  /**
   * Get available placeholders documentation
   */
  static getPlaceholdersDocumentation() {
    return {
      $$trade_type$$: "Trade type in uppercase (LONG or SHORT)",
      $$trade_type_lower$$: "Trade type in lowercase (long or short)",
      $$entry_price$$: "Entry price formatted to 2 decimal places",
      $$exit_price$$: "Exit price formatted to 2 decimal places",
      $$pnl$$: "Profit/Loss amount with sign (+/-)",
      $$pnl_percentage$$: "Profit/Loss percentage formatted to 1 decimal place",
      $$quantity$$: "Trade quantity",
      $$notes$$: "Trade notes or comments",
      $$trade_id$$: "Trade ID",
      $$entry_time$$: "Entry time as string",
      $$exit_time$$: "Exit time as string",
      $$is_profitable$$: "Boolean indicating if trade is profitable (true/false)",
      $$profit_loss$$: "Profit/Loss status in uppercase (PROFIT or LOSS)",
      $$profit_loss_lower$$: "Profit/Loss status in lowercase (profit or loss)",
      $$price_difference$$: "Price difference with sign (+/-)",
      $$pnl_sign$$: "P&L sign only (+ or -)"
    };
  }
}
exports.TemplateEngine = TemplateEngine;
exports.TradeTemplateProcessor = TradeTemplateProcessor;
//# sourceMappingURL=TradeTemplateProcessor-Dadi3Bon.cjs.map
