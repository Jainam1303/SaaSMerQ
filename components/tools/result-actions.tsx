"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { useCopy } from "@/lib/use-copy";

export function ResultActions({
  text,
  copyLabel = "Copy results",
}: {
  text: string;
  copyLabel?: string;
}) {
  const { copy } = useCopy();

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* user dismissed or share failed — fall back to copy */
      }
    }
    copy(text);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <CopyButton value={text} label={copyLabel} disabled={!text} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={share}
        disabled={!text}
      >
        <Share2 /> Share
      </Button>
    </div>
  );
}
