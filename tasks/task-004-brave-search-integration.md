# Task 004: Web Search Integration (Brave Search API)

## Category

feature

## Priority

medium

## Wave

2

## Delivery Phase

detection-enhancements

## Depends On

- task-003 (TF-IDF detector)

## Blocks

none

## Summary

Integrate Brave Search API to find original sources online for passages with high local similarity scores.

## Problem

Currently the detector can identify potentially plagiarized passages locally, but cannot verify against online sources. Without web search integration, users must manually search for original sources.

## Solution

Implement a Brave Search API client that:

1. Takes passages with high local similarity scores
2. Queries Brave Search API for potential original sources
3. Parses top 3 results (snippet, URL, title)
4. Returns structured `Source[]` interface
5. Handles rate limits (1 req/sec) and API errors gracefully

## Files To Create Or Modify

- `src/utils/api.ts` — Brave Search API client (new)
- `src/core/detector.ts` — integrate web search for high-similarity passages
- `.env.example` — add `BRAVE_SEARCH_API_KEY` placeholder

## Acceptance Criteria

- [ ] Finds Wikipedia source for copied passage
- [ ] Respects rate limits (no 429 errors)
- [ ] Graceful degradation if API fails (continues without web results)
- [ ] Returns `Source[]` interface with snippet, URL, title
- [ ] Environment variable `BRAVE_SEARCH_API_KEY` documented

## Implementation Notes

```bash
BRAVE_SEARCH_API_KEY=your_key_here
```

Use axios for HTTP requests. Rate limit: 1 request per second to avoid 429 errors. This is optional for MVP but enhances detection accuracy significantly.
