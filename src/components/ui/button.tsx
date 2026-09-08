"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-royal text-white shadow-sm hover:bg-royal-600 focus-visible:ring-royal-400 disabled:hover:bg-royal",
  secondary:
    "bg-royal-100 text-royal-accent hover:bg-royal-300/60 focus-visible:ring-royal-300 border border-transparent",
  outline:
    "border border-ash-400 bg-surface text-ink hover:bg-ash-100 hover:border-ash-500 focus-visible:ring-ash-400",
  ghost:
    "bg-transparent text-ink-soft hover:bg-ash-100 hover:text-ink focus-visible:ring-ash-400",
  danger:
    "bg-danger text-white shadow-sm hover:bg-danger/90 focus-visible:ring-danger/40",
  gold: "bg-gold text-royal shadow-sm hover:bg-gold/90 focus-visible:ring-gold/40",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-11 px-5 text-sm gap-2 rounded-[var(--radius)]",
  lg: "h-12 px-7 text-base gap-2 rounded-[var(--radius-md)]",
  icon: "h-10 w-10 rounded-[var(--radius)]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex select-none items-center justify-center font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 disabled:opacity-55 disabled:pointer-events-none",
          "active:scale-[0.98]",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
Button.displayName = "Button";

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}
