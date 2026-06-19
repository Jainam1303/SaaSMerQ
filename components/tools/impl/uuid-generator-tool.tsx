"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

function uuidv4(): string {
  const c = globalThis.crypto;
  if (typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Fallback for older browsers using secure random bytes.
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

export function UuidGeneratorTool() {
  const [count, setCount] = React.useState(5);
  const [uuids, setUuids] = React.useState<string[]>([]);

  const generate = React.useCallback(() => {
    const safeCount = Math.min(Math.max(Math.floor(count) || 1, 1), 1000);
    setUuids(Array.from({ length: safeCount }, () => uuidv4()));
  }, [count]);

  React.useEffect(() => {
    generate();
    // Generate an initial batch only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="uuid-count">How many?</Label>
            <Input
              id="uuid-count"
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <Button onClick={generate}>
            <RefreshCw /> Generate
          </Button>
          <CopyButton
            value={uuids.join("\n")}
            label="Copy all"
            size="default"
            variant="secondary"
          />
        </div>

        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {uuids.map((id, i) => (
            <li
              key={`${id}-${i}`}
              className="flex items-center justify-between gap-2 bg-card px-3 py-2"
            >
              <code className="truncate font-mono text-sm">{id}</code>
              <CopyButton value={id} label="" aria-label={`Copy ${id}`} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
