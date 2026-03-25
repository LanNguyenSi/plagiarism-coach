# Contributing

## Setup

```bash
npm install
npm run build
npm test
```

For coverage checks:

```bash
npm run test:coverage
```

## Development Expectations

- Keep changes small and reviewable.
- Add or update tests when behavior changes.
- Preserve the educational tone of the product. Feedback should teach, not punish.
- Avoid introducing network-dependent tests. External APIs must be mocked.

## Pull Requests

Before opening a pull request:

1. Run `npm run build`.
2. Run `npm test`.
3. Run `npm run test:coverage` for non-trivial logic changes.
4. Update README or examples when user-facing behavior changes.

## Reporting Issues

- Use GitHub Issues for bugs and feature requests.
- Include reproduction steps, expected behavior, and actual behavior.
- For detection issues, include a minimal text sample if possible.
