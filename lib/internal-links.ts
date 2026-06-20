import { getToolBySlug, getRelatedTools, tools, type ToolMeta } from "@/data/tools";
import { getAllPosts, getPostBySlug, type BlogPostMeta } from "@/lib/blog";
import { getAllHubs, getHubBySlug, getHubsForBlog, getHubsForTool } from "@/lib/hubs";

/** Blog posts whose primary tool matches, ranked by publish date. */
export function getPostsForTool(toolSlug: string, limit = 2): BlogPostMeta[] {
  const all = getAllPosts();
  const tool = getToolBySlug(toolSlug);

  const primary = all.filter((p) => p.toolSlug === toolSlug);
  if (primary.length >= limit) return primary.slice(0, limit);

  const seen = new Set(primary.map((p) => p.slug));
  const pool: BlogPostMeta[] = [...primary];

  if (tool) {
    const relatedToolSlugs = getRelatedTools(toolSlug, 8).map((t) => t.slug);
    for (const post of all) {
      if (seen.has(post.slug)) continue;
      if (relatedToolSlugs.includes(post.toolSlug)) {
        pool.push(post);
        seen.add(post.slug);
      }
    }
  }

  if (pool.length < limit && tool) {
    const scored = all
      .filter((p) => !seen.has(p.slug))
      .map((post) => ({ post, score: scorePostForTool(post, tool) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const { post } of scored) {
      if (pool.length >= limit) break;
      pool.push(post);
      seen.add(post.slug);
    }
  }

  if (pool.length < limit) {
    for (const post of all) {
      if (seen.has(post.slug)) continue;
      pool.push(post);
      seen.add(post.slug);
      if (pool.length >= limit) break;
    }
  }

  return pool.slice(0, limit);
}

/** Related tools for a blog post (excludes the primary toolSlug). */
export function getRelatedToolsForPost(
  postSlug: string,
  limit = 3,
): ToolMeta[] {
  const post = getPostBySlug(postSlug);
  if (!post) return [];

  const seen = new Set<string>([post.toolSlug]);
  const result: ToolMeta[] = [];

  for (const slug of post.relatedToolSlugs ?? []) {
    if (seen.has(slug)) continue;
    const tool = getToolBySlug(slug);
    if (tool) {
      result.push(tool);
      seen.add(slug);
    }
    if (result.length >= limit) return result;
  }

  for (const tool of getRelatedTools(post.toolSlug, 12)) {
    if (seen.has(tool.slug)) continue;
    result.push(tool);
    seen.add(tool.slug);
    if (result.length >= limit) break;
  }

  return result;
}

/** Audit helpers — outbound links per page type. */
export function getToolPageLinks(toolSlug: string) {
  return {
    relatedTools: getRelatedTools(toolSlug, 5),
    relatedPosts: getPostsForTool(toolSlug, 2),
  };
}

export function getBlogPageLinks(postSlug: string) {
  const post = getPostBySlug(postSlug);
  if (!post) return null;

  return {
    primaryTool: getToolBySlug(post.toolSlug),
    relatedTools: getRelatedToolsForPost(postSlug, 3),
    relatedPosts: getRelatedPostsForBlog(postSlug, 2),
  };
}

export function getRelatedPostsForBlog(
  slug: string,
  limit = 2,
): BlogPostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const all = getAllPosts().filter((p) => p.slug !== slug);
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  const explicit = (current.relatedSlugs ?? [])
    .map((s) => bySlug.get(s))
    .filter((p): p is BlogPostMeta => Boolean(p));

  const seen = new Set(explicit.map((p) => p.slug));
  const sameCategory = all.filter(
    (p) =>
      p.category === current.category &&
      !seen.has(p.slug),
  );

  return [...explicit, ...sameCategory].slice(0, limit);
}

function scorePostForTool(post: BlogPostMeta, tool: ToolMeta): number {
  let score = 0;
  const toolTerms = [
    tool.slug,
    tool.name.toLowerCase(),
    ...tool.keywords.map((k) => k.toLowerCase()),
  ];

  for (const kw of post.keywords) {
    const k = kw.toLowerCase();
    if (toolTerms.some((t) => t.includes(k) || k.includes(t))) score += 5;
  }

  if (post.category === "Finance" && tool.category === "business") score += 2;

  return score;
}

/** Full site internal link graph for reporting. */
export function buildInternalLinkGraph() {
  const hubNodes = getAllHubs().map((hub) => {
    const full = getHubBySlug(hub.slug);
    return {
      slug: hub.slug,
      path: hub.path,
      type: "hub" as const,
      outbound: {
        tools: hub.toolSlugs.map((s) => `/tools/${s}`),
        blogs: hub.blogSlugs.map((s) => `/blog/${s}`),
        hubs: hub.relatedHubSlugs.map((s) => `/${s}`),
        categories: hub.categorySummaries.map((c) => `/category/${c.slug}`),
      },
      counts: {
        tools: hub.toolSlugs.length,
        blogs: hub.blogSlugs.length,
        hubs: hub.relatedHubSlugs.length,
        contentWords: full
          ? full.content.split(/\s+/).filter(Boolean).length
          : 0,
      },
    };
  });

  const toolNodes = tools.map((tool) => {
    const links = getToolPageLinks(tool.slug);
    const hubs = getHubsForTool(tool.slug);
    return {
      slug: tool.slug,
      path: `/tools/${tool.slug}`,
      type: "tool" as const,
      outbound: {
        tools: links.relatedTools.map((t) => `/tools/${t.slug}`),
        blogs: links.relatedPosts.map((p) => `/blog/${p.slug}`),
        hubs: hubs.map((h) => h.path),
      },
    };
  });

  const blogNodes = getAllPosts().map((post) => {
    const links = getBlogPageLinks(post.slug);
    const hubs = [
      ...getHubsForBlog(post.slug),
      ...getHubsForTool(post.toolSlug),
    ].filter((h, i, arr) => arr.findIndex((x) => x.slug === h.slug) === i);
    return {
      slug: post.slug,
      path: `/blog/${post.slug}`,
      type: "blog" as const,
      outbound: {
        primaryTool: links?.primaryTool
          ? `/tools/${links.primaryTool.slug}`
          : null,
        tools: links?.relatedTools.map((t) => `/tools/${t.slug}`) ?? [],
        blogs: links?.relatedPosts.map((p) => `/blog/${p.slug}`) ?? [],
        hubs: hubs.map((h) => h.path),
      },
    };
  });

  return { hubs: hubNodes, tools: toolNodes, blogs: blogNodes };
}

export function buildHubAuthorityReport() {
  const graph = buildInternalLinkGraph();
  const inbound: Record<string, number> = {};

  const addInbound = (target: string) => {
    inbound[target] = (inbound[target] ?? 0) + 1;
  };

  for (const hub of graph.hubs) {
    for (const t of hub.outbound.tools) addInbound(t);
    for (const b of hub.outbound.blogs) addInbound(b);
    for (const h of hub.outbound.hubs) addInbound(h);
    for (const c of hub.outbound.categories) addInbound(c);
  }
  for (const tool of graph.tools) {
    for (const h of tool.outbound.hubs ?? []) addInbound(h);
  }
  for (const blog of graph.blogs) {
    for (const h of blog.outbound.hubs ?? []) addInbound(h);
  }

  return graph.hubs.map((hub) => ({
    slug: hub.slug,
    path: hub.path,
    wordCount: hub.counts.contentWords,
    outboundTools: hub.counts.tools,
    outboundBlogs: hub.counts.blogs,
    inboundLinksFromSite: inbound[hub.path] ?? 0,
    toolsLinked: hub.outbound.tools,
    blogsLinked: hub.outbound.blogs,
  }));
}
