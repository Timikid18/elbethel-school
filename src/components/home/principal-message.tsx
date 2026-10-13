import { Quote, Sparkles } from "lucide-react";
import Image from "next/image";
import { Reveal } from "../ui/reveal";

export function PrincipalMessage() {
  return (
    <section className="relative overflow-hidden bg-royal py-24 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 40%, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-play-grape/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-play-sun/15 blur-3xl" aria-hidden />

      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[300px_1fr]">
          {/* Portrait */}
          <Reveal className="mx-auto w-full max-w-[300px]">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-play-sun/50 via-play-coral/40 to-play-sky/50 blur-lg" aria-hidden />
              <div className="relative overflow-hidden rounded-full border-4 border-white/90 shadow-2xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/CEO.jpg"
                    alt="Portrait of the Proprietress of EL-BETH-EL The Kings' School"
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="play-tilt-r absolute -right-2 top-4 flex items-center gap-1.5 rounded-full bg-play-sun px-3 py-1.5 text-xs font-bold text-royal shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                Our Vision
              </span>
            </div>
          </Reveal>

          {/* Message */}
          <Reveal delay={80}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-gold">
              <Quote className="h-6 w-6" />
            </span>
            <blockquote className="mt-6">
              <p className="font-display text-xl leading-relaxed text-royal-100 sm:text-2xl">
                “We believe that every child is a king and queen in the making
                — endowed with the potential to lead, to serve and to shine.
                Our duty is to draw out that greatness through knowledge,
                nurture and character.”
              </p>
            </blockquote>
            <div className="mt-9 flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="h-px w-10 bg-gold" />
              <div>
                <p className="font-bold text-white">Mrs. ADEYEMO</p>
                <p className="text-sm text-royal-300">
                  Proprietress, EL-BETH-EL The Kings&apos; School
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
