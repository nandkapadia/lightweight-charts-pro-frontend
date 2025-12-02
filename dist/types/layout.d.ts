/**
 * @fileoverview Layout and Positioning Types
 *
 * Type definitions for the chart widget management system.
 * Provides interfaces for positioning, dimensions, and layout management.
 *
 * This module provides:
 * - Corner positioning types
 * - Dimension interfaces
 * - Widget positioning interfaces
 * - Layout configuration types
 *
 * Features:
 * - Flexible corner-based positioning
 * - Axis-aware dimension tracking
 * - Widget stacking and priority
 * - Layout event handling
 *
 * @example
 * ```typescript
 * import { Corner, Position, IPositionableWidget } from './layout';
 *
 * const corner: Corner = 'top-right';
 * const position: Position = {
 *   top: 10,
 *   right: 10,
 *   zIndex: 100
 * };
 * ```
 */
export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export interface Dimensions {
    width: number;
    height: number;
}
export interface AxisDimensions {
    priceScale: {
        left: {
            width: number;
            height: number;
        };
        right: {
            width: number;
            height: number;
        };
    };
    timeScale: {
        width: number;
        height: number;
    };
}
export interface ChartLayoutDimensions {
    container: Dimensions;
    axis: AxisDimensions;
}
export interface Position {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    zIndex: number;
}
export interface WidgetDimensions {
    width: number;
    height: number;
}
export interface IPositionableWidget {
    id: string;
    corner: Corner;
    priority: number;
    visible: boolean;
    getDimensions(): WidgetDimensions;
    updatePosition(_position: Position): void;
}
export interface LayoutConfig {
    edgePadding: number;
    widgetGap: number;
    baseZIndex: number;
}
export interface CornerLayoutState {
    widgets: IPositionableWidget[];
    totalHeight: number;
    totalWidth: number;
}
export interface LayoutManagerEvents {
    onLayoutChanged: (_corner: Corner, _widgets: IPositionableWidget[]) => void;
    onOverflow: (_corner: Corner, _overflowingWidgets: IPositionableWidget[]) => void;
}
export interface PaneSize {
    width: number;
    height: number;
}
export interface PaneBounds {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
}
export interface WidgetPosition {
    x: number;
    y: number;
    width: number;
    height: number;
    isValid: boolean;
}
export interface LayoutWidget {
    id: string;
    width: number;
    height: number;
    position?: WidgetPosition;
    visible?: boolean;
    getDimensions?: () => {
        width: number;
        height: number;
    };
    getContainerClassName?: () => string;
}
//# sourceMappingURL=layout.d.ts.map