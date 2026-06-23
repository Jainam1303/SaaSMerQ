import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  /** Hide the wordmark and show only the mark (e.g. compact mobile). */
  iconOnly?: boolean;
}

export function SiteLogo({ className, iconOnly = false }: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 font-semibold", className)}
    >
      <Image
        src={siteConfig.logo.path}
        alt={iconOnly ? siteConfig.brandName : ""}
        width={siteConfig.logo.width}
        height={siteConfig.logo.height}
        className="size-9 shrink-0 rounded-lg"
        priority
        aria-hidden={iconOnly ? undefined : true}
      />
      {!iconOnly && (
        <span className="text-[15px] tracking-tight">
          MerQ<span className="text-muted-foreground">Prime</span>
        </span>
      )}
    </Link>
  );
}
