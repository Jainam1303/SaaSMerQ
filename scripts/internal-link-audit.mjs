/**
 * Internal linking audit — validates link counts and outputs a graph report.
 * Usage: node scripts/internal-link-audit.mjs
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content/blog");
const HUBS_DIR = path.join(ROOT, "content/hubs");
const DEFS_DIR = path.join(ROOT, "data/tools/definitions");

const REQUIRED = {
  tool: { tools: 5, blogs: 2 },
  blog: { primaryTool: 1, tools: 3, blogs: 2 },
};

function loadTools() {
  const files = fs.readdirSync(DEFS_DIR).filter((f) => f.endsWith(".ts"));
  const tools = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(DEFS_DIR, file), "utf8");
    const slug = raw.match(/slug:\s*"([^"]+)"/)?.[1];
    const category = raw.match(/category:\s*"([^"]+)"/)?.[1];
    const name = raw.match(/name:\s*"([^"]+)"/)?.[1];
    const keywords = [...raw.matchAll(/"([^"]+)"/g)]
      .map((m) => m[1])
      .filter((_, i, arr) => i > 5);
    if (slug) tools.push({ slug, category, name, keywords: keywords.slice(0, 8) });
  }
  return tools;
}

function loadPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
      return {
        slug,
        toolSlug: data.toolSlug,
        relatedToolSlugs: data.relatedToolSlugs ?? [],
        relatedSlugs: data.relatedSlugs ?? [],
        category: data.category,
        keywords: data.keywords ?? [],
      };
    });
}

function loadHubs() {
  if (!fs.existsSync(HUBS_DIR)) return [];
  return fs
    .readdirSync(HUBS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(HUBS_DIR, f), "utf8"),
      );
      return {
        slug,
        path: data.path,
        toolSlugs: data.toolSlugs ?? [],
        blogSlugs: data.blogSlugs ?? [],
        relatedHubSlugs: data.relatedHubSlugs ?? [],
        categorySummaries: data.categorySummaries ?? [],
        wordCount: content.split(/\s+/).filter(Boolean).length,
      };
    });
}

function getHubsForTool(toolSlug, hubs) {
  return hubs.filter((h) => h.toolSlugs.includes(toolSlug));
}

function getHubsForBlog(blogSlug, hubs) {
  return hubs.filter((h) => h.blogSlugs.includes(blogSlug));
}

function getRelatedTools(slug, tools, limit = 5) {
  const current = tools.find((t) => t.slug === slug);
  if (!current) return [];
  const same = tools.filter(
    (t) => t.category === current.category && t.slug !== slug,
  );
  const other = tools.filter(
    (t) => t.category !== current.category && t.slug !== slug,
  );
  return [...same, ...other].slice(0, limit);
}

function scorePostForTool(post, tool) {
  let score = 0;
  const toolTerms = [tool.slug, tool.name?.toLowerCase(), ...tool.keywords];
  for (const kw of post.keywords) {
    const k = kw.toLowerCase();
    if (toolTerms.some((t) => t && (t.includes(k) || k.includes(t)))) score += 5;
  }
  if (post.category === "Finance" && tool.category === "business") score += 2;
  return score;
}

function getPostsForTool(toolSlug, tools, posts, limit = 2) {
  const tool = tools.find((t) => t.slug === toolSlug);
  const primary = posts.filter((p) => p.toolSlug === toolSlug);
  const seen = new Set(primary.map((p) => p.slug));
  const pool = [...primary];

  if (tool) {
    const relatedSlugs = getRelatedTools(toolSlug, tools, 8).map((t) => t.slug);
    for (const post of posts) {
      if (seen.has(post.slug)) continue;
      if (relatedSlugs.includes(post.toolSlug)) {
        pool.push(post);
        seen.add(post.slug);
      }
    }
  }

  if (pool.length < limit && tool) {
    const scored = posts
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
    for (const post of posts) {
      if (seen.has(post.slug)) continue;
      pool.push(post);
      seen.add(post.slug);
      if (pool.length >= limit) break;
    }
  }

  return pool.slice(0, limit);
}

function getRelatedToolsForPost(post, tools, limit = 3) {
  const seen = new Set([post.toolSlug]);
  const result = [];

  for (const slug of post.relatedToolSlugs) {
    if (seen.has(slug)) continue;
    const tool = tools.find((t) => t.slug === slug);
    if (tool) {
      result.push(tool);
      seen.add(slug);
    }
    if (result.length >= limit) return result;
  }

  for (const tool of getRelatedTools(post.toolSlug, tools, 12)) {
    if (seen.has(tool.slug)) continue;
    result.push(tool);
    seen.add(tool.slug);
    if (result.length >= limit) break;
  }

  return result;
}

function getRelatedPostsForBlog(post, posts, limit = 2) {
  const all = posts.filter((p) => p.slug !== post.slug);
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const explicit = post.relatedSlugs
    .map((s) => bySlug.get(s))
    .filter(Boolean);
  const seen = new Set(explicit.map((p) => p.slug));
  const sameCategory = all.filter(
    (p) => p.category === post.category && !seen.has(p.slug),
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

function buildGraph(tools, posts, hubs) {
  const hubNodes = hubs.map((hub) => ({
    slug: hub.slug,
    path: hub.path,
    type: "hub",
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
      words: hub.wordCount,
    },
  }));

  const toolNodes = tools.map((tool) => {
    const relatedTools = getRelatedTools(tool.slug, tools, 5);
    const relatedPosts = getPostsForTool(tool.slug, tools, posts, 2);
    const toolHubs = getHubsForTool(tool.slug, hubs);
    return {
      slug: tool.slug,
      path: `/tools/${tool.slug}`,
      type: "tool",
      outbound: {
        tools: relatedTools.map((t) => `/tools/${t.slug}`),
        blogs: relatedPosts.map((p) => `/blog/${p.slug}`),
        hubs: toolHubs.map((h) => h.path),
      },
      counts: {
        tools: relatedTools.length,
        blogs: relatedPosts.length,
        hubs: toolHubs.length,
      },
    };
  });

  const blogNodes = posts.map((post) => {
    const relatedTools = getRelatedToolsForPost(post, tools, 3);
    const relatedPosts = getRelatedPostsForBlog(post, posts, 2);
    const postHubs = [
      ...getHubsForBlog(post.slug, hubs),
      ...getHubsForTool(post.toolSlug, hubs),
    ].filter((h, i, arr) => arr.findIndex((x) => x.slug === h.slug) === i);
    return {
      slug: post.slug,
      path: `/blog/${post.slug}`,
      type: "blog",
      outbound: {
        primaryTool: `/tools/${post.toolSlug}`,
        tools: relatedTools.map((t) => `/tools/${t.slug}`),
        blogs: relatedPosts.map((p) => `/blog/${p.slug}`),
        hubs: postHubs.map((h) => h.path),
      },
      counts: {
        primaryTool: 1,
        tools: relatedTools.length,
        blogs: relatedPosts.length,
        hubs: postHubs.length,
      },
    };
  });

  return { hubs: hubNodes, tools: toolNodes, blogs: blogNodes };
}

function audit(graph) {
  const issues = [];

  for (const node of graph.tools) {
    if (node.counts.tools < REQUIRED.tool.tools) {
      issues.push({
        page: node.path,
        type: "tool",
        issue: `Related tools: ${node.counts.tools}/${REQUIRED.tool.tools}`,
      });
    }
    if (node.counts.blogs < REQUIRED.tool.blogs) {
      issues.push({
        page: node.path,
        type: "tool",
        issue: `Related blog posts: ${node.counts.blogs}/${REQUIRED.tool.blogs}`,
      });
    }
  }

  for (const node of graph.blogs) {
    if (node.counts.primaryTool < REQUIRED.blog.primaryTool) {
      issues.push({
        page: node.path,
        type: "blog",
        issue: "Missing primary tool CTA",
      });
    }
    if (node.counts.tools < REQUIRED.blog.tools) {
      issues.push({
        page: node.path,
        type: "blog",
        issue: `Related tools: ${node.counts.tools}/${REQUIRED.blog.tools}`,
      });
    }
    if (node.counts.blogs < REQUIRED.blog.blogs) {
      issues.push({
        page: node.path,
        type: "blog",
        issue: `Related blog posts: ${node.counts.blogs}/${REQUIRED.blog.blogs}`,
      });
    }
  }

  return issues;
}

function edgeStats(graph) {
  const edges = [];
  for (const n of graph.hubs ?? []) {
    for (const t of n.outbound.tools)
      edges.push({ from: n.path, to: t, kind: "hub→tool" });
    for (const b of n.outbound.blogs)
      edges.push({ from: n.path, to: b, kind: "hub→blog" });
    for (const h of n.outbound.hubs)
      edges.push({ from: n.path, to: h, kind: "hub→hub" });
    for (const c of n.outbound.categories)
      edges.push({ from: n.path, to: c, kind: "hub→category" });
  }
  for (const n of graph.tools) {
    for (const t of n.outbound.tools) edges.push({ from: n.path, to: t, kind: "tool→tool" });
    for (const b of n.outbound.blogs) edges.push({ from: n.path, to: b, kind: "tool→blog" });
    for (const h of n.outbound.hubs ?? [])
      edges.push({ from: n.path, to: h, kind: "tool→hub" });
  }
  for (const n of graph.blogs) {
    if (n.outbound.primaryTool)
      edges.push({ from: n.path, to: n.outbound.primaryTool, kind: "blog→tool(primary)" });
    for (const t of n.outbound.tools)
      edges.push({ from: n.path, to: t, kind: "blog→tool" });
    for (const b of n.outbound.blogs)
      edges.push({ from: n.path, to: b, kind: "blog→blog" });
    for (const h of n.outbound.hubs ?? [])
      edges.push({ from: n.path, to: h, kind: "blog→hub" });
  }

  const inbound = {};
  for (const e of edges) {
    inbound[e.to] = (inbound[e.to] ?? 0) + 1;
  }

  const byKind = {};
  for (const e of edges) {
    byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
  }

  return {
    totalEdges: edges.length,
    edgesByKind: byKind,
    topInbound: Object.entries(inbound)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([path, count]) => ({ path, inboundLinks: count })),
    edges,
    inbound,
  };
}

function buildHubAuthority(graph, inbound) {
  return (graph.hubs ?? []).map((hub) => ({
    slug: hub.slug,
    path: hub.path,
    wordCount: hub.counts.words,
    outboundTools: hub.counts.tools,
    outboundBlogs: hub.counts.blogs,
    inboundLinksFromSite: inbound[hub.path] ?? 0,
    toolsLinked: hub.outbound.tools,
    blogsLinked: hub.outbound.blogs,
  }));
}

const tools = loadTools();
const posts = loadPosts();
const hubs = loadHubs();
const graph = buildGraph(tools, posts, hubs);
const issues = audit(graph);
const stats = edgeStats(graph);
const hubAuthority = buildHubAuthority(graph, stats.inbound);

const report = {
  generatedAt: new Date().toISOString(),
  requirements: REQUIRED,
  summary: {
    hubPages: graph.hubs?.length ?? 0,
    toolPages: graph.tools.length,
    blogPages: graph.blogs.length,
    sitemapUrls:
      5 + (graph.hubs?.length ?? 0) + 5 + tools.length + posts.length,
    totalInternalEdges: stats.totalEdges,
    issuesFound: issues.length,
    pass: issues.length === 0,
  },
  hubAuthority,
  edgeStats: {
    byKind: stats.edgesByKind,
    topInbound: stats.topInbound,
  },
  issues,
  graph,
};

const outDir = path.join(ROOT, "reports");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "internal-link-graph.json");
const hubPath = path.join(outDir, "hub-authority-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
fs.writeFileSync(
  hubPath,
  JSON.stringify(
    { generatedAt: report.generatedAt, hubs: hubAuthority },
    null,
    2,
  ),
);

console.log("=== INTERNAL LINKING AUDIT ===");
console.log(`Hub pages: ${graph.hubs?.length ?? 0}`);
console.log(`Tool pages: ${graph.tools.length}`);
console.log(`Blog pages: ${graph.blogs.length}`);
console.log(`Sitemap URLs (est.): ${report.summary.sitemapUrls}`);
console.log(`Total internal edges: ${stats.totalEdges}`);
console.log("\nHub authority:");
for (const h of hubAuthority) {
  console.log(
    `  ${h.path}: ${h.wordCount} words, ${h.outboundTools} tools, ${h.outboundBlogs} blogs, ${h.inboundLinksFromSite} inbound`,
  );
}
console.log("\nEdges by kind:");
for (const [k, v] of Object.entries(stats.edgesByKind)) {
  console.log(`  ${k}: ${v}`);
}
console.log("\nTop inbound targets:");
for (const { path: p, inboundLinks } of stats.topInbound.slice(0, 10)) {
  console.log(`  ${inboundLinks} ← ${p}`);
}
console.log(`\nIssues: ${issues.length}`);
for (const i of issues) {
  console.log(`  [${i.type}] ${i.page}: ${i.issue}`);
}
console.log(`\nFull graph: ${outPath}`);
console.log(`Hub report: ${hubPath}`);
process.exit(issues.length > 0 ? 1 : 0);
