"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { slugify } from "@/lib/tools/text-utils";

export function SlugGeneratorTool() {
  const [input, setInput] = React.useState(
    "MerQPrime Free Online Tools for Everyone",
  );

  const slug = React.useMemo(() => slugify(input), [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="slug-input">Title or text</Label>
          <Input
            id="slug-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a title or phrase…"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="slug-output">URL slug</Label>
            {slug && <CopyButton value={slug} />}
          </div>
          <div
            id="slug-output"
            className="flex min-h-11 items-center rounded-lg border border-input bg-muted/30 px-3 py-2 font-mono text-sm"
          >
            {slug || (
              <span className="text-muted-foreground">
                Slug appears here as you type
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
