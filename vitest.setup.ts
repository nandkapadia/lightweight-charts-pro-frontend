/**
 * Vitest setup file for jsdom environment configuration
 * 
 * This file ensures proper initialization of the jsdom environment
 * to prevent compatibility issues with Node.js 18.x and certain
 * dependencies like webidl-conversions.
 */

// Ensure jsdom environment is properly initialized before tests run
import { beforeAll } from 'vitest';

beforeAll(() => {
  // Ensure window object is available and properly configured
  if (typeof window !== 'undefined') {
    // Add any missing globals that tests might need
    if (!window.ResizeObserver) {
      window.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  }
});
