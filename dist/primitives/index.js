import { C as CornerLayoutManager, P as PrimitiveEventManager } from "../PrimitiveEventManager-DrK6RuJi.js";
import { c as createSingleton, C as ChartCoordinateService, x as LegendDimensions, y as LegendColors, z as FormatDefaults, A as ContainerDefaults, E as CommonValues, G as TimeRangeSeconds, B as ButtonDimensions, H as ButtonSpacing, n as ButtonEffects, m as ButtonColors, I as DefaultRangeSwitcherConfig, l as logger } from "../SingletonBase-vKYdZ5tk.js";
import { J, K, O, N, w, R, U } from "../SingletonBase-vKYdZ5tk.js";
import { T as TemplateEngine, a as TradeTemplateProcessor } from "../TradeTemplateProcessor-DwcE0VRc.js";
import { B, T } from "../TrendFillPrimitive-DHivyY9P.js";
import { s as sanitizeHtml } from "../sanitization-HfsXpoG7.js";
import { T as TooltipManager } from "../TooltipManager-tt1WqIi2.js";
import { BandPrimitive } from "../BandPrimitive-BJsNeyNJ.js";
import { RibbonPrimitive } from "../RibbonPrimitive-hcLJbxIK.js";
import { GradientRibbonPrimitive } from "../GradientRibbonPrimitive-95ttgdAP.js";
import { SignalPrimitive } from "../SignalPrimitive-D3Alyq5j.js";
class PrimitiveStylingUtils {
  /**
   * Apply base styles to an element with fallback handling
   */
  static applyBaseStyles(element, styles, defaults = {}) {
    const style = element.style;
    const config = { ...defaults, ...styles };
    if (config.backgroundColor) style.backgroundColor = config.backgroundColor;
    if (config.color) style.color = config.color;
    if (config.opacity !== void 0) style.opacity = config.opacity.toString();
    if (config.fontSize) style.fontSize = `${config.fontSize}px`;
    if (config.fontFamily) style.fontFamily = config.fontFamily;
    if (config.fontWeight) style.fontWeight = config.fontWeight.toString();
    if (config.padding !== void 0) {
      style.padding = typeof config.padding === "number" ? `${config.padding}px` : config.padding;
    }
    if (config.margin !== void 0) {
      style.margin = typeof config.margin === "number" ? `${config.margin}px` : config.margin;
    }
    if (config.border) style.border = config.border;
    if (config.borderRadius) style.borderRadius = `${config.borderRadius}px`;
    if (config.cursor) style.cursor = config.cursor;
    if (config.transition) style.transition = config.transition;
    if (config.zIndex !== void 0) style.zIndex = config.zIndex.toString();
    if (config.boxShadow) style.boxShadow = config.boxShadow;
    if (config.transform) style.transform = config.transform;
  }
  /**
   * Apply typography styles with consistent fallbacks
   */
  static applyTypography(element, typography, defaults = {}) {
    const style = element.style;
    const config = { ...defaults, ...typography };
    if (config.fontSize) style.fontSize = `${config.fontSize}px`;
    if (config.fontFamily) style.fontFamily = config.fontFamily;
    if (config.fontWeight) style.fontWeight = config.fontWeight.toString();
    if (config.textAlign) style.textAlign = config.textAlign;
    if (config.lineHeight) {
      style.lineHeight = typeof config.lineHeight === "number" ? config.lineHeight.toString() : config.lineHeight;
    }
    if (config.letterSpacing) {
      style.letterSpacing = typeof config.letterSpacing === "number" ? `${config.letterSpacing}px` : config.letterSpacing;
    }
  }
  /**
   * Apply layout styles with consistent dimension handling
   */
  static applyLayout(element, layout, defaults = {}) {
    const style = element.style;
    const config = { ...defaults, ...layout };
    if (config.width !== void 0) {
      style.width = typeof config.width === "number" ? `${config.width}px` : config.width;
    }
    if (config.height !== void 0) {
      style.height = typeof config.height === "number" ? `${config.height}px` : config.height;
    }
    if (config.padding !== void 0) {
      style.padding = typeof config.padding === "number" ? `${config.padding}px` : config.padding;
    }
    if (config.margin !== void 0) {
      style.margin = typeof config.margin === "number" ? `${config.margin}px` : config.margin;
    }
    if (config.display) style.display = config.display;
    if (config.position) style.position = config.position;
    if (config.top !== void 0) {
      style.top = typeof config.top === "number" ? `${config.top}px` : config.top;
    }
    if (config.right !== void 0) {
      style.right = typeof config.right === "number" ? `${config.right}px` : config.right;
    }
    if (config.bottom !== void 0) {
      style.bottom = typeof config.bottom === "number" ? `${config.bottom}px` : config.bottom;
    }
    if (config.left !== void 0) {
      style.left = typeof config.left === "number" ? `${config.left}px` : config.left;
    }
  }
  /**
   * Apply border styles with consistent formatting
   */
  static applyBorder(element, border, defaults = {}) {
    const style = element.style;
    const config = { ...defaults, ...border };
    if (config.border) style.border = config.border;
    if (config.borderRadius) style.borderRadius = `${config.borderRadius}px`;
    if (config.borderWidth) style.borderWidth = `${config.borderWidth}px`;
    if (config.borderColor) style.borderColor = config.borderColor;
    if (config.borderStyle) style.borderStyle = config.borderStyle;
  }
  /**
   * Apply shadow effects with validation
   */
  static applyShadow(element, shadow, defaults = {}) {
    const style = element.style;
    const config = { ...defaults, ...shadow };
    if (config.boxShadow) style.boxShadow = config.boxShadow;
    if (config.textShadow) style.textShadow = config.textShadow;
  }
  /**
   * Apply interaction states (hover, active, disabled) consistently
   */
  static applyInteractionState(element, baseStyles, stateStyles, state = "default") {
    this.applyBaseStyles(element, baseStyles);
    if (state !== "default") {
      this.applyBaseStyles(element, stateStyles);
    }
    const style = element.style;
    style.userSelect = "none";
    style.outline = "none";
    switch (state) {
      case "disabled":
        style.cursor = "not-allowed";
        style.pointerEvents = "auto";
        break;
      case "hover":
      case "active":
        style.cursor = stateStyles.cursor || baseStyles.cursor || "pointer";
        style.pointerEvents = "auto";
        break;
      default:
        style.cursor = baseStyles.cursor || "default";
        style.pointerEvents = "auto";
        break;
    }
  }
  /**
   * Validate and normalize color values
   */
  static normalizeColor(color, fallback) {
    if (!color) return fallback;
    if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl") || color.includes("var(") || /^[a-zA-Z]+$/.test(color)) {
      return color;
    }
    return fallback;
  }
  /**
   * Validate and normalize numeric values with units
   */
  static normalizeNumericValue(value, unit = "px", fallback = 0) {
    if (value === void 0) return `${fallback}${unit}`;
    if (typeof value === "number") return `${value}${unit}`;
    if (typeof value === "string") return value;
    return `${fallback}${unit}`;
  }
  /**
   * Create a standardized flex container
   */
  static createFlexContainer(element, direction = "row", align = "center", justify = "center", gap) {
    const style = element.style;
    style.display = "flex";
    style.flexDirection = direction;
    style.alignItems = align;
    style.justifyContent = justify;
    if (gap !== void 0) {
      style.gap = `${gap}px`;
    }
  }
  /**
   * Apply consistent transition effects
   */
  static applyTransition(element, properties = ["all"], duration = "0.2s", timing = "ease") {
    const transitionValue = properties.map((prop) => `${prop} ${duration} ${timing}`).join(", ");
    element.style.transition = transitionValue;
  }
  /**
   * Reset all styles to defaults (useful for cleanup)
   */
  /**
   * Apply position styles to an element.
   * Resets all position values first, then applies provided coordinates.
   * This is the single source of truth for position styling (DRY principle).
   *
   * @param element - The element to style
   * @param position - Position coordinates (top, right, bottom, left, zIndex)
   * @param setAbsolute - Whether to set position: absolute (default: true)
   */
  static applyPosition(element, position, setAbsolute = true) {
    const style = element.style;
    if (setAbsolute) {
      style.position = "absolute";
    }
    style.top = "";
    style.right = "";
    style.bottom = "";
    style.left = "";
    if (position.top !== void 0) style.top = `${position.top}px`;
    if (position.right !== void 0) style.right = `${position.right}px`;
    if (position.bottom !== void 0) style.bottom = `${position.bottom}px`;
    if (position.left !== void 0) style.left = `${position.left}px`;
    if (position.zIndex !== void 0) style.zIndex = position.zIndex.toString();
  }
  /**
   * Reset position styles on an element.
   * Sets all position values to 'auto' for clean slate.
   *
   * @param element - The element to reset
   */
  static resetPosition(element) {
    const style = element.style;
    style.top = "auto";
    style.left = "auto";
    style.right = "auto";
    style.bottom = "auto";
  }
  static resetStyles(element, preserveLayout = false) {
    const style = element.style;
    style.backgroundColor = "";
    style.color = "";
    style.border = "";
    style.borderRadius = "";
    style.boxShadow = "";
    style.textShadow = "";
    style.opacity = "";
    style.cursor = "";
    style.transition = "";
    style.fontSize = "";
    style.fontFamily = "";
    style.fontWeight = "";
    style.textAlign = "";
    style.lineHeight = "";
    style.letterSpacing = "";
    if (!preserveLayout) {
      style.width = "";
      style.height = "";
      style.padding = "";
      style.margin = "";
      style.display = "";
      style.position = "";
      style.top = "";
      style.right = "";
      style.bottom = "";
      style.left = "";
      style.zIndex = "";
    }
  }
}
class BasePanePrimitive {
  constructor(id, config) {
    this.visible = true;
    this.chart = null;
    this.series = null;
    this.requestUpdate = null;
    this.layoutManager = null;
    this._coordinateService = null;
    this._templateEngine = null;
    this.eventManager = null;
    this.currentPosition = null;
    this.containerElement = null;
    this.mounted = false;
    this.eventSubscriptions = [];
    this.templateData = {};
    this.templateContext = {};
    this.lastTemplateResult = null;
    this.lastPaneCoords = null;
    this.id = id;
    this.config = { ...config };
    this.corner = config.corner ?? "top-left";
    this.priority = config.priority ?? 50;
    this.visible = config.visible !== false;
  }
  /**
   * Lazy getter for coordinate service - avoids module loading order issues
   */
  get coordinateService() {
    if (!this._coordinateService) {
      this._coordinateService = createSingleton(ChartCoordinateService);
    }
    if (!this._coordinateService) {
      throw new Error("Failed to initialize ChartCoordinateService");
    }
    return this._coordinateService;
  }
  /**
   * Lazy getter for template engine - avoids module loading order issues
   */
  get templateEngine() {
    if (!this._templateEngine) {
      this._templateEngine = createSingleton(TemplateEngine);
    }
    if (!this._templateEngine) {
      throw new Error("Failed to initialize TemplateEngine");
    }
    return this._templateEngine;
  }
  // ===== IPanePrimitive Interface =====
  /**
   * Called when primitive is attached to a pane
   */
  attached(params) {
    this.chart = params.chart;
    this.series = params.series;
    this.requestUpdate = params.requestUpdate;
    this.initializeLayoutManagement();
    this.initializeEventManagement();
    this.setupDefaultEventSubscriptions();
    this.onAttached(params);
    this.mounted = true;
    if (this.layoutManager) {
      this.layoutManager.registerWidget(this);
    }
    this.updateAllViews();
  }
  /**
   * Called when primitive is detached from a pane
   */
  detached() {
    if (this.layoutManager) {
      this.layoutManager.unregisterWidget(this.id);
    }
    this.cleanupEventSubscriptions();
    this.destroyContainer();
    this.onDetached();
    this.chart = null;
    this.series = null;
    this.layoutManager = null;
    this.eventManager = null;
    this.mounted = false;
  }
  /**
   * IPanePrimitive interface - integrates with chart's rendering pipeline
   *
   * The draw() method is called automatically by the chart on every render cycle,
   * allowing smooth position updates without manual DOM manipulation.
   */
  paneViews() {
    return [
      {
        renderer: () => ({
          draw: () => {
            if (!this.chart || !this.mounted) return;
            const paneId = this.getPaneId();
            const newCoords = this.coordinateService.getPaneCoordinates(this.chart, paneId);
            if (!newCoords) return;
            if (this.hasCoordinatesChanged(newCoords)) {
              this.lastPaneCoords = {
                x: newCoords.x,
                y: newCoords.y,
                width: newCoords.width,
                height: newCoords.height
              };
              if (this.layoutManager) {
                this.layoutManager.updateChartDimensionsFromElement();
              }
            }
          }
        })
      }
    ];
  }
  /**
   * Check if pane coordinates changed (ignoring sub-pixel jitter)
   */
  hasCoordinatesChanged(newCoords) {
    if (!this.lastPaneCoords) return true;
    return Math.abs(this.lastPaneCoords.x - newCoords.x) > 1 || Math.abs(this.lastPaneCoords.y - newCoords.y) > 1 || Math.abs(this.lastPaneCoords.width - newCoords.width) > 1 || Math.abs(this.lastPaneCoords.height - newCoords.height) > 1;
  }
  /**
   * Main primitive update method - handles rendering
   */
  updateAllViews() {
    if (!this.mounted || !this.visible) {
      return;
    }
    this.processTemplate();
    this.ensureContainer();
    this.renderContent();
    this.onUpdate();
  }
  // ===== IPositionableWidget Interface =====
  /**
   * Get current dimensions of the primitive's container
   */
  getDimensions() {
    if (!this.containerElement) {
      return { width: 0, height: 0 };
    }
    let width = this.containerElement.offsetWidth || 0;
    let height = this.containerElement.offsetHeight || 0;
    if ((width === 0 || height === 0) && this.containerElement) {
      const originalDisplay = this.containerElement.style.display;
      const originalVisibility = this.containerElement.style.visibility;
      const originalPosition = this.containerElement.style.position;
      this.containerElement.style.display = "block";
      this.containerElement.style.visibility = "hidden";
      this.containerElement.style.position = "absolute";
      width = this.containerElement.offsetWidth || width;
      height = this.containerElement.offsetHeight || height;
      this.containerElement.style.display = originalDisplay;
      this.containerElement.style.visibility = originalVisibility;
      this.containerElement.style.position = originalPosition;
      if (width === 0) {
        const textLength = this.containerElement.textContent?.length || 50;
        width = Math.max(100, textLength * 8);
      }
      if (height === 0) {
        height = 24;
      }
    }
    return { width, height };
  }
  /**
   * Called by layout manager to update position
   * Now properly integrates with lightweight-charts coordinate updates
   */
  updatePosition(position) {
    this.currentPosition = position;
    if (this.containerElement) {
      this.applyPositionToContainer(position);
    }
    this.onPositionUpdate(position);
  }
  // ===== Layout Management System =====
  /**
   * Initialize layout management integration
   */
  initializeLayoutManagement() {
    if (!this.chart) return;
    const paneId = this.getPaneId();
    const chartId = this.getChartId();
    this.layoutManager = CornerLayoutManager.getInstance(chartId, paneId);
    this.layoutManager.setChartApi(this.chart);
    this.coordinateService.setupLayoutManagerIntegration(this.chart, this.layoutManager);
  }
  /**
   * Get the pane ID for this primitive
   * Defaults to 0 (main pane) - can be overridden by subclasses if needed
   */
  getPaneId() {
    return 0;
  }
  /**
   * Get the chart ID for this primitive
   */
  getChartId() {
    return this.chart?.chartElement()?.id || "default";
  }
  // ===== Container Management =====
  /**
   * Ensure container element exists
   */
  ensureContainer() {
    if (this.containerElement) {
      return;
    }
    if (!this.chart) {
      return;
    }
    const chartElement = this.chart.chartElement();
    if (!chartElement) {
      return;
    }
    this.containerElement = document.createElement("div");
    this.containerElement.id = `${this.id}-container`;
    this.containerElement.className = `primitive-container ${this.getContainerClassName()}`;
    this.applyBaseContainerStyling();
    if (this.currentPosition) {
      this.applyPositionToContainer(this.currentPosition);
    }
    chartElement.appendChild(this.containerElement);
    this.onContainerCreated(this.containerElement);
  }
  /**
   * Apply position to container using CSS (no chart re-render)
   * Uses PrimitiveStylingUtils.applyPosition for DRY compliance
   */
  applyPositionToContainer(position) {
    if (!this.containerElement) return;
    PrimitiveStylingUtils.applyPosition(this.containerElement, position);
  }
  /**
   * Apply base container styling
   */
  applyBaseContainerStyling() {
    if (!this.containerElement) return;
    const style = this.containerElement.style;
    style.position = "absolute";
    style.pointerEvents = "auto";
    style.userSelect = "none";
    if (this.config.style) {
      const configStyle = this.config.style;
      const isLegend = this.id.includes("legend");
      if (configStyle.backgroundColor && !isLegend) {
        style.backgroundColor = configStyle.backgroundColor;
      }
      if (configStyle.color && !isLegend) style.color = configStyle.color;
      if (configStyle.fontSize) style.fontSize = `${configStyle.fontSize}px`;
      if (configStyle.fontFamily) style.fontFamily = configStyle.fontFamily;
      if (configStyle.borderRadius && !isLegend)
        style.borderRadius = `${configStyle.borderRadius}px`;
      if (configStyle.padding && !isLegend) style.padding = `${configStyle.padding}px`;
      if (isLegend) {
        style.margin = "0";
      } else if (configStyle.margin) {
        style.margin = `${configStyle.margin}px`;
      }
      if (configStyle.zIndex) style.zIndex = configStyle.zIndex.toString();
      if (isLegend) {
        style.backgroundColor = "transparent";
        style.color = "inherit";
      }
    }
  }
  /**
   * Destroy container element
   */
  destroyContainer() {
    if (this.containerElement && this.containerElement.parentNode) {
      this.containerElement.parentNode.removeChild(this.containerElement);
    }
    this.containerElement = null;
  }
  // ===== Template Processing System =====
  /**
   * Set template data for processing
   */
  setTemplateData(data) {
    this.templateData = { ...this.templateData, ...data };
    if (this.mounted) {
      this.processTemplate();
      this.renderContent();
    }
  }
  /**
   * Update template context for processing
   */
  updateTemplateContext(context) {
    this.templateContext = { ...this.templateContext, ...context };
    if (this.mounted) {
      this.processTemplate();
      this.renderContent();
    }
  }
  /**
   * Process template with current data using TemplateEngine
   */
  processTemplate() {
    const template = this.getTemplate();
    const context = {
      ...this.templateContext,
      customData: this.templateData
    };
    this.lastTemplateResult = this.templateEngine.processTemplate(template, context);
    if (this.lastTemplateResult.hasErrors) ;
  }
  /**
   * Get processed template content
   */
  getProcessedContent() {
    return this.lastTemplateResult?.content || this.getTemplate();
  }
  /**
   * Get template processing result for debugging
   */
  getTemplateResult() {
    return this.lastTemplateResult;
  }
  // ===== Event System Integration =====
  /**
   * Initialize event management
   */
  initializeEventManagement() {
    if (!this.chart) return;
    const chartId = this.getChartId();
    this.eventManager = PrimitiveEventManager.getInstance(chartId);
    this.eventManager.initialize(this.chart);
  }
  /**
   * Setup default event subscriptions
   */
  setupDefaultEventSubscriptions() {
    if (!this.eventManager) return;
    const crosshairSub = this.eventManager.subscribe("crosshairMove", (event) => {
      this.handleCrosshairMove(event);
    });
    this.eventSubscriptions.push(crosshairSub);
    this.setupCustomEventSubscriptions();
  }
  /**
   * Cleanup event subscriptions
   */
  cleanupEventSubscriptions() {
    this.eventSubscriptions.forEach((sub) => sub.unsubscribe());
    this.eventSubscriptions = [];
  }
  /**
   * Handle crosshair move events
   */
  handleCrosshairMove(event) {
    if (event.seriesData.size > 0 && this.series) {
      const seriesValue = event.seriesData.get(this.series);
      if (seriesValue) {
        this.updateTemplateContext({
          seriesData: seriesValue,
          formatting: this.config.style ? {
            valueFormat: ".2f",
            // Default format, can be overridden
            timeFormat: "YYYY-MM-DD HH:mm:ss"
          } : void 0
        });
      }
    }
    this.onCrosshairMove(event);
  }
  /**
   * Handle chart resize events
   */
  handleChartResize(event) {
    this.onChartResize(event);
  }
  /**
   * Get event manager instance
   */
  getEventManager() {
    return this.eventManager;
  }
  // ===== Visibility Management =====
  /**
   * Set primitive visibility
   */
  setVisible(visible) {
    if (this.visible !== visible) {
      this.visible = visible;
      if (this.containerElement) {
        this.containerElement.style.display = visible ? "block" : "none";
      }
      if (this.layoutManager) {
        this.layoutManager.updateWidgetVisibility(this.id, visible);
      }
      this.onVisibilityChanged(visible);
    }
  }
  /**
   * Toggle primitive visibility
   */
  toggle() {
    this.setVisible(!this.visible);
  }
  // ===== Configuration Management =====
  /**
   * Update primitive configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (this.containerElement) {
      this.applyBaseContainerStyling();
    }
    if (this.mounted) {
      this.updateAllViews();
    }
    this.onConfigUpdate(newConfig);
  }
  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  // ===== Lifecycle Hooks (optional overrides) =====
  /**
   * Called when primitive is attached to chart
   */
  onAttached(_params) {
  }
  /**
   * Called when primitive is detached from chart
   */
  onDetached() {
  }
  /**
   * Called during each update cycle
   */
  onUpdate() {
  }
  /**
   * Called when position is updated by layout manager
   */
  onPositionUpdate(_position) {
  }
  /**
   * Called when container element is created
   */
  onContainerCreated(_container) {
  }
  /**
   * Called when visibility changes
   */
  onVisibilityChanged(_visible) {
  }
  /**
   * Called when configuration is updated
   */
  onConfigUpdate(_newConfig) {
  }
  /**
   * Called when crosshair moves over the chart
   */
  onCrosshairMove(_event) {
  }
  /**
   * Called when chart is resized
   */
  onChartResize(_event) {
  }
  /**
   * Setup custom event subscriptions - override in subclasses
   */
  setupCustomEventSubscriptions() {
  }
  // ===== Utility Methods =====
  /**
   * Get current position
   */
  getPosition() {
    return this.currentPosition;
  }
  /**
   * Get container element
   */
  getContainer() {
    return this.containerElement;
  }
  /**
   * Check if primitive is mounted
   */
  isMounted() {
    return this.mounted;
  }
  /**
   * Get chart API reference
   */
  getChart() {
    return this.chart;
  }
  /**
   * Get series API reference
   */
  getSeries() {
    return this.series;
  }
}
const PrimitivePriority = {
  RANGE_SWITCHER: 1,
  // Highest priority - navigation aid
  MINIMIZE_BUTTON: 2,
  // High priority - always visible after range switcher
  LEGEND: 3,
  // Medium priority - important for data understanding
  CUSTOM: 10,
  // Default for custom primitives
  DEBUG: 999
  // Lowest priority - debug/development primitives
};
class LegendPrimitive extends BasePanePrimitive {
  constructor(id, config) {
    const configWithDefaults = {
      ...config,
      priority: config.priority ?? PrimitivePriority.LEGEND,
      visible: config.visible ?? true,
      isPanePrimitive: config.isPanePrimitive ?? true,
      paneId: config.paneId !== void 0 ? config.paneId : 0,
      // Use provided paneId or default to 0
      valueFormat: config.valueFormat ?? FormatDefaults.VALUE_FORMAT,
      style: {
        backgroundColor: LegendColors.DEFAULT_BACKGROUND,
        color: LegendColors.DEFAULT_COLOR,
        fontSize: LegendDimensions.FONT_SIZE,
        fontFamily: ContainerDefaults.FONT_FAMILY,
        padding: LegendDimensions.DEFAULT_PADDING,
        borderRadius: LegendDimensions.BORDER_RADIUS,
        textAlign: ContainerDefaults.TEXT_ALIGN,
        fontWeight: ContainerDefaults.FONT_WEIGHT,
        backgroundOpacity: LegendColors.DEFAULT_OPACITY,
        ...config.style
      }
    };
    super(id, configWithDefaults);
  }
  // ===== BasePanePrimitive Implementation =====
  /**
   * Get the template string for this legend
   */
  getTemplate() {
    return this.config.text || "$$value$$";
  }
  /**
   * Render the legend content to the container
   */
  renderContent() {
    if (!this.containerElement) return;
    const content = this.getProcessedContent();
    let legendElement = this.containerElement.querySelector(".legend-content");
    if (!legendElement) {
      legendElement = document.createElement("div");
      legendElement.className = "legend-content";
      legendElement.setAttribute("role", "img");
      legendElement.setAttribute("aria-label", "Chart legend");
      this.containerElement.appendChild(legendElement);
    }
    legendElement.innerHTML = sanitizeHtml(content);
    this.applyLegendStyling(legendElement);
  }
  /**
   * Apply legend-specific styling using standardized utilities
   */
  applyLegendStyling(element) {
    const config = this.config.style;
    if (config) {
      const typography = {
        textAlign: config.textAlign,
        fontWeight: config.fontWeight
      };
      const borderStyles = {};
      if (config.border) {
        borderStyles.borderWidth = config.border.width;
        borderStyles.borderColor = config.border.color;
        borderStyles.borderStyle = config.border.style;
      }
      const baseStyles = {
        cursor: CommonValues.DEFAULT_CURSOR
      };
      if (config.backgroundColor) {
        if (config.backgroundOpacity !== void 0) {
          baseStyles.backgroundColor = this.adjustColorOpacity(
            config.backgroundColor,
            config.backgroundOpacity
          );
        } else {
          baseStyles.backgroundColor = config.backgroundColor;
        }
      }
      if (config.color) {
        baseStyles.color = config.color;
      }
      if (config.textShadow) {
        baseStyles.boxShadow = config.textShadow;
      }
      PrimitiveStylingUtils.applyTypography(element, typography);
      PrimitiveStylingUtils.applyBorder(element, borderStyles);
      PrimitiveStylingUtils.applyBaseStyles(element, baseStyles);
      if (baseStyles.backgroundColor) {
        element.style.setProperty("background-color", baseStyles.backgroundColor, "important");
      }
      if (baseStyles.color) {
        element.style.setProperty("color", baseStyles.color, "important");
      }
      element.style.setProperty("padding", "0", "important");
      element.style.setProperty("margin", "0", "important");
      const style = element.style;
      style.userSelect = CommonValues.NONE;
      style.pointerEvents = CommonValues.NONE;
      style.whiteSpace = CommonValues.NOWRAP;
      style.overflow = CommonValues.HIDDEN;
      style.textOverflow = CommonValues.ELLIPSIS;
      style.maxWidth = `${LegendDimensions.MAX_WIDTH}px`;
      style.lineHeight = "1";
      style.boxSizing = "border-box";
      if (config.textShadow) {
        style.textShadow = config.textShadow;
      }
    }
  }
  /**
   * Adjust color opacity
   */
  adjustColorOpacity(color, opacity) {
    if (color.startsWith("rgba(")) {
      return color.replace(/rgba\(([^)]+)\)/, (match, values) => {
        const parts = values.split(",").map((s) => s.trim());
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`;
      });
    } else if (color.startsWith("rgb(")) {
      return color.replace(/rgb\(([^)]+)\)/, (match, values) => {
        return `rgba(${values}, ${opacity})`;
      });
    } else if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }
  /**
   * Get CSS class name for the container
   */
  getContainerClassName() {
    return "legend-primitive";
  }
  /**
   * Override pane ID for pane-specific legends
   */
  getPaneId() {
    if (this.config.isPanePrimitive && this.config.paneId !== void 0) {
      return this.config.paneId;
    }
    return 0;
  }
  // ===== Lifecycle Hooks =====
  /**
   * Setup custom event subscriptions for legend updates
   */
  setupCustomEventSubscriptions() {
    if (!this.eventManager) return;
    const crosshairSub = this.eventManager.subscribe("crosshairMove", (event) => {
      this.updateLegendFromCrosshair(event);
    });
    this.eventSubscriptions.push(crosshairSub);
  }
  /**
   * Handle crosshair move for legend value updates
   */
  onCrosshairMove(event) {
    this.updateLegendFromCrosshair(event);
  }
  /**
   * Update legend content from crosshair data
   */
  updateLegendFromCrosshair(event) {
    if (!event.time || !this.series || event.seriesData.size === 0) {
      this.updateTemplateContext({
        seriesData: void 0,
        formatting: {
          valueFormat: this.config.valueFormat || FormatDefaults.VALUE_FORMAT
        }
      });
      return;
    }
    const seriesValue = event.seriesData.get(this.series);
    if (seriesValue) {
      this.updateTemplateContext({
        seriesData: seriesValue,
        formatting: {
          valueFormat: this.config.valueFormat || FormatDefaults.VALUE_FORMAT,
          timeFormat: FormatDefaults.TIME_FORMAT
        }
      });
    }
  }
  /**
   * Called when container is created
   */
  onContainerCreated(_container) {
  }
  // ===== Public API =====
  /**
   * Update legend text template
   */
  updateText(text) {
    this.updateConfig({ text });
  }
  /**
   * Update value format
   */
  updateValueFormat(format) {
    this.updateConfig({ valueFormat: format });
  }
  /**
   * Get current legend content
   */
  getCurrentContent() {
    return this.getProcessedContent();
  }
  /**
   * Force update legend content
   */
  forceUpdate() {
    if (this.mounted) {
      this.processTemplate();
      this.renderContent();
    }
  }
}
function createLegendPrimitive(id, config) {
  return new LegendPrimitive(id, config);
}
const DefaultLegendConfigs = {
  /**
   * Simple value legend
   */
  simple: {
    text: "$$value$$",
    valueFormat: FormatDefaults.VALUE_FORMAT,
    style: {
      backgroundColor: LegendColors.DEFAULT_BACKGROUND,
      color: LegendColors.DEFAULT_COLOR,
      padding: LegendDimensions.DEFAULT_PADDING,
      borderRadius: LegendDimensions.BORDER_RADIUS
    }
  },
  /**
   * OHLC candlestick legend
   */
  ohlc: {
    text: "O: $$open$$ H: $$high$$ L: $$low$$ C: $$close$$",
    valueFormat: FormatDefaults.VALUE_FORMAT,
    style: {
      backgroundColor: LegendColors.DEFAULT_BACKGROUND,
      color: LegendColors.DEFAULT_COLOR,
      padding: LegendDimensions.OHLC_PADDING,
      borderRadius: LegendDimensions.BORDER_RADIUS,
      fontSize: LegendDimensions.OHLC_FONT_SIZE
    }
  },
  /**
   * Volume legend
   */
  volume: {
    text: "Vol: $$volume$$",
    valueFormat: FormatDefaults.VOLUME_FORMAT,
    style: {
      backgroundColor: LegendColors.VOLUME_BACKGROUND,
      color: LegendColors.DEFAULT_COLOR,
      padding: LegendDimensions.DEFAULT_PADDING,
      borderRadius: LegendDimensions.BORDER_RADIUS
    }
  },
  /**
   * Band/ribbon legend
   */
  band: {
    text: "U: $$upper$$ M: $$middle$$ L: $$lower$$",
    valueFormat: FormatDefaults.BAND_FORMAT,
    style: {
      backgroundColor: LegendColors.BAND_BACKGROUND,
      color: LegendColors.DEFAULT_COLOR,
      padding: LegendDimensions.BAND_PADDING,
      borderRadius: LegendDimensions.BORDER_RADIUS,
      fontSize: LegendDimensions.BAND_FONT_SIZE
    }
  }
};
var TimeRange = /* @__PURE__ */ ((TimeRange2) => {
  TimeRange2["FIVE_MINUTES"] = "FIVE_MINUTES";
  TimeRange2["FIFTEEN_MINUTES"] = "FIFTEEN_MINUTES";
  TimeRange2["THIRTY_MINUTES"] = "THIRTY_MINUTES";
  TimeRange2["ONE_HOUR"] = "ONE_HOUR";
  TimeRange2["FOUR_HOURS"] = "FOUR_HOURS";
  TimeRange2["ONE_DAY"] = "ONE_DAY";
  TimeRange2["ONE_WEEK"] = "ONE_WEEK";
  TimeRange2["TWO_WEEKS"] = "TWO_WEEKS";
  TimeRange2["ONE_MONTH"] = "ONE_MONTH";
  TimeRange2["THREE_MONTHS"] = "THREE_MONTHS";
  TimeRange2["SIX_MONTHS"] = "SIX_MONTHS";
  TimeRange2["ONE_YEAR"] = "ONE_YEAR";
  TimeRange2["TWO_YEARS"] = "TWO_YEARS";
  TimeRange2["FIVE_YEARS"] = "FIVE_YEARS";
  TimeRange2["ALL"] = "ALL";
  return TimeRange2;
})(TimeRange || {});
function getRangeValue(rangeConfig) {
  if (rangeConfig.range !== void 0) {
    return rangeConfig.range;
  }
  return rangeConfig.seconds || null;
}
function isAllRange(rangeConfig) {
  const range = getRangeValue(rangeConfig);
  return range === null || range === "ALL";
}
function getSecondsFromRange(range) {
  if (range === null || range === "ALL") {
    return null;
  }
  if (typeof range === "number") {
    return range;
  }
  switch (range) {
    case "FIVE_MINUTES":
      return TimeRangeSeconds.FIVE_MINUTES;
    case "FIFTEEN_MINUTES":
      return TimeRangeSeconds.FIFTEEN_MINUTES;
    case "THIRTY_MINUTES":
      return 1800;
    // 30 minutes
    case "ONE_HOUR":
      return TimeRangeSeconds.ONE_HOUR;
    case "FOUR_HOURS":
      return TimeRangeSeconds.FOUR_HOURS;
    case "ONE_DAY":
      return TimeRangeSeconds.ONE_DAY;
    case "ONE_WEEK":
      return TimeRangeSeconds.ONE_WEEK;
    case "TWO_WEEKS":
      return TimeRangeSeconds.ONE_WEEK * 2;
    case "ONE_MONTH":
      return TimeRangeSeconds.ONE_MONTH;
    case "THREE_MONTHS":
      return TimeRangeSeconds.THREE_MONTHS;
    case "SIX_MONTHS":
      return TimeRangeSeconds.SIX_MONTHS;
    case "ONE_YEAR":
      return TimeRangeSeconds.ONE_YEAR;
    case "TWO_YEARS":
      return TimeRangeSeconds.ONE_YEAR * 2;
    case "FIVE_YEARS":
      return TimeRangeSeconds.FIVE_YEARS;
    default:
      return null;
  }
}
class RangeSwitcherPrimitive extends BasePanePrimitive {
  // Store interval ID for cleanup
  constructor(id, config) {
    const configWithDefaults = {
      ...config,
      priority: config.priority ?? PrimitivePriority.RANGE_SWITCHER,
      visible: config.visible ?? true,
      style: {
        backgroundColor: "transparent",
        padding: DefaultRangeSwitcherConfig.layout.CONTAINER_PADDING,
        container: {
          display: "flex",
          flexDirection: DefaultRangeSwitcherConfig.layout.FLEX_DIRECTION,
          gap: DefaultRangeSwitcherConfig.layout.CONTAINER_GAP,
          alignItems: DefaultRangeSwitcherConfig.layout.ALIGN_ITEMS,
          justifyContent: DefaultRangeSwitcherConfig.layout.JUSTIFY_CONTENT
        },
        button: {
          backgroundColor: ButtonColors.DEFAULT_BACKGROUND,
          color: ButtonColors.DEFAULT_COLOR,
          hoverBackgroundColor: ButtonColors.HOVER_BACKGROUND,
          hoverColor: ButtonColors.HOVER_COLOR,
          border: ButtonEffects.DEFAULT_BORDER,
          borderRadius: ButtonDimensions.BORDER_RADIUS,
          padding: ButtonSpacing.RANGE_BUTTON_PADDING,
          margin: "0 2px",
          fontSize: ButtonDimensions.RANGE_FONT_SIZE,
          fontWeight: 500,
          minWidth: ButtonDimensions.MIN_WIDTH_RANGE
        },
        ...config.style
      }
    };
    super(id, configWithDefaults);
    this.buttonElements = [];
    this.buttonEventCleanupFunctions = [];
    this.dataTimespan = null;
    this.initialVisibilitySetupComplete = false;
    this.dataChangeIntervalId = null;
  }
  // ===== BasePanePrimitive Implementation =====
  /**
   * Get the template string (not used for interactive elements)
   */
  getTemplate() {
    return "";
  }
  /**
   * Render the range switcher buttons
   */
  renderContent() {
    if (!this.containerElement) return;
    if (this.buttonElements.length > 0) {
      return;
    }
    this.cleanupButtonEventListeners();
    this.containerElement.innerHTML = "";
    this.buttonElements = [];
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "range-switcher-container";
    this.applyContainerStyling(buttonContainer);
    this.config.ranges.forEach((range, index) => {
      const button = this.createRangeButton(range, index);
      buttonContainer.appendChild(button);
      this.buttonElements.push(button);
    });
    this.containerElement.appendChild(buttonContainer);
  }
  /**
   * Create a single range button
   */
  createRangeButton(range, index) {
    const button = this.createButtonElement(range, index);
    this.applyButtonStyling(button, false);
    this.attachButtonEventHandlers(button, index);
    return button;
  }
  /**
   * Create the basic button element with attributes
   */
  createButtonElement(range, index) {
    const button = document.createElement("button");
    button.className = "range-button";
    button.textContent = range.text;
    button.setAttribute("data-range-index", index.toString());
    button.setAttribute("aria-label", `Switch to ${range.text} time range`);
    const rangeValue = getRangeValue(range);
    const seconds = getSecondsFromRange(rangeValue);
    if (seconds !== null) {
      button.setAttribute("data-range-seconds", seconds.toString());
    }
    return button;
  }
  /**
   * Attach event handlers to range button
   */
  attachButtonEventHandlers(button, index) {
    const eventHandlers = this.createButtonEventHandlers(button, index);
    button.addEventListener("click", eventHandlers.click);
    button.addEventListener("mouseenter", eventHandlers.mouseEnter);
    button.addEventListener("mouseleave", eventHandlers.mouseLeave);
    const cleanup = () => {
      button.removeEventListener("click", eventHandlers.click);
      button.removeEventListener("mouseenter", eventHandlers.mouseEnter);
      button.removeEventListener("mouseleave", eventHandlers.mouseLeave);
    };
    this.buttonEventCleanupFunctions.push(cleanup);
  }
  /**
   * Create event handler functions for range button
   */
  createButtonEventHandlers(button, index) {
    return {
      click: (_e) => {
        _e.preventDefault();
        _e.stopPropagation();
        this.handleRangeClick(index);
      },
      mouseEnter: () => {
        this.applyButtonStyling(button, false, true);
      },
      mouseLeave: () => {
        this.applyButtonStyling(button, false, false);
      }
    };
  }
  /**
   * Clean up button event listeners
   */
  cleanupButtonEventListeners() {
    this.buttonEventCleanupFunctions.forEach((cleanup) => cleanup());
    this.buttonEventCleanupFunctions = [];
  }
  /**
   * Apply container styling
   */
  applyContainerStyling(container) {
    const style = container.style;
    const containerConfig = this.config.style?.container;
    if (containerConfig) {
      if (containerConfig.display) style.display = containerConfig.display;
      if (containerConfig.flexDirection) style.flexDirection = containerConfig.flexDirection;
      if (containerConfig.gap) style.gap = `${containerConfig.gap}px`;
      if (containerConfig.alignItems) style.alignItems = containerConfig.alignItems;
      if (containerConfig.justifyContent) style.justifyContent = containerConfig.justifyContent;
    }
    style.pointerEvents = "auto";
  }
  /**
   * Apply button styling using standardized utilities
   */
  applyButtonStyling(button, isActive, isHover = false) {
    const buttonConfig = this.config.style?.button;
    if (buttonConfig) {
      const baseStyles = {
        border: buttonConfig.border || ButtonEffects.RANGE_BORDER,
        borderRadius: buttonConfig.borderRadius || 4,
        // Rounded corners for modern look
        padding: buttonConfig.padding || ButtonSpacing.RANGE_BUTTON_PADDING,
        margin: buttonConfig.margin || ButtonSpacing.RANGE_BUTTON_MARGIN,
        fontSize: buttonConfig.fontSize || 11,
        // Slightly smaller font for compactness
        fontWeight: buttonConfig.fontWeight || CommonValues.FONT_WEIGHT_MEDIUM,
        backgroundColor: buttonConfig.backgroundColor || "rgba(255, 255, 255, 0.9)",
        color: buttonConfig.color || "#666",
        cursor: CommonValues.POINTER,
        transition: ButtonEffects.DEFAULT_TRANSITION,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
        // Subtle shadow for depth
      };
      const stateStyles = {};
      if (isHover) {
        stateStyles.backgroundColor = buttonConfig.hoverBackgroundColor || "rgba(255, 255, 255, 1)";
        stateStyles.color = buttonConfig.hoverColor || "#333";
        stateStyles.boxShadow = ButtonEffects.RANGE_HOVER_BOX_SHADOW;
        stateStyles.transform = "translateY(-1px)";
      }
      const state = isHover ? "hover" : "default";
      PrimitiveStylingUtils.applyInteractionState(button, baseStyles, stateStyles, state);
      if (buttonConfig.minWidth) {
        button.style.minWidth = `${buttonConfig.minWidth}px`;
      }
    }
  }
  /**
   * Handle range button click
   */
  handleRangeClick(index) {
    this.applyRangeToChart(this.config.ranges[index]);
    if (this.config.onRangeChange) {
      this.config.onRangeChange(this.config.ranges[index], index);
    }
    if (this.eventManager) {
      this.eventManager.emitCustomEvent("rangeChange", {
        range: this.config.ranges[index],
        index
      });
    }
  }
  /**
   * Apply range to chart time scale
   */
  applyRangeToChart(range) {
    if (!this.chart) return;
    try {
      const timeScale = this.chart.timeScale();
      const rangeValue = getRangeValue(range);
      const seconds = getSecondsFromRange(rangeValue);
      if (seconds === null) {
        timeScale.fitContent();
      } else {
        const currentRange = timeScale.getVisibleRange();
        let endTime;
        if (currentRange && currentRange.to) {
          endTime = currentRange.to;
        } else {
          endTime = Date.now() / 1e3;
        }
        const fromTime = endTime - seconds;
        timeScale.setVisibleRange({
          from: fromTime,
          to: endTime
        });
      }
    } catch {
    }
  }
  /**
   * Get the timespan of available data in seconds
   */
  getDataTimespan() {
    if (!this.chart) return null;
    if (this.dataTimespan !== null) {
      return this.dataTimespan;
    }
    try {
      const timeScale = this.chart.timeScale();
      const currentRange = timeScale.getVisibleRange();
      timeScale.fitContent();
      const fullRange = timeScale.getVisibleRange();
      if (currentRange) {
        timeScale.setVisibleRange(currentRange);
      }
      if (!fullRange || !fullRange.from || !fullRange.to) return null;
      const timespanSeconds = fullRange.to - fullRange.from;
      this.dataTimespan = timespanSeconds;
      return timespanSeconds;
    } catch {
      return null;
    }
  }
  /**
   * Check if a range is valid for the current data
   */
  isRangeValidForData(range) {
    const rangeValue = getRangeValue(range);
    if (isAllRange(range)) {
      return true;
    }
    const rangeSeconds = getSecondsFromRange(rangeValue);
    if (rangeSeconds === null) {
      return true;
    }
    const dataTimespan = this.getDataTimespan();
    if (dataTimespan === null) {
      return true;
    }
    const bufferMultiplier = 1.1;
    return rangeSeconds <= dataTimespan * bufferMultiplier;
  }
  /**
   * Get CSS class name for the container
   */
  getContainerClassName() {
    return "range-switcher-primitive";
  }
  /**
   * Override pane ID - range switcher is chart-level (pane 0)
   */
  getPaneId() {
    return 0;
  }
  // ===== Lifecycle Hooks =====
  /**
   * Override detached to ensure proper cleanup
   */
  detached() {
    if (this.dataChangeIntervalId) {
      clearInterval(this.dataChangeIntervalId);
      this.dataChangeIntervalId = null;
    }
    this.cleanupButtonEventListeners();
    super.detached();
  }
  /**
   * Setup custom event subscriptions
   */
  setupCustomEventSubscriptions() {
    if (!this.eventManager) return;
    const dataUpdateSub = this.eventManager.subscribe("dataUpdate", () => {
      this.handleDataUpdate();
    });
    this.eventSubscriptions.push(dataUpdateSub);
  }
  /**
   * Handle data updates that might affect range visibility
   * Only processes during initial setup, not after user interactions
   */
  handleDataUpdate() {
    if (this.mounted && !this.initialVisibilitySetupComplete) {
      this.invalidateDataTimespan();
      this.updateRangeButtonVisibility();
    }
  }
  /**
   * Update range button visibility based on current data
   * Only hides buttons during initial setup, not after user interactions
   */
  updateRangeButtonVisibility() {
    if (this.initialVisibilitySetupComplete) {
      return;
    }
    this.config.ranges.forEach((range, index) => {
      const button = this.buttonElements[index];
      if (button) {
        if (this.isRangeValidForData(range)) {
          button.style.display = "";
          button.removeAttribute("data-hidden-reason");
        } else {
          button.style.display = "none";
          button.setAttribute("data-hidden-reason", "exceeds-data-range");
        }
      }
    });
  }
  /**
   * Called when container is created
   */
  onContainerCreated(container) {
    container.style.pointerEvents = "auto";
    this.setupDataChangeObserver();
  }
  /**
   * Set up observer to detect chart data changes
   */
  setupDataChangeObserver() {
    if (!this.chart) return;
    const checkDataChanges = () => {
      if (this.mounted && !this.initialVisibilitySetupComplete) {
        const currentTimespan = this.getDataTimespan();
        if (currentTimespan !== this.dataTimespan) {
          this.updateRangeButtonVisibility();
        }
      }
    };
    this.dataChangeIntervalId = setInterval(checkDataChanges, 1e3);
  }
  // ===== Public API =====
  /**
   * Add a new range
   */
  addRange(range) {
    this.config.ranges.push(range);
    if (this.mounted) {
      this.invalidateDataTimespan();
      this.renderContent();
    }
  }
  /**
   * Remove a range by index
   */
  removeRange(index) {
    if (index < 0 || index >= this.config.ranges.length) return;
    this.config.ranges.splice(index, 1);
    if (this.mounted) {
      this.renderContent();
    }
  }
  /**
   * Update ranges
   */
  updateRanges(ranges) {
    this.config.ranges = ranges;
    if (this.mounted) {
      this.invalidateDataTimespan();
      this.renderContent();
    }
  }
  /**
   * Invalidate cached data timespan (call when data changes)
   */
  invalidateDataTimespan() {
    this.dataTimespan = null;
  }
  /**
   * Get the current data timespan in seconds
   */
  getDataTimespanSeconds() {
    return this.getDataTimespan();
  }
  /**
   * Force update of range button visibility
   * Useful when called externally after data changes
   */
  updateButtonVisibility() {
    if (this.mounted && !this.initialVisibilitySetupComplete) {
      this.invalidateDataTimespan();
      this.updateRangeButtonVisibility();
    }
  }
  /**
   * Get information about hidden ranges
   */
  getHiddenRanges() {
    const hiddenRanges = [];
    this.config.ranges.forEach((range, index) => {
      if (!this.isRangeValidForData(range)) {
        hiddenRanges.push({
          range,
          index,
          reason: "exceeds-data-range"
        });
      }
    });
    return hiddenRanges;
  }
  /**
   * Get information about visible ranges
   */
  getVisibleRangeInfo() {
    const dataTimespan = this.getDataTimespan();
    return this.config.ranges.map((range, index) => ({ range, index, dataTimespan })).filter(({ range }) => this.isRangeValidForData(range));
  }
  /**
   * Programmatically trigger range change
   */
  triggerRangeChange(index) {
    this.handleRangeClick(index);
  }
}
function createRangeSwitcherPrimitive(id, config) {
  return new RangeSwitcherPrimitive(id, config);
}
const DefaultRangeConfigs = {
  /**
   * Standard trading ranges (using enum)
   */
  trading: [
    {
      text: "1D",
      range: "ONE_DAY"
      /* ONE_DAY */
    },
    {
      text: "7D",
      range: "ONE_WEEK"
      /* ONE_WEEK */
    },
    {
      text: "1M",
      range: "ONE_MONTH"
      /* ONE_MONTH */
    },
    {
      text: "3M",
      range: "THREE_MONTHS"
      /* THREE_MONTHS */
    },
    {
      text: "1Y",
      range: "ONE_YEAR"
      /* ONE_YEAR */
    },
    {
      text: "All",
      range: "ALL"
      /* ALL */
    }
  ],
  /**
   * Short-term trading ranges (using enum)
   */
  shortTerm: [
    {
      text: "5M",
      range: "FIVE_MINUTES"
      /* FIVE_MINUTES */
    },
    {
      text: "15M",
      range: "FIFTEEN_MINUTES"
      /* FIFTEEN_MINUTES */
    },
    {
      text: "30M",
      range: "THIRTY_MINUTES"
      /* THIRTY_MINUTES */
    },
    {
      text: "1H",
      range: "ONE_HOUR"
      /* ONE_HOUR */
    },
    {
      text: "4H",
      range: "FOUR_HOURS"
      /* FOUR_HOURS */
    },
    {
      text: "1D",
      range: "ONE_DAY"
      /* ONE_DAY */
    },
    {
      text: "All",
      range: "ALL"
      /* ALL */
    }
  ],
  /**
   * Long-term investment ranges (using enum)
   */
  longTerm: [
    {
      text: "1M",
      range: "ONE_MONTH"
      /* ONE_MONTH */
    },
    {
      text: "3M",
      range: "THREE_MONTHS"
      /* THREE_MONTHS */
    },
    {
      text: "6M",
      range: "SIX_MONTHS"
      /* SIX_MONTHS */
    },
    {
      text: "1Y",
      range: "ONE_YEAR"
      /* ONE_YEAR */
    },
    {
      text: "2Y",
      range: "TWO_YEARS"
      /* TWO_YEARS */
    },
    {
      text: "5Y",
      range: "FIVE_YEARS"
      /* FIVE_YEARS */
    },
    {
      text: "All",
      range: "ALL"
      /* ALL */
    }
  ],
  /**
   * Custom minimal ranges (using enum)
   */
  minimal: [
    {
      text: "1D",
      range: "ONE_DAY"
      /* ONE_DAY */
    },
    {
      text: "1W",
      range: "ONE_WEEK"
      /* ONE_WEEK */
    },
    {
      text: "1M",
      range: "ONE_MONTH"
      /* ONE_MONTH */
    },
    {
      text: "All",
      range: "ALL"
      /* ALL */
    }
  ],
  /**
   * @deprecated Legacy configurations (kept for backwards compatibility)
   * Use the enum-based configurations above for new implementations
   */
  legacy: {
    trading: [
      { text: "1D", seconds: TimeRangeSeconds.ONE_DAY },
      { text: "7D", seconds: TimeRangeSeconds.ONE_WEEK },
      { text: "1M", seconds: TimeRangeSeconds.ONE_MONTH },
      { text: "3M", seconds: TimeRangeSeconds.THREE_MONTHS },
      { text: "1Y", seconds: TimeRangeSeconds.ONE_YEAR },
      { text: "All", seconds: null }
    ],
    shortTerm: [
      { text: "5M", seconds: TimeRangeSeconds.FIVE_MINUTES },
      { text: "15M", seconds: TimeRangeSeconds.FIFTEEN_MINUTES },
      { text: "1H", seconds: TimeRangeSeconds.ONE_HOUR },
      { text: "4H", seconds: TimeRangeSeconds.FOUR_HOURS },
      { text: "1D", seconds: TimeRangeSeconds.ONE_DAY },
      { text: "All", seconds: null }
    ],
    longTerm: [
      { text: "1M", seconds: TimeRangeSeconds.ONE_MONTH },
      { text: "3M", seconds: TimeRangeSeconds.THREE_MONTHS },
      { text: "6M", seconds: TimeRangeSeconds.SIX_MONTHS },
      { text: "1Y", seconds: TimeRangeSeconds.ONE_YEAR },
      { text: "5Y", seconds: TimeRangeSeconds.FIVE_YEARS },
      { text: "All", seconds: null }
    ],
    minimal: [
      { text: "1D", seconds: TimeRangeSeconds.ONE_DAY },
      { text: "1W", seconds: TimeRangeSeconds.ONE_WEEK },
      { text: "1M", seconds: TimeRangeSeconds.ONE_MONTH },
      { text: "All", seconds: null }
    ]
  }
};
class TradeRectangleRenderer {
  /**
   * Creates a new TradeRectangleRenderer
   *
   * @param {Coordinate} x1 - X coordinate of first corner
   * @param {Coordinate} y1 - Y coordinate of first corner
   * @param {Coordinate} x2 - X coordinate of second corner
   * @param {Coordinate} y2 - Y coordinate of second corner
   * @param {string} fillColor - Fill color (hex or rgba format)
   * @param {string} borderColor - Border color (hex or rgba format)
   * @param {number} borderWidth - Border width in pixels
   * @param {number} opacity - Fill opacity from 0.0 (transparent) to 1.0 (opaque)
   */
  constructor(x1, y1, x2, y2, fillColor, borderColor, borderWidth, opacity) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._fillColor = fillColor;
    this._borderColor = borderColor;
    this._borderWidth = borderWidth;
    this._opacity = opacity;
  }
  /**
   * Draw method (not used for rectangles)
   *
   * Required by IPrimitivePaneRenderer interface but not used.
   * Rectangles are drawn in drawBackground() to appear behind other elements.
   *
   * @param {any} _target - Rendering target (unused)
   */
  draw(_target) {
  }
  /**
   * Draw the trade rectangle on the canvas background layer
   *
   * Renders the rectangle using bitmap coordinate space for pixel-perfect drawing.
   * Applies fill color with opacity and border with specified width.
   *
   * Drawing process:
   * 1. Validate coordinates are not null/undefined
   * 2. Convert to bitmap coordinates with pixel ratio
   * 3. Calculate rectangle bounds (left, top, width, height)
   * 4. Draw filled rectangle with opacity
   * 5. Draw border if border width > 0
   *
   * @param {any} target - Rendering target with useBitmapCoordinateSpace method
   *
   * @remarks
   * - Uses drawBackground to render behind other chart elements
   * - Text labels are NOT rendered here (handled by tooltip system)
   * - Returns early if coordinates are invalid or rectangle is too small
   */
  drawBackground(target) {
    if (this._x1 === null || this._y1 === null || this._x2 === null || this._y2 === null || this._x1 === void 0 || this._y1 === void 0 || this._x2 === void 0 || this._y2 === void 0) {
      return;
    }
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const x1 = this._x1 * scope.horizontalPixelRatio;
      const y1 = this._y1 * scope.verticalPixelRatio;
      const x2 = this._x2 * scope.horizontalPixelRatio;
      const y2 = this._y2 * scope.verticalPixelRatio;
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      if (width < 1 || height < 1) {
        return;
      }
      try {
        ctx.globalAlpha = this._opacity;
        ctx.fillStyle = this._fillColor;
        ctx.fillRect(left, top, width, height);
        if (this._borderWidth > 0) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = this._borderColor;
          ctx.lineWidth = this._borderWidth * scope.horizontalPixelRatio;
          ctx.strokeRect(left, top, width, height);
        }
      } finally {
        ctx.globalAlpha = 1;
      }
    });
  }
}
class TradeRectangleView {
  /**
   * Creates a new TradeRectangleView
   *
   * @param {TradeRectanglePrimitive} source - Parent primitive containing trade data
   */
  constructor(source) {
    this._x1 = 0;
    this._y1 = 0;
    this._x2 = 0;
    this._y2 = 0;
    this._source = source;
  }
  /**
   * Update coordinates by converting trade data to screen coordinates
   *
   * Called by Lightweight Charts when the view needs to be updated (pan, zoom,
   * resize, etc.). Converts trade times and prices to screen coordinates using
   * the chart's time scale and price scale.
   *
   * Conversion process:
   * 1. Get trade data, chart API, and series API from source
   * 2. Convert entry/exit times to X coordinates
   * 3. Convert entry/exit prices to Y coordinates
   * 4. Validate all conversions succeeded
   * 5. Cache coordinates for renderer
   *
   * @remarks
   * - Returns silently if conversion fails (coordinates will be null)
   * - Validates coordinates are finite numbers
   * - Uses direct coordinate conversion (not ChartCoordinateService)
   */
  update() {
    const data = this._source.data();
    const chart = this._source.chart();
    const series = this._source.series();
    if (!chart || !series || !data) {
      return;
    }
    try {
      const timeScale = chart.timeScale();
      const x1 = timeScale.timeToCoordinate(data.time1);
      const x2 = timeScale.timeToCoordinate(data.time2);
      const y1 = series.priceToCoordinate(data.price1);
      const y2 = series.priceToCoordinate(data.price2);
      if (x1 === null || x2 === null || y1 === null || y2 === null) {
        return;
      }
      if (!isFinite(x1) || !isFinite(x2) || !isFinite(y1) || !isFinite(y2)) {
        return;
      }
      this._x1 = x1;
      this._y1 = y1;
      this._x2 = x2;
      this._y2 = y2;
    } catch {
      return;
    }
  }
  /**
   * Create renderer with current coordinates
   *
   * Called by Lightweight Charts to get the renderer for drawing.
   * Creates a new TradeRectangleRenderer with the current screen coordinates
   * and styling properties from the trade data.
   *
   * @returns {TradeRectangleRenderer} Renderer instance for canvas drawing
   */
  renderer() {
    const data = this._source.data();
    return new TradeRectangleRenderer(
      this._x1,
      this._y1,
      this._x2,
      this._y2,
      data.fillColor,
      data.borderColor,
      data.borderWidth,
      data.opacity
    );
  }
}
class TradeRectanglePrimitive {
  /**
   * Creates a new TradeRectanglePrimitive
   *
   * @param {TradeRectangleData} data - Trade rectangle data with time/price bounds
   * @param {TradeRectangleTooltipOptions} [tooltipOptions] - Optional tooltip configuration
   */
  constructor(data, tooltipOptions) {
    this._chart = null;
    this._series = null;
    this._updateThrottled = false;
    this._data = data;
    this._paneView = new TradeRectangleView(this);
    this._primitiveId = `trade-rect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this._tooltipOptions = {
      priority: 10,
      enabled: true,
      customStyle: "",
      ...tooltipOptions
    };
  }
  /**
   * Update all views (required by ISeriesPrimitive)
   *
   * Called by Lightweight Charts when the primitive needs to recalculate coordinates.
   * Triggers coordinate conversion in the view layer.
   */
  updateAllViews() {
    this._paneView.update();
  }
  /**
   * Get all pane views (required by ISeriesPrimitive)
   *
   * @returns {TradeRectangleView[]} Array containing the single pane view
   */
  paneViews() {
    return [this._paneView];
  }
  /**
   * Get unique primitive identifier
   *
   * Used by TooltipManager to track tooltip requests from this primitive.
   *
   * @returns {string} Unique primitive ID
   */
  getId() {
    return this._primitiveId;
  }
  /**
   * Create tooltip HTML content for this trade rectangle
   *
   * Generates HTML content for the tooltip using either a custom template
   * (if provided) or the default tooltip format. All data comes from the
   * backend - no calculations are performed in the frontend.
   *
   * Template processing:
   * 1. If custom template provided, use TradeTemplateProcessor
   * 2. Otherwise, generate default HTML with trade details
   * 3. Apply profitability colors (green for profit, red for loss)
   *
   * @private
   * @returns {string} HTML string for tooltip content
   *
   * @remarks
   * - Uses backend-provided isProfitable flag (no frontend calculations)
   * - Supports template placeholders like $$entry_price$$, $$pnl$$, etc.
   * - Spreads all trade data for maximum template flexibility
   */
  createTooltipContent() {
    if (this._tooltipOptions.tooltipTemplate) {
      const templateData = {
        tradeType: this._data.tradeType || "long",
        entryPrice: this._data.price1,
        exitPrice: this._data.price2,
        pnl: this._data.price2 - this._data.price1,
        // Simple price difference
        pnlPercentage: (this._data.price2 - this._data.price1) / this._data.price1 * 100,
        quantity: this._data.quantity,
        notes: this._data.notes,
        tradeId: this._data.tradeId,
        entryTime: this._data.time1,
        exitTime: this._data.time2,
        // Spread all additional data for flexible template access
        ...this._data
      };
      const result = TradeTemplateProcessor.processTemplate(
        this._tooltipOptions.tooltipTemplate,
        templateData
      );
      return result.content;
    }
    const priceDifference = this._data.price2 - this._data.price1;
    const pnl = priceDifference;
    const pnlPercent = (pnl / this._data.price1 * 100).toFixed(2);
    const isProfitable = this._data.isProfitable ?? false;
    const side = isProfitable ? "PROFIT" : "LOSS";
    const sideColor = isProfitable ? "#00ff88" : "#ff4444";
    const pnlColor = isProfitable ? "#00ff88" : "#ff4444";
    const tradeDirection = (this._data.tradeType || this._data.trade_type || "LONG").toUpperCase();
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="
          color: ${sideColor};
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 3px;
        ">
          ${tradeDirection} - ${side}
        </div>
        <div style="font-size: 10px; line-height: 1.3;">
          <div>Entry: $${this._data.price1.toFixed(2)}</div>
          <div>Exit: $${this._data.price2.toFixed(2)}</div>
          <div style="color: ${pnlColor}; font-weight: bold;">
            P&L: $${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} (${pnlPercent}%)
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Create tooltip CSS style
   */
  /**
   * Create tooltip CSS styling
   *
   * Generates inline CSS for the tooltip with a modern dark theme.
   * Merges base styles with any custom styles from tooltip options.
   *
   * @private
   * @returns {string} CSS string for tooltip styling
   */
  createTooltipStyle() {
    const baseStyle = `
      background: linear-gradient(135deg, rgba(30, 30, 40, 0.98), rgba(20, 20, 30, 0.98));
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 10px 12px;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      white-space: nowrap;
      min-width: 180px;
    `;
    return baseStyle + (this._tooltipOptions.customStyle || "");
  }
  /**
   * Hit test to check if mouse coordinates are inside the trade rectangle
   *
   * Performs precise hit testing by converting trade data coordinates to
   * screen coordinates and checking if the mouse position falls within
   * the rectangle bounds (with tolerance buffer).
   *
   * Process:
   * 1. Convert trade times/prices to screen coordinates
   * 2. Calculate rectangle bounds (left, right, top, bottom)
   * 3. Add 2px tolerance buffer for easier interaction
   * 4. Check if mouse (x, y) is within expanded bounds
   *
   * @param {number} x - Mouse X coordinate (screen pixels)
   * @param {number} y - Mouse Y coordinate (screen pixels)
   * @returns {PrimitiveHoveredItem | null} Hit result or null if not hit
   *
   * @remarks
   * - Returns null if chart/series not available
   * - Returns null if coordinate conversion fails
   * - Uses 2px tolerance buffer for better UX
   * - Silently catches and handles any conversion errors
   */
  hitTest(x, y) {
    if (!this._chart || !this._series) {
      return null;
    }
    try {
      const timeScale = this._chart.timeScale();
      const x1 = timeScale.timeToCoordinate(this._data.time1);
      const x2 = timeScale.timeToCoordinate(this._data.time2);
      const y1 = this._series.priceToCoordinate(this._data.price1);
      const y2 = this._series.priceToCoordinate(this._data.price2);
      if (x1 === null || x2 === null || y1 === null || y2 === null) {
        return null;
      }
      const rectLeft = Math.min(x1, x2);
      const rectRight = Math.max(x1, x2);
      const rectTop = Math.min(y1, y2);
      const rectBottom = Math.max(y1, y2);
      const tolerance = 2;
      const expandedLeft = rectLeft - tolerance;
      const expandedRight = rectRight + tolerance;
      const expandedTop = rectTop - tolerance;
      const expandedBottom = rectBottom + tolerance;
      if (x >= expandedLeft && x <= expandedRight && y >= expandedTop && y <= expandedBottom) {
        return {
          externalId: this._data.tradeId || "trade-rectangle",
          zOrder: "normal"
        };
      }
      return null;
    } catch {
      return null;
    }
  }
  /**
   * Handle crosshair move events for tooltip display
   *
   * Called whenever the crosshair moves on the chart. Performs hit testing
   * to determine if the crosshair is over this trade rectangle and requests/hides
   * the tooltip accordingly via the TooltipManager.
   *
   * Process:
   * 1. Validate tooltip is enabled and crosshair point is valid
   * 2. Perform hit test with current crosshair position
   * 3. If hit, request tooltip with content/style
   * 4. If not hit, hide tooltip
   *
   * @private
   * @param {any} param - Crosshair move event parameter with point property
   *
   * @remarks
   * - Returns early if tooltips are disabled
   * - Validates point coordinates are numbers before hit testing
   * - Uses TooltipManager for decoupled tooltip display
   * - Catches and logs hit test errors to prevent tooltip flickering
   */
  handleCrosshairMove(param) {
    if (!this._tooltipOptions.enabled) {
      return;
    }
    if (!param.point || typeof param.point.x !== "number" || typeof param.point.y !== "number") {
      TooltipManager.getInstance().hideTooltip(this._primitiveId);
      return;
    }
    try {
      const isHit = this.hitTest(param.point.x, param.point.y);
      if (isHit) {
        TooltipManager.getInstance().requestTooltip({
          source: this._primitiveId,
          priority: this._tooltipOptions.priority || 10,
          content: this.createTooltipContent(),
          style: this.createTooltipStyle(),
          position: param.point,
          cssClasses: ["trade-tooltip"]
        });
      } else {
        TooltipManager.getInstance().hideTooltip(this._primitiveId);
      }
    } catch (error) {
      logger.warn("Hit test error in crosshair handler", "TradeRectanglePrimitive", error);
      TooltipManager.getInstance().hideTooltip(this._primitiveId);
    }
  }
  /**
   * Lifecycle: Primitive attached to series
   *
   * Called by Lightweight Charts when this primitive is attached to a series.
   * Sets up chart/series references and subscribes to chart events for
   * coordinate updates and tooltip interactions.
   *
   * Event subscriptions:
   * - Time scale changes (for coordinate re-calculation on pan/zoom)
   * - Crosshair moves (for tooltip display on hover)
   *
   * @param {{ chart: IChartApi; series: ISeriesApi<any>; requestUpdate: () => void }} params
   *   - chart: Chart API reference
   *   - series: Series API reference
   *   - requestUpdate: Callback to request view update
   *
   * @remarks
   * - Stores callbacks for cleanup in detached()
   * - Triggers initial coordinate calculation
   */
  attached({
    chart,
    series,
    requestUpdate
  }) {
    this._chart = chart;
    this._series = series;
    this._requestUpdate = requestUpdate;
    const coordinateService = ChartCoordinateService.getInstance();
    const chartId = chart.chartElement()?.id || "default";
    coordinateService.registerChart(chartId, chart);
    try {
      this._timeScaleCallback = () => {
        this._requestUpdate?.();
      };
      this._crosshairCallback = (param) => {
        this.handleCrosshairMove(param);
        if (!this._updateThrottled) {
          this._updateThrottled = true;
          setTimeout(() => {
            this._updateThrottled = false;
            this._requestUpdate?.();
          }, 100);
        }
      };
      chart.timeScale().subscribeVisibleTimeRangeChange(this._timeScaleCallback);
      chart.subscribeCrosshairMove(this._crosshairCallback);
    } catch (error) {
      logger.error("Failed to attach trade rectangle primitive", "TradeRectanglePrimitive", error);
    }
    this._requestUpdate();
  }
  /**
   * Lifecycle: Primitive detached from series
   *
   * Called by Lightweight Charts when this primitive is detached from a series.
   * Performs cleanup to prevent memory leaks:
   * - Hides any active tooltips
   * - Unsubscribes from chart events
   * - Clears API references
   *
   * @remarks
   * - Critical for preventing memory leaks
   * - Errors during cleanup are logged but don't throw
   * - Nulls out all callbacks and references
   */
  detached() {
    TooltipManager.getInstance().hideTooltip(this._primitiveId);
    if (this._chart && this._timeScaleCallback) {
      try {
        this._chart.timeScale().unsubscribeVisibleTimeRangeChange(this._timeScaleCallback);
        this._timeScaleCallback = null;
      } catch (error) {
        logger.error(
          "Failed to unsubscribe from time scale events",
          "TradeRectanglePrimitive",
          error
        );
      }
    }
    if (this._chart && this._crosshairCallback) {
      try {
        this._chart.unsubscribeCrosshairMove(this._crosshairCallback);
        this._crosshairCallback = null;
      } catch (error) {
        logger.error(
          "Failed to unsubscribe from crosshair events",
          "TradeRectanglePrimitive",
          error
        );
      }
    }
    this._chart = null;
    this._series = null;
    this._requestUpdate = void 0;
    this._updateThrottled = false;
  }
  /**
   * Get trade rectangle data
   *
   * @returns {TradeRectangleData} The trade data for this rectangle
   */
  data() {
    return this._data;
  }
  /**
   * Get chart API reference
   *
   * @returns {IChartApi | null} Chart API or null if not attached
   */
  chart() {
    return this._chart;
  }
  /**
   * Get series API reference
   *
   * @returns {ISeriesApi<any> | null} Series API or null if not attached
   */
  series() {
    return this._series;
  }
  /**
   * Update trade rectangle data
   *
   * Updates the trade data and requests a view update to reflect the changes.
   * Merges new data with existing data, allowing partial updates.
   *
   * @param {Partial<TradeRectangleData>} newData - Partial trade data to update
   *
   * @example
   * ```typescript
   * // Update only colors to reflect new profitability
   * primitive.updateData({
   *   fillColor: 'rgba(76, 175, 80, 0.1)',
   *   borderColor: '#4CAF50',
   *   isProfitable: true
   * });
   * ```
   */
  updateData(newData) {
    this._data = { ...this._data, ...newData };
    if (this._requestUpdate) {
      this._requestUpdate();
    }
  }
}
export {
  J as AnimationTiming,
  BandPrimitive,
  BasePanePrimitive,
  B as BaseSeriesPrimitive,
  ButtonColors,
  ButtonDimensions,
  ButtonEffects,
  ButtonSpacing,
  CommonValues,
  ContainerDefaults,
  K as DefaultButtonConfig,
  O as DefaultContainerConfig,
  N as DefaultLegendConfig,
  DefaultLegendConfigs,
  DefaultRangeConfigs,
  DefaultRangeSwitcherConfig,
  FormatDefaults,
  GradientRibbonPrimitive,
  w as LayoutSpacing,
  LegendColors,
  LegendDimensions,
  LegendPrimitive,
  PrimitivePriority,
  PrimitiveStylingUtils,
  R as RangeSwitcherLayout,
  RangeSwitcherPrimitive,
  RibbonPrimitive,
  SignalPrimitive,
  TimeRange,
  TimeRangeSeconds,
  TradeRectanglePrimitive,
  T as TrendFillPrimitive,
  U as UniversalSpacing,
  createLegendPrimitive,
  createRangeSwitcherPrimitive
};
//# sourceMappingURL=index.js.map
