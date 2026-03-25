import { describe, it, expect } from 'vitest';
import { Detector } from '../core/detector';
import { Citator } from '../core/citator';
import { Rewriter } from '../core/rewriter';

describe('Plagiarism Coach Smoke Tests', () => {
  it('Detector is defined', () => {
    expect(Detector).toBeDefined();
  });

  it('Citator is defined', () => {
    expect(Citator).toBeDefined();
  });

  it('Rewriter is defined', () => {
    expect(Rewriter).toBeDefined();
  });
});
