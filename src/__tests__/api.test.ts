import { afterEach, describe, expect, it, vi } from 'vitest';
import { BraveSearchClient } from '../utils/api';

describe('BraveSearchClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns no results when the API key is missing', async () => {
    const client = new BraveSearchClient({
      apiKey: ''
    });

    const results = await client.search('mitochondria');

    expect(results).toEqual([]);
  });

  it('maps Brave search results into Source records', async () => {
    const httpClient = {
      get: vi.fn().mockResolvedValue({
        data: {
          web: {
            results: [
              {
                url: 'https://example.edu/article',
                title: 'Cell Biology',
                description: 'The mitochondria is the powerhouse of the cell.'
              },
              {
                url: '',
                title: 'Incomplete result'
              }
            ]
          }
        }
      })
    };

    const client = new BraveSearchClient({
      apiKey: 'test-key',
      httpClient: httpClient as any
    });

    const results = await client.search('mitochondria');

    expect(httpClient.get).toHaveBeenCalledOnce();
    expect(results).toHaveLength(1);
    expect(results[0].url).toBe('https://example.edu/article');
    expect(results[0].metadata?.domain).toBe('example.edu');
  });

  it('enforces the configured rate limit between requests', async () => {
    const httpClient = {
      get: vi.fn().mockResolvedValue({
        data: {
          web: {
            results: [
              {
                url: 'https://example.edu/article',
                title: 'Cell Biology',
                description: 'Cell description'
              }
            ]
          }
        }
      })
    };
    const sleep = vi.fn().mockResolvedValue(undefined);
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1200)
      .mockReturnValueOnce(2000);

    const client = new BraveSearchClient({
      apiKey: 'test-key',
      httpClient: httpClient as any,
      sleep,
      rateLimitMs: 1000
    });

    await client.search('first query');
    await client.search('second query');

    expect(sleep).toHaveBeenCalledWith(800);
    expect(httpClient.get).toHaveBeenCalledTimes(2);
  });
});
