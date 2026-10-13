import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { testimonials } from "@/lib/testimonials";

const ACCENTS = ["#8b7be8", "#47b6ea", "#ff7a6b"];

function initials(name: string) {
  return name
    .replace(/^Mrs?\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function Testimonials() {
  return (
    <section className="bg-ash-100/60 py-24">
      <div className="shell">
        <SectionHeading eyebrow="Testimonials" title="What our families say" />
        <div className="mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal
                key={t.name}
                delay={i * 80}
                className="group relative flex aspect-square w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)] sm:w-[52%] sm:p-6 md:aspect-auto md:w-auto md:min-w-0 md:p-8"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                />
                <span
                  className="font-display text-5xl leading-none select-none sm:text-6xl"
                  style={{ color: accent }}
                >
                  &#8220;
                </span>
                <div className="-mt-1 flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-[0.95rem] font-semibold leading-relaxed text-ink sm:text-[1.05rem]">
                  {t.quote}
                </p>
                <div className="mt-4 flex items-center gap-3 pt-3 hairline sm:mt-6 sm:pt-4">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-royal"
                    style={{ backgroundColor: accent }}
                    aria-hidden
                  >
                    {initials(t.name)}
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </div>
                </div>
                {t.sample && (
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-ash-600">
                    Awaiting official testimonial
                  </p>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
