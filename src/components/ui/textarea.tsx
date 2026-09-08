"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-[var(--radius)] border bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm transition-colors",
        "placeholder:text-ash-500",
        "border-ash-400 focus:border-royal focus:ring-2 focus:ring-royal-100 focus:outline-none",
        invalid && "border-danger focus:border-danger focus:ring-danger/20",
        "disabled:bg-ash-100",
        className,
      )}
      aria-invalid={invalid}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
