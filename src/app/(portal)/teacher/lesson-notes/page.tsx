import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export default async function TeacherLessonNotesPage() {
  const user = await requireRole("TEACHER");

  const profile = await prisma.teacher.findUnique({
    where: { userId: user.id },
    include: { classTeacher: { select: { name: true } } },
  });

  const classNames = (profile?.classTeacher ?? []).map((c) => c.name);

  const notes = classNames.length
    ? await prisma.lessonNote.findMany({
        where: { isActive: true, className: { in: classNames } },
        select: {
          id: true,
          className: true,
          subject: true,
          title: true,
          fileName: true,
          fileSize: true,
          createdAt: true,
        },
        orderBy: [{ className: "asc" }, { subject: "asc" }],
      })
    : [];

  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    const list = grouped.get(note.className) ?? [];
    list.push(note);
    grouped.set(note.className, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Lesson notes</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Lesson-note PDFs for your class{classNames.length > 1 ? "es" : ""}. Open a note to view or
          download it.
        </p>
      </div>

      {classNames.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center">
              <p className="font-display text-lg font-semibold text-ink">No class assigned yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Ask an administrator to assign you as form teacher of a class to see its lesson notes.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : notes.length === 0 ? (
        <Card>
          <CardContent>
            <div className="py-14 text-center">
              <FileText className="mx-auto h-10 w-10 text-ash-500" />
              <p className="mt-3 font-display text-lg font-semibold text-ink">No lesson notes yet</p>
              <p className="mt-1 text-sm text-ink-soft">
                Lesson notes for {classNames.join(", ")} have not been uploaded yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([className, items]) => (
            <Card key={className}>
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <p className="font-display text-sm font-semibold text-ink">{className}</p>
                  <Badge tone="neutral">{items.length} note{items.length === 1 ? "" : "s"}</Badge>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((note) => (
                    <li key={note.id} className="flex items-center gap-4 px-5 py-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)] bg-danger-soft text-danger">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <a
                          href={`/api/lesson-notes/${note.id}/file`}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-sm font-medium text-ink hover:text-royal-accent hover:underline"
                        >
                          {note.subject}
                        </a>
                        <p className="truncate text-xs text-ink-soft">
                          {note.fileName} · {formatSize(note.fileSize)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}