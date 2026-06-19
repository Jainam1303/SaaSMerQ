"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = ["QR Code", "Password", "JSON", "GST", "Base64"];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function go(q: string) {
    const term = q.trim();
    router.push(term ? `/tools?q=${encodeURIComponent(term)}` : "/tools");
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
        role="search"
        className="group flex items-center gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-premium-lg transition-colors focus-within:border-primary/50"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools — QR, password, JSON, GST…"
            aria-label="Search tools"
            className="h-11 w-full rounded-xl bg-transparent pl-9 pr-2 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-11 bg-brand-gradient text-primary-foreground shadow-premium hover:opacity-90"
        >
          Search
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Popular:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-medium transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
