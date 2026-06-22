"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

export function UrlEncoderTool() {
  const [input, setInput] = React.useState("Hello World! search=MerQPrime");
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    setOutput(input ? encodeURIComponent(input) : "");
  }, [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="url-encode-input">Plain text</Label>
            <Textarea
              id="url-encode-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Text to encode"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="url-encode-output">Encoded (encodeURIComponent)</Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="url-encode-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[200px] bg-muted/30 font-mono text-sm"
              placeholder="Encoded output appears here"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
