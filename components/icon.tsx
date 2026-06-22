import {
  Briefcase,
  Code,
  Image as ImageIcon,
  Search,
  Type,
  QrCode,
  KeyRound,
  Fingerprint,
  Braces,
  Binary,
  Calculator,
  IndianRupee,
  FileArchive,
  Scaling,
  ListTree,
  Wrench,
  TrendingUp,
  Percent,
  Calendar,
  ArrowLeftRight,
  PiggyBank,
  Landmark,
  Wallet,
  FileText,
  Receipt,
  Scale,
  BadgePercent,
  ChartLine,
  AlignLeft,
  Link,
  Clock,
  Hash,
  GitCompare,
  Share2,
  Palette,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the string icon names stored in tool/category metadata to concrete
 * lucide-react components. Centralising this keeps the data layer free of
 * React imports and avoids shipping the entire icon set.
 */
const iconRegistry: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  code: Code,
  image: ImageIcon,
  search: Search,
  type: Type,
  "qr-code": QrCode,
  "key-round": KeyRound,
  fingerprint: Fingerprint,
  braces: Braces,
  binary: Binary,
  calculator: Calculator,
  "indian-rupee": IndianRupee,
  "file-archive": FileArchive,
  scaling: Scaling,
  "list-tree": ListTree,
  "trending-up": TrendingUp,
  percent: Percent,
  calendar: Calendar,
  "arrow-left-right": ArrowLeftRight,
  "piggy-bank": PiggyBank,
  landmark: Landmark,
  wallet: Wallet,
  "file-text": FileText,
  receipt: Receipt,
  scale: Scale,
  "badge-percent": BadgePercent,
  "chart-line": ChartLine,
  "align-left": AlignLeft,
  link: Link,
  clock: Clock,
  hash: Hash,
  "git-compare": GitCompare,
  "share-2": Share2,
  palette: Palette,
};

export interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = iconRegistry[name] ?? Wrench;
  return <Component className={className} aria-hidden="true" />;
}
