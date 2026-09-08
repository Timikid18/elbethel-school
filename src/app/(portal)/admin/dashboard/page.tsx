import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import {
  Users,
  ClipboardCheck,
  Megaphone,
  Image,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  { href: "/admin/users", label: "Users", icon: Users, description: "Create accounts and manage access" },
  { href: "/admin/approvals", label: "Approvals", icon: ClipboardCheck, description: "Review teacher change requests" },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone, description: "Post school-wide news" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, description: "Upload campus photos" },
];

export default async function AdminDashboardPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [pendingRequests, activeUsers, announcements, galleryCount, pendingAdmissions] =
    await Promise.all([
      prisma.changeRequest.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.announcement.count(),
      prisma.galleryImage.count({ where: { isPublished: true } }),
      prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {user.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">School administration overview.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Pending approvals</p>
          <p className="mt-1 font-display text-2xl font-semibold text-warning tabular-nums">
            {pendingRequests}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Active users</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {activeUsers}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Announcements</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {announcements}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Gallery photos</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {galleryCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Pending admissions</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {pendingAdmissions}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card interactive className="flex h-full flex-col justify-between p-5">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-royal-100 text-royal-accent">
                  <link.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-base font-semibold text-ink">{link.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{link.description}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-royal-accent">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              Have content to publish? Use the links above, or manage admissions and contact
              messages under the sidebar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}