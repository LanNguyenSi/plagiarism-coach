import axios, { AxiosInstance } from 'axios';
import { Source } from '../models/types.js';

const BRAVE_SEARCH_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
const DEFAULT_RATE_LIMIT_MS = 1000;

type SleepFn = (ms: number) => Promise<void>;

export interface BraveSearchClientOptions {
  apiKey?: string;
  httpClient?: AxiosInstance;
  sleep?: SleepFn;
  rateLimitMs?: number;
}

export class BraveSearchClient {
  private readonly apiKey: string;
  private readonly httpClient: AxiosInstance;
  private readonly sleep: SleepFn;
  private readonly rateLimitMs: number;
  private lastRequestAt = 0;

  constructor(options: BraveSearchClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.BRAVE_SEARCH_API_KEY || '';
    this.httpClient = options.httpClient || axios.create();
    this.sleep = options.sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.rateLimitMs = options.rateLimitMs || DEFAULT_RATE_LIMIT_MS;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async search(query: string, maxResults = 3): Promise<Source[]> {
    if (!this.isConfigured()) {
      return [];
    }

    await this.enforceRateLimit();

    const response = await this.httpClient.get(BRAVE_SEARCH_ENDPOINT, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': this.apiKey
      },
      params: {
        q: query,
        count: maxResults,
        result_filter: 'web'
      }
    });

    const rawResults = response.data?.web?.results || response.data?.results || [];

    return rawResults
      .slice(0, maxResults)
      .map((result: any, index: number) => this.toSource(result, index))
      .filter((result: Source | null): result is Source => Boolean(result));
  }

  private async enforceRateLimit(): Promise<void> {
    if (!this.lastRequestAt) {
      this.lastRequestAt = Date.now();
      return;
    }

    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < this.rateLimitMs) {
      await this.sleep(this.rateLimitMs - elapsed);
    }

    this.lastRequestAt = Date.now();
  }

  private toSource(result: any, index: number): Source | null {
    const url = result?.url || result?.link;
    const title = result?.title;
    const snippet = result?.description || result?.snippet || '';

    if (!url || !title) {
      return null;
    }

    return {
      url,
      title,
      snippet,
      confidence: Math.max(50, 100 - index * 15),
      metadata: {
        domain: this.extractDomain(url)
      }
    };
  }

  private extractDomain(url: string): string | undefined {
    try {
      return new URL(url).hostname;
    } catch {
      return undefined;
    }
  }
}
