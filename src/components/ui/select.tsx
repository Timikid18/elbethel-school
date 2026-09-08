"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full appearance-none rounded-[var(--radius)] border border-ash-400 bg-surface px-3.5 pr-9 text-sm text-ink shadow-sm transition-colors",
          "focus:border-royal focus:ring-2 focus:ring-royal-100 focus:outline-none",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%236b7690%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.75rem_center] bg-no-repeat",
          invalid && "border-danger focus:border-danger focus:ring-danger/20",
          "disabled:bg-ash-100",
          className,
        )}
        aria-invalid={invalid}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
