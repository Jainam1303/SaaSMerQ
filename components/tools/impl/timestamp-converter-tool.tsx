"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

function unixToDatetimeLocal(unix: number): string {
  const d = new Date(unix * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function datetimeLocalToUnix(value: string): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / 1000);
}

export function TimestampConverterTool() {
  const [now, setNow] = React.useState(() => Math.floor(Date.now() / 1000));
  const [unixInput, setUnixInput] = React.useState("");
  const [dateInput, setDateInput] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const id = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function handleUnixChange(value: string) {
    setUnixInput(value);
    setError("");
    if (!value.trim()) {
      setDateInput("");
      return;
    }
    const unix = Number(value.trim());
    if (!Number.isFinite(unix)) {
      setError("Enter a valid Unix timestamp (seconds).");
      setDateInput("");
      return;
    }
    setDateInput(unixToDatetimeLocal(unix));
  }

  function handleDateChange(value: string) {
    setDateInput(value);
    setError("");
    if (!value) {
      setUnixInput("");
      return;
    }
    const unix = datetimeLocalToUnix(value);
    if (unix === null) {
      setError("Enter a valid date and time.");
      setUnixInput("");
      return;
    }
    setUnixInput(String(unix));
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="rounded-md border border-border/80 bg-muted/30 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Unix timestamp</p>
              <p className="font-mono text-lg font-medium">{now}</p>
            </div>
            <CopyButton value={String(now)} label="Copy" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Updates every second · {new Date(now * 1000).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="unix-input">Unix timestamp (seconds)</Label>
            <Input
              id="unix-input"
              type="number"
              value={unixInput}
              onChange={(e) => handleUnixChange(e.target.value)}
              placeholder="e.g. 1719000000"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-input">Human-readable date</Label>
            <Input
              id="date-input"
              type="datetime-local"
              step={1}
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
