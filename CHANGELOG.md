# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2025-12-02

### Added
- Custom browser-compatible EventEmitter implementation
- Unified series descriptors for all built-in chart types
- Line, Area, and Baseline series with comprehensive default options

### Changed
- Package published as `@lightweight-charts-pro/core`
- Default marker visibility set to false for cleaner charts:
  - `pointMarkersVisible: false`
  - `crosshairMarkerVisible: false`

### Fixed
- Resolved Node.js EventEmitter dependency issue for browser compatibility
- Created custom EventEmitter to replace Node.js 'events' module
- Updated TooltipManager to use browser-compatible EventEmitter

### Technical Details
- Built with Vite
- Supports ES modules and CommonJS
- TypeScript declarations included
- Zero npm vulnerabilities

[unreleased]: https://github.com/nandkapadia/lightweight-charts-pro-frontend/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/nandkapadia/lightweight-charts-pro-frontend/releases/tag/v0.2.0
