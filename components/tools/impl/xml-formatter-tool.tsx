"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { beautifyXml, minifyXml, validateXml } from "@/lib/tools/format-utils";

type Status =
  | { kind: "idle" }
  | { kind: "valid"; message: string }
  | { kind: "error"; message: string };

export function XmlFormatterTool() {
  const [input, setInput] = React.useState(
    '<root><item id="1"><name>MerQPrime</name></item></root>',
  );
  const [output, setOutput] = React.useState("");
  const [status, setStatus] = React.useState<Status>({ kind: "idle" });

  function handle(action: "beautify" | "minify" | "validate") {
    if (action === "validate") {
      const result = validateXml(input);
      setStatus(
        result.valid
          ? { kind: "valid", message: result.message }
          : { kind: "error", message: result.message },
      );
      return;
    }
    try {
      const result =
        action === "beautify" ? beautifyXml(input) : minifyXml(input);
      setOutput(result);
      setStatus({ kind: "valid", message: "Valid XML." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid XML.";
      setStatus({ kind: "error", message });
      setOutput("");
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="xml-input">Input XML</Label>
            <Textarea
              id="xml-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-sm"
              placeholder="<root>...</root>"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="xml-output">Output</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="xml-output"
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
