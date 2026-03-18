import { Command } from 'commander';
import chalk from 'chalk';

export const learnCommand = new Command('learn')
  .description('Interactive tutorial on paraphrasing and citing')
  .argument('[topic]', 'Tutorial topic (paraphrasing|citing|formats)')
  .action(async (topic) => {
    console.log(chalk.bold('\n📖 Learn to Write Better\n'));
    
    if (topic) {
      console.log(chalk.gray(`Topic: ${topic}\n`));
    }
    
    console.log(chalk.yellow('⚠️  Interactive tutorial not yet implemented'));
    console.log(chalk.gray('Coming soon: Interactive lessons on paraphrasing, citing, and formatting\n'));
    
    console.log(chalk.bold('Available topics:'));
    console.log(chalk.gray('  • paraphrasing  - Learn how to paraphrase effectively'));
    console.log(chalk.gray('  • citing        - Learn when and how to cite'));
    console.log(chalk.gray('  • formats       - Learn citation formats (APA/MLA/Chicago)\n'));
  });
