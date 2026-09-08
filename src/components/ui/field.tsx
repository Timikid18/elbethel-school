"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
}

export function Field({
  label,
  required,
  hint,
  error,
  htmlFor,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-ink"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-ash-500">{hint}</p>
      )}
    </div>
  );
}
