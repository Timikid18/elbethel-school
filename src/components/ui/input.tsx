"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-[var(--radius)] border bg-surface px-3.5 text-sm text-ink shadow-sm transition-colors",
          "placeholder:text-ash-500",
          "border-ash-400 focus:border-royal focus:ring-2 focus:ring-royal-100 focus:outline-none",
          invalid && "border-danger focus:border-danger focus:ring-danger/20",
          "disabled:bg-ash-100 disabled:text-ash-500",
          className,
        )}
        aria-invalid={invalid}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
