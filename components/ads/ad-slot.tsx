import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type AdFormat = "leaderboard" | "rectangle" | "native" | "affiliate";

const sizeClasses: Record<AdFormat, string> = {
  leaderboard: "min-h-[90px]",
  rectangle: "min-h-[250px]",
  native: "min-h-[120px]",
  affiliate: "min-h-[160px]",
};

/**
 * Reserved monetization slot. Renders nothing while `siteConfig.ads.enabled`
 * is false, so layout space is documented and ready but no ads ship initially.
 * When enabled, drop the AdSense / native / affiliate markup inside.
 */
export function AdSlot({
  format = "leaderboard",
  className,
}: {
  format?: AdFormat;
  className?: string;
}) {
  if (!siteConfig.ads.enabled) return null;

  return (
    <div
      data-ad-slot={format}
      aria-hidden="true"
      className={cn(
        "flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground",
        sizeClasses[format],
        className,
      )}
    >
      {/* Ad markup goes here when monetization is enabled. */}
    </div>
  );
}
