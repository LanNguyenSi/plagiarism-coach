import { DetectionResult, DetectionMode } from '../models/types.js';
export declare class Detector {
    private tokenizer;
    constructor();
    /**
     * Analyze text for plagiarism
     * @param text - Text to analyze
     * @param mode - Detection mode (local, web, hybrid)
     * @returns Array of detection results
     */
    analyze(text: string, mode?: DetectionMode): Promise<DetectionResult[]>;
    /**
     * Tokenize text into sentences
     */
    private tokenize;
    /**
     * Perform TF-IDF similarity analysis
     * This is a simplified version for MVP - compares sentences against each other
     * to find duplicate/similar content within the document
     */
    private tfIdfAnalysis;
    /**
     * Calculate cosine similarity between two documents
     */
    private calculateSimilarity;
}
//# sourceMappingURL=detector.d.ts.map