"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function MetaTagGeneratorTool() {
  const [title, setTitle] = React.useState("MerQPrime — Free Online Tools");
  const [description, setDescription] = React.useState(
    "Free online tools for business, developers, SEO and everyday tasks. Fast, private, and no signup required.",
  );
  const [keywords, setKeywords] = React.useState(
    "online tools, free tools, calculators, generators",
  );
  const [canonical, setCanonical] = React.useState("https://merqprime.in/");
  const [robots, setRobots] = React.useState<"index" | "noindex">("index");

  const snippet = React.useMemo(() => {
    const lines: string[] = [];
    if (title.trim()) {
      lines.push(`<title>${escapeAttr(title.trim())}</title>`);
    }
    if (description.trim()) {
      lines.push(
        `<meta name="description" content="${escapeAttr(description.trim())}">`,
      );
    }
    if (keywords.trim()) {
      lines.push(
        `<meta name="keywords" content="${escapeAttr(keywords.trim())}">`,
      );
    }
    if (canonical.trim()) {
      lines.push(
        `<link rel="canonical" href="${escapeAttr(canonical.trim())}">`,
      );
    }
    const robotsContent =
      robots === "index" ? "index, follow" : "noindex, nofollow";
    lines.push(`<meta name="robots" content="${robotsContent}">`);
    return lines.join("\n");
  }, [title, description, keywords, canonical, robots]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="meta-title">Page title</Label>
            <Input
              id="meta-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your page title"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="meta-description">Meta description</Label>
            <Textarea
              id="meta-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description for search results"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="meta-keywords">Keywords</Label>
            <Input
              id="meta-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword one, keyword two"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-canonical">Canonical URL</Label>
            <Input
              id="meta-canonical"
              type="url"
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              placeholder="https://example.com/page"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-robots">Robots</Label>
            <Select
              id="meta-robots"
              value={robots}
              onChange={(e) => setRobots(e.target.value as typeof robots)}
            >
              <option value="index">index, follow</option>
              <option value="noindex">noindex, nofollow</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="meta-output">HTML snippet</Label>
            <CopyButton value={snippet} />
          </div>
          <Textarea
            id="meta-output"
            value={snippet}
            readOnly
            spellCheck={false}
            className="min-h-[180px] bg-muted/30 font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
