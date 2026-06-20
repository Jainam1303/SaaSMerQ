"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { computePpf } from "@/lib/calculators";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function PpfCalculatorTool() {
  const [annual, setAnnual] = React.useState("150000");
  const [rate, setRate] = React.useState("7.1");
  const [years, setYears] = React.useState("15");

  const deposit = Number(annual);
  const annualRate = Number(rate);
  const period = Number(years);

  const valid = deposit > 0 && period > 0 && annualRate >= 0;
  const { maturity, totalDeposited, totalInterest, schedule } = valid
    ? computePpf(deposit, annualRate, period)
    : {
        maturity: 0,
        totalDeposited: 0,
        totalInterest: 0,
        schedule: [],
      };

  const shareText = [
    "PPF Projection",
    `Annual deposit: ${formatINR(Math.min(deposit, 150000))}`,
    `Rate: ${annualRate}%`,
    `Period: ${period} years`,
    `Maturity: ${formatINR(maturity)}`,
    `Total interest: ${formatINR(totalInterest)}`,
  ].join("\n");

  return (
    <div className="space-y-8">
      <ToolWorkspace>
        <ToolInputs>
          <div className="space-y-2">
            <Label htmlFor="ppf-annual">Annual deposit (₹, max ₹1.5L)</Label>
            <Input
              id="ppf-annual"
              type="number"
              min={0}
              max={150000}
              value={annual}
              onChange={(e) => setAnnual(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppf-rate">Interest rate (% per year)</Label>
            <Input
              id="ppf-rate"
              type="number"
              min={0}
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ppf-years">Projection period (years)</Label>
            <Input
              id="ppf-years"
              type="number"
              min={1}
              max={50}
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
        </ToolInputs>
        <ToolResults>
          <ResultPanel
            title="PPF summary"
            highlight={formatINR(maturity)}
            highlightLabel="Maturity balance"
          >
            <ResultRow label="Total deposited" value={formatINR(totalDeposited)} />
            <ResultRow
              label="Total interest"
              value={formatINR(totalInterest)}
              emphasize
            />
            <ResultRow label="Period" value={`${period} years`} />
          </ResultPanel>
          <ResultActions text={shareText} />
        </ToolResults>
      </ToolWorkspace>

      {schedule.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold tracking-tight">Year-by-year growth</h3>
          <div className="max-h-64 overflow-auto rounded-2xl border border-border/80">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/90 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Deposit</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.year} className="border-t border-border/60">
                    <td className="px-4 py-2.5 tabular-nums">{row.year}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatINR(row.deposit)}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatINR(row.interest)}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatINR(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
