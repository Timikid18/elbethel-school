import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { AnnouncementsTable } from "./announcements-table";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [announcements, classes] = await Promise.all([
    prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: { class: { select: { id: true, name: true } } },
    }),
    prisma.class.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Announcements</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Post school news instantly. Everyone-targeted announcements appear on the public news
          page; class-targeted ones reach only that class.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnouncementsTable announcements={announcements} classes={classes} />
        </CardContent>
      </Card>

      <p className="text-xs text-ink-soft">
        Teacher posts are moderated —{" "}
        <Link href="/admin/approvals" className="text-royal-accent hover:underline">
          review them in Approvals
        </Link>
        .
      </p>
    </div>
  );
}