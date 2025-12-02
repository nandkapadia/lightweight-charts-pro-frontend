import { ChartCoordinates, PaneCoordinates, ValidationResult, BoundingBox, ScaleDimensions } from '../types/coordinates';
/**
 * Validates complete chart coordinates
 */
export declare function validateChartCoordinates(coordinates: ChartCoordinates): ValidationResult;
/**
 * Validates scale dimensions
 */
export declare function validateScaleDimensions(scale: ScaleDimensions | null, name: string): ValidationResult;
/**
 * Validates pane coordinates
 */
export declare function validatePaneCoordinates(pane: PaneCoordinates, index?: number): ValidationResult;
/**
 * Validates a bounding box
 */
export declare function validateBoundingBox(box: Partial<BoundingBox> | null, name?: string): ValidationResult;
/**
 * Sanitizes coordinates by applying fallbacks for invalid values
 */
export declare function sanitizeCoordinates(coordinates: Partial<ChartCoordinates>): ChartCoordinates;
/**
 * Creates a properly formed bounding box
 */
export declare function createBoundingBox(x: number, y: number, width: number, height: number): BoundingBox;
/**
 * Checks if coordinates are stale based on timestamp
 */
export declare function areCoordinatesStale(coordinates: ChartCoordinates, maxAge?: number): boolean;
/**
 * Debug helper to log coordinate validation results
 */
export declare function logValidationResult(result: ValidationResult, _context?: string): void;
/**
 * Gets comprehensive debug information about coordinates
 */
export declare function getCoordinateDebugInfo(coordinates: ChartCoordinates): {
    container: import('..').ContainerDimensions;
    timeScale: ScaleDimensions;
    panes: PaneCoordinates[];
    priceScales: {
        left: ScaleDimensions;
        right: ScaleDimensions;
    };
    validation: ValidationResult;
    summary: string;
};
//# sourceMappingURL=coordinateValidation.d.ts.map