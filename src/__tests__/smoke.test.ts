import { describe, it, expect } from 'vitest';
import { Detector } from '../core/detector';
import { Citator } from '../core/citator';
import { Rewriter } from '../core/rewriter';
import { Attributor } from '../core/attributor';
import { ReportGenerator } from '../models/report';

describe('Plagiarism Coach Smoke Tests', () => {
  it('Detector is defined', () => {
    expect(Detector).toBeDefined();
  });

  it('Attributor is defined', () => {
    expect(Attributor).toBeDefined();
  });

  it('Citator is defined', () => {
    expect(Citator).toBeDefined();
  });

  it('Rewriter is defined', () => {
    expect(Rewriter).toBeDefined();
  });

  it('ReportGenerator is defined', () => {
    expect(ReportGenerator).toBeDefined();
  });
});
