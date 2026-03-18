/**
 * Core types for PlagiarismCoach
 */

export interface DetectionResult {
  /** The plagiarized text passage */
  passage: string;
  
  /** Similarity score (0-100%) */
  similarity: number;
  
  /** Possible original sources */
  sources: Source[];
  
  /** Starting character index in original text */
  startIndex: number;
  
  /** Ending character index in original text */
  endIndex: number;
  
  /** Sentence index (for reporting) */
  sentenceIndex: number;
}

export interface Source {
  /** URL of the source */
  url: string;
  
  /** Title of the source page */
  title: string;
  
  /** Snippet from the source */
  snippet: string;
  
  /** Confidence that this is the source (0-100%) */
  confidence: number;
  
  /** Metadata (author, date, etc.) */
  metadata?: SourceMetadata;
}

export interface SourceMetadata {
  author?: string;
  publishDate?: string;
  domain?: string;
}

export interface FeedbackLevel {
  /** Level 1: Gentle hint */
  hint: string;
  
  /** Level 2: Specific guidance (optional) */
  guidance?: string;
  
  /** Level 3: Example paraphrase (optional) */
  example?: string;
}

export interface Finding {
  passage: string;
  similarity: number;
  source: Source | null;
  feedback: FeedbackLevel;
  citation: string;
  sentenceIndex: number;
}

export interface ReportSummary {
  totalPassages: number;
  highSimilarity: number; // >70%
  mediumSimilarity: number; // 50-70%
  lowSimilarity: number; // <50%
  overallScore: number; // Average similarity
}

export interface Report {
  summary: ReportSummary;
  findings: Finding[];
  suggestions: string[];
  progress?: ProgressTracker;
}

export interface ProgressTracker {
  essaysAnalyzed: number;
  similarityTrend: number[];
  skillsLearned: string[];
  nextSteps: string[];
}

export interface ReportOptions {
  citationFormat: 'apa' | 'mla' | 'chicago';
  helpLevel: 1 | 2 | 3;
  trackProgress?: boolean;
}

export type DetectionMode = 'local' | 'web' | 'hybrid';
