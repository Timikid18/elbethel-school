import type { Metadata } from "next";
import Image from "next/image";
import {
  Music,
  Palette,
  Trophy,
  Users,
  Bus,
  Mountain,
  HeartHandshake,
  Camera,
  Shield,
  Sprout,
} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Student Life",
  description:
    "Clubs, sports, houses, trips and the wider activities that make life at EL-BETH-EL The Kings' School vibrant and memorable.",
};

const clubs = [
  { icon: Music, name: "Music & Choir", text: "Choral singing, instruments and school performances." },
  { icon: Palette, name: "Art & Craft", text: "Creative expression through drawing, painting and design." },
  { icon: Users, name: "Debate & Public Speaking", text: "Confident communication and critical thinking." },
  { icon: Sprout, name: "Science & Discovery", text: "Experiments, projects and curiosity-driven learning." },
  { icon: Shield, name: "Sports & Athletics", text: "Football, athletics, and team games with regular fixtures." },
  { icon: HeartHandshake, name: "Values & Leadership", text: "Service, mentoring and student leadership development." },
];

const houses = [
  { name: "Gold House", color: "bg-gold", motto: "Excellence first" },
  { name: "Royal House", color: "bg-royal", motto: "Together we rise" },
  { name: "Emerald House", color: "bg-success", motto: "Wisdom in action" },
  { name: "Crimson House", color: "bg-danger", motto: "Bold and brave" },
];

const galleryItems = [
  { src: "/classroom.webp", alt: "Students learning in a classroom at EL-BETH-EL" },
  { src: "/excursio.webp", alt: "Students on an educational excursion" },
  { src: "/moment.webp", alt: "A memorable moment from campus life" },
  { src: "/logobg.jpg", alt: "The EL-BETH-EL school emblem" },
  { src: "/moment.webp", alt: "A recent EL-BETH-EL graduand and a memorable campus moment" },
  { src: "/hero.webp", alt: "Students and campus at EL-BETH-EL" },
];

export default function StudentLifePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Student Life"
        title="More than lessons — a vibrant community"
        description="Beyond the classroom, our students grow through clubs, sports, competitions, trips and service. Life at EL-BETH-EL is full, fun and formative."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Student Life" }]}
      />

      {/* Clubs */}
      <section className="shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Clubs & Activities
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Find a passion, build a skill
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal
                key={c.name}
                delay={i * 50}
                className="group rounded-[var(--radius-md)] border border-border bg-surface p-7 transition-all duration-200 hover:-translate-y-1 hover:border-royal-300 hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600 transition-colors group-hover:bg-royal group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Sports & Houses */}
      <section className="bg-ash-100/60 py-24">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Sports & the House System
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Friendly rivalry, lasting character
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Every student belongs to a house, fostering teamwork, healthy
              competition and school spirit. House points are earned through
              academics, conduct, sports and service — celebrated at annual
              inter-house competitions and sports day.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-royal text-white">
                <Trophy className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-ink">Inter-House Competitions</p>
                <p className="text-sm text-ink-soft">Sports day, quiz contests and more.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid grid-cols-2 gap-5">
              {houses.map((h) => (
                <div key={h.name} className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
                  <div className={`h-2 ${h.color}`} />
                  <div className="p-6">
                    <p className="font-display text-lg font-semibold text-ink">{h.name}</p>
                    <p className="mt-1 text-sm italic text-ink-soft">“{h.motto}”</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trips & Excursions */}
      <section className="shell py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-royal-100">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/excursio.webp"
                  alt="Students on an educational excursion at EL-BETH-EL The Kings' School"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Trips & Excursions
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Learning beyond the campus
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              Educational excursions, community service days and study visits
              extend learning beyond the classroom. These experiences broaden
              horizons, build confidence and create memories that last.
            </p>
            <ul className="mt-7 space-y-4">
              {[
                { icon: Bus, text: "Organised educational excursions each term." },
                { icon: Mountain, text: "Outdoor and leadership camps for older students." },
                { icon: HeartHandshake, text: "Community service and outreach initiatives." },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.text} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-gold/15 text-warning">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="pt-2.5 text-sm text-ink-soft">{t.text}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ash-100/60 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Moments & Memories
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            A glimpse of life at EL-BETH-EL
          </h2>
        </Reveal>
        <div className="shell mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((g, i) => (
            <Reveal
              key={g.src}
              delay={i * 40}
              className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-border bg-royal-100 shadow-sm"
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-royal/50 via-transparent to-transparent" aria-hidden />
              <Camera className="absolute bottom-3 right-3 h-5 w-5 text-white/70" />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}