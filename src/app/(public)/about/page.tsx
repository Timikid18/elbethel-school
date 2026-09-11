import type { Metadata } from "next";
import Image from "next/image";
import {
  Target,
  Eye,
  HandHeart,
  Compass,
  Users,
  ShieldCheck,
  BookOpen,
  Award,
} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { PageStructuredData } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The official story of EL-BETH-EL The Kings' School, Egan, Igando, Lagos State — established in 2010. Learn about our vision, mission, values and educational philosophy.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  { icon: HandHeart, title: "Integrity", text: "We do what is right, even when no one is watching." },
  { icon: ShieldCheck, title: "Excellence", text: "We pursue high standards in all that we do." },
  { icon: Compass, title: "Discipline", text: "We build focus, order and self-control in every learner." },
  { icon: Users, title: "Community", text: "We work together as one caring school family." },
];

const stats = [
  { value: "175+", label: "Happy Learners" },
  { value: "9+", label: "Dedicated Educators" },
  { value: "15+", label: "Class Levels" },
  { value: `${new Date().getFullYear() - 2010}`, label: "Years of Excellence" },
];

export default function AboutPage() {
  return (
    <div>
      <PageStructuredData
        path="/about"
        name="About Us"
        description="The official story of EL-BETH-EL The Kings' School, Egan, Igando, Lagos State — established in 2010. Our vision, mission, values and educational philosophy."
        breadcrumb={[{ name: "Home", path: "/" }, { name: "About Us" }]}
      />
      <PageHeader
        eyebrow="About the School"
        title="A school with a story, a vision and a purpose"
        description="Since our founding, we have remained true to one conviction — that knowledge and character together form the foundation of every great life."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="shell py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
<div className="overflow-hidden rounded-[var(--radius-lg)] bg-royal-100">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/moment.webp"
                  alt="A moment from EL-BETH-EL The Kings' School campus life"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
              <div className="absolute -bottom-6 -right-3 hidden rounded-[var(--radius-md)] border border-border bg-surface p-5 shadow-lg sm:block">
                <p className="font-display text-3xl font-bold text-royal-accent">
                  {new Date().getFullYear() - 2010}
                </p>
                <p className="mt-1 text-xs font-medium text-ink-soft">
                  Years of excellence and counting
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Our Story
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              The Fountain of Knowledge
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                EL-BETH-EL The Kings&apos; School was established to create an
                institution where children are not just taught, but truly
                formed — academically, morally and socially.
              </p>
              <p>
                The name EL-BETH-EL, meaning “the house of God,” speaks to our
                foundational belief that education is a sacred trust. Our motto,
                “Fountain of Knowledge,” reflects the continuous, life-giving
                flow of learning, wisdom and character that our school pours
                into every child who passes through our gates.
              </p>
              <p>
                Today, we continue to grow — welcoming young learners from the
                earliest years through senior secondary — while remaining
                faithful to the values on which we were founded.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-surface">
        <div className="shell grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="text-center">
              <p className="font-display text-3xl font-bold text-royal-accent sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="shell py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-lg)] border border-border bg-royal p-10 text-white">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-white/10 text-gold">
              <Eye className="h-7 w-7" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold">Our Vision</h2>
            <p className="mt-3 text-base leading-relaxed text-royal-300">
              To be a fountain of knowledge and a model of academic and moral
              excellence — raising a generation of confident, compassionate and
              capable leaders who shape a better world.
            </p>
          </Reveal>
          <Reveal delay={80} className="rounded-[var(--radius-lg)] border border-border bg-ash-100/60 p-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius)] bg-royal text-white">
              <Target className="h-7 w-7" />
            </span>
            <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Our Mission</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              To provide a safe, inspiring and disciplined learning environment
              that delivers excellent education, builds strong character and
              nurtures the unique potential of every child.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Educational philosophy */}
      <section className="bg-ash-100/60 py-24">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Educational Philosophy
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Whole-child education
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              We educate the whole child — head, heart and hands. Our approach
              balances academic rigour with character formation, creativity and
              physical development, so each student grows into a well-rounded
              individual.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Knowledge", text: "Deep, engaging academic learning that builds critical thinkers." },
              { icon: HandHeart, title: "Character", text: "Values-led formation that shapes responsible young people." },
              { icon: Award, title: "Excellence", text: "A culture that challenges every child to do their very best." },
              { icon: Users, title: "Partnership", text: "Strong collaboration between school, home and community." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 60} className="rounded-[var(--radius-md)] border border-border bg-surface p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Core Values
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            What we stand for
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 60} className="group rounded-[var(--radius-md)] border border-border bg-surface p-7 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-royal-100 text-royal-600 transition-colors group-hover:bg-royal group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-ash-100/60 py-24">
        <div className="shell">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Leadership
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Meet our leadership team
            </h2>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[
              {
                name: "Mrs. ADEYEMO",
                role: "Proprietress",
                text: "Provides visionary leadership and stewardship for the school and its community.",
                photo: "/CEO.jpg",
              },
              {
                name: "Mr. D.S ADEYEMO",
                role: "Director",
                text: "Leads the school with a vision for excellence, character and community.",
                photo: "/director.webp",
              },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 60} className="rounded-[var(--radius-md)] border border-border bg-surface p-8 text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-royal-100 bg-ash-200">
                  {p.photo ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={p.photo}
                        alt={`Portrait of ${p.name}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="px-2 text-center font-display text-[10px] text-ash-500">
                        [Portrait]
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{p.name}</h3>
                <p className="text-sm text-royal-500">{p.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}