#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const check_js_1 = require("./check.js");
const cite_js_1 = require("./cite.js");
const learn_js_1 = require("./learn.js");
const program = new commander_1.Command();
program
    .name('plagiarism-coach')
    .description('Educational plagiarism detection tool that teaches students how to write and cite correctly')
    .version('0.1.0');
// Add commands
program.addCommand(check_js_1.checkCommand);
program.addCommand(cite_js_1.citeCommand);
program.addCommand(learn_js_1.learnCommand);
// Parse arguments
program.parse(process.argv);
// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map