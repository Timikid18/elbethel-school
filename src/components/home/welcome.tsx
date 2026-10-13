import Image from "next/image";
import { ArrowRight, Star, Heart, ThumbsUp } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function Welcome() {
  return (
    <section className="shell py-24 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
        {/* Visual */}
        <div className="relative order-2 lg:order-1">
          {/* Decorative offset frame */}
          <div className="absolute -inset-4 -z-0 rounded-[2.25rem] bg-gradient-to-br from-play-sun/30 via-play-sky/20 to-play-grape/30" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-md)]">
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

              {/* Playful floating shapes */}
              <span className="play-bob absolute left-6 top-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-play-sky text-white shadow-lg" aria-hidden>
                <Star className="h-5 w-5 fill-current" />
              </span>
              <span className="play-wiggle absolute right-8 top-12 flex h-11 w-11 items-center justify-center rounded-full bg-play-coral text-white shadow-lg" aria-hidden>
                <Heart className="h-5 w-5 fill-current" />
              </span>

              {/* Floating stat card */}
              <div className="play-tilt-l absolute bottom-6 left-6 rounded-2xl border border-border bg-surface/95 p-5 shadow-lg backdrop-blur">
                <p className="font-display text-3xl font-bold text-royal-accent">100%</p>
                <p className="mt-1 max-w-[10rem] text-xs font-semibold leading-snug text-ink-soft">
                  Focus on every child&apos;s potential
                </p>
              </div>

              <span className="play-tilt-r absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-play-mint px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <ThumbsUp className="h-3.5 w-3.5" />
                Loved by parents
              </span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="play-chip bg-royal-100 text-royal-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Welcome
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink text-balance sm:text-4xl lg:text-[2.6rem]">
              A school built on knowledge,{" "}
              <span className="play-underline text-royal-accent">led by character</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
              EL-BETH-EL The Kings&apos; School was founded on the belief that
              education is more than the acquisition of facts — it is the total
              formation of a child. We nurture curious minds, build strong
              values, and prepare confident, capable young people for the
              demands of tomorrow.
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
                className="h-12 rounded-full px-7 text-sm font-bold"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Learn About Us
              </ButtonLink>
              <ButtonLink
                href="/academics"
                variant="outline"
                className="h-12 rounded-full px-7 text-sm font-bold"
              >
                Explore Academics
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
