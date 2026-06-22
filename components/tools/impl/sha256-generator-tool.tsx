"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function Sha256GeneratorTool() {
  const [input, setInput] = React.useState("MerQPrime");
  const [hash, setHash] = React.useState("");

  React.useEffect(() => {
    if (!input) {
      setHash("");
      return;
    }
    let cancelled = false;
    const data = new TextEncoder().encode(input);
    crypto.subtle.digest("SHA-256", data).then((buffer) => {
      if (!cancelled) setHash(bufferToHex(buffer));
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="sha256-input">Input text</Label>
          <Textarea
            id="sha256-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[160px] font-mono text-sm"
            placeholder="Text to hash"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sha256-output">SHA-256 hash</Label>
            {hash && <CopyButton value={hash} />}
          </div>
          <Textarea
            id="sha256-output"
            value={hash}
            readOnly
            spellCheck={false}
            className="min-h-[80px] bg-muted/30 font-mono text-sm"
            placeholder="Hash appears here as you type"
          />
        </div>
      </CardContent>
    </Card>
  );
}
