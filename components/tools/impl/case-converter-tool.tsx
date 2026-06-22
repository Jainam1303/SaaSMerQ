"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import {
  toCamelCase,
  toKebabCase,
  toSentenceCase,
  toSnakeCase,
  toTitleCase,
} from "@/lib/tools/text-utils";

type CaseType =
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab"
  | "upper"
  | "lower";

const CASES: { id: CaseType; label: string }[] = [
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
];

function convert(text: string, type: CaseType): string {
  switch (type) {
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
  }
}

export function CaseConverterTool() {
  const [input, setInput] = React.useState(
    "MerQPrime free online tools for everyone",
  );
  const [activeCase, setActiveCase] = React.useState<CaseType>("title");

  const output = React.useMemo(
    () => convert(input, activeCase),
    [input, activeCase],
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="case-input">Input text</Label>
          <Textarea
            id="case-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[160px] text-sm"
            placeholder="Enter text to convert…"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CASES.map(({ id, label }) => (
            <Button
              key={id}
              variant={activeCase === id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCase(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="case-output">Output</Label>
            {output && <CopyButton value={output} />}
          </div>
          <Textarea
            id="case-output"
            value={output}
            readOnly
            className="min-h-[120px] bg-muted/30 font-mono text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
