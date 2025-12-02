import { BasePanePrimitive, BasePrimitiveConfig } from './BasePanePrimitive';
/**
 * Configuration for LegendPrimitive
 */
export interface LegendPrimitiveConfig extends BasePrimitiveConfig {
    /**
     * Legend text template (supports placeholders like $$value$$, $$open$$, etc.)
     */
    text: string;
    /**
     * Value formatting configuration
     */
    valueFormat?: string;
    /**
     * Whether this is a pane-specific primitive (vs chart-level)
     */
    isPanePrimitive?: boolean;
    /**
     * Pane ID for pane-specific legends
     */
    paneId?: number;
    /**
     * Legend styling
     */
    style?: BasePrimitiveConfig['style'] & {
        /**
         * Text alignment
         */
        textAlign?: 'left' | 'center' | 'right';
        /**
         * Font weight
         */
        fontWeight?: 'normal' | 'bold' | 'lighter' | number;
        /**
         * Text shadow
         */
        textShadow?: string;
        /**
         * Background opacity
         */
        backgroundOpacity?: number;
        /**
         * Border configuration
         */
        border?: {
            width?: number;
            color?: string;
            style?: 'solid' | 'dashed' | 'dotted';
        };
    };
}
/**
 * LegendPrimitive - A lightweight-charts pane primitive for displaying legends
 *
 * This primitive provides:
 * - Smart template processing with $$value$$, $$open$$, $$close$$, etc. placeholders
 * - Automatic crosshair value updates
 * - Corner-based positioning with layout management
 * - Pane-specific or chart-level positioning
 * - Configurable styling and formatting
 *
 * Example usage:
 * ```typescript
 * const legend = new LegendPrimitive('my-legend', {
 *   corner: 'top-left',
 *   priority: PrimitivePriority.LEGEND,
 *   text: 'Price: $$value$$',
 *   valueFormat: '.2f',
 *   style: {
 *     backgroundColor: 'rgba(0, 0, 0, 0.8)',
 *     color: 'white',
 *     padding: 8
 *   }
 * })
 *
 * // Add to pane
 * pane.attachPrimitive(legend)
 * ```
 */
export declare class LegendPrimitive extends BasePanePrimitive<LegendPrimitiveConfig> {
    constructor(id: string, config: LegendPrimitiveConfig);
    /**
     * Get the template string for this legend
     */
    protected getTemplate(): string;
    /**
     * Render the legend content to the container
     */
    protected renderContent(): void;
    /**
     * Apply legend-specific styling using standardized utilities
     */
    private applyLegendStyling;
    /**
     * Adjust color opacity
     */
    private adjustColorOpacity;
    /**
     * Get CSS class name for the container
     */
    protected getContainerClassName(): string;
    /**
     * Override pane ID for pane-specific legends
     */
    protected getPaneId(): number;
    /**
     * Setup custom event subscriptions for legend updates
     */
    protected setupCustomEventSubscriptions(): void;
    /**
     * Handle crosshair move for legend value updates
     */
    protected onCrosshairMove(event: {
        time: any;
        point: {
            x: number;
            y: number;
        } | null;
        seriesData: Map<any, any>;
    }): void;
    /**
     * Update legend content from crosshair data
     */
    private updateLegendFromCrosshair;
    /**
     * Called when container is created
     */
    protected onContainerCreated(_container: HTMLElement): void;
    /**
     * Update legend text template
     */
    updateText(text: string): void;
    /**
     * Update value format
     */
    updateValueFormat(format: string): void;
    /**
     * Get current legend content
     */
    getCurrentContent(): string;
    /**
     * Force update legend content
     */
    forceUpdate(): void;
}
/**
 * Factory function to create legend primitives
 */
export declare function createLegendPrimitive(id: string, config: Partial<LegendPrimitiveConfig> & {
    text: string;
    corner: any;
}): LegendPrimitive;
/**
 * Default legend configurations
 */
export declare const DefaultLegendConfigs: {
    /**
     * Simple value legend
     */
    readonly simple: {
        readonly text: "$$value$$";
        readonly valueFormat: ".2f";
        readonly style: {
            readonly backgroundColor: "rgba(0, 0, 0, 0.8)";
            readonly color: "white";
            readonly padding: 6;
            readonly borderRadius: 4;
        };
    };
    /**
     * OHLC candlestick legend
     */
    readonly ohlc: {
        readonly text: "O: $$open$$ H: $$high$$ L: $$low$$ C: $$close$$";
        readonly valueFormat: ".2f";
        readonly style: {
            readonly backgroundColor: "rgba(0, 0, 0, 0.8)";
            readonly color: "white";
            readonly padding: 6;
            readonly borderRadius: 4;
            readonly fontSize: 11;
        };
    };
    /**
     * Volume legend
     */
    readonly volume: {
        readonly text: "Vol: $$volume$$";
        readonly valueFormat: ".0f";
        readonly style: {
            readonly backgroundColor: "rgba(100, 100, 100, 0.8)";
            readonly color: "white";
            readonly padding: 6;
            readonly borderRadius: 4;
        };
    };
    /**
     * Band/ribbon legend
     */
    readonly band: {
        readonly text: "U: $$upper$$ M: $$middle$$ L: $$lower$$";
        readonly valueFormat: ".3f";
        readonly style: {
            readonly backgroundColor: "rgba(0, 50, 100, 0.8)";
            readonly color: "white";
            readonly padding: 6;
            readonly borderRadius: 4;
            readonly fontSize: 11;
        };
    };
};
//# sourceMappingURL=LegendPrimitive.d.ts.map