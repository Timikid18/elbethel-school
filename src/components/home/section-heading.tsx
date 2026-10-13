import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "../ui/reveal";

const DOT_COLORS = ["#ffc83d", "#47b6ea", "#ff7a6b", "#2fc39b", "#8b7be8"];

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
        <p className={cn("flex", centered ? "justify-center" : "justify-start")}>
          <span className="play-chip bg-royal-100 text-royal-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            {eyebrow}
          </span>
        </p>
      )}
      <h2 className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
      {centered && (
        <div className="mt-7 flex justify-center gap-1.5" aria-hidden>
          {DOT_COLORS.map((c) => (
            <span
              key={c}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </Reveal>
  );
}
