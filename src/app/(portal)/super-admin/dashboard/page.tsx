import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function SuperAdminDashboardPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [
    pending,
    students,
    todayApps,
    recentApps,
    unreadContacts,
  ] = await Promise.all([
    prisma.admissionApplication.count({ where: { status: "SUBMITTED" } }),
    prisma.student.count(),
    prisma.admissionApplication.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {user.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">School administration overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending applications" value={pending} tone="warning" />
        <StatCard label="Applications today" value={todayApps} tone="royal" />
        <StatCard label="Students" value={students} tone="info" />
        <StatCard label="Unread contact messages" value={unreadContacts} tone="info" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Latest admissions</CardTitle>
          <Link
            href="/admin/admissions"
            className="inline-flex items-center gap-1 text-sm font-medium text-royal-accent hover:text-royal"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentApps.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-soft">
              No applications yet. New submissions will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentApps.map((app) => (
                <li key={app.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {app.classApplying} · {app.applicationNo} · submitted{" "}
                      {format(app.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge tone="royal">{app.status.replace("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}