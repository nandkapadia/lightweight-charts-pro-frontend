# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@nandkapadia/lightweight-charts-pro-core` - a framework-agnostic TypeScript library that extends TradingView's Lightweight Charts with custom series plugins, primitives, and utilities for financial trading applications. It serves as the core foundation for framework-specific wrappers (React, Vue, Streamlit, etc.).

## Development Commands

### Build and Development
```bash
npm run build                # Build library (ES and CJS formats)
npm run dev                  # Watch mode for development
npm run build:types          # Generate type declarations only
npm run type-check           # Type check without emitting files
```

### Testing
```bash
npm test                     # Run all tests once
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
```

### Code Quality
```bash
npm run lint                 # Lint TypeScript files
npm run format               # Format code with Prettier
```

### Running Single Tests
```bash
npx vitest run src/__tests__/path/to/test.test.ts    # Run specific test file
npx vitest run -t "test name pattern"                # Run tests matching pattern
```

## Architecture

### Module Structure

The codebase is organized into 6 main modules with separate entry points:

1. **`/plugins`** - Custom series and chart plugins
   - Series plugins: Band, Ribbon, GradientRibbon, Signal, TrendFill
   - Chart plugins: Tooltip
   - Overlay plugins: Rectangle

2. **`/primitives`** - UI primitive components for chart overlays
   - Base: `BasePanePrimitive`, `BaseSeriesPrimitive`
   - UI: `LegendPrimitive`, `RangeSwitcherPrimitive`, `TradeRectanglePrimitive`
   - Series-specific: `BandPrimitive`, `RibbonPrimitive`, `SignalPrimitive`, etc.

3. **`/series`** - Descriptor-driven unified series factory
   - `UnifiedSeriesFactory` - Main factory orchestrating series creation
   - `UnifiedSeriesDescriptor` - Descriptor pattern for series configuration
   - Descriptors for built-in and custom series types
   - Replaces previous 669-line monolithic factory

4. **`/services`** - Chart management services
   - `ChartCoordinateService` - Coordinate system management
   - `CornerLayoutManager` - UI element positioning
   - `PrimitiveEventManager` - Event handling for primitives
   - `TradeTemplateProcessor` & `TemplateEngine` - Trade visualization
   - `annotationSystem` & `tradeVisualization` - Visual elements

5. **`/utils`** - Shared utilities
   - Logging: `logger`, specialized loggers (`chartLog`, `primitiveLog`, `perfLog`)
   - Patterns: `SingletonBase`, `KeyedSingletonManager`
   - Performance: `throttle`, `memoize`, `batchDOMUpdates`
   - Validation: `coordinateValidation`, `dataValidation`
   - Color: `colorUtils`, `signalColorUtils`
   - Charts: `lightweightChartsUtils`, `lineStyle`

6. **`/types`** - TypeScript type definitions
   - Series types and configurations
   - Chart interfaces and coordinates
   - Layout and positioning types

### Key Architectural Patterns

**Descriptor Pattern for Series**: The series system uses a descriptor-driven architecture. Each series type (built-in or custom) has a `UnifiedSeriesDescriptor` that defines its configuration, default options, and factory method. This eliminates massive switch statements and makes adding new series types straightforward.

**Primitive Composition**: UI elements are built using composable primitives. Base primitives (`BasePanePrimitive`, `BaseSeriesPrimitive`) provide coordinate systems and lifecycle management. Specific primitives extend these with rendering logic.

**Singleton Services**: Services like `ChartCoordinateService` and `CornerLayoutManager` use singleton patterns with keyed instances per chart to manage shared state without prop drilling.

**Framework Agnostic Core**: All code avoids framework-specific dependencies. React-specific components (ButtonPanelPrimitive, ChartPrimitiveManager, SeriesDialogManager) are intentionally excluded and live in the React wrapper package.

## Build Configuration

- **Vite**: Multi-entry library build targeting ES2020, outputs both ESM and CJS
- **TypeScript**: Strict mode, bundler module resolution, path alias `@/*` → `src/*`
- **Vitest**: Testing with jsdom environment, coverage via v8
- **Entry points**: 6 separate entries for tree-shaking (`index`, `plugins`, `primitives`, `series`, `services`, `utils`)
- **External**: `lightweight-charts` is a peer dependency

## Trading-Specific Considerations

When working with chart data and series:
- Chart data uses `Time` type (number or string) from lightweight-charts
- All coordinate validation happens in `coordinateValidation.ts` to prevent rendering errors
- Data validation utilities in `dataValidation.ts` filter invalid points before rendering
- Signal series use color mapping utilities in `signalColorUtils.ts` for directional indicators
- Trade visualization supports entry/exit/stop/target via `TradeConfig` in services

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- Tests on Node 18.x and 20.x
- Runs type-check → build → test
- Publishes to npm on release creation (requires NPM_TOKEN secret)
