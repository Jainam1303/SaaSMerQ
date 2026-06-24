import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
  }).format(new Date(date));
}

export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col gap-4 rounded-2xl elevated-card p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-primary/25"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-card-secondary">
          {post.category}
        </span>
        <ArrowUpRight
          className="size-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold leading-snug tracking-tight">
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed text-card-secondary line-clamp-3">
          {post.description}
        </p>
      </div>
      <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted-foreground">
        <Calendar className="size-3.5" aria-hidden />
        {formatDate(post.publishedAt)}
      </div>
    </Link>
  );
}
