// @ts-ignore - citation-js doesn't have types
import { Cite } from 'citation-js';
import { Source } from '../models/types.js';

export class Citator {
  /**
   * Generate a citation for a source
   * @param source - Source to cite
   * @param format - Citation format (apa, mla, chicago)
   * @param type - Citation type (bibliography or in-text)
   * @returns Formatted citation
   */
  generate(
    source: Source,
    format: 'apa' | 'mla' | 'chicago' = 'apa',
    type: 'bibliography' | 'in-text' = 'bibliography'
  ): string {
    try {
      // Prepare citation data
      const citationData: any = {
        id: source.url,
        type: 'webpage',
        title: source.title,
        URL: source.url
      };
      
      // Add optional metadata
      if (source.metadata?.author) {
        citationData.author = [{ literal: source.metadata.author }];
      }
      
      if (source.metadata?.publishDate) {
        const date = new Date(source.metadata.publishDate);
        citationData.issued = {
          'date-parts': [[date.getFullYear(), date.getMonth() + 1, date.getDate()]]
        };
      }
      
      // Add access date (today)
      const today = new Date();
      citationData.accessed = {
        'date-parts': [[today.getFullYear(), today.getMonth() + 1, today.getDate()]]
      };
      
      // Create citation
      const cite = new Cite(citationData);
      
      // Format based on type
      if (type === 'bibliography') {
        return cite.format('bibliography', {
          format: 'text',
          template: format,
          lang: 'en-US'
        });
      } else {
        // In-text citation
        return cite.format('citation', {
          template: format,
          lang: 'en-US'
        });
      }
    } catch (error) {
      // Fallback: manual formatting
      return this.manualFormat(source, format, type);
    }
  }
  
  /**
   * Manual fallback formatting if citation-js fails
   */
  private manualFormat(
    source: Source,
    format: 'apa' | 'mla' | 'chicago',
    type: 'bibliography' | 'in-text'
  ): string {
    const author = source.metadata?.author || 'Unknown Author';
    const title = source.title;
    const url = source.url;
    const year = source.metadata?.publishDate 
      ? new Date(source.metadata.publishDate).getFullYear() 
      : new Date().getFullYear();
    
    if (format === 'apa') {
      if (type === 'bibliography') {
        return `${author}. (${year}). ${title}. Retrieved from ${url}`;
      } else {
        return `(${author}, ${year})`;
      }
    } else if (format === 'mla') {
      if (type === 'bibliography') {
        return `${author}. "${title}." Web. ${new Date().toLocaleDateString('en-US')}. <${url}>.`;
      } else {
        return `(${author})`;
      }
    } else { // chicago
      if (type === 'bibliography') {
        return `${author}. "${title}." Accessed ${new Date().toLocaleDateString('en-US')}. ${url}.`;
      } else {
        return `(${author}, ${year})`;
      }
    }
  }
  
  /**
   * Explain when and how to cite
   */
  explain(format: 'apa' | 'mla' | 'chicago'): string {
    const explanations = {
      apa: `**APA Format** (American Psychological Association):
      
**When to use**: Social sciences, education, psychology

**In-text citations**: (Author, Year) or Author (Year)
- Example: (Smith, 2023) or Smith (2023) found that...

**Bibliography (References)**:
- Format: Author, A. A. (Year). Title of work. Source.
- Example: Smith, J. (2023). Understanding plagiarism. Academic Press.

**Key points**:
- Author-date system
- Alphabetical order by author's last name
- Hanging indent for bibliography entries`,

      mla: `**MLA Format** (Modern Language Association):
      
**When to use**: Humanities, literature, arts

**In-text citations**: (Author Page) or (Author)
- Example: (Smith 42) or (Smith)

**Bibliography (Works Cited)**:
- Format: Author. "Title." Publication, Date, URL.
- Example: Smith, John. "Understanding Plagiarism." Academic Journal, 2023, www.example.com.

**Key points**:
- Author-page system
- Alphabetical order by author's last name
- Hanging indent for Works Cited entries`,

      chicago: `**Chicago Format** (Chicago Manual of Style):
      
**When to use**: History, some social sciences

**Two systems**:
1. **Notes-Bibliography**: Footnotes/endnotes + bibliography
2. **Author-Date**: Similar to APA

**Footnotes** (first reference):
- Format: Author, "Title," Publication (Date): Page.

**Bibliography**:
- Format: Author. "Title." Publication, Date.

**Key points**:
- Choose one system and stick with it
- Detailed source information
- Flexible formatting options`
    };
    
    return explanations[format];
  }
  
  /**
   * Determine if a claim needs citation
   */
  needsCitation(text: string): { needs: boolean; reason: string } {
    // Simple heuristics (can be improved)
    const lowerText = text.toLowerCase();
    
    // Check for factual claims that need citations
    if (lowerText.includes('studies show') || 
        lowerText.includes('research indicates') ||
        lowerText.includes('according to')) {
      return {
        needs: true,
        reason: "This refers to external research - cite the specific study or source."
      };
    }
    
    if (lowerText.includes('statistics') ||
        lowerText.includes('data') ||
        /\d+%/.test(text) ||
        /\d+ percent/.test(lowerText)) {
      return {
        needs: true,
        reason: "Statistics and data need a source - where did these numbers come from?"
      };
    }
    
    // Check for quotes
    if (text.includes('"') && text.split('"').length > 2) {
      return {
        needs: true,
        reason: "Direct quotes ALWAYS need citation - who said this?"
      };
    }
    
    // Probably doesn't need citation (common knowledge or original thought)
    return {
      needs: false,
      reason: "This appears to be common knowledge or your original analysis."
    };
  }
}
