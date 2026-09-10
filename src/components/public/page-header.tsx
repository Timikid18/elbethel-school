import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../ui/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-royal pb-24 pt-40 text-white">
      {/* Texture: dot grid + vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, #fff 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-royal-600/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />

      <div className="shell relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-1.5 text-sm text-royal-300"
            >
              {breadcrumb.map((b) => (
                <span key={b.label} className="flex items-center gap-1.5">
                  {b.href ? (
                    <>
                      <Link
                        href={b.href}
                        className="transition-colors hover:text-white"
                      >
                        {b.label}
                      </Link>
                      <ChevronRight className="h-4 w-4 text-royal-400" />
                    </>
                  ) : (
                    <span className="text-white/90">{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </Reveal>
        )}
        <Reveal delay={60}>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" aria-hidden />
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                {eyebrow}
              </p>
            )}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-balance sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-royal-300 sm:text-xl">
              {description}
            </p>
          )}
        </Reveal>
      </div>

      {/* Bottom hairline motif */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden />
    </section>
  );
}