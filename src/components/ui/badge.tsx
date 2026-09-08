import * as React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "royal"
  | "golden"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const tones: Record<Tone, string> = {
  royal: "bg-royal-100 text-royal-700",
  golden: "bg-gold-100 text-warning",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-ash-200 text-ink-soft",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
