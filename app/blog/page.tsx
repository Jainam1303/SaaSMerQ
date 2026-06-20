import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: `Guides and explainers on calculators, converters, security and everyday utilities — from ${siteConfig.shortName}.`,
  path: "/blog",
  keywords: [
    "merqprime blog",
    "emi guide",
    "sip guide",
    "gst guide",
    "online tools guides",
  ],
});

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="container space-y-12 py-10 md:space-y-14 md:py-14">
      <header className="mx-auto max-w-3xl space-y-4 text-center md:text-left">
        <p className="section-eyebrow">Blog</p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          Guides &amp; explainers
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Practical articles on finance calculators, converters, security and
          online tools — with free MerQPrime utilities linked in every guide.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </div>
      )}
    </div>
  );
}
