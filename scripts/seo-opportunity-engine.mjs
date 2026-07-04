import fs from 'node:fs';
import path from 'node:path';

// --- Reusable logic matching lib/seo/search-console ---
function parseGscCsv(csvContent) {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i+1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const val = values[j] ?? '';
      
      if (['clicks', 'impressions'].includes(header)) {
        row[header] = parseInt(val.replace(/,/g, ''), 10) || 0;
      } else if (header === 'ctr') {
        row.ctr = parseFloat(val.replace('%', '')) / 100 || 0;
      } else if (header === 'position') {
        row.position = parseFloat(val) || 0;
      } else if (header === 'top queries') {
        row.query = val;
      } else if (header === 'top pages') {
        row.page = val;
      } else {
        row[header] = val;
      }
    }
    row.clicks = row.clicks ?? 0;
    row.impressions = row.impressions ?? 0;
    row.ctr = row.ctr ?? 0;
    row.position = row.position ?? 0;
    rows.push(row);
  }
  return rows;
}

function normalizeQuery(query) {
  if (!query) return '';
  let normalized = query.toLowerCase()
    .replace(/convert|calculator|how to|what is|in|to/g, ' ')
    .replace(/pounds|lbs/g, 'lb')
    .replace(/kilograms|kilos/g, 'kg')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.split(' ').sort().join(' ');
}

function clusterKeywords(queries) {
  const clusters = {};
  for (const row of queries) {
    if (!row.query) continue;
    const normalized = normalizeQuery(row.query);
    if (!clusters[normalized]) clusters[normalized] = [];
    clusters[normalized].push(row);
  }
  
  const result = [];
  for (const rows of Object.values(clusters)) {
    rows.sort((a, b) => b.impressions - a.impressions || a.query.localeCompare(b.query));
    const primary = rows[0];
    result.push({
      primaryKeyword: primary.query,
      supportingKeywords: rows.slice(1).map(r => r.query).sort(),
      landingPage: primary.page,
      totalImpressions: rows.reduce((acc, r) => acc + r.impressions, 0),
      totalClicks: rows.reduce((acc, r) => acc + r.clicks, 0),
    });
  }
  return result;
}

function scoreOpportunity(row) {
  let score = 0;
  if (row.impressions >= 1000) score += 50;
  else if (row.impressions >= 100) score += 20;
  
  if (row.position >= 4 && row.position <= 20) score += 30;
  if (row.ctr < 0.05 && row.position < 10) score += 20;
  return score;
}

function recommendSnippet(row) {
  if (row.position >= 4 && row.position <= 15 && row.query) {
    const q = row.query.toLowerCase();
    if (q.includes('how')) return 'Ordered list (steps)';
    if (q.includes('vs') || q.includes('difference')) return 'Comparison Table';
    if (q.includes('what') || q.includes('define')) return 'Definition Paragraph (40-60 words)';
    return 'Quick Answer Box (formula or exact equivalence)';
  }
  return null;
}

// --- Main execution ---
const args = process.argv.slice(2);
const inputPath = args[0] || 'data/seo/gsc-export.csv';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'reports');

let csvContent = '';
if (fs.existsSync(inputPath)) {
  csvContent = fs.readFileSync(inputPath, 'utf8');
} else {
  console.log(`No CSV found at ${inputPath}. Generating empty reports to ensure deterministic structure.`);
}

const rows = csvContent ? parseGscCsv(csvContent) : [];

// 1. Keyword Opportunities
const queryRows = rows.filter(r => r.query);
const keywordOpportunities = queryRows.map(row => {
  return {
    query: row.query,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
    opportunityScore: scoreOpportunity(row),
    snippetRecommendation: recommendSnippet(row)
  };
}).filter(r => r.opportunityScore > 0);

// Sort deterministically: Opportunity Score DESC, Impressions DESC, Position ASC, Query ASC
keywordOpportunities.sort((a, b) => {
  if (b.opportunityScore !== a.opportunityScore) return b.opportunityScore - a.opportunityScore;
  if (b.impressions !== a.impressions) return b.impressions - a.impressions;
  if (a.position !== b.position) return a.position - b.position;
  return a.query.localeCompare(b.query);
});

// 2. Keyword Clustering
const clusters = clusterKeywords(queryRows);
clusters.sort((a, b) => b.totalImpressions - a.totalImpressions || a.primaryKeyword.localeCompare(b.primaryKeyword));

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORTS_DIR, 'seo-opportunities.json'), JSON.stringify({
  keywordOpportunities,
  keywordClusters: clusters
}, null, 2));


// 3. Page Opportunities
const pageRows = rows.filter(r => r.page);
const pageMap = {};
for (const row of pageRows) {
  if (!pageMap[row.page]) {
    pageMap[row.page] = { page: row.page, clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 };
  }
  pageMap[row.page].clicks += row.clicks;
  pageMap[row.page].impressions += row.impressions;
  pageMap[row.page].position += row.position;
  pageMap[row.page].count += 1;
}

const pageOpportunities = Object.values(pageMap).map(p => {
  const avgPos = p.position / p.count;
  const ctr = p.impressions > 0 ? (p.clicks / p.impressions) : 0;
  
  let score = 0;
  if (p.impressions >= 5000) score += 50;
  else if (p.impressions >= 1000) score += 30;
  
  if (avgPos >= 4 && avgPos <= 20) score += 20;
  if (ctr < 0.05 && avgPos < 10) score += 20;
  
  let priority = 'Low';
  if (score >= 80) priority = 'Critical';
  else if (score >= 50) priority = 'High';
  else if (score >= 30) priority = 'Medium';
  
  return {
    page: p.page,
    clicks: p.clicks,
    impressions: p.impressions,
    ctr,
    averagePosition: avgPos,
    opportunityScore: score,
    priority,
    ctrRecommendations: score > 30 ? ['Consider adding primary keyword to title tag', 'Improve meta description intent match'] : [],
    internalLinkingSuggestions: ['Link from related category hub', 'Add to homepage popular tools (if applicable)'],
  };
}).filter(r => r.opportunityScore > 0);

pageOpportunities.sort((a, b) => {
  if (b.opportunityScore !== a.opportunityScore) return b.opportunityScore - a.opportunityScore;
  if (b.impressions !== a.impressions) return b.impressions - a.impressions;
  if (a.averagePosition !== b.averagePosition) return a.averagePosition - b.averagePosition;
  return a.page.localeCompare(b.page);
});

fs.writeFileSync(path.join(REPORTS_DIR, 'page-opportunities.json'), JSON.stringify({
  pageOpportunities
}, null, 2));

console.log("✔ Generated reports/seo-opportunities.json");
console.log("✔ Generated reports/page-opportunities.json");
