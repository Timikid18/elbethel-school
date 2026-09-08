import { ArrowRight, FileText, CalendarDays, MessageCircle } from "lucide-react";
import { Reveal } from "../ui/reveal";
import { ButtonLink } from "../ui/button";

const steps = [
  { icon: FileText, label: "Submit application" },
  { icon: CalendarDays, label: "Complete assessment" },
  { icon: MessageCircle, label: "Meet our team" },
];

export function AdmissionsCTA() {
  return (
    <section className="shell py-24">
      <Reveal className="relative overflow-hidden rounded-[var(--radius-lg)] bg-royal px-8 py-16 text-center text-white sm:px-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-royal-600/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />

        <div className="relative">
          <p className="eyebrow is-centered text-gold">Admissions Open</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.12] tracking-tight text-balance sm:text-4xl lg:text-[2.6rem]">
            Give your child the foundation for a{" "}
            <em className="display-italic text-gold-shimmer">brilliant</em>{" "}
            future
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-royal-300">
            Begin the simple, guided admission process today. Our team is here
            to support you at every step.
          </p>

          {/* Steps */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 sm:flex-row sm:gap-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-white/5 text-gold transition-colors hover:bg-gold hover:text-royal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-royal-100">
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className="mx-6 hidden h-px w-10 bg-gradient-to-r from-white/30 to-white/10 sm:block"
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href="/admissions"
              variant="gold"
              className="h-[52px] px-8 text-base font-semibold"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Start Your Application
            </ButtonLink>
            <ButtonLink
              href="/contact"
              className="h-[52px] border-white/25 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10"
              variant="outline"
            >
              Enquire About Admission
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}