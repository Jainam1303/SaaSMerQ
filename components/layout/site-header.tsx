"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Wrench, X } from "lucide-react";
import { categories } from "@/data/tools/categories";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools", label: "All Tools" },
  ...categories.map((c) => ({
    href: `/category/${c.slug}`,
    label: c.name.replace(" Tools", ""),
  })),
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-premium">
        <Wrench className="size-4" />
      </span>
      <span className="text-[15px] tracking-tight">
        {siteConfig.shortName}
        <span className="text-gradient">Prime</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/tools"
                ? pathname === "/tools"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            size="sm"
            asChild
            className="hidden bg-brand-gradient text-primary-foreground shadow-premium hover:opacity-90 sm:inline-flex"
          >
            <Link href="/tools">
              Explore tools
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border/70 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container flex flex-col py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-2 bg-brand-gradient text-primary-foreground hover:opacity-90"
          >
            <Link href="/tools">
              Explore tools
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
