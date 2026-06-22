"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const base64 = pad ? padded + "=".repeat(4 - pad) : padded;
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeJwtPart(segment: string): unknown {
  const json = base64UrlDecode(segment);
  return JSON.parse(json);
}

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
}

export function JwtDecoderTool() {
  const [input, setInput] = React.useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1lclFQcmltZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );
  const [parts, setParts] = React.useState<JwtParts | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setError("");
    const trimmed = input.trim();
    if (!trimmed) {
      setParts(null);
      return;
    }
    const segments = trimmed.split(".");
    if (segments.length !== 3) {
      setParts(null);
      setError("JWT must have three dot-separated segments (header.payload.signature).");
      return;
    }
    try {
      const header = JSON.stringify(decodeJwtPart(segments[0]), null, 2);
      const payload = JSON.stringify(decodeJwtPart(segments[1]), null, 2);
      setParts({
        header,
        payload,
        signature: segments[2],
      });
    } catch (e) {
      setParts(null);
      const message = e instanceof Error ? e.message : "Could not decode JWT.";
      setError(message);
    }
  }, [input]);

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="jwt-input">JWT token</Label>
          <Textarea
            id="jwt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="min-h-[100px] font-mono text-sm"
            placeholder="Paste JWT here (not verified)"
          />
          <p className="text-xs text-muted-foreground">
            Decodes header and payload only — signature is not verified.
          </p>
        </div>

        {parts && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jwt-header">Header</Label>
                <CopyButton value={parts.header} />
              </div>
              <Textarea
                id="jwt-header"
                value={parts.header}
                readOnly
                spellCheck={false}
                className="min-h-[160px] bg-muted/30 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jwt-payload">Payload</Label>
                <CopyButton value={parts.payload} />
              </div>
              <Textarea
                id="jwt-payload"
                value={parts.payload}
                readOnly
                spellCheck={false}
                className="min-h-[160px] bg-muted/30 font-mono text-sm"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="jwt-signature">Signature</Label>
                <CopyButton value={parts.signature} />
              </div>
              <Textarea
                id="jwt-signature"
                value={parts.signature}
                readOnly
                spellCheck={false}
                className="min-h-[60px] bg-muted/30 font-mono text-sm"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
