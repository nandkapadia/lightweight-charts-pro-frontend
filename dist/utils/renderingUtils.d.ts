import { ISeriesApi, ITimeScaleApi, Time, Coordinate, SeriesType } from 'lightweight-charts';
import { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from 'fancy-canvas';
/**
 * Common renderer data structure for coordinate-based rendering
 */
export interface RendererDataPoint {
    x: number;
    [key: string]: number;
}
/**
 * Point interface for canvas rendering
 */
export interface RenderPoint {
    x: Coordinate | number | null;
    y: Coordinate | number | null;
}
/**
 * Extended point with color for gradient rendering
 */
export interface ColoredRenderPoint extends RenderPoint {
    color?: string;
}
/**
 * Configuration for coordinate conversion
 */
export interface CoordinateConversionConfig {
    timeField: string;
    coordinateFields: string[];
}
/**
 * Visible range for rendering optimization
 */
export interface VisibleRange {
    from: number;
    to: number;
}
/**
 * Convert series data to renderer coordinates
 *
 * @param data - Array of data points with time and value properties
 * @param timeScale - Chart time scale for time-to-coordinate conversion
 * @param seriesMap - Map of field names to series APIs for price-to-coordinate conversion
 * @param config - Configuration specifying which fields to convert
 * @returns Array of renderer data points with x and y coordinates
 */
export declare function convertToRendererCoordinates<T extends {
    time: Time;
    [key: string]: Time | number;
}>(data: T[], timeScale: ITimeScaleApi<Time>, seriesMap: Record<string, ISeriesApi<SeriesType>>, config: CoordinateConversionConfig): RendererDataPoint[];
/**
 * Specialized coordinate conversion for two-line series (Ribbon, Gradient Ribbon)
 *
 * @param data - Array of data with time, upper, and lower values
 * @param timeScale - Chart time scale
 * @param upperSeries - Upper line series API
 * @param lowerSeries - Lower line series API
 * @returns Array of coordinate points with x, upperY, lowerY
 */
export declare function convertTwoLineCoordinates<T extends {
    time: Time;
    upper: number;
    lower: number;
}>(data: T[], timeScale: ITimeScaleApi<Time>, upperSeries: ISeriesApi<SeriesType>, lowerSeries: ISeriesApi<SeriesType>): Array<{
    x: Coordinate | number;
    upperY: Coordinate | number;
    lowerY: Coordinate | number;
} & Partial<T>>;
/**
 * Specialized coordinate conversion for three-line series (Band Series)
 *
 * @param data - Array of data with time, upper, middle, and lower values
 * @param timeScale - Chart time scale
 * @param upperSeries - Upper line series API
 * @param middleSeries - Middle line series API
 * @param lowerSeries - Lower line series API
 * @returns Array of coordinate points with x, upperY, middleY, lowerY
 */
export declare function convertThreeLineCoordinates<T extends {
    time: Time;
    upper: number;
    middle: number;
    lower: number;
}>(data: T[], timeScale: ITimeScaleApi<Time>, upperSeries: ISeriesApi<SeriesType>, middleSeries: ISeriesApi<SeriesType>, lowerSeries: ISeriesApi<SeriesType>): Array<{
    x: Coordinate | number;
    upperY: Coordinate | number;
    middleY: Coordinate | number;
    lowerY: Coordinate | number;
}>;
/**
 * Batch coordinate conversion with error handling
 *
 * @param items - Array of data items
 * @param timeScale - Chart time scale
 * @param seriesMap - Map of field names to series APIs
 * @param coordinateFields - Fields to convert
 * @returns Array of renderer data points (null for failed conversions)
 */
export declare function batchConvertCoordinates<T extends {
    time: Time;
    [key: string]: Time | number;
}>(items: T[], timeScale: ITimeScaleApi<Time>, seriesMap: Record<string, ISeriesApi<SeriesType>>, coordinateFields: string[]): Array<RendererDataPoint | null>;
/**
 * Check if a coordinate is valid for rendering
 *
 * @param coord - Coordinate value to validate
 * @returns True if coordinate is valid for rendering
 */
export declare function isValidCoordinate(coord: number | Coordinate | null | undefined): boolean;
/**
 * Check if a render point has valid coordinates
 *
 * @param point - Point to validate
 * @returns True if both x and y are valid
 */
export declare function isValidRenderPoint(point: RenderPoint): boolean;
/**
 * Filter valid render points for canvas drawing
 *
 * @param points - Array of points to filter
 * @returns Array of valid points only
 */
export declare function filterValidRenderPoints<T extends RenderPoint>(points: T[]): T[];
/**
 * Filter valid coordinate points for rendering
 *
 * @param points - Array of renderer data points
 * @returns Array of valid coordinate points
 */
export declare function filterValidCoordinates<T extends RendererDataPoint>(points: T[]): T[];
/**
 * Calculate visible range for efficient rendering
 * Works with any point type that has an x coordinate
 *
 * @param points - Array of points to analyze
 * @returns Visible range or null if no valid points
 */
export declare function calculateVisibleRange<T extends {
    x: number | Coordinate | null;
}>(points: T[]): VisibleRange | null;
/**
 * Sets up canvas context with proper scaling and optional z-index handling
 *
 * @param target - Canvas target from lightweight-charts
 * @param zIndex - Optional z-index for layering
 * @returns Setup function that provides scaled context
 */
export declare function setupCanvasContext(target: CanvasRenderingTarget2D, zIndex?: number): (callback: (ctx: CanvasRenderingContext2D) => void) => void;
/**
 * Execute rendering callback with properly scaled canvas context
 * This is the DRY helper for useBitmapCoordinateSpace pattern
 *
 * @param target - Canvas target from lightweight-charts
 * @param callback - Rendering function that receives scaled context
 *
 * @example
 * // Instead of:
 * target.useBitmapCoordinateSpace((scope: BitmapCoordinatesRenderingScope) => {
 *   const ctx = scope.context;
 *   ctx.scale(scope.horizontalPixelRatio, scope.verticalPixelRatio);
 *   // ... rendering code
 * });
 *
 * // Use:
 * renderWithScaledCanvas(target, (ctx) => {
 *   // ... rendering code
 * });
 */
export declare function renderWithScaledCanvas(target: CanvasRenderingTarget2D, callback: (ctx: CanvasRenderingContext2D, scope: BitmapCoordinatesRenderingScope) => void): void;
/**
 * Creates a fill path between upper and lower line points
 *
 * @param ctx - Canvas rendering context
 * @param upperPoints - Array of upper line points
 * @param lowerPoints - Array of lower line points
 * @param fillStyle - Fill style (color, gradient, etc.)
 */
export declare function createFillPath(ctx: CanvasRenderingContext2D, upperPoints: RenderPoint[], lowerPoints: RenderPoint[], fillStyle?: string | CanvasGradient): void;
/**
 * Creates a gradient fill between points with individual colors
 *
 * @param ctx - Canvas rendering context
 * @param upperPoints - Array of upper line points
 * @param lowerPoints - Array of lower line points
 * @param coloredPoints - Array of points with individual colors
 */
export declare function createGradientFillPath(ctx: CanvasRenderingContext2D, upperPoints: RenderPoint[], lowerPoints: RenderPoint[], coloredPoints: ColoredRenderPoint[]): void;
/**
 * Line style constants matching lightweight-charts LineStyle enum
 */
export declare enum LineStyle {
    Solid = 0,
    Dotted = 1,
    Dashed = 2,
    LargeDashed = 3,
    SparseDotted = 4
}
/**
 * Line style configuration
 */
export interface LineStyleConfig {
    color: string;
    lineWidth: number;
    lineStyle?: LineStyle;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
}
/**
 * Apply line dash pattern based on line style
 *
 * @param ctx - Canvas rendering context
 * @param lineStyle - Line style enum value
 */
export declare function applyLineDashPattern(ctx: CanvasRenderingContext2D, lineStyle?: LineStyle): void;
/**
 * Apply complete line style configuration to context
 *
 * @param ctx - Canvas rendering context
 * @param config - Line style configuration
 */
export declare function applyLineStyle(ctx: CanvasRenderingContext2D, config: LineStyleConfig): void;
/**
 * Draw a continuous line through multiple points with optional styling
 *
 * @param ctx - Canvas rendering context
 * @param points - Array of points to draw through
 * @param config - Line style configuration
 * @param options - Additional drawing options
 */
export declare function drawContinuousLine(ctx: CanvasRenderingContext2D, points: RenderPoint[], config: LineStyleConfig, options?: {
    extendStart?: number;
    extendEnd?: number;
    skipInvalid?: boolean;
    prevPoint?: RenderPoint;
    nextPoint?: RenderPoint;
}): void;
/**
 * Calculate pixel-perfect bar-width extensions for a segment
 * Uses the TradingView formula: Math.round((xMedia ± halfBarSpacing) * hRatio)
 *
 * @param firstPoint - First valid point in the segment
 * @param lastPoint - Last valid point in the segment
 * @param barSpacing - Bar spacing from chart (in media coordinates)
 * @param hRatio - Horizontal pixel ratio for scaling
 * @returns Object with extendStart and extendEnd values in pixels
 */
export declare function calculateBarWidthExtensions(firstPoint: RenderPoint, lastPoint: RenderPoint, barSpacing: number, hRatio: number): {
    extendStart: number;
    extendEnd: number;
};
/**
 * Interpolate Y coordinate at a given X position between two points
 * Uses linear interpolation: y = y1 + (y2 - y1) * (x - x1) / (x2 - x1)
 *
 * @param x - Target X coordinate
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns Interpolated Y coordinate
 */
export declare function interpolateY(x: number, x1: number, y1: number, x2: number, y2: number): number;
/**
 * Draw multiple line segments with different styles
 * Useful for drawing trend lines with color changes
 *
 * @param ctx - Canvas rendering context
 * @param segments - Array of segments with points and styles
 */
export declare function drawSegmentedLine<T extends RenderPoint>(ctx: CanvasRenderingContext2D, segments: Array<{
    points: T[];
    style: LineStyleConfig;
}>): void;
/**
 * Fill area configuration
 */
export interface FillAreaConfig {
    fillStyle: string | CanvasGradient;
    opacity?: number;
    edgeExtension?: {
        start: number;
        end: number;
    };
}
/**
 * Fill area between two lines with edge extension support
 * Enhanced version of createFillPath with more options
 *
 * @param ctx - Canvas rendering context
 * @param upperPoints - Upper boundary points
 * @param lowerPoints - Lower boundary points
 * @param config - Fill configuration
 */
export declare function fillBetweenLines(ctx: CanvasRenderingContext2D, upperPoints: RenderPoint[], lowerPoints: RenderPoint[], config: FillAreaConfig): void;
/**
 * Fill trapezoidal segments for trend fill series
 * Each segment is a trapezoid between two consecutive points
 *
 * @param ctx - Canvas rendering context
 * @param segments - Array of trapezoidal segments
 */
export declare function fillTrapezoidalSegments(ctx: CanvasRenderingContext2D, segments: Array<{
    x1: number;
    y1Upper: number;
    y1Lower: number;
    x2: number;
    y2Upper: number;
    y2Lower: number;
    fillStyle: string;
}>): void;
/**
 * Gradient stop definition
 */
export interface GradientStop {
    position: number;
    color: string;
}
/**
 * Create horizontal linear gradient from colored points
 * Handles position calculation and clamping automatically
 *
 * @param ctx - Canvas rendering context
 * @param startX - Start x coordinate
 * @param endX - End x coordinate
 * @param coloredPoints - Points with colors
 * @returns Canvas gradient
 */
export declare function createHorizontalGradient(ctx: CanvasRenderingContext2D, startX: number, endX: number, coloredPoints: ColoredRenderPoint[]): CanvasGradient;
/**
 * Create vertical linear gradient with color stops
 *
 * @param ctx - Canvas rendering context
 * @param startY - Start y coordinate
 * @param endY - End y coordinate
 * @param stops - Gradient color stops
 * @returns Canvas gradient
 */
export declare function createVerticalGradient(ctx: CanvasRenderingContext2D, startY: number, endY: number, stops: GradientStop[]): CanvasGradient;
/**
 * Canvas state configuration
 */
export interface CanvasState {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    globalAlpha?: number;
    globalCompositeOperation?: GlobalCompositeOperation;
    lineCap?: CanvasLineCap;
    lineJoin?: CanvasLineJoin;
    lineDash?: number[];
}
/**
 * Execute callback with saved and restored canvas state
 * Prevents state leakage between rendering operations
 *
 * @param ctx - Canvas rendering context
 * @param callback - Function to execute with saved state
 */
export declare function withSavedState(ctx: CanvasRenderingContext2D, callback: (ctx: CanvasRenderingContext2D) => void): void;
/**
 * Apply canvas state properties
 *
 * @param ctx - Canvas rendering context
 * @param state - State properties to apply
 */
export declare function applyCanvasState(ctx: CanvasRenderingContext2D, state: CanvasState): void;
/**
 * Rectangle drawing configuration
 */
export interface RectangleConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
}
/**
 * Draw rectangle with fill and stroke options
 *
 * @param ctx - Canvas rendering context
 * @param config - Rectangle configuration
 */
export declare function drawRectangle(ctx: CanvasRenderingContext2D, config: RectangleConfig): void;
/**
 * Fill vertical band (for signal series)
 *
 * @param ctx - Canvas rendering context
 * @param x1 - Start x coordinate
 * @param x2 - End x coordinate
 * @param y1 - Top y coordinate
 * @param y2 - Bottom y coordinate
 * @param fillStyle - Fill style
 */
export declare function fillVerticalBand(ctx: CanvasRenderingContext2D, x1: number, x2: number, y1: number, y2: number, fillStyle: string): void;
/**
 * Coordinate bounds for validation
 */
export interface CoordinateBounds {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    tolerance?: number;
}
/**
 * Validate coordinate with bounds checking
 *
 * @param coord - Coordinate to validate
 * @param bounds - Optional bounds constraints
 * @returns True if coordinate is valid
 */
export declare function isValidCoordinateWithBounds(coord: number | Coordinate | null | undefined, bounds?: CoordinateBounds): boolean;
/**
 * Filter points by bounds
 *
 * @param points - Points to filter
 * @param bounds - Bounds constraints
 * @returns Filtered points within bounds
 */
export declare function filterPointsByBounds<T extends RenderPoint>(points: T[], bounds: CoordinateBounds): T[];
/**
 * Edge extension configuration
 */
export interface EdgeExtensionConfig {
    barWidth: number;
    extensionPixels?: number;
}
/**
 * Calculate extended x-range for fills/lines
 * Accounts for bar width and custom extension
 *
 * @param firstPoint - First data point
 * @param lastPoint - Last data point
 * @param config - Extension configuration
 * @returns Extended start and end x coordinates
 */
export declare function calculateExtendedRange(firstPoint: RenderPoint, lastPoint: RenderPoint, config: EdgeExtensionConfig): {
    startX: number;
    endX: number;
};
//# sourceMappingURL=renderingUtils.d.ts.map