import { ArrowRight, FileText, CalendarDays, MessageCircle } from "lucide-react";
import { Reveal } from "../ui/reveal";
import { ButtonLink } from "../ui/button";

const steps = [
  { icon: FileText, label: "Submit application", color: "#ffc83d" },
  { icon: CalendarDays, label: "Complete assessment", color: "#47b6ea" },
  { icon: MessageCircle, label: "Meet our team", color: "#2fc39b" },
];

const confetti = [
  { left: "8%", top: "18%", color: "#ffc83d", size: 10 },
  { left: "20%", top: "70%", color: "#ff7a6b", size: 8 },
  { left: "82%", top: "22%", color: "#2fc39b", size: 9 },
  { left: "90%", top: "66%", color: "#8b7be8", size: 11 },
  { left: "48%", top: "12%", color: "#47b6ea", size: 7 },
];

export function AdmissionsCTA() {
  return (
    <section className="shell py-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-royal px-8 py-16 text-center text-white shadow-[var(--shadow-lg)] sm:px-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-play-sky/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-play-coral/20 blur-3xl" aria-hidden />

        {/* Confetti */}
        {confetti.map((c, i) => (
          <span
            key={i}
            className="play-bob pointer-events-none absolute hidden rounded-[3px] sm:block"
            style={{
              left: c.left,
              top: c.top,
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              animationDelay: `${i * 0.4}s`,
              transform: `rotate(${i * 35}deg)`,
            }}
            aria-hidden
          />
        ))}

        <div className="relative">
          <span className="play-chip bg-gold text-royal">Admissions Open</span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.12] tracking-tight text-balance sm:text-4xl lg:text-[2.7rem]">
            Give your child the foundation for a{" "}
            <span className="play-underline text-gold-shimmer">brilliant</span>{" "}
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
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-royal shadow-sm transition-transform duration-200 hover:scale-110"
                    style={{ backgroundColor: s.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-royal-100">
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
              className="h-[52px] rounded-full px-8 text-base font-bold"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Start Your Application
            </ButtonLink>
            <ButtonLink
              href="/contact"
              className="h-[52px] rounded-full border-white/30 bg-white/10 px-8 text-base font-semibold text-white hover:bg-white/20"
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
