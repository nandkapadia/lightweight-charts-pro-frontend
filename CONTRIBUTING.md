# Contributing to @lightweight-charts-pro/core

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm, yarn, or pnpm
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lightweight-charts-pro-frontend.git
   cd lightweight-charts-pro-frontend
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/nandkapadia/lightweight-charts-pro-frontend.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

   This will automatically install Git hooks that run on every commit:
   - TypeScript type checking
   - ESLint linting
   - Prettier formatting

5. **Verify Git hooks are installed**
   ```bash
   ls -la .git/hooks/pre-commit
   ```

   If not installed, run manually:
   ```bash
   bash .githooks/install.sh
   ```

6. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check existing issues to avoid duplicates
2. Collect relevant information (OS, Node version, steps to reproduce)
3. Create a minimal reproduction if possible

When creating a bug report, include:
- Clear, descriptive title
- Detailed steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable
- Environment details

### Suggesting Enhancements

Feature requests are welcome! Please:
1. Check if the feature already exists or is planned
2. Provide clear use cases
3. Explain why this feature would be useful
4. Consider implementation complexity

### Contributing Code

Areas where contributions are especially welcome:
- Bug fixes
- New custom series types
- UI primitives
- Performance improvements
- Documentation improvements
- Test coverage
- TypeScript type improvements

## 📝 Coding Standards

### TypeScript

- **Strict Mode**: All code must pass TypeScript strict mode
- **No `any`**: Avoid `any` types; use proper typing
- **Type Safety**: All public APIs must be fully typed
- **Exports**: Use named exports, avoid default exports

### Code Style

- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Line Length**: Maximum 100 characters per line
- **Indentation**: 2 spaces (enforced by Prettier)

### Documentation

- **JSDoc**: All public functions, classes, and interfaces must have Google-style JSDoc comments
- **Examples**: Include usage examples in JSDoc
- **Parameters**: Document all parameters with `@param`
- **Returns**: Document return values with `@returns`
- **Throws**: Document exceptions with `@throws`

Example:
```typescript
/**
 * Creates a new band series with upper and lower bounds.
 *
 * @param chart - The chart instance to add the series to
 * @param options - Configuration options for the band series
 * @returns The created band series instance
 * @throws {Error} If chart is null or options are invalid
 *
 * @example
 * ```typescript
 * const bandSeries = createBandSeries(chart, {
 *   upperLineColor: '#26a69a',
 *   lowerLineColor: '#ef5350',
 * });
 * ```
 */
export function createBandSeries(
  chart: IChartApi,
  options: BandSeriesOptions
): ISeriesApi<BandData> {
  // Implementation
}
```

### File Organization

- **Imports**: Organize imports in sections (Standard, Third Party, Local)
- **Exports**: Group exports logically
- **Comments**: Use section comments to organize code

```typescript
// ============================================================================
// Standard Library Imports
// ============================================================================

// ============================================================================
// Third Party Imports
// ============================================================================
import { LineStyle } from 'lightweight-charts';

// ============================================================================
// Local Imports
// ============================================================================
import { logger } from './logger';

// ============================================================================
// Type Definitions
// ============================================================================

// ============================================================================
// Constants
// ============================================================================

// ============================================================================
// Main Implementation
// ============================================================================
```

## 🎯 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
feat(plugins): add volume profile series plugin

Implements a new custom series plugin for displaying volume profile
data with configurable value area and point of control indicators.

Closes #123
```

```bash
fix(primitives): correct legend positioning in multi-pane charts

The legend primitive was not correctly calculating its position
when used in charts with multiple panes. This fix ensures proper
coordinate calculation using the ChartCoordinateService.

Fixes #456
```

### Scope

Use one of the following scopes:
- `plugins`: Series and chart plugins
- `primitives`: UI primitives
- `series`: Series factory and descriptors
- `services`: Chart services
- `utils`: Utility functions
- `types`: Type definitions
- `docs`: Documentation
- `build`: Build configuration
- `ci`: CI/CD configuration

## 🔄 Pull Request Process

### Before Submitting

1. **Update from upstream**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run all checks**
   ```bash
   npm run type-check
   npm run lint
   npm run format
   npm test
   npm run build
   ```

   **Note:** Pre-commit hooks automatically run type-check, lint, and format on staged files.
   To bypass hooks temporarily (not recommended):
   ```bash
   git commit --no-verify
   ```

3. **Test your changes**
   - Add tests for new features
   - Ensure all tests pass
   - Test manually if applicable

4. **Update documentation**
   - Update README if adding new features
   - Add JSDoc comments
   - Update CHANGELOG.md

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added that prove fix/feature works
- [ ] Dependent changes merged
```

### Review Process

1. **Automated Checks**: CI/CD must pass
2. **Code Review**: At least one maintainer review required
3. **Changes Requested**: Address all feedback
4. **Approval**: Once approved, maintainer will merge

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new code
- Use Vitest framework
- Place tests in `src/__tests__/`
- Follow naming convention: `*.test.ts`

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../yourModule';

describe('yourFunction', () => {
  it('should handle normal case', () => {
    const result = yourFunction(input);
    expect(result).toBe(expected);
  });

  it('should handle edge case', () => {
    const result = yourFunction(edgeInput);
    expect(result).toBe(edgeExpected);
  });

  it('should throw error for invalid input', () => {
    expect(() => yourFunction(invalid)).toThrow();
  });
});
```

### Coverage

- Aim for >80% code coverage
- Critical paths should have 100% coverage
- Run `npm run test:coverage` to check coverage

## 📚 Documentation

### Automated Documentation

Documentation is automatically generated using TypeDoc from JSDoc comments:

**Generate documentation locally:**
```bash
npm run docs        # Generates docs in ./docs
npm run docs:serve  # Serves docs at http://localhost:8080
```

**CI/CD Documentation:**
- Documentation is automatically generated and deployed to GitHub Pages on every push to `master`
- View live docs at: https://nandkapadia.github.io/lightweight-charts-pro-frontend/

### JSDoc Requirements

All public APIs must have:
- Descriptive summary
- `@param` for all parameters
- `@returns` for return values
- `@throws` for exceptions
- `@example` with usage examples
- `@remarks` for additional notes

### README Updates

When adding new features:
1. Add to Features section
2. Add usage example
3. Update API Reference
4. Add to Architecture section if needed

### Inline Comments

- Use comments to explain "why", not "what"
- Complex algorithms need detailed comments
- Use TODO comments for future improvements

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Community

- Be respectful and inclusive
- Help others learn
- Share knowledge
- Give constructive feedback
- Celebrate successes

## 📞 Questions?

- Open a [GitHub Discussion](https://github.com/nandkapadia/lightweight-charts-pro-frontend/discussions)
- Email: nand.kapadia@gmail.com

---

Thank you for contributing to @lightweight-charts-pro/core! 🎉
