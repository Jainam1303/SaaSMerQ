"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

interface AmortRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

function computeEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] as AmortRow[] };
  }
  const r = annualRate / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + r, months);
    emi = (principal * r * factor) / (factor - 1);
  }

  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = r === 0 ? 0 : balance * r;
    const principalPart = emi - interest;
    balance = Math.max(balance - principalPart, 0);
    totalInterest += interest;
    schedule.push({
      month: m,
      emi,
      principal: principalPart,
      interest,
      balance,
    });
  }

  return {
    emi,
    totalPayment: emi * months,
    totalInterest,
    schedule,
  };
}

export function EmiCalculatorTool() {
  const [amount, setAmount] = React.useState("2500000");
  const [rate, setRate] = React.useState("8.5");
  const [tenureYears, setTenureYears] = React.useState("20");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">(
    "years",
  );

  const principal = Number(amount);
  const annualRate = Number(rate);
  const tenureNum = Number(tenureYears);
  const months =
    tenureUnit === "years"
      ? Math.round(Math.max(tenureNum, 0) * 12)
      : Math.round(Math.max(tenureNum, 0));

  const errors = {
    amount: principal <= 0 || !Number.isFinite(principal),
    rate: annualRate < 0 || !Number.isFinite(annualRate),
    tenure: months <= 0 || !Number.isFinite(tenureNum),
  };

  const { emi, totalPayment, totalInterest, schedule } = computeEmi(
    errors.amount ? 0 : principal,
    errors.rate ? 0 : annualRate,
    errors.tenure ? 0 : months,
  );

  const shareText = [
    "EMI Calculation",
    `Loan amount: ${formatINR(principal)}`,
    `Interest rate: ${annualRate}% per year`,
    `Tenure: ${months} months`,
    `Monthly EMI: ${formatINR(emi)}`,
    `Total interest: ${formatINR(totalInterest)}`,
    `Total repayment: ${formatINR(totalPayment)}`,
  ].join("\n");

  return (
    <div className="space-y-8">
      <ToolWorkspace>
        <ToolInputs>
          <div className="space-y-2">
            <Label htmlFor="emi-amount">Loan amount (₹)</Label>
            <Input
              id="emi-amount"
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={errors.amount}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">
                Enter a valid loan amount greater than zero.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emi-rate">Interest rate (% per year)</Label>
            <Input
              id="emi-rate"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              aria-invalid={errors.rate}
            />
            {errors.rate && (
              <p className="text-xs text-destructive">
                Enter a valid interest rate (0 or higher).
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emi-tenure">Loan tenure</Label>
              <Input
                id="emi-tenure"
                type="number"
                inputMode="numeric"
                min={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(e.target.value)}
                aria-invalid={errors.tenure}
              />
              {errors.tenure && (
                <p className="text-xs text-destructive">
                  Enter a valid tenure.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emi-tenure-unit">Tenure unit</Label>
              <Select
                id="emi-tenure-unit"
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
            title="Loan summary"
            highlight={formatINR(emi)}
            highlightLabel="Monthly EMI"
          >
            <ResultRow
              label="Principal (loan amount)"
              value={formatINR(principal)}
            />
            <ResultRow
              label="Total interest"
              value={formatINR(totalInterest)}
            />
            <ResultRow
              label="Total repayment"
              value={formatINR(totalPayment)}
              emphasize
            />
            <ResultRow label="Tenure" value={`${months} months`} />
          </ResultPanel>
          <ResultActions text={shareText} />
        </ToolResults>
      </ToolWorkspace>

      {schedule.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold tracking-tight">Amortization summary</h3>
          <div className="max-h-80 overflow-auto rounded-2xl border border-border/80">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/90 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Month</th>
                  <th className="px-4 py-3 font-medium">EMI</th>
                  <th className="px-4 py-3 font-medium">Principal</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-border/60">
                    <td className="px-4 py-2.5 tabular-nums">{row.month}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatINR(row.emi)}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {formatINR(row.principal)}
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
