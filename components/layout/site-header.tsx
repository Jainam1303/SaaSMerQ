"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/free-online-tools", label: "Directory" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={cn(
          "container rounded-2xl transition-all duration-300",
          scrolled ? "glass-nav shadow-premium-lg" : "border border-transparent bg-transparent",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-4 px-3 sm:h-16 sm:px-4">
          <SiteLogo />

          <nav className="hidden items-center gap-1 md:flex">
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
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
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
              className="hidden rounded-lg shadow-sm sm:inline-flex"
            >
              <Link href="/tools">
                Browse tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg md:hidden"
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
            "border-t border-border/50 md:hidden",
            open ? "block" : "hidden",
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-lg">
              <Link href="/tools">
                Browse tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
