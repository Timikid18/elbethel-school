import Image from "next/image";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  BookOpen,
  Pencil,
  Palette,
  FlaskConical,
  Calculator,
  Globe2,
  Music,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

const badges = [
  { icon: Award, label: "Academic Excellence", color: "#ffc83d", fg: "#0b1f4b" },
  { icon: ShieldCheck, label: "Safe Environment", color: "#47b6ea", fg: "#ffffff" },
  { icon: Heart, label: "Character Led", color: "#ff7a6b", fg: "#ffffff" },
];

// Decorative school supplies that gently bob around the hero.
const floaters = [
  { Icon: BookOpen, cls: "left-[4%] top-[15%]", color: "#ffc83d", rot: "-10deg", dur: "7s", delay: "0s", driftX: "10px", driftY: "-18px", tilt: "9deg", size: "h-7 w-7" },
  { Icon: Pencil, cls: "left-[11%] top-[62%]", color: "#8b7be8", rot: "12deg", dur: "9s", delay: "0.8s", driftX: "-12px", driftY: "-16px", tilt: "-8deg", size: "h-6 w-6" },
  { Icon: Calculator, cls: "left-[44%] top-[7%]", color: "#2fc39b", rot: "-6deg", dur: "8s", delay: "1.4s", driftX: "8px", driftY: "-14px", tilt: "7deg", size: "h-5 w-5" },
  { Icon: Palette, cls: "right-[6%] top-[12%]", color: "#ff8fc4", rot: "14deg", dur: "7.5s", delay: "0.3s", driftX: "-10px", driftY: "-20px", tilt: "-10deg", size: "h-6 w-6" },
  { Icon: FlaskConical, cls: "right-[3%] top-[58%]", color: "#47b6ea", rot: "-12deg", dur: "8.5s", delay: "1.1s", driftX: "12px", driftY: "-16px", tilt: "8deg", size: "h-6 w-6" },
  { Icon: Music, cls: "left-[30%] bottom-[7%]", color: "#63bd45", rot: "8deg", dur: "9.5s", delay: "0.6s", driftX: "-8px", driftY: "-18px", tilt: "-7deg", size: "h-5 w-5" },
  { Icon: Globe2, cls: "right-[27%] bottom-[10%]", color: "#ffc83d", rot: "-8deg", dur: "8.2s", delay: "1.6s", driftX: "9px", driftY: "-14px", tilt: "7deg", size: "h-5 w-5" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-700 via-royal to-royal-600 text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, #fff 1.6px, transparent 1.6px)",
            backgroundSize: "38px 38px",
          }}
        />
        <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-play-sky/25 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-[440px] w-[440px] rounded-full bg-play-coral/20 blur-3xl" />
      </div>

      {/* Floating school supplies */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {floaters.map((f, i) => {
          const Icon = f.Icon;
          return (
            <span
              key={i}
              className={`float-sway absolute ${f.cls}`}
              style={
                {
                  color: f.color,
                  "--float-base-rot": f.rot,
                  "--float-duration": f.dur,
                  "--float-delay": f.delay,
                  "--float-drift-x": f.driftX,
                  "--float-drift-y": f.driftY,
                  "--float-tilt": f.tilt,
                } as CSSProperties
              }
            >
              <Icon className={`${f.size} opacity-70 drop-shadow`} strokeWidth={2.2} />
            </span>
          );
        })}
      </div>

      <div className="shell relative flex min-h-[92vh] flex-col justify-center py-32 pt-40">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Fountain of Knowledge · Est. 2010
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
                Where knowledge meets{" "}
                <span className="play-underline text-gold-shimmer">character</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-royal-300 sm:text-xl">
                EL-BETH-EL The Kings&apos; School is where little dreamers become
                big thinkers — a joyful place where every child learns, plays and
                grows with confidence.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/admissions"
                  variant="gold"
                  className="h-[52px] rounded-full px-8 text-base font-bold"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Apply Now
                </ButtonLink>
                <ButtonLink
                  href="/about"
                  className="h-[52px] rounded-full border-white/30 bg-white/10 px-8 text-base font-semibold text-white hover:bg-white/20"
                  variant="outline"
                >
                  Explore Our School
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-12 flex flex-wrap gap-x-7 gap-y-5 border-t border-white/10 pt-8">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className="flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full shadow-lg"
                        style={{ backgroundColor: b.color, color: b.fg }}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
                      </span>
                      <span className="text-sm font-bold text-white/95">
                        {b.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* Image */}
          <Reveal delay={200} as="div">
            <div className="relative">
              <div className="absolute -inset-3 -z-0 rounded-[2rem] bg-gradient-to-br from-play-sun/40 via-play-mint/20 to-play-grape/30 blur-xl" />
              <div className="relative rotate-1 overflow-hidden rounded-[2rem] border-4 border-white/85 shadow-2xl transition-transform duration-300 hover:rotate-0">
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
              </div>

              {/* Sticker: motto */}
              <div className="play-tilt-l absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/95 p-3.5 text-ink shadow-xl backdrop-blur sm:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-royal shadow">
                  <Award className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-sm font-bold text-royal">
                    Fountain of Knowledge
                  </p>
                  <p className="text-xs font-semibold text-ink-soft">
                    Learn · Lead · Serve
                  </p>
                </div>
              </div>

              {/* Sticker: years */}
              <div className="play-tilt-r play-bob absolute -top-5 right-4 hidden rounded-full border-4 border-white bg-play-sun px-4 py-2 shadow-xl md:block">
                <p className="font-display text-sm font-bold text-royal">
                  {new Date().getFullYear() - 2010} Years of Excellence
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Wavy divider into the next section */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px leading-none">
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="h-[52px] w-full text-surface sm:h-[72px]"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,74 1440,38 L1440,72 L0,72 Z" />
        </svg>
      </div>
    </section>
  );
}
