import { Source } from '../models/types.js';
export declare class Citator {
    /**
     * Generate a citation for a source
     * @param source - Source to cite
     * @param format - Citation format (apa, mla, chicago)
     * @param type - Citation type (bibliography or in-text)
     * @returns Formatted citation
     */
    generate(source: Source, format?: 'apa' | 'mla' | 'chicago', type?: 'bibliography' | 'in-text'): string;
    /**
     * Manual fallback formatting if citation-js fails
     */
    private manualFormat;
    /**
     * Explain when and how to cite
     */
    explain(format: 'apa' | 'mla' | 'chicago'): string;
    /**
     * Determine if a claim needs citation
     */
    needsCitation(text: string): {
        needs: boolean;
        reason: string;
    };
}
//# sourceMappingURL=citator.d.ts.map