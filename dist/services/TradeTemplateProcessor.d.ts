import { TemplateOptions, TemplateResult } from './TemplateEngine';
export interface TradeTemplateData {
    tradeType: "long" | "short";
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    pnlPercentage: number;
    quantity?: number;
    notes?: string;
    tradeId?: string;
    entryTime?: string | number;
    exitTime?: string | number;
}
export type { TemplateOptions, TemplateResult };
/**
 * TradeTemplateProcessor - Trade-specific template processing facade
 *
 * Provides a simplified interface for processing trade templates while
 * delegating to the common TemplateEngine for actual processing. This
 * ensures consistency with legend templates and other primitives.
 *
 * Architecture:
 * - Facade pattern over TemplateEngine
 * - Static methods (no instantiation needed)
 * - Supports flexible data structure (core fields + additional_data)
 * - Backend-driven display values (no frontend calculations)
 *
 * @export
 * @class TradeTemplateProcessor
 *
 * @example
 * ```typescript
 * const template = '<div>P&L: $$pnl$$ ($$pnl_percentage$$%)</div>';
 * const data = {
 *   pnl: 100.50,
 *   pnl_percentage: 2.5,
 *   isProfitable: true
 * };
 *
 * const result = TradeTemplateProcessor.processTemplate(template, data);
 * console.log(result.content); // '<div>P&L: 100.50 (2.5%)</div>'
 * ```
 */
export declare class TradeTemplateProcessor {
    /**
     * Process trade template with data
     *
     * Converts trade data to template context and processes using the
     * common TemplateEngine. Handles both TradeTemplateData and arbitrary
     * data objects with additional_data fields.
     *
     * @static
     * @param {string} template - HTML template with $$placeholder$$ syntax
     * @param {TradeTemplateData | Record<string, any>} data - Trade data object
     * @param {TemplateOptions} [options={}] - Optional processing options
     * @returns {TemplateResult} Processed template with content and errors
     *
     * @example
     * ```typescript
     * const result = TradeTemplateProcessor.processTemplate(
     *   '<span style="color: $$profit_color$$">$$side$$</span>',
     *   {
     *     isProfitable: true,
     *     side: 'BUY',
     *     profit_color: '#00ff88'
     *   }
     * );
     * ```
     */
    static processTemplate(template: string, data: TradeTemplateData | Record<string, any>, options?: TemplateOptions): TemplateResult;
    /**
     * Convert trade data to template context format
     * Now supports flexible data structure with additional_data fields
     */
    private static convertTradeDataToContext;
    /**
     * Get default tooltip template
     */
    static getDefaultTooltipTemplate(): string;
    /**
     * Get default marker template
     */
    static getDefaultMarkerTemplate(): string;
    /**
     * Get available placeholders documentation
     */
    static getPlaceholdersDocumentation(): Record<string, string>;
}
//# sourceMappingURL=TradeTemplateProcessor.d.ts.map