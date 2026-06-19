"use client";

import * as React from "react";
import { AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function encodeText(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

function decodeText(b64: string): string {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const MAX_FILE = 10 * 1024 * 1024;

export function Base64Tool() {
  const [mode, setMode] = React.useState<"encode" | "decode">("encode");
  const [input, setInput] = React.useState("Hello, MerQPrime!");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setError("");
    try {
      if (!input) {
        setOutput("");
        return;
      }
      setOutput(mode === "encode" ? encodeText(input) : decodeText(input));
    } catch {
      setOutput("");
      setError(
        mode === "decode"
          ? "Input is not valid Base64."
          : "Could not encode the input.",
      );
    }
  }, [input, mode]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }
    setError("");
    const buffer = await file.arrayBuffer();
    const b64 = bytesToBase64(new Uint8Array(buffer));
    setMode("encode");
    setInput(`(file: ${file.name})`);
    setOutput(`data:${file.type || "application/octet-stream"};base64,${b64}`);
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="b64-input">
              {mode === "encode" ? "Plain text" : "Base64"}
            </Label>
            <Textarea
              id="b64-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="min-h-[200px] font-mono text-sm"
            />
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload /> Encode a file
                <input
                  type="file"
                  className="sr-only"
                  onChange={onFile}
                  aria-label="Upload a file to encode"
                />
              </label>
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="b64-output">
                {mode === "encode" ? "Base64" : "Plain text"}
              </Label>
              {output && <CopyButton value={output} />}
            </div>
            <Textarea
              id="b64-output"
              value={output}
              readOnly
              spellCheck={false}
              className="min-h-[200px] bg-muted/30 font-mono text-sm"
              placeholder="Result appears here"
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
