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
};

export interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = iconRegistry[name] ?? Wrench;
  return <Component className={className} aria-hidden="true" />;
}
