import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { FormatGender } from "./format-gender";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const user = await requireRole("TEACHER");

  const profile = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: {
      classTeacher: {
        include: {
          students: {
            orderBy: [{ firstName: "asc" }],
            include: { class: { select: { name: true } } },
          },
        },
      },
    },
  });

  const classes = profile?.classTeacher ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">My class students</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Students registered in the classes you are the form teacher for.
        </p>
      </div>

      {classes.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink">No class assigned yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Ask an administrator to assign you as form teacher of a class.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {classes.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{c.name}</span>
                  <span className="text-sm font-normal text-ink-soft">
                    {c.students.length} student{c.students.length === 1 ? "" : "s"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {c.students.length === 0 ? (
                  <p className="py-6 text-center text-sm text-ink-soft">
                    No students registered in this class yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-soft">
                          <th className="py-3 pr-4 font-medium">Student</th>
                          <th className="py-3 pr-4 font-medium">Admission no.</th>
                          <th className="py-3 pr-4 font-medium">Gender</th>
                          <th className="py-3 font-medium">Class</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {c.students.map((s) => (
                          <tr key={s.id}>
                            <td className="py-3 pr-4 align-top">
                              <p className="font-medium text-ink">{s.firstName} {s.lastName}</p>
                            </td>
                            <td className="py-3 pr-4 align-top font-mono text-xs text-ink">{s.admissionNumber}</td>
                            <td className="py-3 pr-4 align-top text-ink-soft">
                              <FormatGender gender={s.gender} />
                            </td>
                            <td className="py-3 align-top text-ink-soft">{s.class?.name ?? c.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}