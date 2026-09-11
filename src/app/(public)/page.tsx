import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Welcome } from "@/components/home/welcome";
import { WhyChoose } from "@/components/home/why-choose";
import { Divisions } from "@/components/home/divisions";
import { PrincipalMessage } from "@/components/home/principal-message";
import { SchoolLife } from "@/components/home/school-life";
import { Testimonials } from "@/components/home/testimonials";
import { NewsEvents } from "@/components/home/news-events";
import { AdmissionsCTA } from "@/components/home/admissions-cta";
import { StatsStrip } from "@/components/home/stats-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} | ${SITE.motto}`,
  },
  description: SITE.description,
  creator: SITE.name,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div>
      <JsonLd data={websiteSchema()} />
      <Hero />
      <Marquee />
      <Welcome />
      <StatsStrip />
      <WhyChoose />
      <Divisions />
      <PrincipalMessage />
      <SchoolLife />
      <Testimonials />
      <NewsEvents />
      <AdmissionsCTA />
    </div>
  );
}
