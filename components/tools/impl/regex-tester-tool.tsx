"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FLAG_OPTIONS = [
  { key: "g", label: "g" },
  { key: "i", label: "i" },
  { key: "m", label: "m" },
  { key: "s", label: "s" },
  { key: "u", label: "u" },
] as const;

type FlagKey = (typeof FLAG_OPTIONS)[number]["key"];

interface MatchSegment {
  text: string;
  match: boolean;
}

function getMatchSegments(text: string, regex: RegExp): MatchSegment[] {
  if (!text) return [];
  const segments: MatchSegment[] = [];
  let lastIndex = 0;
  const global = regex.global;
  const re = global ? regex : new RegExp(regex.source, regex.flags + "g");

  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start), match: false });
    }
    segments.push({ text: match[0], match: true });
    lastIndex = start + match[0].length;
    if (!global) break;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false });
  }

  return segments;
}

export function RegexTesterTool() {
  const [pattern, setPattern] = React.useState("\\w+");
  const [flags, setFlags] = React.useState<Record<FlagKey, boolean>>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  });
  const [testString, setTestString] = React.useState(
    "Hello MerQPrime — test your regex here.",
  );
  const [error, setError] = React.useState("");
  const [matchCount, setMatchCount] = React.useState(0);
  const [segments, setSegments] = React.useState<MatchSegment[]>([]);

  React.useEffect(() => {
    setError("");
    if (!pattern) {
      setSegments([{ text: testString, match: false }]);
      setMatchCount(0);
      return;
    }
    const flagStr = FLAG_OPTIONS.filter((f) => flags[f.key])
      .map((f) => f.key)
      .join("");
    try {
      const regex = new RegExp(pattern, flagStr);
      const segs = getMatchSegments(testString, regex);
      setSegments(segs.length ? segs : [{ text: testString, match: false }]);
      setMatchCount(segs.filter((s) => s.match).length);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid regular expression.";
      setError(message);
      setSegments([{ text: testString, match: false }]);
      setMatchCount(0);
    }
  }, [pattern, flags, testString]);

  function toggleFlag(key: FlagKey) {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="regex-pattern">Pattern</Label>
          <Input
            id="regex-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            className="font-mono"
            placeholder="Enter regex pattern"
          />
        </div>

        <div className="space-y-2">
          <Label>Flags</Label>
          <div className="flex flex-wrap gap-4">
            {FLAG_OPTIONS.map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={flags[key]}
                  onChange={() => toggleFlag(key)}
                  className="size-4 rounded border-input"
                />
                <span className="font-mono">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="regex-test">Test string</Label>
          <Textarea
            id="regex-test"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            spellCheck={false}
            className="min-h-[120px] font-mono text-sm"
            placeholder="Text to test against"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Matches</Label>
            {!error && (
              <span className="text-sm text-muted-foreground">
                {matchCount} match{matchCount === 1 ? "" : "es"}
              </span>
            )}
          </div>
          <div
            className={cn(
              "min-h-[120px] whitespace-pre-wrap break-words rounded-lg border border-input bg-muted/30 p-3 font-mono text-sm",
            )}
            aria-live="polite"
          >
            {segments.map((seg, i) =>
              seg.match ? (
                <mark
                  key={i}
                  className="rounded bg-amber-300/70 px-0.5 text-foreground dark:bg-amber-500/40"
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </div>
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
