#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { checkCommand } from './check.js';
import { citeCommand } from './cite.js';
import { learnCommand } from './learn.js';

const program = new Command();

program
  .name('plagiarism-coach')
  .description('Educational plagiarism detection tool that teaches students how to write and cite correctly')
  .version('0.1.0');

// Add commands
program.addCommand(checkCommand);
program.addCommand(citeCommand);
program.addCommand(learnCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
