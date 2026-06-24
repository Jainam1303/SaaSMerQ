import {
  BadgeCheck,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";

const badges = [
  { icon: Sparkles, label: "Free" },
  { icon: BadgeCheck, label: "No login" },
  { icon: Globe, label: "Browser based" },
  { icon: Lock, label: "Privacy friendly" },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap gap-2 sm:gap-3 ${className ?? ""}`}
      aria-label="Tool trust badges"
    >
      {badges.map((badge) => (
        <span
          key={badge.label}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3.5 py-2 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:text-sm"
        >
          <badge.icon className="size-3.5 text-primary sm:size-4" aria-hidden />
          {badge.label}
        </span>
      ))}
    </div>
  );
}
