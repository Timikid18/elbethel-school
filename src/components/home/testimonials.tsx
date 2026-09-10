import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { testimonials } from "@/lib/testimonials";

export function Testimonials() {
  return (
    <section className="bg-ash-100/60 py-24">
      <div className="shell">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our families say"
        />
        <div className="mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 80}
              className="group relative flex aspect-square w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-royal-300 hover:shadow-[var(--shadow-md)] sm:w-[52%] sm:p-6 md:aspect-auto md:w-auto md:min-w-0 md:p-8"
            >
              <span
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-royal via-gold to-royal transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
<span className="font-display text-5xl leading-none text-royal-100 select-none sm:text-6xl">
                &#8220;
              </span>
              <div className="-mt-1 flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                ))}
              </div>
              <p className="mt-3 flex-1 font-display text-[0.95rem] italic leading-relaxed text-ink sm:text-[1.05rem]">
                {t.quote}
              </p>
              <div className="mt-4 pt-3 hairline-gold sm:mt-6 sm:pt-4">
                <p className="font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-ash-500">{t.role}</p>
              </div>
              {t.sample && (
                <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-ash-400">
                  Awaiting official testimonial
                </p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}