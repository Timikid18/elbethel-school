import type { Metadata } from "next";
import { ApplicationForm } from "@/components/admissions/application-form";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { PageStructuredData } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Submit an admission application for EL-BETH-EL The Kings' School, Igando, Lagos. Complete the online form to begin your child's journey with us.",
  alternates: {
    canonical: "/admissions/apply",
  },
};

export default function ApplyPage() {
  return (
    <div>
      <PageStructuredData
        path="/admissions/apply"
        name="Apply Now"
        description="Online admission application form for EL-BETH-EL The Kings' School, Igando, Lagos."
        breadcrumb={[
          { name: "Home", path: "/" },
          { name: "Admissions", path: "/admissions" },
          { name: "Apply" },
        ]}
      />
      <PageHeader
        eyebrow="Admissions"
        title="Apply for admission"
        description="Complete the form below to begin your child's application. It takes just a few minutes, and our admissions team will get back to you shortly."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Admissions", href: "/admissions" }, { label: "Apply" }]}
      />
      <section className="shell py-20 pb-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <ApplicationForm />
          </Reveal>
          <Reveal delay={60}>
            <div className="mt-8 rounded-[var(--radius)] border border-border bg-ash-100/60 p-6 text-sm text-ink-soft">
              <p className="font-semibold text-ink">Need help with your application?</p>
              <p className="mt-1">
                Contact the admissions office at <span className="font-medium text-ink">0809 876 2044</span> or{" "}
                <span className="font-medium text-ink">admin@elbethelthekings.xyz</span>, Monday to Friday during school hours.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}