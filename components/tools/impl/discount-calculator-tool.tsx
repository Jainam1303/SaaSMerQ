"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatINR, formatNumber } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

type Mode = "percent" | "flat" | "reverse";

export function DiscountCalculatorTool() {
  const [mode, setMode] = React.useState<Mode>("percent");
  const [original, setOriginal] = React.useState("1000");
  const [discountPct, setDiscountPct] = React.useState("20");
  const [discountFlat, setDiscountFlat] = React.useState("200");
  const [discountedPrice, setDiscountedPrice] = React.useState("800");

  const result = React.useMemo(() => {
    if (mode === "percent") {
      const price = Number(original);
      const pct = Number(discountPct);
      if (!Number.isFinite(price) || price <= 0) return null;
      const discountAmount = (price * pct) / 100;
      const finalPrice = price - discountAmount;
      return {
        highlight: formatINR(finalPrice),
        highlightLabel: "Final price",
        discountAmount,
        finalPrice,
        savingsPct: pct,
        explanation: `${pct}% off ${formatINR(price)}`,
      };
    }
    if (mode === "flat") {
      const price = Number(original);
      const flat = Number(discountFlat);
      if (!Number.isFinite(price) || price <= 0) return null;
      const finalPrice = Math.max(price - flat, 0);
      const savingsPct = price > 0 ? (flat / price) * 100 : 0;
      return {
        highlight: formatINR(finalPrice),
        highlightLabel: "Final price",
        discountAmount: flat,
        finalPrice,
        savingsPct,
        explanation: `${formatINR(flat)} off ${formatINR(price)}`,
      };
    }
    const finalP = Number(discountedPrice);
    const pct = Number(discountPct);
    if (!Number.isFinite(finalP) || finalP <= 0 || pct <= 0 || pct >= 100)
      return null;
    const originalPrice = finalP / (1 - pct / 100);
    const discountAmount = originalPrice - finalP;
    return {
      highlight: formatINR(originalPrice),
      highlightLabel: "Original price",
      discountAmount,
      finalPrice: finalP,
      savingsPct: pct,
      explanation: `Original before ${pct}% discount`,
    };
  }, [mode, original, discountPct, discountFlat, discountedPrice]);

  const shareText = result
    ? [
        "Discount Calculation",
        result.explanation,
        `Discount: ${formatINR(result.discountAmount)}`,
        `Savings: ${formatNumber(result.savingsPct, 2)}%`,
        `Final: ${formatINR(result.finalPrice)}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="disc-mode">Calculation mode</Label>
        <Select
          id="disc-mode"
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
        >
          <option value="percent">Percent discount</option>
          <option value="flat">Flat amount off</option>
          <option value="reverse">Find original from sale price</option>
        </Select>
      </div>

      <ToolWorkspace>
        <ToolInputs>
          {mode !== "reverse" && (
            <div className="space-y-2">
              <Label htmlFor="disc-original">Original price (₹)</Label>
              <Input
                id="disc-original"
                type="number"
                min={0}
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </div>
          )}
          {(mode === "percent" || mode === "reverse") && (
            <div className="space-y-2">
              <Label htmlFor="disc-pct">Discount (%)</Label>
              <Input
                id="disc-pct"
                type="number"
                min={0}
                max={100}
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
              />
            </div>
          )}
          {mode === "flat" && (
            <div className="space-y-2">
              <Label htmlFor="disc-flat">Discount amount (₹)</Label>
              <Input
                id="disc-flat"
                type="number"
                min={0}
                value={discountFlat}
                onChange={(e) => setDiscountFlat(e.target.value)}
              />
            </div>
          )}
          {mode === "reverse" && (
            <div className="space-y-2">
              <Label htmlFor="disc-sale">Discounted / sale price (₹)</Label>
              <Input
                id="disc-sale"
                type="number"
                min={0}
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
              />
            </div>
          )}
        </ToolInputs>
        <ToolResults>
          <ResultPanel
            title="Discount summary"
            highlight={result?.highlight ?? "—"}
            highlightLabel={result?.highlightLabel}
          >
            {result && (
              <>
                <ResultRow
                  label="Discount amount"
                  value={formatINR(result.discountAmount)}
                />
                <ResultRow
                  label="Final price"
                  value={formatINR(result.finalPrice)}
                  emphasize
                />
                <ResultRow
                  label="Savings"
                  value={`${formatNumber(result.savingsPct, 2)}%`}
                />
              </>
            )}
          </ResultPanel>
          <ResultActions text={shareText} />
        </ToolResults>
      </ToolWorkspace>
    </div>
  );
}
