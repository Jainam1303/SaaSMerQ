"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { beautifySql, minifySql } from "@/lib/tools/format-utils";

export function SqlFormatterTool() {
  const [input, setInput] = React.useState(
    "select id, name from users where active = true order by created_at desc limit 10",
  );
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  function handle(action: "beautify" | "minify") {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(action === "beautify" ? beautifySql(input) : minifySql(input));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not format SQL.";
      setError(message);
      setOutput("");
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sql-input">Input SQL</Label>
            <Textarea
              id="sql-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-sm"
              placeholder="Paste SQL here"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sql-output">Output</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="sql-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[260px] bg-muted/30 font-mono text-sm"
              placeholder="Formatted output appears here"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handle("beautify")}>Beautify</Button>
          <Button variant="secondary" onClick={() => handle("minify")}>
            Minify
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
