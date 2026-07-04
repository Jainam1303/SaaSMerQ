# MerQPrime Weekly SEO Workflow

Our SEO strategy is driven by data, not guesswork. This document outlines the weekly workflow for using the MerQPrime SEO Operating System to extract insights from Google Search Console (GSC).

## 1. Export Data from Google Search Console
1. Log in to Google Search Console.
2. Navigate to **Performance > Search results**.
3. Set the date range (e.g., Last 7 days or Last 28 days).
4. Click **Export** and download as a CSV.
5. Extract the `.csv` file (either `Queries.csv` or `Pages.csv`).

## 2. Run the Analyzers
Save the extracted CSV locally (e.g., `data/seo/latest-gsc.csv`). Then run the analysis engines:

```bash
# 1. Generate Hybrid Action Plan (Uses real project data + GSC data)
npx tsx scripts/seo-action-engine.ts data/seo/latest-gsc.csv

# 2. Track ranking history and position changes
node scripts/ranking-history.mjs data/seo/latest-gsc.csv

# 3. Analyze internal linking gaps
node scripts/internal-link-audit.mjs
node scripts/internal-link-intelligence.mjs
```

## 3. Review JSON Reports
The engines will output deterministic JSON reports in the `reports/` directory. These reports are the single source of truth.

- **`reports/todo.json`**: The prioritized weekly execution list for SEO tasks.
- **`reports/action-plan.json`**: Detailed evidence-backed analysis for every recommended task, checking real project data (like Quick Answer lengths, FAQ counts, Title lengths).
- **`reports/seo-opportunities.json`**: Keyword-level insights. Focus on keywords with high `opportunityScore`. Review the `keywordClusters` to consolidate pages or identify missing variants.
- **`reports/ranking-trends.json`**: Historical performance. See exactly which pages/queries moved up or down since the last snapshot. Focus on recovering drops and accelerating gains.
- **`reports/internal-link-opportunities.json`**: Internal linking gaps. Fix any pages marked as `Orphan page` or `Weakly linked`.

## 4. Implement Highest ROI Fixes
Review the `reports/todo.json` and execute tasks in priority order.

**SEO Rule #1: Every new SEO task must be justified with expected ROI. If optimizing an existing page is likely to produce more clicks than creating a new page, optimization takes priority.**

Never blindly execute recommendations. Verify them manually:
- Are the CTR title suggestions accurately matching the user intent?
- Are the internal links contextually relevant?
- Does adding a Featured Snippet answer box make sense for the query?

## 5. Measure Gains
Next week, export the GSC data again and run the pipeline. The `ranking-history.mjs` engine will automatically compare the new CSV against your previous snapshot, showing you the exact `position`, `clicks`, and `impressions` changes resulting from your work.
