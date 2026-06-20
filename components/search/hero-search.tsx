"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "EMI",
  "SIP",
  "GST",
  "QR Code",
  "Password",
  "Percentage",
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function go(q: string) {
    const term = q.trim();
    router.push(term ? `/tools?q=${encodeURIComponent(term)}` : "/tools");
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
        role="search"
        className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 rounded-2xl border border-border bg-card p-3 shadow-premium-lg transition-shadow focus-within:border-accent-link focus-within:shadow-premium-lg sm:rounded-2xl"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 15+ free tools — EMI, SIP, GST, QR…"
            aria-label="Search tools"
            className="h-14 w-full rounded-xl bg-transparent pl-12 pr-3 text-base outline-none placeholder:text-muted-foreground md:text-lg"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 shrink-0 bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:h-14"
        >
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">Try:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className="rounded-full border border-border bg-background px-3 py-1.5 font-medium transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
