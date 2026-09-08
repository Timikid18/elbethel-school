import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Images } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { Reveal } from "@/components/ui/reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from campus life at EL-BETH-EL The Kings' School — from graduations and classrooms to sports and everyday joy.",
};

export const dynamic = "force-dynamic";

const graduands = Array.from({ length: 10 }, (_, i) => ({
  src: `/graduand${i + 1}.jpg`,
  alt: `EL-BETH-EL The Kings' School graduand photo ${i + 1}`,
}));

let uploaded: { id: string; caption: string; alt: string | null; dataUrl: string }[] = [];
try {
  uploaded = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, caption: true, alt: true, dataUrl: true },
  });
} catch {
  uploaded = [];
}

const hasUploaded = uploaded.length > 0;

export default function GalleryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from campus"
        description="A collection of memories from classrooms, fields and stages — celebrate our latest graduands and follow our community for more."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      {/* Graduation set */}
      <section className="shell py-20">
        <Reveal className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal text-gold">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              {hasUploaded ? "Latest Campus Moments" : "Latest Graduands"}
            </h2>
            <p className="text-sm text-ink-soft">
              {hasUploaded
                ? `${uploaded.length} photo${uploaded.length === 1 ? "" : "s"} from our community`
                : `Celebrating our most recent graduating class · ${graduands.length} photos`}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasUploaded
            ? uploaded.map((g, i) => (
                <Reveal
                  key={g.id}
                  delay={(i % 3) * 50}
                  className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-border bg-royal-100 shadow-sm"
                >
                  <Image
                    src={g.dataUrl}
                    alt={g.alt ?? g.caption}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {g.caption && (
                    <span className="absolute inset-0 bg-gradient-to-t from-royal/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  )}
                  {g.caption && (
                    <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-royal/90 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <Images className="h-3.5 w-3.5" />
                      {g.caption}
                    </span>
                  )}
                </Reveal>
              ))
            : graduands.map((g, i) => (
                <Reveal
                  key={g.src}
                  delay={(i % 3) * 50}
                  className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-border bg-royal-100 shadow-sm"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-royal/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  <span className="absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-royal/90 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Graduand Class
                  </span>
                </Reveal>
              ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-xl text-sm text-ink-soft">
            More campus photography — sports, cultural festivals and classroom
            moments — will be added here as events unfold.
          </p>
        </Reveal>
      </section>
    </div>
  );
}