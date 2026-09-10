import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Megaphone, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "Announcements, school news and upcoming events from EL-BETH-EL The Kings' School.",
};

export const dynamic = "force-dynamic";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


const fallbackAnnouncements = [
  {
    title: "Welcome to the New Session",
    body: "We are excited to kick off another year of learning, growth and excellence at EL-BETH-EL The Kings' School. Welcome back, kings and queens!",
    isPinned: true,
  },
  {
    title: "Parent-Teacher Conference Dates",
    body: "Scheduled parent-teacher conferences will be held this term. Check the calendar and book your slot via the school office.",
    isPinned: false,
  },
  {
    title: "New Admissions Are Open",
    body: "Applications for the next session are now open across Early Years, Primary and Secondary. Visit the admissions page to begin.",
    isPinned: false,
  },
];

const fallbackEvents = [
  {
    title: "Inter-House Sports Day",
    description: "A day of athletics, games and friendly competition.",
    location: "School Sports Field",
    startDate: new Date(2026, 8, 25),
  },
  {
    title: "Open Day & Admissions Tour",
    description: "Prospective families are invited to tour our campus and meet our team.",
    location: "Main Campus",
    startDate: new Date(2026, 9, 10),
  },
  {
    title: "Cultural & Arts Festival",
    description: "A colourful celebration of music, drama, art and culture.",
    location: "Assembly Hall",
    startDate: new Date(2026, 11, 5),
  },
];

export default async function NewsPage() {
  let announcements: { title: string; body: string; isPinned: boolean }[] = [];
  let events: {
    title: string;
    description: string | null;
    location: string | null;
    startDate: Date;
  }[] = [];

  try {
    [announcements, events] = await Promise.all([
      prisma.announcement.findMany({
        where: { audience: "EVERYONE" },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
      prisma.event.findMany({
        where: { isPublic: true, startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: 6,
      }),
    ]);
  } catch {
    announcements = [];
    events = [];
  }

  const announcementItems =
    announcements.length > 0 ? announcements : fallbackAnnouncements;
  const eventItems = events.length > 0 ? events : fallbackEvents;

  return (
    <div>
      <PageHeader
        eyebrow="News & Events"
        title="Stay connected with our community"
        description="Announcements, school news and upcoming events across EL-BETH-EL The Kings' School."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <section className="shell py-20">
        <div className="grid gap-14 lg:grid-cols-5">
          {/* Announcements */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal text-white">
                  <Megaphone className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Announcements
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 space-y-5">
              {announcementItems.map((a, i) => (
                <Reveal
                  key={a.title}
                  delay={i * 60}
                  className="rounded-[var(--radius-md)] border border-border bg-surface p-7"
                >
                  <div className="flex items-center gap-2">
                    {a.isPinned && <Badge tone="golden" dot>Pinned</Badge>}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {a.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-gold text-royal">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Upcoming Events
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 space-y-5">
              {eventItems.map((e, i) => (
                <Reveal
                  key={e.title}
                  delay={i * 60}
                  className="group rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex w-14 shrink-0 flex-col items-center rounded-[var(--radius)] bg-royal py-2 text-white">
                      <span className="font-display text-lg font-bold leading-none">
                        {e.startDate.getDate()}
                      </span>
                      <span className="mt-0.5 text-[10px] uppercase tracking-wide text-royal-300">
                        {monthNames[e.startDate.getMonth()].slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-ink">
                        {e.title}
                      </h3>
                      <p className="mt-1 text-sm text-ink-soft">{e.description}</p>
                      {e.location && (
                        <p className="mt-1.5 text-xs font-medium text-royal-500">
                          {e.location}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="mt-16">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[var(--radius-lg)] bg-royal px-8 py-10 text-white sm:flex-row">
            <div>
              <h3 className="font-display text-xl font-semibold">
                Don&apos;t miss a moment
              </h3>
              <p className="mt-1 text-sm text-royal-300">
                Join our school to receive announcements and event reminders.
              </p>
            </div>
            <Link
              href="/admissions/apply"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-[var(--radius-md)] bg-gold px-7 text-sm font-semibold text-royal transition-all hover:bg-gold/90 active:scale-[0.98]"
            >
              Start Application <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}