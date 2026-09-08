import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [users, activeCount] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Users</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Create accounts and manage access. Credentials are shared with each user by the
          administrator — there is no public sign-up.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Total accounts</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {users.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Active users</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {activeCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-medium text-ink-soft">Pending approvals</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink tabular-nums">
            {await prisma.changeRequest.count({ where: { status: "PENDING" } })}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} currentUserId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}