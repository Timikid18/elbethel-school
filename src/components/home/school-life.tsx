import Image from "next/image";
import { BookOpen, Trophy, Palette, Users, FlaskConical, Camera } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "../ui/reveal";

const activities = [
  { icon: BookOpen, label: "Learning" },
  { icon: Trophy, label: "Sports" },
  { icon: Palette, label: "Creativity" },
  { icon: Users, label: "Community" },
  { icon: FlaskConical, label: "Discovery" },
];

const montage = [
  {
    src: "/classroom.webp",
    caption: "Inspired classrooms and libraries",
    fill: true,
    className: "lg:col-span-2",
  },
  {
    src: "/excursio.webp",
    caption: "Excursions & discovery",
    className: "",
  },
  {
    src: "/moment.webp",
    caption: "Campus moments",
    className: "",
  },
];

export function SchoolLife() {
  return (
    <section className="shell py-24">
      <SectionHeading
        eyebrow="School Life"
        title="Beyond the classroom"
        description="Learning at EL-BETH-EL extends far beyond textbooks. Our vibrant campus life helps students discover their talents, build friendships and grow in confidence."
      />

      {/* Activity strip */}
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <Reveal
              key={a.label}
              delay={i * 50}
              className="group flex items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-royal-300 hover:shadow-[var(--shadow)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal text-white transition-colors group-hover:bg-gold group-hover:text-royal">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{a.label}</span>
            </Reveal>
          );
        })}
      </div>

      {/* Photo montage */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {montage.map((m, i) => (
          <Reveal
            key={m.src}
            delay={i * 80}
            className={
              "group relative overflow-hidden rounded-[var(--radius-md)] bg-royal-100 shadow-sm " +
              (m.className ?? "")
            }
          >
            <div className={m.fill ? "relative aspect-[16/10] w-full sm:aspect-[2/1] lg:aspect-auto lg:h-full lg:min-h-[22rem]" : "relative aspect-[4/3] w-full lg:aspect-auto lg:h-64 lg:min-h-[17rem]"}>
              <Image
                src={m.src}
                alt={m.caption}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <span className="absolute inset-0 bg-gradient-to-t from-royal/70 via-transparent to-transparent" aria-hidden />
            <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm font-medium text-white">
              <Camera className="h-4 w-4 text-gold" aria-hidden />
              {m.caption}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}