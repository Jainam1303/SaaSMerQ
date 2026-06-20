"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";
import { categories } from "@/data/tools/categories";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/blog", label: "Blog" },
  ...categories.map((c) => ({
    href: `/category/${c.slug}`,
    label: c.name.replace(" Tools", ""),
  })),
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <SiteLogo />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/tools"
                ? pathname === "/tools"
                : link.href === "/blog"
                  ? pathname === "/blog" || pathname.startsWith("/blog/")
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
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/tools">
              All tools
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
          "border-t border-border/70 lg:hidden",
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
          <Button asChild className="mt-2">
            <Link href="/tools">
              All tools
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
