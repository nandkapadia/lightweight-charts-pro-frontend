import { IChartApi } from 'lightweight-charts';
/**
 * Configuration for a rectangle overlay.
 */
export interface RectangleConfig {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    borderColor?: string;
    borderWidth?: number;
    fillOpacity?: number;
    borderOpacity?: number;
    label?: string;
    labelColor?: string;
    labelFontSize?: number;
    labelBackground?: string;
    labelPadding?: number;
    zIndex?: number;
}
export declare class RectangleOverlayPlugin {
    private rectangles;
    private chart;
    private container;
    private canvas;
    private ctx;
    private isDisposed;
    private isInitialized;
    private resizeObserverManager;
    private redrawTimeout;
    private lastCanvasSize;
    constructor();
    setChart(chart: IChartApi, _series?: any): void;
    addToChart(chart: IChartApi): void;
    remove(): void;
    setRectangles(rectangles: RectangleConfig[]): void;
    private render;
    private init;
    private createCanvas;
    private setupResizeObserver;
    private setupEventListeners;
    private resizeCanvas;
    private fallbackResizeCanvas;
    private handleResize;
    private scheduleRedraw;
    private redraw;
    private drawRectangle;
    private calculateActualCoordinates;
    private drawLabel;
    /**
     * Update canvas Z-index based on the highest Z-index of all rectangles
     * Default Z-index is 20 if no rectangles have Z-index specified
     */
    private updateCanvasZIndex;
    addRectangle(rect: RectangleConfig): void;
    removeRectangle(id: string): void;
    updateRectangle(id: string, updates: Partial<RectangleConfig>): void;
    clearRectangles(): void;
    getRectangles(): RectangleConfig[];
    dispose(): void;
}
//# sourceMappingURL=rectanglePlugin.d.ts.map