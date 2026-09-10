
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const user = await requireRole("TEACHER");

  const profile = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      classTeacher: { include: { _count: { select: { students: true } } } },
      subjectAssignments: { include: { subject: true } },
    },
  });

  const formClasses = profile?.classTeacher ?? [];
  const subjects = profile?.subjectAssignments ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {user.name?.split(" ")[0] ?? "Teacher"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {profile ? `${profile.designation ?? "Teacher"} · Staff ID ${profile.staffId}` : "Teacher portal"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form classes</CardTitle>
          </CardHeader>
          <CardContent>
            {formClasses.length ? (
              <ul className="space-y-2">
                {formClasses.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="text-ink-soft">{c._count.students} students</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-soft">No form class assigned.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.length ? (
              <ul className="space-y-2">
                {subjects.map((sa) => (
                  <li key={sa.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{sa.subject.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-soft">No subject assignments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}