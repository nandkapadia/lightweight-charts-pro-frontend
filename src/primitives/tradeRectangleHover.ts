/**
 * @fileoverview Shared hover handling for trade rectangle tooltips
 *
 * Keeps a single crosshair subscription per chart and routes each move to the
 * trade rectangle under the cursor, instead of every rectangle subscribing
 * and hit-testing itself.
 *
 * Lightweight Charts reports the winning hover target in
 * `MouseEventParams.hoveredInfo` (5.3+). That is used when it points at a
 * trade rectangle; otherwise the rectangles' own bounds are checked.
 */

// Third Party Imports
import type { IChartApi, MouseEventParams, Time } from "lightweight-charts";

/**
 * A primitive that can show a tooltip when the cursor is over it.
 */
export interface TradeRectangleHoverTarget {
  /** Unique id used to register the target. */
  getId(): string;
  /** The `externalId` the primitive's `hitTest` returns (may be shared, e.g. a trade id). */
  getHoverId(): string;
  /** Whether a pane-relative point falls inside the target in the given pane. */
  containsPoint(x: number, y: number, paneIndex?: number): boolean;
  showTooltip(position: { x: number; y: number }): void;
  hideTooltip(): void;
}

/**
 * Routes one chart's crosshair moves to registered targets.
 */
class TradeRectangleHoverController {
  private readonly _targets = new Map<string, TradeRectangleHoverTarget>();
  private _activeId: string | null = null;
  private readonly _handler = (param: MouseEventParams<Time>): void =>
    this._onCrosshairMove(param);

  constructor(private readonly _chart: IChartApi) {
    _chart.subscribeCrosshairMove(this._handler);
  }

  register(target: TradeRectangleHoverTarget): void {
    this._targets.set(target.getId(), target);
  }

  /**
   * Removes a target, hiding its tooltip if it is the active one.
   *
   * @returns true when no targets remain and the chart subscription was released
   */
  unregister(target: TradeRectangleHoverTarget): boolean {
    const id = target.getId();
    if (this._activeId === id) {
      target.hideTooltip();
      this._activeId = null;
    }
    this._targets.delete(id);

    if (this._targets.size > 0) {
      return false;
    }
    this._chart.unsubscribeCrosshairMove(this._handler);
    return true;
  }

  private _onCrosshairMove(param: MouseEventParams<Time>): void {
    const target = this._findTarget(param);

    if (this._activeId !== null && this._activeId !== target?.getId()) {
      this._targets.get(this._activeId)?.hideTooltip();
    }
    this._activeId = target ? target.getId() : null;

    if (target && param.point) {
      target.showTooltip(param.point);
    }
  }

  private _findTarget(
    param: MouseEventParams<Time>,
  ): TradeRectangleHoverTarget | undefined {
    const point = param.point;
    if (!point) {
      return undefined;
    }

    const targets = Array.from(this._targets.values());
    const contains = (target: TradeRectangleHoverTarget) =>
      target.containsPoint(point.x, point.y, param.paneIndex);

    const info = param.hoveredInfo;
    if (info?.objectKind === "primitive" && info.objectId !== undefined) {
      const matches = targets.filter((t) => t.getHoverId() === info.objectId);
      const match = matches.length === 1 ? matches[0] : matches.find(contains);
      if (match) {
        return match;
      }
    }

    // Series added after a rectangle's own series win the library's hover
    // arbitration, so a rectangle can be under the cursor without being
    // reported in hoveredInfo.
    for (let i = targets.length - 1; i >= 0; i--) {
      if (contains(targets[i])) {
        return targets[i];
      }
    }
    return undefined;
  }
}

const controllers = new WeakMap<IChartApi, TradeRectangleHoverController>();

/**
 * Registers a target for hover tooltips on a chart, subscribing to the
 * chart's crosshair on first registration.
 */
export function registerTradeRectangleHover(
  chart: IChartApi,
  target: TradeRectangleHoverTarget,
): void {
  let controller = controllers.get(chart);
  if (!controller) {
    controller = new TradeRectangleHoverController(chart);
    controllers.set(chart, controller);
  }
  controller.register(target);
}

/**
 * Unregisters a target, releasing the chart's crosshair subscription once the
 * last target on that chart is gone.
 */
export function unregisterTradeRectangleHover(
  chart: IChartApi,
  target: TradeRectangleHoverTarget,
): void {
  const controller = controllers.get(chart);
  if (controller?.unregister(target)) {
    controllers.delete(chart);
  }
}
