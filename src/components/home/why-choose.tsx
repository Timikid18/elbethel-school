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
import { ButtonLink } from "../ui/button";

const pillars = [
  {
    icon: Award,
    title: "Academic Excellence",
    text: "A rigorous, well-structured curriculum that challenges students to think critically and achieve their very best.",
  },
  {
    icon: HeartHandshake,
    title: "Character Development",
    text: "We intentionally build integrity, discipline, leadership and compassion into the daily life of every learner.",
  },
  {
    icon: Users,
    title: "Experienced Educators",
    text: "Dedicated, well-qualified teachers who know each child by name and meet them where they are.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Environment",
    text: "A caring, secure and well-supervised campus where every child can learn and grow with confidence.",
  },
  {
    icon: Laptop,
    title: "Modern Learning",
    text: "Contemporary teaching methods and resources that prepare students for a digital and global future.",
  },
  {
    icon: Sprout,
    title: "Holistic Development",
    text: "A balanced education spanning academics, sports, arts and values for well-rounded individuals.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-ash-100/60 py-24">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        {/* Intro column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">Why EL-BETH-EL</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.55rem]">
              Reasons families{" "}
              <em className="display-italic text-royal-accent">choose us</em>
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
                className="text-sm font-semibold text-royal-accent transition-colors hover:text-royal"
              >
                More about our values
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Pillar list */}
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm">
          <ul>
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal
                  key={p.title}
                  delay={i * 60}
                  as="li"
                  className={
                    "group flex gap-5 p-6 transition-colors hover:bg-ash-100/60 sm:p-7 " +
                    (i < pillars.length - 1 ? "hairline" : "")
                  }
                >
                  <span className="hidden font-display text-2xl font-bold text-royal-100 transition-colors group-hover:text-royal-300 sm:block sm:min-w-[2.5rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-accent transition-colors group-hover:bg-royal group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
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