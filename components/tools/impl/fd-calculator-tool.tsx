"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { computeFd, type CompoundingFrequency } from "@/lib/calculators";
import { formatINR, formatNumber } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function FdCalculatorTool() {
  const [amount, setAmount] = React.useState("100000");
  const [rate, setRate] = React.useState("7");
  const [tenure, setTenure] = React.useState("5");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">("years");
  const [frequency, setFrequency] = React.useState<CompoundingFrequency>("quarterly");

  const principal = Number(amount);
  const annualRate = Number(rate);
  const tenureNum = Number(tenure);
  const years =
    tenureUnit === "years" ? tenureNum : tenureNum / 12;

  const valid = principal > 0 && annualRate >= 0 && years > 0;
  const { maturity, interest, effectiveYield } = valid
    ? computeFd(principal, annualRate, years, frequency)
    : { maturity: 0, interest: 0, effectiveYield: 0 };

  const shareText = [
    "FD Calculation",
    `Deposit: ${formatINR(principal)}`,
    `Rate: ${annualRate}% (${frequency})`,
    `Tenure: ${formatNumber(years, 1)} years`,
    `Maturity: ${formatINR(maturity)}`,
    `Interest: ${formatINR(interest)}`,
    `Effective yield: ${formatNumber(effectiveYield, 2)}%`,
  ].join("\n");

  return (
    <ToolWorkspace>
      <ToolInputs>
        <div className="space-y-2">
          <Label htmlFor="fd-amount">Deposit amount (₹)</Label>
          <Input
            id="fd-amount"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fd-rate">Interest rate (% per year)</Label>
          <Input
            id="fd-rate"
            type="number"
            min={0}
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fd-tenure">Tenure</Label>
            <Input
              id="fd-tenure"
              type="number"
              min={1}
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fd-tenure-unit">Tenure unit</Label>
            <Select
              id="fd-tenure-unit"
              value={tenureUnit}
              onChange={(e) =>
                setTenureUnit(e.target.value as "years" | "months")
              }
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fd-freq">Compounding</Label>
          <Select
            id="fd-freq"
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value as CompoundingFrequency)
            }
          >
            <option value="quarterly">Quarterly (typical for Indian FDs)</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </Select>
        </div>
      </ToolInputs>
      <ToolResults>
        <ResultPanel
          title="FD summary"
          highlight={formatINR(maturity)}
          highlightLabel="Maturity amount"
        >
          <ResultRow label="Principal deposited" value={formatINR(principal)} />
          <ResultRow label="Interest earned" value={formatINR(interest)} emphasize />
          <ResultRow
            label="Effective annual yield"
            value={`${formatNumber(effectiveYield, 2)}%`}
          />
          <ResultRow label="Tenure" value={`${formatNumber(years, 1)} years`} />
        </ResultPanel>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
