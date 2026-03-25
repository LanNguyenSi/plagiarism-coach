import { describe, expect, it, vi } from 'vitest';
import { Attributor } from '../core/attributor';

describe('Attributor', () => {
  it('returns enriched search results with metadata', async () => {
    const searchClient = {
      search: vi.fn().mockResolvedValue([
        {
          url: 'https://example.edu/article',
          title: 'Cell Biology',
          snippet: 'The mitochondria is the powerhouse of the cell.',
          confidence: 100
        }
      ])
    };

    const httpClient = {
      get: vi.fn().mockResolvedValue({
        data: `
          <html>
            <head>
              <meta name="author" content="Dr. Rivera" />
              <meta property="article:published_time" content="2024-10-22" />
            </head>
          </html>
        `
      })
    };

    const attributor = new Attributor({
      searchClient: searchClient as any,
      httpClient: httpClient as any
    });

    const results = await attributor.findSources('The mitochondria is the powerhouse of the cell.');

    expect(searchClient.search).toHaveBeenCalled();
    expect(results).toHaveLength(1);
    expect(results[0].metadata?.author).toBe('Dr. Rivera');
    expect(results[0].metadata?.publishDate).toBe('2024-10-22');
    expect(results[0].metadata?.domain).toBe('example.edu');
  });

  it('returns the best source via findSource', async () => {
    const attributor = new Attributor({
      searchClient: {
        search: vi.fn().mockResolvedValue([
          {
            url: 'https://example.com/source',
            title: 'Source',
            snippet: 'Copied text example.',
            confidence: 88
          }
        ])
      } as any,
      httpClient: {
        get: vi.fn().mockResolvedValue({ data: '<html></html>' })
      } as any
    });

    const result = await attributor.findSource('Copied text example.');

    expect(result?.originalSource.url).toBe('https://example.com/source');
    expect(result?.confidence).toBeGreaterThanOrEqual(40);
  });

  it('extracts metadata safely when optional tags are missing', async () => {
    const attributor = new Attributor({
      httpClient: {
        get: vi.fn().mockResolvedValue({
          data: '<html><head><title>No meta tags</title></head></html>'
        })
      } as any
    });

    const metadata = await attributor.extractMetadata('https://example.org/post');

    expect(metadata.author).toBeUndefined();
    expect(metadata.publishDate).toBeUndefined();
    expect(metadata.domain).toBe('example.org');
  });
});
