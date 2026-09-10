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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "EL-BETH-EL The Kings' School | Fountain of Knowledge",
  description:
    "EL-BETH-EL The Kings' School — Fountain of Knowledge. A place where knowledge meets character, excellence meets opportunity, and every child is prepared for a brighter future. Apply now.",
};

export default function HomePage() {
  return (
    <div>
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
