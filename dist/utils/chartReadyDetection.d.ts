import { IChartApi, ISeriesApi, UTCTimestamp, SeriesType } from 'lightweight-charts';
/**
 * Utility class for detecting when charts are ready with multiple fallback methods.
 *
 * Enhanced with comprehensive readiness checks using existing coordinate services
 * for consistent validation across the application.
 */
export declare class ChartReadyDetector {
    /**
     * Wait for chart to be fully ready with proper dimensions (legacy method)
     */
    static waitForChartReady(chart: IChartApi | null, container: HTMLElement | null, options?: {
        minWidth?: number;
        minHeight?: number;
        maxAttempts?: number;
        baseDelay?: number;
    }): Promise<boolean>;
    /**
     * Comprehensive chart readiness check for primitives attachment
     * Uses existing coordinate services for consistency and performance
     */
    static waitForChartReadyForPrimitives(chart: IChartApi | null, series: ISeriesApi<SeriesType> | null, options?: {
        testTime?: UTCTimestamp;
        testPrice?: number;
        maxAttempts?: number;
        baseDelay?: number;
        requireData?: boolean;
    }): Promise<boolean>;
    /**
     * Quick synchronous check if chart is ready for primitives
     * Uses existing coordinate service for consistency
     */
    static isChartReadyForPrimitivesSync(chart: IChartApi | null, series: ISeriesApi<SeriesType> | null, options?: {
        testTime?: UTCTimestamp;
        testPrice?: number;
        requireData?: boolean;
    }): boolean;
    /**
     * Check if chart is ready synchronously (for immediate checks)
     */
    static isChartReadySync(chart: IChartApi | null, container: HTMLElement | null, minWidth?: number, minHeight?: number): boolean;
    /**
     * Wait for specific chart element to be ready
     */
    static waitForElementReady(selector: string, container: HTMLElement | null, options?: {
        maxAttempts?: number;
        baseDelay?: number;
    }): Promise<Element | null>;
}
//# sourceMappingURL=chartReadyDetection.d.ts.map