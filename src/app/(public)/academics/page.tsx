import type { Metadata } from "next";
import Image from "next/image";
import {
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Layers,
  FlaskConical,
  Users,

} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { divisions } from "@/lib/divisions";
import { PageStructuredData } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Explore academics at EL-BETH-EL The Kings' School, Igando, Lagos — our Early Years, Primary and Secondary curriculum, departments, assessment and academic calendar.",
  alternates: {
    canonical: "/academics",
  },
};

const departments = [
  { title: "Sciences", text: "Mathematics, basic science and technology through hands-on discovery." },
  { title: "Languages & Humanities", text: "English language, literature and social sciences for articulate thinkers." },
  { title: "Creative Arts", text: "Music, art and drama that celebrate imagination and expression." },
  { title: "Technology & Computing", text: "Digital literacy and computer studies for the modern world." },
  { title: "Physical Education", text: "Sports and athletics that build fitness, teamwork and resilience." },
  { title: "Values & Civic", text: "Religious knowledge, civics and character education." },
];

const assessment = [
  { label: "Continuous Assessment", text: "Ongoing tests, assignments and classwork throughout each term." },
  { label: "Formative Feedback", text: "Regular, constructive feedback that helps students improve." },
  { label: "Terminal Examinations", text: "End-of-term exams that measure understanding and progress." },
  { label: "Reports", text: "Detailed progress reports that keep parents fully informed." },
];

export default function AcademicsPage() {
  return (
    <div>
      <PageStructuredData
        path="/academics"
        name="Academics"
        description="Early Years, Primary and Secondary education at EL-BETH-EL The Kings' School — curriculum, departments, assessment and academic calendar."
        breadcrumb={[{ name: "Home", path: "/" }, { name: "Academics" }]}
      />
      <PageHeader
        eyebrow="Academics"
        title="An education that prepares students for life"
        description="Our curriculum is broad, balanced and challenging — designed to build deep understanding, strong skills and lifelong curiosity."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      {/* Philosophy */}
      <section className="shell py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Academic Philosophy
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Learning that goes beyond memorisation
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              We believe students learn best when they are actively engaged,
              challenged appropriately and supported personally. Our teachers
              use a mix of direct instruction, guided discovery, group work and
              practical application to make learning meaningful and lasting.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Layers, title: "A Balanced Curriculum", text: "Academic rigour alongside arts, sports and values." },
                { icon: FlaskConical, title: "Practical, Hands-On Learning", text: "Labs, projects and real-world applications." },
                { icon: Users, title: "Small, Personal Classes", text: "Attention for every learner from caring teachers." },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{f.title}</p>
                      <p className="text-sm text-ink-soft">{f.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-royal-100">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/classroom.webp"
                  alt="Students in a classroom at EL-BETH-EL The Kings' School"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Divisions */}
      <section className="bg-ash-100/60 py-24">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Our Divisions
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              A structured pathway for every stage
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {divisions.map((d, i) => (
              <Reveal key={d.id} delay={i * 60} className="rounded-[var(--radius-md)] border border-border bg-surface p-8">
                <h3 className="font-display text-xl font-semibold text-ink">{d.name}</h3>
                <p className="mt-1 text-sm italic text-royal-500">{d.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{d.description}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  {d.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Departments & Subjects
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Broad learning, deep foundations
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d, i) => {
            const Icon = BookOpen;
            return (
              <Reveal key={d.title} delay={i * 50} className="flex gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{d.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{d.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Assessment */}
        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-royal text-white">
              <ClipboardCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold text-ink">How we assess</h2>
            <div className="mt-6 space-y-5">
              {assessment.map((a) => (
                <div key={a.label} className="flex gap-4">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <div>
                    <p className="font-semibold text-ink">{a.label}</p>
                    <p className="text-sm text-ink-soft">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80} className="rounded-[var(--radius-lg)] border border-border bg-royal p-10 text-white">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-white/10 text-gold">
              <CalendarDays className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-semibold">Academic Calendar</h2>
            <p className="mt-3 text-base text-royal-300">
              The school year runs in three terms within each academic session.
              Key dates — including resumption, mid-term breaks, examinations
              and holidays — are communicated to parents at the start of each
              term and maintained in our calendar.
            </p>
            <div className="mt-6 rounded-[var(--radius)] border border-white/10 bg-white/5 p-4 text-sm text-royal-300">
              The full academic calendar — resumption, mid-term breaks,
              examinations and holidays — is shared with parents at the start
              of each term and kept up to date in the school office.
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}