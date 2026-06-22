"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

type ColorFormat = "hex" | "rgb" | "hsl";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function parseHex(raw: string): Rgb | null {
  const hex = raw.replace(/^#/, "").trim();
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (h < 60) [rn, gn, bn] = [c, x, 0];
  else if (h < 120) [rn, gn, bn] = [x, c, 0];
  else if (h < 180) [rn, gn, bn] = [0, c, x];
  else if (h < 240) [rn, gn, bn] = [0, x, c];
  else if (h < 300) [rn, gn, bn] = [x, 0, c];
  else [rn, gn, bn] = [c, 0, x];

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255),
  };
}

function parseRgb(raw: string): Rgb | null {
  const match = raw.match(
    /^\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*$/,
  );
  if (!match) return null;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  if ([r, g, b].some((n) => n < 0 || n > 255)) return null;
  return { r, g, b };
}

function parseHsl(raw: string): Hsl | null {
  const match = raw.match(
    /^\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*$/,
  );
  if (!match) return null;
  const h = Number(match[1]);
  const s = Number(match[2]);
  const l = Number(match[3]);
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

export function ColorConverterTool() {
  const [hex, setHex] = React.useState("#111111");
  const [rgb, setRgb] = React.useState("17, 17, 17");
  const [hsl, setHsl] = React.useState("0, 0, 7");
  const [preview, setPreview] = React.useState("#111111");

  function syncFrom(format: ColorFormat, value: string) {
    if (format === "hex") {
      setHex(value);
      const parsed = parseHex(value);
      if (!parsed) return;
      setRgb(`${parsed.r}, ${parsed.g}, ${parsed.b}`);
      const hslVal = rgbToHsl(parsed);
      setHsl(`${hslVal.h}, ${hslVal.s}, ${hslVal.l}`);
      setPreview(rgbToHex(parsed));
      return;
    }

    if (format === "rgb") {
      setRgb(value);
      const parsed = parseRgb(value);
      if (!parsed) return;
      setHex(rgbToHex(parsed));
      const hslVal = rgbToHsl(parsed);
      setHsl(`${hslVal.h}, ${hslVal.s}, ${hslVal.l}`);
      setPreview(rgbToHex(parsed));
      return;
    }

    setHsl(value);
    const parsed = parseHsl(value);
    if (!parsed) return;
    const rgbVal = hslToRgb(parsed);
    setRgb(`${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b}`);
    setHex(rgbToHex(rgbVal));
    setPreview(rgbToHex(rgbVal));
  }

  const rgbCss = `rgb(${rgb})`;
  const hslCss = `hsl(${hsl.split(",").map((p) => p.trim()).join(", ")})`;

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className="size-24 shrink-0 rounded-xl border border-border shadow-sm"
            style={{ backgroundColor: preview }}
            aria-label="Color preview"
          />
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-hex">HEX</Label>
                <CopyButton value={hex} />
              </div>
              <Input
                id="color-hex"
                value={hex}
                onChange={(e) => syncFrom("hex", e.target.value)}
                spellCheck={false}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-rgb">RGB</Label>
                <CopyButton value={rgbCss} />
              </div>
              <Input
                id="color-rgb"
                value={rgb}
                onChange={(e) => syncFrom("rgb", e.target.value)}
                placeholder="R, G, B"
                spellCheck={false}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-hsl">HSL</Label>
                <CopyButton value={hslCss} />
              </div>
              <Input
                id="color-hsl"
                value={hsl}
                onChange={(e) => syncFrom("hsl", e.target.value)}
                placeholder="H, S, L"
                spellCheck={false}
                className="font-mono"
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Edit any format — HEX, RGB, or HSL values stay in sync. Preview
          updates when a valid color is entered.
        </p>
      </CardContent>
    </Card>
  );
}
