import fs from "node:fs";
import path from "node:path";

const TOOLS_CONTENT_DIR = path.join(process.cwd(), "content/tools");

export function getToolContent(slug: string): string | null {
  const filePath = path.join(TOOLS_CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function hasToolContent(slug: string): boolean {
  return fs.existsSync(path.join(TOOLS_CONTENT_DIR, `${slug}.md`));
}
