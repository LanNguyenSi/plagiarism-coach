import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { promises as fs } from 'fs';
import { Detector } from '../core/detector.js';
import { ReportGenerator } from '../models/report.js';
import { ReportOptions } from '../models/types.js';

export const checkCommand = new Command('check')
  .description('Analyze text for plagiarism and provide educational feedback')
  .argument('<file>', 'Text file to analyze')
  .option('--format <type>', 'Citation format (apa|mla|chicago)', 'apa')
  .option('--mode <mode>', 'Detection mode (local|web|hybrid)', 'local')
  .option('--help-level <n>', 'Feedback level (1=hint, 2=guidance, 3=example)', '1')
  .option('--output <file>', 'Save report to file')
  .option('--json', 'Output as JSON')
  .action(async (file, options) => {
    let spinner = ora('Loading text file...').start();
    
    try {
      // Read input file
      const text = await fs.readFile(file, 'utf-8');
      spinner.succeed(`Loaded ${text.length} characters`);
      
      // Validate options
      const citationFormat = options.format as 'apa' | 'mla' | 'chicago';
      if (!['apa', 'mla', 'chicago'].includes(citationFormat)) {
        throw new Error(`Invalid citation format: ${options.format}. Use apa, mla, or chicago.`);
      }
      
      const helpLevel = parseInt(options.helpLevel) as 1 | 2 | 3;
      if (![1, 2, 3].includes(helpLevel)) {
        throw new Error(`Invalid help level: ${options.helpLevel}. Use 1, 2, or 3.`);
      }
      
      // Analyze text
      spinner = ora('Analyzing text for similarity...').start();
      const detector = new Detector();
      const results = await detector.analyze(text, options.mode);
      spinner.succeed(`Analysis complete - found ${results.length} similar passages`);
      
      // Generate report
      spinner = ora('Generating educational feedback...').start();
      const reportOptions: ReportOptions = {
        citationFormat,
        helpLevel,
        trackProgress: false
      };
      
      const reportGen = new ReportGenerator();
      const report = reportGen.generate(results, reportOptions);
      spinner.succeed('Report generated');
      
      // Output report
      console.log('');
      
      if (options.json) {
        const jsonOutput = JSON.stringify(report, null, 2);
        
        if (options.output) {
          await fs.writeFile(options.output, jsonOutput);
          console.log(chalk.green(`✅ Report saved to ${options.output}`));
        } else {
          console.log(jsonOutput);
        }
      } else {
        const markdownOutput = reportGen.formatMarkdown(report);
        
        if (options.output) {
          // Strip ANSI colors for file output
          const plainOutput = markdownOutput.replace(/\x1b\[[0-9;]*m/g, '');
          await fs.writeFile(options.output, plainOutput);
          console.log(chalk.green(`✅ Report saved to ${options.output}`));
        } else {
          console.log(markdownOutput);
        }
      }
      
    } catch (error) {
      spinner.fail('Analysis failed');
      if (error instanceof Error) {
        console.error(chalk.red(`\nError: ${error.message}\n`));
        
        if (error.message.includes('ENOENT')) {
          console.log(chalk.yellow('💡 Make sure the file path is correct and the file exists.'));
        }
      }
      process.exit(1);
    }
  });
