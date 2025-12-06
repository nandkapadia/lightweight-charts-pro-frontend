/**
 * @fileoverview Validation Utilities
 *
 * Provides comprehensive validation functions with detailed error reporting.
 * Replaces silent error handling with structured validation results.
 *
 * Key Features:
 * - Trade validation with detailed error messages
 * - Marker validation with time normalization
 * - Batch validation with statistics
 * - Optional error callbacks for debugging
 * - Backward compatible (errors are opt-in)
 *
 * Architecture:
 * - Pure functions (no side effects)
 * - Structured validation results
 * - Integration with logger for warnings
 * - Timezone-agnostic time validation
 *
 * @example
 * ```typescript
 * import { validateTrade, validateMarkers } from './validationUtils';
 *
 * // Validate single trade
 * const result = validateTrade(trade);
 * if (!result.valid) {
 *   console.error('Invalid trade:', result.errors);
 * }
 *
 * // Validate markers with callback
 * const markers = validateMarkers(rawMarkers, {
 *   onValidationError: (errors) => {
 *     console.warn('Marker validation issues:', errors);
 *   }
 * });
 * ```
 */

import { Time } from "lightweight-charts";
import {
  ValidationError,
  BatchValidationResult,
  ValidationSeverity,
  ValidationOptions,
  TradeValidationResult,
  MarkerValidationResult,
} from "../types/validation";
import type { TradeConfig, MarkerData } from "../types";
import { validateAndNormalizeTime } from "./timeNormalization";
import { logger } from "./logger";

/**
 * Create a validation error object
 *
 * @param message - Error message
 * @param field - Field that failed validation
 * @param value - Original value
 * @param severity - Error severity (default: ERROR)
 * @param code - Error code for programmatic handling
 * @returns Validation error object
 */
export function createValidationError(
  message: string,
  field?: string,
  value?: unknown,
  severity: ValidationSeverity = ValidationSeverity.ERROR,
  code?: string,
): ValidationError {
  return {
    message,
    severity,
    field,
    value,
    code,
  };
}

/**
 * Validate a single trade configuration
 *
 * Performs comprehensive validation of trade data:
 * - Entry/exit times are valid and parseable
 * - Entry/exit prices are valid numbers
 * - Times are in correct order (entry before exit)
 * - Required fields are present
 *
 * @param trade - Trade configuration to validate
 * @param options - Validation options
 * @returns Validation result with detailed errors
 *
 * @example
 * ```typescript
 * const result = validateTrade({
 *   entryTime: '2024-01-15T10:00:00Z',
 *   exitTime: '2024-01-15T11:00:00Z',
 *   entryPrice: 100,
 *   exitPrice: 105,
 * });
 *
 * if (result.valid) {
 *   // Trade is valid, use result.data
 * } else {
 *   // Trade is invalid, check result.errors
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateTrade(
  trade: TradeConfig,
  options: ValidationOptions = {},
): TradeValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate entry time
  if (!trade.entryTime) {
    errors.push(
      createValidationError(
        "Missing entry time",
        "entryTime",
        trade.entryTime,
        ValidationSeverity.ERROR,
        "MISSING_ENTRY_TIME",
      ),
    );
  } else {
    const entryTimeResult = validateAndNormalizeTime(trade.entryTime as Time);
    if (!entryTimeResult.valid) {
      errors.push(
        createValidationError(
          `Invalid entry time: ${entryTimeResult.error || "unable to parse"}`,
          "entryTime",
          trade.entryTime,
          ValidationSeverity.ERROR,
          "INVALID_ENTRY_TIME",
        ),
      );
    }
  }

  // Validate exit time (can be null for open trades)
  if (trade.exitTime) {
    const exitTimeResult = validateAndNormalizeTime(trade.exitTime as Time);
    if (!exitTimeResult.valid) {
      errors.push(
        createValidationError(
          `Invalid exit time: ${exitTimeResult.error || "unable to parse"}`,
          "exitTime",
          trade.exitTime,
          ValidationSeverity.ERROR,
          "INVALID_EXIT_TIME",
        ),
      );
    }

    // Validate time order (entry must be before exit)
    if (trade.entryTime && exitTimeResult.valid && exitTimeResult.normalized) {
      const entryTimeResult = validateAndNormalizeTime(trade.entryTime as Time);
      if (
        entryTimeResult.valid &&
        entryTimeResult.normalized &&
        exitTimeResult.normalized &&
        entryTimeResult.normalized >= exitTimeResult.normalized
      ) {
        errors.push(
          createValidationError(
            "Entry time must be before exit time",
            "exitTime",
            { entryTime: trade.entryTime, exitTime: trade.exitTime },
            ValidationSeverity.ERROR,
            "INVALID_TIME_ORDER",
          ),
        );
      }
    }
  } else {
    // Warning for open trades
    if (options.collectWarnings !== false) {
      warnings.push(
        createValidationError(
          "Open trade without exit time",
          "exitTime",
          null,
          ValidationSeverity.WARNING,
          "OPEN_TRADE",
        ),
      );
    }
  }

  // Validate entry price
  if (typeof trade.entryPrice !== "number") {
    errors.push(
      createValidationError(
        "Missing or invalid entry price",
        "entryPrice",
        trade.entryPrice,
        ValidationSeverity.ERROR,
        "INVALID_ENTRY_PRICE",
      ),
    );
  } else if (trade.entryPrice <= 0) {
    errors.push(
      createValidationError(
        "Entry price must be positive",
        "entryPrice",
        trade.entryPrice,
        ValidationSeverity.ERROR,
        "NEGATIVE_ENTRY_PRICE",
      ),
    );
  }

  // Validate exit price
  if (typeof trade.exitPrice !== "number") {
    errors.push(
      createValidationError(
        "Missing or invalid exit price",
        "exitPrice",
        trade.exitPrice,
        ValidationSeverity.ERROR,
        "INVALID_EXIT_PRICE",
      ),
    );
  } else if (trade.exitPrice <= 0) {
    errors.push(
      createValidationError(
        "Exit price must be positive",
        "exitPrice",
        trade.exitPrice,
        ValidationSeverity.ERROR,
        "NEGATIVE_EXIT_PRICE",
      ),
    );
  }

  // Call validation callback if provided
  if (errors.length > 0 && options.onValidationError) {
    options.onValidationError(errors);
  }

  // Log warnings if any
  if (warnings.length > 0 && options.collectWarnings !== false) {
    logger.warn(
      `Trade validation warnings: ${warnings.map((w) => w.message).join(", ")}`,
      "ValidationUtils",
      { tradeId: trade.id, warnings },
    );
  }

  // Throw in strict mode
  if (options.strict && errors.length > 0) {
    throw new Error(
      `Trade validation failed: ${errors.map((e) => e.message).join(", ")}`,
    );
  }

  const valid = errors.length === 0;

  return {
    valid,
    data: valid ? trade : undefined,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    input: trade,
    tradeId: trade.id,
  };
}

/**
 * Validate multiple trades in batch
 *
 * @param trades - Array of trade configurations
 * @param options - Validation options
 * @returns Batch validation result with statistics
 *
 * @example
 * ```typescript
 * const result = validateTrades(trades, {
 *   onValidationError: (errors) => {
 *     console.warn('Some trades failed validation:', errors);
 *   }
 * });
 *
 * console.log(`Valid: ${result.summary.validCount}/${result.summary.total}`);
 * // Use result.valid for valid trades
 * // Check result.invalid for failed trades
 * ```
 */
export function validateTrades(
  trades: TradeConfig[],
  options: ValidationOptions = {},
): BatchValidationResult<TradeConfig> {
  const valid: TradeConfig[] = [];
  const invalid: Array<{
    item: unknown;
    errors: ValidationError[];
    index: number;
  }> = [];
  let warningCount = 0;

  trades.forEach((trade, index) => {
    const result = validateTrade(trade, {
      ...options,
      // Don't call callback for each trade in batch mode
      // We'll call it once at the end
      onValidationError: undefined,
    });

    if (result.valid && result.data) {
      valid.push(result.data);
    } else if (result.errors) {
      invalid.push({
        item: trade,
        errors: result.errors,
        index,
      });
    }

    if (result.warnings) {
      warningCount += result.warnings.length;
    }
  });

  // Call validation callback with all errors
  if (invalid.length > 0 && options.onValidationError) {
    const allErrors = invalid.flatMap((item) => item.errors);
    options.onValidationError(allErrors);
  }

  // Log summary
  if (invalid.length > 0) {
    logger.warn(
      `Trade batch validation: ${invalid.length}/${trades.length} invalid`,
      "ValidationUtils",
      {
        validCount: valid.length,
        invalidCount: invalid.length,
        warningCount,
      },
    );
  }

  return {
    valid,
    invalid,
    summary: {
      total: trades.length,
      validCount: valid.length,
      invalidCount: invalid.length,
      warningCount,
    },
  };
}

/**
 * Validate a single marker
 *
 * @param marker - Marker data to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateMarker({
 *   time: '2024-01-15T10:00:00Z',
 *   position: 'aboveBar',
 *   color: 'red',
 *   shape: 'circle'
 * });
 *
 * if (result.valid) {
 *   // Marker is valid
 * } else {
 *   console.error('Invalid marker:', result.errors);
 * }
 * ```
 */
export function validateMarker(
  marker: MarkerData,
  options: ValidationOptions = {},
): MarkerValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate time
  if (!marker.time) {
    errors.push(
      createValidationError(
        "Missing time",
        "time",
        marker.time,
        ValidationSeverity.ERROR,
        "MISSING_TIME",
      ),
    );
  } else {
    const timeResult = validateAndNormalizeTime(marker.time as Time);
    if (!timeResult.valid) {
      errors.push(
        createValidationError(
          `Invalid time: ${timeResult.error || "unable to parse"}`,
          "time",
          marker.time,
          ValidationSeverity.ERROR,
          "INVALID_TIME",
        ),
      );
    }
  }

  // Validate position
  const validPositions = ["aboveBar", "belowBar", "inBar"];
  if (marker.position && !validPositions.includes(marker.position)) {
    errors.push(
      createValidationError(
        `Invalid position: must be one of ${validPositions.join(", ")}`,
        "position",
        marker.position,
        ValidationSeverity.ERROR,
        "INVALID_POSITION",
      ),
    );
  }

  // Validate shape
  const validShapes = ["circle", "square", "arrowUp", "arrowDown"];
  if (marker.shape && !validShapes.includes(marker.shape)) {
    warnings.push(
      createValidationError(
        `Unknown shape: ${marker.shape}`,
        "shape",
        marker.shape,
        ValidationSeverity.WARNING,
        "UNKNOWN_SHAPE",
      ),
    );
  }

  // Validate color
  if (marker.color && typeof marker.color !== "string") {
    errors.push(
      createValidationError(
        "Color must be a string",
        "color",
        marker.color,
        ValidationSeverity.ERROR,
        "INVALID_COLOR",
      ),
    );
  }

  // Call validation callback if provided
  if (errors.length > 0 && options.onValidationError) {
    options.onValidationError(errors);
  }

  // Throw in strict mode
  if (options.strict && errors.length > 0) {
    throw new Error(
      `Marker validation failed: ${errors.map((e) => e.message).join(", ")}`,
    );
  }

  const valid = errors.length === 0;
  const timeResult = marker.time
    ? validateAndNormalizeTime(marker.time as Time)
    : null;

  return {
    valid,
    data: valid ? marker : undefined,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    input: marker,
    time:
      timeResult && timeResult.valid && timeResult.normalized
        ? timeResult.normalized
        : undefined,
  };
}

/**
 * Validate multiple markers in batch
 *
 * @param markers - Array of marker data
 * @param options - Validation options
 * @returns Batch validation result
 *
 * @example
 * ```typescript
 * const result = validateMarkers(markers, {
 *   onValidationError: (errors) => {
 *     console.warn('Some markers failed validation:', errors);
 *   }
 * });
 *
 * // Use result.valid for valid markers
 * // Invalid markers are silently filtered
 * ```
 */
export function validateMarkers(
  markers: MarkerData[],
  options: ValidationOptions = {},
): BatchValidationResult<MarkerData> {
  const valid: MarkerData[] = [];
  const invalid: Array<{
    item: unknown;
    errors: ValidationError[];
    index: number;
  }> = [];
  let warningCount = 0;

  markers.forEach((marker, index) => {
    const result = validateMarker(marker, {
      ...options,
      onValidationError: undefined,
    });

    if (result.valid && result.data) {
      valid.push(result.data);
    } else if (result.errors) {
      invalid.push({
        item: marker,
        errors: result.errors,
        index,
      });
    }

    if (result.warnings) {
      warningCount += result.warnings.length;
    }
  });

  // Call validation callback with all errors
  if (invalid.length > 0 && options.onValidationError) {
    const allErrors = invalid.flatMap((item) => item.errors);
    options.onValidationError(allErrors);
  }

  // Log summary
  if (invalid.length > 0) {
    logger.warn(
      `Marker batch validation: ${invalid.length}/${markers.length} invalid`,
      "ValidationUtils",
      {
        validCount: valid.length,
        invalidCount: invalid.length,
        warningCount,
      },
    );
  }

  return {
    valid,
    invalid,
    summary: {
      total: markers.length,
      validCount: valid.length,
      invalidCount: invalid.length,
      warningCount,
    },
  };
}

/**
 * Helper to check if a value is a valid number
 *
 * @param value - Value to check
 * @returns True if valid finite number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value);
}

/**
 * Helper to check if a value is a valid positive number
 *
 * @param value - Value to check
 * @returns True if valid positive finite number
 */
export function isPositiveNumber(value: unknown): value is number {
  return isValidNumber(value) && value > 0;
}

/**
 * Helper to check if a value is a valid color string
 *
 * @param value - Value to check
 * @returns True if valid color format
 */
export function isValidColor(value: unknown): value is string {
  if (typeof value !== "string") return false;

  // Check common color formats
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
  const namedColors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "transparent",
  ];

  return (
    hexPattern.test(value) ||
    rgbPattern.test(value) ||
    namedColors.includes(value.toLowerCase())
  );
}
