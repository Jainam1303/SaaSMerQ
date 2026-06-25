"use client";

import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/lib/use-copy";
import { trackEvent, trackToolUsage } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "value"> {
  value: string;
  label?: string;
  /** When set, copy events are attributed to a specific tool. */
  toolSlug?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  toolSlug,
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopy();

  async function handleCopy() {
    const ok = await copy(value);
    if (!ok) return;
    if (toolSlug) {
      trackToolUsage(toolSlug, "copy");
    } else {
      trackEvent("copy", { content_length: value.length });
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleCopy}
      disabled={!value}
      {...props}
    >
      {copied ? (
        <>
          <Check className="text-emerald-500" /> Copied
        </>
      ) : (
        <>
          <Copy /> {label}
        </>
      )}
    </Button>
  );
}
