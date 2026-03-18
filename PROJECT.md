# PlagiarismCoach - Educational Plagiarism Detection Tool

## Mission

**Teach students HOW to write and cite correctly, instead of just punishing them for plagiarism.**

Traditional plagiarism detection tools give a percentage score and mark copied text in red. Students learn "don't get caught" instead of "how to write properly". PlagiarismCoach is different: it's a **teaching tool** that provides constructive feedback and guidance.

## Problem Statement

**For Students:**
- Get punished for plagiarism without understanding WHY it's wrong
- Don't learn how to properly paraphrase or cite sources
- Fear-based approach ("don't plagiarize") instead of skill-building
- Wikipedia/ChatGPT temptation is high, proper citation is confusing

**For Teachers:**
- Detect plagiarism but can't scale personalized feedback
- Repetitive explanations of citation rules
- No time to teach EVERY student how to rewrite properly
- Focus on punishment instead of education

## Solution

PlagiarismCoach is an **educational CLI tool** that:

1. **Detects** plagiarized passages (like traditional tools)
2. **Explains** WHY each passage is problematic
3. **Teaches** how to paraphrase and cite correctly
4. **Guides** students step-by-step to improve their writing
5. **Tracks** improvement over time (learning curve)

### Key Differentiator

**NOT:** "This text is 85% plagiarized. Grade: F."  
**BUT:** "This paragraph is 95% identical to Wikipedia. Here's how to rewrite it in your own words: [specific suggestions]. Here's how to cite it properly: [citation example]."

## Target Users

**Primary:** High school and university students (15-25 years old)  
**Secondary:** Teachers who want to provide better feedback at scale  
**Tertiary:** Self-learners who want to improve their academic writing

## MVP Scope (Week 1)

### Core Features

1. **Text Similarity Detection**
   - Compare student text against known sources
   - Identify copied passages (sentence-level granularity)
   - Calculate similarity scores per passage

2. **Source Attribution**
   - Attempt to find original sources (web search)
   - Show WHERE the text was copied from
   - Context: "This sentence appears in 15 web sources"

3. **Rewriting Suggestions**
   - AI-powered paraphrasing hints (NOT full rewrites!)
   - Examples: "Instead of 'The photosynthesis process...', try 'Plants convert...'"
   - Vocabulary alternatives
   - Sentence structure variations

4. **Citation Guide**
   - Teach APA, MLA, Chicago citation formats
   - Generate proper citations for detected sources
   - Explain WHEN to cite (not just how)

5. **CLI Tool**
   - `plagiarism-coach check <file.txt>` - analyze text
   - `plagiarism-coach cite <url> --format apa` - generate citation
   - `plagiarism-coach learn` - interactive tutorial on paraphrasing
   - Output: Educational report (Markdown/HTML)

### Out of Scope (MVP)

- Web UI (CLI first)
- Real-time editing integration (VSCode extension, Google Docs addon)
- Plagiarism database (use public APIs)
- Multi-language support (English only for MVP)
- Advanced ML models (keep it simple)

## Tech Stack

### Language & Framework
- **TypeScript** - Type safety, maintainability
- **Node.js** - Cross-platform CLI
- **Commander.js** - CLI framework

### Core Components

1. **Detection Engine:**
   - **TF-IDF** for local similarity detection (no API needed)
   - **Copyscape API** or **Turnitin API** for web source matching (if budget allows)
   - Fallback: Simple n-gram matching

2. **Rewriting Assistant:**
   - **Claude/GPT API** for paraphrasing suggestions
   - Template-based hints (cost-effective)
   - Thesaurus integration (local dictionary)

3. **Citation Formatter:**
   - **citation-js** npm package (supports APA/MLA/Chicago)
   - Custom templates for edge cases

4. **Output:**
   - **Markdown** reports
   - **HTML** for rich formatting (optional)
   - **JSON** for programmatic use

### Dependencies
```json
{
  "dependencies": {
    "commander": "^11.0.0",
    "citation-js": "^0.7.0",
    "natural": "^6.0.0",  // NLP toolkit for text analysis
    "chalk": "^5.0.0",    // CLI colors
    "ora": "^7.0.0"       // Spinners/progress
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## Project Structure

```
plagiarism-coach/
├── src/
│   ├── cli/
│   │   ├── check.ts       # Main check command
│   │   ├── cite.ts        # Citation generator
│   │   ├── learn.ts       # Interactive tutorial
│   │   └── index.ts       # CLI entry point
│   ├── core/
│   │   ├── detector.ts    # Similarity detection
│   │   ├── attributor.ts  # Source attribution
│   │   ├── rewriter.ts    # Paraphrasing suggestions
│   │   └── citator.ts     # Citation formatter
│   ├── models/
│   │   ├── types.ts       # TypeScript interfaces
│   │   └── report.ts      # Report generator
│   └── utils/
│       ├── text.ts        # Text processing
│       └── api.ts         # External API clients
├── tests/
│   ├── detector.test.ts
│   ├── rewriter.test.ts
│   └── citator.test.ts
├── examples/
│   ├── sample-essay.txt   # Test input
│   └── sample-report.md   # Example output
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PEDAGOGY.md        # Educational philosophy
│   └── API.md             # API integration guide
├── package.json
├── tsconfig.json
└── README.md
```

## Timeline (7 Days)

**Day 1-2: Foundation**
- ✅ Repository setup
- ✅ PROJECT.md (this document)
- ✅ ARCHITECTURE.md (technical design)
- ✅ PEDAGOGY.md (educational approach)
- ✅ Basic TypeScript scaffolding
- ✅ CLI boilerplate (Commander.js)

**Day 3-4: Detection Engine**
- Implement TF-IDF similarity detection
- Integrate external API (Copyscape or fallback)
- Source attribution logic
- Unit tests for detection

**Day 5-6: Coaching Layer**
- AI-powered rewriting suggestions
- Citation formatter integration
- Educational feedback templates
- Report generator (Markdown output)

**Day 7: Polish & Ship**
- CLI refinement (UX, error handling)
- Documentation (README, examples)
- End-to-end testing
- GitHub release

## Success Metrics

**Technical:**
- ✅ Working CLI that accepts text input
- ✅ Detects copied passages with >80% accuracy
- ✅ Provides actionable rewriting suggestions
- ✅ Generates valid citations (APA/MLA)
- ✅ <5 second analysis time for 1000-word essay

**Educational:**
- Feedback is **constructive** (not just "this is plagiarized")
- Students understand **why** they need to cite
- Clear step-by-step guidance on **how** to improve
- Examples are specific to their text (not generic)

## Unique Value Proposition

**Existing tools:** "You plagiarized 45% of this essay. Bad student!"  
**PlagiarismCoach:** "Here are 3 passages that need citation. Let me show you how to rewrite them properly and cite your sources."

**Philosophy:** Mistakes are learning opportunities, not crimes.

## Open Questions

1. **API Costs:** Copyscape API pricing? Free alternatives?
2. **AI Integration:** Which model for paraphrasing? (Claude vs GPT vs local)
3. **Source Database:** Build our own or rely on external APIs?
4. **Accuracy:** What's acceptable similarity threshold? (50%? 70%?)
5. **Pedagogy:** Should we collaborate with actual teachers for validation?

## Next Steps

1. Research plagiarism detection APIs (costs, limits, accuracy)
2. Draft ARCHITECTURE.md (technical implementation)
3. Draft PEDAGOGY.md (educational framework)
4. Create GitHub Issues for each component
5. Build CLI skeleton (Commander.js setup)

---

**Project Lead:** Ice 🧊  
**Repo:** https://github.com/LanNguyenSi/plagiarism-coach  
**License:** MIT  
**Status:** Spec Phase (Day 1)
