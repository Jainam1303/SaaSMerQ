"use client";

import * as React from "react";
import { AlertCircle, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ImageDropzone } from "./image-dropzone";
import {
  FORMAT_EXTENSION,
  formatBytes,
  loadImageFromFile,
  renderToBlob,
  type LoadedImage,
  type OutputFormat,
} from "@/lib/image";

export function ImageCompressorTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [format, setFormat] = React.useState<OutputFormat>("image/webp");
  const [quality, setQuality] = React.useState(0.7);
  const [result, setResult] = React.useState<{ url: string; size: number } | null>(
    null,
  );
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const resultUrl = React.useRef<string>("");

  const reset = React.useCallback(() => {
    loaded?.cleanup();
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = "";
    setFile(null);
    setLoaded(null);
    setResult(null);
    setError("");
  }, [loaded]);

  React.useEffect(() => {
    return () => {
      loaded?.cleanup();
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    };
  }, [loaded]);

  async function handleFile(f: File) {
    try {
      const img = await loadImageFromFile(f);
      loaded?.cleanup();
      setFile(f);
      setLoaded(img);
      setResult(null);
    } catch {
      setError("The image could not be decoded.");
    }
  }

  const compress = React.useCallback(async () => {
    if (!loaded) return;
    setBusy(true);
    try {
      const blob = await renderToBlob(
        loaded.image,
        loaded.width,
        loaded.height,
        format,
        quality,
      );
      if (!blob) {
        setError("Your browser could not encode this format.");
        return;
      }
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
      resultUrl.current = URL.createObjectURL(blob);
      setResult({ url: resultUrl.current, size: blob.size });
    } finally {
      setBusy(false);
    }
  }, [loaded, format, quality]);

  React.useEffect(() => {
    if (loaded) void compress();
  }, [loaded, compress]);

  const savings =
    file && result ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {!file ? (
          <ImageDropzone onFile={handleFile} onError={setError} />
        ) : (
          <>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="ic-format">Output format</Label>
                <Select
                  id="ic-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-40"
                >
                  <option value="image/webp">WebP</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                </Select>
              </div>
              <div className="min-w-[200px] flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ic-quality">Quality</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <Slider
                  id="ic-quality"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  disabled={format === "image/png"}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
              </div>
              <Button
                variant="outline"
                onClick={reset}
                aria-label="Choose a different image"
              >
                <RotateCcw /> New image
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat
                label="Compressed"
                value={result ? formatBytes(result.size) : "—"}
                highlight={savings > 0}
                hint={
                  result && savings > 0
                    ? `${savings}% smaller`
                    : result && savings < 0
                      ? "Larger — try lower quality"
                      : undefined
                }
              />
            </div>

            {result && (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Compressed preview"
                  className="max-h-72 w-auto rounded-md"
                />
                <Button asChild disabled={busy} className="w-full sm:w-auto">
                  <a
                    href={result.url}
                    download={`compressed.${FORMAT_EXTENSION[format]}`}
                  >
                    <Download /> Download
                  </a>
                </Button>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-xl font-semibold">{value}</p>
      {hint && (
        <p
          className={
            highlight
              ? "text-xs font-medium text-emerald-600 dark:text-emerald-400"
              : "text-xs text-muted-foreground"
          }
        >
          {hint}
        </p>
      )}
    </div>
  );
}
