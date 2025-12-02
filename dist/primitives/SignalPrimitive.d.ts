import { IChartApi, PrimitivePaneViewZOrder } from 'lightweight-charts';
import { BaseSeriesPrimitive, BaseSeriesPrimitiveOptions, BaseProcessedData } from './BaseSeriesPrimitive';
/**
 * Data structure for signal primitive (raw input)
 */
export interface SignalPrimitiveData {
    time: number | string;
    value?: number | null;
    color?: string | null;
}
/**
 * Options for signal primitive
 */
export interface SignalPrimitiveOptions extends BaseSeriesPrimitiveOptions {
    neutralColor: string;
    signalColor: string;
    alertColor?: string;
}
/**
 * Internal processed data structure
 */
interface SignalProcessedData extends BaseProcessedData {
    value: number;
    color?: string;
}
/**
 * Signal Primitive
 *
 * Implements ISeriesPrimitive for z-order control and background rendering.
 * Syncs data from attached ICustomSeries for autoscaling.
 *
 * Extends BaseSeriesPrimitive following DRY principles.
 */
export declare class SignalPrimitive extends BaseSeriesPrimitive<SignalProcessedData, SignalPrimitiveOptions> {
    constructor(chart: IChartApi, options: SignalPrimitiveOptions);
    /**
     * Returns settings schema for series dialog
     * Maps property names to their types for automatic UI generation
     */
    static getSettings(): {
        neutralColor: "color";
        signalColor: "color";
        alertColor: "color";
    };
    protected _initializeViews(): void;
    protected _processData(rawData: SignalPrimitiveData[]): SignalProcessedData[];
    protected _getDefaultZOrder(): PrimitivePaneViewZOrder;
}
export {};
//# sourceMappingURL=SignalPrimitive.d.ts.map