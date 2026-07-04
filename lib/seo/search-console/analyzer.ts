import { GscRow } from './csv-importer';

/**
 * Normalizes a query for clustering.
 */
function normalizeQuery(query: string): string {
  if (!query) return '';
  const normalized = query.toLowerCase()
    .replace(/convert|calculator|how to|what is|in|to/g, ' ')
    .replace(/pounds|lbs/g, 'lb')
    .replace(/kilograms|kilos/g, 'kg')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized.split(' ').sort().join(' ');
}

export interface KeywordCluster {
  primaryKeyword: string;
  supportingKeywords: string[];
  landingPage: string | undefined;
  totalImpressions: number;
  totalClicks: number;
}

export function clusterKeywords(queries: GscRow[]): KeywordCluster[] {
  const clusters: Record<string, GscRow[]> = {};
  
  for (const row of queries) {
    if (!row.query) continue;
    const normalized = normalizeQuery(row.query);
    if (!clusters[normalized]) clusters[normalized] = [];
    clusters[normalized].push(row);
  }
  
  const result: KeywordCluster[] = [];
  for (const [, rows] of Object.entries(clusters)) {
    // Sort rows by impressions to find primary
    rows.sort((a, b) => b.impressions - a.impressions || a.query!.localeCompare(b.query!));
    const primary = rows[0];
    const totalImpressions = rows.reduce((acc, r) => acc + r.impressions, 0);
    const totalClicks = rows.reduce((acc, r) => acc + r.clicks, 0);
    
    result.push({
      primaryKeyword: primary.query!,
      supportingKeywords: rows.slice(1).map(r => r.query!),
      landingPage: primary.page,
      totalImpressions,
      totalClicks,
    });
  }
  
  return result;
}

export function scoreKeywordOpportunity(row: GscRow): number {
  let score = 0;
  
  if (row.impressions >= 1000) score += 50;
  else if (row.impressions >= 100) score += 20;
  
  if (row.position >= 4 && row.position <= 20) score += 30;
  if (row.ctr < 0.05 && row.position < 10) score += 20;
  
  return score;
}

export function scorePageOpportunity(page: string, queries: GscRow[]): {
  seoScore: number;
  opportunityScore: number;
  priority: string;
} {
  let totalImpressions = 0;
  let score = 0;
  
  for (const q of queries) {
    totalImpressions += q.impressions;
    if (q.position >= 4 && q.position <= 20) score += 10;
    if (q.ctr < 0.05 && q.position < 10) score += 10;
  }
  
  if (totalImpressions >= 5000) score += 50;
  else if (totalImpressions >= 1000) score += 30;
  
  let priority = 'Low';
  if (score >= 80) priority = 'Critical';
  else if (score >= 50) priority = 'High';
  else if (score >= 30) priority = 'Medium';
  
  return {
    seoScore: Math.min(100, score),
    opportunityScore: score,
    priority
  };
}

export function detectContentGap(query: string, pageContent: string): string[] {
  const recommendations: string[] = [];
  if (!query || !pageContent) return recommendations;
  
  const qWords = query.toLowerCase().split(' ').filter(w => w.length > 3 && !['what', 'how', 'when', 'the', 'and', 'for'].includes(w));
  for (const w of qWords) {
    if (!pageContent.toLowerCase().includes(w)) {
      recommendations.push(`Consider adding context around: "${w}"`);
    }
  }
  return recommendations;
}

export function recommendCtr(row: GscRow, currentTitle: string, currentDesc: string) {
  if (row.ctr < 0.03 && row.position < 10 && row.query) {
    return {
      currentTitle,
      suggestedTitle: `[Intent Match Needed] ${currentTitle}`,
      currentDescription: currentDesc,
      suggestedDescription: `[Include exact keyword "${row.query}"] ${currentDesc}`,
      reason: 'High position but abnormally low CTR. Snippet may not match search intent.',
      expectedImpact: 'Medium'
    };
  }
  return null;
}

export function recommendSnippet(row: GscRow): string | null {
  if (row.position >= 4 && row.position <= 15 && row.query) {
    const q = row.query.toLowerCase();
    if (q.includes('how')) return 'Ordered list (steps)';
    if (q.includes('vs') || q.includes('difference')) return 'Comparison Table';
    if (q.includes('what') || q.includes('define')) return 'Definition Paragraph (40-60 words)';
    return 'Quick Answer Box (formula or exact equivalence)';
  }
  return null;
}
