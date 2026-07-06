import { PageData } from '../data-loader';

export function normalizeEntity(str: string): string {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .replace(/\b(lbs|pounds)\b/g, 'lb')
    .replace(/\b(kgs|kilograms)\b/g, 'kg')
    .replace(/\b(mins|minutes)\b/g, 'min')
    .replace(/\b(secs|seconds)\b/g, 'sec')
    .replace(/s\b/g, '') // naive singularization
    .trim();
}

export function detectContentGap(pageData: PageData, queries: string[]): string[] {
  const gaps: string[] = [];
  const contentTokens = new Set(normalizeEntity(pageData.content).split(/\s+/));
  
  for (const query of queries) {
    const normalizedQuery = normalizeEntity(query);
    const queryTokens = normalizedQuery.split(/\s+/);
    
    // Check if any major token of the query is missing from the content
    const missingTokens = queryTokens.filter(t => t.length > 2 && !contentTokens.has(t));
    if (missingTokens.length > 0) {
      gaps.push(`Missing entity/variant: "${missingTokens.join(' ')}" (from query "${query}")`);
    }
  }
  
  return gaps;
}
