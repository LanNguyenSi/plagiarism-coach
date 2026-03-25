import { describe, expect, it } from 'vitest';
import { ReportGenerator } from '../models/report';
import { DetectionResult } from '../models/types';

describe('ReportGenerator', () => {
  it('builds summary statistics, findings, and suggestions', () => {
    const generator = new ReportGenerator();
    const results: DetectionResult[] = [
      {
        passage: 'Copied sentence one.',
        similarity: 82,
        sources: [
          {
            url: 'https://example.edu/source',
            title: 'Source title',
            snippet: 'Copied sentence one.',
            confidence: 90
          }
        ],
        startIndex: 0,
        endIndex: 19,
        sentenceIndex: 0
      },
      {
        passage: 'Similar sentence two.',
        similarity: 55,
        sources: [],
        startIndex: 20,
        endIndex: 40,
        sentenceIndex: 1
      }
    ];

    const report = generator.generate(results, {
      citationFormat: 'apa',
      helpLevel: 2
    });

    expect(report.summary.totalPassages).toBe(2);
    expect(report.summary.highSimilarity).toBe(1);
    expect(report.summary.mediumSimilarity).toBe(1);
    expect(report.findings[0].citation).toContain('Source title');
    expect(report.suggestions.some((entry) => entry.includes('cite ALL sources'))).toBe(true);
  });

  it('formats markdown output with major sections', () => {
    const generator = new ReportGenerator();
    const report = generator.generate([], {
      citationFormat: 'apa',
      helpLevel: 1
    });

    const markdown = generator.formatMarkdown(report);

    expect(markdown).toContain('Plagiarism Analysis Report');
    expect(markdown).toContain('Summary');
    expect(markdown).toContain('No high-similarity passages detected');
  });
});
