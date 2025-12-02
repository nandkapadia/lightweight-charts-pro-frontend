/**
 * @fileoverview Primitive Defaults - Configuration Constants
 *
 * Single source of truth for all primitive configuration constants, default
 * values, and styling configurations. Ensures consistency across all
 * primitive components.
 *
 * This file provides:
 * - Time range constants (seconds for various periods)
 * - Layout spacing and positioning constants
 * - Button dimensions and styling
 * - Color schemes and themes
 * - Typography defaults
 * - Legend configuration defaults
 * - Range switcher presets
 *
 * Architecture:
 * - Const objects with 'as const' for type safety
 * - Organized by category (buttons, legends, colors, etc.)
 * - Readonly values prevent accidental mutations
 * - Used by all primitive components
 *
 * DRY Principles:
 * - Single source of truth for all defaults
 * - No magic numbers scattered in code
 * - Easy to update globally
 * - Type-safe with TypeScript inference
 *
 * @example
 * ```typescript
 * import { ButtonColors, UniversalSpacing } from './PrimitiveDefaults';
 *
 * const buttonStyle = {
 *   background: ButtonColors.DEFAULT_BACKGROUND,
 *   padding: UniversalSpacing.EDGE_PADDING
 * };
 * ```
 */
/**
 * Time range constants in seconds
 */
export declare const TimeRangeSeconds: {
    readonly FIVE_MINUTES: 300;
    readonly FIFTEEN_MINUTES: 900;
    readonly ONE_HOUR: 3600;
    readonly FOUR_HOURS: 14400;
    readonly ONE_DAY: 86400;
    readonly ONE_WEEK: 604800;
    readonly ONE_MONTH: 2592000;
    readonly THREE_MONTHS: 7776000;
    readonly SIX_MONTHS: 15552000;
    readonly ONE_YEAR: 31536000;
    readonly FIVE_YEARS: 157680000;
};
/**
 * Universal padding and spacing constants
 */
export declare const UniversalSpacing: {
    readonly EDGE_PADDING: 6;
    readonly WIDGET_GAP: 6;
    readonly WIDGET_HORIZONTAL_GAP: 6;
    readonly DEFAULT_PADDING: 6;
    readonly BASE_Z_INDEX: 1000;
};
/**
 * Default button dimensions
 */
export declare const ButtonDimensions: {
    readonly DEFAULT_WIDTH: 24;
    readonly DEFAULT_HEIGHT: 24;
    readonly PANE_ACTION_WIDTH: 18;
    readonly PANE_ACTION_HEIGHT: 18;
    readonly MIN_WIDTH_RANGE: 40;
    readonly BORDER_RADIUS: 4;
    readonly PANE_ACTION_BORDER_RADIUS: 3;
    readonly FONT_SIZE: 14;
    readonly RANGE_FONT_SIZE: 12;
};
/**
 * Button spacing constants
 */
export declare const ButtonSpacing: {
    readonly CONTAINER_PADDING: 6;
    readonly CONTAINER_GAP: 2;
    readonly RANGE_CONTAINER_GAP: 2;
    readonly BUTTON_PADDING: "4px 12px";
    readonly RANGE_BUTTON_PADDING: "3px 8px";
    readonly PANE_ACTION_PADDING: "0";
    readonly BUTTON_MARGIN: "0";
    readonly RANGE_BUTTON_MARGIN: "0 1px";
};
/**
 * Button color constants
 */
export declare const ButtonColors: {
    readonly DEFAULT_BACKGROUND: "rgba(255, 255, 255, 0.1)";
    readonly DEFAULT_COLOR: "#666";
    readonly HOVER_BACKGROUND: "rgba(255, 255, 255, 0.2)";
    readonly HOVER_COLOR: "#333";
    readonly PRESSED_BACKGROUND: "#007AFF";
    readonly PRESSED_COLOR: "white";
    readonly DISABLED_BACKGROUND: "rgba(128, 128, 128, 0.1)";
    readonly DISABLED_COLOR: "#999";
    readonly PANE_ACTION_BACKGROUND: "rgba(255, 255, 255, 0.1)";
    readonly PANE_ACTION_COLOR: "#6b7280";
    readonly PANE_ACTION_HOVER_BACKGROUND: "rgba(255, 255, 255, 1)";
    readonly PANE_ACTION_PRESSED_BACKGROUND: "rgba(229, 231, 235, 1)";
    readonly PANE_ACTION_BORDER: "#d1d5db";
    readonly ACTION_BACKGROUND: "#007AFF";
    readonly ACTION_HOVER_BACKGROUND: "#0056CC";
};
/**
 * Button border and shadow constants
 */
export declare const ButtonEffects: {
    readonly DEFAULT_BORDER: "1px solid rgba(255, 255, 255, 0.2)";
    readonly RANGE_BORDER: "1px solid rgba(0, 0, 0, 0.1)";
    readonly DEFAULT_TRANSITION: "all 0.2s ease";
    readonly HOVER_BOX_SHADOW: "0 2px 4px rgba(0, 0, 0, 0.1)";
    readonly RANGE_HOVER_BOX_SHADOW: "0 1px 3px rgba(0, 0, 0, 0.12)";
    readonly PRESSED_BOX_SHADOW: "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
    readonly FOCUS_OUTLINE: "2px solid #007AFF";
};
/**
 * Legend dimensions and spacing
 */
export declare const LegendDimensions: {
    readonly DEFAULT_PADDING: 6;
    readonly OHLC_PADDING: 6;
    readonly BAND_PADDING: 6;
    readonly BORDER_RADIUS: 4;
    readonly MAX_WIDTH: 200;
    readonly FONT_SIZE: 12;
    readonly OHLC_FONT_SIZE: 11;
    readonly BAND_FONT_SIZE: 11;
};
/**
 * Layout spacing constants
 */
export declare const LayoutSpacing: {
    readonly EDGE_PADDING: 6;
    readonly WIDGET_GAP: 6;
    readonly BASE_Z_INDEX: 1000;
};
/**
 * Legend color constants
 */
export declare const LegendColors: {
    readonly DEFAULT_BACKGROUND: "rgba(0, 0, 0, 0.8)";
    readonly DEFAULT_COLOR: "white";
    readonly VOLUME_BACKGROUND: "rgba(100, 100, 100, 0.8)";
    readonly BAND_BACKGROUND: "rgba(0, 50, 100, 0.8)";
    readonly DEFAULT_OPACITY: 0.8;
};
/**
 * Range switcher layout constants
 */
export declare const RangeSwitcherLayout: {
    readonly CONTAINER_PADDING: 0;
    readonly CONTAINER_GAP: 2;
    readonly FLEX_DIRECTION: "row";
    readonly ALIGN_ITEMS: "center";
    readonly JUSTIFY_CONTENT: "flex-end";
};
/**
 * Default format strings
 */
export declare const FormatDefaults: {
    readonly VALUE_FORMAT: ".2f";
    readonly VOLUME_FORMAT: ".0f";
    readonly BAND_FORMAT: ".3f";
    readonly TIME_FORMAT: "YYYY-MM-DD HH:mm:ss";
};
/**
 * Base container styling
 */
export declare const ContainerDefaults: {
    readonly BACKGROUND: "transparent";
    readonly FONT_FAMILY: "Arial, sans-serif";
    readonly FONT_WEIGHT: "normal";
    readonly TEXT_ALIGN: "left";
    readonly USER_SELECT: "none";
    readonly POINTER_EVENTS: "auto";
    readonly POSITION: "absolute";
};
/**
 * Common CSS values used across primitives
 */
export declare const CommonValues: {
    readonly NONE: "none";
    readonly AUTO: "auto";
    readonly POINTER: "pointer";
    readonly DEFAULT_CURSOR: "default";
    readonly ZERO: "0";
    readonly FONT_WEIGHT_MEDIUM: "500";
    readonly FONT_WEIGHT_NORMAL: "normal";
    readonly FONT_WEIGHT_BOLD: "bold";
    readonly NOWRAP: "nowrap";
    readonly HIDDEN: "hidden";
    readonly ELLIPSIS: "ellipsis";
};
/**
 * Animation timing constants
 */
export declare const AnimationTiming: {
    readonly DEFAULT_TRANSITION: "all 0.2s ease";
    readonly FAST_TRANSITION: "all 0.1s ease";
    readonly SLOW_TRANSITION: "all 0.3s ease";
};
/**
 * Complete default configuration for buttons
 */
export declare const DefaultButtonConfig: {
    readonly dimensions: {
        readonly DEFAULT_WIDTH: 24;
        readonly DEFAULT_HEIGHT: 24;
        readonly PANE_ACTION_WIDTH: 18;
        readonly PANE_ACTION_HEIGHT: 18;
        readonly MIN_WIDTH_RANGE: 40;
        readonly BORDER_RADIUS: 4;
        readonly PANE_ACTION_BORDER_RADIUS: 3;
        readonly FONT_SIZE: 14;
        readonly RANGE_FONT_SIZE: 12;
    };
    readonly spacing: {
        readonly CONTAINER_PADDING: 6;
        readonly CONTAINER_GAP: 2;
        readonly RANGE_CONTAINER_GAP: 2;
        readonly BUTTON_PADDING: "4px 12px";
        readonly RANGE_BUTTON_PADDING: "3px 8px";
        readonly PANE_ACTION_PADDING: "0";
        readonly BUTTON_MARGIN: "0";
        readonly RANGE_BUTTON_MARGIN: "0 1px";
    };
    readonly colors: {
        readonly DEFAULT_BACKGROUND: "rgba(255, 255, 255, 0.1)";
        readonly DEFAULT_COLOR: "#666";
        readonly HOVER_BACKGROUND: "rgba(255, 255, 255, 0.2)";
        readonly HOVER_COLOR: "#333";
        readonly PRESSED_BACKGROUND: "#007AFF";
        readonly PRESSED_COLOR: "white";
        readonly DISABLED_BACKGROUND: "rgba(128, 128, 128, 0.1)";
        readonly DISABLED_COLOR: "#999";
        readonly PANE_ACTION_BACKGROUND: "rgba(255, 255, 255, 0.1)";
        readonly PANE_ACTION_COLOR: "#6b7280";
        readonly PANE_ACTION_HOVER_BACKGROUND: "rgba(255, 255, 255, 1)";
        readonly PANE_ACTION_PRESSED_BACKGROUND: "rgba(229, 231, 235, 1)";
        readonly PANE_ACTION_BORDER: "#d1d5db";
        readonly ACTION_BACKGROUND: "#007AFF";
        readonly ACTION_HOVER_BACKGROUND: "#0056CC";
    };
    readonly effects: {
        readonly DEFAULT_BORDER: "1px solid rgba(255, 255, 255, 0.2)";
        readonly RANGE_BORDER: "1px solid rgba(0, 0, 0, 0.1)";
        readonly DEFAULT_TRANSITION: "all 0.2s ease";
        readonly HOVER_BOX_SHADOW: "0 2px 4px rgba(0, 0, 0, 0.1)";
        readonly RANGE_HOVER_BOX_SHADOW: "0 1px 3px rgba(0, 0, 0, 0.12)";
        readonly PRESSED_BOX_SHADOW: "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
        readonly FOCUS_OUTLINE: "2px solid #007AFF";
    };
    readonly animation: {
        readonly DEFAULT_TRANSITION: "all 0.2s ease";
        readonly FAST_TRANSITION: "all 0.1s ease";
        readonly SLOW_TRANSITION: "all 0.3s ease";
    };
};
/**
 * Complete default configuration for legends
 */
export declare const DefaultLegendConfig: {
    readonly dimensions: {
        readonly DEFAULT_PADDING: 6;
        readonly OHLC_PADDING: 6;
        readonly BAND_PADDING: 6;
        readonly BORDER_RADIUS: 4;
        readonly MAX_WIDTH: 200;
        readonly FONT_SIZE: 12;
        readonly OHLC_FONT_SIZE: 11;
        readonly BAND_FONT_SIZE: 11;
    };
    readonly colors: {
        readonly DEFAULT_BACKGROUND: "rgba(0, 0, 0, 0.8)";
        readonly DEFAULT_COLOR: "white";
        readonly VOLUME_BACKGROUND: "rgba(100, 100, 100, 0.8)";
        readonly BAND_BACKGROUND: "rgba(0, 50, 100, 0.8)";
        readonly DEFAULT_OPACITY: 0.8;
    };
    readonly formats: {
        readonly VALUE_FORMAT: ".2f";
        readonly VOLUME_FORMAT: ".0f";
        readonly BAND_FORMAT: ".3f";
        readonly TIME_FORMAT: "YYYY-MM-DD HH:mm:ss";
    };
    readonly animation: {
        readonly DEFAULT_TRANSITION: "all 0.2s ease";
        readonly FAST_TRANSITION: "all 0.1s ease";
        readonly SLOW_TRANSITION: "all 0.3s ease";
    };
};
/**
 * Complete default configuration for range switchers
 */
export declare const DefaultRangeSwitcherConfig: {
    readonly layout: {
        readonly CONTAINER_PADDING: 0;
        readonly CONTAINER_GAP: 2;
        readonly FLEX_DIRECTION: "row";
        readonly ALIGN_ITEMS: "center";
        readonly JUSTIFY_CONTENT: "flex-end";
    };
    readonly button: {
        readonly dimensions: {
            readonly DEFAULT_WIDTH: 24;
            readonly DEFAULT_HEIGHT: 24;
            readonly PANE_ACTION_WIDTH: 18;
            readonly PANE_ACTION_HEIGHT: 18;
            readonly MIN_WIDTH_RANGE: 40;
            readonly BORDER_RADIUS: 4;
            readonly PANE_ACTION_BORDER_RADIUS: 3;
            readonly FONT_SIZE: 14;
            readonly RANGE_FONT_SIZE: 12;
        };
        readonly spacing: {
            readonly CONTAINER_PADDING: 6;
            readonly CONTAINER_GAP: 2;
            readonly RANGE_CONTAINER_GAP: 2;
            readonly BUTTON_PADDING: "4px 12px";
            readonly RANGE_BUTTON_PADDING: "3px 8px";
            readonly PANE_ACTION_PADDING: "0";
            readonly BUTTON_MARGIN: "0";
            readonly RANGE_BUTTON_MARGIN: "0 1px";
        };
        readonly colors: {
            readonly DEFAULT_BACKGROUND: "rgba(255, 255, 255, 0.1)";
            readonly DEFAULT_COLOR: "#666";
            readonly HOVER_BACKGROUND: "rgba(255, 255, 255, 0.2)";
            readonly HOVER_COLOR: "#333";
            readonly PRESSED_BACKGROUND: "#007AFF";
            readonly PRESSED_COLOR: "white";
            readonly DISABLED_BACKGROUND: "rgba(128, 128, 128, 0.1)";
            readonly DISABLED_COLOR: "#999";
            readonly PANE_ACTION_BACKGROUND: "rgba(255, 255, 255, 0.1)";
            readonly PANE_ACTION_COLOR: "#6b7280";
            readonly PANE_ACTION_HOVER_BACKGROUND: "rgba(255, 255, 255, 1)";
            readonly PANE_ACTION_PRESSED_BACKGROUND: "rgba(229, 231, 235, 1)";
            readonly PANE_ACTION_BORDER: "#d1d5db";
            readonly ACTION_BACKGROUND: "#007AFF";
            readonly ACTION_HOVER_BACKGROUND: "#0056CC";
        };
        readonly effects: {
            readonly DEFAULT_BORDER: "1px solid rgba(255, 255, 255, 0.2)";
            readonly RANGE_BORDER: "1px solid rgba(0, 0, 0, 0.1)";
            readonly DEFAULT_TRANSITION: "all 0.2s ease";
            readonly HOVER_BOX_SHADOW: "0 2px 4px rgba(0, 0, 0, 0.1)";
            readonly RANGE_HOVER_BOX_SHADOW: "0 1px 3px rgba(0, 0, 0, 0.12)";
            readonly PRESSED_BOX_SHADOW: "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
            readonly FOCUS_OUTLINE: "2px solid #007AFF";
        };
        readonly animation: {
            readonly DEFAULT_TRANSITION: "all 0.2s ease";
            readonly FAST_TRANSITION: "all 0.1s ease";
            readonly SLOW_TRANSITION: "all 0.3s ease";
        };
    };
    readonly timeRanges: {
        readonly FIVE_MINUTES: 300;
        readonly FIFTEEN_MINUTES: 900;
        readonly ONE_HOUR: 3600;
        readonly FOUR_HOURS: 14400;
        readonly ONE_DAY: 86400;
        readonly ONE_WEEK: 604800;
        readonly ONE_MONTH: 2592000;
        readonly THREE_MONTHS: 7776000;
        readonly SIX_MONTHS: 15552000;
        readonly ONE_YEAR: 31536000;
        readonly FIVE_YEARS: 157680000;
    };
    readonly animation: {
        readonly DEFAULT_TRANSITION: "all 0.2s ease";
        readonly FAST_TRANSITION: "all 0.1s ease";
        readonly SLOW_TRANSITION: "all 0.3s ease";
    };
};
/**
 * Base container configuration
 */
export declare const DefaultContainerConfig: {
    readonly styling: {
        readonly BACKGROUND: "transparent";
        readonly FONT_FAMILY: "Arial, sans-serif";
        readonly FONT_WEIGHT: "normal";
        readonly TEXT_ALIGN: "left";
        readonly USER_SELECT: "none";
        readonly POINTER_EVENTS: "auto";
        readonly POSITION: "absolute";
    };
    readonly animation: {
        readonly DEFAULT_TRANSITION: "all 0.2s ease";
        readonly FAST_TRANSITION: "all 0.1s ease";
        readonly SLOW_TRANSITION: "all 0.3s ease";
    };
};
//# sourceMappingURL=PrimitiveDefaults.d.ts.map