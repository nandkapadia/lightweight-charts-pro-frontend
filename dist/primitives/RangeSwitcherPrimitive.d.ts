import { BasePanePrimitive, BasePrimitiveConfig } from './BasePanePrimitive';
/**
 * Predefined time range values for easy configuration
 */
export declare enum TimeRange {
    FIVE_MINUTES = "FIVE_MINUTES",
    FIFTEEN_MINUTES = "FIFTEEN_MINUTES",
    THIRTY_MINUTES = "THIRTY_MINUTES",
    ONE_HOUR = "ONE_HOUR",
    FOUR_HOURS = "FOUR_HOURS",
    ONE_DAY = "ONE_DAY",
    ONE_WEEK = "ONE_WEEK",
    TWO_WEEKS = "TWO_WEEKS",
    ONE_MONTH = "ONE_MONTH",
    THREE_MONTHS = "THREE_MONTHS",
    SIX_MONTHS = "SIX_MONTHS",
    ONE_YEAR = "ONE_YEAR",
    TWO_YEARS = "TWO_YEARS",
    FIVE_YEARS = "FIVE_YEARS",
    ALL = "ALL"
}
/**
 * Range configuration for time switching
 * Supports both enum values and custom seconds for flexibility
 */
export interface RangeConfig {
    /**
     * Display text for the range
     */
    text: string;
    /**
     * Time range - can be enum value or custom seconds
     * Use TimeRange enum for predefined ranges, or number for custom seconds
     * Use null or TimeRange.ALL for "All" range
     */
    range: TimeRange | number | null;
    /**
     * @deprecated Use 'range' instead. This is kept for backwards compatibility.
     */
    seconds?: number | null;
}
/**
 * Get the range value from a RangeConfig, supporting both new and legacy formats
 */
export declare function getRangeValue(rangeConfig: RangeConfig): TimeRange | number | null;
/**
 * Check if a range represents "All" (show all data)
 */
export declare function isAllRange(rangeConfig: RangeConfig): boolean;
/**
 * Convert TimeRange enum or value to seconds
 */
export declare function getSecondsFromRange(range: TimeRange | number | null): number | null;
/**
 * Configuration for RangeSwitcherPrimitive
 */
export interface RangeSwitcherPrimitiveConfig extends BasePrimitiveConfig {
    /**
     * Available time ranges
     */
    ranges: RangeConfig[];
    /**
     * Callback when range changes
     */
    onRangeChange?: (_range: RangeConfig, _index: number) => void;
    /**
     * Range switcher styling
     */
    style?: BasePrimitiveConfig["style"] & {
        /**
         * Button styling
         */
        button?: {
            backgroundColor?: string;
            color?: string;
            hoverBackgroundColor?: string;
            hoverColor?: string;
            border?: string;
            borderRadius?: number;
            padding?: string;
            margin?: string;
            fontSize?: number;
            fontWeight?: string | number;
            minWidth?: number;
        };
        /**
         * Container styling
         */
        container?: {
            display?: "flex" | "block";
            flexDirection?: "row" | "column";
            gap?: number;
            alignItems?: string;
            justifyContent?: string;
        };
    };
}
/**
 * RangeSwitcherPrimitive - A lightweight-charts pane primitive for time range switching
 *
 * This primitive provides:
 * - Interactive time range buttons (1D, 7D, 1M, 3M, 1Y, All)
 * - Chart-level positioning (typically top-right corner)
 * - Automatic chart time scale updates
 * - Configurable styling and ranges
 * - Event integration for range changes
 *
 * Example usage:
 * ```typescript
 * const rangeSwitcher = new RangeSwitcherPrimitive('range-switcher', {
 *   corner: 'top-right',
 *   priority: PrimitivePriority.RANGE_SWITCHER,
 *   ranges: [
 *     { text: '1D', seconds: 86400 },
 *     { text: '7D', seconds: 604800 },
 *     { text: '1M', seconds: 2592000 },
 *     { text: 'All', seconds: null }
 *   ],
 *   onRangeChange: (range) => {
 *     // Range changed to: range.text
 *   }
 * })
 *
 * // Add to chart (chart-level, not pane-specific)
 * chart.attachPrimitive(rangeSwitcher)
 * ```
 */
export declare class RangeSwitcherPrimitive extends BasePanePrimitive<RangeSwitcherPrimitiveConfig> {
    private buttonElements;
    private buttonEventCleanupFunctions;
    private dataTimespan;
    private initialVisibilitySetupComplete;
    private dataChangeIntervalId;
    constructor(id: string, config: RangeSwitcherPrimitiveConfig);
    /**
     * Get the template string (not used for interactive elements)
     */
    protected getTemplate(): string;
    /**
     * Render the range switcher buttons
     */
    protected renderContent(): void;
    /**
     * Create a single range button
     */
    private createRangeButton;
    /**
     * Create the basic button element with attributes
     */
    private createButtonElement;
    /**
     * Attach event handlers to range button
     */
    private attachButtonEventHandlers;
    /**
     * Create event handler functions for range button
     */
    private createButtonEventHandlers;
    /**
     * Clean up button event listeners
     */
    private cleanupButtonEventListeners;
    /**
     * Apply container styling
     */
    private applyContainerStyling;
    /**
     * Apply button styling using standardized utilities
     */
    private applyButtonStyling;
    /**
     * Handle range button click
     */
    private handleRangeClick;
    /**
     * Apply range to chart time scale
     */
    private applyRangeToChart;
    /**
     * Get the last bar time from all series in the chart
     * @returns Last bar timestamp in seconds, or null if no data
     */
    private getLastBarTime;
    /**
     * Get the timespan of available data in seconds
     */
    private getDataTimespan;
    /**
     * Check if a range is valid for the current data
     */
    private isRangeValidForData;
    /**
     * Get CSS class name for the container
     */
    protected getContainerClassName(): string;
    /**
     * Override pane ID - range switcher is chart-level (pane 0)
     */
    protected getPaneId(): number;
    /**
     * Override detached to ensure proper cleanup
     */
    detached(): void;
    /**
     * Setup custom event subscriptions
     */
    protected setupCustomEventSubscriptions(): void;
    /**
     * Handle data updates that might affect range visibility
     * Only processes during initial setup, not after user interactions
     */
    private handleDataUpdate;
    /**
     * Update range button visibility based on current data
     * Only hides buttons during initial setup, not after user interactions
     */
    private updateRangeButtonVisibility;
    /**
     * Called when container is created
     */
    protected onContainerCreated(container: HTMLElement): void;
    /**
     * Set up observer to detect chart data changes
     */
    private setupDataChangeObserver;
    /**
     * Mark initial visibility setup as complete and stop the interval
     */
    private completeInitialSetup;
    /**
     * Add a new range
     */
    addRange(range: RangeConfig): void;
    /**
     * Remove a range by index
     */
    removeRange(index: number): void;
    /**
     * Update ranges
     */
    updateRanges(ranges: RangeConfig[]): void;
    /**
     * Invalidate cached data timespan (call when data changes)
     */
    invalidateDataTimespan(): void;
    /**
     * Get the current data timespan in seconds
     */
    getDataTimespanSeconds(): number | null;
    /**
     * Force update of range button visibility
     * Useful when called externally after data changes
     */
    updateButtonVisibility(): void;
    /**
     * Get information about hidden ranges
     */
    getHiddenRanges(): Array<{
        range: RangeConfig;
        index: number;
        reason: string;
    }>;
    /**
     * Get information about visible ranges
     */
    getVisibleRangeInfo(): Array<{
        range: RangeConfig;
        index: number;
        dataTimespan: number | null;
    }>;
    /**
     * Programmatically trigger range change
     */
    triggerRangeChange(index: number): void;
}
/**
 * Factory function to create range switcher primitives
 */
export declare function createRangeSwitcherPrimitive(id: string, config: Partial<RangeSwitcherPrimitiveConfig> & {
    ranges: RangeConfig[];
    corner: any;
}): RangeSwitcherPrimitive;
/**
 * Default range configurations using the new enum system
 * Easier to use and less error-prone than manual seconds configuration
 */
export declare const DefaultRangeConfigs: {
    /**
     * Standard trading ranges (using enum)
     */
    readonly trading: readonly [{
        readonly text: "1D";
        readonly range: TimeRange.ONE_DAY;
    }, {
        readonly text: "7D";
        readonly range: TimeRange.ONE_WEEK;
    }, {
        readonly text: "1M";
        readonly range: TimeRange.ONE_MONTH;
    }, {
        readonly text: "3M";
        readonly range: TimeRange.THREE_MONTHS;
    }, {
        readonly text: "1Y";
        readonly range: TimeRange.ONE_YEAR;
    }, {
        readonly text: "All";
        readonly range: TimeRange.ALL;
    }];
    /**
     * Short-term trading ranges (using enum)
     */
    readonly shortTerm: readonly [{
        readonly text: "5M";
        readonly range: TimeRange.FIVE_MINUTES;
    }, {
        readonly text: "15M";
        readonly range: TimeRange.FIFTEEN_MINUTES;
    }, {
        readonly text: "30M";
        readonly range: TimeRange.THIRTY_MINUTES;
    }, {
        readonly text: "1H";
        readonly range: TimeRange.ONE_HOUR;
    }, {
        readonly text: "4H";
        readonly range: TimeRange.FOUR_HOURS;
    }, {
        readonly text: "1D";
        readonly range: TimeRange.ONE_DAY;
    }, {
        readonly text: "All";
        readonly range: TimeRange.ALL;
    }];
    /**
     * Long-term investment ranges (using enum)
     */
    readonly longTerm: readonly [{
        readonly text: "1M";
        readonly range: TimeRange.ONE_MONTH;
    }, {
        readonly text: "3M";
        readonly range: TimeRange.THREE_MONTHS;
    }, {
        readonly text: "6M";
        readonly range: TimeRange.SIX_MONTHS;
    }, {
        readonly text: "1Y";
        readonly range: TimeRange.ONE_YEAR;
    }, {
        readonly text: "2Y";
        readonly range: TimeRange.TWO_YEARS;
    }, {
        readonly text: "5Y";
        readonly range: TimeRange.FIVE_YEARS;
    }, {
        readonly text: "All";
        readonly range: TimeRange.ALL;
    }];
    /**
     * Custom minimal ranges (using enum)
     */
    readonly minimal: readonly [{
        readonly text: "1D";
        readonly range: TimeRange.ONE_DAY;
    }, {
        readonly text: "1W";
        readonly range: TimeRange.ONE_WEEK;
    }, {
        readonly text: "1M";
        readonly range: TimeRange.ONE_MONTH;
    }, {
        readonly text: "All";
        readonly range: TimeRange.ALL;
    }];
    /**
     * @deprecated Legacy configurations (kept for backwards compatibility)
     * Use the enum-based configurations above for new implementations
     */
    readonly legacy: {
        readonly trading: readonly [{
            readonly text: "1D";
            readonly seconds: 86400;
        }, {
            readonly text: "7D";
            readonly seconds: 604800;
        }, {
            readonly text: "1M";
            readonly seconds: 2592000;
        }, {
            readonly text: "3M";
            readonly seconds: 7776000;
        }, {
            readonly text: "1Y";
            readonly seconds: 31536000;
        }, {
            readonly text: "All";
            readonly seconds: number | null;
        }];
        readonly shortTerm: readonly [{
            readonly text: "5M";
            readonly seconds: 300;
        }, {
            readonly text: "15M";
            readonly seconds: 900;
        }, {
            readonly text: "1H";
            readonly seconds: 3600;
        }, {
            readonly text: "4H";
            readonly seconds: 14400;
        }, {
            readonly text: "1D";
            readonly seconds: 86400;
        }, {
            readonly text: "All";
            readonly seconds: number | null;
        }];
        readonly longTerm: readonly [{
            readonly text: "1M";
            readonly seconds: 2592000;
        }, {
            readonly text: "3M";
            readonly seconds: 7776000;
        }, {
            readonly text: "6M";
            readonly seconds: 15552000;
        }, {
            readonly text: "1Y";
            readonly seconds: 31536000;
        }, {
            readonly text: "5Y";
            readonly seconds: 157680000;
        }, {
            readonly text: "All";
            readonly seconds: number | null;
        }];
        readonly minimal: readonly [{
            readonly text: "1D";
            readonly seconds: 86400;
        }, {
            readonly text: "1W";
            readonly seconds: 604800;
        }, {
            readonly text: "1M";
            readonly seconds: 2592000;
        }, {
            readonly text: "All";
            readonly seconds: number | null;
        }];
    };
};
//# sourceMappingURL=RangeSwitcherPrimitive.d.ts.map