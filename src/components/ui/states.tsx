import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function EmptyState({
  icon,
  title,
  message,
  action,
  actionLabel,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-dashed border-ash-300 bg-ash-100/50 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-royal-100 text-royal-500">
          {icon}
        </div>
      )}
      <div>
        <p className="font-display text-base font-semibold text-ink">{title}</p>
        {message && <p className="mt-1 text-sm text-ink-soft">{message}</p>}
      </div>
      {action && actionLabel && (
        <Button variant="secondary" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-ink-soft",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-royal-500" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-md)] border border-danger-soft bg-danger-soft/40 px-6 py-14 text-center",
        className,
      )}
    >
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      <p className="text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
