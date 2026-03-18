"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerator = void 0;
const chalk_1 = __importDefault(require("chalk"));
const rewriter_js_1 = require("../core/rewriter.js");
const citator_js_1 = require("../core/citator.js");
class ReportGenerator {
    constructor() {
        this.rewriter = new rewriter_js_1.Rewriter();
        this.citator = new citator_js_1.Citator();
    }
    /**
     * Generate a complete report from detection results
     */
    generate(results, options) {
        const summary = this.generateSummary(results);
        const findings = this.generateFindings(results, options);
        const suggestions = this.generateSuggestions(summary);
        return {
            summary,
            findings,
            suggestions
        };
    }
    /**
     * Generate summary statistics
     */
    generateSummary(results) {
        const highSimilarity = results.filter(r => r.similarity >= 70).length;
        const mediumSimilarity = results.filter(r => r.similarity >= 50 && r.similarity < 70).length;
        const lowSimilarity = results.filter(r => r.similarity < 50).length;
        const overallScore = results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.similarity, 0) / results.length)
            : 0;
        return {
            totalPassages: results.length,
            highSimilarity,
            mediumSimilarity,
            lowSimilarity,
            overallScore
        };
    }
    /**
     * Generate detailed findings with feedback
     */
    generateFindings(results, options) {
        return results.map(result => {
            const feedback = this.rewriter.generateFeedback(result.passage, result.similarity, options.helpLevel);
            // Generate citation if we have a source
            const source = result.sources[0] || null;
            const citation = source
                ? this.citator.generate(source, options.citationFormat)
                : "Source unknown - could not generate citation";
            return {
                passage: result.passage,
                similarity: result.similarity,
                source,
                feedback,
                citation,
                sentenceIndex: result.sentenceIndex
            };
        });
    }
    /**
     * Generate improvement suggestions based on summary
     */
    generateSuggestions(summary) {
        const suggestions = [];
        if (summary.overallScore >= 70) {
            suggestions.push("🔴 High similarity detected. Focus on paraphrasing in your own words.");
            suggestions.push("💡 Try the 'read, close, write' method: read the source, close it, then write from memory.");
        }
        else if (summary.overallScore >= 50) {
            suggestions.push("🟡 Moderate similarity. Good start, but needs more original phrasing.");
            suggestions.push("💡 Vary your sentence structure and use synonyms.");
        }
        else {
            suggestions.push("🟢 Good work! Similarity is low.");
        }
        if (summary.highSimilarity > 0) {
            suggestions.push(`⚠️ ${summary.highSimilarity} passage(s) need significant rewriting.`);
        }
        suggestions.push("📚 Remember to cite ALL sources, even if you paraphrase well.");
        return suggestions;
    }
    /**
     * Format report as Markdown
     */
    formatMarkdown(report) {
        let output = '';
        // Header
        output += chalk_1.default.bold.cyan('\n📊 Plagiarism Analysis Report\n');
        output += chalk_1.default.gray('═'.repeat(50)) + '\n\n';
        // Summary
        output += chalk_1.default.bold('Summary\n');
        output += chalk_1.default.gray('─'.repeat(50)) + '\n';
        output += `Total passages analyzed: ${report.summary.totalPassages}\n`;
        const similarityColor = this.getSimilarityColorString(report.summary.overallScore);
        output += `Overall similarity: ${similarityColor}\n`;
        output += `  • High similarity (>70%): ${chalk_1.default.red(String(report.summary.highSimilarity))}\n`;
        output += `  • Medium similarity (50-70%): ${chalk_1.default.yellow(String(report.summary.mediumSimilarity))}\n`;
        output += `  • Low similarity (<50%): ${chalk_1.default.green(String(report.summary.lowSimilarity))}\n`;
        output += '\n';
        // Suggestions
        if (report.suggestions.length > 0) {
            output += chalk_1.default.bold('Suggestions\n');
            output += chalk_1.default.gray('─'.repeat(50)) + '\n';
            report.suggestions.forEach(suggestion => {
                output += `${suggestion}\n`;
            });
            output += '\n';
        }
        // Findings
        if (report.findings.length > 0) {
            output += chalk_1.default.bold('Detailed Findings\n');
            output += chalk_1.default.gray('─'.repeat(50)) + '\n\n';
            report.findings.forEach((finding, index) => {
                output += chalk_1.default.bold(`Finding #${index + 1}`);
                output += chalk_1.default.gray(` (Sentence ${finding.sentenceIndex + 1})`);
                output += '\n';
                output += chalk_1.default.italic(`"${finding.passage}"`);
                output += '\n\n';
                output += `Similarity: ${this.getSimilarityColorString(finding.similarity)}\n\n`;
                // Feedback
                output += chalk_1.default.yellow(finding.feedback.hint) + '\n\n';
                if (finding.feedback.guidance) {
                    output += finding.feedback.guidance + '\n\n';
                }
                if (finding.feedback.example) {
                    output += finding.feedback.example + '\n\n';
                }
                // Citation
                if (finding.source) {
                    output += chalk_1.default.bold('Suggested citation:\n');
                    output += chalk_1.default.gray(finding.citation) + '\n\n';
                }
                output += chalk_1.default.gray('─'.repeat(50)) + '\n\n';
            });
        }
        else {
            output += chalk_1.default.green('✅ No high-similarity passages detected!\n\n');
        }
        return output;
    }
    /**
     * Get colored string for similarity score
     */
    getSimilarityColorString(similarity) {
        const percent = `${similarity}%`;
        if (similarity >= 70)
            return chalk_1.default.red(percent);
        if (similarity >= 50)
            return chalk_1.default.yellow(percent);
        return chalk_1.default.green(percent);
    }
}
exports.ReportGenerator = ReportGenerator;
//# sourceMappingURL=report.js.map