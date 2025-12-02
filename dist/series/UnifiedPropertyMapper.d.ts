/**
 * @fileoverview Unified Property Mapper
 *
 * Descriptor-driven property mapper that replaces the 220-line seriesPropertyMapper.ts.
 * All mapping logic is now in descriptors - this just executes the mapping.
 */
/**
 * Line style conversion maps (backward compatibility)
 */
export declare const LINE_STYLE_TO_STRING: Record<number, string>;
export declare const STRING_TO_LINE_STYLE: Record<string, number>;
/**
 * Convert LightweightCharts API options (flat) to Dialog config (nested)
 *
 * @param seriesType - The series type (e.g., 'Line', 'Band', 'line', 'band')
 * @param apiOptions - Flat options from series.options()
 * @returns Nested config for dialog
 */
export declare function apiOptionsToDialogConfig(seriesType: string, apiOptions: any): any;
/**
 * Convert Dialog config (nested) to LightweightCharts API options (flat)
 *
 * @param seriesType - The series type (e.g., 'Line', 'Band', 'line', 'band')
 * @param dialogConfig - Nested config from dialog
 * @returns Flat options for series.applyOptions()
 */
export declare function dialogConfigToApiOptions(seriesType: string, dialogConfig: any): any;
/**
 * Legacy compatibility export
 */
export declare const PropertyMapper: {
    apiOptionsToDialogConfig: typeof apiOptionsToDialogConfig;
    dialogConfigToApiOptions: typeof dialogConfigToApiOptions;
    LINE_STYLE_TO_STRING: Record<number, string>;
    STRING_TO_LINE_STYLE: Record<string, number>;
};
export default PropertyMapper;
//# sourceMappingURL=UnifiedPropertyMapper.d.ts.map