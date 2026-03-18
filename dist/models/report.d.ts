import { DetectionResult, Report, ReportOptions } from './types.js';
export declare class ReportGenerator {
    private rewriter;
    private citator;
    constructor();
    /**
     * Generate a complete report from detection results
     */
    generate(results: DetectionResult[], options: ReportOptions): Report;
    /**
     * Generate summary statistics
     */
    private generateSummary;
    /**
     * Generate detailed findings with feedback
     */
    private generateFindings;
    /**
     * Generate improvement suggestions based on summary
     */
    private generateSuggestions;
    /**
     * Format report as Markdown
     */
    formatMarkdown(report: Report): string;
    /**
     * Get colored string for similarity score
     */
    private getSimilarityColorString;
}
//# sourceMappingURL=report.d.ts.map