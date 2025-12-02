import { ISeriesApi, LineStyle, LineWidth, SeriesOptionsMap } from 'lightweight-charts';
/**
 * Property types for dialog rendering
 */
export type PropertyType = 'boolean' | 'number' | 'color' | 'line' | 'lineStyle' | 'lineWidth';
/**
 * Line configuration for nested line editor
 */
export interface LineConfig {
    color: string;
    lineWidth: LineWidth;
    lineStyle: LineStyle;
}
/**
 * Property descriptor defining how a property behaves
 */
export interface PropertyDescriptor {
    /** Property type for UI rendering */
    type: PropertyType;
    /** Display label in dialog */
    label: string;
    /** Default value */
    default: unknown;
    /** API property names when flattened (for 'line' type) */
    apiMapping?: {
        /** Color property name in API (e.g., 'color', 'lineColor', 'upperLineColor') */
        colorKey?: string;
        /** Width property name in API (e.g., 'lineWidth', 'upperLineWidth') */
        widthKey?: string;
        /** Style property name in API (e.g., 'lineStyle', 'upperLineStyle') */
        styleKey?: string;
    };
    /** Optional validation function */
    validate?: (value: unknown) => boolean;
    /** Optional property description for tooltips */
    description?: string;
    /** Group name for organizing properties in UI */
    group?: string;
    /** Hide this property from the dialog UI (but still include in API) */
    hidden?: boolean;
}
/**
 * Series creator function type
 */
export type SeriesCreator<T = unknown> = (chart: unknown, data: unknown[], options: Partial<T>, paneId?: number) => ISeriesApi<keyof SeriesOptionsMap>;
/**
 * Unified Series Descriptor - Single source of truth for a series type
 * T represents the full series options (style + common options)
 */
export interface UnifiedSeriesDescriptor<T = unknown> {
    /** Series type identifier (e.g., 'Line', 'Area', 'Band') */
    type: string;
    /** Display name for UI */
    displayName: string;
    /** Property descriptors mapped by property name */
    properties: Record<string, PropertyDescriptor>;
    /** Default options using LightweightCharts types */
    defaultOptions: Partial<T>;
    /** Series creator function */
    create: SeriesCreator<T>;
    /** Whether this is a custom series (not built into LightweightCharts) */
    isCustom: boolean;
    /** Category for organizing series (e.g., 'Basic', 'Custom', 'Indicators') */
    category?: string;
    /** Optional series description */
    description?: string;
}
/**
 * Registry of all series descriptors
 */
export type SeriesDescriptorRegistry = Map<string, UnifiedSeriesDescriptor>;
/**
 * Helper to create property descriptors for common patterns
 */
export declare const PropertyDescriptors: {
    /**
     * Create a line property descriptor with proper API mapping
     */
    line(label: string, defaultColor: string, defaultWidth: LineWidth, defaultStyle: LineStyle, apiMapping: {
        colorKey: string;
        widthKey: string;
        styleKey: string;
    }): PropertyDescriptor;
    /**
     * Create a color property descriptor
     */
    color(label: string, defaultValue: string, group?: string): PropertyDescriptor;
    /**
     * Create a boolean property descriptor
     */
    boolean(label: string, defaultValue: boolean, group?: string): PropertyDescriptor;
    /**
     * Create a number property descriptor
     */
    number(label: string, defaultValue: number, group?: string, hidden?: boolean): PropertyDescriptor;
    /**
     * Create a lineStyle property descriptor
     */
    lineStyle(label: string, defaultValue: LineStyle, group?: string): PropertyDescriptor;
    /**
     * Create a lineWidth property descriptor
     */
    lineWidth(label: string, defaultValue: LineWidth, group?: string): PropertyDescriptor;
};
/**
 * Standard series properties that should be included in all series descriptors.
 * These correspond to SeriesOptionsCommon from lightweight-charts and are sent
 * in the options object from Python backend (properties without top_level=True).
 *
 * Including these in descriptors ensures:
 * 1. Properties are passed through when updating via dialog
 * 2. They have proper defaults
 * 3. Documentation is consistent
 *
 * Properties marked with hidden: true are not shown in the UI but are still
 * processed during property mapping to ensure consistency between JSON and Dialog paths.
 */
export declare const STANDARD_SERIES_PROPERTIES: Record<string, PropertyDescriptor>;
/**
 * Helper to extract default options from property descriptors
 */
export declare function extractDefaultOptions<T = unknown>(descriptor: UnifiedSeriesDescriptor<T>): Partial<T>;
/**
 * Helper to convert dialog config to API options using descriptor
 *
 * This function processes ALL properties including:
 * - Standard series properties (visible, title, zIndex, etc.) from STANDARD_SERIES_PROPERTIES
 * - Series-specific properties defined in each descriptor
 * - Hidden properties (marked with hidden: true) are still passed through
 *
 * This ensures consistency between:
 * 1. JSON path (Python → createSeriesWithConfig → series creation)
 * 2. Dialog path (UI changes → dialogConfigToApiOptions → series.applyOptions)
 */
export declare function dialogConfigToApiOptions<T = unknown>(descriptor: UnifiedSeriesDescriptor<T>, dialogConfig: Record<string, unknown>): Partial<T>;
/**
 * Helper to convert API options to dialog config using descriptor
 */
export declare function apiOptionsToDialogConfig<T = unknown>(descriptor: UnifiedSeriesDescriptor<T>, apiOptions: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=UnifiedSeriesDescriptor.d.ts.map