import Link from "next/link";
import {
  Award,
  HeartHandshake,
  Users,
  ShieldCheck,
  Laptop,
  Sprout,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "../ui/reveal";

const pillars = [
  {
    icon: Award,
    color: "#ffc83d",
    title: "Academic Excellence",
    text: "A rigorous, well-structured curriculum that challenges students to think critically and achieve their very best.",
  },
  {
    icon: HeartHandshake,
    color: "#ff7a6b",
    title: "Character Development",
    text: "We intentionally build integrity, discipline, leadership and compassion into the daily life of every learner.",
  },
  {
    icon: Users,
    color: "#47b6ea",
    title: "Experienced Educators",
    text: "Dedicated, well-qualified teachers who know each child by name and meet them where they are.",
  },
  {
    icon: ShieldCheck,
    color: "#2fc39b",
    title: "Safe Environment",
    text: "A caring, secure and well-supervised campus where every child can learn and grow with confidence.",
  },
  {
    icon: Laptop,
    color: "#8b7be8",
    title: "Modern Learning",
    text: "Contemporary teaching methods and resources that prepare students for a digital and global future.",
  },
  {
    icon: Sprout,
    color: "#63bd45",
    title: "Holistic Development",
    text: "A balanced education spanning academics, sports, arts and values for well-rounded individuals.",
  },
];

export function WhyChoose() {
  return (
    <section className="relative overflow-hidden bg-ash-100/60 py-24">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-play-sky/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-play-coral/10 blur-3xl"
        aria-hidden
      />
      <div className="shell relative grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        {/* Intro column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="play-chip bg-royal-100 text-royal-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Why EL-BETH-EL
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.6rem]">
              Reasons families{" "}
              <span className="play-underline text-royal-accent">choose us</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
              Every decision at our school is guided by one question: what is
              best for the child? Here is why parents trust us with their
              children&apos;s future.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 bg-gold" aria-hidden />
              <Link
                href="/about"
                className="text-sm font-bold text-royal-accent transition-colors hover:text-royal"
              >
                More about our values
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Pillar list */}
        <div className="rounded-[1.75rem] border border-border bg-surface p-2 shadow-sm sm:p-3">
          <ul className="grid gap-2 sm:gap-3">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal
                  key={p.title}
                  delay={i * 60}
                  as="li"
                  className="group flex gap-5 rounded-2xl p-4 transition-colors hover:bg-ash-100/70 sm:p-5"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: p.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                        {p.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
