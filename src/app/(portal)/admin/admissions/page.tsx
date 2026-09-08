import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AdmissionsTable } from "./admissions-table";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [applications, counts] = await Promise.all([
    prisma.admissionApplication.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.admissionApplication.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusCount: Record<string, number> = {};
  for (const row of counts) statusCount[row.status] = row._count._all;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Admissions</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Applications submitted through the public form appear here instantly.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Total</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">{applications.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Pending review</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {(statusCount.SUBMITTED ?? 0)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Accepted / Enrolled</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {(statusCount.ACCEPTED ?? 0) + (statusCount.ENROLLED ?? 0)}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All applications</CardTitle>
        </CardHeader>
        <CardContent>
          <AdmissionsTable applications={applications} />
        </CardContent>
      </Card>
    </div>
  );
}