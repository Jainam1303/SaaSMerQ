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

export function ProfitMarginCalculatorTool() {
  const [cost, setCost] = React.useState("400");
  const [selling, setSelling] = React.useState("600");

  const costPrice = Number(cost);
  const sellingPrice = Number(selling);

  const profit =
    Number.isFinite(costPrice) && Number.isFinite(sellingPrice)
      ? sellingPrice - costPrice
      : 0;
  const margin =
    sellingPrice > 0 && Number.isFinite(profit)
      ? (profit / sellingPrice) * 100
      : 0;
  const markup =
    costPrice > 0 && Number.isFinite(profit)
      ? (profit / costPrice) * 100
      : 0;

  const shareText = [
    "Profit Margin",
    `Cost: ${formatINR(costPrice)}`,
    `Selling: ${formatINR(sellingPrice)}`,
    `Profit: ${formatINR(profit)}`,
    `Margin: ${formatNumber(margin, 2)}%`,
    `Markup: ${formatNumber(markup, 2)}%`,
  ].join("\n");

  return (
    <ToolWorkspace>
      <ToolInputs>
        <div className="space-y-2">
          <Label htmlFor="margin-cost">Cost price (₹)</Label>
          <Input
            id="margin-cost"
            type="number"
            min={0}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="margin-selling">Selling price (₹)</Label>
          <Input
            id="margin-selling"
            type="number"
            min={0}
            value={selling}
            onChange={(e) => setSelling(e.target.value)}
          />
        </div>
      </ToolInputs>
      <ToolResults>
        <ResultPanel
          title="Margin summary"
          highlight={`${formatNumber(margin, 2)}%`}
          highlightLabel="Gross margin"
        >
          <ResultRow label="Profit" value={formatINR(profit)} emphasize />
          <ResultRow
            label="Markup"
            value={`${formatNumber(markup, 2)}%`}
          />
          <ResultRow label="Revenue" value={formatINR(sellingPrice)} />
          <ResultRow label="Cost" value={formatINR(costPrice)} />
        </ResultPanel>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
