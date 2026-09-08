"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutDashboard, Inbox, MessageSquare } from "lucide-react";

export function PortalShell({
  userName,
  role,
  children,
}: {
  userName: string;
  role?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const nav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    ...(role === "SUPER_ADMIN" || role === "ADMIN"
      ? [
          { href: "/admin/admissions", label: "Admissions", icon: Inbox },
          { href: "/admin/contact", label: "Contact messages", icon: MessageSquare },
        ]
      : []),
  ];

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 border-b border-border px-5 py-5 transition-opacity hover:opacity-85">
        <LogoMark />
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-ink">EL-BETH-EL</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">Portal</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-royal text-white shadow-sm"
                  : "text-ink-soft hover:bg-ash-100 hover:text-ink",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  active
                    ? "text-gold"
                    : "text-ash-500 group-hover:text-royal-accent",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-ink">{userName}</p>
          <ThemeToggle className="border-ash-300 bg-surface text-ink-soft hover:text-ink" />
        </div>
        <SignOutButton />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ash-100/60">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface lg:block">
        {sidebar}
      </aside>

      {/* Mobile topbar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-sm font-bold text-ink">EL-BETH-EL Portal</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="border-ash-300 bg-surface text-ink-soft hover:text-ink" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-ink hover:bg-ash-100"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-20 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface shadow-xl fade-in">
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 px-4 pb-12 pt-24 sm:px-8 lg:ml-64 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
