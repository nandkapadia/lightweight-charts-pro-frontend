import { IChartApi, Time, PrimitivePaneViewZOrder } from 'lightweight-charts';
import { BaseSeriesPrimitive, BaseSeriesPrimitiveOptions, BaseProcessedData } from './BaseSeriesPrimitive';
/**
 * Data structure for gradient ribbon primitive
 */
export interface GradientRibbonPrimitiveData {
    time: number | string;
    upper?: number | null;
    lower?: number | null;
    fill?: string | null;
    gradient?: number | null;
}
/**
 * Options for gradient ribbon primitive
 */
export interface GradientRibbonPrimitiveOptions extends BaseSeriesPrimitiveOptions {
    upperLineColor: string;
    upperLineWidth: 1 | 2 | 3 | 4;
    upperLineStyle: 0 | 1 | 2;
    upperLineVisible: boolean;
    lowerLineColor: string;
    lowerLineWidth: 1 | 2 | 3 | 4;
    lowerLineStyle: 0 | 1 | 2;
    lowerLineVisible: boolean;
    fillVisible: boolean;
    gradientStartColor: string;
    gradientEndColor: string;
    normalizeGradients: boolean;
}
/**
 * Internal processed data structure
 */
interface GradientRibbonProcessedData extends BaseProcessedData {
    time: Time;
    upper: number;
    lower: number;
    gradientFactor: number;
    fillOverride?: string;
}
/**
 * Gradient Ribbon Primitive
 *
 * Implements ISeriesPrimitive for z-order control and independent rendering.
 * Syncs data from attached ICustomSeries for autoscaling.
 */
export declare class GradientRibbonPrimitive extends BaseSeriesPrimitive<GradientRibbonProcessedData, GradientRibbonPrimitiveOptions> {
    constructor(chart: IChartApi, options: GradientRibbonPrimitiveOptions);
    /**
     * Returns settings schema for series dialog
     * Maps property names to their types for automatic UI generation
     */
    static getSettings(): {
        upperLine: "line";
        lowerLine: "line";
        fillVisible: "boolean";
        gradientStartColor: "color";
        gradientEndColor: "color";
        normalizeGradients: "boolean";
    };
    protected _initializeViews(): void;
    protected _processData(rawData: any[]): GradientRibbonProcessedData[];
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
}
export {};
//# sourceMappingURL=GradientRibbonPrimitive.d.ts.map