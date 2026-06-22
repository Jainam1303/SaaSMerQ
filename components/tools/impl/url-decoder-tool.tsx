"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

export function UrlDecoderTool() {
  const [input, setInput] = React.useState("Hello%20World%21%20search%3DMerQPrime");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setError("");
    if (!input) {
      setOutput("");
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
    } catch {
      setOutput("");
      setError("Input is not valid URL-encoded text.");
    }
  }, [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="url-decode-input">URL-encoded text</Label>
            <Textarea
              id="url-decode-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Encoded text to decode"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url-decode-output">Decoded</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="url-decode-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[200px] bg-muted/30 font-mono text-sm"
              placeholder="Decoded output appears here"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
