/**
 * @fileoverview HTML Sanitization Utilities
 *
 * Provides XSS-safe HTML rendering utilities for tooltips, legends, and other
 * DOM-injected content. Uses a whitelist approach to allow safe HTML while
 * blocking potentially malicious content.
 *
 * Security model:
 * - Escape all HTML entities by default
 * - Whitelist safe HTML tags for formatted content
 * - Strip event handlers and dangerous attributes
 * - No external resource loading (scripts, iframes)
 */
/**
 * Escape HTML entities in a string
 *
 * Converts special characters to their HTML entity equivalents to prevent
 * XSS attacks when inserting user-provided content into the DOM.
 *
 * @param str - String to escape
 * @returns Escaped string safe for innerHTML
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export declare function escapeHtml(str: string): string;
/**
 * Sanitize HTML content allowing only safe tags and attributes
 *
 * Uses a whitelist approach to allow formatting while blocking potentially
 * dangerous content like scripts, event handlers, and external resources.
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 *
 * @example
 * ```typescript
 * sanitizeHtml('<div onclick="alert(1)">Safe <b>text</b></div>');
 * // Returns: '<div>Safe <b>text</b></div>'
 * ```
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Sanitize CSS style string
 *
 * Removes potentially dangerous CSS patterns like expressions, javascript: URLs,
 * and binding behaviors that could execute code.
 *
 * @param style - CSS style string
 * @returns Sanitized style string
 */
export declare function sanitizeStyle(style: string): string;
/**
 * Create safe text node from potentially unsafe string
 *
 * Creates a DOM Text node which is inherently safe from XSS as browsers
 * treat it as text, not HTML.
 *
 * @param text - Text content (may contain HTML that should be displayed as text)
 * @returns Text node
 */
export declare function createSafeTextNode(text: string): Text;
/**
 * Set innerHTML safely with sanitization
 *
 * Convenience function that sanitizes HTML before setting innerHTML.
 *
 * @param element - Target element
 * @param html - HTML content to sanitize and set
 */
export declare function setInnerHtmlSafe(element: HTMLElement, html: string): void;
/**
 * Set text content safely (no HTML interpretation)
 *
 * Uses textContent which is inherently safe as it doesn't parse HTML.
 *
 * @param element - Target element
 * @param text - Text content to set
 */
export declare function setTextContentSafe(element: HTMLElement, text: string): void;
//# sourceMappingURL=sanitization.d.ts.map