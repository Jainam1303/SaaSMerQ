"use client";

import * as React from "react";
import {
  trackDownload,
  trackToolUsage,
} from "@/lib/analytics";

const ACTION_PATTERN =
  /generate|encode|decode|resize|compress|convert|calculate|format|hash|encrypt|decrypt|create|submit|run|download/i;

/**
 * Delegated click tracking inside a tool surface — covers generate, download,
 * and primary action buttons without editing every tool implementation.
 */
export function ToolInteractionTracker({
  toolSlug,
  children,
}: {
  toolSlug: string;
  children: React.ReactNode;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    trackToolUsage(toolSlug, "opened");
  }, [toolSlug]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!root.contains(target)) return;

      const downloadEl = target.closest("a[download]");
      if (downloadEl instanceof HTMLAnchorElement) {
        trackDownload(toolSlug, downloadEl.download || undefined);
        return;
      }

      const button = target.closest("button");
      if (!button || button.disabled) return;

      const label = button.textContent?.trim() ?? "";
      if (button.type === "submit" || ACTION_PATTERN.test(label)) {
        trackToolUsage(toolSlug, "generate", { button_label: label });
      }
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [toolSlug]);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
