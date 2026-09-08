import { ArrowRight, GraduationCap } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { divisions } from "@/lib/divisions";
import { ButtonLink } from "../ui/button";

export function Divisions() {
  return (
    <section className="shell py-24">
      <SectionHeading
        eyebrow="School Divisions"
        title="A complete learning journey"
        description="From the very first steps into school through to senior secondary, we offer a seamless, well-supported pathway for every child."
      />

      <div className="mt-14">
        {/* Academic excellence banner */}
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-lg)] bg-royal p-8 text-white shadow-[var(--shadow-md)] sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-gold">
                <GraduationCap className="h-6 w-6" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Academic Excellence
              </p>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              A curriculum that inspires and challenges
            </h3>
            <p className="mt-3 max-w-xl text-base text-royal-300">
              Our teaching philosophy combines disciplined academic rigour with
              modern, engaging methods — helping every student understand
              deeply, question boldly and excel confidently.
            </p>
          </div>
          <ButtonLink
            href="/academics"
            className="h-11 shrink-0 border-white/25 bg-white/5 px-6 text-sm font-medium text-white hover:bg-white/10"
            variant="outline"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Explore Academics
          </ButtonLink>
        </Reveal>

        {/* Division journey */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {divisions.map((d, i) => (
            <Reveal key={d.id} delay={i * 80} as="div">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-royal-300 hover:shadow-[var(--shadow-md)]">
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-royal via-gold to-royal transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="flex items-start justify-between p-7 pb-0 sm:p-8 sm:pb-0">
                  <div>
                    <span className="font-display text-4xl font-bold tracking-tight text-royal-100">
                      0{i + 1}
                    </span>
                    <span className="mt-1 block h-px w-8 bg-gold/70" aria-hidden />
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-royal-100 bg-royal-100/60 text-royal-accent transition-colors group-hover:bg-royal group-hover:text-white">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 pt-5 sm:p-8 sm:pt-5">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                    {d.name}
                  </h3>
                  <p className="mt-0.5 text-sm italic text-royal-500">
                    {d.tagline}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {d.description}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-5">
                    {d.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-ink-soft"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}