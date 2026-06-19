"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SLABS = ["5", "12", "18", "28", "custom"];

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

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
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
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
              className="size-4 accent-primary"
            />
            Inter-state supply (IGST instead of CGST + SGST)
          </label>
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-5">
          <h3 className="font-semibold">Breakdown</h3>
          <Row label="Base / net amount" value={formatINR(net)} />
          <Row label={`Total GST (${rate || 0}%)`} value={formatINR(tax)} />
          {interState ? (
            <Row label="IGST" value={formatINR(tax)} muted />
          ) : (
            <>
              <Row label="CGST" value={formatINR(tax / 2)} muted />
              <Row label="SGST" value={formatINR(tax / 2)} muted />
            </>
          )}
          <div className="mt-2 border-t border-border pt-3">
            <Row
              label="Gross (incl. GST)"
              value={formatINR(gross)}
              emphasize
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  muted,
  emphasize,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span
        className={
          muted ? "pl-3 text-muted-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          emphasize ? "text-lg font-bold text-foreground" : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
