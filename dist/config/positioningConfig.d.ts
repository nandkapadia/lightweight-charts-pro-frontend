/**
 * @fileoverview Positioning Configuration Constants
 *
 * Centralized configuration for all chart positioning and layout calculations.
 * Eliminates magic numbers and provides single source of truth for dimensions.
 *
 * This module provides:
 * - Standard margins for all components
 * - Default dimensions for chart elements
 * - Fallback values for error cases
 * - Z-index layering constants
 * - Timing and animation configurations
 *
 * Features:
 * - Unified spacing constants from PrimitiveDefaults
 * - Type-safe constant exports
 * - Configuration validation
 * - CSS class name generators
 *
 * @example
 * ```typescript
 * import { MARGINS, DIMENSIONS, Z_INDEX } from './positioningConfig';
 *
 * const legendMargin = MARGINS.legend.top;
 * const paneHeight = DIMENSIONS.pane.defaultHeight;
 * const zIndex = Z_INDEX.tooltip;
 * ```
 */
/**
 * Standard margins used throughout the application
 * All margins now use the centralized 6px constants for consistency
 */
export declare const MARGINS: {
    readonly legend: {
        readonly top: 6;
        readonly right: 6;
        readonly bottom: 6;
        readonly left: 6;
    };
    readonly pane: {
        readonly top: 6;
        readonly right: 6;
        readonly bottom: 6;
        readonly left: 6;
    };
    readonly content: {
        readonly top: 6;
        readonly right: 6;
        readonly bottom: 6;
        readonly left: 6;
    };
    readonly tooltip: {
        readonly top: 6;
        readonly right: 6;
        readonly bottom: 6;
        readonly left: 6;
    };
};
/**
 * Default dimensions for chart components
 */
export declare const DIMENSIONS: {
    readonly timeAxis: {
        readonly defaultHeight: 35;
        readonly minHeight: 25;
        readonly maxHeight: 50;
    };
    readonly priceScale: {
        readonly defaultWidth: 70;
        readonly minWidth: 50;
        readonly maxWidth: 100;
        readonly rightScaleDefaultWidth: 0;
    };
    readonly legend: {
        readonly defaultHeight: 80;
        readonly minHeight: 60;
        readonly maxHeight: 120;
        readonly defaultWidth: 200;
        readonly minWidth: 150;
    };
    readonly pane: {
        readonly defaultHeight: 200;
        readonly minHeight: 100;
        readonly maxHeight: 1000;
        readonly minWidth: 200;
        readonly maxWidth: 2000;
        readonly collapsedHeight: 30;
    };
    readonly chart: {
        readonly defaultWidth: 800;
        readonly defaultHeight: 600;
        readonly minWidth: 300;
        readonly minHeight: 200;
    };
};
/**
 * Fallback values for error cases
 */
export declare const FALLBACKS: {
    readonly paneHeight: 200;
    readonly paneWidth: 800;
    readonly chartWidth: 800;
    readonly chartHeight: 600;
    readonly timeScaleHeight: 35;
    readonly priceScaleWidth: 70;
    readonly containerWidth: 800;
    readonly containerHeight: 600;
};
/**
 * Z-index values for layering
 */
export declare const Z_INDEX: {
    readonly background: 0;
    readonly chart: 1;
    readonly pane: 10;
    readonly series: 20;
    readonly overlay: 30;
    readonly legend: 40;
    readonly tooltip: 50;
    readonly modal: 100;
};
/**
 * Animation and timing configurations
 */
export declare const TIMING: {
    readonly cacheExpiration: 5000;
    readonly cacheCleanupInterval: 10000;
    readonly debounceDelay: 100;
    readonly throttleDelay: 50;
    readonly animationDuration: 200;
    readonly chartReadyDelay: 300;
    readonly backendSyncDebounce: 300;
};
/**
 * Get margin configuration by feature type
 */
export declare function getMargins(feature: keyof typeof MARGINS): (typeof MARGINS)[keyof typeof MARGINS];
/**
 * Get dimension configuration by component type
 */
export declare function getDimensions(component: keyof typeof DIMENSIONS): (typeof DIMENSIONS)[keyof typeof DIMENSIONS];
/**
 * Get fallback value by type
 */
export declare function getFallback(type: keyof typeof FALLBACKS): number;
/**
 * Configuration validation
 */
export declare function validateConfiguration(): boolean;
/**
 * CSS class name generators
 * Centralizes all dynamic class name generation
 */
export declare const CSS_CLASSES: {
    /**
     * Generate series configuration dialog container class name
     */
    readonly seriesDialogContainer: (paneId: number) => string;
    /**
     * Generate pane button panel container class name
     */
    readonly paneButtonPanelContainer: (paneId: number) => string;
};
//# sourceMappingURL=positioningConfig.d.ts.map