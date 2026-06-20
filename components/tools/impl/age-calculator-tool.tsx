"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultActions } from "@/components/tools/result-actions";

function toDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

function computeAge(birth: Date, ref: Date) {
  if (birth > ref) {
    return null;
  }

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor(
    (ref.getTime() - birth.getTime()) / msPerDay,
  );

  return { years, months, days, totalDays };
}

export function AgeCalculatorTool() {
  const today = toDateInput(new Date());
  const [dob, setDob] = React.useState("1995-06-15");
  const [refDate, setRefDate] = React.useState(today);

  const birth = parseDateInput(dob);
  const reference = parseDateInput(refDate);
  const age =
    birth && reference ? computeAge(birth, reference) : null;
  const invalid =
    !birth || !reference || (birth && reference && birth > reference);

  const exactLabel =
    age
      ? `${age.years} years, ${age.months} months, ${age.days} days`
      : "";

  const shareText = invalid
    ? ""
    : [
        "Age Calculation",
        `Date of birth: ${dob}`,
        `Reference date: ${refDate}`,
        `Exact age: ${exactLabel}`,
        `Years: ${age?.years}`,
        `Months: ${age?.months}`,
        `Days: ${age?.days}`,
        `Total days lived: ${age?.totalDays}`,
      ].join("\n");

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age-dob">Date of birth</Label>
            <Input
              id="age-dob"
              type="date"
              value={dob}
              max={refDate}
              onChange={(e) => setDob(e.target.value)}
              aria-invalid={invalid}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age-ref">Reference date</Label>
            <Input
              id="age-ref"
              type="date"
              value={refDate}
              min={dob}
              onChange={(e) => setRefDate(e.target.value)}
            />
          </div>
          {invalid && (
            <p className="text-xs text-destructive">
              Enter a valid birth date on or before the reference date.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-5">
            <h3 className="font-semibold">Your age</h3>
            {age && !invalid ? (
              <>
                <p className="text-2xl font-bold tracking-tight">{exactLabel}</p>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-2xl font-bold">{age.years}</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-2xl font-bold">{age.months}</p>
                    <p className="text-xs text-muted-foreground">Months</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-3">
                    <p className="text-2xl font-bold">{age.days}</p>
                    <p className="text-xs text-muted-foreground">Days</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {age.totalDays.toLocaleString("en-IN")} days total
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter dates to calculate age.
              </p>
            )}
          </div>
          <ResultActions text={shareText} />
        </div>
      </CardContent>
    </Card>
  );
}
