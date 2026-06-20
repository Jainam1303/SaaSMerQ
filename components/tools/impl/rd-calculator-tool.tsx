"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { computeRd } from "@/lib/calculators";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function RdCalculatorTool() {
  const [monthly, setMonthly] = React.useState("5000");
  const [rate, setRate] = React.useState("7");
  const [tenure, setTenure] = React.useState("3");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">("years");

  const deposit = Number(monthly);
  const annualRate = Number(rate);
  const tenureNum = Number(tenure);
  const months =
    tenureUnit === "years" ? Math.round(tenureNum * 12) : Math.round(tenureNum);

  const valid = deposit > 0 && months > 0 && annualRate >= 0;
  const { maturity, totalDeposited, interest } = valid
    ? computeRd(deposit, annualRate, months)
    : { maturity: 0, totalDeposited: 0, interest: 0 };

  const shareText = [
    "RD Calculation",
    `Monthly deposit: ${formatINR(deposit)}`,
    `Rate: ${annualRate}%`,
    `Tenure: ${months} months`,
    `Maturity: ${formatINR(maturity)}`,
    `Total deposited: ${formatINR(totalDeposited)}`,
    `Interest: ${formatINR(interest)}`,
  ].join("\n");

  return (
    <ToolWorkspace>
      <ToolInputs>
        <div className="space-y-2">
          <Label htmlFor="rd-monthly">Monthly deposit (₹)</Label>
          <Input
            id="rd-monthly"
            type="number"
            min={0}
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rd-rate">Interest rate (% per year)</Label>
          <Input
            id="rd-rate"
            type="number"
            min={0}
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rd-tenure">Tenure</Label>
            <Input
              id="rd-tenure"
              type="number"
              min={1}
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rd-tenure-unit">Tenure unit</Label>
            <Select
              id="rd-tenure-unit"
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
      </ToolInputs>
      <ToolResults>
        <ResultPanel
          title="RD summary"
          highlight={formatINR(maturity)}
          highlightLabel="Maturity amount"
        >
          <ResultRow label="Total deposited" value={formatINR(totalDeposited)} />
          <ResultRow label="Interest earned" value={formatINR(interest)} emphasize />
          <ResultRow label="Tenure" value={`${months} months`} />
        </ResultPanel>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
