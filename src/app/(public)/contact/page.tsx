import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with EL-BETH-EL The Kings' School. Visit us, call, email or send a message — we would love to hear from you.",
};

const officeHours = [
  { days: "Monday – Friday", hours: "7:30 AM – 4:00 PM" },
  { days: "Saturday", hours: "9:00 AM – 1:00 PM" },
  { days: "Sunday & Holidays", hours: "Closed" },
];

const channels = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["No 12, Ija Road, Egan, Igando", "Lagos State, Nigeria"],
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    lines: ["0809 876 2044 / 0903 191 7478", "WhatsApp: 0809 876 2044"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["admin@elbethelthekings.xyz"],
  },
];

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Whether you have a question about admissions, academics or anything else, our team is ready to help."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Channels */}
      <section className="shell py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {channels.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal
                key={c.title}
                delay={i * 60}
                className="rounded-[var(--radius-md)] border border-border bg-surface p-8 text-center"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-lg font-semibold text-ink">
                  {c.title}
                </h2>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-ink-soft">
                    {l}
                  </p>
                ))}
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Form + office hours */}
      <section className="bg-ash-100/60 py-20">
        <div className="shell grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          <div className="space-y-6 lg:col-span-2">
            <Reveal delay={60} className="rounded-[var(--radius-lg)] border border-border bg-surface p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-gold/15 text-warning">
                  <Clock className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold text-ink">
                  Office Hours
                </h2>
              </div>
              <ul className="mt-5 space-y-4">
                {officeHours.map((o) => (
                  <li key={o.days} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0">
                    <span className="text-ink-soft">{o.days}</span>
                    <span className="font-medium text-ink">{o.hours}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="rounded-[var(--radius-lg)] bg-royal p-8 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-white/10 text-gold">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-semibold">Admissions help</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-royal-300">
                Have questions about applying, assessments or school fees? Our
                admissions team is happy to walk you through every step.
              </p>
              <p className="mt-3 text-sm text-royal-300">
                Call <span className="font-medium text-white">0809 876 2044</span> or start your{" "}
                <a href="/admissions/apply" className="font-semibold text-gold underline-offset-2 hover:underline">
                  online application
                </a>.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}