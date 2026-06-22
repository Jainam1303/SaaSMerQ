"use client";

import * as React from "react";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { jsonToCsv } from "@/lib/tools/format-utils";

export function JsonToCsvConverterTool() {
  const [input, setInput] = React.useState(
    '[\n  { "name": "MerQPrime", "email": "hello@merqprime.com", "plan": "free" },\n  { "name": "Acme Corp", "email": "billing@acme.com", "plan": "pro" }\n]',
  );
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  function handleConvert() {
    setError("");
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      setOutput(jsonToCsv(input));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not convert JSON.";
      setError(message);
      setOutput("");
    }
  }

  function downloadCsv() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="json-csv-input">JSON input</Label>
            <Textarea
              id="json-csv-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[260px] font-mono text-sm"
              placeholder='[{ "name": "Alice", "email": "alice@example.com" }]'
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="json-csv-output">CSV output</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="json-csv-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[260px] bg-muted/30 font-mono text-sm"
              placeholder="CSV appears here after conversion"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleConvert}>Convert</Button>
          <Button variant="secondary" onClick={downloadCsv} disabled={!output}>
            <Download /> Download CSV
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
