import { describe, expect, it } from 'vitest';
import { Citator } from '../core/citator';
import { Source } from '../models/types';

describe('Citator', () => {
  const source: Source = {
    url: 'https://example.edu/article',
    title: 'Academic Integrity Basics',
    snippet: 'Citation matters.',
    confidence: 85,
    metadata: {
      author: 'Jane Smith',
      publishDate: '2024-10-12'
    }
  };

  it('generates a bibliography citation', () => {
    const citator = new Citator();

    const citation = citator.generate(source, 'apa', 'bibliography');

    expect(citation).toContain('Academic Integrity Basics');
    expect(citation).toContain('Jane Smith');
  });

  it('generates an in-text citation', () => {
    const citator = new Citator();

    const citation = citator.generate(source, 'mla', 'in-text');

    expect(citation).toContain('Smith');
  });

  it('detects when a statement needs citation', () => {
    const citator = new Citator();

    expect(citator.needsCitation('Studies show that exercise reduces stress.').needs).toBe(true);
    expect(citator.needsCitation('Water freezes at 0 degrees Celsius.').needs).toBe(false);
  });

  it('explains citation formats and quote detection', () => {
    const citator = new Citator();

    expect(citator.explain('apa')).toContain('Author-date system');
    expect(citator.needsCitation('"Quoted material" from a source.').needs).toBe(true);
    expect(citator.needsCitation('The dataset shows 42% growth.').needs).toBe(true);
  });
});
