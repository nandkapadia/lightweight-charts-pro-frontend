# CI/CD Workflows

This directory contains GitHub Actions workflows for automated testing, documentation, and publishing.

## Workflows

### CI/CD (`ci.yml`)

This workflow runs on every push and pull request to `master` and `dev` branches.

**Jobs:**

1. **Test & Lint** (runs on Node.js 18.x and 20.x)
   - TypeScript type checking
   - ESLint linting
   - Unit tests
   - Package build verification

2. **Generate & Deploy Documentation** (runs only on `master` branch)
   - Generates TypeDoc documentation
   - Uploads documentation as artifact (90-day retention)
   - Deploys to GitHub Pages at `https://[username].github.io/[repo]/`

3. **Publish to npm** (runs only on version tags `v*`)
   - Builds the package
   - Publishes to npm registry
   - Requires `NPM_TOKEN` secret to be configured

## Setup Requirements

### GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select branch: `gh-pages`
4. Select folder: `/ (root)`
5. Save

### NPM Publishing

1. Generate an npm access token:
   - Go to https://www.npmjs.com/settings/[your-username]/tokens
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token

2. Add token to GitHub secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: [paste your npm token]
   - Click "Add secret"

## Documentation

Documentation is automatically generated and deployed when pushing to `master` branch.

**Manual generation:**
```bash
npm run docs        # Generate docs in ./docs
npm run docs:serve  # Serve docs locally on http://localhost:8080
```

## Pre-commit Hooks

The repository includes pre-commit hooks that automatically run:
1. TypeScript type checking
2. ESLint
3. Prettier formatting

**Installation:**
```bash
npm install  # Hooks are installed automatically via prepare script
```

**Manual installation:**
```bash
bash .githooks/install.sh
```

**Skip hooks temporarily:**
```bash
git commit --no-verify
```
