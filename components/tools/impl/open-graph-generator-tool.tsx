"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function OpenGraphGeneratorTool() {
  const [ogTitle, setOgTitle] = React.useState("MerQPrime — Free Online Tools");
  const [ogDescription, setOgDescription] = React.useState(
    "Free online tools for business, developers, SEO and everyday tasks.",
  );
  const [ogImage, setOgImage] = React.useState(
    "https://merqprime.in/og-image.png",
  );
  const [ogUrl, setOgUrl] = React.useState("https://merqprime.in/");

  const snippet = React.useMemo(() => {
    const lines: string[] = [];
    if (ogTitle.trim()) {
      lines.push(
        `<meta property="og:title" content="${escapeAttr(ogTitle.trim())}">`,
      );
    }
    if (ogDescription.trim()) {
      lines.push(
        `<meta property="og:description" content="${escapeAttr(ogDescription.trim())}">`,
      );
    }
    if (ogImage.trim()) {
      lines.push(
        `<meta property="og:image" content="${escapeAttr(ogImage.trim())}">`,
      );
    }
    if (ogUrl.trim()) {
      lines.push(
        `<meta property="og:url" content="${escapeAttr(ogUrl.trim())}">`,
      );
    }
    lines.push(`<meta property="og:type" content="website">`);
    return lines.join("\n");
  }, [ogTitle, ogDescription, ogImage, ogUrl]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="og-title">og:title</Label>
            <Input
              id="og-title"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Social share title"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="og-description">og:description</Label>
            <Textarea
              id="og-description"
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              rows={3}
              placeholder="Short description for social previews"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og-image">og:image URL</Label>
            <Input
              id="og-image"
              type="url"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://example.com/image.png"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="og-url">og:url</Label>
            <Input
              id="og-url"
              type="url"
              value={ogUrl}
              onChange={(e) => setOgUrl(e.target.value)}
              placeholder="https://example.com/page"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="og-output">Open Graph meta tags</Label>
            <CopyButton value={snippet} />
          </div>
          <Textarea
            id="og-output"
            value={snippet}
            readOnly
            spellCheck={false}
            className="min-h-[160px] bg-muted/30 font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}
