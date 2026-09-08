import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { ApprovalsTable } from "./approvals-table";

export const dynamic = "force-dynamic";

export default async function AdminApprovalsPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const requests = await prisma.changeRequest.findMany({
    orderBy: [{ status: "asc" }, { reviewedAt: "desc" }, { createdAt: "desc" }],
    include: {
      requester: { select: { id: true, fullName: true, email: true, role: true } },
      reviewer: { select: { id: true, fullName: true } },
    },
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Approvals</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Teacher submissions for class announcements and other content wait here until you
          approve or reject them.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Pending</p>
          <p className="mt-1 font-display text-2xl font-semibold text-warning tabular-nums">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Approved</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {requests.filter((r) => r.status === "APPROVED").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Rejected</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {requests.filter((r) => r.status === "REJECTED").length}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalsTable requests={requests} currentUserId={user.id} />
        </CardContent>
      </Card>

      <p className="text-xs text-ink-soft">
        Changes are applied automatically when approved. Rejected requests never touch your data.
        See{" "}
        <Link href="/admin/users" className="text-royal-accent hover:underline">
          Users
        </Link>{" "}
        to manage who can submit changes.
      </p>
    </div>
  );
}