export interface CtrBenchmarks {
  bucket1_3: number;
  bucket4_6: number;
  bucket7_10: number;
  bucket11_20: number;
  bucket21_plus: number;
}

export function computeBenchmarks(pageMap: Map<string, any>): CtrBenchmarks {
  const buckets = {
    b1_3: [] as number[],
    b4_6: [] as number[],
    b7_10: [] as number[],
    b11_20: [] as number[],
    b21_plus: [] as number[]
  };

  for (const stats of pageMap.values()) {
    const pos = stats.position;
    const ctr = stats.impressions > 0 ? stats.clicks / stats.impressions : 0;
    
    // Ignore extreme outliers (e.g., Brand terms with > 50% CTR) for baseline non-brand benchmarks
    if (ctr > 0.5) continue;

    if (pos <= 3) buckets.b1_3.push(ctr);
    else if (pos <= 6) buckets.b4_6.push(ctr);
    else if (pos <= 10) buckets.b7_10.push(ctr);
    else if (pos <= 20) buckets.b11_20.push(ctr);
    else buckets.b21_plus.push(ctr);
  }

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    bucket1_3: avg(buckets.b1_3) || 0.2, // fallback
    bucket4_6: avg(buckets.b4_6) || 0.08,
    bucket7_10: avg(buckets.b7_10) || 0.03,
    bucket11_20: avg(buckets.b11_20) || 0.01,
    bucket21_plus: avg(buckets.b21_plus) || 0.005
  };
}

export function getBenchmarkForPosition(pos: number, benchmarks: CtrBenchmarks): number {
  if (pos <= 3) return benchmarks.bucket1_3;
  if (pos <= 6) return benchmarks.bucket4_6;
  if (pos <= 10) return benchmarks.bucket7_10;
  if (pos <= 20) return benchmarks.bucket11_20;
  return benchmarks.bucket21_plus;
}

// Extract top performing pages to compute content benchmarks
export function computeContentBenchmarks(pageMap: Map<string, any>, projectPages: Map<string, any>) {
  const topPages = Array.from(pageMap.values())
    .sort((a, b) => b.clicks - a.clicks || a.position - b.position)
    .slice(0, 20);

  let totalFaq = 0, totalQaWords = 0, qaCount = 0;
  let validTopPages = 0;

  for (const stats of topPages) {
    const localData = projectPages.get(stats.page);
    if (localData) {
      validTopPages++;
      totalFaq += localData.faqCount ?? 0;
      if (localData.quickAnswerWords > 0) {
        totalQaWords += localData.quickAnswerWords;
        qaCount++;
      }
    }
  }
  
  const highCtrPages = Array.from(pageMap.values())
    .filter(p => p.impressions > 50)
    .sort((a, b) => (b.clicks / b.impressions) - (a.clicks / a.impressions))
    .slice(0, 20);

  let totalTitle = 0, totalDesc = 0, validCtrPages = 0;
  for (const stats of highCtrPages) {
    const localData = projectPages.get(stats.page);
    if (localData) {
      validCtrPages++;
      totalTitle += (localData.seoTitle ?? '').length;
      totalDesc += (localData.metaDescription ?? '').length;
    }
  }

  const nPerf = validTopPages || 1;
  const nCtr = validCtrPages || 1;

  return {
    faqCount: Math.ceil(totalFaq / nPerf) || 4,
    titleLength: Math.round(totalTitle / nCtr) || 55,
    descLength: Math.round(totalDesc / nCtr) || 150,
    qaWords: qaCount > 0 ? Math.round(totalQaWords / qaCount) : 50
  };
}
