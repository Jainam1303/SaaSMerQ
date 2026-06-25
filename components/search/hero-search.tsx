"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackSearch } from "@/lib/analytics";

const suggestions = [
  { label: "EMI", q: "EMI" },
  { label: "SIP", q: "SIP" },
  { label: "GST", q: "GST" },
  { label: "QR Code", q: "QR Code" },
  { label: "Password", q: "Password" },
  { label: "Percentage", q: "Percentage" },
];

export function HeroSearch() {
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const input = form.elements.namedItem("q");
    if (input instanceof HTMLInputElement) {
      trackSearch(input.value, "hero");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        action="/tools"
        method="get"
        role="search"
        onSubmit={onSubmit}
        className="group flex flex-col gap-3 rounded-2xl elevated-card p-3 transition-[border-color,box-shadow] focus-within:border-primary/40 focus-within:shadow-card-hover sm:flex-row sm:items-center sm:gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            name="q"
            placeholder="Search tools — EMI, SIP, GST…"
            aria-label="Search tools"
            className="h-14 w-full rounded-xl bg-transparent pl-12 pr-3 text-base outline-none placeholder:text-muted-foreground md:text-lg"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 shrink-0 rounded-xl px-8 sm:h-14"
        >
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">Try:</span>
        {suggestions.map((s) => (
          <Link
            key={s.q}
            href={`/tools?q=${encodeURIComponent(s.q)}`}
            onClick={() => trackSearch(s.q, "hero_suggestion")}
            className="rounded-full border border-border bg-surface px-3.5 py-2 font-medium shadow-premium transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
