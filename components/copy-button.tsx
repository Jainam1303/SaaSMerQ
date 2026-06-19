"use client";

import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "value"> {
  value: string;
  label?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopy();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => copy(value)}
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
