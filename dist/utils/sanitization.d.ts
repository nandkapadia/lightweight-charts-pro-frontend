/**
 * @fileoverview HTML Sanitization Utilities for XSS Prevention
 *
 * This module provides security-focused utilities for safely rendering user-provided
 * or dynamic HTML content in the DOM. It implements defense-in-depth against Cross-Site
 * Scripting (XSS) attacks using a whitelist approach.
 *
 * Security Model:
 * - Escape all HTML entities by default (safe for textContent)
 * - Whitelist approach: Only explicitly safe tags/attributes allowed
 * - Strip all event handlers (onclick, onload, etc.)
 * - Remove dangerous CSS patterns (javascript:, expression(), etc.)
 * - Prevent external resource loading (scripts, iframes, data: URLs)
 * - Replace unsafe elements with their text content
 *
 * Key Features:
 * - HTML entity escaping for safe text injection
 * - DOM-based HTML sanitization (not regex-based)
 * - CSS style sanitization
 * - Convenience wrappers for common DOM operations
 * - Type-safe APIs with proper null handling
 *
 * Use Cases:
 * - Tooltips with user-provided content
 * - Legend labels with formatting
 * - Dynamic chart annotations
 * - Any innerHTML injection from untrusted sources
 *
 * Security Principles:
 * 1. Never trust user input
 * 2. Whitelist over blacklist
 * 3. Use browser APIs (DOMParser) for parsing
 * 4. Prefer textContent over innerHTML when possible
 * 5. Sanitize at point of use (defense in depth)
 *
 * @example
 * ```typescript
 * import { escapeHtml, sanitizeHtml, setInnerHtmlSafe } from './sanitization';
 *
 * // Escape user input for safe display
 * const userInput = '<script>alert("xss")</script>';
 * const safe = escapeHtml(userInput);
 * element.textContent = safe; // Displays as text, not executed
 *
 * // Allow safe HTML formatting
 * const formatted = '<b>Bold</b> and <i>italic</i>';
 * element.innerHTML = sanitizeHtml(formatted); // Safe
 *
 * // Remove dangerous content
 * const dangerous = '<div onclick="alert(1)">Click me</div>';
 * element.innerHTML = sanitizeHtml(dangerous);
 * // Result: '<div>Click me</div>' (onclick removed)
 * ```
 */
/**
 * Escape HTML entities in a string.
 *
 * Converts special HTML characters to their HTML entity equivalents, making the
 * string safe for insertion into the DOM via textContent or innerHTML. This prevents
 * the browser from interpreting user input as HTML tags or attributes.
 *
 * @param str - String to escape (user input or untrusted content)
 * @returns string - Escaped string safe for display
 *
 * @example
 * ```typescript
 * // Escape script tag
 * const xss = '<script>alert("xss")</script>';
 * const safe = escapeHtml(xss);
 * // safe = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * element.textContent = safe; // Displays as text, not executed
 *
 * // Escape attribute injection
 * const injection = '" onclick="alert(1)"';
 * const escaped = escapeHtml(injection);
 * // escaped = '&quot; onclick&#x3D;&quot;alert(1)&quot;'
 *
 * // Escape URL injection
 * const urlInjection = 'javascript:alert(1)';
 * const escapedUrl = escapeHtml(urlInjection);
 * // escapedUrl = 'javascript:alert(1)' (: and () are safe after escaping context)
 * ```
 *
 * @remarks
 * When to Use:
 * - Use this for plain text display (with textContent)
 * - Use sanitizeHtml() if you need to allow some HTML formatting
 *
 * What Gets Escaped:
 * & < > " ' / ` = are converted to HTML entities
 *
 * Performance:
 * This uses a single regex replace with a callback, which is efficient.
 * The regex matches all dangerous characters in one pass.
 */
export declare function escapeHtml(str: string): string;
/**
 * Sanitize HTML content using a whitelist approach.
 *
 * Parses HTML using DOMParser, removes unsafe tags and attributes, sanitizes
 * styles, and returns clean HTML. This allows safe HTML formatting (bold, italic)
 * while blocking dangerous content (scripts, event handlers).
 *
 * @param html - HTML string to sanitize (may contain user input)
 * @returns string - Sanitized HTML safe for innerHTML
 *
 * @example
 * ```typescript
 * // Allow safe formatting
 * const formatted = '<b>Bold</b> and <i>italic</i> text';
 * const safe = sanitizeHtml(formatted);
 * // safe = '<b>Bold</b> and <i>italic</i> text' (unchanged, both tags safe)
 *
 * // Remove event handlers
 * const dangerous = '<div onclick="alert(1)">Click me</div>';
 * const cleaned = sanitizeHtml(dangerous);
 * // cleaned = '<div>Click me</div>' (onclick attribute removed)
 *
 * // Remove unsafe tags
 * const xss = '<script>alert("xss")</script>Normal text';
 * const safe2 = sanitizeHtml(xss);
 * // safe2 = 'alert("xss")Normal text' (script tag removed, content kept as text)
 *
 * // Sanitize styles
 * const styleAttack = '<div style="background: url(javascript:alert(1))">Text</div>';
 * const safe3 = sanitizeHtml(styleAttack);
 * // safe3 = '<div style="background: url()">Text</div>' (javascript: removed)
 * ```
 *
 * @remarks
 * How It Works:
 * 1. Parse HTML using DOMParser (proper HTML parsing, not regex)
 * 2. Walk the DOM tree with TreeWalker
 * 3. Check each element against SAFE_TAGS whitelist
 * 4. Remove unsafe tags (replace with text content)
 * 5. Remove unsafe attributes from safe tags
 * 6. Sanitize style attributes separately
 * 7. Return the cleaned HTML
 *
 * Whitelist vs Blacklist:
 * This uses a whitelist approach, which is more secure than blacklisting.
 * We explicitly allow known-safe tags/attributes instead of trying to block
 * all possible dangerous patterns.
 *
 * Performance:
 * DOM parsing is slower than regex, but much safer and more correct.
 * For typical tooltip/legend content, the performance is acceptable.
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Sanitize CSS style string by removing dangerous patterns.
 *
 * Removes CSS features that can execute JavaScript or load external resources,
 * including IE-specific features and data: URLs. This makes inline styles safe
 * for use in sanitized HTML.
 *
 * @param style - CSS style string (may contain dangerous patterns)
 * @returns string - Sanitized style string
 *
 * @example
 * ```typescript
 * // Remove JavaScript URL
 * const dangerous = 'background: url(javascript:alert(1))';
 * const safe = sanitizeStyle(dangerous);
 * // safe = 'background: url()' (javascript:alert(1) removed)
 *
 * // Remove IE expression
 * const ieAttack = 'width: expression(alert(1))';
 * const cleaned = sanitizeStyle(ieAttack);
 * // cleaned = 'width: ()' (expression(alert(1)) removed)
 *
 * // Safe styles pass through
 * const normal = 'color: red; font-size: 12px';
 * const unchanged = sanitizeStyle(normal);
 * // unchanged = 'color: red; font-size: 12px' (no dangerous patterns)
 * ```
 *
 * @remarks
 * Removed Patterns:
 * - expression(): IE-specific JavaScript execution
 * - javascript: URLs
 * - behavior: IE-specific code execution
 * - -moz-binding: Firefox XBL binding
 * - data: URLs (can contain base64-encoded JavaScript)
 *
 * Why This Is Necessary:
 * CSS has several features that can execute code or load external resources.
 * Even though we whitelist the style attribute, we must sanitize its content.
 */
export declare function sanitizeStyle(style: string): string;
/**
 * Create a safe text node from a potentially unsafe string.
 *
 * Creates a DOM Text node, which is inherently safe from XSS because browsers
 * treat it as plain text, never as HTML. Any HTML in the string will be displayed
 * as text, not executed.
 *
 * @param text - Text content (may contain characters like <, >, etc.)
 * @returns Text - DOM Text node (always safe)
 *
 * @example
 * ```typescript
 * // HTML is displayed as text, not executed
 * const userInput = '<script>alert("xss")</script>';
 * const textNode = createSafeTextNode(userInput);
 * element.appendChild(textNode);
 * // Displays: <script>alert("xss")</script> (as text)
 * ```
 *
 * @remarks
 * Why Text Nodes Are Safe:
 * Text nodes can only contain text. The browser never interprets their content
 * as HTML, even if they contain < > or other HTML characters. This makes them
 * the safest way to display user input.
 *
 * When to Use:
 * Use this when you don't need any HTML formatting. It's safer than escapeHtml()
 * followed by innerHTML, and simpler than textContent.
 */
export declare function createSafeTextNode(text: string): Text;
/**
 * Set innerHTML safely with automatic sanitization.
 *
 * Convenience wrapper that sanitizes HTML before setting innerHTML. Use this
 * instead of directly setting innerHTML when the content may be untrusted.
 *
 * @param element - Target element to set content on
 * @param html - HTML content to sanitize and set
 * @returns void
 *
 * @example
 * ```typescript
 * // Instead of:
 * element.innerHTML = userProvidedHtml; // UNSAFE!
 *
 * // Use:
 * setInnerHtmlSafe(element, userProvidedHtml); // Safe
 * ```
 *
 * @remarks
 * This is a convenience function equivalent to:
 * element.innerHTML = sanitizeHtml(html);
 *
 * It's provided for readability and to make the security intent clear.
 */
export declare function setInnerHtmlSafe(element: HTMLElement, html: string): void;
/**
 * Set text content safely (no HTML interpretation).
 *
 * Uses textContent which is inherently safe because it doesn't parse HTML.
 * Any HTML in the string will be displayed as text, not executed.
 *
 * @param element - Target element to set text on
 * @param text - Text content to set (may contain HTML that will be displayed as text)
 * @returns void
 *
 * @example
 * ```typescript
 * // HTML is displayed as text
 * const userInput = '<b>Bold</b>';
 * setTextContentSafe(element, userInput);
 * // Displays: <b>Bold</b> (not bold, shows the tags)
 * ```
 *
 * @remarks
 * Why This Is Safe:
 * textContent never interprets its value as HTML. It's the safest way to
 * display user input when you don't need HTML formatting.
 *
 * When to Use:
 * - When you don't need HTML formatting
 * - When displaying user input
 * - When you want maximum security
 *
 * When NOT to Use:
 * - When you need HTML formatting (use setInnerHtmlSafe instead)
 */
export declare function setTextContentSafe(element: HTMLElement, text: string): void;
//# sourceMappingURL=sanitization.d.ts.map