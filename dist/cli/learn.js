"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.learnCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
exports.learnCommand = new commander_1.Command('learn')
    .description('Interactive tutorial on paraphrasing and citing')
    .argument('[topic]', 'Tutorial topic (paraphrasing|citing|formats)')
    .action(async (topic) => {
    console.log(chalk_1.default.bold('\n📖 Learn to Write Better\n'));
    if (topic) {
        console.log(chalk_1.default.gray(`Topic: ${topic}\n`));
    }
    console.log(chalk_1.default.yellow('⚠️  Interactive tutorial not yet implemented'));
    console.log(chalk_1.default.gray('Coming soon: Interactive lessons on paraphrasing, citing, and formatting\n'));
    console.log(chalk_1.default.bold('Available topics:'));
    console.log(chalk_1.default.gray('  • paraphrasing  - Learn how to paraphrase effectively'));
    console.log(chalk_1.default.gray('  • citing        - Learn when and how to cite'));
    console.log(chalk_1.default.gray('  • formats       - Learn citation formats (APA/MLA/Chicago)\n'));
});
//# sourceMappingURL=learn.js.map