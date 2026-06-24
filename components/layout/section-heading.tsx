import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl space-y-3 text-center"
          : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={align === "center" ? "space-y-3" : "space-y-2"}>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground leading-relaxed md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {href && align !== "center" && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
