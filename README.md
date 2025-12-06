# @lightweight-charts-pro/core

[![npm version](https://img.shields.io/npm/v/@lightweight-charts-pro/core.svg)](https://www.npmjs.com/package/@lightweight-charts-pro/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![CI/CD](https://github.com/nandkapadia/lightweight-charts-pro-frontend/workflows/CI%2FCD/badge.svg)](https://github.com/nandkapadia/lightweight-charts-pro-frontend/actions)

**Framework-agnostic TypeScript library for TradingView Lightweight Charts with advanced custom series, primitives, and utilities.**

## 🚀 Features

- **Custom Series Plugins**: Band, Ribbon, Gradient Ribbon, Signal, and Trend Fill series
- **UI Primitives**: Legend, Range Switcher, and Trade Rectangle overlays
- **Services**: Chart coordinate management, layout management, template engine
- **Comprehensive Type Definitions**: Full TypeScript support with 100% documented APIs
- **Framework Agnostic**: Use with React, Vue, Streamlit, or vanilla JavaScript
- **Tree-Shakeable**: Modular exports for optimal bundle sizes
- **Production Ready**: Zero dependencies (except peer dependency on lightweight-charts)

## 📦 Installation

```bash
npm install @lightweight-charts-pro/core lightweight-charts
```

```bash
yarn add @lightweight-charts-pro/core lightweight-charts
```

```bash
pnpm add @lightweight-charts-pro/core lightweight-charts
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { createChart } from 'lightweight-charts';
import { createBandSeries } from '@lightweight-charts-pro/core/plugins';

const chart = createChart(document.getElementById('chart'));
const bandSeries = createBandSeries(chart, {
  upperLineColor: '#26a69a',
  lowerLineColor: '#ef5350',
  fillColor: 'rgba(38, 166, 154, 0.2)',
});

bandSeries.setData([
  { time: '2024-01-01', upper: 105, lower: 95 },
  { time: '2024-01-02', upper: 108, lower: 92 },
  // ...
]);
```

### Using Primitives

```typescript
import { LegendPrimitive } from '@lightweight-charts-pro/core/primitives';

const legend = new LegendPrimitive({
  text: 'My Series',
  position: 'top-left',
});

series.attachPrimitive(legend);
```

### Using Services

```typescript
import { ChartCoordinateService } from '@lightweight-charts-pro/core/services';

const coordService = ChartCoordinateService.getInstance();
const dimensions = await coordService.getValidatedChartDimensions(chart, container);
```

## ⏰ Time and Timezone Handling

**IMPORTANT: This library does NOT perform any timezone conversions. All time values are treated as opaque.**

### Philosophy

The library follows a strict "no timezone conversion" policy:

- **Backend Responsibility**: Your backend/server is responsible for all timezone handling
- **Opaque Values**: The library treats all time values as-is without modification
- **User Control**: You have full control over how times are interpreted and displayed

### Supported Time Formats

The library accepts and normalizes various time formats WITHOUT conversion:

```typescript
// Unix timestamp (seconds) - recommended
{ time: 1705312800, value: 100 }

// ISO 8601 string - treated as-is
{ time: '2024-01-15T10:00:00.000Z', value: 100 }

// ISO with timezone offset - preserved
{ time: '2024-01-15T10:00:00.000+05:00', value: 100 }

// BusinessDay format - midnight UTC
{ time: { year: 2024, month: 1, day: 15 }, value: 100 }

// Numeric string
{ time: '1705312800', value: 100 }
```

### Best Practices

**1. Use Unix Timestamps (Recommended)**
```typescript
// Backend sends Unix timestamps in seconds
const data = [
  { time: 1705312800, value: 100 }, // 2024-01-15 10:00:00 UTC
  { time: 1705316400, value: 105 }, // 2024-01-15 11:00:00 UTC
];
```

**2. Backend Handles Timezone Conversion**
```python
# Python backend example
from datetime import datetime
import pytz

# User's timezone
user_tz = pytz.timezone('America/New_York')

# Convert to user's timezone BEFORE sending to frontend
dt = datetime(2024, 1, 15, 10, 0, 0, tzinfo=pytz.UTC)
user_dt = dt.astimezone(user_tz)

# Send as Unix timestamp
timestamp = int(user_dt.timestamp())  # Already in user's timezone
```

**3. Display Formatting (Optional)**

If you need to display times in a specific timezone, use custom formatters:

```typescript
import { TemplateEngine } from '@lightweight-charts-pro/core/services';

const engine = TemplateEngine.getInstance();

// Default: ISO 8601 UTC (no conversion)
const result = engine.processTemplate(
  'Time: $$time$$',
  { seriesData: { time: 1705312800 } }
);
// Result: "Time: 2024-01-15T10:00:00.000Z"

// Custom: Display in specific timezone
const resultWithTz = engine.processTemplate(
  'Time: $$time$$',
  { seriesData: { time: 1705312800 } },
  {
    timeFormatter: (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'short',
        timeStyle: 'short'
      });
    }
  }
);
// Result: "Time: 1/15/24, 5:00 AM" (EST)
```

### What This Library Does

✅ **Normalizes** different time formats to Unix timestamps (seconds)
✅ **Preserves** timezone information in ISO strings
✅ **Formats** times as ISO 8601 UTC by default
✅ **Provides** optional custom formatters for display
✅ **Optimizes** time operations with binary search (O(log n))

### What This Library Does NOT Do

❌ **Does NOT convert** times between timezones
❌ **Does NOT apply** local browser timezone
❌ **Does NOT assume** any timezone
❌ **Does NOT modify** your time data

### Migration Guide

If you were relying on automatic timezone conversion:

**Before (❌ Don't do this):**
```typescript
// Frontend expecting automatic conversion
const data = [
  { time: '2024-01-15T10:00:00Z', value: 100 }
];
// OLD: Would convert to browser timezone
```

**After (✅ Do this):**
```typescript
// Backend converts to target timezone
// Python example:
// user_tz = pytz.timezone('America/New_York')
// timestamp = int(dt.astimezone(user_tz).timestamp())

const data = [
  { time: 1705329600, value: 100 } // Already in user's timezone
];
```

### Time Utilities

The library provides utilities for working with times:

```typescript
import {
  normalizeTime,
  formatTime,
  findNearestTimestamp,
  createSortedTimeArray
} from '@lightweight-charts-pro/core/utils';

// Normalize any time format (no conversion)
const timestamp = normalizeTime('2024-01-15T10:00:00.000Z');
// Returns: 1705312800

// Format timestamp (ISO 8601 UTC by default)
const formatted = formatTime(1705312800);
// Returns: "2024-01-15T10:00:00.000Z"

// Find nearest timestamp (O(log n) binary search)
const sorted = createSortedTimeArray([1000, 2000, 3000, 4000, 5000]);
const nearest = findNearestTimestamp(2400, sorted);
// Returns: 2000 (closest match)
```

## 📚 Documentation

### Custom Series

#### Band Series
Display data with upper and lower bounds (e.g., Bollinger Bands).

```typescript
import { createBandSeries, BandData } from '@lightweight-charts-pro/core/plugins';

const data: BandData[] = [
  { time: '2024-01-01', upper: 105, lower: 95 },
  { time: '2024-01-02', upper: 108, lower: 92 },
];

const bandSeries = createBandSeries(chart, {
  upperLineColor: '#26a69a',
  lowerLineColor: '#ef5350',
  fillColor: 'rgba(38, 166, 154, 0.2)',
});

bandSeries.setData(data);
```

#### Ribbon Series
Multiple moving averages displayed as a ribbon.

```typescript
import { createRibbonSeries } from '@lightweight-charts-pro/core/plugins';

const ribbonSeries = createRibbonSeries(chart, {
  fillColor: '#2196F3',
  opacity: 0.3,
});
```

#### Signal Series
Binary or numeric signals displayed as colored backgrounds.

```typescript
import { createSignalSeries } from '@lightweight-charts-pro/core/plugins';

const signalSeries = createSignalSeries(chart, {
  signalColor: '#4CAF50',
  neutralColor: 'transparent',
  alertColor: '#f44336',
});

signalSeries.setData([
  { time: '2024-01-01', value: 1 },  // Buy signal
  { time: '2024-01-02', value: 0 },  // Neutral
  { time: '2024-01-03', value: -1 }, // Sell signal
]);
```

### Unified Series Factory

Descriptor-based series creation with consistent API:

```typescript
import { SeriesFactory } from '@lightweight-charts-pro/core/series';

const factory = new SeriesFactory();

// Create any series type
const series = factory.createSeries(chart, {
  type: 'band',
  data: bandData,
  options: {
    upperLineColor: '#26a69a',
    lowerLineColor: '#ef5350',
  },
});

// Get available series types
const types = factory.getAvailableSeriesTypes();
// ['line', 'area', 'candlestick', 'bar', 'histogram', 'baseline', 'band', 'ribbon', ...]

// Check if custom series
const isCustom = factory.isCustomSeries('band'); // true
```

### Primitives

#### Legend Primitive
Customizable chart legend with template support:

```typescript
import { createLegendPrimitive, DefaultLegendConfigs } from '@lightweight-charts-pro/core/primitives';

const legend = createLegendPrimitive({
  ...DefaultLegendConfigs.default,
  text: 'AAPL',
  position: 'top-left',
});

series.attachPrimitive(legend);
```

#### Range Switcher Primitive
Time range selector buttons:

```typescript
import { createRangeSwitcherPrimitive } from '@lightweight-charts-pro/core/primitives';

const rangeSwitcher = createRangeSwitcherPrimitive({
  ranges: [
    { label: '1D', range: TimeRange.ONE_DAY },
    { label: '1W', range: TimeRange.ONE_WEEK },
    { label: '1M', range: TimeRange.ONE_MONTH },
  ],
  position: 'bottom-right',
});

chart.attachPrimitive(rangeSwitcher);
```

### Services

#### ChartCoordinateService
Singleton service for chart coordinate management:

```typescript
import { ChartCoordinateService } from '@lightweight-charts-pro/core/services';

const service = ChartCoordinateService.getInstance();

// Get validated dimensions
const dimensions = await service.getValidatedChartDimensions(chart, container, {
  minWidth: 400,
  minHeight: 300,
});

// Get pane coordinates
const paneCoords = service.getPaneCoordinates(chart, 0);
```

#### TemplateEngine
String template interpolation for dynamic content:

```typescript
import { TemplateEngine } from '@lightweight-charts-pro/core/services';

const engine = new TemplateEngine();
const result = engine.process('Price: {{price}}', { price: 123.45 });
// Result: "Price: 123.45"
```

## 🏗️ Architecture

The library is organized into 6 main modules:

### 1. **Plugins** (`/plugins`)
Custom series and chart plugins:
- `bandSeriesPlugin` - Band series with upper/lower bounds
- `ribbonSeriesPlugin` - Multi-line ribbon visualization
- `gradientRibbonSeriesPlugin` - Ribbon with gradient coloring
- `signalSeriesPlugin` - Binary/numeric signal visualization
- `trendFillSeriesPlugin` - Trend-following fill areas
- `tooltipPlugin` - Interactive chart tooltips
- `rectanglePlugin` - Rectangle overlay plugin

### 2. **Primitives** (`/primitives`)
UI primitive components for chart overlays:
- `BasePanePrimitive` - Base class for pane primitives
- `BaseSeriesPrimitive` - Base class for series primitives
- `LegendPrimitive` - Chart legend component
- `RangeSwitcherPrimitive` - Time range selector
- `TradeRectanglePrimitive` - Trade visualization rectangles

### 3. **Series** (`/series`)
Unified series factory with descriptor pattern:
- `UnifiedSeriesFactory` - Main factory for series creation
- `UnifiedSeriesDescriptor` - Descriptor pattern for series config
- `UnifiedPropertyMapper` - Property mapping utilities
- Built-in and custom series descriptors

### 4. **Services** (`/services`)
Chart management services:
- `ChartCoordinateService` - Coordinate system management (singleton)
- `CornerLayoutManager` - UI element positioning
- `PrimitiveEventManager` - Event handling for primitives
- `TemplateEngine` - String template interpolation
- `TradeTemplateProcessor` - Trade data template processing

### 5. **Utils** (`/utils`)
Shared utility functions:
- Logging: `logger`, `chartLog`, `primitiveLog`, `perfLog`
- Patterns: `SingletonBase`, `KeyedSingletonManager`
- Performance: `throttle`, `memoize`, `batchDOMUpdates`
- Validation: `coordinateValidation`, `dataValidation`
- Color: `colorUtils`, `signalColorUtils`

### 6. **Types** (`/types`)
TypeScript type definitions for all modules.

## 🛠️ Development

### Prerequisites

- Node.js 18.x or 20.x
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/nandkapadia/lightweight-charts-pro-frontend.git
cd lightweight-charts-pro-frontend

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

### Build Output

The build produces:
- **ESM**: `dist/index.js` (ES modules)
- **CJS**: `dist/index.cjs` (CommonJS)
- **Types**: `dist/index.d.ts` (TypeScript declarations)

Separate entry points for tree-shaking:
- `dist/plugins/index.js`
- `dist/primitives/index.js`
- `dist/series/index.js`
- `dist/services/index.js`
- `dist/utils/index.js`

## 📖 API Reference

### Exports

```typescript
// Main entry point
import { ... } from '@lightweight-charts-pro/core';

// Module-specific imports (tree-shakeable)
import { createBandSeries } from '@lightweight-charts-pro/core/plugins';
import { LegendPrimitive } from '@lightweight-charts-pro/core/primitives';
import { SeriesFactory } from '@lightweight-charts-pro/core/series';
import { ChartCoordinateService } from '@lightweight-charts-pro/core/services';
import { logger } from '@lightweight-charts-pro/core/utils';
```

### Type Definitions

All exports include comprehensive TypeScript type definitions:

```typescript
import type {
  BandData,
  BandSeriesOptions,
  RibbonData,
  SignalData,
  ExtendedChartApi,
  ExtendedSeriesApi,
} from '@lightweight-charts-pro/core';
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use Google-style JSDoc comments
- Ensure all tests pass
- Maintain 100% type safety
- Run `npm run lint` and `npm run format` before committing

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts)
- Inspired by the needs of quantitative trading applications
- Community feedback and contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/nandkapadia/lightweight-charts-pro-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nandkapadia/lightweight-charts-pro-frontend/discussions)
- **Email**: nand.kapadia@gmail.com

## 🗺️ Roadmap

- [ ] Additional custom series types
- [ ] More UI primitives (volume profile, heatmaps)
- [ ] Enhanced template engine with more formatters
- [ ] Performance optimizations for large datasets
- [ ] Framework-specific examples (React, Vue, Svelte)
- [ ] Comprehensive documentation site

---

**Made with ❤️ for the trading and financial charting community**
