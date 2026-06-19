"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

/** Pick a uniformly random index using crypto to avoid modulo bias. */
function secureIndex(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let n = 0;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= limit);
  return n % max;
}

interface Options {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function generate(options: Options): string {
  let pool = "";
  if (options.lowercase) pool += CHAR_SETS.lowercase;
  if (options.uppercase) pool += CHAR_SETS.uppercase;
  if (options.numbers) pool += CHAR_SETS.numbers;
  if (options.symbols) pool += CHAR_SETS.symbols;
  if (!pool) return "";

  let result = "";
  for (let i = 0; i < options.length; i++) {
    result += pool[secureIndex(pool.length)];
  }
  return result;
}

function strengthScore(password: string, poolSize: number) {
  if (!password) return { label: "—", value: 0, color: "bg-muted" };
  const entropy = password.length * Math.log2(Math.max(poolSize, 2));
  if (entropy < 40)
    return { label: "Weak", value: 25, color: "bg-destructive" };
  if (entropy < 70)
    return { label: "Fair", value: 55, color: "bg-amber-500" };
  if (entropy < 100)
    return { label: "Strong", value: 80, color: "bg-emerald-500" };
  return { label: "Very strong", value: 100, color: "bg-emerald-600" };
}

export function PasswordGeneratorTool() {
  const [options, setOptions] = React.useState<Options>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = React.useState("");

  const poolSize = React.useMemo(() => {
    let size = 0;
    if (options.lowercase) size += 26;
    if (options.uppercase) size += 26;
    if (options.numbers) size += 10;
    if (options.symbols) size += CHAR_SETS.symbols.length;
    return size;
  }, [options]);

  const regenerate = React.useCallback(() => {
    setPassword(generate(options));
  }, [options]);

  React.useEffect(() => {
    regenerate();
  }, [regenerate]);

  const strength = strengthScore(password, poolSize);
  const noneSelected = poolSize === 0;

  const toggles: { key: keyof Options; label: string }[] = [
    { key: "uppercase", label: "Uppercase (A-Z)" },
    { key: "lowercase", label: "Lowercase (a-z)" },
    { key: "numbers", label: "Numbers (0-9)" },
    { key: "symbols", label: "Symbols (!@#$)" },
  ];

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="generated-password">Generated password</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="generated-password"
              readOnly
              value={password}
              placeholder="Select at least one character set"
              className="font-mono text-base"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={regenerate}
                aria-label="Regenerate password"
              >
                <RefreshCw />
              </Button>
              <CopyButton value={password} size="default" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Strength</span>
            <span className="font-medium">{strength.label}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full transition-all", strength.color)}
              style={{ width: `${strength.value}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pw-length">Length</Label>
            <span className="text-sm font-medium">{options.length}</span>
          </div>
          <Slider
            id="pw-length"
            min={4}
            max={64}
            value={options.length}
            onChange={(e) =>
              setOptions((o) => ({ ...o, length: Number(e.target.value) }))
            }
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {toggles.map((t) => (
            <label
              key={t.key}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <span className="text-sm">{t.label}</span>
              <Switch
                checked={options[t.key] as boolean}
                onCheckedChange={(checked) =>
                  setOptions((o) => ({ ...o, [t.key]: checked }))
                }
                aria-label={t.label}
              />
            </label>
          ))}
        </div>

        {noneSelected && (
          <p className="text-sm text-destructive">
            Select at least one character set to generate a password.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
