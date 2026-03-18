import { FeedbackLevel } from '../models/types.js';

export class Rewriter {
  /**
   * Generate educational feedback for a plagiarized passage
   * @param passage - The plagiarized text
   * @param similarity - Similarity score (0-100%)
   * @param helpLevel - Feedback level (1=hint, 2=guidance, 3=example)
   * @returns Feedback at the requested level
   */
  generateFeedback(
    passage: string,
    similarity: number,
    helpLevel: 1 | 2 | 3 = 1
  ): FeedbackLevel {
    const hint = this.generateHint(similarity);
    const guidance = helpLevel >= 2 ? this.generateGuidance(passage, similarity) : undefined;
    const example = helpLevel >= 3 ? this.generateExample(passage) : undefined;
    
    return { hint, guidance, example };
  }
  
  /**
   * Level 1: Generate a gentle hint
   */
  private generateHint(similarity: number): string {
    if (similarity >= 90) {
      return "💡 This passage is very close to another source. Try explaining the concept in your own words.";
    } else if (similarity >= 70) {
      return "💡 This passage could be more distinct. How would you explain this idea to a friend?";
    } else if (similarity >= 50) {
      return "💡 Parts of this passage are similar to other content. Consider paraphrasing to make it more unique.";
    }
    
    return "💡 This passage shows some similarity. Make sure you're expressing ideas in your own voice.";
  }
  
  /**
   * Level 2: Generate specific guidance
   */
  private generateGuidance(passage: string, similarity: number): string {
    const words = passage.split(/\s+/).filter(w => w.length > 0);
    const keyWords = this.extractKeyWords(passage);
    
    let guidance = "🎯 **How to improve:**\n\n";
    
    if (similarity >= 90) {
      guidance += "1. **Read and close the source**: Read the original, then set it aside\n";
      guidance += "2. **Explain without looking**: Try to explain the concept from memory\n";
      guidance += "3. **Use different structure**: Don't follow the same sentence pattern\n";
    } else if (similarity >= 70) {
      guidance += "1. **Change the sentence structure**: Try starting with a different part of the idea\n";
      guidance += "2. **Use different vocabulary**: Find synonyms for key terms\n";
      guidance += "3. **Add your own insight**: What do YOU think about this?\n";
    } else {
      guidance += "1. **Vary your phrasing**: Use different words to express the same idea\n";
      guidance += "2. **Add context**: Explain WHY this matters\n";
    }
    
    if (keyWords.length > 0) {
      guidance += `\n**Key concepts to rephrase:** ${keyWords.slice(0, 3).join(', ')}`;
    }
    
    return guidance;
  }
  
  /**
   * Level 3: Generate an example paraphrase
   * For MVP: template-based (AI integration comes later)
   */
  private generateExample(passage: string): string {
    const words = passage.split(/\s+/).filter(w => w.length > 0);
    
    let example = "📝 **Example approach** (don't copy this directly!):\n\n";
    example += "Instead of the original phrasing, you could:\n";
    example += "1. Start with the main point, then add details\n";
    example += "2. Use active voice instead of passive (or vice versa)\n";
    example += "3. Break one long sentence into two shorter ones, or combine short sentences\n";
    example += "4. Add a transition that connects to your previous paragraph\n\n";
    example += "⚠️ **Remember**: This is just to show the PROCESS. Write your own version!";
    
    return example;
  }
  
  /**
   * Extract key words from a passage (simple version)
   */
  private extractKeyWords(passage: string): string[] {
    // Remove common words and extract nouns/verbs
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their'
    ]);
    
    const words = passage
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.replace(/[^\w]/g, ''))
      .filter(w => w.length > 3 && !commonWords.has(w));
    
    // Return unique words
    return Array.from(new Set(words));
  }
}
