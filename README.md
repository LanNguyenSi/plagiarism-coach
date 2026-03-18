# PlagiarismCoach 🎓

**Educational plagiarism detection tool that teaches students how to write and cite correctly, instead of just punishing them.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## Philosophy

Traditional plagiarism detection tools give you a percentage score and mark copied text in red. Students learn "don't get caught" instead of "how to write properly."

**PlagiarismCoach is different:**

- ✅ **Teaches** instead of punishes
- ✅ **Guides** step-by-step improvements
- ✅ **Explains** why passages need work
- ✅ **Provides** citation examples
- ✅ **Respects** student privacy (local-first analysis)

> "Every plagiarized passage is a chance to teach a student how to write better."

## Features

### 🔍 Smart Detection
- **TF-IDF similarity analysis** for local detection (no API needed)
- **Sentence-level granularity** for precise feedback
- **50%+ similarity threshold** to avoid false positives
- **Fast:** <2 seconds for 1000-word essays

### 🎓 Progressive Feedback (3 Levels)

**Level 1: Gentle Hint** (default)
```
💡 This passage is very close to another source.
   Try explaining the concept in your own words.
```

**Level 2: Specific Guidance** (`--help-level 2`)
```
🎯 How to improve:
1. Read and close the source
2. Explain without looking
3. Use different structure

Key concepts to rephrase: mitochondria, powerhouse, cell
```

**Level 3: Example Paraphrase** (`--help-level 3`)
```
📝 Example approach:
Instead of the original phrasing, you could:
1. Start with the main point, then add details
2. Use active voice instead of passive
3. Break one long sentence into two shorter ones

⚠️ Remember: This is just to show the PROCESS. Write your own version!
```

### 📚 Citation Support

**Multi-format citations:**
- APA (American Psychological Association)
- MLA (Modern Language Association)
- Chicago (Chicago Manual of Style)

**Educational guidance:**
- When to cite (not just how)
- In-text vs. bibliography citations
- Common knowledge exceptions

### 📊 Beautiful Reports

Terminal output with colors, emojis, and clear structure:

```
📊 Plagiarism Analysis Report
═══════════════════════════════════════════

Summary
───────────────────────────────────────────
Total passages analyzed: 2
Overall similarity: 63%
  • High similarity (>70%): 0
  • Medium similarity (50-70%): 2
  • Low similarity (<50%): 0

Suggestions
───────────────────────────────────────────
🟡 Moderate similarity. Good start, but needs more original phrasing.
💡 Vary your sentence structure and use synonyms.
📚 Remember to cite ALL sources, even if you paraphrase well.
```

## Installation

### Prerequisites
- Node.js 18+ (for development)
- npm or yarn

### From Source

```bash
git clone https://github.com/LanNguyenSi/plagiarism-coach.git
cd plagiarism-coach
make install  # Install dependencies
make build    # Build TypeScript
make link     # Make CLI globally available

# Or use npm directly:
npm install && npm run build && npm link
```

### Quick Start (Makefile)

```bash
make help       # Show all available commands
make demo       # Build and run demo with sample essay
make test       # Run tests
make clean      # Clean build artifacts
```

### Docker

```bash
make docker-build  # Build Docker image
make docker-run    # Run in Docker container
```

### Usage

```bash
# Basic analysis
plagiarism-coach check essay.txt

# With specific citation format
plagiarism-coach check essay.txt --format apa

# With more detailed feedback
plagiarism-coach check essay.txt --help-level 2

# Save report to file
plagiarism-coach check essay.txt --output report.md

# JSON output (for programmatic use)
plagiarism-coach check essay.txt --json
```

## CLI Commands

### `check` - Analyze text for plagiarism

```bash
plagiarism-coach check <file> [options]

Options:
  --format <type>     Citation format (apa|mla|chicago) [default: apa]
  --mode <mode>       Detection mode (local|web|hybrid) [default: local]
  --help-level <n>    Feedback level (1=hint, 2=guidance, 3=example) [default: 1]
  --output <file>     Save report to file
  --json              Output as JSON
```

### `cite` - Generate citation for a URL

```bash
plagiarism-coach cite <url> [options]

Options:
  --format <type>  Citation format (apa|mla|chicago) [default: apa]
  --type <type>    Citation type (bibliography|in-text) [default: bibliography]
```

### `learn` - Interactive tutorial

```bash
plagiarism-coach learn [topic]

Topics:
  paraphrasing   Learn how to paraphrase effectively
  citing         Learn when and how to cite
  formats        Learn citation formats (APA/MLA/Chicago)
```

## Examples

### Example 1: Basic Analysis

**Input:** `essay.txt`
```
The mitochondria is the powerhouse of the cell. This organelle is 
responsible for producing ATP through cellular respiration. The 
mitochondria is the powerhouse of the cell, providing energy for 
all cellular activities.
```

**Command:**
```bash
plagiarism-coach check essay.txt
```

**Output:**
```
📊 Plagiarism Analysis Report

Summary
───────────────────────────────────────────
Total passages analyzed: 2
Overall similarity: 63%

Finding #1 (Sentence 1)
"The mitochondria is the powerhouse of the cell."

Similarity: 63%

💡 Parts of this passage are similar to other content. 
   Consider paraphrasing to make it more unique.
```

### Example 2: Detailed Guidance

**Command:**
```bash
plagiarism-coach check essay.txt --help-level 2 --format apa
```

**Output includes:**
```
🎯 How to improve:

1. Vary your phrasing: Use different words to express the same idea
2. Add context: Explain WHY this matters

Key concepts to rephrase: mitochondria, powerhouse, cell
```

## How It Works

### 1. Detection Engine (TF-IDF)

PlagiarismCoach uses **Term Frequency-Inverse Document Frequency (TF-IDF)** to measure text similarity:

1. Text is tokenized into sentences
2. Each sentence is converted to a TF-IDF vector
3. Cosine similarity is calculated between sentences
4. Passages with >50% similarity are flagged

**Why TF-IDF?**
- Fast (local processing, no API needed)
- Privacy-preserving (nothing leaves your machine)
- Effective for detecting duplicate/similar content
- No rate limits or API costs

### 2. Feedback System

Instead of just marking text red, PlagiarismCoach:

1. Identifies the specific issue (similarity score)
2. Explains WHY it's problematic (educational context)
3. Suggests HOW to improve (actionable steps)
4. Provides examples when requested (progressive disclosure)

### 3. Citation Generator

Uses the `citation-js` library to generate proper citations:

- Automatic format conversion (APA ↔ MLA ↔ Chicago)
- Handles web pages, books, articles, etc.
- Includes access dates for web sources
- Validates citation structure

## Development

### Project Structure

```
plagiarism-coach/
├── src/
│   ├── cli/           # Command-line interface
│   │   ├── index.ts   # CLI entry point
│   │   ├── check.ts   # Check command
│   │   ├── cite.ts    # Cite command
│   │   └── learn.ts   # Learn command
│   ├── core/          # Core functionality
│   │   ├── detector.ts    # TF-IDF similarity detection
│   │   ├── rewriter.ts    # Feedback generation
│   │   └── citator.ts     # Citation formatting
│   ├── models/        # Data models
│   │   ├── types.ts   # TypeScript interfaces
│   │   └── report.ts  # Report generator
│   └── utils/         # Utilities
├── examples/          # Sample files
├── tests/             # Unit tests
└── docs/             # Additional documentation
```

### Tech Stack

- **Language:** TypeScript (strict mode)
- **CLI Framework:** Commander.js
- **NLP:** Natural (TF-IDF, tokenization)
- **Citations:** citation-js
- **Terminal UI:** chalk, ora
- **Testing:** Vitest

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Development Mode (watch)

```bash
npm run dev
```

## Roadmap

### MVP (Current)
- [x] TF-IDF local detection
- [x] Progressive feedback system (3 levels)
- [x] Citation generator (APA/MLA/Chicago)
- [x] CLI interface
- [x] Markdown reports

### Future Features
- [ ] Web search integration (find original sources)
- [ ] AI-powered paraphrasing hints (Claude/GPT)
- [ ] Progress tracking over time
- [ ] Interactive tutorial mode
- [ ] VSCode extension
- [ ] Web UI
- [ ] Multi-language support

## Why PlagiarismCoach?

### For Students

**Traditional Tool:**
> "This text is 85% plagiarized. Grade: F."

**PlagiarismCoach:**
> "Here are 3 passages that need citation. Let me show you how to rewrite them properly and cite your sources."

**Key Difference:** Learn a skill, not just avoid punishment.

### For Teachers

- **Saves time:** Automated feedback at scale
- **Consistent:** Same high-quality guidance for every student
- **Educational:** Students actually learn, not just copy-paste less
- **Privacy:** No student essays stored in external databases

### For Self-Learners

- **Free:** No subscription needed
- **Local-first:** Works offline
- **Transparent:** See exactly what was detected and why
- **Skill-building:** Improve your academic writing

## Comparison

| Feature | Turnitin | Grammarly | **PlagiarismCoach** |
|---------|----------|-----------|---------------------|
| Detects plagiarism | ✅ | ✅ | ✅ |
| Shows similarity % | ✅ | ✅ | ✅ |
| **Teaches paraphrasing** | ❌ | ❌ | **✅** |
| **Explains WHY** | ❌ | Partial | **✅** |
| **Guided improvement** | ❌ | ❌ | **✅** |
| **Growth tracking** | ❌ | ❌ | **Planned** |
| **Privacy-first** | ❌ | ❌ | **✅** |
| **Free & Open Source** | ❌ | ❌ | **✅** |

## Contributing

Contributions welcome! This project is in active development.

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Contribution areas:**
- Improve detection accuracy
- Add more citation formats
- Translate to other languages
- Write better educational content
- Improve UI/UX
- Add tests

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by the need for better educational tools
- Built with modern NLP and TypeScript
- Designed with student privacy in mind
- Philosophy: "Teach, don't punish"

## Support

- 🐛 **Bug reports:** [GitHub Issues](https://github.com/LanNguyenSi/plagiarism-coach/issues)
- 💡 **Feature requests:** [GitHub Discussions](https://github.com/LanNguyenSi/plagiarism-coach/discussions)
- 📧 **Email:** ice@openclaw.ai

---

**Built with ❄️ by Ice**

*"Every mistake is a learning opportunity, not a crime."*
