"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading tool…</span>
    </div>
  );
}

/**
 * Maps a tool slug to its lazily-loaded client component. Each tool is split
 * into its own chunk (ssr:false) so the rest of the page stays light and the
 * tool UI loads only when needed.
 */
const registry: Record<string, ComponentType> = {
  "qr-generator": dynamic(
    () => import("./impl/qr-generator-tool").then((m) => m.QrGeneratorTool),
    { ssr: false, loading: Loading },
  ),
  "password-generator": dynamic(
    () =>
      import("./impl/password-generator-tool").then(
        (m) => m.PasswordGeneratorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "uuid-generator": dynamic(
    () => import("./impl/uuid-generator-tool").then((m) => m.UuidGeneratorTool),
    { ssr: false, loading: Loading },
  ),
  "json-formatter": dynamic(
    () => import("./impl/json-formatter-tool").then((m) => m.JsonFormatterTool),
    { ssr: false, loading: Loading },
  ),
  "base64-encoder-decoder": dynamic(
    () => import("./impl/base64-tool").then((m) => m.Base64Tool),
    { ssr: false, loading: Loading },
  ),
  "gst-calculator": dynamic(
    () => import("./impl/gst-calculator-tool").then((m) => m.GstCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "upi-qr-generator": dynamic(
    () => import("./impl/upi-qr-tool").then((m) => m.UpiQrTool),
    { ssr: false, loading: Loading },
  ),
  "image-compressor": dynamic(
    () =>
      import("./impl/image-compressor-tool").then(
        (m) => m.ImageCompressorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "image-resizer": dynamic(
    () => import("./impl/image-resizer-tool").then((m) => m.ImageResizerTool),
    { ssr: false, loading: Loading },
  ),
  "sitemap-generator": dynamic(
    () =>
      import("./impl/sitemap-generator-tool").then(
        (m) => m.SitemapGeneratorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "emi-calculator": dynamic(
    () => import("./impl/emi-calculator-tool").then((m) => m.EmiCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "sip-calculator": dynamic(
    () => import("./impl/sip-calculator-tool").then((m) => m.SipCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "percentage-calculator": dynamic(
    () =>
      import("./impl/percentage-calculator-tool").then(
        (m) => m.PercentageCalculatorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "age-calculator": dynamic(
    () => import("./impl/age-calculator-tool").then((m) => m.AgeCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "unit-converter": dynamic(
    () => import("./impl/unit-converter-tool").then((m) => m.UnitConverterTool),
    { ssr: false, loading: Loading },
  ),
  "fd-calculator": dynamic(
    () => import("./impl/fd-calculator-tool").then((m) => m.FdCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "rd-calculator": dynamic(
    () => import("./impl/rd-calculator-tool").then((m) => m.RdCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "ppf-calculator": dynamic(
    () => import("./impl/ppf-calculator-tool").then((m) => m.PpfCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "hra-calculator": dynamic(
    () => import("./impl/hra-calculator-tool").then((m) => m.HraCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "loan-calculator": dynamic(
    () => import("./impl/loan-calculator-tool").then((m) => m.LoanCalculatorTool),
    { ssr: false, loading: Loading },
  ),
  "discount-calculator": dynamic(
    () =>
      import("./impl/discount-calculator-tool").then(
        (m) => m.DiscountCalculatorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "profit-margin-calculator": dynamic(
    () =>
      import("./impl/profit-margin-calculator-tool").then(
        (m) => m.ProfitMarginCalculatorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "break-even-calculator": dynamic(
    () =>
      import("./impl/break-even-calculator-tool").then(
        (m) => m.BreakEvenCalculatorTool,
      ),
    { ssr: false, loading: Loading },
  ),
  "invoice-generator": dynamic(
    () =>
      import("./impl/invoice-generator-tool").then((m) => m.InvoiceGeneratorTool),
    { ssr: false, loading: Loading },
  ),
  "gst-invoice-generator": dynamic(
    () =>
      import("./impl/gst-invoice-generator-tool").then(
        (m) => m.GstInvoiceGeneratorTool,
      ),
    { ssr: false, loading: Loading },
  ),
};

export function ToolRunner({ slug }: { slug: string }) {
  const Component = registry[slug];
  if (!Component) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        This tool is coming soon.
      </div>
    );
  }
  return <Component />;
}
