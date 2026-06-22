export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches?.filter((s) => s.trim()).length ?? 0;
}

export function countParagraphs(text: string): number {
  const blocks = text.split(/\n\s*\n/).filter((p) => p.trim());
  return blocks.length || (text.trim() ? 1 : 0);
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?:^|\s|[-_/])(\w)/g, (m) => m.toUpperCase());
}

export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function toCamelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function toSnakeCase(text: string): string {
  return text
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export function toKebabCase(text: string): string {
  return toSnakeCase(text).replace(/_/g, "-");
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

export function generateLoremWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM[i % LOREM.length]);
  }
  return words.join(" ");
}

export function generateLoremSentences(count: number): string {
  return Array.from({ length: count }, (_, i) => {
    const len = 8 + (i % 6);
    const sentence = generateLoremWords(len);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  }).join(" ");
}

export function generateLoremParagraphs(count: number): string {
  return Array.from({ length: count }, () => generateLoremSentences(4)).join(
    "\n\n",
  );
}
