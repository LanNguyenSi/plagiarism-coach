# PlagiarismCoach - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLI Interface                            │
│  (Commander.js - check/cite/learn commands)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐          ┌─────────▼─────────┐
│  Detection     │          │   Coaching        │
│  Engine        │          │   Layer           │
├────────────────┤          ├───────────────────┤
│ - Similarity   │          │ - Rewriter        │
│ - Attribution  │          │ - Citator         │
│ - Scoring      │          │ - Feedback Gen    │
└───────┬────────┘          └─────────┬─────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
              ┌────────▼────────┐
              │   Report        │
              │   Generator     │
              └─────────────────┘
```

## Core Components

### 1. Detection Engine (`src/core/detector.ts`)

**Purpose:** Identify plagiarized passages with high accuracy.

**Approach: Hybrid Detection**

#### Level 1: Local Similarity (Fast, Free)
- **Algorithm:** TF-IDF (Term Frequency-Inverse Document Frequency)
- **Library:** `natural` npm package
- **How it works:**
  1. Tokenize text into sentences
  2. Calculate TF-IDF vectors for each sentence
  3. Compare against known corpus (if available)
  4. Similarity threshold: >70% = potential plagiarism

**Pros:**
- No API costs
- Fast (<1 second for 1000 words)
- Privacy-preserving (local-only)

**Cons:**
- Can't detect sources not in local corpus
- May miss paraphrased plagiarism

#### Level 2: Web Search (Comprehensive, API-based)
- **API:** Brave Search API (free tier: 2000 queries/month)
- **How it works:**
  1. Extract suspicious passages from Level 1
  2. Search for exact phrases on the web
  3. Identify top 3 most likely sources
  4. Calculate similarity to each source

**Pros:**
- Detects web-based plagiarism
- Finds original sources for attribution

**Cons:**
- API rate limits
- Requires internet connection

#### Implementation

```typescript
interface DetectionResult {
  passage: string;
  similarity: number;  // 0-100%
  sources: Source[];
  startIndex: number;
  endIndex: number;
}

interface Source {
  url: string;
  title: string;
  snippet: string;
  confidence: number;  // 0-100%
}

class Detector {
  async analyze(text: string, mode: 'local' | 'web' | 'hybrid'): Promise<DetectionResult[]> {
    const sentences = this.tokenize(text);
    
    // Level 1: Local similarity
    const localResults = await this.tfIdfAnalysis(sentences);
    
    if (mode === 'local') return localResults;
    
    // Level 2: Web search for high-similarity passages
    const webResults = await this.webSearch(
      localResults.filter(r => r.similarity > 70)
    );
    
    return this.mergeResults(localResults, webResults);
  }
  
  private tfIdfAnalysis(sentences: string[]): DetectionResult[] {
    // TF-IDF implementation using 'natural' library
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();
    
    sentences.forEach(s => tfidf.addDocument(s));
    
    // Compare each sentence against others
    // Return high-similarity matches
  }
  
  private async webSearch(passages: string[]): Promise<Source[]> {
    // Use Brave Search API to find sources
    const results = await Promise.all(
      passages.map(p => this.searchWeb(p))
    );
    
    return results.flat();
  }
}
```

### 2. Attribution Engine (`src/core/attributor.ts`)

**Purpose:** Find the original source of plagiarized text.

**Strategy:**

1. **Exact Match Search:**
   - Query Brave Search with suspicious passage
   - Look for exact phrase matches
   - Prioritize academic sources (`.edu`, `.gov`, Wikipedia)

2. **Citation Metadata Extraction:**
   - Parse web pages for author, date, title
   - Use Open Graph tags when available
   - Fallback: HTML `<title>` and `<meta>` tags

3. **Confidence Scoring:**
   - 100%: Exact match (>95% similarity)
   - 80%: High similarity (70-95%)
   - 50%: Possible source (<70%)

```typescript
interface AttributionResult {
  originalSource: Source;
  confidence: number;
  metadata: {
    author?: string;
    publishDate?: string;
    title: string;
    url: string;
  };
}

class Attributor {
  async findSource(passage: string): Promise<AttributionResult | null> {
    // 1. Search web for passage
    const searchResults = await this.searchWeb(passage);
    
    if (!searchResults.length) return null;
    
    // 2. Extract metadata from top result
    const topResult = searchResults[0];
    const metadata = await this.extractMetadata(topResult.url);
    
    // 3. Calculate confidence
    const confidence = this.calculateConfidence(passage, topResult.snippet);
    
    return {
      originalSource: topResult,
      confidence,
      metadata
    };
  }
  
  private async extractMetadata(url: string): Promise<Metadata> {
    // Fetch page and parse Open Graph tags
    // Fallback to HTML title/meta tags
  }
}
```

### 3. Rewriting Engine (`src/core/rewriter.ts`)

**Purpose:** Suggest paraphrasing improvements (NOT full rewrites).

**Approach: Progressive Hints (3 Levels)**

#### Level 1: Gentle Hint (Default)
```typescript
function generateHint(passage: string, similarity: number): string {
  if (similarity > 90) {
    return "💡 This passage is very close to the source. Try explaining it in your own words.";
  } else if (similarity > 70) {
    return "💡 This passage could be more distinct. How would you explain this to a friend?";
  }
  // ...
}
```

#### Level 2: Specific Guidance (On Request)
```typescript
function generateGuidance(passage: string, source: string): string {
  // Identify key concepts
  const keyConcepts = this.extractConcepts(source);
  
  // Suggest alternative phrasing
  return `
🎯 Focus on these key ideas:
${keyConcepts.map(c => `- ${c}`).join('\n')}

Questions to guide you:
- What's the main point?
- Can you use different words?
- How would YOU explain this?
  `;
}
```

#### Level 3: Example Paraphrase (Last Resort)
```typescript
async function generateExample(passage: string): Promise<string> {
  // Use AI API (Claude/GPT) to generate paraphrase
  const response = await this.callAI({
    prompt: `Paraphrase this passage while maintaining meaning:
    
"${passage}"

Requirements:
- Different sentence structure
- Different vocabulary
- Same core meaning
- Academic tone`,
    model: 'claude-sonnet-4'
  });
  
  return `📝 Example paraphrase:\n\n${response}\n\n⚠️ Don't copy this! Use it as inspiration to write YOUR version.`;
}
```

**Cost Management:**
- Levels 1-2: Template-based (free)
- Level 3: AI API (only when explicitly requested)
- Rate limit: 10 AI requests per session

### 4. Citation Engine (`src/core/citator.ts`)

**Purpose:** Generate proper citations in multiple formats.

**Library:** `citation-js` (supports APA, MLA, Chicago)

```typescript
import { Cite } from 'citation-js';

interface CitationOptions {
  format: 'apa' | 'mla' | 'chicago';
  type: 'bibliography' | 'in-text';
}

class Citator {
  generate(source: Source, options: CitationOptions): string {
    const citeData = new Cite({
      id: source.url,
      type: 'webpage',
      title: source.title,
      URL: source.url,
      author: source.metadata?.author,
      accessed: { 'date-parts': [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]] }
    });
    
    if (options.type === 'bibliography') {
      return citeData.format('bibliography', {
        format: 'text',
        template: options.format
      });
    } else {
      // In-text citation
      return citeData.format('citation', {
        template: options.format
      });
    }
  }
  
  explain(format: 'apa' | 'mla' | 'chicago'): string {
    // Return educational explanation of citation format
    const guides = {
      apa: "APA format: (Author, Year) for in-text, full reference in bibliography",
      mla: "MLA format: (Author Page) for in-text, Works Cited for bibliography",
      chicago: "Chicago format: Footnotes or (Author Year) for in-text"
    };
    
    return guides[format];
  }
}
```

### 5. Report Generator (`src/models/report.ts`)

**Purpose:** Create educational feedback reports.

**Output Formats:**
- Markdown (default, for terminal display)
- HTML (for web viewing)
- JSON (for programmatic use)

```typescript
interface Report {
  summary: ReportSummary;
  findings: Finding[];
  suggestions: Suggestion[];
  progress?: ProgressTracker;
}

interface Finding {
  passage: string;
  similarity: number;
  source: Source | null;
  feedback: {
    hint: string;
    guidance?: string;
    example?: string;
  };
  citation: string;
}

class ReportGenerator {
  generate(results: DetectionResult[], options: ReportOptions): Report {
    const findings = results.map(r => this.createFinding(r));
    
    return {
      summary: {
        totalPassages: results.length,
        highSimilarity: results.filter(r => r.similarity > 70).length,
        overallScore: this.calculateScore(results)
      },
      findings,
      suggestions: this.generateSuggestions(findings),
      progress: options.trackProgress ? this.loadProgress() : undefined
    };
  }
  
  formatMarkdown(report: Report): string {
    // Generate formatted Markdown report
    // Include colors, emojis, structured sections
  }
  
  formatHTML(report: Report): string {
    // Generate HTML with side-by-side comparison
    // Highlight differences, collapsible sections
  }
}
```

## CLI Interface (`src/cli/`)

### Commands

#### 1. `check` - Analyze text for plagiarism

```bash
plagiarism-coach check essay.txt [options]

Options:
  --format <type>     Citation format (apa|mla|chicago) [default: apa]
  --mode <mode>       Detection mode (local|web|hybrid) [default: hybrid]
  --output <file>     Save report to file
  --json              Output as JSON
  --help-level <n>    Feedback level (1=hint, 2=guidance, 3=example) [default: 1]
```

**Implementation:**

```typescript
import { Command } from 'commander';

const checkCommand = new Command('check')
  .description('Analyze text for plagiarism and provide feedback')
  .argument('<file>', 'Text file to analyze')
  .option('--format <type>', 'Citation format', 'apa')
  .option('--mode <mode>', 'Detection mode', 'hybrid')
  .option('--help-level <n>', 'Feedback level', '1')
  .action(async (file, options) => {
    const text = await fs.readFile(file, 'utf-8');
    
    const detector = new Detector();
    const results = await detector.analyze(text, options.mode);
    
    const reportGen = new ReportGenerator();
    const report = reportGen.generate(results, {
      citationFormat: options.format,
      helpLevel: parseInt(options.helpLevel)
    });
    
    console.log(reportGen.formatMarkdown(report));
  });
```

#### 2. `cite` - Generate citation for a source

```bash
plagiarism-coach cite <url> [options]

Options:
  --format <type>  Citation format (apa|mla|chicago) [default: apa]
  --type <type>    Citation type (bibliography|in-text) [default: bibliography]
```

#### 3. `learn` - Interactive tutorial

```bash
plagiarism-coach learn [topic]

Topics:
  paraphrasing   Learn how to paraphrase effectively
  citing         Learn when and how to cite
  formats        Learn citation formats (APA/MLA/Chicago)
```

## Data Flow

```
User Input (essay.txt)
    │
    ▼
[CLI: check command]
    │
    ▼
[Read file, preprocess text]
    │
    ▼
[Detector: TF-IDF analysis]
    │
    ├──> [High similarity passages] ──> [Attributor: Find sources]
    │                                         │
    │                                         ▼
    │                                   [Source metadata]
    │                                         │
    ▼                                         │
[Rewriter: Generate hints] <─────────────────┘
    │
    ▼
[Citator: Generate citations]
    │
    ▼
[ReportGenerator: Compile report]
    │
    ▼
[Output: Markdown/HTML/JSON]
```

## Dependencies

```json
{
  "dependencies": {
    "commander": "^11.0.0",      // CLI framework
    "citation-js": "^0.7.0",     // Citation formatter
    "natural": "^6.0.0",         // NLP (TF-IDF, tokenization)
    "cheerio": "^1.0.0-rc.12",   // HTML parsing (metadata extraction)
    "chalk": "^5.0.0",           // Terminal colors
    "ora": "^7.0.0",             // Spinners
    "marked": "^11.0.0",         // Markdown rendering
    "axios": "^1.6.0"            // HTTP requests (web search)
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@types/node": "^20.0.0",
    "@types/natural": "^5.0.0"
  }
}
```

## API Integrations

### Brave Search API (Optional, for web search)
- **Free Tier:** 2000 queries/month
- **Rate Limit:** 1 req/sec
- **Purpose:** Find original sources of plagiarized text

### Claude/GPT API (Optional, for paraphrasing hints)
- **Purpose:** Generate example paraphrases (Level 3 feedback only)
- **Cost Control:** Max 10 requests per session
- **Fallback:** Template-based hints if quota exceeded

## Error Handling

```typescript
class PlagiarismCoachError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public userMessage: string
  ) {
    super(message);
  }
}

enum ErrorCode {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  API_LIMIT_EXCEEDED = 'API_LIMIT_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT'
}

// Usage:
try {
  const results = await detector.analyze(text);
} catch (err) {
  if (err instanceof PlagiarismCoachError) {
    console.error(chalk.red(err.userMessage));
    
    if (err.code === ErrorCode.API_LIMIT_EXCEEDED) {
      console.log(chalk.yellow('💡 Try --mode local to avoid API calls'));
    }
  }
}
```

## Testing Strategy

### Unit Tests (`vitest`)
- Detector: TF-IDF accuracy
- Attributor: Metadata extraction
- Rewriter: Hint generation
- Citator: Citation format validation

### Integration Tests
- End-to-end CLI command tests
- Mock API responses
- Sample essay analysis

### Test Coverage Target: >80%

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Local detection (1000 words) | <2s | TF-IDF only |
| Web search (per passage) | <5s | Brave Search API |
| Full analysis (1000 words) | <10s | Hybrid mode |
| Citation generation | <100ms | Local library |

## Privacy & Security

1. **No Data Storage:** Essays are NOT saved to database
2. **Local-First:** Default mode works offline
3. **API Keys:** Stored in environment variables, never hardcoded
4. **No Telemetry:** No usage tracking or analytics

## Deployment

### Installation
```bash
npm install -g plagiarism-coach
```

### Configuration
```bash
# Optional: Set API keys for web search
export BRAVE_SEARCH_API_KEY="your_key_here"
export ANTHROPIC_API_KEY="your_key_here"  # For paraphrasing hints
```

### Usage
```bash
plagiarism-coach check my-essay.txt
```

---

**Author:** Ice 🧊  
**Status:** Technical Architecture v1.0  
**Last Updated:** 2026-03-18
