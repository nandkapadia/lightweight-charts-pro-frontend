"use strict";
class EventEmitter {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
    this.maxListeners = 10;
  }
  /**
   * Add an event listener
   * @param event Event name
   * @param listener Listener function
   */
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }
  /**
   * Add a one-time event listener
   * @param event Event name
   * @param listener Listener function
   */
  once(event, listener) {
    const onceWrapper = (...args) => {
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
  off(event, listener) {
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
  removeAllListeners(event) {
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
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners && listeners.length > 0) {
      listeners.forEach((listener) => {
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
  listenerCount(event) {
    return this.events.get(event)?.length ?? 0;
  }
  /**
   * Get all listeners for an event
   * @param event Event name
   */
  listeners(event) {
    return this.events.get(event)?.slice() ?? [];
  }
  /**
   * Set the maximum number of listeners (for Node.js compatibility)
   * Note: This is a no-op in this implementation, just for API compatibility
   * @param n Maximum number of listeners
   */
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }
  /**
   * Get the maximum number of listeners
   */
  getMaxListeners() {
    return this.maxListeners;
  }
}
const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};
const SAFE_TAGS = /* @__PURE__ */ new Set([
  "div",
  "span",
  "p",
  "br",
  "b",
  "i",
  "strong",
  "em",
  "u",
  "small",
  "sub",
  "sup",
  "table",
  "tr",
  "td",
  "th",
  "thead",
  "tbody"
]);
const SAFE_ATTRS = /* @__PURE__ */ new Set(["class", "style", "id", "title", "role", "aria-label"]);
const DANGEROUS_STYLE_PATTERNS = [
  /expression\s*\(/gi,
  /javascript\s*:/gi,
  /behavior\s*:/gi,
  /-moz-binding/gi,
  /url\s*\(\s*["']?\s*data:/gi
];
function escapeHtml(str) {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.replace(/[&<>"'`=/]/g, (match) => HTML_ESCAPE_MAP[match] || match);
}
function sanitizeHtml(html) {
  if (!html || typeof html !== "string") {
    return "";
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT, null);
  const nodesToRemove = [];
  let currentNode = walker.nextNode();
  while (currentNode) {
    const element = currentNode;
    const tagName = element.tagName.toLowerCase();
    if (!SAFE_TAGS.has(tagName)) {
      nodesToRemove.push(element);
    } else {
      const attrs = Array.from(element.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        if (attrName.startsWith("on")) {
          element.removeAttribute(attr.name);
          continue;
        }
        if (!SAFE_ATTRS.has(attrName)) {
          element.removeAttribute(attr.name);
          continue;
        }
        if (attrName === "style") {
          element.setAttribute("style", sanitizeStyle(attr.value));
        }
      }
    }
    currentNode = walker.nextNode();
  }
  for (const node of nodesToRemove.reverse()) {
    const textNode = document.createTextNode(node.textContent || "");
    node.parentNode?.replaceChild(textNode, node);
  }
  return doc.body.innerHTML;
}
function sanitizeStyle(style) {
  if (!style) return "";
  let sanitized = style;
  for (const pattern of DANGEROUS_STYLE_PATTERNS) {
    sanitized = sanitized.replace(pattern, "");
  }
  return sanitized;
}
function createSafeTextNode(text) {
  return document.createTextNode(text || "");
}
function setInnerHtmlSafe(element, html) {
  element.innerHTML = sanitizeHtml(html);
}
function setTextContentSafe(element, text) {
  element.textContent = text;
}
exports.EventEmitter = EventEmitter;
exports.createSafeTextNode = createSafeTextNode;
exports.escapeHtml = escapeHtml;
exports.sanitizeHtml = sanitizeHtml;
exports.sanitizeStyle = sanitizeStyle;
exports.setInnerHtmlSafe = setInnerHtmlSafe;
exports.setTextContentSafe = setTextContentSafe;
//# sourceMappingURL=sanitization-oV4kM94W.cjs.map
