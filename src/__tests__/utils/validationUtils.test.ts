/**
 * @fileoverview Tests for Validation Utilities
 *
 * Comprehensive tests for trade and marker validation with error visibility.
 */

import { describe, it, expect, vi } from "vitest";
import {
  validateTrade,
  validateTrades,
  validateMarker,
  validateMarkers,
  createValidationError,
  isValidNumber,
  isPositiveNumber,
  isValidColor,
} from "../../utils/validationUtils";
import { ValidationSeverity } from "../../types/validation";
import type { TradeConfig, MarkerData } from "../../types";

describe("validationUtils", () => {
  describe("createValidationError", () => {
    it("should create validation error with all fields", () => {
      const error = createValidationError(
        "Test error",
        "field1",
        123,
        ValidationSeverity.ERROR,
        "TEST_ERROR",
      );

      expect(error.message).toBe("Test error");
      expect(error.field).toBe("field1");
      expect(error.value).toBe(123);
      expect(error.severity).toBe(ValidationSeverity.ERROR);
      expect(error.code).toBe("TEST_ERROR");
    });

    it("should create error with default severity", () => {
      const error = createValidationError("Test", "field");
      expect(error.severity).toBe(ValidationSeverity.ERROR);
    });
  });

  describe("validateTrade", () => {
    const validTrade: TradeConfig = {
      id: "trade-1",
      entryTime: "2024-01-15T10:00:00.000Z",
      exitTime: "2024-01-15T11:00:00.000Z",
      entryPrice: 100,
      exitPrice: 105,
      isProfitable: true,
    };

    it("should validate a valid trade", () => {
      const result = validateTrade(validTrade);

      expect(result.valid).toBe(true);
      expect(result.data).toEqual(validTrade);
      expect(result.errors).toBeUndefined();
      expect(result.tradeId).toBe("trade-1");
    });

    it("should reject trade without entry time", () => {
      const invalidTrade = { ...validTrade, entryTime: undefined };
      const result = validateTrade(invalidTrade as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("MISSING_ENTRY_TIME");
    });

    it("should reject trade with invalid entry time", () => {
      const invalidTrade = { ...validTrade, entryTime: "invalid-date" };
      const result = validateTrade(invalidTrade);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_ENTRY_TIME");
    });

    it("should reject trade with invalid exit time", () => {
      const invalidTrade = { ...validTrade, exitTime: "invalid-date" };
      const result = validateTrade(invalidTrade);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_EXIT_TIME");
    });

    it("should reject trade with entry time after exit time", () => {
      const invalidTrade = {
        ...validTrade,
        entryTime: "2024-01-15T12:00:00.000Z",
        exitTime: "2024-01-15T10:00:00.000Z",
      };
      const result = validateTrade(invalidTrade);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_TIME_ORDER");
    });

    it("should reject trade without entry price", () => {
      const invalidTrade = { ...validTrade, entryPrice: undefined };
      const result = validateTrade(invalidTrade as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_ENTRY_PRICE");
    });

    it("should reject trade with negative entry price", () => {
      const invalidTrade = { ...validTrade, entryPrice: -100 };
      const result = validateTrade(invalidTrade);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("NEGATIVE_ENTRY_PRICE");
    });

    it("should allow trade without exit price (for open trades)", () => {
      const openTrade = {
        ...validTrade,
        exitPrice: undefined,
        exitTime: undefined,
      };
      const result = validateTrade(openTrade as any, {
        collectWarnings: true,
      });

      // Should pass validation (open trades allowed)
      // but should have a warning about missing exitTime
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0].code).toBe("OPEN_TRADE");
    });

    it("should reject trade with invalid exit price type", () => {
      const invalidTrade = { ...validTrade, exitPrice: "not a number" };
      const result = validateTrade(invalidTrade as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_EXIT_PRICE");
    });

    it("should reject trade with negative exit price", () => {
      const invalidTrade = { ...validTrade, exitPrice: -105 };
      const result = validateTrade(invalidTrade);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("NEGATIVE_EXIT_PRICE");
    });

    it("should allow open trades without exit time with warning", () => {
      const openTrade = { ...validTrade, exitTime: undefined };
      const result = validateTrade(openTrade as any, {
        collectWarnings: true,
      });

      // Should pass validation (open trades are allowed)
      // but should have a warning
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0].code).toBe("OPEN_TRADE");
    });

    it("should call validation callback on errors", () => {
      const callback = vi.fn();
      const invalidTrade = { ...validTrade, entryPrice: -100 };

      validateTrade(invalidTrade, {
        onValidationError: callback,
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mock.calls[0][0]).toHaveLength(1);
      expect(callback.mock.calls[0][0][0].code).toBe("NEGATIVE_ENTRY_PRICE");
    });

    it("should throw in strict mode", () => {
      const invalidTrade = { ...validTrade, entryPrice: -100 };

      expect(() => {
        validateTrade(invalidTrade, { strict: true });
      }).toThrow("Trade validation failed");
    });

    it("should validate trade with Unix timestamp", () => {
      const tradeWithTimestamp = {
        ...validTrade,
        entryTime: 1705312800,
        exitTime: 1705316400,
      };

      const result = validateTrade(tradeWithTimestamp as any);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateTrades", () => {
    const validTrade1: TradeConfig = {
      id: "trade-1",
      entryTime: "2024-01-15T10:00:00.000Z",
      exitTime: "2024-01-15T11:00:00.000Z",
      entryPrice: 100,
      exitPrice: 105,
      isProfitable: true,
    };

    const validTrade2: TradeConfig = {
      id: "trade-2",
      entryTime: "2024-01-15T12:00:00.000Z",
      exitTime: "2024-01-15T13:00:00.000Z",
      entryPrice: 110,
      exitPrice: 108,
      isProfitable: false,
    };

    const invalidTrade: TradeConfig = {
      id: "trade-3",
      entryTime: "invalid",
      exitTime: "2024-01-15T13:00:00.000Z",
      entryPrice: 100,
      exitPrice: 105,
      isProfitable: true,
    };

    it("should validate all valid trades", () => {
      const result = validateTrades([validTrade1, validTrade2]);

      expect(result.summary.total).toBe(2);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(0);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(0);
    });

    it("should filter invalid trades", () => {
      const result = validateTrades([validTrade1, invalidTrade, validTrade2]);

      expect(result.summary.total).toBe(3);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(1);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0].index).toBe(1);
    });

    it("should call validation callback with all errors", () => {
      const callback = vi.fn();

      validateTrades([validTrade1, invalidTrade], {
        onValidationError: callback,
      });

      expect(callback).toHaveBeenCalledOnce();
      const errors = callback.mock.calls[0][0];
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should handle empty array", () => {
      const result = validateTrades([]);

      expect(result.summary.total).toBe(0);
      expect(result.summary.validCount).toBe(0);
      expect(result.summary.invalidCount).toBe(0);
    });
  });

  describe("validateMarker", () => {
    const validMarker: MarkerData = {
      time: "2024-01-15T10:00:00.000Z",
      position: "aboveBar",
      color: "red",
      shape: "circle",
    };

    it("should validate a valid marker", () => {
      const result = validateMarker(validMarker);

      expect(result.valid).toBe(true);
      expect(result.data).toEqual(validMarker);
      expect(result.errors).toBeUndefined();
    });

    it("should reject marker without time", () => {
      const invalidMarker = { ...validMarker, time: undefined };
      const result = validateMarker(invalidMarker as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("MISSING_TIME");
    });

    it("should reject marker with invalid time", () => {
      const invalidMarker = { ...validMarker, time: "invalid-date" };
      const result = validateMarker(invalidMarker);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_TIME");
    });

    it("should reject marker with invalid position", () => {
      const invalidMarker = { ...validMarker, position: "invalidPosition" };
      const result = validateMarker(invalidMarker as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_POSITION");
    });

    it("should warn about unknown shape", () => {
      const markerWithUnknownShape = { ...validMarker, shape: "unknown" };
      const result = validateMarker(markerWithUnknownShape as any);

      // Should still be valid (shapes are extensible)
      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings![0].code).toBe("UNKNOWN_SHAPE");
    });

    it("should reject marker with invalid color type", () => {
      const invalidMarker = { ...validMarker, color: 123 };
      const result = validateMarker(invalidMarker as any);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors![0].code).toBe("INVALID_COLOR");
    });

    it("should validate marker with Unix timestamp", () => {
      const markerWithTimestamp = {
        ...validMarker,
        time: 1705312800,
      };

      const result = validateMarker(markerWithTimestamp as any);
      expect(result.valid).toBe(true);
      expect(result.time).toBe(1705312800);
    });

    it("should call validation callback on errors", () => {
      const callback = vi.fn();
      const invalidMarker = { ...validMarker, time: undefined };

      validateMarker(invalidMarker as any, {
        onValidationError: callback,
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it("should throw in strict mode", () => {
      const invalidMarker = { ...validMarker, time: undefined };

      expect(() => {
        validateMarker(invalidMarker as any, { strict: true });
      }).toThrow("Marker validation failed");
    });
  });

  describe("validateMarkers", () => {
    const validMarker1: MarkerData = {
      time: "2024-01-15T10:00:00.000Z",
      position: "aboveBar",
      color: "red",
      shape: "circle",
    };

    const validMarker2: MarkerData = {
      time: "2024-01-15T11:00:00.000Z",
      position: "belowBar",
      color: "green",
      shape: "square",
    };

    const invalidMarker: MarkerData = {
      time: "invalid",
      position: "aboveBar",
      color: "red",
      shape: "circle",
    };

    it("should validate all valid markers", () => {
      const result = validateMarkers([validMarker1, validMarker2]);

      expect(result.summary.total).toBe(2);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(0);
      expect(result.valid).toHaveLength(2);
    });

    it("should filter invalid markers", () => {
      const result = validateMarkers([
        validMarker1,
        invalidMarker,
        validMarker2,
      ]);

      expect(result.summary.total).toBe(3);
      expect(result.summary.validCount).toBe(2);
      expect(result.summary.invalidCount).toBe(1);
      expect(result.invalid[0].index).toBe(1);
    });

    it("should call validation callback with all errors", () => {
      const callback = vi.fn();

      validateMarkers([validMarker1, invalidMarker], {
        onValidationError: callback,
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it("should handle empty array", () => {
      const result = validateMarkers([]);

      expect(result.summary.total).toBe(0);
      expect(result.summary.validCount).toBe(0);
    });
  });

  describe("Helper functions", () => {
    describe("isValidNumber", () => {
      it("should return true for valid numbers", () => {
        expect(isValidNumber(0)).toBe(true);
        expect(isValidNumber(100)).toBe(true);
        expect(isValidNumber(-100)).toBe(true);
        expect(isValidNumber(3.14)).toBe(true);
      });

      it("should return false for invalid values", () => {
        expect(isValidNumber(NaN)).toBe(false);
        expect(isValidNumber(Infinity)).toBe(false);
        expect(isValidNumber(-Infinity)).toBe(false);
        expect(isValidNumber("100")).toBe(false);
        expect(isValidNumber(null)).toBe(false);
        expect(isValidNumber(undefined)).toBe(false);
      });
    });

    describe("isPositiveNumber", () => {
      it("should return true for positive numbers", () => {
        expect(isPositiveNumber(1)).toBe(true);
        expect(isPositiveNumber(100)).toBe(true);
        expect(isPositiveNumber(0.1)).toBe(true);
      });

      it("should return false for non-positive numbers", () => {
        expect(isPositiveNumber(0)).toBe(false);
        expect(isPositiveNumber(-1)).toBe(false);
        expect(isPositiveNumber(-100)).toBe(false);
      });

      it("should return false for invalid values", () => {
        expect(isPositiveNumber(NaN)).toBe(false);
        expect(isPositiveNumber(Infinity)).toBe(false);
        expect(isPositiveNumber("100")).toBe(false);
      });
    });

    describe("isValidColor", () => {
      it("should return true for valid hex colors", () => {
        expect(isValidColor("#fff")).toBe(true);
        expect(isValidColor("#ffffff")).toBe(true);
        expect(isValidColor("#FF5733")).toBe(true);
        expect(isValidColor("#FF5733AA")).toBe(true);
      });

      it("should return true for valid RGB colors", () => {
        expect(isValidColor("rgb(255, 0, 0)")).toBe(true);
        expect(isValidColor("rgba(255, 0, 0, 0.5)")).toBe(true);
      });

      it("should return true for named colors", () => {
        expect(isValidColor("red")).toBe(true);
        expect(isValidColor("green")).toBe(true);
        expect(isValidColor("transparent")).toBe(true);
      });

      it("should return false for invalid colors", () => {
        expect(isValidColor("#gg")).toBe(false);
        expect(isValidColor("invalid")).toBe(false);
        expect(isValidColor(123)).toBe(false);
        expect(isValidColor(null)).toBe(false);
      });
    });
  });
});
