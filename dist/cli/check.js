"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_1 = require("fs");
const detector_js_1 = require("../core/detector.js");
const report_js_1 = require("../models/report.js");
exports.checkCommand = new commander_1.Command('check')
    .description('Analyze text for plagiarism and provide educational feedback')
    .argument('<file>', 'Text file to analyze')
    .option('--format <type>', 'Citation format (apa|mla|chicago)', 'apa')
    .option('--mode <mode>', 'Detection mode (local|web|hybrid)', 'local')
    .option('--help-level <n>', 'Feedback level (1=hint, 2=guidance, 3=example)', '1')
    .option('--output <file>', 'Save report to file')
    .option('--json', 'Output as JSON')
    .action(async (file, options) => {
    let spinner = (0, ora_1.default)('Loading text file...').start();
    try {
        // Read input file
        const text = await fs_1.promises.readFile(file, 'utf-8');
        spinner.succeed(`Loaded ${text.length} characters`);
        // Validate options
        const citationFormat = options.format;
        if (!['apa', 'mla', 'chicago'].includes(citationFormat)) {
            throw new Error(`Invalid citation format: ${options.format}. Use apa, mla, or chicago.`);
        }
        const helpLevel = parseInt(options.helpLevel);
        if (![1, 2, 3].includes(helpLevel)) {
            throw new Error(`Invalid help level: ${options.helpLevel}. Use 1, 2, or 3.`);
        }
        // Analyze text
        spinner = (0, ora_1.default)('Analyzing text for similarity...').start();
        const detector = new detector_js_1.Detector();
        const results = await detector.analyze(text, options.mode);
        spinner.succeed(`Analysis complete - found ${results.length} similar passages`);
        // Generate report
        spinner = (0, ora_1.default)('Generating educational feedback...').start();
        const reportOptions = {
            citationFormat,
            helpLevel,
            trackProgress: false
        };
        const reportGen = new report_js_1.ReportGenerator();
        const report = reportGen.generate(results, reportOptions);
        spinner.succeed('Report generated');
        // Output report
        console.log('');
        if (options.json) {
            const jsonOutput = JSON.stringify(report, null, 2);
            if (options.output) {
                await fs_1.promises.writeFile(options.output, jsonOutput);
                console.log(chalk_1.default.green(`✅ Report saved to ${options.output}`));
            }
            else {
                console.log(jsonOutput);
            }
        }
        else {
            const markdownOutput = reportGen.formatMarkdown(report);
            if (options.output) {
                // Strip ANSI colors for file output
                const plainOutput = markdownOutput.replace(/\x1b\[[0-9;]*m/g, '');
                await fs_1.promises.writeFile(options.output, plainOutput);
                console.log(chalk_1.default.green(`✅ Report saved to ${options.output}`));
            }
            else {
                console.log(markdownOutput);
            }
        }
    }
    catch (error) {
        spinner.fail('Analysis failed');
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`\nError: ${error.message}\n`));
            if (error.message.includes('ENOENT')) {
                console.log(chalk_1.default.yellow('💡 Make sure the file path is correct and the file exists.'));
            }
        }
        process.exit(1);
    }
});
//# sourceMappingURL=check.js.map