/**
 * @fileoverview Primitive Styling Utilities
 *
 * Standardized styling utilities for applying consistent styles across all
 * primitive components. Provides type-safe style application, CSS generation,
 * and common styling patterns.
 *
 * This module provides:
 * - Type-safe style interfaces (Base, Typography, Layout, Border, Shadow)
 * - CSS string generation from configuration objects
 * - Style merging and composition utilities
 * - Consistent styling patterns across primitives
 * - Responsive design helpers
 *
 * Architecture:
 * - Static utility class (no instantiation)
 * - Pure functions (no side effects)
 * - Type-safe with TypeScript interfaces
 * - Composable style configurations
 * - DRY principle for styling
 *
 * Features:
 * - Automatic unit handling (px, %, etc.)
 * - Style merging with precedence
 * - CSS variable support
 * - Hover and active state styles
 * - Transition and animation helpers
 *
 * @example
 * ```typescript
 * import { PrimitiveStylingUtils, BaseStyleConfig } from './PrimitiveStylingUtils';
 *
 * const baseStyle: BaseStyleConfig = {
 *   backgroundColor: '#1E222D',
 *   color: '#D1D4DC',
 *   fontSize: 12,
 *   borderRadius: 4,
 *   padding: 8
 * };
 *
 * const cssString = PrimitiveStylingUtils.toCssString(baseStyle);
 * element.style.cssText = cssString;
 * ```
 */
/**
 * Base style configuration interface
 */
export interface BaseStyleConfig {
    backgroundColor?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    borderRadius?: number;
    padding?: number | string;
    margin?: number | string;
    border?: string;
    transition?: string;
    cursor?: string;
    opacity?: number;
    zIndex?: number;
    boxShadow?: string;
    transform?: string;
}
/**
 * Typography configuration
 */
export interface TypographyConfig {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number | string;
    letterSpacing?: number | string;
}
/**
 * Layout configuration
 */
export interface LayoutConfig {
    width?: number | string;
    height?: number | string;
    padding?: number | string;
    margin?: number | string;
    display?: string;
    position?: string;
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
}
/**
 * Border configuration
 */
export interface BorderConfig {
    border?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
}
/**
 * Shadow configuration
 */
export interface ShadowConfig {
    boxShadow?: string;
    textShadow?: string;
}
/**
 * Standardized styling utility class
 */
export declare class PrimitiveStylingUtils {
    /**
     * Apply base styles to an element with fallback handling
     */
    static applyBaseStyles(element: HTMLElement, styles: BaseStyleConfig, defaults?: BaseStyleConfig): void;
    /**
     * Apply typography styles with consistent fallbacks
     */
    static applyTypography(element: HTMLElement, typography: TypographyConfig, defaults?: TypographyConfig): void;
    /**
     * Apply layout styles with consistent dimension handling
     */
    static applyLayout(element: HTMLElement, layout: LayoutConfig, defaults?: LayoutConfig): void;
    /**
     * Apply border styles with consistent formatting
     */
    static applyBorder(element: HTMLElement, border: BorderConfig, defaults?: BorderConfig): void;
    /**
     * Apply shadow effects with validation
     */
    static applyShadow(element: HTMLElement, shadow: ShadowConfig, defaults?: ShadowConfig): void;
    /**
     * Apply interaction states (hover, active, disabled) consistently
     */
    static applyInteractionState(element: HTMLElement, baseStyles: BaseStyleConfig, stateStyles: BaseStyleConfig, state?: 'default' | 'hover' | 'active' | 'disabled'): void;
    /**
     * Validate and normalize color values
     */
    static normalizeColor(color: string | undefined, fallback: string): string;
    /**
     * Validate and normalize numeric values with units
     */
    static normalizeNumericValue(value: number | string | undefined, unit?: string, fallback?: number): string;
    /**
     * Create a standardized flex container
     */
    static createFlexContainer(element: HTMLElement, direction?: 'row' | 'column', align?: string, justify?: string, gap?: number): void;
    /**
     * Apply consistent transition effects
     */
    static applyTransition(element: HTMLElement, properties?: string[], duration?: string, timing?: string): void;
    /**
     * Reset all styles to defaults (useful for cleanup)
     */
    /**
     * Apply position styles to an element.
     * Resets all position values first, then applies provided coordinates.
     * This is the single source of truth for position styling (DRY principle).
     *
     * @param element - The element to style
     * @param position - Position coordinates (top, right, bottom, left, zIndex)
     * @param setAbsolute - Whether to set position: absolute (default: true)
     */
    static applyPosition(element: HTMLElement, position: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
        zIndex?: number;
    }, setAbsolute?: boolean): void;
    /**
     * Reset position styles on an element.
     * Sets all position values to 'auto' for clean slate.
     *
     * @param element - The element to reset
     */
    static resetPosition(element: HTMLElement): void;
    static resetStyles(element: HTMLElement, preserveLayout?: boolean): void;
}
//# sourceMappingURL=PrimitiveStylingUtils.d.ts.map