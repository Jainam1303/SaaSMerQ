import { categories } from "@/data/tools/categories";
import { siteConfig } from "@/lib/site";

/** Plain-text llms.txt body for AI crawlers and directory bots. */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${siteConfig.brandName}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `Site: ${siteConfig.url}`,
    "",
    "## Categories",
    "",
  ];

  for (const category of categories) {
    lines.push(
      `- ${category.name}: ${category.description} (${siteConfig.url}/category/${category.slug})`,
    );
  }

  lines.push("", "## Sitemap", "", `${siteConfig.url}/sitemap.xml`, "");

  return lines.join("\n");
}
