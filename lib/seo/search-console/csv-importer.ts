import fs from 'node:fs';

export interface GscRow {
  query?: string;
  page?: string;
  device?: string;
  country?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Gracefully handle unknown columns
}

export function parseGscCsv(csvContent: string): GscRow[] {
  const lines = csvContent.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Lightweight CSV parser handling quotes
  const parseLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i+1] === '"') {
        current += '"';
        i++; // skip escaped quote
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
  const rows: GscRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: any = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const val = values[j] ?? '';
      
      // Parse known numeric columns
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
        row[header] = val; // Gracefully handle future/unknown columns
      }
    }
    
    // Ensure numeric fields exist
    row.clicks = row.clicks ?? 0;
    row.impressions = row.impressions ?? 0;
    row.ctr = row.ctr ?? 0;
    row.position = row.position ?? 0;
    
    rows.push(row as GscRow);
  }

  return rows;
}

export function parseGscCsvFile(filePath: string): GscRow[] {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseGscCsv(content);
}
