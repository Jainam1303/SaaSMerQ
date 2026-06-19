import * as React from "react";

/**
 * Minimal `Slot` implementation (à la Radix) used to support the `asChild`
 * pattern without pulling in an extra dependency. It merges its own props
 * (including className and ref) onto a single React element child.
 */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    const child = children as React.ReactElement<
      Record<string, unknown> & { ref?: React.Ref<unknown> }
    >;
    const childProps = child.props;

    const mergedProps: Record<string, unknown> = {
      ...childProps,
      ...props,
      className: [
        (props as { className?: string }).className,
        (childProps as { className?: string }).className,
      ]
        .filter(Boolean)
        .join(" "),
    };

    if (ref) {
      mergedProps.ref = ref;
    }

    return React.cloneElement(child, mergedProps);
  },
);
Slot.displayName = "Slot";
