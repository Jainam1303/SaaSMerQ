"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import {
  generateLoremParagraphs,
  generateLoremSentences,
  generateLoremWords,
} from "@/lib/tools/text-utils";

type Mode = "paragraphs" | "sentences" | "words";

const DEFAULT_COUNTS: Record<Mode, number> = {
  paragraphs: 3,
  sentences: 5,
  words: 50,
};

export function LoremIpsumGeneratorTool() {
  const [mode, setMode] = React.useState<Mode>("paragraphs");
  const [count, setCount] = React.useState(String(DEFAULT_COUNTS.paragraphs));
  const [output, setOutput] = React.useState(() =>
    generateLoremParagraphs(DEFAULT_COUNTS.paragraphs),
  );

  function handleModeChange(next: Mode) {
    setMode(next);
    setCount(String(DEFAULT_COUNTS[next]));
  }

  function generate() {
    const n = Math.min(Math.max(Math.round(Number(count) || 1), 1), 500);
    switch (mode) {
      case "paragraphs":
        setOutput(generateLoremParagraphs(n));
        break;
      case "sentences":
        setOutput(generateLoremSentences(n));
        break;
      case "words":
        setOutput(generateLoremWords(n));
        break;
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Tabs value={mode} onValueChange={(v) => handleModeChange(v as Mode)}>
          <TabsList>
            <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
            <TabsTrigger value="sentences">Sentences</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="lorem-count">
              {mode === "paragraphs"
                ? "Paragraph count"
                : mode === "sentences"
                  ? "Sentence count"
                  : "Word count"}
            </Label>
            <Input
              id="lorem-count"
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-32"
            />
          </div>
          <Button onClick={generate}>Generate</Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="lorem-output">Generated text</Label>
            {output && <CopyButton value={output} />}
          </div>
          <Textarea
            id="lorem-output"
            value={output}
            readOnly
            className="min-h-[260px] bg-muted/30 text-sm leading-relaxed"
            placeholder="Click Generate to create placeholder text"
          />
        </div>
      </CardContent>
    </Card>
  );
}
