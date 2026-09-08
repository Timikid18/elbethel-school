import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "../ui/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        centered ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow",
            !centered && "justify-start [&::before]:hidden",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.55rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
      {centered && (
        <div className="mt-7 flex justify-center">
          <span className="divider-gold" aria-hidden>
            <span className="diamond" />
          </span>
        </div>
      )}
    </Reveal>
  );
}