"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SliderProps = Omit<React.ComponentProps<"input">, "type">;

/**
 * Accessible range slider built on a native input for zero dependencies and
 * full keyboard support.
 */
const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        {...props}
      />
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
