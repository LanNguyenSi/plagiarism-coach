import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { Source, SourceMetadata } from '../models/types.js';
import { BraveSearchClient } from '../utils/api.js';

export interface AttributionResult {
  originalSource: Source;
  confidence: number;
  metadata: SourceMetadata;
}

export interface AttributorOptions {
  searchClient?: BraveSearchClient;
  httpClient?: AxiosInstance;
}

export class Attributor {
  private readonly searchClient: BraveSearchClient;
  private readonly httpClient: AxiosInstance;

  constructor(options: AttributorOptions = {}) {
    this.searchClient = options.searchClient || new BraveSearchClient();
    this.httpClient = options.httpClient || axios.create();
  }

  async findSources(passage: string, maxResults = 3): Promise<Source[]> {
    const searchResults = await this.searchClient.search(this.buildQuery(passage), maxResults);

    if (!searchResults.length) {
      return [];
    }

    const enriched = await Promise.all(
      searchResults.map(async (result) => {
        try {
          const metadata = await this.extractMetadata(result.url);
          return {
            ...result,
            confidence: this.calculateConfidence(passage, result.snippet, result.confidence),
            metadata: {
              ...result.metadata,
              ...metadata
            }
          };
        } catch {
          return {
            ...result,
            confidence: this.calculateConfidence(passage, result.snippet, result.confidence)
          };
        }
      })
    );

    return enriched;
  }

  async findSource(passage: string): Promise<AttributionResult | null> {
    const [topResult] = await this.findSources(passage, 1);
    if (!topResult) {
      return null;
    }

    return {
      originalSource: topResult,
      confidence: topResult.confidence,
      metadata: topResult.metadata || {}
    };
  }

  async extractMetadata(url: string): Promise<SourceMetadata> {
    const response = await this.httpClient.get(url, {
      responseType: 'text',
      headers: {
        'User-Agent': 'plagiarism-coach/0.1.0'
      }
    });

    const $ = cheerio.load(String(response.data || ''));

    return {
      author: this.firstContent($, [
        'meta[property="article:author"]',
        'meta[name="author"]',
        'meta[property="og:author"]'
      ]),
      publishDate: this.firstContent($, [
        'meta[property="article:published_time"]',
        'meta[name="pubdate"]',
        'meta[name="publish-date"]',
        'meta[name="date"]'
      ]),
      domain: this.extractDomain(url)
    };
  }

  private buildQuery(passage: string): string {
    const normalized = passage.trim().replace(/\s+/g, ' ');
    return normalized.length > 140 ? `"${normalized.slice(0, 140)}"` : `"${normalized}"`;
  }

  private calculateConfidence(passage: string, snippet: string, baseConfidence: number): number {
    const passageWords = this.normalizedWords(passage);
    const snippetWords = this.normalizedWords(snippet);

    if (!passageWords.length || !snippetWords.length) {
      return baseConfidence;
    }

    const overlap = passageWords.filter((word) => snippetWords.includes(word)).length;
    const overlapRatio = overlap / Math.max(passageWords.length, 1);
    const adjusted = Math.round((baseConfidence * 0.6) + (overlapRatio * 40));

    return Math.max(40, Math.min(100, adjusted));
  }

  private normalizedWords(value: string): string[] {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  private firstContent($: cheerio.CheerioAPI, selectors: string[]): string | undefined {
    for (const selector of selectors) {
      const value = $(selector).attr('content')?.trim();
      if (value) {
        return value;
      }
    }
    return undefined;
  }

  private extractDomain(url: string): string | undefined {
    try {
      return new URL(url).hostname;
    } catch {
      return undefined;
    }
  }
}
