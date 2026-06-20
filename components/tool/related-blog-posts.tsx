import type { BlogPostMeta } from "@/lib/blog/types";
import { BlogCard } from "@/components/blog/blog-card";

export function RelatedBlogPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="related-blog-heading" className="space-y-6">
      <div className="space-y-2">
        <p className="section-eyebrow">Learn more</p>
        <h2
          id="related-blog-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Related guides
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
      </div>
    </section>
  );
}
