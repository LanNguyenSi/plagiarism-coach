# PlagiarismCoach

Educational plagiarism detection for students and teachers. The goal is not to punish. The goal is to explain where writing is too close to a source, show how to improve it, and suggest how to cite it correctly.

## Overview

PlagiarismCoach currently focuses on three core capabilities:

- Local TF-IDF similarity detection for sentence-level overlap inside a draft.
- Optional Brave Search lookups to suggest likely original web sources for high-similarity passages.
- Educational feedback and citation suggestions in APA, MLA, and Chicago formats.

The CLI is designed as a teaching aid. It highlights risky passages, suggests revision strategies, and keeps the process transparent.

## Why Use It

- Educational, not punitive: feedback explains what to fix and why.
- Local-first: detection works without sending essays to a third-party service.
- Source-aware: `web` and `hybrid` modes can attach likely web sources when a Brave API key is configured.
- Scriptable: reports can be emitted as terminal text or JSON.

## Installation

### Prerequisites

- Node.js 18+
- npm

### From Source

```bash
git clone https://github.com/LanNguyenSi/plagiarism-coach.git
cd plagiarism-coach
npm install
npm run build
```

To make the CLI available globally from your local checkout:

```bash
npm link
```

## Quick Start

1. Build the CLI:

```bash
npm run build
```

2. Analyze the bundled sample essay:

```bash
node dist/cli/index.js check examples/sample-essay.txt --help-level 2
```

3. Save a plain-text report:

```bash
node dist/cli/index.js check examples/sample-essay.txt --output report.md
```

You can compare against the example output in [examples/sample-report.md](examples/sample-report.md).

## Configuration

PlagiarismCoach works without API keys in `local` mode. To enable Brave Search enrichment for `web` or `hybrid` mode, copy `.env.example` or export the variable directly:

```bash
export BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
```

Environment variables:

- `BRAVE_SEARCH_API_KEY`: enables Brave Search lookups for likely source attribution.

## Commands

### `check`

Analyze a text file and generate educational feedback.

```bash
plagiarism-coach check <file> [options]
```

Options:

- `--format <type>`: `apa`, `mla`, or `chicago`
- `--mode <mode>`: `local`, `web`, or `hybrid`
- `--help-level <n>`: `1`, `2`, or `3`
- `--output <file>`: save the rendered report to a file
- `--json`: emit JSON instead of formatted terminal output

Examples:

```bash
plagiarism-coach check essay.txt
plagiarism-coach check essay.txt --mode hybrid --format apa
plagiarism-coach check essay.txt --help-level 3 --output report.md
plagiarism-coach check essay.txt --json
```

Mode behavior:

- `local`: only local TF-IDF similarity detection
- `web`: local detection plus Brave source lookup for flagged passages
- `hybrid`: same as `web`, but named explicitly for mixed local + web analysis

If Brave Search is unavailable or the API call fails, analysis still completes and returns local results.

### `cite`

Show the current citation-generator command surface.

```bash
plagiarism-coach cite <url> [options]
```

Options:

- `--format <type>`: `apa`, `mla`, or `chicago`
- `--type <type>`: `bibliography` or `in-text`

Note: the dedicated `cite` command is still scaffolded, while citation formatting is already used internally by `check`.

### `learn`

Show the current tutorial command surface.

```bash
plagiarism-coach learn [topic]
```

Topics:

- `paraphrasing`
- `citing`
- `formats`

Note: the interactive tutorial flow is still scaffolded.

## Examples

- Input essay: [examples/sample-essay.txt](examples/sample-essay.txt)
- Expected report style: [examples/sample-report.md](examples/sample-report.md)

Example analysis run:

```bash
node dist/cli/index.js check examples/sample-essay.txt --mode local --help-level 2
```

Example JSON run:

```bash
node dist/cli/index.js check examples/sample-essay.txt --json
```

## Development

Useful commands:

```bash
npm run build
npm test
npm run test:coverage
npm run dev
```

Project structure:

```text
src/
  cli/          Commander-based commands
  core/         Detector, attributor, rewriter, citator
  models/       Shared report and domain types
  utils/        External API clients
examples/       Sample essay and report output
tasks/          Backlog items and status tracking
```

## FAQ

### Does this upload essays anywhere?

Not in `local` mode. In `web` and `hybrid` mode, only flagged passages are sent to Brave Search if `BRAVE_SEARCH_API_KEY` is configured.

### Do I need an API key to use the tool?

No. Local detection, feedback generation, report formatting, and citation suggestions all work without one.

### Why do `cite` and `learn` look incomplete?

The core educational detection flow is implemented first. The standalone `cite` and `learn` commands remain scaffolded and are documented honestly as such.

### What does the similarity score mean?

It is a heuristic sentence-level similarity score from the local TF-IDF detector. It helps identify passages that likely need paraphrasing or citation review. It is not a formal academic misconduct verdict.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing expectations, and pull request guidelines.

## License

MIT. See [LICENSE](LICENSE).

## Docker

```bash
# Build
make docker-build

# Run with Docker Compose
make docker-up

# Stop
make docker-down
```
