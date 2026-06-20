import { cn } from "@/lib/utils";

export function ResultPanel({
  title,
  children,
  className,
  highlight,
  highlightLabel,
}: {
  title?: string;
  highlight?: string;
  highlightLabel?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-premium lg:p-7",
        className,
      )}
    >
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
      )}
      {highlight && (
        <div className="mt-3 space-y-1">
          {highlightLabel && (
            <p className="text-sm text-muted-foreground">{highlightLabel}</p>
          )}
          <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {highlight}
          </p>
        </div>
      )}
      {children && (
        <div className={cn(title || highlight ? "mt-5 space-y-3" : "space-y-3")}>
          {children}
        </div>
      )}
    </div>
  );
}

export function ResultRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          emphasize ? "text-lg font-bold tracking-tight" : "font-semibold",
        )}
      >
        {value}
      </span>
    </div>
  );
}
