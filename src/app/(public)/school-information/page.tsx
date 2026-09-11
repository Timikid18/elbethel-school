import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { PageStructuredData } from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "School Information",
  description:
    "Official factual information about EL-BETH-EL The Kings' School (EBKS), Igando, Lagos State, Nigeria — name, motto, address, contact details, office hours and class divisions.",
  alternates: {
    canonical: "/school-information",
  },
};

const facts: { label: string; value: string }[] = [
  { label: "Official school name", value: SITE.name },
  { label: "Also known as", value: SITE.alternateName },
  { label: "Motto", value: SITE.motto },
  { label: "Established", value: String(SITE.established) },
  { label: "School type", value: "Nursery, Primary and Secondary" },
  { label: "Location", value: SITE.address.full },
];

export default function SchoolInformationPage() {
  return (
    <div>
      <PageStructuredData
        path="/school-information"
        name="School Information"
        description="Official factual information about EL-BETH-EL The Kings' School (EBKS), Igando, Lagos State, Nigeria."
        breadcrumb={[{ name: "Home", path: "/" }, { name: "School Information" }]}
      />
      <PageHeader
        eyebrow="School Information"
        title="EL-BETH-EL The Kings' School at a glance"
        description="A concise, factual reference to the school's official identity, location and contact details."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "School Information" }]}
      />

      <section className="shell py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-royal text-gold">
                  <Building2 className="h-5 w-5" />
                </span>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  Official school details
                </h2>
              </div>
              <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-royal-500">
                      {f.label}
                    </dt>
                    <dd className="mt-1.5 font-medium text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 rounded-[var(--radius)] border border-border bg-ash-100/60 p-5 text-sm leading-relaxed text-ink-soft">
                This website is the official website of EL-BETH-EL The Kings&apos;
                School. For admissions enquiries, visit the{" "}
                <Link href="/admissions" className="font-semibold text-royal-accent underline-offset-2 hover:underline">
                  admissions page
                </Link>{" "}
                or start an{" "}
                <Link href="/admissions/apply" className="font-semibold text-royal-accent underline-offset-2 hover:underline">
                  online application
                </Link>
                .
              </p>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={60} className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">Address</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {SITE.address.streetAddress},<br />
                {SITE.address.addressLocality}, {SITE.address.addressRegion},<br />
                Nigeria
              </p>
            </Reveal>

            <Reveal delay={120} className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                  <Phone className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-royal-500" />
                  <span>{SITE.phones.map((p) => p.display).join(" / ")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-royal-500" />
                  <span>WhatsApp: {SITE.phones[0].display}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-royal-500" />
                  <span className="break-all">{SITE.email}</span>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={180} className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                  <Clock className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">Office hours</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex justify-between gap-4">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-ink">7:30 AM – 4:00 PM</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Saturday</span>
                  <span className="font-medium text-ink">9:00 AM – 1:00 PM</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sunday &amp; Public Holidays</span>
                  <span className="font-medium text-ink">Closed</span>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-lg)] bg-royal p-10 text-white sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius)] bg-white/10 text-gold">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold">Class divisions</h2>
                <ul className="mt-2 space-y-1 text-sm text-royal-300">
                  {SITE.divisions.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/academics"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-[var(--radius-md)] bg-gold px-7 text-sm font-semibold text-royal transition-all hover:bg-gold/90 active:scale-[0.98]"
            >
              Explore Academics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}