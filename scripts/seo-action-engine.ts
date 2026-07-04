import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { parseGscCsvFile } from '../lib/seo/search-console/csv-importer';

// We can dynamically import the app's actual data to avoid regex scraping when possible
// Note: We use relative paths for the Node execution context
import { conversionPages } from '../lib/programmatic/conversions';
import { quantityConversionPages } from '../lib/programmatic/quantity-conversions';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'reports');
const DEFS_DIR = path.join(ROOT, "data/tools/definitions");
const BLOG_DIR = path.join(ROOT, "content/blog");
const GUIDES_DIR = path.join(ROOT, "content/guides");
const GRAPH_FILE = path.join(REPORTS_DIR, 'internal-link-graph.json');

// --- Helper Functions ---
function words(s: string): number {
  return (s ?? "").split(/\s+/).filter(Boolean).length;
}

// 1. Gather Real Project Data
const PROJECT_PAGES = new Map<string, any>();

// 1a. Load Conversions (Leaf)
for (const page of conversionPages) {
  PROJECT_PAGES.set(`/conversions/${page.slug}`, {
    type: 'conversion',
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    faqCount: page.faqs?.length ?? 0,
    quickAnswer: page.quickAnswer,
    quickAnswerWords: words(page.quickAnswer ?? ''),
    hasCtr: false
  });
}

// 1b. Load Conversions (Quantity)
for (const page of quantityConversionPages) {
  PROJECT_PAGES.set(page.path, {
    type: 'quantity',
    seoTitle: page.seoTitle,
    metaDescription: page.metaDescription,
    faqCount: page.faqs?.length ?? 0,
    quickAnswer: page.explanation, // Treated as quick answer
    quickAnswerWords: words(page.explanation ?? ''),
    hasCtr: false
  });
}

// 1c. Load Tools (Using regex since they are un-exported definitions)
if (fs.existsSync(DEFS_DIR)) {
  for (const file of fs.readdirSync(DEFS_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const raw = fs.readFileSync(path.join(DEFS_DIR, file), "utf8");
    const slug = raw.match(/slug:\s*"([^"]+)"/)?.[1];
    if (slug) {
      PROJECT_PAGES.set(`/tools/${slug}`, {
        type: 'tool',
        seoTitle: raw.match(/seoTitle:\s*\n?\s*"([^"]+)"/)?.[1],
        metaDescription: raw.match(/metaDescription:\s*\n?\s*"([^"]+)"/)?.[1],
        faqCount: (raw.match(/question:/g) ?? []).length,
        quickAnswerWords: 0,
        hasCtr: true
      });
    }
  }
}

// 1d. Load Markdown (Blogs/Guides)
function loadMd(dir: string, type: string, base: string) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
    PROJECT_PAGES.set(`${base}/${slug}`, {
      type,
      seoTitle: data.seoTitle ?? data.title,
      metaDescription: data.metaDescription ?? data.description,
      faqCount: (data.faqs ?? []).length,
      quickAnswerWords: 0,
      hasCtr: true
    });
  }
}
loadMd(BLOG_DIR, 'blog', '/blog');
loadMd(GUIDES_DIR, 'guide', '/guides');

// 2. Load Internal Link Graph
let linkGraph: any = null;
const linkCounts = new Map<string, number>();
if (fs.existsSync(GRAPH_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf8'));
    linkGraph = data.graph;
    const allNodes = [...(linkGraph.hubs || []), ...(linkGraph.tools || []), ...(linkGraph.blogs || [])];
    for (const node of allNodes) {
      const outbound = [
        ...(node.outbound.tools || []),
        ...(node.outbound.blogs || []),
        ...(node.outbound.hubs || []),
        ...(node.outbound.categories || []),
        node.outbound.primaryTool
      ].filter(Boolean);
      for (const link of outbound) {
        linkCounts.set(link, (linkCounts.get(link) ?? 0) + 1);
      }
    }
  } catch (e) {}
}

// --- Action Engine ---
export function analyzePage(pageData: any, gscRow: any): any {
  const tasks = [];
  let problem = "";
  let reason = "";
  let time = "15 min";
  let impact = "Low";
  let confidence = 50;

  // Real Project Data Evidence
  const title = pageData?.seoTitle ?? '';
  const desc = pageData?.metaDescription ?? '';
  const qaWords = pageData?.quickAnswerWords ?? 0;
  const faqCount = pageData?.faqCount ?? 0;
  const inLinks = linkCounts.get(gscRow.page) ?? 0;
  const pos = gscRow.position;
  const imp = gscRow.impressions;
  const ctr = gscRow.ctr;

  const evidences = [];

  // Title Checks
  if (title.length > 0 && (title.length < 30 || title.length > 60)) {
    evidences.push(`Current title: ${title.length} characters\nRecommended: 55–60`);
    tasks.push({ action: 'Rewrite title', time: '5 min', impact: 'High', confidence: 95 });
  }

  // Quick Answer Checks (Only applicable for conversions/quantity pages)
  if (['conversion', 'quantity'].includes(pageData?.type)) {
    if (qaWords === 0) {
      evidences.push(`Quick Answer: Missing\nRecommended: 40-60 words directly under H1`);
      tasks.push({ action: 'Add Quick Answer block', time: '15 min', impact: 'High', confidence: 90 });
    } else if (qaWords > 70) {
      evidences.push(`Quick Answer: ${qaWords} words\nRecommended: 40–60 words`);
      tasks.push({ action: 'Reduce Quick Answer to 40–60 words', time: '10 min', impact: 'Medium', confidence: 85 });
    }
  }

  // FAQ Checks
  if (faqCount < 4) {
    evidences.push(`Current FAQ count: ${faqCount}\nRecommended: >= 4`);
    tasks.push({ action: 'Expand FAQ coverage', time: '30 min', impact: 'Medium', confidence: 80 });
  }

  // Link Checks
  if (inLinks < 3) {
    evidences.push(`Current incoming links: ${inLinks}\nRecommended: >= 5`);
    tasks.push({ action: 'Add internal links from related hubs/blogs', time: '15 min', impact: 'High', confidence: 95 });
  }

  // Heuristic Checks based on GSC Data
  if (ctr < 0.03 && pos < 5) {
    problem = "High position but exceptionally low CTR.";
    reason = "Search intent mismatch or competitor snippet dominance. Evidence indicates title may not contain the exact computed answer the user wants.";
    tasks.push({ action: 'Add computed answer directly to SEO Title', time: '5 min', impact: 'Very High', confidence: 85 });
  } else if (imp > 500 && pos > 10) {
    problem = "High impressions but stuck on Page 2+.";
    reason = "Page lacks sufficient topical authority or internal pagerank.";
    if (inLinks >= 3) {
      tasks.push({ action: 'Increase semantic depth (add 200+ words of content)', time: '1 hour', impact: 'High', confidence: 70 });
    }
  }

  if (tasks.length === 0) return null;

  // Aggregate
  const sortedTasks = tasks.sort((a, b) => b.confidence - a.confidence);
  const primaryTask = sortedTasks[0];
  
  if (!problem) problem = "Suboptimal on-page signals reducing ranking potential.";
  if (!reason) reason = "Specific technical or content thresholds are not met based on repository data.";

  return {
    page: gscRow.page,
    query: gscRow.query,
    currentPosition: Number(pos.toFixed(1)),
    currentClicks: gscRow.clicks,
    currentImpressions: imp,
    problem,
    reason,
    evidence: evidences.join('\n\n----------------------------------------------------------\n\n'),
    tasks: sortedTasks.map(t => t.action),
    estimatedTime: primaryTask.time,
    expectedImpact: primaryTask.impact,
    confidenceScore: primaryTask.confidence
  };
}

// --- Main CLI ---
const args = process.argv.slice(2);
const inputPath = args[0] || 'data/seo/gsc-export.csv';

let csvContent = '';
if (fs.existsSync(inputPath)) {
  csvContent = fs.readFileSync(inputPath, 'utf8');
}

const rows = csvContent ? parseGscCsvFile(inputPath) : [];

// We group by page to avoid duplicate page recommendations
const pageMap = new Map();
for (const row of rows) {
  if (row.page) {
    if (!pageMap.has(row.page)) pageMap.set(row.page, { page: row.page, clicks: 0, impressions: 0, position: 0, count: 0, topQuery: row.query });
    const p = pageMap.get(row.page);
    p.clicks += row.clicks;
    p.impressions += row.impressions;
    p.position += row.position;
    p.count += 1;
    if (row.impressions > (pageMap.get(row.page).topQueryImp || 0)) {
      p.topQuery = row.query;
      p.topQueryImp = row.impressions;
    }
  }
}

const actionPlan: any[] = [];
const todos: any[] = [];

for (const [pageUrl, stats] of pageMap.entries()) {
  stats.position = stats.position / stats.count; // avg
  const localData = PROJECT_PAGES.get(pageUrl);
  
  // We only run action engine on pages we have in the repo
  if (localData) {
    const action = analyzePage(localData, { ...stats, query: stats.topQuery });
    if (action) {
      // Calculate a priority score
      let priorityScore = 0;
      if (stats.impressions > 1000) priorityScore += 50;
      if (stats.position >= 4 && stats.position <= 20) priorityScore += 30;
      if (action.expectedImpact === 'Very High') priorityScore += 40;
      if (action.expectedImpact === 'High') priorityScore += 20;
      
      action.priorityScore = priorityScore;
      actionPlan.push(action);
    }
  }
}

// Deterministic Sort
actionPlan.sort((a, b) => b.priorityScore - a.priorityScore || b.currentImpressions - a.currentImpressions || a.page.localeCompare(b.page));

// Format for output
const finalActionPlan = actionPlan.map((a, i) => {
  const res = {
    Priority: `#${i + 1}`,
    Page: a.page,
    Keyword: a.query || 'N/A',
    CurrentPosition: a.currentPosition,
    CurrentClicks: a.currentClicks,
    CurrentImpressions: a.currentImpressions,
    Problem: a.problem,
    Reason: a.reason,
    Evidence: a.evidence,
    Tasks: a.tasks,
    EstimatedTime: a.estimatedTime,
    ExpectedImpact: a.expectedImpact,
    ConfidenceScore: `${a.confidenceScore}%`
  };
  
  todos.push({
    priority: i + 1,
    page: a.page,
    estimatedTime: a.estimatedTime,
    impact: a.expectedImpact,
    confidence: a.confidenceScore,
    tasks: a.tasks
  });
  
  return res;
});

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORTS_DIR, 'action-plan.json'), JSON.stringify(finalActionPlan, null, 2));
fs.writeFileSync(path.join(REPORTS_DIR, 'todo.json'), JSON.stringify(todos, null, 2));

console.log(`✔ Generated reports/action-plan.json (${finalActionPlan.length} action plans)`);
console.log(`✔ Generated reports/todo.json (${todos.length} todos)`);
