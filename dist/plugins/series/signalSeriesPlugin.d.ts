import { CustomData, Time, CustomSeriesOptions, PaneRendererCustomData, CustomSeriesPricePlotValues, CustomSeriesWhitespaceData, ICustomSeriesPaneRenderer, ICustomSeriesPaneView, IChartApi } from 'lightweight-charts';
/**
 * Data point for Signal series
 *
 * @property time - Timestamp for the data point
 * @property value - Signal value (0=neutral, >0=signal, <0=alert)
 * @property color - Optional color override for this signal
 */
export interface SignalData extends CustomData<Time> {
    time: Time;
    value: number;
    color?: string;
}
/**
 * Configuration options for Signal series
 *
 * Colors:
 * @property neutralColor - Color for value 0 signals
 * @property signalColor - Color for positive value signals
 * @property alertColor - Color for negative value signals
 *
 * Series options:
 * @property lastValueVisible - Toggle last value visibility
 * @property title - Series title
 * @property priceLineVisible - Toggle price line visibility
 */
export interface SignalSeriesOptions extends CustomSeriesOptions {
    neutralColor?: string;
    signalColor?: string;
    alertColor?: string;
    lastValueVisible: boolean;
    title: string;
    visible: boolean;
    priceLineVisible: boolean;
    _usePrimitive?: boolean;
}
/**
 * Default options for Signal series
 * Note: lastValueVisible and priceLineVisible are false by default
 * since signals are background indicators
 * Note: alertColor is undefined by default - only used when explicitly set
 */
declare const defaultSignalOptions: SignalSeriesOptions;
/**
 * Signal Series - ICustomSeries implementation
 * Renders vertical background bands based on signal values
 */
export declare class SignalSeries<TData extends SignalData = SignalData> implements ICustomSeriesPaneView<Time, TData, SignalSeriesOptions> {
    private _renderer;
    constructor();
    /**
     * Build price values for autoscaling
     *
     * Signals don't have meaningful price values.
     * When using primitive mode, we return empty array to not affect autoscaling.
     * When not using primitive, we return the signal value to prevent errors.
     *
     * @param _plotRow - Data point (unused)
     * @returns Price value (empty when primitive is used)
     */
    priceValueBuilder(_plotRow: TData): CustomSeriesPricePlotValues;
    /**
     * Check if data point is whitespace
     *
     * @param data - Data point to check
     * @returns True if value is null/undefined
     */
    isWhitespace(data: TData | CustomSeriesWhitespaceData<Time>): data is CustomSeriesWhitespaceData<Time>;
    /**
     * Update renderer with new data
     *
     * @param data - Renderer data from chart
     * @param options - Series options
     */
    update(data: PaneRendererCustomData<Time, TData>, options: SignalSeriesOptions): void;
    /**
     * Get default options
     *
     * @returns Default options object
     */
    defaultOptions(): SignalSeriesOptions;
    /**
     * Get renderer
     *
     * @returns Renderer instance
     */
    renderer(): ICustomSeriesPaneRenderer;
}
/**
 * Create Signal series plugin
 *
 * @returns Signal series instance
 */
export declare function SignalSeriesPlugin(): ICustomSeriesPaneView<Time, SignalData, SignalSeriesOptions>;
/**
 * Create Signal series with optional primitive for background rendering
 *
 * Hybrid pattern:
 * - ICustomSeries: Always created for autoscaling
 * - Primitive: Optionally created for background rendering (usePrimitive: true)
 *
 * @param chart - Chart instance
 * @param options - Configuration options
 * @returns Object with series and optional primitive
 */
export declare function createSignalSeries(chart: IChartApi, options?: {
    neutralColor?: string;
    signalColor?: string;
    alertColor?: string;
    priceScaleId?: string;
    lastValueVisible?: boolean;
    title?: string;
    visible?: boolean;
    priceLineVisible?: boolean;
    usePrimitive?: boolean;
    zIndex?: number;
    data?: SignalData[];
    paneId?: number;
}): any;
/**
 * Legacy factory function for backward compatibility
 * @deprecated Use createSignalSeries instead
 */
export declare function createSignalSeriesPlugin(): ICustomSeriesPaneView<Time, SignalData, SignalSeriesOptions>;
export { defaultSignalOptions };
//# sourceMappingURL=signalSeriesPlugin.d.ts.map