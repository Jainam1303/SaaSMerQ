"use client";

import * as React from "react";
import { AlertCircle, Download, Link2, Link2Off, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ImageDropzone } from "./image-dropzone";
import {
  FORMAT_EXTENSION,
  loadImageFromFile,
  renderToBlob,
  type LoadedImage,
  type OutputFormat,
} from "@/lib/image";

export function ImageResizerTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [loaded, setLoaded] = React.useState<LoadedImage | null>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [lockRatio, setLockRatio] = React.useState(true);
  const [format, setFormat] = React.useState<OutputFormat>("image/png");
  const [result, setResult] = React.useState<string>("");
  const [error, setError] = React.useState("");

  const resultUrl = React.useRef<string>("");
  const ratio = React.useRef(1);

  React.useEffect(() => {
    return () => {
      loaded?.cleanup();
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    };
  }, [loaded]);

  function reset() {
    loaded?.cleanup();
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = "";
    setFile(null);
    setLoaded(null);
    setResult("");
    setError("");
  }

  async function handleFile(f: File) {
    try {
      const img = await loadImageFromFile(f);
      loaded?.cleanup();
      ratio.current = img.width / img.height;
      setFile(f);
      setLoaded(img);
      setWidth(img.width);
      setHeight(img.height);
      setResult("");
    } catch {
      setError("The image could not be decoded.");
    }
  }

  function clampDim(value: number) {
    return Math.max(1, Math.min(Math.round(value) || 1, 10000));
  }

  function onWidth(value: number) {
    const w = clampDim(value);
    setWidth(w);
    if (lockRatio) setHeight(clampDim(w / ratio.current));
  }

  function onHeight(value: number) {
    const h = clampDim(value);
    setHeight(h);
    if (lockRatio) setWidth(clampDim(h * ratio.current));
  }

  async function resize() {
    if (!loaded) return;
    const blob = await renderToBlob(loaded.image, width, height, format, 0.92);
    if (!blob) {
      setError("Your browser could not encode this format.");
      return;
    }
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = URL.createObjectURL(blob);
    setResult(resultUrl.current);
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        {!file ? (
          <ImageDropzone onFile={handleFile} onError={setError} />
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Original size: {loaded?.width} × {loaded?.height} px
            </p>

            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-2">
                <Label htmlFor="rs-width">Width (px)</Label>
                <Input
                  id="rs-width"
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => onWidth(Number(e.target.value))}
                  className="w-28"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-pressed={lockRatio}
                aria-label="Toggle aspect ratio lock"
                onClick={() => setLockRatio((v) => !v)}
                className="mb-0.5"
              >
                {lockRatio ? <Link2 /> : <Link2Off />}
              </Button>
              <div className="space-y-2">
                <Label htmlFor="rs-height">Height (px)</Label>
                <Input
                  id="rs-height"
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => onHeight(Number(e.target.value))}
                  className="w-28"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rs-format">Format</Label>
                <Select
                  id="rs-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-32"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WebP</option>
                </Select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
                className="size-4 accent-primary"
              />
              Maintain aspect ratio
            </label>

            <div className="flex flex-wrap gap-2">
              <Button onClick={resize}>Resize image</Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw /> New image
              </Button>
            </div>

            {result && (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result}
                  alt={`Resized to ${width} by ${height} pixels`}
                  className="max-h-72 w-auto rounded-md"
                />
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href={result}
                    download={`resized-${width}x${height}.${FORMAT_EXTENSION[format]}`}
                  >
                    <Download /> Download {width}×{height}
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
