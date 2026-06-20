import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog/types";
import { BlogCard } from "@/components/blog/blog-card";

export function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="space-y-6">
      <div className="space-y-2">
        <p className="section-eyebrow">Keep reading</p>
        <h2
          id="related-posts-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Related articles
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
      </div>
    </section>
  );
}

export function ToolCta({
  toolSlug,
  toolName,
}: {
  toolSlug: string;
  toolName: string;
}) {
  return (
    <aside
      className="rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-sm"
      aria-label="Try the free tool"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background">
          <Wrench className="size-5" aria-hidden />
        </span>
        <div className="space-y-3">
          <h2 className="font-semibold tracking-tight">Try it free on MerQPrime</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Use our free <strong className="font-medium text-foreground">{toolName}</strong> —
            instant results in your browser, no sign-up required.
          </p>
          <Link
            href={`/tools/${toolSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent-link))] hover:underline"
          >
            Open {toolName}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
