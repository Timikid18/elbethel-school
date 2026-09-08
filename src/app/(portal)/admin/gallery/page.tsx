import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { GalleryTable } from "./gallery-table";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [images, publishedCount] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryImage.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Gallery</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Upload campus photos. Published photos appear on the public gallery page; compact
          previews are stored automatically.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Total photos</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">{images.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Published</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">{publishedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Hidden</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">{images.length - publishedCount}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <GalleryTable images={images} />
        </CardContent>
      </Card>
    </div>
  );
}