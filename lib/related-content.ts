import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { getToolBySlug, getRelatedTools } from "@/data/tools";
import { getPostsForTool } from "@/lib/internal-links";
import {
  getConversionBySlug,
  getRelatedConversions,
  conversionPages,
} from "@/lib/programmatic/conversions";
import {
  getCalculatorBySlug,
  getRelatedCalculators,
  calculatorPages,
} from "@/data/programmatic/calculators";
import {
  getGuideBySlug,
  getRelatedGuides,
  getAllGuides,
} from "@/lib/programmatic/guides";
import { getHubsForTool } from "@/lib/hubs";

export interface RelatedLink {
  path: string;
  title: string;
  type: "tool" | "guide" | "blog" | "conversion" | "calculator" | "hub";
}

export interface RelatedContentBundle {
  tools: RelatedLink[];
  guides: RelatedLink[];
  blogs: RelatedLink[];
  conversions: RelatedLink[];
  calculators: RelatedLink[];
  total: number;
}

const CONVERSION_GUIDE_MAP: Record<string, string> = {
  length: "km-to-miles-guide",
  weight: "kg-to-lbs-guide",
  temperature: "celsius-fahrenheit-guide",
  volume: "liters-to-gallons-guide",
  area: "square-feet-to-square-meters-guide",
  speed: "unit-conversion-basics",
};

const TOOL_CONVERSION_MAP: Record<string, string> = {
  "unit-converter": "km-to-miles",
  "percentage-calculator": "meters-to-feet",
  "emi-calculator": "home-loan-calculator",
  "fd-calculator": "fd-calculator-india",
  "gst-calculator": "gst-calculator-india",
};

const TOOL_CALCULATOR_MAP: Record<string, string> = {
  "emi-calculator": "home-loan-calculator",
  "loan-calculator": "personal-loan-calculator",
  "sip-calculator": "sip-calculator-india",
  "fd-calculator": "fd-calculator-india",
  "gst-calculator": "gst-calculator-india",
  "hra-calculator": "hra-calculator-india",
};

function link(
  path: string,
  title: string,
  type: RelatedLink["type"],
): RelatedLink {
  return { path, title, type };
}

function dedupe(links: RelatedLink[], limit: number): RelatedLink[] {
  const seen = new Set<string>();
  const result: RelatedLink[] = [];
  for (const item of links) {
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

function guidesForTool(toolSlug: string, limit = 2): RelatedLink[] {
  return getAllGuides()
    .filter((g) => g.toolSlugs.includes(toolSlug))
    .slice(0, limit)
    .map((g) => link(g.path, g.title, "guide"));
}

function conversionsForCategory(
  category: string,
  excludePath?: string,
  limit = 2,
): RelatedLink[] {
  return conversionPages
    .filter((p) => p.category === category && p.path !== excludePath)
    .slice(0, limit)
    .map((p) => link(p.path, `${p.fromShort} → ${p.toShort}`, "conversion"));
}

function calculatorsForHub(hubSlug: string, limit = 2): RelatedLink[] {
  return calculatorPages
    .filter((p) => p.hubSlug === hubSlug)
    .slice(0, limit)
    .map((p) => link(p.path, p.title.split(" — ")[0], "calculator"));
}

export function getRelatedContentForTool(slug: string): RelatedContentBundle {
  const tool = getToolBySlug(slug);
  if (!tool) {
    return {
      tools: [],
      guides: [],
      blogs: [],
      conversions: [],
      calculators: [],
      total: 0,
    };
  }

  const toolLinks = getRelatedTools(slug, 3).map((t) =>
    link(`/tools/${t.slug}`, t.name, "tool"),
  );
  const blogLinks = getPostsForTool(slug, 2).map((p) =>
    link(`/blog/${p.slug}`, p.title, "blog"),
  );
  const guideLinks = guidesForTool(slug, 2);
  const convSlug = TOOL_CONVERSION_MAP[slug];
  const conversionLinks: RelatedLink[] = convSlug
    ? [link(`/conversions/${convSlug}`, "Related conversion", "conversion")]
    : conversionsForCategory("length", undefined, 1);
  const calcSlug = TOOL_CALCULATOR_MAP[slug];
  const calculatorLinks: RelatedLink[] = calcSlug
    ? [
        link(
          `/calculators/${calcSlug}`,
          getCalculatorBySlug(calcSlug)?.title.split(" — ")[0] ?? "Calculator",
          "calculator",
        ),
      ]
    : calculatorsForHub(getHubsForTool(slug)[0]?.slug ?? "business-tools", 1);

  const all = dedupe(
    [
      ...toolLinks,
      ...guideLinks,
      ...blogLinks,
      ...conversionLinks,
      ...calculatorLinks,
    ],
    8,
  );

  return splitBundle(all);
}

function splitBundle(all: RelatedLink[]): RelatedContentBundle {
  return {
    tools: all.filter((l) => l.type === "tool"),
    guides: all.filter((l) => l.type === "guide"),
    blogs: all.filter((l) => l.type === "blog"),
    conversions: all.filter((l) => l.type === "conversion"),
    calculators: all.filter((l) => l.type === "calculator"),
    total: all.length,
  };
}

export function getRelatedContentForConversion(
  slug: string,
): RelatedContentBundle {
  const page = getConversionBySlug(slug);
  if (!page) {
    return {
      tools: [],
      guides: [],
      blogs: [],
      conversions: [],
      calculators: [],
      total: 0,
    };
  }

  const toolLinks = page.toolSlugs
    .map((s) => getToolBySlug(s))
    .filter(Boolean)
    .map((t) => link(`/tools/${t!.slug}`, t!.name, "tool"));

  const conversionLinks = getRelatedConversions(slug, 3).map((p) =>
    link(p.path, `${p.fromShort} → ${p.toShort}`, "conversion"),
  );

  const guideSlug = CONVERSION_GUIDE_MAP[page.category];
  const guide = guideSlug ? getGuideBySlug(guideSlug) : undefined;
  const guideLinks = guide ? [link(guide.path, guide.title, "guide")] : [];

  const blogLinks = getAllPosts()
    .filter((p) => p.toolSlug === "unit-converter")
    .slice(0, 1)
    .map((p) => link(`/blog/${p.slug}`, p.title, "blog"));

  const all = dedupe(
    [...toolLinks, ...conversionLinks, ...guideLinks, ...blogLinks],
    8,
  );

  return splitBundle(all);
}

export function getRelatedContentForCalculator(
  slug: string,
): RelatedContentBundle {
  const page = getCalculatorBySlug(slug);
  if (!page) {
    return {
      tools: [],
      guides: [],
      blogs: [],
      conversions: [],
      calculators: [],
      total: 0,
    };
  }

  const toolLinks = page.toolSlugs
    .map((s) => getToolBySlug(s))
    .filter(Boolean)
    .map((t) => link(`/tools/${t!.slug}`, t!.name, "tool"));

  const calculatorLinks = getRelatedCalculators(slug).map((p) =>
    link(p.path, p.title.split(" — ")[0], "calculator"),
  );

  const guideLinks = page.relatedGuideSlugs
    .map((s) => getGuideBySlug(s))
    .filter(Boolean)
    .map((g) => link(g!.path, g!.title, "guide"));

  const blogLinks = getPostsForTool(page.toolSlug, 1).map((p) =>
    link(`/blog/${p.slug}`, p.title, "blog"),
  );

  const all = dedupe(
    [...toolLinks, ...calculatorLinks, ...guideLinks, ...blogLinks],
    8,
  );

  return splitBundle(all);
}

export function getRelatedContentForGuide(slug: string): RelatedContentBundle {
  const page = getGuideBySlug(slug);
  if (!page) {
    return {
      tools: [],
      guides: [],
      blogs: [],
      conversions: [],
      calculators: [],
      total: 0,
    };
  }

  const toolLinks = page.toolSlugs
    .map((s) => getToolBySlug(s))
    .filter(Boolean)
    .map((t) => link(`/tools/${t!.slug}`, t!.name, "tool"));

  const guideLinks = getRelatedGuides(slug, 3).map((g) =>
    link(g.path, g.title, "guide"),
  );

  const calcLinks = calculatorsForHub(page.hubSlug, 2);
  const blogLinks = getPostsForTool(page.toolSlugs[0], 1).map((p) =>
    link(`/blog/${p.slug}`, p.title, "blog"),
  );

  const category =
    page.slug.includes("km") || page.slug.includes("unit")
      ? "length"
      : undefined;
  const conversionLinks = category
    ? conversionsForCategory(category, undefined, 2)
    : [];

  const all = dedupe(
    [
      ...toolLinks,
      ...guideLinks,
      ...calcLinks,
      ...blogLinks,
      ...conversionLinks,
    ],
    8,
  );

  return splitBundle(all);
}

export function getRelatedContentForBlog(slug: string): RelatedContentBundle {
  const post = getPostBySlug(slug);
  if (!post) {
    return {
      tools: [],
      guides: [],
      blogs: [],
      conversions: [],
      calculators: [],
      total: 0,
    };
  }

  const primary = getToolBySlug(post.toolSlug);
  const toolLinks = [
    ...(primary
      ? [link(`/tools/${primary.slug}`, primary.name, "tool")]
      : []),
    ...getRelatedTools(post.toolSlug, 2).map((t) =>
      link(`/tools/${t.slug}`, t.name, "tool"),
    ),
  ];

  const guideLinks = guidesForTool(post.toolSlug, 2);
  const blogLinks = getAllPosts()
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2)
    .map((p) => link(`/blog/${p.slug}`, p.title, "blog"));

  const calcSlug = TOOL_CALCULATOR_MAP[post.toolSlug];
  const calculatorLinks = calcSlug
    ? [
        link(
          `/calculators/${calcSlug}`,
          getCalculatorBySlug(calcSlug)?.title.split(" — ")[0] ?? "Calculator",
          "calculator",
        ),
      ]
    : [];

  const all = dedupe(
    [...toolLinks, ...guideLinks, ...blogLinks, ...calculatorLinks],
    8,
  );

  return splitBundle(all);
}

export function getRelatedPaths(
  pageType: "tool" | "blog" | "conversion" | "calculator" | "guide",
  slug: string,
): string[] {
  const bundles: Record<string, () => RelatedContentBundle> = {
    tool: () => getRelatedContentForTool(slug),
    blog: () => getRelatedContentForBlog(slug),
    conversion: () => getRelatedContentForConversion(slug),
    calculator: () => getRelatedContentForCalculator(slug),
    guide: () => getRelatedContentForGuide(slug),
  };
  const bundle = bundles[pageType]();
  return [
    ...bundle.tools,
    ...bundle.guides,
    ...bundle.blogs,
    ...bundle.conversions,
    ...bundle.calculators,
  ].map((l) => l.path);
}
