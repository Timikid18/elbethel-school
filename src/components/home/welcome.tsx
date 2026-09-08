import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export function Welcome() {
  return (
    <section className="shell py-24 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* Visual */}
        <div className="relative order-2 lg:order-1">
          {/* Decorative offset frame */}
          <div className="absolute -inset-4 -z-0 rounded-[var(--radius-lg)] bg-gradient-to-br from-royal-100 via-transparent to-gold-100/60" />
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-md)]">
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
              {/* Soft dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.5]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 25%, #e3e9f7 1.5px, transparent 1.5px), radial-gradient(circle at 75% 70%, #f3ebd7 1.5px, transparent 1.5px)",
                  backgroundSize: "34px 34px, 44px 44px",
                }}
                aria-hidden
              />
              {/* Logo medallion */}
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-2 border-gold/40 bg-surface shadow-xl sm:h-64 sm:w-64">
                <div className="absolute inset-2 rounded-full border border-gold/25" />
                <div className="relative h-40 w-40 overflow-hidden rounded-full sm:h-48 sm:w-48">
                  <Image
                    src="/logo-medallion.webp"
                    alt="EL-BETH-EL The Kings' School logo medallion"
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Floating stat card */}
              <div className="absolute bottom-6 left-6 rounded-[var(--radius-md)] border border-border bg-surface/95 p-5 shadow-lg backdrop-blur">
                <p className="font-display text-3xl font-bold text-royal-accent">100%</p>
                <p className="mt-1 max-w-[10rem] text-xs font-medium leading-snug text-ink-soft">
                  Focus on every child&apos;s potential
                </p>
              </div>
              {/* Gold corner accent */}
              <div className="absolute right-5 top-5 h-10 w-10 rounded-tr-[calc(var(--radius-lg)-6px)] border-r-2 border-t-2 border-gold/70" aria-hidden />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="eyebrow">Welcome</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.55rem]">
            A school built on knowledge,{" "}
            <em className="display-italic text-royal-accent">led by character</em>
          </h2>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" aria-hidden />
          <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
            EL-BETH-EL The Kings&apos; School was founded on the belief that
            education is more than the acquisition of facts — it is the total
            formation of a child. We nurture curious minds, build strong
            values, and prepare confident, capable young people for the demands
            of tomorrow.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            From the earliest years through secondary school, our students are
            guided by experienced educators within a safe, supportive and
            inspiring learning environment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink
              href="/about"
              variant="primary"
              className="h-12 px-7 text-sm font-medium"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Learn About Us
            </ButtonLink>
            <ButtonLink
              href="/academics"
              variant="outline"
              className="h-12 px-7 text-sm font-medium"
            >
              Explore Academics
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}