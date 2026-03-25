import natural from 'natural';
import { DetectionResult, DetectionMode } from '../models/types.js';
import { Attributor } from './attributor.js';

const { TfIdf, SentenceTokenizer } = natural;

export interface DetectorOptions {
  attributor?: Attributor;
  webSimilarityThreshold?: number;
}

export class Detector {
  private tokenizer: any;
  private readonly attributor: Attributor;
  private readonly webSimilarityThreshold: number;

  constructor(options: DetectorOptions = {}) {
    this.tokenizer = new (SentenceTokenizer as any)();
    this.attributor = options.attributor || new Attributor();
    this.webSimilarityThreshold = options.webSimilarityThreshold || 50;
  }
  
  /**
   * Analyze text for plagiarism
   * @param text - Text to analyze
   * @param mode - Detection mode (local, web, hybrid)
   * @returns Array of detection results
   */
  async analyze(text: string, mode: DetectionMode = 'local'): Promise<DetectionResult[]> {
    const sentences = this.tokenize(text);
    const results = await this.tfIdfAnalysis(text, sentences);

    if (mode === 'local' || results.length === 0) {
      return results;
    }

    return this.attachSources(results);
  }
  
  /**
   * Tokenize text into sentences
   */
  private tokenize(text: string): string[] {
    const sentences = this.tokenizer.tokenize(text);
    return sentences.filter((s: string) => s.trim().length > 0);
  }
  
  /**
   * Perform TF-IDF similarity analysis
   * This is a simplified version for MVP - compares sentences against each other
   * to find duplicate/similar content within the document
   */
  private async tfIdfAnalysis(fullText: string, sentences: string[]): Promise<DetectionResult[]> {
    const results: DetectionResult[] = [];
    
    // Create TF-IDF instance
    const tfidf = new TfIdf();
    
    // Add all sentences as documents
    sentences.forEach(sentence => {
      tfidf.addDocument(sentence);
    });
    
    // Compare each sentence against others
    sentences.forEach((sentence, index) => {
      // Get TF-IDF terms for this sentence
      const terms: Array<{ term: string; tfidf: number }> = [];
      
      tfidf.listTerms(index).forEach((item: any) => {
        terms.push({ term: item.term, tfidf: item.tfidf });
      });
      
      // Calculate similarity with other sentences
      const similarities: Array<{ index: number; score: number }> = [];
      
      for (let i = 0; i < sentences.length; i++) {
        if (i === index) continue;
        
        const similarity = this.calculateSimilarity(tfidf, index, i);
        
        if (similarity > 0.3) { // Threshold: 30%
          similarities.push({ index: i, score: similarity });
        }
      }
      
      // If we found similar sentences, create a detection result
      if (similarities.length > 0) {
        const maxSimilarity = Math.max(...similarities.map(s => s.score));
        const similarityPercent = Math.round(maxSimilarity * 100);
        
        // Only flag if similarity is significant (>50%)
        if (similarityPercent >= 50) {
          const startIndex = fullText.indexOf(sentence);
          const endIndex = startIndex + sentence.length;
          
          results.push({
            passage: sentence,
            similarity: similarityPercent,
            sources: [], // Web sources will be added later
            startIndex,
            endIndex,
            sentenceIndex: index
          });
        }
      }
    });
    
    return results;
  }

  private async attachSources(results: DetectionResult[]): Promise<DetectionResult[]> {
    const enrichedResults = await Promise.all(
      results.map(async (result) => {
        if (result.similarity < this.webSimilarityThreshold) {
          return result;
        }

        try {
          const sources = await this.attributor.findSources(result.passage, 3);
          return {
            ...result,
            sources
          };
        } catch {
          return result;
        }
      })
    );

    return enrichedResults;
  }
  
  /**
   * Calculate cosine similarity between two documents
   */
  private calculateSimilarity(tfidf: any, doc1Index: number, doc2Index: number): number {
    const terms1 = new Map<string, number>();
    const terms2 = new Map<string, number>();
    
    // Get TF-IDF vectors for both documents
    tfidf.listTerms(doc1Index).forEach((item: any) => {
      terms1.set(item.term, item.tfidf);
    });
    
    tfidf.listTerms(doc2Index).forEach((item: any) => {
      terms2.set(item.term, item.tfidf);
    });
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    // Dot product and magnitude of doc1
    terms1.forEach((tfidf1, term) => {
      magnitude1 += tfidf1 * tfidf1;
      const tfidf2 = terms2.get(term) || 0;
      dotProduct += tfidf1 * tfidf2;
    });
    
    // Magnitude of doc2
    terms2.forEach((tfidf2) => {
      magnitude2 += tfidf2 * tfidf2;
    });
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
    
    return dotProduct / (magnitude1 * magnitude2);
  }
}
