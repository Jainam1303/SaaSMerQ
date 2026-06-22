"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";
import {
  countParagraphs,
  countSentences,
  countWords,
} from "@/lib/tools/text-utils";

function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0 min";
  if (minutes < 1) {
    const seconds = Math.max(1, Math.round(minutes * 60));
    return `${seconds} sec`;
  }
  if (minutes < 10) return `${minutes.toFixed(1)} min`;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

export function WordCounterTool() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => {
    const words = countWords(text);
    const characters = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const readingMinutes = words / 200;
    const speakingMinutes = words / 130;

    return {
      words,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTime: formatMinutes(readingMinutes),
      speakingTime: formatMinutes(speakingMinutes),
    };
  }, [text]);

  return (
    <Card>
      <CardContent className="p-6">
        <ToolWorkspace>
          <ToolInputs>
            <div className="space-y-2">
              <Label htmlFor="wc-input">Your text</Label>
              <Textarea
                id="wc-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here…"
                className="min-h-[320px] text-sm leading-relaxed"
              />
            </div>
          </ToolInputs>

          <ToolResults>
            <ResultPanel
              title="Statistics"
              highlight={stats.words.toLocaleString()}
              highlightLabel="Words"
            >
              <ResultRow
                label="Characters"
                value={stats.characters.toLocaleString()}
              />
              <ResultRow
                label="Characters (no spaces)"
                value={stats.charsNoSpaces.toLocaleString()}
              />
              <ResultRow
                label="Sentences"
                value={stats.sentences.toLocaleString()}
              />
              <ResultRow
                label="Paragraphs"
                value={stats.paragraphs.toLocaleString()}
              />
              <ResultRow label="Reading time" value={stats.readingTime} />
              <ResultRow label="Speaking time" value={stats.speakingTime} />
            </ResultPanel>
          </ToolResults>
        </ToolWorkspace>
      </CardContent>
    </Card>
  );
}
