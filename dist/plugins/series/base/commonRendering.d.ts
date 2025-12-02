import { Time, ISeriesApi, IChartApi, CustomData, CustomSeriesWhitespaceData } from 'lightweight-charts';
/**
 * Coordinate point with optional null values
 */
export interface CoordinatePoint {
    x: number | null;
    y: number | null;
}
/**
 * Multi-value coordinate point (for ribbons, bands, etc.)
 */
export interface MultiCoordinatePoint {
    x: number | null;
    [key: string]: number | null;
}
/**
 * Convert time to X coordinate
 *
 * @param time - Time value to convert
 * @param chart - Chart instance
 * @returns X coordinate or null if conversion fails
 */
export declare function timeToCoordinate(time: Time, chart: IChartApi): number | null;
/**
 * Convert price to Y coordinate
 *
 * @param price - Price value to convert
 * @param series - Series instance
 * @returns Y coordinate or null if conversion fails
 */
export declare function priceToCoordinate(price: number, series: ISeriesApi<any>): number | null;
/**
 * Check if coordinates are valid (not null)
 *
 * @param point - Coordinate point to validate
 * @returns True if all coordinates are non-null
 */
export declare function isValidCoordinate(point: CoordinatePoint | MultiCoordinatePoint): boolean;
/**
 * Draw a line on canvas with specified style
 *
 * Supports two modes:
 * - Custom Series mode: Pass bars array with visibleRange indices (no nulls expected)
 * - Primitive mode: Pass all coordinates, function handles nulls and gaps
 *
 * @param ctx - Canvas rendering context
 * @param coordinates - Array of coordinate points or bar data
 * @param color - Line color
 * @param lineWidth - Line width in pixels (should be pre-scaled by horizontalPixelRatio)
 * @param lineStyle - Line style (0=Solid, 1=Dotted, 2=Dashed)
 * @param startIndex - Optional start index for visible range
 * @param endIndex - Optional end index for visible range
 */
export declare function drawLine(ctx: CanvasRenderingContext2D, coordinates: CoordinatePoint[] | Array<{
    x: number;
    y: number;
}>, color: string, lineWidth: number, lineStyle?: number, startIndex?: number, endIndex?: number): void;
/**
 * Draw a multi-line (ribbon/band) on canvas
 *
 * Extracts one Y value from multi-value coordinates and draws it
 * Supports optional range for Custom Series mode
 *
 * @param ctx - Canvas rendering context
 * @param coordinates - Array of multi-value coordinate points or bar data
 * @param lineKey - Key for the line value (e.g., 'upper', 'lower', 'upperY', 'lowerY')
 * @param color - Line color
 * @param lineWidth - Line width in pixels (pre-scaled)
 * @param lineStyle - Line style
 * @param startIndex - Optional start index for visible range
 * @param endIndex - Optional end index for visible range
 */
export declare function drawMultiLine(ctx: CanvasRenderingContext2D, coordinates: MultiCoordinatePoint[] | Array<Record<string, number>>, lineKey: string, color: string, lineWidth: number, lineStyle?: number, startIndex?: number, endIndex?: number): void;
/**
 * Draw a filled area between two lines
 *
 * Supports two modes:
 * - Custom Series mode: Pass bars array with visibleRange indices (no nulls expected)
 * - Primitive mode: Pass all coordinates, function handles nulls and gaps
 *
 * @param ctx - Canvas rendering context
 * @param coordinates - Array of multi-value coordinate points or bar data
 * @param upperKey - Key for upper boundary (e.g., 'upper', 'upperY')
 * @param lowerKey - Key for lower boundary (e.g., 'lower', 'lowerY')
 * @param fillColor - Fill color (supports rgba)
 * @param startIndex - Optional start index for visible range
 * @param endIndex - Optional end index for visible range
 */
export declare function drawFillArea(ctx: CanvasRenderingContext2D, coordinates: MultiCoordinatePoint[] | Array<Record<string, number>>, upperKey: string, lowerKey: string, fillColor: string, startIndex?: number, endIndex?: number): void;
/**
 * Convert data items to screen coordinates
 *
 * @param items - Data items with time and price values
 * @param chart - Chart instance
 * @param series - Series instance
 * @param valueKeys - Keys for price values (e.g., ['upper', 'lower'])
 * @returns Array of multi-coordinate points
 */
export declare function convertToCoordinates<T extends {
    time: Time;
    [key: string]: any;
}>(items: T[], chart: IChartApi, series: ISeriesApi<any>, valueKeys: string[]): MultiCoordinatePoint[];
/**
 * Get bar spacing from chart
 *
 * @param chart - Chart instance
 * @returns Bar spacing in pixels
 */
export declare function getBarSpacing(chart: IChartApi): number;
/**
 * Whitespace checker for data with multiple value fields
 * Checks if all specified fields are null/undefined
 */
export declare function isWhitespaceDataMultiField<HorzScaleItem>(data: CustomData<HorzScaleItem> | CustomSeriesWhitespaceData<HorzScaleItem>, fields: string[]): data is CustomSeriesWhitespaceData<HorzScaleItem>;
//# sourceMappingURL=commonRendering.d.ts.map