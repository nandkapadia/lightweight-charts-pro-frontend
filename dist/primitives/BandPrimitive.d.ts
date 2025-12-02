import { IChartApi, Time, PrimitivePaneViewZOrder } from 'lightweight-charts';
import { BaseSeriesPrimitive, BaseSeriesPrimitiveOptions, BaseProcessedData } from './BaseSeriesPrimitive';
/**
 * Data structure for band primitive with optional per-point color overrides
 *
 * @example
 * ```typescript
 * // Basic data point (uses global options)
 * { time: '2024-01-01', upper: 110, middle: 105, lower: 100 }
 *
 * // Per-point color overrides
 * {
 *   time: '2024-01-02',
 *   upper: 112, middle: 107, lower: 102,
 *   upperLineColor: '#ff0000',
 *   middleLineColor: '#00ff00',
 *   lowerLineColor: '#0000ff',
 *   upperFillColor: 'rgba(255,0,0,0.2)',
 *   lowerFillColor: 'rgba(0,0,255,0.2)'
 * }
 * ```
 */
export interface BandPrimitiveData {
    time: number | string;
    upper?: number | null;
    middle?: number | null;
    lower?: number | null;
    /**
     * Optional per-point color override for upper line.
     * If not specified, global upperLineColor option is used.
     */
    upperLineColor?: string;
    /**
     * Optional per-point color override for middle line.
     * If not specified, global middleLineColor option is used.
     */
    middleLineColor?: string;
    /**
     * Optional per-point color override for lower line.
     * If not specified, global lowerLineColor option is used.
     */
    lowerLineColor?: string;
    /**
     * Optional per-point color override for upper fill area.
     * If not specified, global upperFillColor option is used.
     */
    upperFillColor?: string;
    /**
     * Optional per-point color override for lower fill area.
     * If not specified, global lowerFillColor option is used.
     */
    lowerFillColor?: string;
}
/**
 * Options for band primitive
 */
export interface BandPrimitiveOptions extends BaseSeriesPrimitiveOptions {
    upperLineColor: string;
    upperLineWidth: 1 | 2 | 3 | 4;
    upperLineStyle: 0 | 1 | 2;
    upperLineVisible: boolean;
    middleLineColor: string;
    middleLineWidth: 1 | 2 | 3 | 4;
    middleLineStyle: 0 | 1 | 2;
    middleLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: 1 | 2 | 3 | 4;
    lowerLineStyle: 0 | 1 | 2;
    lowerLineVisible: boolean;
    upperFillColor: string;
    upperFill: boolean;
    lowerFillColor: string;
    lowerFill: boolean;
}
/**
 * Internal processed data structure with optional per-point color overrides
 */
interface BandProcessedData extends BaseProcessedData {
    time: Time;
    upper: number;
    middle: number;
    lower: number;
    upperLineColor?: string;
    middleLineColor?: string;
    lowerLineColor?: string;
    upperFillColor?: string;
    lowerFillColor?: string;
}
/**
 * Band Primitive
 *
 * Implements ISeriesPrimitive for z-order control and independent rendering.
 * Syncs data from attached ICustomSeries for autoscaling.
 *
 * Refactored to extend BaseSeriesPrimitive following DRY principles.
 */
export declare class BandPrimitive extends BaseSeriesPrimitive<BandProcessedData, BandPrimitiveOptions> {
    constructor(chart: IChartApi, options: BandPrimitiveOptions);
    /**
     * Returns settings schema for series dialog
     * Maps property names to their types for automatic UI generation
     */
    static getSettings(): {
        upperLine: "line";
        middleLine: "line";
        lowerLine: "line";
        upperFillColor: "color";
        upperFill: "boolean";
        lowerFillColor: "color";
        lowerFill: "boolean";
    };
    protected _initializeViews(): void;
    protected _processData(rawData: any[]): BandProcessedData[];
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
}
export {};
//# sourceMappingURL=BandPrimitive.d.ts.map