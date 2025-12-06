/**
 * @fileoverview Tests for Time Normalization Utilities
 *
 * Tests the core philosophy: NO timezone conversion
 * - Times are treated as opaque values
 * - Backend is responsible for timezone handling
 * - Times normalized to Unix timestamps without conversion
 */

import { describe, it, expect } from "vitest";
import {
  normalizeTime,
  validateAndNormalizeTime,
  formatTime,
  formatTimeValue,
  createSortedTimeArray,
  findNearestTimestamp,
  findNearestTimestampIndex,
  isBusinessDay,
  isMillisecondTimestamp,
  ensureSecondsTimestamp,
  getLastTimestamp,
  getFirstTimestamp,
} from "../../utils/timeNormalization";

describe("timeNormalization", () => {
  describe("normalizeTime", () => {
    it("should pass through Unix timestamp (number) unchanged", () => {
      const timestamp = 1705318800; // 2024-01-15 10:00:00 UTC
      expect(normalizeTime(timestamp)).toBe(timestamp);
    });

    it("should parse numeric string to timestamp", () => {
      const timestamp = "1705318800";
      expect(normalizeTime(timestamp)).toBe(1705318800);
    });

    it("should parse ISO 8601 string WITHOUT timezone conversion", () => {
      // ISO string with Z (UTC) should be treated as-is
      const isoString = "2024-01-15T10:00:00.000Z";
      const result = normalizeTime(isoString);
      expect(result).toBe(1705312800);
    });

    it("should parse ISO 8601 string with timezone offset", () => {
      // ISO string with offset should preserve the offset
      const isoString = "2024-01-15T10:00:00.000+00:00";
      const result = normalizeTime(isoString);
      expect(result).toBe(1705312800);
    });

    it("should normalize BusinessDay to midnight UTC WITHOUT conversion", () => {
      const businessDay = { year: 2024, month: 1, day: 15 };
      const result = normalizeTime(businessDay);
      // Should be midnight UTC for this date
      expect(result).toBe(1705276800);
    });

    it("should throw error for invalid time format", () => {
      expect(() => normalizeTime("invalid")).toThrow(
        /Unable to normalize time value/,
      );
    });

    it("should throw error for null", () => {
      expect(() => normalizeTime(null as any)).toThrow(
        /Unable to normalize time value/,
      );
    });

    it("should throw error for undefined", () => {
      expect(() => normalizeTime(undefined as any)).toThrow(
        /Unable to normalize time value/,
      );
    });
  });

  describe("validateAndNormalizeTime", () => {
    it("should return valid result for valid timestamp", () => {
      const result = validateAndNormalizeTime(1705318800);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe(1705318800);
      expect(result.error).toBeUndefined();
    });

    it("should return valid result for valid ISO string", () => {
      const result = validateAndNormalizeTime("2024-01-15T10:00:00.000Z");
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe(1705312800);
      expect(result.error).toBeUndefined();
    });

    it("should return invalid result for invalid format", () => {
      const result = validateAndNormalizeTime("invalid");
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Unable to normalize/);
      expect(result.normalized).toBeUndefined();
    });
  });

  describe("formatTime", () => {
    it("should format timestamp as ISO 8601 UTC by default", () => {
      const timestamp = 1705312800; // 2024-01-15 10:00:00 UTC
      const result = formatTime(timestamp);
      expect(result).toBe("2024-01-15T10:00:00.000Z");
    });

    it("should use custom formatter when provided", () => {
      const timestamp = 1705312800;
      const formatter = (ts: number) => `Custom: ${ts}`;
      const result = formatTime(timestamp, formatter);
      expect(result).toBe("Custom: 1705312800");
    });

    it("should NOT apply timezone conversion in default formatter", () => {
      const timestamp = 1705312800;
      const result = formatTime(timestamp);
      // Should always end with Z (UTC), never local timezone
      expect(result).toMatch(/Z$/);
    });
  });

  describe("formatTimeValue", () => {
    it("should normalize and format timestamp", () => {
      const result = formatTimeValue(1705312800);
      expect(result).toBe("2024-01-15T10:00:00.000Z");
    });

    it("should normalize and format ISO string", () => {
      const result = formatTimeValue("2024-01-15T10:00:00.000Z");
      expect(result).toBe("2024-01-15T10:00:00.000Z");
    });

    it("should normalize and format BusinessDay", () => {
      const businessDay = { year: 2024, month: 1, day: 15 };
      const result = formatTimeValue(businessDay);
      expect(result).toBe("2024-01-15T00:00:00.000Z");
    });
  });

  describe("createSortedTimeArray", () => {
    it("should sort timestamps in ascending order", () => {
      const times = [1000, 3000, 2000, 5000, 4000];
      const result = createSortedTimeArray(times);
      expect(result).toEqual([1000, 2000, 3000, 4000, 5000]);
    });

    it("should normalize mixed time formats before sorting", () => {
      const times = [
        1705318800,
        "1705276800",
        { year: 2024, month: 1, day: 14 },
      ];
      const result = createSortedTimeArray(times as any);
      expect(result.length).toBe(3);
      expect(result[0]).toBeLessThan(result[1]);
      expect(result[1]).toBeLessThan(result[2]);
    });

    it("should handle empty array", () => {
      const result = createSortedTimeArray([]);
      expect(result).toEqual([]);
    });

    it("should handle single element", () => {
      const result = createSortedTimeArray([1705318800]);
      expect(result).toEqual([1705318800]);
    });
  });

  describe("findNearestTimestamp", () => {
    const sortedTimes = [1000, 2000, 3000, 4000, 5000];

    it("should find exact match", () => {
      const result = findNearestTimestamp(3000, sortedTimes);
      expect(result).toBe(3000);
    });

    it("should find nearest timestamp when between two values", () => {
      // 2400 is closer to 2000 than 3000
      const result = findNearestTimestamp(2400, sortedTimes);
      expect(result).toBe(2000);
    });

    it("should find nearest timestamp when closer to upper value", () => {
      // 2600 is closer to 3000 than 2000
      const result = findNearestTimestamp(2600, sortedTimes);
      expect(result).toBe(3000);
    });

    it("should return first timestamp when target is before all", () => {
      const result = findNearestTimestamp(500, sortedTimes);
      expect(result).toBe(1000);
    });

    it("should return last timestamp when target is after all", () => {
      const result = findNearestTimestamp(6000, sortedTimes);
      expect(result).toBe(5000);
    });

    it("should handle single element array", () => {
      const result = findNearestTimestamp(1500, [1000]);
      expect(result).toBe(1000);
    });

    it("should throw error for empty array", () => {
      expect(() => findNearestTimestamp(1000, [])).toThrow(
        /Cannot find nearest timestamp in empty array/,
      );
    });

    it("should use O(log n) binary search (performance test)", () => {
      // Create large sorted array
      const largeSortedTimes = Array.from({ length: 100000 }, (_, i) => i);

      // This should complete quickly with binary search
      const start = performance.now();
      findNearestTimestamp(50000, largeSortedTimes);
      const duration = performance.now() - start;

      // Binary search should be very fast even for 100k elements
      expect(duration).toBeLessThan(1); // Should be < 1ms
    });
  });

  describe("findNearestTimestampIndex", () => {
    it("should return index of nearest timestamp", () => {
      const sortedTimes = [1000, 2000, 3000, 4000, 5000];
      const result = findNearestTimestampIndex(2400, sortedTimes);
      expect(result).toBe(1); // Index of 2000
    });

    it("should return correct index for exact match", () => {
      const sortedTimes = [1000, 2000, 3000, 4000, 5000];
      const result = findNearestTimestampIndex(3000, sortedTimes);
      expect(result).toBe(2); // Index of 3000
    });
  });

  describe("isBusinessDay", () => {
    it("should return true for valid BusinessDay object", () => {
      const businessDay = { year: 2024, month: 1, day: 15 };
      expect(isBusinessDay(businessDay)).toBe(true);
    });

    it("should return false for number", () => {
      expect(isBusinessDay(1705318800)).toBe(false);
    });

    it("should return false for string", () => {
      expect(isBusinessDay("2024-01-15")).toBe(false);
    });

    it("should return false for object missing required properties", () => {
      expect(isBusinessDay({ year: 2024, month: 1 })).toBe(false);
      expect(isBusinessDay({ year: 2024, day: 15 })).toBe(false);
      expect(isBusinessDay({ month: 1, day: 15 })).toBe(false);
    });

    it("should return false for null", () => {
      expect(isBusinessDay(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isBusinessDay(undefined)).toBe(false);
    });
  });

  describe("isMillisecondTimestamp", () => {
    it("should return false for seconds timestamp", () => {
      // 2024-01-15 in seconds
      expect(isMillisecondTimestamp(1705318800)).toBe(false);
    });

    it("should return true for milliseconds timestamp", () => {
      // 2024-01-15 in milliseconds
      expect(isMillisecondTimestamp(1705318800000)).toBe(true);
    });

    it("should return false for timestamps before 2100", () => {
      // 2099-12-31 in seconds
      expect(isMillisecondTimestamp(4102358400)).toBe(false);
    });

    it("should return true for timestamps that look like milliseconds", () => {
      // Any timestamp > 4102444800 is treated as milliseconds
      expect(isMillisecondTimestamp(4102444801)).toBe(true);
    });
  });

  describe("ensureSecondsTimestamp", () => {
    it("should pass through seconds timestamp unchanged", () => {
      const seconds = 1705318800;
      expect(ensureSecondsTimestamp(seconds)).toBe(seconds);
    });

    it("should convert milliseconds to seconds", () => {
      const milliseconds = 1705318800000;
      expect(ensureSecondsTimestamp(milliseconds)).toBe(1705318800);
    });

    it("should handle edge case at 2100 boundary", () => {
      const justBeforeThreshold = 4102444800;
      const justAfterThreshold = 4102444801;

      expect(ensureSecondsTimestamp(justBeforeThreshold)).toBe(
        justBeforeThreshold,
      );
      expect(ensureSecondsTimestamp(justAfterThreshold)).toBe(
        justAfterThreshold / 1000,
      );
    });
  });

  describe("getLastTimestamp", () => {
    it("should return last timestamp from array", () => {
      const times = [1000, 2000, 3000];
      expect(getLastTimestamp(times)).toBe(3000);
    });

    it("should normalize last time value", () => {
      const times = [1000, 2000, "3000"];
      expect(getLastTimestamp(times as any)).toBe(3000);
    });

    it("should return undefined for empty array", () => {
      expect(getLastTimestamp([])).toBeUndefined();
    });

    it("should handle single element", () => {
      expect(getLastTimestamp([1705318800])).toBe(1705318800);
    });
  });

  describe("getFirstTimestamp", () => {
    it("should return first timestamp from array", () => {
      const times = [1000, 2000, 3000];
      expect(getFirstTimestamp(times)).toBe(1000);
    });

    it("should normalize first time value", () => {
      const times = ["1000", 2000, 3000];
      expect(getFirstTimestamp(times as any)).toBe(1000);
    });

    it("should return undefined for empty array", () => {
      expect(getFirstTimestamp([])).toBeUndefined();
    });

    it("should handle single element", () => {
      expect(getFirstTimestamp([1705318800])).toBe(1705318800);
    });
  });

  describe("timezone conversion prevention", () => {
    it("should NEVER apply local timezone conversion", () => {
      // This is the core philosophy test
      const utcIsoString = "2024-01-15T10:00:00.000Z";
      const normalized = normalizeTime(utcIsoString);
      const formatted = formatTime(normalized);

      // Should round-trip without timezone conversion
      expect(formatted).toBe(utcIsoString);
    });

    it("should treat all times as opaque values", () => {
      // Different representations of the same UTC time
      const timestamp = 1705312800;
      const isoString = "2024-01-15T10:00:00.000Z";
      const numericString = "1705312800";

      // All should normalize to the same value
      expect(normalizeTime(timestamp)).toBe(1705312800);
      expect(normalizeTime(isoString)).toBe(1705312800);
      expect(normalizeTime(numericString)).toBe(1705312800);
    });

    it("should preserve timezone offset in ISO strings", () => {
      // ISO string with +05:00 offset (5 hours ahead of UTC)
      const isoWithOffset = "2024-01-15T15:00:00.000+05:00";
      // This should represent the same moment as 10:00 UTC
      const normalized = normalizeTime(isoWithOffset);
      expect(normalized).toBe(1705312800);
    });
  });

  describe("performance benchmarks", () => {
    it("should efficiently handle large arrays in createSortedTimeArray", () => {
      const largeTimes = Array.from({ length: 10000 }, (_, i) =>
        Math.floor(Math.random() * 1000000),
      );

      const start = performance.now();
      createSortedTimeArray(largeTimes);
      const duration = performance.now() - start;

      // Should complete in reasonable time (O(n log n))
      expect(duration).toBeLessThan(100); // Should be < 100ms for 10k items
    });

    it("should efficiently find nearest timestamps with binary search", () => {
      const sortedTimes = Array.from({ length: 10000 }, (_, i) => i * 1000);

      const start = performance.now();
      // Perform 100 searches
      for (let i = 0; i < 100; i++) {
        findNearestTimestamp(Math.random() * 10000000, sortedTimes);
      }
      const duration = performance.now() - start;

      // 100 binary searches should be fast
      expect(duration).toBeLessThan(10); // Should be < 10ms total
    });
  });
});
