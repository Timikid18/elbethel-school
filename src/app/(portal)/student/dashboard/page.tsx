import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await requireRole("STUDENT");

  const profile = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      class: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {user.name?.split(" ")[0] ?? "Student"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {profile ? `Admission No. ${profile.admissionNumber}` : "Student portal"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.class ? (
              <p className="text-2xl font-semibold text-ink">{profile.class.name}</p>
            ) : (
              <p className="text-sm text-ink-soft">No class assigned yet.</p>
            )}
            {profile?.dateOfBirth && (
              <p className="mt-1 text-sm text-ink-soft">
                Date of birth: {profile.dateOfBirth.toISOString().slice(0, 10)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-soft">
              Your results and assignments will appear here in a future update.
            </p>
            {profile && <Badge tone="success" className="mt-3">Enrolled</Badge>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}