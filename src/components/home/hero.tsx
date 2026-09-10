
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Award, Heart } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

const badges = [
  { icon: Award, label: "Academic Excellence" },
  { icon: ShieldCheck, label: "Safe Environment" },
  { icon: Heart, label: "Character Led" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-royal text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-royal-600/40 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-[440px] w-[440px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="shell relative flex min-h-[92vh] flex-col justify-center py-32 pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Fountain of Knowledge · Est. 2010
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[4.4rem]">
                Where knowledge meets{" "}
                <em className="display-italic text-gold-shimmer">character</em>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-royal-300 sm:text-xl">
                EL-BETH-EL The Kings&apos; School is a place where excellence
                meets opportunity, and every child is prepared for a brighter
                future.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/admissions"
                  variant="gold"
                  className="h-[52px] px-8 text-base font-semibold"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Apply Now
                </ButtonLink>
                <ButtonLink
                  href="/about"
                  className="h-[52px] border-white/25 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10"
                  variant="outline"
                >
                  Explore Our School
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-8">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.label}
                      className="flex items-center gap-2.5 text-sm text-royal-300"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      {b.label}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Image */}
          <Reveal delay={200} as="div">
            <div className="relative">
              <div className="absolute -inset-3 -z-0 rounded-[var(--radius-lg)] bg-gradient-to-br from-gold/30 via-transparent to-royal-400/30 blur-xl" />
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-white/15 shadow-2xl">
                <div className="relative aspect-[4/3] w-full bg-royal-700">
                  <Image
                    src="/hero.webp"
                    alt="EL-BETH-EL The Kings' School students and campus"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </div>

              {/* Gold corner accent */}
              <div
                className="absolute right-4 top-4 h-11 w-11 rounded-tr-[calc(var(--radius-lg)-6px)] border-r-2 border-t-2 border-gold/70"
                aria-hidden
              />

              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-[var(--radius-md)] border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-royal">
                  <Award className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-sm font-semibold text-white">
                    Fountain of Knowledge
                  </p>
                  <p className="text-xs text-royal-300">Learn · Lead · Serve</p>
                </div>
              </div>

              <div className="absolute -top-4 right-6 hidden rounded-[var(--radius-md)] border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md md:flex">
                <p className="font-display text-sm font-semibold text-gold">
                  {new Date().getFullYear() - 2010} Years of Excellence
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}