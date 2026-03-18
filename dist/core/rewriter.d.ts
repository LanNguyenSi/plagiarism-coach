import { FeedbackLevel } from '../models/types.js';
export declare class Rewriter {
    /**
     * Generate educational feedback for a plagiarized passage
     * @param passage - The plagiarized text
     * @param similarity - Similarity score (0-100%)
     * @param helpLevel - Feedback level (1=hint, 2=guidance, 3=example)
     * @returns Feedback at the requested level
     */
    generateFeedback(passage: string, similarity: number, helpLevel?: 1 | 2 | 3): FeedbackLevel;
    /**
     * Level 1: Generate a gentle hint
     */
    private generateHint;
    /**
     * Level 2: Generate specific guidance
     */
    private generateGuidance;
    /**
     * Level 3: Generate an example paraphrase
     * For MVP: template-based (AI integration comes later)
     */
    private generateExample;
    /**
     * Extract key words from a passage (simple version)
     */
    private extractKeyWords;
}
//# sourceMappingURL=rewriter.d.ts.map