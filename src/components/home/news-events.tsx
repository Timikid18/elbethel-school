import Link from "next/link";
import { ArrowRight, CalendarDays, Megaphone } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";
import { prisma } from "@/lib/prisma";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(d: Date) {
  return `${monthNames[d.getMonth()]} ${d.getDate()}`;
}

export async function NewsEvents() {
  let events: { title: string; description: string | null; startDate: Date }[] = [];
  try {
    events = await prisma.event.findMany({
      where: { isPublic: true },
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
        {items.map((e, i) => (
          <Reveal
            key={e.title}
            delay={i * 80}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface p-7 transition-all duration-200 hover:-translate-y-1 hover:border-royal-300 hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 flex-col items-center justify-center rounded-[var(--radius)] bg-royal text-white transition-colors group-hover:bg-royal-600">
                <CalendarDays className="h-4 w-4 text-gold" />
                <span className="mt-0.5 text-xs font-semibold">
                  {formatDate(e.startDate)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-royal-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Upcoming
              </span>
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-ink">
              {e.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
              {e.description}
            </p>
            <span className="mt-6 block h-px w-full bg-gradient-to-r from-gold/60 to-transparent group-hover:from-gold" aria-hidden />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/news"
          className="inline-flex h-11 items-center gap-2 rounded-[var(--radius)] border border-ash-400 bg-surface px-6 text-sm font-medium text-ink transition-colors hover:bg-ash-100"
        >
          View All News & Events <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
