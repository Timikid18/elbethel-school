"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark, Wordmark } from "../ui/logo";
import { ThemeToggle } from "../theme/theme-toggle";
import { ButtonLink } from "../ui/button";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Student Life", href: "/student-life" },
  { label: "News & Events", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onTop = !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/80 bg-surface/95 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="shell flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="EL-BETH-EL The Kings' School home"
        >
          <LogoMark />
          <Wordmark onDark={onTop} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "group relative rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-medium transition-colors",
                  onTop
                    ? active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                    : active
                      ? "text-royal-accent"
                      : "text-ink-soft hover:text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-[2px] origin-left rounded-full transition-transform duration-300",
                    active
                      ? cn("scale-x-100", onTop ? "bg-gold" : "bg-royal")
                      : "scale-x-0 group-hover:scale-x-100",
                    onTop ? "bg-gold/70" : "bg-royal/40",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle
            className={
              onTop
                ? "border-white/20 bg-white/5 text-white/80 hover:border-white/30 hover:text-white"
                : "border-ash-300 bg-surface text-ink-soft hover:border-ash-400 hover:text-ink"
            }
          />
          <Link
            href="/login"
            className={cn(
              "text-sm font-medium transition-colors",
              onTop
                ? "text-white/85 hover:text-white"
                : "text-ink-soft hover:text-ink",
            )}
          >
            Sign in
          </Link>
          <ButtonLink
            href="/admissions"
            variant={onTop ? "gold" : "primary"}
            className="h-11 px-5 text-sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Apply Now
          </ButtonLink>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle
            className={
              onTop
                ? "border-white/20 bg-white/5 text-white/80 hover:border-white/30 hover:text-white"
                : "border-ash-300 bg-surface text-ink-soft hover:border-ash-400 hover:text-ink"
            }
          />
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "rounded-md p-2 transition-colors",
              onTop ? "text-white hover:bg-white/10" : "text-ink hover:bg-ash-100",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-surface lg:hidden fade-in"
        >
          <nav className="shell max-h-[calc(100vh-72px)] overflow-y-auto py-4" aria-label="Mobile">
            <ul className="space-y-1">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-[var(--radius)] px-3 py-3 text-base font-medium transition-colors",
                        active
                          ? "bg-royal-100 text-royal-accent"
                          : "text-ink hover:bg-ash-100",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <ButtonLink
                href="/admissions"
                variant="gold"
                className="h-12 w-full text-base"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => setOpen(false)}
              >
                Apply Now
              </ButtonLink>
              <ButtonLink
                href="/login"
                variant="outline"
                className="h-12 w-full text-base"
                onClick={() => setOpen(false)}
              >
                Portal sign in
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}