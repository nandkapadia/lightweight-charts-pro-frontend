/**
 * @fileoverview Series Settings Registry
 *
 * Descriptor-driven settings registry - derives settings from UnifiedSeriesDescriptor.
 * This replaces the old manual settings definitions.
 */
export type SettingType = "boolean" | "number" | "color" | "line" | "lineStyle" | "lineWidth";
export interface SeriesSettings {
    [propertyName: string]: SettingType;
}
/**
 * Get settings for a series type by deriving them from the series descriptor
 *
 * @param seriesType - The series type string (case-insensitive)
 * @param primitive - Optional primitive instance to check for static getSettings()
 * @returns Settings object mapping property names to types
 */
export declare function getSeriesSettings(seriesType: string | undefined, primitive?: any): SeriesSettings;
//# sourceMappingURL=seriesSettingsRegistry.d.ts.map