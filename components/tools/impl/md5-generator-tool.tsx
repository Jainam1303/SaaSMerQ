"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { md5 } from "@/lib/tools/md5";

export function Md5GeneratorTool() {
  const [input, setInput] = React.useState("MerQPrime");
  const [hash, setHash] = React.useState("");

  React.useEffect(() => {
    setHash(input ? md5(input) : "");
  }, [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="md5-input">Input text</Label>
          <Textarea
            id="md5-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[160px] font-mono text-sm"
            placeholder="Text to hash"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="md5-output">MD5 hash</Label>
            {hash && <CopyButton value={hash} />}
          </div>
          <Textarea
            id="md5-output"
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
