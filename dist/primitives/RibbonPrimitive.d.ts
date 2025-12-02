import { IChartApi, Time, PrimitivePaneViewZOrder } from 'lightweight-charts';
import { BaseSeriesPrimitive, BaseSeriesPrimitiveOptions, BaseProcessedData } from './BaseSeriesPrimitive';
/**
 * Data structure for ribbon primitive with optional per-point color overrides
 *
 * @example
 * ```typescript
 * // Basic data point (uses global options)
 * { time: '2024-01-01', upper: 110, lower: 100 }
 *
 * // Per-point color overrides
 * {
 *   time: '2024-01-02',
 *   upper: 112, lower: 102,
 *   upperLineColor: '#ff0000',
 *   lowerLineColor: '#00ff00',
 *   fill: 'rgba(255,0,0,0.2)'
 * }
 * ```
 */
export interface RibbonPrimitiveData {
    time: number | string;
    upper?: number | null;
    lower?: number | null;
    /**
     * Optional per-point color override for the fill area.
     * If not specified, global fillColor option is used.
     */
    fill?: string;
    /**
     * Optional per-point color override for upper line.
     * If not specified, global upperLineColor option is used.
     */
    upperLineColor?: string;
    /**
     * Optional per-point color override for lower line.
     * If not specified, global lowerLineColor option is used.
     */
    lowerLineColor?: string;
}
/**
 * Options for ribbon primitive
 */
export interface RibbonPrimitiveOptions extends BaseSeriesPrimitiveOptions {
    upperLineColor: string;
    upperLineWidth: 1 | 2 | 3 | 4;
    upperLineStyle: 0 | 1 | 2;
    upperLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: 1 | 2 | 3 | 4;
    lowerLineStyle: 0 | 1 | 2;
    lowerLineVisible: boolean;
    fillColor: string;
    fillVisible: boolean;
}
/**
 * Internal processed data structure with optional per-point color overrides
 */
interface RibbonProcessedData extends BaseProcessedData {
    time: Time;
    upper: number;
    lower: number;
    fill?: string;
    upperLineColor?: string;
    lowerLineColor?: string;
}
/**
 * Ribbon Primitive
 *
 * Implements ISeriesPrimitive for z-order control and independent rendering.
 * Syncs data from attached ICustomSeries for autoscaling.
 *
 * Refactored to extend BaseSeriesPrimitive following DRY principles.
 */
export declare class RibbonPrimitive extends BaseSeriesPrimitive<RibbonProcessedData, RibbonPrimitiveOptions> {
    constructor(chart: IChartApi, options: RibbonPrimitiveOptions);
    /**
     * Returns settings schema for series dialog
     * Maps property names to their types for automatic UI generation
     */
    static getSettings(): {
        upperLine: "line";
        lowerLine: "line";
        fillVisible: "boolean";
        fillColor: "color";
    };
    protected _initializeViews(): void;
    protected _processData(rawData: any[]): RibbonProcessedData[];
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
}
export {};
//# sourceMappingURL=RibbonPrimitive.d.ts.map