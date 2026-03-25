import { describe, expect, it } from 'vitest';
import { Rewriter } from '../core/rewriter';

describe('Rewriter', () => {
  it('returns only a hint for help level 1', () => {
    const rewriter = new Rewriter();

    const feedback = rewriter.generateFeedback('A copied passage', 95, 1);

    expect(feedback.hint).toContain('very close');
    expect(feedback.guidance).toBeUndefined();
    expect(feedback.example).toBeUndefined();
  });

  it('includes guidance and example at higher help levels', () => {
    const rewriter = new Rewriter();

    const feedback = rewriter.generateFeedback(
      'The mitochondria is the powerhouse of the cell.',
      75,
      3
    );

    expect(feedback.guidance).toContain('How to improve');
    expect(feedback.guidance).toContain('mitochondria');
    expect(feedback.example).toContain('Example approach');
  });
});
