.PHONY: help install build dev test clean docker-build docker-run

help: ## Show this help message
	@echo "PlagiarismCoach - Development Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

build: ## Build TypeScript
	npm run build

dev: ## Run in development mode (watch)
	npm run dev

test: ## Run tests
	npm test

clean: ## Clean build artifacts
	rm -rf dist node_modules

docker-build: ## Build Docker image
	docker build -t plagiarism-coach .

docker-run: docker-build ## Run in Docker container
	docker run --rm -v $(PWD)/examples:/examples plagiarism-coach check /examples/sample-essay.txt

link: build ## Link CLI globally
	npm link

unlink: ## Unlink CLI
	npm unlink -g plagiarism-coach

check: ## Quick check with sample essay
	node dist/cli/index.js check examples/sample-essay.txt --help-level 2

demo: build check ## Build and run demo
