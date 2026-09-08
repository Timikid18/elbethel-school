import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.webp"
      alt="EL-BETH-EL The Kings' School logo"
      width={300}
      height={300}
      priority={priority}
      className={cn(
        "h-9 w-9 object-contain",
        className,
      )}
    />
  );
}

export function Wordmark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-display text-base font-bold tracking-tight sm:text-lg",
          onDark ? "text-white" : "text-ink",
        )}
      >
        EL-BETH-EL
      </span>
      <span
        className={cn(
          "text-[10px] font-medium uppercase tracking-[0.18em]",
          onDark ? "text-royal-300" : "text-ash-500",
        )}
      >
The Kings&apos; School
      </span>
    </div>
  );
}
