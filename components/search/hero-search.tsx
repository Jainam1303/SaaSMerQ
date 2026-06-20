import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { label: "EMI", q: "EMI" },
  { label: "SIP", q: "SIP" },
  { label: "GST", q: "GST" },
  { label: "QR Code", q: "QR Code" },
  { label: "Password", q: "Password" },
  { label: "Percentage", q: "Percentage" },
];

export function HeroSearch() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        action="/tools"
        method="get"
        role="search"
        className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-premium-lg transition-shadow focus-within:border-accent-link focus-within:shadow-premium-lg sm:flex-row sm:items-center sm:gap-2"
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
          className="h-12 shrink-0 bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:h-14"
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
            className="rounded-full border border-border bg-background px-3 py-1.5 font-medium transition-colors hover:border-foreground/30 hover:bg-muted hover:text-foreground"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
