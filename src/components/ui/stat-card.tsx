import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  tone?: "royal" | "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

const iconStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  royal: "bg-royal-100 text-royal-600",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-ash-200 text-ink-soft",
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = "royal",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-soft">{label}</p>
          <p className="mt-1.5 font-display text-3xl font-semibold text-ink tabular-nums">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-ash-500">{hint}</p>}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)]",
              iconStyles[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
