"use client";

import * as React from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/lib/format";

interface GstLine {
  id: string;
  description: string;
  hsn: string;
  quantity: string;
  rate: string;
  gstPercent: string;
}

function newGstLine(): GstLine {
  return {
    id: crypto.randomUUID(),
    description: "",
    hsn: "",
    quantity: "1",
    rate: "0",
    gstPercent: "18",
  };
}

function computeGstLine(line: GstLine) {
  const qty = Number(line.quantity);
  const rate = Number(line.rate);
  const gstPct = Number(line.gstPercent);
  const taxable = Number.isFinite(qty) && Number.isFinite(rate) ? qty * rate : 0;
  const gstAmount = (taxable * gstPct) / 100;
  return { taxable, gstAmount, total: taxable + gstAmount };
}

export function GstInvoiceGeneratorTool() {
  const [supplierName, setSupplierName] = React.useState("Your Business Name");
  const [supplierAddress, setSupplierAddress] = React.useState(
    "Address, City, State — PIN",
  );
  const [supplierGstin, setSupplierGstin] = React.useState("");
  const [buyerName, setBuyerName] = React.useState("Buyer Name");
  const [buyerAddress, setBuyerAddress] = React.useState("Buyer address");
  const [buyerGstin, setBuyerGstin] = React.useState("");
  const [invoiceNumber, setInvoiceNumber] = React.useState("GST-001");
  const [invoiceDate, setInvoiceDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );
  const [supplyType, setSupplyType] = React.useState<"intra" | "inter">("intra");
  const [lines, setLines] = React.useState<GstLine[]>([
    {
      ...newGstLine(),
      description: "Product or service",
      hsn: "9983",
      rate: "10000",
      gstPercent: "18",
    },
  ]);

  const computed = lines.map((line) => ({
    line,
    ...computeGstLine(line),
  }));
  const taxableTotal = computed.reduce((s, c) => s + c.taxable, 0);
  const gstTotal = computed.reduce((s, c) => s + c.gstAmount, 0);
  const grandTotal = taxableTotal + gstTotal;
  const halfGst = gstTotal / 2;

  function updateLine(id: string, patch: Partial<GstLine>) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gst-supplier">Supplier / business name</Label>
            <Input
              id="gst-supplier"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-supplier-addr">Supplier address</Label>
            <Textarea
              id="gst-supplier-addr"
              rows={2}
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-supplier-gstin">Supplier GSTIN</Label>
            <Input
              id="gst-supplier-gstin"
              value={supplierGstin}
              onChange={(e) => setSupplierGstin(e.target.value)}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-buyer">Buyer name</Label>
            <Input
              id="gst-buyer"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-buyer-addr">Buyer address</Label>
            <Textarea
              id="gst-buyer-addr"
              rows={2}
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-buyer-gstin">Buyer GSTIN (optional)</Label>
            <Input
              id="gst-buyer-gstin"
              value={buyerGstin}
              onChange={(e) => setBuyerGstin(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gst-number">Invoice number</Label>
              <Input
                id="gst-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst-date">Invoice date</Label>
              <Input
                id="gst-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gst-supply">Supply type</Label>
            <Select
              id="gst-supply"
              value={supplyType}
              onChange={(e) =>
                setSupplyType(e.target.value as "intra" | "inter")
              }
            >
              <option value="intra">Intra-state (CGST + SGST)</option>
              <option value="inter">Inter-state (IGST)</option>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Line items</Label>
            {lines.map((line, index) => (
              <div
                key={line.id}
                className="space-y-2 rounded-xl border border-border/80 p-3"
              >
                <Input
                  placeholder={`Description ${index + 1}`}
                  value={line.description}
                  onChange={(e) =>
                    updateLine(line.id, { description: e.target.value })
                  }
                />
                <div className="grid gap-2 sm:grid-cols-4">
                  <Input
                    placeholder="HSN/SAC"
                    value={line.hsn}
                    onChange={(e) =>
                      updateLine(line.id, { hsn: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Qty"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(line.id, { quantity: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Rate ₹"
                    value={line.rate}
                    onChange={(e) =>
                      updateLine(line.id, { rate: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="GST %"
                    value={line.gstPercent}
                    onChange={(e) =>
                      updateLine(line.id, { gstPercent: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={lines.length <= 1}
                  onClick={() =>
                    setLines((prev) => prev.filter((l) => l.id !== line.id))
                  }
                >
                  <Trash2 className="size-4" /> Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLines((prev) => [...prev, newGstLine()])}
            >
              <Plus className="size-4" /> Add line
            </Button>
          </div>

          <Button type="button" onClick={() => window.print()}>
            <Printer className="size-4" /> Print GST invoice
          </Button>
        </div>

        <div
          className="invoice-print-area rounded-2xl border border-border/80 bg-white p-6 text-black shadow-sm print:border-0 print:shadow-none"
          aria-label="GST invoice preview"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{supplierName}</h2>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                {supplierAddress}
              </p>
              {supplierGstin && (
                <p className="mt-2 text-sm font-medium">GSTIN: {supplierGstin}</p>
              )}
            </div>
            <div className="text-right text-sm">
              <p className="text-lg font-bold">TAX INVOICE</p>
              <p className="mt-2">#{invoiceNumber}</p>
              <p>{invoiceDate}</p>
              <p className="mt-1 text-xs uppercase text-gray-500">
                {supplyType === "intra" ? "Intra-state" : "Inter-state"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Bill to
              </p>
              <p className="mt-1 font-medium">{buyerName}</p>
              <p className="text-gray-600 whitespace-pre-line">{buyerAddress}</p>
              {buyerGstin && <p className="mt-1">GSTIN: {buyerGstin}</p>}
            </div>
          </div>

          <table className="mt-6 w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-2 font-semibold">Item</th>
                <th className="py-2 pr-2 font-semibold">HSN</th>
                <th className="py-2 pr-2 font-semibold text-right">Qty</th>
                <th className="py-2 pr-2 font-semibold text-right">Rate</th>
                <th className="py-2 pr-2 font-semibold text-right">Taxable</th>
                <th className="py-2 pr-2 font-semibold text-right">GST</th>
                <th className="py-2 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {computed.map(({ line, taxable, gstAmount, total }) => (
                <tr key={line.id} className="border-b border-gray-100">
                  <td className="py-2 pr-2">{line.description || "—"}</td>
                  <td className="py-2 pr-2">{line.hsn || "—"}</td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {line.quantity}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {formatINR(Number(line.rate))}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {formatINR(taxable)}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">
                    {formatINR(gstAmount)}
                  </td>
                  <td className="py-2 text-right tabular-nums font-medium">
                    {formatINR(total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 space-y-1 border-t border-gray-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Taxable value</span>
              <span className="tabular-nums font-medium">
                {formatINR(taxableTotal)}
              </span>
            </div>
            {supplyType === "intra" ? (
              <>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span className="tabular-nums">{formatINR(halfGst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span className="tabular-nums">{formatINR(halfGst)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>IGST</span>
                <span className="tabular-nums">{formatINR(gstTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Grand total</span>
              <span className="tabular-nums">{formatINR(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
