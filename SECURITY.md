# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

We take the security of @lightweight-charts-pro/core seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:

- Open a public GitHub issue for security vulnerabilities
- Discuss the vulnerability in public forums, chat rooms, or social media

### Please DO:

1. **Email** your findings to: nand.kapadia@gmail.com
2. **Subject Line**: `[SECURITY] Brief description of issue`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect:

1. **Acknowledgment**: We will acknowledge receipt within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its severity
3. **Timeline**: We will provide an estimated timeline for a fix
4. **Updates**: We will keep you informed of our progress
5. **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Update Process

When we receive a security report:

1. We confirm the vulnerability and determine its impact
2. We develop and test a fix
3. We prepare a security advisory
4. We release a patched version
5. We publish the security advisory

## Security Best Practices for Users

### Installation

```bash
# Always install from npm
npm install @lightweight-charts-pro/core

# Verify package integrity
npm audit
```

### Usage

1. **Keep Dependencies Updated**
   ```bash
   npm update @lightweight-charts-pro/core
   npm audit fix
   ```

2. **Use Package Lock Files**
   - Commit `package-lock.json` to your repository
   - This ensures consistent dependency versions

3. **Review Peer Dependencies**
   - Keep `lightweight-charts` updated
   - Monitor for security advisories

4. **Sanitize User Input**
   - When using template features, sanitize user-provided data
   - Use provided sanitization utilities

5. **CSP Configuration**
   - Configure Content Security Policy appropriately
   - The library does not use `eval()` or inline scripts

## Known Security Considerations

### Client-Side Library

This is a client-side charting library that:
- Runs in the browser
- Does not make network requests (except loading chart data you provide)
- Does not store sensitive data
- Does not execute arbitrary code from external sources

### Data Handling

The library:
- Processes chart data you provide
- Does not transmit data externally
- Sanitizes HTML when using template features
- Validates coordinate and data inputs

### Dependencies

We maintain minimal dependencies:
- **Peer Dependency**: `lightweight-charts` (TradingView's official library)
- **Dev Dependencies**: Build and test tools only
- **Zero Runtime Dependencies**: No additional npm packages required

## Security Features

### Input Validation

All public APIs validate inputs:
- Type checking via TypeScript
- Runtime validation for critical operations
- Sanitization of user-provided content

### XSS Prevention

Built-in protections:
- HTML entity escaping in `sanitization.ts`
- DOM-based sanitization with whitelist approach
- CSS sanitization removes dangerous patterns

### Memory Safety

- Proper cleanup with Disposable pattern
- No memory leaks in event listeners
- Singleton pattern with cleanup methods

## Vulnerability Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Acknowledgment sent
- **Day 3-7**: Assessment and severity determination
- **Day 7-30**: Fix development and testing
- **Day 30**: Patch release and advisory publication

We aim to fix critical vulnerabilities within 7 days and high-severity issues within 30 days.

## Security Hall of Fame

We appreciate security researchers who help us keep our project secure. Contributors will be listed here (with permission):

<!-- Security researchers will be listed here -->

## Contact

For security concerns: nand.kapadia@gmail.com

For general questions: [GitHub Issues](https://github.com/nandkapadia/lightweight-charts-pro-frontend/issues)

---

Last updated: 2024-12-06
