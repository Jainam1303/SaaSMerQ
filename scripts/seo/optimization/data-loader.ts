import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { parseGscCsvFile } from '../../../lib/seo/search-console/csv-importer';
import { conversionPages } from '../../../lib/programmatic/conversions';
import { quantityConversionPages } from '../../../lib/programmatic/quantity-conversions';

const ROOT = process.cwd();
const DEFS_DIR = path.join(ROOT, "data/tools/definitions");
const BLOG_DIR = path.join(ROOT, "content/blog");
const GUIDES_DIR = path.join(ROOT, "content/guides");
const GRAPH_FILE = path.join(ROOT, 'reports/internal-link-graph.json');

export interface PageData {
  url: string;
  type: 'conversion' | 'quantity' | 'tool' | 'blog' | 'guide';
  seoTitle: string;
  metaDescription: string;
  faqCount: number;
  quickAnswerWords: number;
  content: string; // Raw content for gap detection
  schemas: string[]; // Expected schemas based on type
}

function words(s: string): number {
  return (s ?? "").split(/\s+/).filter(Boolean).length;
}

export function loadProjectPages(): Map<string, PageData> {
  const pages = new Map<string, PageData>();

  for (const page of conversionPages) {
    pages.set(`/conversions/${page.slug}`, {
      url: `/conversions/${page.slug}`,
      type: 'conversion',
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription,
      faqCount: page.faqs?.length ?? 0,
      quickAnswerWords: words(page.quickAnswer ?? ''),
      content: page.quickAnswer ?? '',
      schemas: ['WebPage', 'SoftwareApplication', 'BreadcrumbList']
    });
  }

  for (const page of quantityConversionPages) {
    pages.set(page.path, {
      url: page.path,
      type: 'quantity',
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription,
      faqCount: page.faqs?.length ?? 0,
      quickAnswerWords: words(page.explanation ?? ''),
      content: page.explanation ?? '',
      schemas: ['WebPage', 'SoftwareApplication', 'BreadcrumbList']
    });
  }

  if (fs.existsSync(DEFS_DIR)) {
    for (const file of fs.readdirSync(DEFS_DIR)) {
      if (!file.endsWith('.ts')) continue;
      const raw = fs.readFileSync(path.join(DEFS_DIR, file), "utf8");
      const slug = raw.match(/slug:\s*"([^"]+)"/)?.[1];
      if (slug) {
        pages.set(`/tools/${slug}`, {
          url: `/tools/${slug}`,
          type: 'tool',
          seoTitle: raw.match(/seoTitle:\s*\n?\s*"([^"]+)"/)?.[1] || '',
          metaDescription: raw.match(/metaDescription:\s*\n?\s*"([^"]+)"/)?.[1] || '',
          faqCount: (raw.match(/question:/g) ?? []).length,
          quickAnswerWords: 0,
          content: raw,
          schemas: ['WebPage', 'SoftwareApplication', 'BreadcrumbList', 'FAQPage']
        });
      }
    }
  }

  function loadMd(dir: string, type: 'blog' | 'guide', base: string) {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      pages.set(`${base}/${slug}`, {
        url: `${base}/${slug}`,
        type,
        seoTitle: data.seoTitle ?? data.title ?? '',
        metaDescription: data.metaDescription ?? data.description ?? '',
        faqCount: (data.faqs ?? []).length,
        quickAnswerWords: words(content.slice(0, 500)), // rough heuristic
        content,
        schemas: ['WebPage', 'Article', 'BreadcrumbList', 'FAQPage']
      });
    }
  }

  loadMd(BLOG_DIR, 'blog', '/blog');
  loadMd(GUIDES_DIR, 'guide', '/guides');

  return pages;
}

export function loadGscData(inputPath: string) {
  let csvContent = '';
  if (fs.existsSync(inputPath)) {
    csvContent = fs.readFileSync(inputPath, 'utf8');
  } else {
    return [];
  }
  return parseGscCsvFile(inputPath);
}

export function loadLinkGraph() {
  if (fs.existsSync(GRAPH_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf8'));
    } catch (e) {}
  }
  return null;
}
