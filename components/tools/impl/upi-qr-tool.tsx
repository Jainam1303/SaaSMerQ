"use client";

import * as React from "react";
import QRCode from "qrcode";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidUpiId, sanitizeSingleLine } from "@/lib/security";

export function UpiQrTool() {
  const [upiId, setUpiId] = React.useState("");
  const [name, setName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [dataUrl, setDataUrl] = React.useState("");
  const [error, setError] = React.useState("");

  const upiValid = upiId === "" || isValidUpiId(upiId);

  const uri = React.useMemo(() => {
    if (!upiId || !isValidUpiId(upiId)) return "";
    const params = new URLSearchParams();
    params.set("pa", upiId.trim());
    if (name.trim()) params.set("pn", sanitizeSingleLine(name, 100));
    const amt = Number(amount);
    if (amount && Number.isFinite(amt) && amt > 0) {
      params.set("am", amt.toFixed(2));
    }
    if (note.trim()) params.set("tn", sanitizeSingleLine(note, 100));
    params.set("cu", "INR");
    return `upi://pay?${params.toString()}`;
  }, [upiId, name, amount, note]);

  React.useEffect(() => {
    let active = true;
    if (!uri) {
      setDataUrl("");
      return;
    }
    QRCode.toDataURL(uri, { width: 360, margin: 2, errorCorrectionLevel: "M" })
      .then((u) => {
        if (active) {
          setDataUrl(u);
          setError("");
        }
      })
      .catch(() => active && setError("Could not generate the QR code."));
    return () => {
      active = false;
    };
  }, [uri]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "upi-qr.png";
    a.click();
  }

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID (VPA)</Label>
            <Input
              id="upi-id"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="name@bank"
              aria-invalid={!upiValid}
            />
            {!upiValid && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" /> Enter a valid UPI ID like
                name@bank.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="upi-name">Payee name</Label>
            <Input
              id="upi-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or business"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upi-amount">Amount (₹, optional)</Label>
            <Input
              id="upi-amount"
              type="number"
              inputMode="decimal"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Leave blank for any amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upi-note">Note (optional)</Label>
            <Input
              id="upi-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Order #1234"
              maxLength={100}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-6">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="UPI payment QR code"
              width={240}
              height={240}
              className="h-60 w-60 rounded-lg bg-white p-2"
            />
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Enter a valid UPI ID to generate your payment QR code.
            </p>
          )}
          <Button onClick={download} disabled={!dataUrl} className="w-full">
            <Download /> Download QR
          </Button>
          {error && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" /> {error}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
