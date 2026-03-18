"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detector = void 0;
const natural_1 = __importDefault(require("natural"));
const { TfIdf, SentenceTokenizer } = natural_1.default;
class Detector {
    constructor() {
        this.tokenizer = new SentenceTokenizer();
    }
    /**
     * Analyze text for plagiarism
     * @param text - Text to analyze
     * @param mode - Detection mode (local, web, hybrid)
     * @returns Array of detection results
     */
    async analyze(text, mode = 'local') {
        const sentences = this.tokenize(text);
        // For MVP: only local TF-IDF analysis
        // Web search will be added later
        const results = await this.tfIdfAnalysis(text, sentences);
        return results;
    }
    /**
     * Tokenize text into sentences
     */
    tokenize(text) {
        const sentences = this.tokenizer.tokenize(text);
        return sentences.filter((s) => s.trim().length > 0);
    }
    /**
     * Perform TF-IDF similarity analysis
     * This is a simplified version for MVP - compares sentences against each other
     * to find duplicate/similar content within the document
     */
    async tfIdfAnalysis(fullText, sentences) {
        const results = [];
        // Create TF-IDF instance
        const tfidf = new TfIdf();
        // Add all sentences as documents
        sentences.forEach(sentence => {
            tfidf.addDocument(sentence);
        });
        // Compare each sentence against others
        sentences.forEach((sentence, index) => {
            // Get TF-IDF terms for this sentence
            const terms = [];
            tfidf.listTerms(index).forEach((item) => {
                terms.push({ term: item.term, tfidf: item.tfidf });
            });
            // Calculate similarity with other sentences
            const similarities = [];
            for (let i = 0; i < sentences.length; i++) {
                if (i === index)
                    continue;
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
    /**
     * Calculate cosine similarity between two documents
     */
    calculateSimilarity(tfidf, doc1Index, doc2Index) {
        const terms1 = new Map();
        const terms2 = new Map();
        // Get TF-IDF vectors for both documents
        tfidf.listTerms(doc1Index).forEach((item) => {
            terms1.set(item.term, item.tfidf);
        });
        tfidf.listTerms(doc2Index).forEach((item) => {
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
exports.Detector = Detector;
//# sourceMappingURL=detector.js.map