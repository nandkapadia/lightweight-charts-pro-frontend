/**
 * @fileoverview Unified color utilities for series rendering and UI
 *
 * This module consolidates all color manipulation functions from:
 * - colorUtils.ts (gradient/interpolation functions)
 * - helpers.ts (color conversion and validation functions)
 *
 * Key Features:
 * - Color format conversions (hex ↔ rgba)
 * - Color interpolation for gradients
 * - Color validation and sanitization
 * - CSS color generation with opacity
 * - Contrast color calculation
 */
/**
 * RGBA color components
 */
export interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
/**
 * Parse hex color to RGBA components
 * Supports 3, 4, 6, and 8 digit hex formats with alpha
 *
 * @param hex - Hex color string
 *   - 3-digit: '#RGB' (e.g., '#F00')
 *   - 4-digit: '#RGBA' (e.g., '#F008')
 *   - 6-digit: '#RRGGBB' (e.g., '#FF0000')
 *   - 8-digit: '#RRGGBBAA' (e.g., '#FF000080')
 * @returns RGBA color object or null if invalid
 */
export declare function parseHexColor(hex: string): RgbaColor | null;
/**
 * Parse CSS color value and extract RGBA components
 * Supports hex, rgb(), and rgba() formats
 *
 * @param cssColor - CSS color string
 * @returns RGBA color object or null if invalid
 */
export declare function parseCssColor(cssColor: string): RgbaColor | null;
/**
 * Convert hex color to RGBA string with alpha
 * This is the primary conversion function for canvas rendering
 *
 * @param hex - Hex color string (e.g., '#FF0000')
 * @param alpha - Alpha value between 0 and 1 (default: 1)
 * @returns RGBA color string (e.g., 'rgba(255, 0, 0, 1)')
 */
export declare function hexToRgbaString(hex: string, alpha?: number): string;
/**
 * Convert hex color to RGBA components object
 * Useful when you need individual color components
 *
 * @param hex - Hex color string
 * @returns RGBA color object or null if invalid
 */
export declare function hexToRgba(hex: string): RgbaColor | null;
/**
 * Convert RGBA values to hex color
 *
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string (e.g., '#FF0000')
 */
export declare function rgbaToHex(r: number, g: number, b: number): string;
/**
 * Convert CSS color to hex format
 *
 * @param cssColor - CSS color string (hex, rgb, or rgba)
 * @returns Hex color string
 */
export declare function cssToHex(cssColor: string): string;
/**
 * Extract hex color and opacity percentage from color string
 * Handles both hex and rgba formats
 *
 * @param color - Color in hex or rgba format
 * @returns Object with hex color and opacity percentage (0-100)
 */
export declare function extractColorAndOpacity(color: string): {
    color: string;
    opacity: number;
};
/**
 * Convert color and opacity percentage to CSS color string
 * Used by SeriesSettingsDialog for opacity controls
 * Handles both hex and rgba input formats
 *
 * @param color - Color in hex or rgba format
 * @param opacity - Opacity percentage (0-100)
 * @returns CSS color string with applied opacity
 */
export declare function toCss(color: string, opacity?: number): string;
/**
 * Interpolate between two hex colors
 * Used for gradient rendering
 *
 * @param startColor - Starting color in hex format (e.g., '#FF0000')
 * @param endColor - Ending color in hex format (e.g., '#00FF00')
 * @param factor - Interpolation factor between 0 and 1
 * @returns Interpolated color in hex format
 */
export declare function interpolateColor(startColor: string, endColor: string, factor: number): string;
/**
 * Generate gradient color based on value position and normalization
 * Used by gradient ribbon series
 *
 * @param value - Current value for gradient calculation
 * @param allValues - Array of all values for normalization
 * @param index - Current index in the array
 * @param startColor - Start color for gradient
 * @param endColor - End color for gradient
 * @param normalize - Whether to normalize based on value spread vs position
 * @returns Calculated gradient color
 */
export declare function calculateGradientColor(value: {
    upper: number;
    lower: number;
}, allValues: {
    upper: number;
    lower: number;
}[], index: number, startColor: string, endColor: string, normalize?: boolean): string;
/**
 * Check if a color is transparent or effectively invisible
 *
 * @param color - Color string to check
 * @returns True if color is transparent
 */
export declare function isTransparent(color: string): boolean;
/**
 * Validate hex color format
 *
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export declare function isValidHexColor(color: string): boolean;
/**
 * Sanitize hex color input
 * Adds # prefix if missing and validates format
 *
 * @param input - Color input string
 * @returns Sanitized hex color or default color if invalid
 */
export declare function sanitizeHexColor(input: string): string;
/**
 * Get contrasting text color for a background color
 * Uses relative luminance formula for accessibility
 *
 * @param backgroundColor - Background color in hex format
 * @returns Contrasting text color (light or dark)
 */
export declare function getContrastColor(backgroundColor: string): string;
/**
 * Generate a palette of related colors for theming
 *
 * @param baseColor - Base color in hex format
 * @param count - Number of colors to generate (default: 5)
 * @returns Array of hex colors
 */
export declare function generateColorPalette(baseColor: string, count?: number): string[];
/**
 * Clamp number between min and max values
 * Used for color component validation
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export declare function clamp(value: number, min: number, max: number): number;
/**
 * Extract solid color from fill color (removes transparency)
 * Used for price axis labels where transparency is not supported
 *
 * @param fillColor - Fill color string (rgba or hex)
 * @returns Solid color string in rgba format
 */
export declare function getSolidColorFromFill(fillColor: string): string;
/**
 * Debounce function for performance optimization
 * Useful for throttling color picker updates
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
//# sourceMappingURL=colorUtils.d.ts.map