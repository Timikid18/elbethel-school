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
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 80}
              className="group relative flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-royal-300 hover:shadow-[var(--shadow-md)]"
            >
              <span
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-royal via-gold to-royal transition-transform duration-300 group-hover:scale-x-100"
                aria-hidden
              />
              <span className="font-display text-6xl leading-none text-royal-100 select-none">
                “
              </span>
              <div className="-mt-2 flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 font-display text-[1.05rem] italic leading-relaxed text-ink">
                {t.quote}
              </p>
              <div className="mt-6 pt-4 hairline-gold">
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