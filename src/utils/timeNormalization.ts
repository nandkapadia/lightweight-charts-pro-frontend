/**
 * @fileoverview Time Normalization Utilities
 *
 * Philosophy: This library treats all time values as OPAQUE.
 * - No automatic timezone conversions
 * - Backend is responsible for timezone handling
 * - Times are normalized to Unix timestamps (seconds) without conversion
 * - Display formatting is optional and configurable
 *
 * @module utils/timeNormalization
 */

// ============================================================================
// Third Party Imports
// ============================================================================
import type { Time, BusinessDay } from "lightweight-charts";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Custom time formatter function type
 */
export type TimeFormatter = (timestamp: number) => string;

/**
 * Validation result for time values
 */
export interface TimeValidationResult {
  valid: boolean;
  normalized?: number;
  error?: string;
}

// ============================================================================
// Time Normalization
// ============================================================================

/**
 * Normalizes various time formats to Unix timestamp (seconds).
 * DOES NOT apply timezone conversions - treats input as-is.
 *
 * Supported formats:
 * - Unix timestamp (number, in seconds)
 * - Unix timestamp string (numeric string)
 * - ISO 8601 string (e.g., "2024-01-15T10:00:00Z")
 * - BusinessDay object ({ year, month, day })
 *
 * @param time - Time value in any supported format
 * @returns Unix timestamp in seconds
 * @throws {Error} If time format is invalid or cannot be parsed
 *
 * @example
 * ```typescript
 * normalizeTime(1705318800)                    // => 1705318800
 * normalizeTime("1705318800")                  // => 1705318800
 * normalizeTime("2024-01-15T10:00:00Z")        // => 1705318800
 * normalizeTime({ year: 2024, month: 1, day: 15 }) // => 1705276800
 * ```
 */
export function normalizeTime(time: Time): number {
  // Already a Unix timestamp (seconds)
  if (typeof time === "number") {
    return time;
  }

  // String that's a numeric timestamp
  if (typeof time === "string") {
    const parsed = parseFloat(time);
    if (!isNaN(parsed)) {
      return parsed;
    }

    // ISO 8601 string (e.g., "2024-01-15T10:00:00Z")
    // Date.parse() treats 'Z' suffix as UTC, preserves timezone in offset
    const timestamp = Date.parse(time);
    if (!isNaN(timestamp)) {
      return timestamp / 1000; // Convert milliseconds to seconds
    }
  }

  // BusinessDay format
  if (isBusinessDay(time)) {
    // Create timestamp at midnight UTC for this date
    // No timezone conversion - treats the date as UTC
    const utcTimestamp = Date.UTC(
      time.year,
      time.month - 1, // JS months are 0-indexed
      time.day,
      0,
      0,
      0,
      0,
    );
    return utcTimestamp / 1000;
  }

  throw new Error(
    `Unable to normalize time value: ${JSON.stringify(time)}. ` +
      `Expected: Unix timestamp (number), ISO 8601 string, or BusinessDay object.`,
  );
}

/**
 * Validates and normalizes a time value, returning validation result.
 * Unlike normalizeTime, this doesn't throw - useful for user input validation.
 *
 * @param time - Time value to validate
 * @returns Validation result with normalized value or error
 *
 * @example
 * ```typescript
 * const result = validateAndNormalizeTime("2024-01-15T10:00:00Z");
 * if (result.valid) {
 *   console.log(result.normalized); // 1705318800
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateAndNormalizeTime(time: Time): TimeValidationResult {
  try {
    const normalized = normalizeTime(time);
    return { valid: true, normalized };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Formats a Unix timestamp for display.
 * By default, returns ISO 8601 UTC string for predictability.
 * Users can provide custom formatters for timezone conversion.
 *
 * @param timestamp - Unix timestamp in seconds
 * @param formatter - Optional custom formatter function
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * // Default: ISO 8601 UTC
 * formatTime(1705318800) // => "2024-01-15T10:00:00.000Z"
 *
 * // Custom formatter for local timezone
 * formatTime(1705318800, (ts) => new Date(ts * 1000).toLocaleString())
 *
 * // Custom formatter for specific timezone
 * formatTime(1705318800, (ts) =>
 *   new Date(ts * 1000).toLocaleString('en-US', {
 *     timeZone: 'America/New_York'
 *   })
 * )
 * ```
 */
export function formatTime(
  timestamp: number,
  formatter?: TimeFormatter,
): string {
  if (formatter) {
    return formatter(timestamp);
  }

  // Default: ISO 8601 in UTC (predictable, no timezone conversion)
  const date = new Date(timestamp * 1000);
  return date.toISOString();
}

/**
 * Formats a Time value (any format) for display.
 * Normalizes the time first, then formats it.
 *
 * @param time - Time value in any supported format
 * @param formatter - Optional custom formatter function
 * @returns Formatted time string
 *
 * @example
 * ```typescript
 * formatTimeValue({ year: 2024, month: 1, day: 15 })
 * // => "2024-01-15T00:00:00.000Z"
 * ```
 */
export function formatTimeValue(time: Time, formatter?: TimeFormatter): string {
  const timestamp = normalizeTime(time);
  return formatTime(timestamp, formatter);
}

// ============================================================================
// Time Comparison and Sorting
// ============================================================================

/**
 * Creates a sorted array of timestamps from chart data.
 * Pre-sorting enables binary search for O(log n) nearest-time lookups.
 *
 * @param times - Array of time values in any format
 * @returns Sorted array of Unix timestamps in seconds (ascending)
 *
 * @example
 * ```typescript
 * const times = [
 *   "2024-01-15T12:00:00Z",
 *   "2024-01-15T10:00:00Z",
 *   { year: 2024, month: 1, day: 15 }
 * ];
 * const sorted = createSortedTimeArray(times);
 * // => [1705276800, 1705318800, 1705320000]
 * ```
 */
export function createSortedTimeArray(times: Time[]): number[] {
  const normalized = times.map((t) => normalizeTime(t));
  return normalized.sort((a, b) => a - b);
}

/**
 * Finds the nearest timestamp to a target using binary search.
 * Requires sortedTimes to be sorted in ascending order.
 *
 * Performance: O(log n) vs O(n) for linear search
 *
 * @param target - Target timestamp to find nearest to
 * @param sortedTimes - Pre-sorted array of timestamps (ascending)
 * @returns Nearest timestamp from the array
 *
 * @example
 * ```typescript
 * const sorted = [1000, 2000, 3000, 4000, 5000];
 * findNearestTimestamp(2400, sorted); // => 2000
 * findNearestTimestamp(3600, sorted); // => 4000
 * ```
 */
export function findNearestTimestamp(
  target: number,
  sortedTimes: number[],
): number {
  if (sortedTimes.length === 0) {
    throw new Error("Cannot find nearest timestamp in empty array");
  }

  if (sortedTimes.length === 1) {
    return sortedTimes[0];
  }

  // Binary search to find insertion point
  let left = 0;
  let right = sortedTimes.length - 1;

  // Target is before all times
  if (target <= sortedTimes[left]) {
    return sortedTimes[left];
  }

  // Target is after all times
  if (target >= sortedTimes[right]) {
    return sortedTimes[right];
  }

  // Binary search for nearest
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midTime = sortedTimes[mid];

    if (midTime === target) {
      return midTime;
    }

    if (midTime < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // At this point, left > right
  // sortedTimes[right] < target < sortedTimes[left]
  const leftTime = sortedTimes[left];
  const rightTime = sortedTimes[right];

  // Return the closer of the two
  if (Math.abs(leftTime - target) < Math.abs(rightTime - target)) {
    return leftTime;
  } else {
    return rightTime;
  }
}

/**
 * Finds the index of the nearest timestamp in a sorted array.
 *
 * @param target - Target timestamp
 * @param sortedTimes - Pre-sorted array of timestamps
 * @returns Index of nearest timestamp
 */
export function findNearestTimestampIndex(
  target: number,
  sortedTimes: number[],
): number {
  const nearest = findNearestTimestamp(target, sortedTimes);
  return sortedTimes.indexOf(nearest);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Type guard to check if a value is a BusinessDay object.
 *
 * @param time - Value to check
 * @returns True if value is a BusinessDay object
 */
export function isBusinessDay(time: any): time is BusinessDay {
  return (
    typeof time === "object" &&
    time !== null &&
    "year" in time &&
    "month" in time &&
    "day" in time &&
    typeof time.year === "number" &&
    typeof time.month === "number" &&
    typeof time.day === "number"
  );
}

/**
 * Checks if a timestamp is in milliseconds (vs seconds).
 * Heuristic: if > year 2100 in seconds, it's likely milliseconds.
 *
 * @param timestamp - Timestamp to check
 * @returns True if timestamp appears to be in milliseconds
 */
export function isMillisecondTimestamp(timestamp: number): boolean {
  // Unix timestamp for 2100-01-01 is ~4102444800 seconds
  // Any timestamp larger than this is likely in milliseconds
  return timestamp > 4102444800;
}

/**
 * Converts a timestamp to seconds if it's in milliseconds.
 *
 * @param timestamp - Timestamp in seconds or milliseconds
 * @returns Timestamp in seconds
 */
export function ensureSecondsTimestamp(timestamp: number): number {
  return isMillisecondTimestamp(timestamp) ? timestamp / 1000 : timestamp;
}

/**
 * Gets the last (most recent) timestamp from an array of times.
 *
 * @param times - Array of time values
 * @returns Last timestamp, or undefined if array is empty
 *
 * @example
 * ```typescript
 * const times = [1000, 2000, 3000];
 * getLastTimestamp(times); // => 3000
 * ```
 */
export function getLastTimestamp(times: Time[]): number | undefined {
  if (times.length === 0) return undefined;
  return normalizeTime(times[times.length - 1]);
}

/**
 * Gets the first (earliest) timestamp from an array of times.
 *
 * @param times - Array of time values
 * @returns First timestamp, or undefined if array is empty
 */
export function getFirstTimestamp(times: Time[]): number | undefined {
  if (times.length === 0) return undefined;
  return normalizeTime(times[0]);
}
