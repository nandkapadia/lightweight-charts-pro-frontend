/**
 * @fileoverview Unified Color Utilities for Series Rendering and UI
 *
 * This module consolidates all color manipulation functions for financial
 * chart rendering and UI components. It provides a comprehensive suite of
 * utilities for color format conversions, interpolation, validation, and
 * gradient generation.
 *
 * Consolidated Functions From:
 * - colorUtils.ts (gradient/interpolation functions)
 * - helpers.ts (color conversion and validation functions)
 *
 * Key Features:
 * - Multi-format color parsing (hex, rgb, rgba)
 * - Bidirectional color conversions (hex ↔ rgba)
 * - Color interpolation for gradients
 * - Color validation and sanitization
 * - CSS color generation with opacity control
 * - Contrast color calculation for accessibility
 * - Color palette generation
 * - Utility functions for UI controls
 *
 * Supported Color Formats:
 * 1. Hex Colors:
 *    - 3-digit: #RGB (e.g., #F00 = #FF0000)
 *    - 4-digit: #RGBA (e.g., #F008 = #FF000088)
 *    - 6-digit: #RRGGBB (e.g., #FF0000)
 *    - 8-digit: #RRGGBBAA (e.g., #FF000080)
 *
 * 2. CSS Colors:
 *    - rgb(r, g, b)
 *    - rgba(r, g, b, a)
 *
 * Use Cases:
 * - Canvas rendering with RGBA colors
 * - Gradient generation for ribbon series
 * - Color picker UI components
 * - Accessibility contrast calculations
 * - Theme palette generation
 * - Opacity control in settings dialogs
 *
 * Performance Considerations:
 * - Color parsing is lightweight (no external dependencies)
 * - Interpolation is optimized for gradient rendering
 * - DOM-independent (can run in web workers)
 * - No external color libraries required
 *
 * @example
 * ```typescript
 * import {
 *   hexToRgbaString,
 *   interpolateColor,
 *   getContrastColor,
 *   toCss
 * } from './colorUtils';
 *
 * // Convert hex to RGBA string for canvas
 * const fillColor = hexToRgbaString('#FF0000', 0.5);
 * // Result: 'rgba(255, 0, 0, 0.5)'
 *
 * // Generate gradient colors
 * const midColor = interpolateColor('#FF0000', '#00FF00', 0.5);
 * // Result: '#808000' (yellow-green)
 *
 * // Get accessible text color
 * const textColor = getContrastColor('#2196F3');
 * // Result: '#ffffff' (white for blue background)
 *
 * // Convert color with opacity for UI
 * const uiColor = toCss('#FF0000', 50);
 * // Result: 'rgba(255, 0, 0, 0.5)'
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * RGBA color components with numeric values.
 *
 * Represents a color in Red-Green-Blue-Alpha format with all components
 * as numbers. This is the internal representation used for color calculations
 * and conversions.
 *
 * @property r - Red component (0-255)
 * @property g - Green component (0-255)
 * @property b - Blue component (0-255)
 * @property a - Alpha/opacity component (0-1, where 0 is transparent, 1 is opaque)
 *
 * @example
 * ```typescript
 * // Solid red
 * const red: RgbaColor = { r: 255, g: 0, b: 0, a: 1 };
 *
 * // Semi-transparent blue
 * const blue: RgbaColor = { r: 0, g: 0, b: 255, a: 0.5 };
 *
 * // Black (fully transparent)
 * const transparent: RgbaColor = { r: 0, g: 0, b: 0, a: 0 };
 * ```
 */
export interface RgbaColor {
  /** Red component (0-255) */
  r: number;
  /** Green component (0-255) */
  g: number;
  /** Blue component (0-255) */
  b: number;
  /** Alpha/opacity component (0-1) */
  a: number;
}

// ============================================================================
// Color Parsing Functions
// ============================================================================

/**
 * Parse hex color string to RGBA components.
 *
 * Supports all standard hex color formats including short-hand notations
 * and alpha channels. This is the core parsing function used by all other
 * hex-based utilities.
 *
 * Supported Formats:
 * - 3-digit: #RGB → Expanded to #RRGGBB (e.g., #F00 → #FF0000)
 * - 4-digit: #RGBA → Expanded to #RRGGBBAA (e.g., #F008 → #FF000088)
 * - 6-digit: #RRGGBB → Standard hex color
 * - 8-digit: #RRGGBBAA → Hex with alpha channel
 *
 * @param hex - Hex color string (with or without # prefix)
 * @returns RGBA color object, or null if invalid format
 *
 * @example
 * ```typescript
 * // 3-digit hex (shorthand)
 * const red = parseHexColor('#F00');
 * // Result: { r: 255, g: 0, b: 0, a: 1 }
 *
 * // 4-digit hex with alpha
 * const semiRed = parseHexColor('#F008');
 * // Result: { r: 255, g: 0, b: 0, a: 0.533 } (136/255)
 *
 * // 6-digit hex (standard)
 * const blue = parseHexColor('#0000FF');
 * // Result: { r: 0, g: 0, b: 255, a: 1 }
 *
 * // 8-digit hex with alpha
 * const semiBlue = parseHexColor('#0000FF80');
 * // Result: { r: 0, g: 0, b: 255, a: 0.5 } (128/255)
 *
 * // Invalid format
 * const invalid = parseHexColor('#ZZZZZZ');
 * // Result: null
 *
 * // Without # prefix
 * const green = parseHexColor('00FF00');
 * // Result: { r: 0, g: 255, b: 0, a: 1 }
 * ```
 *
 * @remarks
 * Alpha Conversion: Alpha values in hex (0x00-0xFF) are converted to
 * decimal range (0-1) by dividing by 255. This matches CSS rgba() alpha format.
 *
 * Shorthand Expansion: 3-digit and 4-digit hex codes are expanded by
 * duplicating each digit (e.g., #F0A → #FF00AA). This follows CSS color
 * specification behavior.
 *
 * Error Handling: Returns null for invalid formats rather than throwing.
 * Callers should handle null returns appropriately.
 */
export function parseHexColor(hex: string): RgbaColor | null {
  // Remove # prefix if present
  // This allows both '#FF0000' and 'FF0000' formats
  const cleanHex = hex.replace("#", "");

  // Declare color components
  let r: number, g: number, b: number, a: number;

  // Parse based on hex string length
  if (cleanHex.length === 3) {
    // 3-digit hex: #RGB
    // Each digit is duplicated to create full hex value
    // Example: #F0A → #FF00AA
    r = parseInt(cleanHex[0] + cleanHex[0], 16); // R
    g = parseInt(cleanHex[1] + cleanHex[1], 16); // G
    b = parseInt(cleanHex[2] + cleanHex[2], 16); // B
    a = 1; // Fully opaque (no alpha specified)
  } else if (cleanHex.length === 4) {
    // 4-digit hex: #RGBA
    // Each digit is duplicated, including alpha
    // Example: #F0A8 → #FF00AA88
    r = parseInt(cleanHex[0] + cleanHex[0], 16); // R
    g = parseInt(cleanHex[1] + cleanHex[1], 16); // G
    b = parseInt(cleanHex[2] + cleanHex[2], 16); // B
    // Convert alpha from 0-255 to 0-1 range
    a = parseInt(cleanHex[3] + cleanHex[3], 16) / 255; // A
  } else if (cleanHex.length === 6) {
    // 6-digit hex: #RRGGBB
    // Standard hex color format
    r = parseInt(cleanHex.substring(0, 2), 16); // RR
    g = parseInt(cleanHex.substring(2, 4), 16); // GG
    b = parseInt(cleanHex.substring(4, 6), 16); // BB
    a = 1; // Fully opaque (no alpha specified)
  } else if (cleanHex.length === 8) {
    // 8-digit hex: #RRGGBBAA
    // Hex with full alpha channel
    r = parseInt(cleanHex.substring(0, 2), 16); // RR
    g = parseInt(cleanHex.substring(2, 4), 16); // GG
    b = parseInt(cleanHex.substring(4, 6), 16); // BB
    // Convert alpha from 0-255 to 0-1 range
    a = parseInt(cleanHex.substring(6, 8), 16) / 255; // AA
  } else {
    // Invalid hex format (wrong length)
    return null;
  }

  // Validate all parsed values are valid numbers
  // parseInt can return NaN for invalid hex digits (e.g., 'ZZ')
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }

  // Return validated RGBA color object
  return { r, g, b, a };
}

/**
 * Parse CSS color value and extract RGBA components.
 *
 * Supports multiple CSS color formats and delegates to appropriate parser.
 * This is a universal parser for both hex and functional color notations.
 *
 * Supported Formats:
 * - Hex: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
 * - RGB: rgb(r, g, b)
 * - RGBA: rgba(r, g, b, a)
 *
 * @param cssColor - CSS color string in any supported format
 * @returns RGBA color object, or null if invalid format
 *
 * @example
 * ```typescript
 * // Hex colors
 * const red = parseCssColor('#FF0000');
 * // Result: { r: 255, g: 0, b: 0, a: 1 }
 *
 * // RGB functional notation
 * const blue = parseCssColor('rgb(0, 0, 255)');
 * // Result: { r: 0, g: 0, b: 255, a: 1 }
 *
 * // RGBA functional notation
 * const semiGreen = parseCssColor('rgba(0, 255, 0, 0.5)');
 * // Result: { r: 0, g: 255, b: 0, a: 0.5 }
 *
 * // Invalid format
 * const invalid = parseCssColor('not-a-color');
 * // Result: null
 * ```
 *
 * @remarks
 * RGB/RGBA Parsing: Uses regex to extract comma-separated values.
 * Handles spaces around commas and optional alpha component.
 *
 * Alpha Default: If RGB format is used (no alpha), alpha defaults to 1.
 * This matches CSS behavior where rgb() is equivalent to rgba(..., 1).
 */
export function parseCssColor(cssColor: string): RgbaColor | null {
  // Handle hex colors (# prefix)
  if (cssColor.startsWith("#")) {
    return parseHexColor(cssColor);
  }

  // Handle rgb() and rgba() functional notation
  // Regex matches: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbaMatch = cssColor.match(/rgba?\(([^)]+)\)/);

  if (rgbaMatch) {
    // Extract and parse comma-separated values
    // trim() removes leading/trailing whitespace from each component
    const values = rgbaMatch[1].split(",").map((v) => parseFloat(v.trim()));

    // Require at least RGB components
    if (values.length >= 3) {
      return {
        r: values[0], // Red (0-255)
        g: values[1], // Green (0-255)
        b: values[2], // Blue (0-255)
        // Alpha: use provided value or default to 1 (fully opaque)
        a: values[3] !== undefined ? values[3] : 1,
      };
    }
  }

  // No format matched - return null
  return null;
}

// ============================================================================
// Color Conversion Functions
// ============================================================================

/**
 * Convert hex color to RGBA string with alpha.
 *
 * This is the primary conversion function for canvas rendering and CSS
 * properties that require rgba() format. Provides a convenient way to
 * apply opacity to hex colors.
 *
 * @param hex - Hex color string (e.g., '#FF0000')
 * @param alpha - Alpha value between 0 and 1 (default: 1 = fully opaque)
 * @returns RGBA color string in CSS rgba() format
 *
 * @example
 * ```typescript
 * // Fully opaque red
 * const red = hexToRgbaString('#FF0000');
 * // Result: 'rgba(255, 0, 0, 1)'
 *
 * // Semi-transparent blue
 * const semiBlue = hexToRgbaString('#0000FF', 0.5);
 * // Result: 'rgba(0, 0, 255, 0.5)'
 *
 * // Fully transparent green
 * const transparent = hexToRgbaString('#00FF00', 0);
 * // Result: 'rgba(0, 255, 0, 0)'
 *
 * // Invalid hex (falls back to black)
 * const fallback = hexToRgbaString('invalid', 0.5);
 * // Result: 'rgba(0, 0, 0, 0.5)'
 * ```
 *
 * @remarks
 * Fallback Behavior: If hex parsing fails, returns black with the specified
 * alpha. This prevents rendering errors but callers should validate inputs.
 *
 * Use Cases:
 * - Canvas fillStyle and strokeStyle
 * - CSS background-color with opacity
 * - Gradient color stops with transparency
 */
export function hexToRgbaString(hex: string, alpha: number = 1): string {
  // Parse hex color to RGBA components
  const parsed = parseHexColor(hex);

  // If parsing failed, return fallback color (black with specified alpha)
  if (!parsed) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  // Return CSS rgba() string
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${alpha})`;
}

/**
 * Convert hex color to RGBA components object.
 *
 * Useful when you need individual color components for calculations
 * or custom rendering logic.
 *
 * @param hex - Hex color string
 * @returns RGBA color object or null if invalid
 *
 * @example
 * ```typescript
 * const rgba = hexToRgba('#FF8800');
 * if (rgba) {
 *   console.log(`R: ${rgba.r}, G: ${rgba.g}, B: ${rgba.b}, A: ${rgba.a}`);
 *   // Output: "R: 255, G: 136, B: 0, A: 1"
 * }
 * ```
 *
 * @remarks
 * This is an alias for parseHexColor() for semantic clarity.
 * Use this when the intent is conversion rather than parsing.
 */
export function hexToRgba(hex: string): RgbaColor | null {
  return parseHexColor(hex);
}

/**
 * Convert RGBA values to hex color string.
 *
 * Converts individual RGB components to standard 6-digit hex format.
 * Note: Alpha channel is not included in output (use 8-digit hex if needed).
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string in #RRGGBB format
 *
 * @example
 * ```typescript
 * // Pure red
 * const red = rgbaToHex(255, 0, 0);
 * // Result: '#FF0000'
 *
 * // Orange
 * const orange = rgbaToHex(255, 165, 0);
 * // Result: '#FFA500'
 *
 * // Values are clamped to 0-255 range
 * const clamped = rgbaToHex(300, -10, 128);
 * // Result: '#FF0080' (300→255, -10→0, 128→128)
 * ```
 *
 * @remarks
 * Component Clamping: Values are automatically clamped to 0-255 range
 * to prevent invalid hex output. This makes the function safe for
 * calculated color values.
 *
 * Zero-Padding: Single-digit hex values are zero-padded (e.g., 15 → '0F')
 * to ensure valid 6-digit hex format.
 *
 * No Alpha: Alpha channel is intentionally omitted. Most CSS contexts
 * don't support 8-digit hex, and rgba() is preferred for transparency.
 */
export function rgbaToHex(r: number, g: number, b: number): string {
  // Helper function to convert number to 2-digit hex
  const toHex = (n: number) => {
    // Clamp value to 0-255 range
    const clamped = Math.max(0, Math.min(255, n));
    // Round to integer and convert to hex
    const hex = Math.round(clamped).toString(16);
    // Pad with leading zero if single digit
    return hex.length === 1 ? "0" + hex : hex;
  };

  // Convert each component and concatenate with # prefix
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert CSS color to hex format.
 *
 * Handles both hex and rgba() input formats, extracting RGB components
 * and converting to standard hex notation.
 *
 * @param cssColor - CSS color string (hex, rgb, or rgba)
 * @returns Hex color string, or original input if parsing fails
 *
 * @example
 * ```typescript
 * // Already hex - returns as-is after validation
 * const hex1 = cssToHex('#FF0000');
 * // Result: '#FF0000'
 *
 * // RGBA to hex (alpha is dropped)
 * const hex2 = cssToHex('rgba(0, 255, 0, 0.5)');
 * // Result: '#00FF00'
 *
 * // RGB to hex
 * const hex3 = cssToHex('rgb(255, 0, 255)');
 * // Result: '#FF00FF'
 *
 * // Invalid input - returns original
 * const invalid = cssToHex('invalid-color');
 * // Result: 'invalid-color'
 * ```
 *
 * @remarks
 * Alpha Loss: Alpha channel is discarded during conversion to hex.
 * If alpha preservation is needed, use rgba() format or 8-digit hex.
 *
 * Fallback: Returns original input if parsing fails, allowing
 * named colors or other formats to pass through.
 */
export function cssToHex(cssColor: string): string {
  // Parse CSS color to RGBA components
  const parsed = parseCssColor(cssColor);

  if (parsed) {
    // Convert RGBA to hex (alpha is dropped)
    return rgbaToHex(parsed.r, parsed.g, parsed.b);
  }

  // Parsing failed - return original color string
  // This allows named colors like 'red' to pass through
  return cssColor;
}

/**
 * Extract hex color and opacity percentage from color string.
 *
 * Handles both hex and rgba formats, separating the RGB components
 * (as hex) from the alpha channel (as percentage). Used by UI components
 * that have separate color and opacity controls.
 *
 * @param color - Color in hex or rgba format
 * @returns Object with hex color and opacity percentage (0-100)
 *
 * @example
 * ```typescript
 * // RGBA with 50% opacity
 * const result1 = extractColorAndOpacity('rgba(255, 0, 0, 0.5)');
 * // Result: { color: '#FF0000', opacity: 50 }
 *
 * // Fully opaque hex
 * const result2 = extractColorAndOpacity('#00FF00');
 * // Result: { color: '#00FF00', opacity: 100 }
 *
 * // Hex with alpha
 * const result3 = extractColorAndOpacity('#0000FF80');
 * // Result: { color: '#0000FF', opacity: 50 }
 *
 * // Invalid color - returns default blue
 * const result4 = extractColorAndOpacity('');
 * // Result: { color: '#2196F3', opacity: 100 }
 * ```
 *
 * @remarks
 * Default Color: If parsing fails or color is empty, returns Material Blue
 * (#2196F3) as default. This matches the default theme color.
 *
 * Opacity Rounding: Alpha values are rounded to nearest percentage.
 * For example, 0.505 becomes 51%, not 50.5%.
 *
 * Use Case: Designed for SeriesSettingsDialog and similar UI components
 * that display color and opacity as separate controls.
 */
export function extractColorAndOpacity(color: string): {
  color: string;
  opacity: number;
} {
  // Parse color to RGBA components
  const rgba = parseCssColor(color);

  // If parsing failed, return default color with full opacity
  if (!rgba) {
    return { color: color || "#2196F3", opacity: 100 };
  }

  // Convert RGB to hex (drop alpha)
  const hexColor = rgbaToHex(rgba.r, rgba.g, rgba.b);

  // Convert alpha (0-1) to percentage (0-100) and round
  const opacity = Math.round(rgba.a * 100);

  return { color: hexColor, opacity };
}

/**
 * Convert color and opacity percentage to CSS color string.
 *
 * Used by SeriesSettingsDialog and similar UI components that have
 * separate color and opacity controls. Handles both hex and rgba
 * input formats and applies the specified opacity.
 *
 * Output Format Selection:
 * - If opacity is 100% and input is not rgba: Returns hex format
 * - Otherwise: Returns rgba format
 *
 * @param color - Color in hex or rgba format
 * @param opacity - Opacity percentage (0-100), default 100
 * @returns CSS color string with applied opacity
 *
 * @example
 * ```typescript
 * // Full opacity - returns hex
 * const color1 = toCss('#FF0000', 100);
 * // Result: '#FF0000'
 *
 * // 50% opacity - returns rgba
 * const color2 = toCss('#00FF00', 50);
 * // Result: 'rgba(0, 255, 0, 0.5)'
 *
 * // 0% opacity (fully transparent)
 * const color3 = toCss('#0000FF', 0);
 * // Result: 'rgba(0, 0, 255, 0)'
 *
 * // RGBA input - always returns rgba
 * const color4 = toCss('rgba(255, 0, 0, 0.8)', 100);
 * // Result: 'rgba(255, 0, 0, 1)'
 *
 * // Opacity clamped to 0-100 range
 * const color5 = toCss('#FF0000', 150);
 * // Result: 'rgba(255, 0, 0, 1)' (150 clamped to 100)
 * ```
 *
 * @remarks
 * Opacity Clamping: Opacity values are clamped to 0-100 range before
 * conversion to alpha (0-1). Values <0 become 0, >100 become 100.
 *
 * Format Preservation: If input is rgba() format, output will always be
 * rgba() even at 100% opacity. This maintains format consistency.
 *
 * Fallback: If parsing fails, returns original color string unchanged.
 */
export function toCss(color: string, opacity: number = 100): string {
  // Parse color (supports both hex and rgba)
  const rgba = parseCssColor(color);

  // If parsing failed, return original color as fallback
  if (!rgba) {
    return color;
  }

  // If opacity is 100% and input was not rgba, return as hex
  if (opacity >= 100 && !color.startsWith("rgba")) {
    return rgbaToHex(rgba.r, rgba.g, rgba.b);
  }

  // Convert opacity percentage (0-100) to alpha (0-1)
  // Clamp to valid range to prevent invalid alpha values
  const alpha = Math.max(0, Math.min(1, opacity / 100));

  // Return rgba format with new opacity
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

// ============================================================================
// Color Interpolation Functions
// ============================================================================

/**
 * Interpolate between two hex colors.
 *
 * Performs linear interpolation in RGB color space. Used for gradient
 * rendering in ribbon and gradient ribbon series. The interpolation
 * is done per-component (R, G, B separately).
 *
 * @param startColor - Starting color in hex format (e.g., '#FF0000')
 * @param endColor - Ending color in hex format (e.g., '#00FF00')
 * @param factor - Interpolation factor between 0 and 1
 *   - 0.0 = 100% startColor
 *   - 0.5 = 50% mix of both colors
 *   - 1.0 = 100% endColor
 * @returns Interpolated color in hex format
 *
 * @example
 * ```typescript
 * // Red to green gradient
 * const color1 = interpolateColor('#FF0000', '#00FF00', 0);
 * // Result: '#FF0000' (pure red)
 *
 * const color2 = interpolateColor('#FF0000', '#00FF00', 0.5);
 * // Result: '#808000' (yellow - midpoint)
 *
 * const color3 = interpolateColor('#FF0000', '#00FF00', 1);
 * // Result: '#00FF00' (pure green)
 *
 * // Partial interpolation
 * const color4 = interpolateColor('#000000', '#FFFFFF', 0.25);
 * // Result: '#404040' (25% towards white)
 *
 * // Factor is automatically clamped to 0-1
 * const color5 = interpolateColor('#FF0000', '#00FF00', 1.5);
 * // Result: '#00FF00' (1.5 clamped to 1.0)
 * ```
 *
 * @remarks
 * Factor Clamping: Factor is automatically clamped to 0-1 range to
 * prevent extrapolation beyond the color endpoints.
 *
 * Color Space: Interpolation is performed in RGB space, not perceptually
 * uniform spaces like LAB. This may produce less intuitive midpoints for
 * some color pairs (e.g., blue to yellow may pass through gray).
 *
 * Error Handling: If either color fails to parse, returns startColor.
 * This ensures gradient rendering doesn't break on invalid colors.
 *
 * Performance: Uses try-catch for safety in production. Parsing and
 * interpolation are lightweight operations suitable for per-frame updates.
 */
export function interpolateColor(
  startColor: string,
  endColor: string,
  factor: number,
): string {
  // Clamp factor to 0-1 range to prevent extrapolation
  // This ensures we stay between the two endpoint colors
  factor = Math.max(0, Math.min(1, factor));

  try {
    // Parse both endpoint colors
    const start = parseHexColor(startColor);
    const end = parseHexColor(endColor);

    // If either parsing failed, return start color as fallback
    if (!start || !end) {
      return startColor;
    }

    // Linearly interpolate each RGB component
    // Formula: start + (end - start) * factor
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);

    // Convert interpolated RGB to hex
    return rgbaToHex(r, g, b);
  } catch {
    // If any error occurs during interpolation, return start color
    return startColor;
  }
}

/**
 * Generate gradient color based on value position and normalization.
 *
 * Used by gradient ribbon series to calculate colors based on either
 * data value spread or position in dataset. Provides two gradient modes:
 * value-based (normalized by spread) or position-based (normalized by index).
 *
 * Gradient Modes:
 * 1. Value-based (normalize=true): Color based on spread magnitude
 *    - Larger spread → closer to endColor
 *    - Smaller spread → closer to startColor
 *
 * 2. Position-based (normalize=false): Color based on data index
 *    - First data point → startColor
 *    - Last data point → endColor
 *    - Linear progression between
 *
 * @param value - Current value object with upper and lower bounds
 * @param allValues - Array of all values for normalization context
 * @param index - Current index in the data array
 * @param startColor - Start color for gradient (hex format)
 * @param endColor - End color for gradient (hex format)
 * @param normalize - Normalization mode (default: true)
 *   - true: Normalize based on value spread (upper - lower)
 *   - false: Normalize based on position/index
 * @returns Calculated gradient color in hex format
 *
 * @example
 * ```typescript
 * // Sample data: ribbon series with varying spreads
 * const data = [
 *   { time: 1, upper: 105, lower: 95 },  // spread = 10
 *   { time: 2, upper: 120, lower: 80 },  // spread = 40
 *   { time: 3, upper: 110, lower: 90 },  // spread = 20
 * ];
 *
 * // Value-based gradient (normalize=true)
 * // Color intensity based on spread magnitude
 * const color1 = calculateGradientColor(
 *   data[0],
 *   data,
 *   0,
 *   '#00FF00',  // Green for small spread
 *   '#FF0000',  // Red for large spread
 *   true
 * );
 * // Result: Greenish (spread=10 is smallest)
 *
 * const color2 = calculateGradientColor(
 *   data[1],
 *   data,
 *   1,
 *   '#00FF00',
 *   '#FF0000',
 *   true
 * );
 * // Result: Red (spread=40 is largest)
 *
 * // Position-based gradient (normalize=false)
 * // Color based on position in dataset
 * const color3 = calculateGradientColor(
 *   data[0],
 *   data,
 *   0,  // First point
 *   '#0000FF',  // Blue
 *   '#FFFF00',  // Yellow
 *   false
 * );
 * // Result: '#0000FF' (pure blue, first point)
 *
 * const color4 = calculateGradientColor(
 *   data[2],
 *   data,
 *   2,  // Last point
 *   '#0000FF',
 *   '#FFFF00',
 *   false
 * );
 * // Result: '#FFFF00' (pure yellow, last point)
 * ```
 *
 * @remarks
 * Spread Calculation: Spread is Math.abs(upper - lower) to handle
 * both positive and negative ribbons correctly.
 *
 * Max Spread Detection: In value-based mode, scans all values to find
 * maximum spread for normalization. This is O(n) but typically fast
 * since chart datasets are limited by viewport.
 *
 * Factor Clamping: Resulting factor is clamped to [0, 1] before
 * interpolation to ensure valid gradient colors.
 *
 * Zero Division: If maxSpread is 0 (all values have same spread) or
 * if there's only one data point, factor defaults to 0.
 */
export function calculateGradientColor(
  value: { upper: number; lower: number },
  allValues: { upper: number; lower: number }[],
  index: number,
  startColor: string,
  endColor: string,
  normalize: boolean = true,
): string {
  if (normalize) {
    // Value-based gradient: Color intensity based on spread magnitude
    // Calculate current spread
    const spread = Math.abs(value.upper - value.lower);

    // Find maximum spread across all values for normalization
    const maxSpread = Math.max(
      ...allValues.map((d) => Math.abs(d.upper - d.lower)),
    );

    // Calculate factor: spread/maxSpread, clamped to [0, 1]
    // Larger spreads get higher factor (closer to endColor)
    const factor = maxSpread > 0 ? Math.min(spread / maxSpread, 1) : 0;

    return interpolateColor(startColor, endColor, factor);
  } else {
    // Position-based gradient: Color based on index in dataset
    // Calculate factor: index/(length-1), clamped to [0, 1]
    // First point = 0, last point = 1, linear in between
    const factor = allValues.length > 1 ? index / (allValues.length - 1) : 0;

    return interpolateColor(startColor, endColor, factor);
  }
}

// ============================================================================
// Color Validation Functions
// ============================================================================

/**
 * Check if a color is transparent or effectively invisible.
 *
 * Detects various representations of transparent colors in hex and rgba
 * formats. Used to skip rendering of invisible elements for performance.
 *
 * Detected Transparent Formats:
 * - CSS 'transparent' keyword
 * - rgba() with alpha = 0
 * - 8-digit hex with alpha = 00 (#RRGGBB00)
 * - 4-digit hex with alpha = 0 (#RGB0)
 * - Null/undefined/empty string
 *
 * @param color - Color string to check
 * @returns True if color is transparent, false otherwise
 *
 * @example
 * ```typescript
 * // Explicit transparent
 * isTransparent('transparent');  // true
 * isTransparent('');             // true
 * isTransparent(null);           // true (with type coercion)
 *
 * // RGBA with alpha = 0
 * isTransparent('rgba(255, 0, 0, 0)');      // true
 * isTransparent('rgba(0, 0, 0, 0.0)');      // true
 *
 * // Hex with alpha = 00
 * isTransparent('#FF000000');    // true (8-digit)
 * isTransparent('#F000');        // true (4-digit)
 *
 * // Visible colors
 * isTransparent('#FF0000');      // false (opaque red)
 * isTransparent('rgba(0, 0, 0, 0.5)');  // false (semi-transparent)
 * isTransparent('#FF0000FF');    // false (opaque in 8-digit hex)
 * ```
 *
 * @remarks
 * Use Case: Skip rendering of transparent fills/strokes for performance.
 * Chart rendering code can check this before expensive draw operations.
 *
 * Partial Transparency: Colors with alpha > 0 but < 1 return false.
 * They are not fully transparent and should still be rendered.
 */
export function isTransparent(color: string): boolean {
  // Null, undefined, or empty string are considered transparent
  if (!color) return true;

  // Check for CSS 'transparent' keyword
  if (color === "transparent") return true;

  // Check for rgba() with alpha = 0
  if (color.startsWith("rgba(")) {
    // Extract alpha value using regex
    const match = color.match(/rgba\([^)]+,\s*([^)]+)\)/);
    if (match && parseFloat(match[1]) === 0) return true;
  }

  // Check for 8-digit hex with alpha = 00
  if (color.startsWith("#") && color.length === 9) {
    const alpha = color.substring(7, 9);
    if (alpha === "00") return true;
  }

  // Check for 4-digit hex with alpha = 0
  if (color.startsWith("#") && color.length === 5) {
    const alpha = color.substring(4, 5);
    if (alpha === "0") return true;
  }

  // Color is not transparent
  return false;
}

/**
 * Validate hex color format.
 *
 * Checks if a color string is a valid 3-digit or 6-digit hex color.
 * Note: Does not validate 4-digit or 8-digit hex (with alpha).
 *
 * @param color - Color string to validate
 * @returns True if valid hex color, false otherwise
 *
 * @example
 * ```typescript
 * // Valid 6-digit hex
 * isValidHexColor('#FF0000');    // true
 * isValidHexColor('#00ff00');    // true (case-insensitive)
 *
 * // Valid 3-digit hex
 * isValidHexColor('#F00');       // true
 * isValidHexColor('#0f0');       // true
 *
 * // Invalid formats
 * isValidHexColor('#FF00');      // false (wrong length)
 * isValidHexColor('FF0000');     // false (missing #)
 * isValidHexColor('#GGGGGG');    // false (invalid characters)
 * isValidHexColor('#FF000080');  // false (8-digit not supported)
 * ```
 *
 * @remarks
 * Alpha Not Supported: This validator only accepts standard 3 and 6-digit
 * hex colors. Use parseCssColor() if you need to validate alpha formats.
 *
 * Case Insensitive: Accepts both uppercase and lowercase hex digits.
 */
export function isValidHexColor(color: string): boolean {
  // Regex pattern: # followed by exactly 3 or 6 hex digits
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
}

/**
 * Sanitize hex color input.
 *
 * Attempts to fix common hex color input errors and validates format.
 * Useful for processing user input from color picker controls.
 *
 * Sanitization Steps:
 * 1. Add # prefix if missing
 * 2. Convert to uppercase for consistency
 * 3. Validate format
 * 4. Return default color if invalid
 *
 * @param input - Color input string (potentially malformed)
 * @returns Sanitized hex color or default (#2196F3) if invalid
 *
 * @example
 * ```typescript
 * // Missing # prefix - added automatically
 * sanitizeHexColor('FF0000');    // '#FF0000'
 *
 * // Lowercase - converted to uppercase
 * sanitizeHexColor('#ff0000');   // '#FF0000'
 *
 * // Already valid - normalized
 * sanitizeHexColor('#F00');      // '#F00'
 *
 * // Invalid format - returns default
 * sanitizeHexColor('red');       // '#2196F3'
 * sanitizeHexColor('#ZZZZZZ');   // '#2196F3'
 * sanitizeHexColor('');          // '#2196F3'
 * ```
 *
 * @remarks
 * Default Color: Uses Material Blue (#2196F3) as fallback for invalid
 * inputs. This matches the default theme color used throughout the app.
 *
 * Uppercase Conversion: Hex colors are case-insensitive in CSS, but
 * uppercase is used for consistency and better readability.
 */
export function sanitizeHexColor(input: string): string {
  // Add # prefix if missing
  let color = input.startsWith("#") ? input : `#${input}`;

  // Convert to uppercase for consistency
  color = color.toUpperCase();

  // Validate format and return default if invalid
  return isValidHexColor(color) ? color : "#2196F3";
}

// ============================================================================
// Color Utility Functions
// ============================================================================

/**
 * Get contrasting text color for a background color.
 *
 * Uses relative luminance formula to determine if light or dark text
 * provides better contrast. Essential for accessibility and readability.
 *
 * Luminance Calculation:
 * Uses weighted RGB formula: 0.299*R + 0.587*G + 0.114*B
 * This approximates human perception where green appears brighter than
 * red, and red appears brighter than blue.
 *
 * Threshold: Luminance > 0.5 → use dark text, otherwise use light text
 *
 * @param backgroundColor - Background color in hex format
 * @returns Contrasting text color ('#333333' or '#ffffff')
 *
 * @example
 * ```typescript
 * // Light backgrounds → dark text
 * getContrastColor('#FFFFFF');   // '#333333' (dark gray)
 * getContrastColor('#FFFF00');   // '#333333' (yellow is bright)
 *
 * // Dark backgrounds → light text
 * getContrastColor('#000000');   // '#ffffff' (white)
 * getContrastColor('#0000FF');   // '#ffffff' (blue is dark)
 *
 * // Medium backgrounds depend on luminance
 * getContrastColor('#808080');   // '#333333' (medium gray)
 * getContrastColor('#2196F3');   // '#ffffff' (Material Blue)
 * ```
 *
 * @remarks
 * Color Choices:
 * - Light text: Pure white (#ffffff)
 * - Dark text: Dark gray (#333333) - softer than pure black
 *
 * Fallback: If parsing fails, defaults to dark text (#333333).
 * This is conservative and works well with most backgrounds.
 *
 * Accessibility: This is a simplified contrast calculation. For
 * WCAG compliance, use a proper contrast ratio calculator.
 */
export function getContrastColor(backgroundColor: string): string {
  // Parse background color
  const rgba = parseHexColor(backgroundColor);

  // If parsing failed, return default dark text
  if (!rgba) {
    return "#333333";
  }

  // Calculate relative luminance using weighted RGB formula
  // Weights reflect human perception:
  // - Green (0.587): Most prominent to human eye
  // - Red (0.299): Moderately prominent
  // - Blue (0.114): Least prominent
  const { r, g, b } = rgba;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white text for dark backgrounds, dark text for light backgrounds
  // Threshold of 0.5 provides good visual balance
  return luminance > 0.5 ? "#333333" : "#ffffff";
}

/**
 * Generate a palette of related colors for theming.
 *
 * Creates a range of shades from a base color by scaling RGB components.
 * Useful for generating color schemes or shading variations.
 *
 * @param baseColor - Base color in hex format
 * @param count - Number of colors to generate (default: 5)
 * @returns Array of hex colors from dark to light
 *
 * @example
 * ```typescript
 * // Generate 5 shades of red
 * const reds = generateColorPalette('#FF0000', 5);
 * // Result (approximate):
 * // ['#330000', '#660000', '#990000', '#CC0000', '#FF0000']
 *
 * // Generate 3 shades of blue
 * const blues = generateColorPalette('#0000FF', 3);
 * // Result (approximate):
 * // ['#000033', '#000080', '#0000CC']
 *
 * // Invalid color - returns original
 * const invalid = generateColorPalette('invalid', 5);
 * // Result: ['invalid']
 * ```
 *
 * @remarks
 * Scaling Range: Colors are scaled from 20% (darkest) to 80% (lightest)
 * of the base color. This prevents pure black and ensures variation.
 *
 * Formula: For each shade i: RGB * (0.2 + i/(count-1) * 0.6)
 *
 * Use Cases:
 * - Theme color variations
 * - Chart series color families
 * - Shading for 3D effects
 *
 * Limitation: This is a simple scaling approach. For sophisticated
 * color palettes, consider HSL/HSV color space transformations.
 */
export function generateColorPalette(
  baseColor: string,
  count: number = 5,
): string[] {
  // Parse base color
  const rgba = parseHexColor(baseColor);

  // If parsing failed, return array with original color
  if (!rgba) {
    return [baseColor];
  }

  const colors: string[] = [];
  const { r, g, b } = rgba;

  // Generate count colors by scaling RGB components
  for (let i = 0; i < count; i++) {
    // Calculate scaling factor from 0.2 (dark) to 0.8 (light)
    // Formula ensures even distribution across range
    const factor = 0.2 + (i / (count - 1)) * 0.6;

    // Scale each RGB component
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);

    // Convert to hex and add to palette
    colors.push(rgbaToHex(newR, newG, newB));
  }

  return colors;
}

/**
 * Clamp number between min and max values.
 *
 * Utility function for ensuring color component values stay within
 * valid ranges. Used internally by color conversion functions.
 *
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 *
 * @example
 * ```typescript
 * // Within range - unchanged
 * clamp(128, 0, 255);    // 128
 *
 * // Below minimum - clamped to min
 * clamp(-10, 0, 255);    // 0
 *
 * // Above maximum - clamped to max
 * clamp(300, 0, 255);    // 255
 *
 * // At boundaries
 * clamp(0, 0, 255);      // 0
 * clamp(255, 0, 255);    // 255
 * ```
 *
 * @remarks
 * Use Cases:
 * - Clamping RGB values to 0-255 range
 * - Clamping alpha values to 0-1 range
 * - Ensuring calculated values stay valid
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Extract solid color from fill color (removes transparency).
 *
 * Converts any color to fully opaque version. Used for price axis labels
 * where TradingView's lightweight-charts doesn't support transparency.
 *
 * @param fillColor - Fill color string (rgba or hex)
 * @returns Solid color string in rgba format with alpha = 1
 *
 * @example
 * ```typescript
 * // Semi-transparent red → opaque red
 * const solid1 = getSolidColorFromFill('rgba(255, 0, 0, 0.5)');
 * // Result: 'rgba(255, 0, 0, 1)'
 *
 * // Hex color → solid rgba
 * const solid2 = getSolidColorFromFill('#00FF00');
 * // Result: 'rgba(0, 255, 0, 1)'
 *
 * // Already solid → unchanged (except format)
 * const solid3 = getSolidColorFromFill('rgba(0, 0, 255, 1)');
 * // Result: 'rgba(0, 0, 255, 1)'
 *
 * // Invalid color → returns original
 * const invalid = getSolidColorFromFill('invalid');
 * // Result: 'invalid'
 * ```
 *
 * @remarks
 * Output Format: Always returns rgba() format, even for hex inputs.
 * This ensures consistency for contexts requiring rgba notation.
 *
 * Use Case: Primarily used for price axis labels where the chart
 * library requires solid colors for text rendering.
 */
export function getSolidColorFromFill(fillColor: string): string {
  // Parse color to extract RGB components
  const parsed = parseCssColor(fillColor);

  // If parsing failed, return original color
  if (!parsed) {
    return fillColor;
  }

  // Return solid version with alpha = 1 (fully opaque)
  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, 1)`;
}

/**
 * Debounce function for performance optimization.
 *
 * Creates a debounced version of a function that delays execution until
 * after a specified wait time has elapsed since the last call. Useful for
 * throttling expensive operations like color picker updates.
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds before execution
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * // Debounce color picker updates to reduce re-renders
 * const updateColor = (color: string) => {
 *   console.log('Updating color to:', color);
 * };
 *
 * const debouncedUpdate = debounce(updateColor, 300);
 *
 * // Called multiple times rapidly
 * debouncedUpdate('#FF0000');
 * debouncedUpdate('#FF0001');
 * debouncedUpdate('#FF0002');
 * // Only the last call executes after 300ms
 * // Output (after 300ms): "Updating color to: #FF0002"
 * ```
 *
 * @remarks
 * Timeout Clearing: Each call clears the previous timeout, resetting
 * the wait period. Only the final call in a burst gets executed.
 *
 * Memory: Maintains a closure with timeoutId. No cleanup needed as
 * garbage collection handles it when function is no longer referenced.
 *
 * Type Safety: Preserves function signature including parameter and
 * return types through TypeScript generics.
 *
 * Use Cases:
 * - Debouncing color picker onChange events
 * - Throttling search input for color names
 * - Reducing API calls for color validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  // Store timeout ID in closure
  let timeoutId: NodeJS.Timeout | null = null;

  // Return debounced function
  return (...args: Parameters<T>): void => {
    // Clear any existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      // Execute original function with provided arguments
      func(...args);
      // Clear timeout ID after execution
      timeoutId = null;
    }, wait);
  };
}
