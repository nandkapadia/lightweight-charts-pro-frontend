import { UTCTimestamp, SeriesMarker, Time } from 'lightweight-charts';
import { TradeConfig, TradeVisualizationOptions } from '../types';
export interface TradeRectangleData {
    time1: UTCTimestamp;
    time2: UTCTimestamp;
    price1: number;
    price2: number;
    fillColor: string;
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted";
    opacity: number;
    priceScaleId?: string;
    quantity?: number;
    notes?: string;
    tradeId?: string;
    isProfitable?: boolean;
    [key: string]: any;
}
export declare function createTradeVisualElements(trades: TradeConfig[], options: TradeVisualizationOptions, chartData?: any[], _priceScaleId?: string): {
    markers: SeriesMarker<Time>[];
    rectangles: TradeRectangleData[];
    annotations: any[];
};
/**
 * Convert trade rectangle data to RectanglePlugin format
 * This bridges the gap between trade data and the RectanglePlugin
 */
export declare function convertTradeRectanglesToPluginFormat(tradeRectangles: TradeRectangleData[], chart: any, series?: any): any[];
/**
 * Convert trade rectangles to plugin format after ensuring chart is ready
 */
export declare function convertTradeRectanglesToPluginFormatWhenReady(tradeRectangles: TradeRectangleData[], chart: any, series?: any): Promise<any[]>;
//# sourceMappingURL=tradeVisualization.d.ts.map