"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR } from "@/lib/format";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

const SLABS = ["5", "12", "18", "28", "custom"];

export function GstCalculatorTool() {
  const [mode, setMode] = React.useState<"add" | "remove">("add");
  const [amount, setAmount] = React.useState("1000");
  const [slab, setSlab] = React.useState("18");
  const [customRate, setCustomRate] = React.useState("18");
  const [interState, setInterState] = React.useState(false);

  const rate = slab === "custom" ? Number(customRate) : Number(slab);
  const base = Math.max(Number(amount) || 0, 0);

  const { net, tax, gross } = React.useMemo(() => {
    const r = Math.max(rate, 0) / 100;
    if (mode === "add") {
      const taxAmt = base * r;
      return { net: base, tax: taxAmt, gross: base + taxAmt };
    }
    const netAmt = base / (1 + r);
    return { net: netAmt, tax: base - netAmt, gross: base };
  }, [base, rate, mode]);

  return (
    <ToolWorkspace>
      <ToolInputs>
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList className="w-full">
            <TabsTrigger value="add" className="flex-1">
              Add GST
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex-1">
              Remove GST
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="gst-amount">
            {mode === "add" ? "Net amount (₹)" : "Gross amount (₹)"}
          </Label>
          <Input
            id="gst-amount"
            type="number"
            inputMode="decimal"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst-slab">GST rate</Label>
          <Select
            id="gst-slab"
            value={slab}
            onChange={(e) => setSlab(e.target.value)}
          >
            {SLABS.map((s) => (
              <option key={s} value={s}>
                {s === "custom" ? "Custom" : `${s}%`}
              </option>
            ))}
          </Select>
        </div>

        {slab === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="gst-custom">Custom rate (%)</Label>
            <Input
              id="gst-custom"
              type="number"
              min={0}
              max={100}
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={interState}
            onChange={(e) => setInterState(e.target.checked)}
            className="size-4 accent-foreground"
          />
          Inter-state supply (IGST instead of CGST + SGST)
        </label>
      </ToolInputs>

      <ToolResults>
        <ResultPanel
          title="Breakdown"
          highlight={formatINR(gross)}
          highlightLabel="Gross (incl. GST)"
        >
          <ResultRow label="Base / net amount" value={formatINR(net)} />
          <ResultRow
            label={`Total GST (${rate || 0}%)`}
            value={formatINR(tax)}
          />
          {interState ? (
            <ResultRow label="IGST" value={formatINR(tax)} />
          ) : (
            <>
              <ResultRow label="CGST" value={formatINR(tax / 2)} />
              <ResultRow label="SGST" value={formatINR(tax / 2)} />
            </>
          )}
        </ResultPanel>
      </ToolResults>
    </ToolWorkspace>
  );
}
