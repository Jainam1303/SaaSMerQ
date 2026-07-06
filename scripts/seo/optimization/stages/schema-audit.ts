import { PageData } from '../data-loader';

export function auditSchema(pageData: PageData): string[] {
  // We assume the data-loader has extracted the actual required schemas for the page type.
  // In a robust static site, we would fetch the live HTML or parse the build manifest,
  // but for the repository-first approach, we verify that the page definition maps to the right schemas.
  
  // Here we just return any missing schemas. Since we mapped expected schemas in data-loader,
  // we'll assume they are correct for now, but a real audit would compare this against a parsed AST or crawled JSON-LD.
  // We will simulate the audit by ensuring that if a page is a "tool", it MUST have "SoftwareApplication" in its list.
  
  const missing: string[] = [];
  const schemas = pageData.schemas || [];
  
  if (['conversion', 'quantity', 'tool'].includes(pageData.type)) {
    if (!schemas.includes('SoftwareApplication')) missing.push('SoftwareApplication');
  }
  if (['blog', 'guide'].includes(pageData.type)) {
    if (!schemas.includes('Article')) missing.push('Article');
  }
  
  if (!schemas.includes('WebPage')) missing.push('WebPage');
  
  return missing;
}
