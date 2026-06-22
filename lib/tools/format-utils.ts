const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON",
  "GROUP", "BY", "ORDER", "HAVING", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "AND", "OR", "NOT",
  "NULL", "AS", "DISTINCT", "LIMIT", "OFFSET", "UNION", "ALL", "CASE", "WHEN",
  "THEN", "ELSE", "END", "EXISTS", "IN", "BETWEEN", "LIKE", "IS",
]);

export function beautifySql(sql: string): string {
  let result = sql.replace(/\s+/g, " ").trim();
  const breakBefore = [
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
    "GROUP BY", "ORDER BY", "HAVING", "INSERT INTO", "VALUES", "UPDATE", "SET",
    "DELETE FROM", "UNION", "UNION ALL",
  ];
  for (const kw of breakBefore) {
    const re = new RegExp(`\\b${kw}\\b`, "gi");
    result = result.replace(re, `\n${kw.toUpperCase()}`);
  }
  result = result
    .split("\n")
    .map((line) => {
      const tokens = line.trim().split(/\b/);
      return tokens
        .map((t) => (SQL_KEYWORDS.has(t.toUpperCase()) ? t.toUpperCase() : t))
        .join("");
    })
    .join("\n")
    .replace(/\n+/g, "\n")
    .trim();
  return result;
}

export function minifySql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

export function beautifyXml(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error(err.textContent ?? "Invalid XML");
  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(doc);
  const lines = raw.replace(/></g, ">\n<").split("\n");
  let indent = 0;
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("</")) indent = Math.max(0, indent - 1);
      const pad = "  ".repeat(indent);
      if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.includes("</")) {
        indent++;
      }
      return pad + trimmed;
    })
    .filter(Boolean)
    .join("\n");
}

export function validateXml(xml: string): { valid: boolean; message: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    return { valid: false, message: err.textContent?.trim() ?? "Invalid XML" };
  }
  return { valid: true, message: "Valid XML document." };
}

export function minifyXml(xml: string): string {
  validateXml(xml);
  return xml.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
      row.push(cell);
      if (row.some((c) => c.length)) rows.push(row);
      row = [];
      cell = "";
      if (ch === "\r") i++;
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  row.push(cell);
  if (row.some((c) => c.length)) rows.push(row);
  return rows;
}

export function csvToJson(text: string): string {
  const rows = parseCsv(text.trim());
  if (!rows.length) return "[]";
  const [header, ...data] = rows;
  const objects = data.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, i) => {
      obj[key.trim() || `column_${i + 1}`] = row[i] ?? "";
    });
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

export function jsonToCsv(text: string): string {
  const data = JSON.parse(text) as unknown;
  if (!Array.isArray(data)) throw new Error("JSON must be an array of objects.");
  if (!data.length) return "";
  const headers = Array.from(
    new Set(data.flatMap((row) => Object.keys(row as object))),
  );
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => escape((row as Record<string, unknown>)[h])).join(","),
    ),
  ];
  return lines.join("\n");
}

export interface DiffLine {
  type: "same" | "add" | "remove";
  text: string;
}

export function diffLines(a: string, b: string): DiffLine[] {
  const left = a.split("\n");
  const right = b.split("\n");
  const m = left.length;
  const n = right.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        left[i - 1] === right[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && left[i - 1] === right[j - 1]) {
      stack.push({ type: "same", text: left[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "add", text: right[j - 1] });
      j--;
    } else {
      stack.push({ type: "remove", text: left[i - 1] });
      i--;
    }
  }
  while (stack.length) result.push(stack.pop()!);
  return result;
}
