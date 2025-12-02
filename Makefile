.PHONY: help install build clean test lint format publish

help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make build    - Build package"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make test     - Run tests"
	@echo "  make lint     - Run linter"
	@echo "  make format   - Format code"
	@echo "  make publish  - Publish to npm"

install:
	npm install

build: clean
	npm run build

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -rf .vite/

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

publish: build
	npm publish --access public

publish-test: build
	npm publish --registry https://registry.npmjs.org/ --dry-run
