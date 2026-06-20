import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export function BlogContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:font-medium prose-a:text-[hsl(var(--accent-link))] prose-a:no-underline hover:prose-a:underline prose-li:marker:text-muted-foreground"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
