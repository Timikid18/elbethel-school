"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  Home,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavSection } from "@/lib/nav";
import { Avatar } from "../ui/avatar";
import { LogoMark, Wordmark } from "../ui/logo";

interface AppShellProps {
  nav: NavSection[];
  title: string;
  userName: string;
  userRole: string;
  unreadNotifications?: number;
  hasNotifications?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  nav,
  title,
  userName,
  userRole,
  unreadNotifications = 0,
  hasNotifications = false,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const isActive = (match?: string[]) => {
    if (!match) return pathname === "/";
    return match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const navContent = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ash-500">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(item.match);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-royal text-white shadow-sm"
                        : "text-ink-soft hover:bg-ash-100 hover:text-ink",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active ? "text-white" : "text-ash-500 group-hover:text-royal-accent",
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-5">
        <LogoMark />
        <Wordmark />
      </div>
      {navContent}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ash-100 hover:text-ink"
        >
          <Home className="h-[18px] w-[18px] text-ash-500" />
          Public Website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ash-100/70">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-royal/40 backdrop-blur-sm fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-2xl fade-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-ash-500 hover:bg-ash-100 hover:text-ink"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-ink hover:bg-ash-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-ink">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={ref}>
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="relative rounded-md p-2 text-ink-soft transition-colors hover:bg-ash-100 hover:text-ink"
                aria-label={`Notifications${unreadNotifications ? ` (${unreadNotifications} unread)` : ""}`}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-[var(--radius-md)] border border-border bg-surface p-4 shadow-lg fade-in">
                  {hasNotifications ? (
                    <p className="text-sm text-ink-soft">
                      You have recent notifications.
                    </p>
                  ) : (
                    <p className="text-sm text-ash-500">
                      You&apos;re all caught up.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 rounded-[var(--radius)] p-1.5 transition-colors hover:bg-ash-100"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <Avatar name={userName} size="md" />
                <span className="hidden max-w-[120px] truncate text-left sm:block">
                  <span className="block truncate text-sm font-medium text-ink">
                    {userName}
                  </span>
                  <span className="block text-xs capitalize text-ash-500">
                    {userRole.toLowerCase().replace("_", " ")}
                  </span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-ash-500 sm:block" />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-14 w-56 rounded-[var(--radius-md)] border border-border bg-surface p-2 shadow-lg fade-in"
                  role="menu"
                >
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-ink">{userName}</p>
                    <p className="truncate text-xs text-ash-500">{userRole}</p>
                  </div>
                  <Link
                    href="/"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-ash-100 hover:text-ink"
                  >
                    <Home className="h-4 w-4" /> Public site
                  </Link>
                  <Link
                    href="/settings"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-ash-100 hover:text-ink"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-ash-100 hover:text-ink"
                  >
                    <User className="h-4 w-4" /> My profile
                  </Link>
                  <div className="my-1 border-t border-border" />
                  <Link
                    href="/api/auth/signout"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-danger transition-colors hover:bg-danger-soft"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Click away */}
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-10" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}
    </div>
  );
}
