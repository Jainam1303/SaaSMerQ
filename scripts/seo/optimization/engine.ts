import fs from 'node:fs';
import path from 'node:path';
import { loadProjectPages, loadGscData, loadLinkGraph } from './data-loader';
import { computeBenchmarks, getBenchmarkForPosition, computeContentBenchmarks } from './stages/benchmarks';
import { auditSchema } from './stages/schema-audit';
import { detectContentGap } from './stages/content-gap';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'reports');

const args = process.argv.slice(2);
const inputPath = args[0] || 'data/seo/gsc-export.csv';

function main() {
  const rows = loadGscData(inputPath);
  if (rows.length === 0) {
    console.error(`No data found at ${inputPath}`);
    process.exit(1);
  }

  const projectPages = loadProjectPages();
  const linkGraph = loadLinkGraph();

  // Aggregate GSC data by page
  const pageMap = new Map<string, any>();
  const queryMap = new Map<string, string[]>(); // page -> queries

  for (const row of rows) {
    if (row.page) {
      if (!pageMap.has(row.page)) {
        pageMap.set(row.page, { page: row.page, clicks: 0, impressions: 0, position: 0, count: 0 });
        queryMap.set(row.page, []);
      }
      const p = pageMap.get(row.page);
      p.clicks += row.clicks;
      p.impressions += row.impressions;
      p.position += row.position;
      p.count += 1;
      if (row.query) {
        queryMap.get(row.page)!.push(row.query);
        if (row.impressions > (p.topQueryImp || 0)) {
          p.topQuery = row.query;
          p.topQueryImp = row.impressions;
        }
      }
    }
  }

  // Pre-calculate benchmarks
  const ctrBenchmarks = computeBenchmarks(pageMap);
  const contentBenchmarks = computeContentBenchmarks(pageMap, projectPages);

  // Identify top impressions for normalization
  const sortedImpressions = Array.from(pageMap.values()).map(p => p.impressions).sort((a, b) => a - b);
  const percentile95Imp = sortedImpressions[Math.floor(sortedImpressions.length * 0.95)] || 1;

  // Track cannibalization
  const keywordToPages = new Map<string, string[]>();
  for (const row of rows) {
    if (row.query && row.page) {
      if (!keywordToPages.has(row.query)) keywordToPages.set(row.query, []);
      const pagesForQuery = keywordToPages.get(row.query)!;
      if (!pagesForQuery.includes(row.page)) pagesForQuery.push(row.page);
    }
  }

  const allRecommendations: any[] = [];
  const quickWins: any[] = [];
  const noAction: any[] = [];
  const scorecard = {
    pagesAnalyzed: 0,
    totalImpressionsAnalyzed: 0,
    cannibalizedKeywords: 0,
    missingSchemas: 0,
    contentGapsDetected: 0
  };

  for (const [pageUrl, stats] of pageMap.entries()) {
    stats.position = stats.position / stats.count; // avg position
    const localData = projectPages.get(pageUrl);
    
    if (!localData) continue; // Only process pages we actually have in repo

    scorecard.pagesAnalyzed++;
    scorecard.totalImpressionsAnalyzed += stats.impressions;

    const evidences: string[] = [];
    const tasks: any[] = [];
    let problem = "Suboptimal on-page signals reducing ranking potential.";
    let reason = "Specific technical or content thresholds are not met based on repository data.";

    // Determine Intent Score
    let intentScore = 20;
    if (['conversion', 'quantity', 'tool'].includes(localData.type)) intentScore = 100;
    else if (['blog', 'guide'].includes(localData.type)) intentScore = 60;

    // Determine CTR Opportunity
    const currentCtr = stats.impressions > 0 ? stats.clicks / stats.impressions : 0;
    const bucketBenchmark = getBenchmarkForPosition(stats.position, ctrBenchmarks);
    const ctrDeficit = bucketBenchmark - currentCtr;
    
    // Determine Position Opportunity
    // Higher score if closer to pos 4. Pos 1-3 has 0 opportunity to move up easily.
    let posOppScore = 0;
    if (stats.position > 3 && stats.position <= 15) {
      posOppScore = (15 - stats.position) / 11; // 0 to 1 scale
    }

    // Determine Impressions Score
    const impScore = Math.min(stats.impressions / percentile95Imp, 1);

    // Calculate Final Priority Score (0-100)
    // 40% Imp, 30% Pos Opp, 20% CTR Opp (if > 0, scale it to max 0.05 diff for score 1), 10% Intent
    const ctrOppScore = Math.min(Math.max(ctrDeficit, 0) / 0.05, 1);
    const priorityScore = Math.round(
      (impScore * 40) + 
      (posOppScore * 30) + 
      (ctrOppScore * 20) + 
      ((intentScore / 100) * 10)
    );

    // Calculate Estimated Click Gain
    const estimatedClickGain = ctrDeficit > 0 ? Math.ceil(stats.impressions * ctrDeficit) : 0;

    // Cannibalization Check
    const cannibalized = keywordToPages.get(stats.topQuery)?.filter(p => p !== pageUrl);
    if (cannibalized && cannibalized.length > 0) {
      evidences.push(`Cannibalization detected: "${stats.topQuery}" also ranks for ${cannibalized.join(', ')}`);
      tasks.push({ action: 'Consolidate content or set canonical tag', confidence: 95, time: '15 min' });
      scorecard.cannibalizedKeywords++;
    }

    // Schema Audit
    const missingSchemas = auditSchema(localData);
    if (missingSchemas.length > 0) {
      evidences.push(`Missing schemas: ${missingSchemas.join(', ')}`);
      tasks.push({ action: `Inject missing schemas: ${missingSchemas.join(', ')}`, confidence: 100, time: '10 min' });
      scorecard.missingSchemas++;
    }

    // Content Gap
    const queriesForPage = Array.from(new Set(queryMap.get(pageUrl) || [])).slice(0, 5); // top 5 queries
    const gaps = detectContentGap(localData, queriesForPage);
    if (gaps.length > 0) {
      evidences.push(gaps.join('\n'));
      tasks.push({ action: 'Integrate missing entities into content', confidence: 85, time: '30 min' });
      scorecard.contentGapsDetected++;
    }

    // Quick Answer
    if (['conversion', 'quantity'].includes(localData.type)) {
      if (localData.quickAnswerWords === 0) {
        evidences.push(`Quick Answer: Missing\nRecommended: ~${contentBenchmarks.qaWords} words (Avg of Top pages)`);
        tasks.push({ action: 'Add Quick Answer block', confidence: 90, time: '15 min' });
      }
    }

    // FAQ
    if (localData.faqCount < contentBenchmarks.faqCount) {
      evidences.push(`Current FAQ count: ${localData.faqCount}\nRecommended: >= ${contentBenchmarks.faqCount} (Avg of Top pages)`);
      tasks.push({ action: 'Expand FAQ coverage', confidence: 80, time: '30 min' });
    }

    // Title Length
    if (localData.seoTitle.length > 0 && Math.abs(localData.seoTitle.length - contentBenchmarks.titleLength) > 15) {
      evidences.push(`Current title: ${localData.seoTitle.length} chars\nRecommended: ~${contentBenchmarks.titleLength} (Avg of High CTR pages)`);
      tasks.push({ action: 'Rewrite title', confidence: 90, time: '5 min' });
    }

    if (tasks.length === 0) continue;

    const sortedTasks = tasks.sort((a, b) => b.confidence - a.confidence);
    const primaryTask = sortedTasks[0];

    const recommendation = {
      url: pageUrl,
      keyword: stats.topQuery,
      currentMetrics: {
        position: Number(stats.position.toFixed(1)),
        impressions: stats.impressions,
        clicks: stats.clicks,
        ctr: Number((currentCtr * 100).toFixed(2)) + '%'
      },
      benchmark: {
        targetCtr: Number((bucketBenchmark * 100).toFixed(2)) + '%',
        bucket: stats.position <= 3 ? '1-3' : stats.position <= 6 ? '4-6' : stats.position <= 10 ? '7-10' : stats.position <= 20 ? '11-20' : '21+'
      },
      evidence: evidences,
      reason,
      recommendation: sortedTasks.map(t => t.action),
      confidence: primaryTask.confidence >= 90 ? 'High' : primaryTask.confidence >= 80 ? 'Medium' : 'Low',
      estimatedImplementationTime: primaryTask.time,
      priorityScore,
      expectedImpact: estimatedClickGain > 0 ? `+${estimatedClickGain} clicks/mo` : 'Ranking Stability'
    };

    allRecommendations.push(recommendation);

    // Bucket routing
    if (stats.position >= 4 && stats.position <= 10 && stats.impressions > 500 && currentCtr < bucketBenchmark) {
      quickWins.push(recommendation);
    } else if (stats.position <= 3 && currentCtr >= bucketBenchmark) {
      noAction.push(recommendation);
    }
  }

  // Sort Full List
  allRecommendations.sort((a, b) => b.priorityScore - a.priorityScore);
  quickWins.sort((a, b) => b.priorityScore - a.priorityScore);
  
  const weeklyPlan = allRecommendations.slice(0, 20);

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.mkdirSync(path.join(REPORTS_DIR, 'history'), { recursive: true });

  fs.writeFileSync(path.join(REPORTS_DIR, 'optimization-priority.json'), JSON.stringify(allRecommendations, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'weekly-seo-plan.json'), JSON.stringify(weeklyPlan, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'quick-wins.json'), JSON.stringify(quickWins, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'no-action.json'), JSON.stringify(noAction, null, 2));
  fs.writeFileSync(path.join(REPORTS_DIR, 'seo-scorecard.json'), JSON.stringify(scorecard, null, 2));

  // History snapshot
  const dateStr = new Date().toISOString().split('T')[0];
  fs.writeFileSync(path.join(REPORTS_DIR, 'history', `${dateStr}.json`), JSON.stringify(allRecommendations, null, 2));

  console.log(`✔ Generated reports/optimization-priority.json (${allRecommendations.length} recommendations)`);
  console.log(`✔ Generated reports/weekly-seo-plan.json (${weeklyPlan.length} top tasks)`);
  console.log(`✔ Generated reports/quick-wins.json (${quickWins.length} targets)`);
  console.log(`✔ Generated reports/no-action.json (${noAction.length} stable pages)`);
  console.log(`✔ Generated reports/seo-scorecard.json`);
}

main();
