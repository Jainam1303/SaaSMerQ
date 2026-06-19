"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sanitizeSingleLine } from "@/lib/security";

type QrType = "text" | "url" | "email" | "phone" | "wifi";

function escapeWifi(value: string) {
  // Escape characters that are special in the WIFI: payload format.
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function QrGeneratorTool() {
  const [type, setType] = React.useState<QrType>("text");
  const [text, setText] = React.useState("https://merqprime.in");
  const [url, setUrl] = React.useState("https://merqprime.in");
  const [email, setEmail] = React.useState("");
  const [emailSubject, setEmailSubject] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [wifi, setWifi] = React.useState({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });

  const [size, setSize] = React.useState(320);
  const [ecLevel, setEcLevel] = React.useState<"L" | "M" | "Q" | "H">("M");
  const [dataUrl, setDataUrl] = React.useState("");
  const [error, setError] = React.useState("");

  const payload = React.useMemo(() => {
    switch (type) {
      case "url":
        return url.trim();
      case "email":
        return `mailto:${sanitizeSingleLine(email)}${
          emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""
        }`;
      case "phone":
        return `tel:${phone.replace(/[^\d+]/g, "")}`;
      case "wifi":
        return `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};P:${escapeWifi(
          wifi.password,
        )};${wifi.hidden ? "H:true;" : ""};`;
      case "text":
      default:
        return text;
    }
  }, [type, text, url, email, emailSubject, phone, wifi]);

  React.useEffect(() => {
    let active = true;
    const value = payload.trim();
    if (!value) {
      setDataUrl("");
      setError("");
      return;
    }
    QRCode.toDataURL(value, {
      errorCorrectionLevel: ecLevel,
      width: size,
      margin: 2,
    })
      .then((u) => {
        if (active) {
          setDataUrl(u);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Could not generate a QR code for this input.");
      });
    return () => {
      active = false;
    };
  }, [payload, ecLevel, size]);

  function download() {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-${type}.png`;
    a.click();
  }

  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(v) => setType(v as QrType)}
          >
            <TabsList>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="wifi">WiFi</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <div className="space-y-2">
                <Label htmlFor="qr-text">Text</Label>
                <Input
                  id="qr-text"
                  value={text}
                  maxLength={1000}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter any text"
                />
              </div>
            </TabsContent>

            <TabsContent value="url">
              <div className="space-y-2">
                <Label htmlFor="qr-url">Website URL</Label>
                <Input
                  id="qr-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="qr-email">Email address</Label>
                  <Input
                    id="qr-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-subject">Subject (optional)</Label>
                  <Input
                    id="qr-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject line"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="phone">
              <div className="space-y-2">
                <Label htmlFor="qr-phone">Phone number</Label>
                <Input
                  id="qr-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </TabsContent>

            <TabsContent value="wifi">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="qr-ssid">Network name (SSID)</Label>
                  <Input
                    id="qr-ssid"
                    value={wifi.ssid}
                    onChange={(e) =>
                      setWifi((w) => ({ ...w, ssid: e.target.value }))
                    }
                    placeholder="My WiFi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-wifi-pass">Password</Label>
                  <Input
                    id="qr-wifi-pass"
                    value={wifi.password}
                    onChange={(e) =>
                      setWifi((w) => ({ ...w, password: e.target.value }))
                    }
                    placeholder="Password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-wifi-enc">Security</Label>
                  <Select
                    id="qr-wifi-enc"
                    value={wifi.encryption}
                    onChange={(e) =>
                      setWifi((w) => ({ ...w, encryption: e.target.value }))
                    }
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="qr-size">Size</Label>
              <span className="text-sm text-muted-foreground">{size}px</span>
            </div>
            <Slider
              id="qr-size"
              min={128}
              max={1024}
              step={32}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-ec">Error correction</Label>
            <Select
              id="qr-ec"
              value={ecLevel}
              onChange={(e) =>
                setEcLevel(e.target.value as "L" | "M" | "Q" | "H")
              }
            >
              <option value="L">Low (L)</option>
              <option value="M">Medium (M)</option>
              <option value="Q">Quartile (Q)</option>
              <option value="H">High (H)</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 p-6">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="Generated QR code preview"
              width={240}
              height={240}
              className="h-60 w-60 rounded-lg bg-white p-2"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {error || "Enter data to preview your QR code."}
            </p>
          )}
          <Button onClick={download} disabled={!dataUrl} className="w-full">
            <Download /> Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
