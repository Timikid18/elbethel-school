import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "./announcement-form";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function TeacherAnnouncementsPage() {
  const user = await requireRole("TEACHER");

  const [profile, requests] = await Promise.all([
    prisma.teacher.findUnique({
      where: { userId: user.id },
      include: { classTeacher: { select: { id: true, name: true } } },
    }),
    prisma.changeRequest.findMany({
      where: { requesterId: user.id, entityType: "CLASS_ANNOUNCEMENT" },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  const classes = (profile?.classTeacher ?? []).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Class announcements</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Draft a message for your class. It goes to an administrator for approval before
          reaching students and parents.
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
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit for approval</CardTitle>
            </CardHeader>
            <CardContent>
              <AnnouncementForm classes={classes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-soft">
                  Nothing submitted yet. When admins approve your announcements, they will show up here.
                </p>
              ) : (
                <ul className="space-y-4">
                  {requests.map((r) => (
                    <li key={r.id} className="rounded-[var(--radius)] border border-border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-ink">{r.summary}</p>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            r.status === "PENDING"
                              ? "bg-warning-soft text-warning"
                              : r.status === "APPROVED"
                                ? "bg-success-soft text-success"
                                : "bg-danger-soft text-danger"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                          {r.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-soft">{format(r.createdAt, "MMM d, yyyy h:mm a")}</p>
                      {r.status === "REJECTED" && r.reviewNote && (
                        <p className="mt-2 rounded-[var(--radius-sm)] bg-danger-soft px-3 py-2 text-xs text-danger">
                          Reason: {r.reviewNote}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}