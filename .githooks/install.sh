#!/bin/bash

# Install Git hooks for the repository

HOOK_DIR=".git/hooks"
SOURCE_DIR=".githooks"

echo "📦 Installing Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOK_DIR"

# Copy pre-commit hook
if [ -f "$SOURCE_DIR/pre-commit" ]; then
    cp "$SOURCE_DIR/pre-commit" "$HOOK_DIR/pre-commit"
    chmod +x "$HOOK_DIR/pre-commit"
    echo "✅ Installed pre-commit hook"
else
    echo "❌ pre-commit hook not found in $SOURCE_DIR"
    exit 1
fi

echo ""
echo "🎉 Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will run:"
echo "  1. TypeScript type check (npm run type-check)"
echo "  2. ESLint (npm run lint)"
echo "  3. Prettier formatting (npm run format)"
echo ""
echo "To skip the hook temporarily, use: git commit --no-verify"
