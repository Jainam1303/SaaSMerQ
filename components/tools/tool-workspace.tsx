import { cn } from "@/lib/utils";

/** Two-column calculator layout: inputs + sticky results on desktop. */
export function ToolWorkspace({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-8 lg:items-start",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolInputs({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-5", className)}>{children}</div>;
}

export function ToolResults({
  children,
  className,
  sticky = true,
}: {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        sticky && "lg:sticky lg:top-24 lg:self-start",
        className,
      )}
    >
      {children}
    </div>
  );
}
