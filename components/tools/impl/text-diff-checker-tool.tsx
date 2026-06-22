"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { diffLines } from "@/lib/tools/format-utils";
import { cn } from "@/lib/utils";

export function TextDiffCheckerTool() {
  const [left, setLeft] = React.useState("Line one\nLine two\nLine three");
  const [right, setRight] = React.useState("Line one\nLine two changed\nLine three\nLine four");
  const diff = React.useMemo(() => diffLines(left, right), [left, right]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="diff-left">Original text</Label>
            <Textarea
              id="diff-left"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              spellCheck={false}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Paste original text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diff-right">Modified text</Label>
            <Textarea
              id="diff-right"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              spellCheck={false}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Paste modified text"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Diff output</Label>
          <div
            className="min-h-[200px] overflow-x-auto rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm"
            aria-live="polite"
          >
            {diff.every((line) => line.type === "same") ? (
              <p className="text-muted-foreground">No differences.</p>
            ) : (
              diff.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap break-words px-2 py-0.5",
                    line.type === "add" &&
                      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
                    line.type === "remove" &&
                      "bg-red-500/15 text-red-700 dark:text-red-400",
                  )}
                >
                  {line.type === "add" && "+ "}
                  {line.type === "remove" && "- "}
                  {line.type === "same" && "  "}
                  {line.text || "\u00a0"}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
