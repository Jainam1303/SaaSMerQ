"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { computeHraExemption } from "@/lib/calculators";
import { formatINR } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel, ResultRow } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

export function HraCalculatorTool() {
  const [basic, setBasic] = React.useState("50000");
  const [hra, setHra] = React.useState("20000");
  const [rent, setRent] = React.useState("18000");
  const [cityType, setCityType] = React.useState<"metro" | "non-metro">("metro");

  const basicSalary = Number(basic);
  const hraReceived = Number(hra);
  const rentPaid = Number(rent);
  const isMetro = cityType === "metro";

  const valid =
    basicSalary > 0 &&
    hraReceived >= 0 &&
    rentPaid >= 0 &&
    Number.isFinite(basicSalary);

  const { exempt, taxable, limitingFactor } = valid
    ? computeHraExemption(basicSalary, hraReceived, rentPaid, isMetro)
    : { exempt: 0, taxable: 0, limitingFactor: "" };

  const shareText = [
    "HRA Exemption Calculation",
    `Basic salary: ${formatINR(basicSalary)}/month`,
    `HRA received: ${formatINR(hraReceived)}/month`,
    `Rent paid: ${formatINR(rentPaid)}/month`,
    `City: ${isMetro ? "Metro" : "Non-metro"}`,
    `Exempt HRA: ${formatINR(exempt)}/month`,
    `Taxable HRA: ${formatINR(taxable)}/month`,
    `Limiting factor: ${limitingFactor}`,
  ].join("\n");

  return (
    <ToolWorkspace>
      <ToolInputs>
        <div className="space-y-2">
          <Label htmlFor="hra-basic">Basic salary (₹/month)</Label>
          <Input
            id="hra-basic"
            type="number"
            min={0}
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hra-received">HRA received (₹/month)</Label>
          <Input
            id="hra-received"
            type="number"
            min={0}
            value={hra}
            onChange={(e) => setHra(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hra-rent">Rent paid (₹/month)</Label>
          <Input
            id="hra-rent"
            type="number"
            min={0}
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hra-city">City type</Label>
          <Select
            id="hra-city"
            value={cityType}
            onChange={(e) =>
              setCityType(e.target.value as "metro" | "non-metro")
            }
          >
            <option value="metro">Metro (Delhi, Mumbai, Kolkata, Chennai)</option>
            <option value="non-metro">Non-metro</option>
          </Select>
        </div>
      </ToolInputs>
      <ToolResults>
        <ResultPanel
          title="HRA exemption"
          highlight={formatINR(exempt)}
          highlightLabel="Exempt HRA (per month)"
        >
          <ResultRow label="Taxable HRA" value={formatINR(taxable)} emphasize />
          <ResultRow label="Limiting factor" value={limitingFactor} />
          <ResultRow
            label="Annual exempt HRA"
            value={formatINR(exempt * 12)}
          />
          <ResultRow
            label="Annual taxable HRA"
            value={formatINR(taxable * 12)}
          />
        </ResultPanel>
        <ResultActions text={shareText} />
      </ToolResults>
    </ToolWorkspace>
  );
}
