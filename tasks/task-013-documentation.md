# Task 013: README + Examples Documentation

## Category

documentation

## Priority

high

## Wave

4

## Delivery Phase

documentation

## Depends On

- task-009 (working CLI)

## Blocks

none

## Summary

Complete user-facing documentation including README, examples, and contribution guidelines.

## Problem

New users cannot easily understand what PlagiarismCoach does, how to install it, or how to use it. Missing documentation creates adoption friction.

## Solution

Write comprehensive documentation:

1. **README.md** — overview, installation, usage, commands
2. **examples/** — sample essay and report files
3. **CONTRIBUTING.md** — contribution guidelines
4. **LICENSE** — MIT license

## Files To Create Or Modify

- `README.md` — complete rewrite with full documentation
- `examples/sample-essay.txt` — realistic sample input (new)
- `examples/sample-report.md` — expected output example (new)
- `CONTRIBUTING.md` — contribution guidelines (new)
- `LICENSE` — MIT license (verify/update)

## Acceptance Criteria

- [ ] README has: overview, installation, quick start, all CLI commands, FAQ
- [ ] Examples are realistic and demonstrate key features
- [ ] CONTRIBUTING.md explains how to contribute
- [ ] LICENSE file is MIT
- [ ] New user can get started in <5 minutes following README

## Implementation Notes

README structure:
1. What is PlagiarismCoach?
2. Why use it? (educational focus, not punitive)
3. Installation (`npm install -g plagiarism-coach`)
4. Quick Start (3-step example)
5. Commands (detect, cite, rewrite, report)
6. Examples
7. Configuration
8. FAQ
9. Contributing
10. License

Screenshots optional but helpful for CLI output examples.
