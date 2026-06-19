"use client";

import * as React from "react";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { isSafeHttpUrl } from "@/lib/security";

const CHANGE_FREQ = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function SitemapGeneratorTool() {
  const [urls, setUrls] = React.useState(
    "https://merqprime.in/\nhttps://merqprime.in/tools",
  );
  const [changefreq, setChangefreq] = React.useState("weekly");
  const [priority, setPriority] = React.useState("0.8");
  const [lastmod, setLastmod] = React.useState(
    new Date().toISOString().slice(0, 10),
  );

  const { xml, valid, invalid } = React.useMemo(() => {
    const lines = urls
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const validUrls: string[] = [];
    const invalidUrls: string[] = [];
    const seen = new Set<string>();

    for (const line of lines) {
      if (isSafeHttpUrl(line) && !seen.has(line)) {
        seen.add(line);
        validUrls.push(line);
      } else if (!isSafeHttpUrl(line)) {
        invalidUrls.push(line);
      }
    }

    const entries = validUrls
      .map((url) => {
        const parts = [`    <loc>${escapeXml(url)}</loc>`];
        if (lastmod) parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
        if (changefreq)
          parts.push(`    <changefreq>${changefreq}</changefreq>`);
        if (priority) parts.push(`    <priority>${priority}</priority>`);
        return `  <url>\n${parts.join("\n")}\n  </url>`;
      })
      .join("\n");

    const doc = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;

    return { xml: doc, valid: validUrls.length, invalid: invalidUrls };
  }, [urls, changefreq, priority, lastmod]);

  function download() {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sm-urls">URLs (one per line)</Label>
            <Textarea
              id="sm-urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-sm"
              placeholder="https://example.com/"
            />
            <p className="text-xs text-muted-foreground">
              {valid} valid URL{valid === 1 ? "" : "s"}
              {invalid.length > 0 && ` · ${invalid.length} ignored`}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sm-output">Generated sitemap.xml</Label>
              <CopyButton value={xml} />
            </div>
            <Textarea
              id="sm-output"
              value={xml}
              readOnly
              spellCheck={false}
              className="min-h-[260px] bg-muted/30 font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sm-freq">Change frequency</Label>
            <Select
              id="sm-freq"
              value={changefreq}
              onChange={(e) => setChangefreq(e.target.value)}
            >
              {CHANGE_FREQ.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sm-priority">Priority</Label>
            <Select
              id="sm-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.3"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sm-lastmod">Last modified</Label>
            <Input
              id="sm-lastmod"
              type="date"
              value={lastmod}
              onChange={(e) => setLastmod(e.target.value)}
            />
          </div>
        </div>

        {invalid.length > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>
              {invalid.length} line(s) were ignored because they are not valid
              http/https URLs.
            </span>
          </div>
        )}

        <Button onClick={download} disabled={valid === 0}>
          <Download /> Download sitemap.xml
        </Button>
      </CardContent>
    </Card>
  );
}
