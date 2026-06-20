"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

type Mode = "of" | "increase" | "decrease" | "difference";

function compute(
  mode: Mode,
  a: number,
  b: number,
): { result: number; explanation: string } {
  switch (mode) {
    case "of":
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return { result: 0, explanation: "" };
      }
      const ofResult = (b * a) / 100;
      return {
        result: ofResult,
        explanation: `${a}% of ${b} = ${formatNumber(ofResult)}`,
      };
    case "increase":
      if (!Number.isFinite(a) || a === 0) {
        return { result: 0, explanation: "" };
      }
      const incPct = ((b - a) / a) * 100;
      return {
        result: incPct,
        explanation: `From ${a} to ${b} is a ${formatNumber(incPct)}% increase`,
      };
    case "decrease":
      if (!Number.isFinite(a) || a === 0) {
        return { result: 0, explanation: "" };
      }
      const decPct = ((a - b) / a) * 100;
      return {
        result: decPct,
        explanation: `From ${a} to ${b} is a ${formatNumber(decPct)}% decrease`,
      };
    case "difference":
      if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return { result: 0, explanation: "" };
      }
      const avg = (a + b) / 2;
      if (avg === 0) {
        return { result: 0, explanation: "Both values are zero." };
      }
      const diffPct = (Math.abs(a - b) / avg) * 100;
      return {
        result: diffPct,
        explanation: `Difference between ${a} and ${b} is ${formatNumber(diffPct)}%`,
      };
    default:
      return { result: 0, explanation: "" };
  }
}

export function PercentageCalculatorTool() {
  const [mode, setMode] = React.useState<Mode>("of");
  const [percent, setPercent] = React.useState("15");
  const [value, setValue] = React.useState("200");
  const [oldVal, setOldVal] = React.useState("100");
  const [newVal, setNewVal] = React.useState("125");
  const [valA, setValA] = React.useState("80");
  const [valB, setValB] = React.useState("100");

  const { result, explanation } = React.useMemo(() => {
    switch (mode) {
      case "of":
        return compute("of", Number(percent), Number(value));
      case "increase":
        return compute("increase", Number(oldVal), Number(newVal));
      case "decrease":
        return compute("decrease", Number(oldVal), Number(newVal));
      case "difference":
        return compute("difference", Number(valA), Number(valB));
    }
  }, [mode, percent, value, oldVal, newVal, valA, valB]);

  const shareText = `Percentage Calculator\n${explanation}\nResult: ${formatNumber(result)}`;

  const displayResult =
    mode === "of" ? formatNumber(result) : `${formatNumber(result)}%`;

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
          <TabsTrigger value="of">X% of Y</TabsTrigger>
          <TabsTrigger value="increase">Increase</TabsTrigger>
          <TabsTrigger value="decrease">Decrease</TabsTrigger>
          <TabsTrigger value="difference">Difference</TabsTrigger>
        </TabsList>
      </Tabs>

      <ToolWorkspace>
        <ToolInputs>
            {mode === "of" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pct-percent">Percentage (X)</Label>
                  <Input
                    id="pct-percent"
                    type="number"
                    inputMode="decimal"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pct-value">Value (Y)</Label>
                  <Input
                    id="pct-value"
                    type="number"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </>
            )}

            {(mode === "increase" || mode === "decrease") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pct-old">Original value</Label>
                  <Input
                    id="pct-old"
                    type="number"
                    inputMode="decimal"
                    value={oldVal}
                    onChange={(e) => setOldVal(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pct-new">New value</Label>
                  <Input
                    id="pct-new"
                    type="number"
                    inputMode="decimal"
                    value={newVal}
                    onChange={(e) => setNewVal(e.target.value)}
                  />
                </div>
              </>
            )}

            {mode === "difference" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pct-a">Value A</Label>
                  <Input
                    id="pct-a"
                    type="number"
                    inputMode="decimal"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pct-b">Value B</Label>
                  <Input
                    id="pct-b"
                    type="number"
                    inputMode="decimal"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                  />
                </div>
              </>
            )}
        </ToolInputs>

        <ToolResults>
          <ResultPanel title="Result" highlight={displayResult}>
            {explanation && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {explanation}
              </p>
            )}
          </ResultPanel>
          <ResultActions text={shareText} />
        </ToolResults>
      </ToolWorkspace>
    </div>
  );
}
