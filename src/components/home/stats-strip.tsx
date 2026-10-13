import { Reveal } from "../ui/reveal";

const EST_YEAR = 2010;

export function StatsStrip() {
  const years = new Date().getFullYear() - EST_YEAR;

  const stats = [
    { value: "175+", label: "Happy Learners", color: "#ffc83d", emoji: "🎒" },
    { value: "9+", label: "Dedicated Educators", color: "#47b6ea", emoji: "🍎" },
    { value: "15+", label: "Class Levels", color: "#2fc39b", emoji: "📚" },
    { value: `${years}`, label: "Years of Excellence", color: "#8b7be8", emoji: "🏆" },
  ];

  return (
    <section className="relative border-b border-border bg-gradient-to-b from-surface to-ash-100/50">
      <span
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        aria-hidden
      />
      <div className="shell grid grid-cols-2 gap-4 py-14 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 60}
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
          >
            <span
              className="absolute inset-x-0 top-0 h-1.5 origin-left transition-transform duration-300 group-hover:scale-x-100"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: `${s.color}22` }}
              aria-hidden
            >
              {s.emoji}
            </span>
            <p className="stat-figure mt-4 text-4xl text-royal-accent sm:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-ink-soft">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
