import { ArrowRight, GraduationCap, BookOpen, Rocket, Blocks } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { divisions } from "@/lib/divisions";
import { ButtonLink } from "../ui/button";

const STAGE_STYLE: Record<string, { color: string; icon: typeof BookOpen }> = {
  "early-years": { color: "#ff7a6b", icon: Blocks },
  primary: { color: "#47b6ea", icon: BookOpen },
  secondary: { color: "#2fc39b", icon: Rocket },
};

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
        <Reveal className="relative mb-10 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-royal p-8 text-white shadow-[var(--shadow-md)] sm:p-10 lg:flex-row lg:items-center">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-play-sun/20 blur-3xl"
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-royal">
                <GraduationCap className="h-6 w-6" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                Academic Excellence
              </p>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
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
            className="relative h-11 shrink-0 rounded-full border-white/30 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20"
            variant="outline"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Explore Academics
          </ButtonLink>
        </Reveal>

        {/* Division journey */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {divisions.map((d, i) => {
            const style = STAGE_STYLE[d.id] ?? { color: "#ffc83d", icon: BookOpen };
            const Icon = style.icon;
            return (
              <Reveal key={d.id} delay={i * 80} as="div">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)]">
                  <span
                    className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ backgroundColor: style.color }}
                    aria-hidden
                  />
                  <div className="flex items-start justify-between p-7 pb-0 sm:p-8 sm:pb-0">
                    <span
                      className="font-display text-4xl font-bold tracking-tight"
                      style={{ color: style.color }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-royal shadow-sm transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: style.color }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7 pt-4 sm:p-8 sm:pt-4">
                    <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                      {d.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold" style={{ color: style.color }}>
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
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: style.color }}
                            aria-hidden
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
