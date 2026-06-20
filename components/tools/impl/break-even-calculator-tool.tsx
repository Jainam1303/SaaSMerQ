"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR, formatNumber } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function BreakEvenCalculatorTool() {
  const [fixed, setFixed] = React.useState("50000");
  const [price, setPrice] = React.useState("500");
  const [variable, setVariable] = React.useState("300");

  const fixedCosts = Number(fixed);
  const pricePerUnit = Number(price);
  const variableCost = Number(variable);
  const contribution = pricePerUnit - variableCost;

  const units =
    contribution > 0 && fixedCosts > 0
      ? fixedCosts / contribution
      : 0;
  const revenue = units * pricePerUnit;
  const canBreakEven = contribution > 0;

  const shareText = canBreakEven
    ? [
        "Break-even Analysis",
        `Fixed costs: ${formatINR(fixedCosts)}`,
        `Price/unit: ${formatINR(pricePerUnit)}`,
        `Variable cost/unit: ${formatINR(variableCost)}`,
        `Break-even units: ${formatNumber(units, 0)}`,
        `Break-even revenue: ${formatINR(revenue)}`,
      ].join("\n")
    : "";

  return (
    <ToolWorkspace>
      <ToolInputs>
        <div className="space-y-2">
          <Label htmlFor="be-fixed">Fixed costs (₹)</Label>
          <Input
            id="be-fixed"
            type="number"
            min={0}
            value={fixed}
            onChange={(e) => setFixed(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="be-price">Selling price per unit (₹)</Label>
          <Input
            id="be-price"
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="be-variable">Variable cost per unit (₹)</Label>
          <Input
            id="be-variable"
            type="number"
            min={0}
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
          />
        </div>
        {!canBreakEven && contribution <= 0 && (
          <p className="text-sm text-destructive">
            Price must exceed variable cost per unit to reach break-even.
          </p>
        )}
      </ToolInputs>
      <ToolResults>
        <ResultPanel
          title="Break-even"
          highlight={canBreakEven ? formatNumber(units, 0) : "—"}
          highlightLabel="Units to break even"
        >
          <ResultRow
            label="Break-even revenue"
            value={canBreakEven ? formatINR(revenue) : "—"}
            emphasize
          />
          <ResultRow
            label="Contribution per unit"
            value={formatINR(contribution)}
          />
        </ResultPanel>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
