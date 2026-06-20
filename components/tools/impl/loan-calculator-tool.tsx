"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { computeEmi } from "@/lib/calculators";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function LoanCalculatorTool() {
  const [amount, setAmount] = React.useState("500000");
  const [rate, setRate] = React.useState("12");
  const [tenure, setTenure] = React.useState("5");
  const [tenureUnit, setTenureUnit] = React.useState<"years" | "months">("years");
  const [feeType, setFeeType] = React.useState<"flat" | "percent">("percent");
  const [fee, setFee] = React.useState("1");

  const principal = Number(amount);
  const annualRate = Number(rate);
  const tenureNum = Number(tenure);
  const months =
    tenureUnit === "years"
      ? Math.round(Math.max(tenureNum, 0) * 12)
      : Math.round(Math.max(tenureNum, 0));
  const feeVal = Number(fee);

  const processingFee =
    feeType === "percent"
      ? (principal * Math.max(feeVal, 0)) / 100
      : Math.max(feeVal, 0);

  const { emi, totalPayment, totalInterest, schedule } =
    principal > 0 && months > 0
      ? computeEmi(principal, annualRate, months)
      : { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] };

  const totalCost = totalPayment + processingFee;

  const shareText = [
    "Loan Calculation",
    `Loan amount: ${formatINR(principal)}`,
    `Rate: ${annualRate}%`,
    `Tenure: ${months} months`,
    `Processing fee: ${formatINR(processingFee)}`,
    `Monthly EMI: ${formatINR(emi)}`,
    `Total interest: ${formatINR(totalInterest)}`,
    `Total repayment (incl. fee): ${formatINR(totalCost)}`,
  ].join("\n");

  return (
    <div className="space-y-8">
      <ToolWorkspace>
        <ToolInputs>
          <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan amount (₹)</Label>
            <Input
              id="loan-amount"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loan-rate">Interest rate (% per year)</Label>
            <Input
              id="loan-rate"
              type="number"
              min={0}
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loan-tenure">Tenure</Label>
              <Input
                id="loan-tenure"
                type="number"
                min={1}
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-tenure-unit">Tenure unit</Label>
              <Select
                id="loan-tenure-unit"
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
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loan-fee-type">Processing fee type</Label>
              <Select
                id="loan-fee-type"
                value={feeType}
                onChange={(e) =>
                  setFeeType(e.target.value as "flat" | "percent")
                }
              >
                <option value="percent">Percentage of loan</option>
                <option value="flat">Flat amount (₹)</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan-fee">
                Processing fee {feeType === "percent" ? "(%)" : "(₹)"}
              </Label>
              <Input
                id="loan-fee"
                type="number"
                min={0}
                step="0.1"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>
          </div>
        </ToolInputs>
        <ToolResults>
          <ResultPanel
            title="Loan summary"
            highlight={formatINR(emi)}
            highlightLabel="Monthly EMI"
          >
            <ResultRow label="Processing fee" value={formatINR(processingFee)} />
            <ResultRow label="Total interest" value={formatINR(totalInterest)} />
            <ResultRow
              label="Total repayment + fee"
              value={formatINR(totalCost)}
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
                {schedule.slice(0, 60).map((row) => (
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
            {schedule.length > 60 && (
              <p className="px-4 py-2 text-xs text-muted-foreground">
                Showing first 60 of {schedule.length} months.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
