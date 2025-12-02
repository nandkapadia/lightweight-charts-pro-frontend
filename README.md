# Lightweight Charts Pro - Frontend Core

Framework-agnostic TypeScript/React core for TradingView Lightweight Charts Pro.

## Overview

This package provides the shared frontend core used by all framework wrappers (Streamlit, Vue, React, etc.).

## Features

- Custom primitives (Band, Ribbon, Signal, Gradient Ribbon, etc.)
- Custom series plugins
- Utility functions and services
- TypeScript type definitions
- Shared UI components

## Installation

```bash
npm install @lightweight-charts-pro/core
```

## Usage

```typescript
import { BandPrimitive } from '@lightweight-charts-pro/core/primitives';
import { logger } from '@lightweight-charts-pro/core';
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm run test

# Type check
npm run type-check
```

## License

MIT
