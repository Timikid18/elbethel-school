import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  CalendarDays,
  ClipboardCheck,
  MessageCircle,
  ArrowRight,
  UserRound,
  GraduationCap,
  Wallet,
  HeartHandshake,
} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Begin your child's journey at EL-BETH-EL The Kings' School. Learn about admission requirements, the application process and important dates, then apply online.",
};

const processSteps = [
  { icon: FileText, title: "Submit Application", text: "Complete our simple online admission form with your child's and family's details." },
  { icon: CalendarDays, title: "Schedule Assessment", text: "We will contact you to arrange a friendly assessment and/or entrance evaluation." },
  { icon: ClipboardCheck, title: "Receive Decision", text: "Our admissions team reviews your application and communicates the outcome." },
  { icon: MessageCircle, title: "Enrolment & Welcome", text: "Complete enrolment documents and join our school family — welcome aboard!" },
];

const requirements = [
  { icon: UserRound, title: "Student Details", text: "Basic personal details of the child and a date-of-birth document." },
  { icon: GraduationCap, title: "Previous School Records", text: "Transfer certificate or last term report where applicable." },
  { icon: Wallet, title: "Application form", text: "Completed admission form and any applicable enrolment details." },
  { icon: HeartHandshake, title: "Parent / Guardian Info", text: "Parent or guardian contact and identification details." },
];

const faqs = [
  {
    q: "What age must my child be to apply?",
    a: "Age requirements depend on the class level. Please contact our admissions office for the specific ages for each class.",
  },
  {
    q: "When does the school year begin?",
    a: "The school follows the standard three-term academic year. Exact resumption dates are published at the start of each session.",
  },
  {
    q: "Do you offer scholarship or fee support?",
    a: "Please ask our admissions team about current enrolment and fee arrangements for your child's class.",
  },
  {
    q: "Can I tour the school before applying?",
    a: "Yes — we welcome visits. Contact us to arrange a campus tour or to attend an open day.",
  },
];

export default function AdmissionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Admissions"
        title="Begin your child's journey with us"
        description="We are delighted that you are considering EL-BETH-EL The Kings' School for your family. Here is everything you need to know to get started."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
      />

      {/* Process */}
      <section className="shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Application Process
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Four simple steps to enrolment
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 70} className="relative rounded-[var(--radius-md)] border border-border bg-surface p-7">
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-royal-100">
                  {i + 1}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-royal text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-ash-100/60 py-24">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
              Requirements
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              What you will need
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              To make your application smooth, please have these items ready.
              Our team is always happy to help if you have any questions.
            </p>
            <div className="mt-8 space-y-4">
              {requirements.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="flex gap-4 rounded-[var(--radius)] border border-border bg-surface p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{r.title}</p>
                      <p className="text-sm text-ink-soft">{r.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-royal to-royal-700 p-10 text-white">
              <h3 className="font-display text-2xl font-semibold">Important dates</h3>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Applications open", value: "Now open" },
                  { label: "Assessment window", value: "To be announced" },
                  { label: "Enrolment / resumption", value: "To be announced" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-royal-300">{d.label}</span>
                    <span className="text-sm font-semibold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/admissions/apply"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-gold px-7 text-base font-semibold text-royal transition-all hover:bg-gold/90 active:scale-[0.98]"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="shell py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal-500">
            Frequently Asked Questions
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Questions parents often ask
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="group rounded-[var(--radius)] border border-border bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium text-ink transition-colors hover:text-royal-accent [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-royal-100 text-royal-accent transition-transform group-open:rotate-45">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="shell pb-24">
        <Reveal className="rounded-[var(--radius-lg)] bg-royal px-8 py-14 text-center text-white sm:px-14">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-royal-300">
            Submit your child&apos;s application online today — it only takes a
            few minutes and our team is here to guide you.
          </p>
          <Link
            href="/admissions/apply"
            className="mt-8 inline-flex h-[52px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-gold px-8 text-base font-semibold text-royal shadow-lg transition-all hover:bg-gold/90 active:scale-[0.98]"
          >
            Start Your Application <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}