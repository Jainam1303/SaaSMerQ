"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CopyButton } from "@/components/copy-button";

type Status =
  | { kind: "idle" }
  | { kind: "valid"; message: string }
  | { kind: "error"; message: string };

export function JsonFormatterTool() {
  const [input, setInput] = React.useState(
    '{"name":"MerQPrime","tools":10,"free":true}',
  );
  const [output, setOutput] = React.useState("");
  const [indent, setIndent] = React.useState("2");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  function getIndent(): string | number {
    if (indent === "tab") return "\t";
    return Number(indent);
  }

  function parse(): unknown {
    return JSON.parse(input);
  }

  function handle(action: "format" | "minify" | "validate") {
    try {
      const parsed = parse();
      if (action === "validate") {
        setStatus({ kind: "valid", message: "Valid JSON." });
        return;
      }
      const result =
        action === "minify"
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, getIndent());
      setOutput(result);
      setStatus({ kind: "valid", message: "Valid JSON." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid JSON.";
      setStatus({ kind: "error", message });
      if (action !== "validate") setOutput("");
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="json-input">Input JSON</Label>
            <Textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-sm"
              placeholder='{ "paste": "your JSON here" }'
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-output">Output</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="json-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[260px] bg-muted/30 font-mono text-sm"
              placeholder="Formatted output appears here"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="json-indent">Indentation</Label>
            <Select
              id="json-indent"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
              className="w-36"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </Select>
          </div>
          <Button onClick={() => handle("format")}>Format</Button>
          <Button variant="secondary" onClick={() => handle("minify")}>
            Minify
          </Button>
          <Button variant="outline" onClick={() => handle("validate")}>
            Validate
          </Button>
        </div>

        {status.kind === "valid" && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" /> {status.message}
          </div>
        )}
        {status.kind === "error" && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span className="font-mono">{status.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
