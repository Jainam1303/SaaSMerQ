import Link from "next/link";
import { editorialConfig } from "@/lib/editorial";

export function EditorialMeta({
  lastUpdated,
  lastReviewed,
}: {
  lastUpdated?: string;
  lastReviewed?: string;
}) {
  const updated = lastUpdated ?? editorialConfig.lastUpdated;
  const reviewed = lastReviewed ?? editorialConfig.lastReviewed;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span>
        By{" "}
        <span className="font-medium text-foreground">
          {editorialConfig.author}
        </span>
      </span>
      <span>Updated {updated}</span>
      <span>Reviewed {reviewed}</span>
      <Link
        href="/editorial-policy"
        className="underline-offset-4 hover:text-foreground hover:underline"
      >
        Editorial policy
      </Link>
    </div>
  );
}
