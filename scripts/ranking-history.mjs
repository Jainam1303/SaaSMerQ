import fs from 'node:fs';
import path from 'node:path';

// Lightweight CSV parser matching the SEO OS importer
function parseGscCsv(csvContent) {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i+1] === '"') { current += '"'; i++; }
      else if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
      else { current += char; }
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
      if (['clicks', 'impressions'].includes(header)) row[header] = parseInt(val.replace(/,/g, ''), 10) || 0;
      else if (header === 'ctr') row.ctr = parseFloat(val.replace('%', '')) / 100 || 0;
      else if (header === 'position') row.position = parseFloat(val) || 0;
      else if (header === 'top queries') row.query = val;
      else if (header === 'top pages') row.page = val;
      else row[header] = val;
    }
    row.clicks = row.clicks ?? 0;
    row.impressions = row.impressions ?? 0;
    row.ctr = row.ctr ?? 0;
    row.position = row.position ?? 0;
    rows.push(row);
  }
  return rows;
}

const ROOT = process.cwd();
const HISTORY_DIR = path.join(ROOT, 'reports/history');
const OUT_FILE = path.join(ROOT, 'reports/ranking-trends.json');

fs.mkdirSync(HISTORY_DIR, { recursive: true });

const args = process.argv.slice(2);
const newCsvPath = args[0]; // e.g. data/seo/latest-gsc.csv

if (newCsvPath && fs.existsSync(newCsvPath)) {
  const content = fs.readFileSync(newCsvPath, 'utf8');
  // simple deterministic date format YYYY-MM-DD
  const dateStr = new Date().toISOString().split('T')[0];
  const dest = path.join(HISTORY_DIR, `${dateStr}.csv`);
  
  // if file for today already exists, we could append a counter, but for deterministic
  // simple behaviour we just overwrite or skip. Overwrite is safer for testing.
  fs.writeFileSync(dest, content);
  console.log(`Saved snapshot to ${dest}`);
}

// Compare the two most recent snapshots
const snapshots = fs.readdirSync(HISTORY_DIR).filter(f => f.endsWith('.csv')).sort();

let trends = [];

if (snapshots.length >= 2) {
  const previousFile = path.join(HISTORY_DIR, snapshots[snapshots.length - 2]);
  const currentFile = path.join(HISTORY_DIR, snapshots[snapshots.length - 1]);
  
  const prevRows = parseGscCsv(fs.readFileSync(previousFile, 'utf8'));
  const currRows = parseGscCsv(fs.readFileSync(currentFile, 'utf8'));
  
  const prevMap = new Map();
  for (const r of prevRows) {
    const key = r.query ? `query:${r.query}` : r.page ? `page:${r.page}` : null;
    if (key) prevMap.set(key, r);
  }
  
  for (const r of currRows) {
    const key = r.query ? `query:${r.query}` : r.page ? `page:${r.page}` : null;
    if (!key) continue;
    
    const prev = prevMap.get(key);
    if (prev) {
      const posChange = prev.position - r.position; // Positive is good
      const clickChange = r.clicks - prev.clicks;
      const impChange = r.impressions - prev.impressions;
      const ctrChange = r.ctr - prev.ctr;
      
      if (posChange !== 0 || clickChange !== 0 || impChange !== 0) {
        trends.push({
          type: r.query ? 'query' : 'page',
          target: r.query || r.page,
          previous: {
            position: prev.position,
            clicks: prev.clicks,
            impressions: prev.impressions,
            ctr: prev.ctr
          },
          current: {
            position: r.position,
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: r.ctr
          },
          change: {
            position: Number(posChange.toFixed(2)),
            clicks: clickChange,
            impressions: impChange,
            ctr: Number(ctrChange.toFixed(4))
          }
        });
      }
    }
  }
}

// Sort deterministically (biggest absolute position changes first, then alphabetically)
trends.sort((a, b) => {
  const aAbs = Math.abs(a.change.position);
  const bAbs = Math.abs(b.change.position);
  if (aAbs !== bAbs) return bAbs - aAbs;
  return a.target.localeCompare(b.target);
});

fs.writeFileSync(OUT_FILE, JSON.stringify({ trends }, null, 2));
console.log(`✔ Generated reports/ranking-trends.json (${trends.length} changes tracked)`);
