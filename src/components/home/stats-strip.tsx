import { Reveal } from "../ui/reveal";

const EST_YEAR = 2010;

export function StatsStrip() {
  const years = new Date().getFullYear() - EST_YEAR;

  const stats = [
    { value: "175+", label: "Happy Learners" },
    { value: "9+", label: "Dedicated Educators" },
    { value: "15+", label: "Class Levels" },
    { value: `${years}`, label: "Years of Excellence" },
  ];

  return (
    <section className="relative border-y border-border bg-gradient-to-b from-surface to-ash-100/40">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden />
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 60} className="text-center">
            <p className="stat-figure text-4xl text-royal-accent sm:text-5xl">
              {s.value}
            </p>
            <div className="mx-auto mt-3 h-px w-10 bg-gold/60" aria-hidden />
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-ink-soft">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}