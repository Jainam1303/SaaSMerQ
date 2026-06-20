"use client";

import * as React from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatINR } from "@/lib/format";

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: string;
  rate: string;
}

function newLine(): InvoiceLine {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: "1",
    rate: "0",
  };
}

function lineTotal(line: InvoiceLine) {
  const qty = Number(line.quantity);
  const rate = Number(line.rate);
  if (!Number.isFinite(qty) || !Number.isFinite(rate)) return 0;
  return qty * rate;
}

export function InvoiceGeneratorTool() {
  const [businessName, setBusinessName] = React.useState("Your Business Name");
  const [businessAddress, setBusinessAddress] = React.useState(
    "Address, City, State — PIN",
  );
  const [businessTaxId, setBusinessTaxId] = React.useState("");
  const [clientName, setClientName] = React.useState("Client Name");
  const [clientAddress, setClientAddress] = React.useState("Client address");
  const [invoiceNumber, setInvoiceNumber] = React.useState("INV-001");
  const [invoiceDate, setInvoiceDate] = React.useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = React.useState("Payment due within 15 days.");
  const [lines, setLines] = React.useState<InvoiceLine[]>([
    { ...newLine(), description: "Service or product", rate: "1000" },
  ]);

  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);

  function updateLine(id: string, patch: Partial<InvoiceLine>) {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="inv-business">Your business name</Label>
            <Input
              id="inv-business"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-business-addr">Business address</Label>
            <Textarea
              id="inv-business-addr"
              rows={2}
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-tax">Tax ID / GSTIN (optional)</Label>
            <Input
              id="inv-tax"
              value={businessTaxId}
              onChange={(e) => setBusinessTaxId(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-client">Client name</Label>
            <Input
              id="inv-client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-client-addr">Client address</Label>
            <Textarea
              id="inv-client-addr"
              rows={2}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-number">Invoice number</Label>
              <Input
                id="inv-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-date">Invoice date</Label>
              <Input
                id="inv-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Line items</Label>
            {lines.map((line, index) => (
              <div
                key={line.id}
                className="grid gap-2 rounded-xl border border-border/80 p-3 sm:grid-cols-[1fr_80px_100px_40px]"
              >
                <Input
                  placeholder={`Item ${index + 1}`}
                  value={line.description}
                  onChange={(e) =>
                    updateLine(line.id, { description: e.target.value })
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove line"
                  disabled={lines.length <= 1}
                  onClick={() =>
                    setLines((prev) => prev.filter((l) => l.id !== line.id))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLines((prev) => [...prev, newLine()])}
            >
              <Plus className="size-4" /> Add line
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inv-notes">Notes / payment terms</Label>
            <Textarea
              id="inv-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="button" onClick={() => window.print()}>
            <Printer className="size-4" /> Print invoice
          </Button>
        </div>

        <div
          className="invoice-print-area rounded-2xl border border-border/80 bg-white p-6 text-black shadow-sm print:border-0 print:shadow-none"
          aria-label="Invoice preview"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{businessName}</h2>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                {businessAddress}
              </p>
              {businessTaxId && (
                <p className="mt-2 text-sm">Tax ID: {businessTaxId}</p>
              )}
            </div>
            <div className="text-sm text-right">
              <p className="font-semibold">INVOICE</p>
              <p className="mt-2">#{invoiceNumber}</p>
              <p>{invoiceDate}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Bill to
            </p>
            <p className="mt-1 font-medium">{clientName}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {clientAddress}
            </p>
          </div>

          <table className="mt-8 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 font-semibold">Description</th>
                <th className="py-2 font-semibold text-right">Qty</th>
                <th className="py-2 font-semibold text-right">Rate</th>
                <th className="py-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-gray-100">
                  <td className="py-2.5">{line.description || "—"}</td>
                  <td className="py-2.5 text-right tabular-nums">
                    {line.quantity}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    {formatINR(Number(line.rate))}
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium">
                    {formatINR(lineTotal(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatINR(subtotal)}
              </p>
            </div>
          </div>

          {notes && (
            <p className="mt-6 text-sm text-gray-600 whitespace-pre-line">
              {notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
