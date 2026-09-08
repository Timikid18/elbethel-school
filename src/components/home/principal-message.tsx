import { Quote } from "lucide-react";
import Image from "next/image";
import { Reveal } from "../ui/reveal";

export function PrincipalMessage() {
  return (
    <section className="bg-royal py-24 text-white overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #fff 1.5px, transparent 1.5px)", backgroundSize: "36px 36px" }} />
      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[300px_1fr]">
          {/* Portrait */}
          <Reveal className="mx-auto w-full max-w-[300px]">
            <div className="relative">
              <div className="overflow-hidden rounded-full border-4 border-gold/40 bg-white/5">
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
            </div>
          </Reveal>

          {/* Message */}
          <Reveal delay={80}>
            <Quote className="h-10 w-10 text-gold" />
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
                <p className="font-semibold text-white">
                  Mrs. ADEYEMO
                </p>
                <p className="text-sm text-royal-300">Proprietress, EL-BETH-EL The Kings&apos; School</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
