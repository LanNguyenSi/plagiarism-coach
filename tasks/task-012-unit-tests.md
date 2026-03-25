# Task 012: Unit Tests for Core Components

## Category

testing

## Priority

high

## Wave

3

## Delivery Phase

quality-assurance

## Depends On

- All core components (detector, attributor, rewriter, citator, report)

## Blocks

none

## Summary

Write comprehensive unit tests for all core modules using Vitest, targeting >80% code coverage.

## Problem

The codebase lacks automated tests. Without tests, refactoring is risky and regressions can slip through unnoticed. CI cannot verify correctness.

## Solution

Set up Vitest and write unit tests for each core module:

1. `detector.ts` — TF-IDF accuracy, similarity thresholds
2. `attributor.ts` — metadata extraction from sources
3. `rewriter.ts` — feedback generation quality
4. `citator.ts` — citation format correctness (APA, MLA, Chicago)
5. `report.ts` — report generation structure

Mock external API calls (Brave Search, Claude) to ensure fast, deterministic tests.

## Files To Create Or Modify

- `vitest.config.ts` — Vitest configuration (new)
- `src/__tests__/detector.test.ts` — detector tests (new)
- `src/__tests__/attributor.test.ts` — attributor tests (new)
- `src/__tests__/rewriter.test.ts` — rewriter tests (new)
- `src/__tests__/citator.test.ts` — citator tests (new)
- `src/__tests__/report.test.ts` — report tests (new)
- `package.json` — add vitest dev dependency and test script

## Acceptance Criteria

- [ ] Vitest configured and running
- [ ] All 5 core modules have test files
- [ ] Tests cover happy path and edge cases
- [ ] External APIs are mocked (no real network calls)
- [ ] Code coverage >80%
- [ ] All tests pass in CI

## Implementation Notes

```bash
npm install -D vitest @vitest/coverage-v8
```

Add to `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```
