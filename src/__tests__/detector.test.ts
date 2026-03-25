import { describe, expect, it, vi } from 'vitest';
import { Detector } from '../core/detector';
import { Source } from '../models/types';

describe('Detector', () => {
  const repeatedText = [
    'The mitochondria is the powerhouse of the cell.',
    'Water is essential for life.',
    'The mitochondria is the powerhouse of the cell.'
  ].join(' ');

  it('flags highly similar local passages', async () => {
    const detector = new Detector();

    const results = await detector.analyze(repeatedText, 'local');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.similarity >= 50)).toBe(true);
    expect(results.every((result) => Array.isArray(result.sources))).toBe(true);
  });

  it('attaches web sources in non-local modes', async () => {
    const source: Source = {
      url: 'https://example.edu/source',
      title: 'Biology Notes',
      snippet: 'The mitochondria is the powerhouse of the cell.',
      confidence: 92
    };

    const attributor = {
      findSources: vi.fn().mockResolvedValue([source])
    };

    const detector = new Detector({
      attributor: attributor as any
    });

    const results = await detector.analyze(repeatedText, 'hybrid');

    expect(attributor.findSources).toHaveBeenCalled();
    expect(results.some((result) => result.sources[0]?.url === source.url)).toBe(true);
  });

  it('degrades gracefully when web attribution fails', async () => {
    const attributor = {
      findSources: vi.fn().mockRejectedValue(new Error('network unavailable'))
    };

    const detector = new Detector({
      attributor: attributor as any
    });

    const results = await detector.analyze(repeatedText, 'web');

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.sources.length === 0)).toBe(true);
  });
});
