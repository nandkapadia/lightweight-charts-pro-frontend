import { IChartApi } from 'lightweight-charts';
import { KeyedSingletonManager } from '../utils/KeyedSingletonManager';
/**
 * Pane collapse state
 */
export interface PaneCollapseState {
    isCollapsed: boolean;
    originalHeight: number;
    collapsedHeight: number;
    onPaneCollapse?: (paneId: number, isCollapsed: boolean) => void;
    onPaneExpand?: (paneId: number, isCollapsed: boolean) => void;
}
/**
 * Pane collapse configuration
 */
export interface PaneCollapseConfig {
    collapsedHeight?: number;
    chartId?: string;
    onPaneCollapse?: (paneId: number, isCollapsed: boolean) => void;
    onPaneExpand?: (paneId: number, isCollapsed: boolean) => void;
}
/**
 * Manager for pane collapse/expand functionality
 */
export declare class PaneCollapseManager extends KeyedSingletonManager<PaneCollapseManager> {
    private chartApi;
    private states;
    private config;
    private constructor();
    /**
     * Get or create singleton instance for a chart
     */
    static getInstance(chartApi: IChartApi, chartId?: string, config?: PaneCollapseConfig): PaneCollapseManager;
    /**
     * Destroy singleton instance for a chart
     */
    static destroyInstance(chartId?: string): void;
    /**
     * Initialize state for a pane with optional callbacks
     *
     * Callbacks are stored per-pane to support multiple panes with different handlers.
     * This fixes the singleton issue where only the first pane's callbacks were used.
     */
    initializePane(paneId: number, callbacks?: {
        onPaneCollapse?: (paneId: number, isCollapsed: boolean) => void;
        onPaneExpand?: (paneId: number, isCollapsed: boolean) => void;
    }): void;
    /**
     * Get collapse state for a pane
     */
    getState(paneId: number): PaneCollapseState | undefined;
    /**
     * Check if a pane is collapsed
     */
    isCollapsed(paneId: number): boolean;
    /**
     * Toggle pane collapse state
     */
    toggle(paneId: number): void;
    /**
     * Collapse a pane using manual redistribution to non-collapsed panes
     *
     * MANUAL REDISTRIBUTION STRATEGY:
     * 1. Save original height of collapsing pane
     * 2. Calculate freed space: originalHeight - collapsedHeight
     * 3. Find all EXPANDED (non-collapsed) panes
     * 4. Distribute freed space ONLY among expanded panes
     * 5. Set ALL pane heights (collapsed + expanded) to prevent chart's auto-redistribution
     *
     * This ensures collapsed panes stay collapsed when collapsing additional panes!
     */
    collapse(paneId: number): void;
    /**
     * Expand a pane using manual redistribution from non-collapsed panes
     *
     * MANUAL REDISTRIBUTION STRATEGY:
     * 1. Calculate space to reclaim: originalHeight - collapsedHeight
     * 2. Find all EXPANDED (non-collapsed) panes
     * 3. Take space EQUALLY from expanded panes only
     * 4. Set ALL pane heights (collapsed + expanded) to prevent chart's auto-redistribution
     *
     * This ensures collapsed panes stay collapsed when expanding other panes!
     */
    expand(paneId: number): void;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=PaneCollapseManager.d.ts.map