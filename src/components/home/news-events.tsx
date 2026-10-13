import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { prisma } from "@/lib/prisma";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ACCENTS = ["#ff7a6b", "#47b6ea", "#8b7be8"];

function formatDate(d: Date) {
  return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export async function NewsEvents() {
  let events: { title: string; description: string | null; startDate: Date }[] = [];
  try {
    events = await prisma.event.findMany({
      where: { isPublic: true, startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 3,
    });
  } catch {
    events = [];
  }

  const fallback = [
    {
      title: "Inter-House Sports Day",
      description: "A day of athletics, games and friendly competition.",
      startDate: new Date(2026, 8, 25),
    },
    {
      title: "Open Day & Admissions Tour",
      description: "Prospective families are invited to tour our campus.",
      startDate: new Date(2026, 9, 10),
    },
  ];

  const items = events.length > 0 ? events : fallback;

  return (
    <section className="shell py-24">
      <SectionHeading
        eyebrow="News & Events"
        title="What's happening at EL-BETH-EL"
        description="Stay up to date with announcements, academic updates and upcoming events across our school community."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((e, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <Reveal
              key={e.title}
              delay={i * 80}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface p-7 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: accent }}
                >
                  <CalendarDays className="h-4 w-4 text-white/80" />
                  <span className="mt-0.5 text-xs font-bold">
                    {formatDate(e.startDate)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ash-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-royal-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Upcoming
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink">
                {e.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                {e.description}
              </p>
              <span
                className="mt-6 block h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/news"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-ash-400 bg-surface px-6 text-sm font-bold text-ink transition-colors hover:bg-ash-100"
        >
          View All News & Events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
