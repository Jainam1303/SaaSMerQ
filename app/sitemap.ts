import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllHubs } from "@/lib/hubs";
import { getAllConversionSlugs } from "@/lib/programmatic/conversions";
import { getAllCalculatorSlugs } from "@/data/programmatic/calculators";
import { getAllGuideSlugs } from "@/lib/programmatic/guides";
import { tools } from "@/data/tools";
import { categories } from "@/data/tools/categories";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/free-online-tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${siteConfig.url}/launch`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/editorial-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${siteConfig.url}/methodology`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const hubRoutes: MetadataRoute.Sitemap = getAllHubs().map((hub) => ({
    url: `${siteConfig.url}${hub.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/category/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date(tool.addedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const conversionRoutes: MetadataRoute.Sitemap = getAllConversionSlugs().map(
    (slug) => ({
      url: `${siteConfig.url}/conversions/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.72,
    }),
  );

  const calculatorRoutes: MetadataRoute.Sitemap = getAllCalculatorSlugs().map(
    (slug) => ({
      url: `${siteConfig.url}/calculators/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.74,
    }),
  );

  const guideRoutes: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${siteConfig.url}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.73,
  }));

  return [
    ...staticRoutes,
    ...hubRoutes,
    ...categoryRoutes,
    ...toolRoutes,
    ...blogRoutes,
    ...conversionRoutes,
    ...calculatorRoutes,
    ...guideRoutes,
  ];
}
