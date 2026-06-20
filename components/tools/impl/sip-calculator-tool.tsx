"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

function computeSip(
  monthly: number,
  annualReturn: number,
  years: number,
) {
  const months = Math.round(years * 12);
  if (monthly <= 0 || months <= 0) {
    return { invested: 0, futureValue: 0, returns: 0 };
  }
  const r = annualReturn / 12 / 100;
  const invested = monthly * months;
  let futureValue: number;
  if (r === 0) {
    futureValue = invested;
  } else {
    const factor = Math.pow(1 + r, months);
    futureValue = monthly * ((factor - 1) / r) * (1 + r);
  }
  const returns = futureValue - invested;
  return { invested, futureValue, returns };
}

export function SipCalculatorTool() {
  const [monthly, setMonthly] = React.useState("10000");
  const [annualReturn, setAnnualReturn] = React.useState("12");
  const [years, setYears] = React.useState("10");

  const monthlyAmt = Number(monthly);
  const returnRate = Number(annualReturn);
  const durationYears = Number(years);

  const errors = {
    monthly: monthlyAmt <= 0 || !Number.isFinite(monthlyAmt),
    return: returnRate < 0 || !Number.isFinite(returnRate),
    years: durationYears <= 0 || !Number.isFinite(durationYears),
  };

  const { invested, futureValue, returns } = computeSip(
    errors.monthly ? 0 : monthlyAmt,
    errors.return ? 0 : returnRate,
    errors.years ? 0 : durationYears,
  );

  const months = Math.round(durationYears * 12);

  const shareText = [
    "SIP Calculation",
    `Monthly investment: ${formatINR(monthlyAmt)}`,
    `Expected return: ${returnRate}% per year`,
    `Duration: ${durationYears} years (${months} months)`,
    `Invested amount: ${formatINR(invested)}`,
    `Estimated returns: ${formatINR(returns)}`,
    `Future value: ${formatINR(futureValue)}`,
  ].join("\n");

  return (
    <ToolWorkspace>
      <ToolInputs>
          <div className="space-y-2">
            <Label htmlFor="sip-monthly">Monthly investment (₹)</Label>
            <Input
              id="sip-monthly"
              type="number"
              inputMode="decimal"
              min={0}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              aria-invalid={errors.monthly}
            />
            {errors.monthly && (
              <p className="text-xs text-destructive">
                Enter a monthly amount greater than zero.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sip-return">Expected annual return (%)</Label>
            <Input
              id="sip-return"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              aria-invalid={errors.return}
            />
            {errors.return && (
              <p className="text-xs text-destructive">
                Enter a valid return rate (0 or higher).
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sip-years">Investment duration (years)</Label>
            <Input
              id="sip-years"
              type="number"
              inputMode="numeric"
              min={1}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              aria-invalid={errors.years}
            />
            {errors.years && (
              <p className="text-xs text-destructive">
                Enter a duration of at least 1 year.
              </p>
            )}
          </div>
      </ToolInputs>

      <ToolResults>
        <ResultPanel
          title="SIP summary"
          highlight={formatINR(futureValue)}
          highlightLabel="Future value"
        >
          <ResultRow label="Invested amount" value={formatINR(invested)} />
          <ResultRow label="Estimated returns" value={formatINR(returns)} />
          <ResultRow label="Duration" value={`${months} months`} />
        </ResultPanel>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Estimates assume monthly investments at the start of each month.
          Actual mutual fund returns are not guaranteed.
        </p>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
