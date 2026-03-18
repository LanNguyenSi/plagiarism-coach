"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.citeCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
exports.citeCommand = new commander_1.Command('cite')
    .description('Generate citation for a URL')
    .argument('<url>', 'URL to cite')
    .option('--format <type>', 'Citation format (apa|mla|chicago)', 'apa')
    .option('--type <type>', 'Citation type (bibliography|in-text)', 'bibliography')
    .action(async (url, options) => {
    console.log(chalk_1.default.bold('\n📚 Citation Generator\n'));
    console.log(chalk_1.default.gray(`URL: ${url}`));
    console.log(chalk_1.default.gray(`Format: ${options.format}`));
    console.log(chalk_1.default.gray(`Type: ${options.type}\n`));
    console.log(chalk_1.default.yellow('⚠️  Citation generation not yet implemented'));
    console.log(chalk_1.default.gray('Coming soon: Automatic metadata extraction and citation formatting\n'));
});
//# sourceMappingURL=cite.js.map