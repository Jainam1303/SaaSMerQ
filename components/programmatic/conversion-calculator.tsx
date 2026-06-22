"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { convertUnits } from "@/lib/programmatic/units";
import type { ConversionCategory } from "@/lib/programmatic/types";
import { ResultPanel } from "@/components/tools/result-panel";
import { ResultActions } from "@/components/tools/result-actions";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

interface Props {
  category: ConversionCategory;
  fromUnit: string;
  toUnit: string;
  fromLabel: string;
  toLabel: string;
}

export function ConversionCalculator({
  category,
  fromUnit,
  toUnit,
  fromLabel,
  toLabel,
}: Props) {
  const [amount, setAmount] = React.useState("1");
  const value = Number(amount);
  const invalid = !Number.isFinite(value);

  const result = invalid
    ? 0
    : convertUnits(category, fromUnit, toUnit, value);

  const shareText = invalid
    ? ""
    : `${formatNumber(value)} ${fromLabel} = ${formatNumber(result)} ${toLabel}`;

  return (
    <Card>
      <CardContent className="p-6">
        <ToolWorkspace>
          <ToolInputs>
            <div className="space-y-2">
              <Label htmlFor="conv-value">Value ({fromLabel})</Label>
              <Input
                id="conv-value"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </ToolInputs>
          <ToolResults>
            <ResultPanel title="Converted value" highlight={formatNumber(result)}>
              <p className="text-sm text-muted-foreground">
                {formatNumber(value)} {fromLabel} = {formatNumber(result)}{" "}
                {toLabel}
              </p>
            </ResultPanel>
            <ResultActions text={shareText} />
          </ToolResults>
        </ToolWorkspace>
      </CardContent>
    </Card>
  );
}
