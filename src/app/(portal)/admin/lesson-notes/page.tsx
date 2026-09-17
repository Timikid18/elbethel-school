import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helper";
import { LessonNotesManager } from "./lesson-notes-manager";

export const dynamic = "force-dynamic";

export type LessonNoteRow = {
  id: string;
  className: string;
  subject: string;
  title: string;
  fileName: string;
  fileSize: number | null;
  createdAt: Date | string;
  uploadedBy: { fullName: string } | null;
};

export default async function AdminLessonNotesPage() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") redirect("/dashboard");

  const [notes, dbClasses] = await Promise.all([
    prisma.lessonNote.findMany({
      where: { isActive: true },
      select: {
        id: true,
        className: true,
        subject: true,
        title: true,
        fileName: true,
        fileSize: true,
        createdAt: true,
        uploadedBy: { select: { fullName: true } },
      },
      orderBy: [{ className: "asc" }, { subject: "asc" }],
    }),
    prisma.class.findMany({ select: { name: true }, orderBy: { level: "asc" } }),
  ]);

  const classNames = Array.from(
    new Set([...dbClasses.map((c) => c.name), "PreNursery", ...notes.map((n) => n.className)]),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Lesson notes</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Upload and manage lesson-note PDFs. Files are private — only logged-in teachers of the
          matching class (and admins) can open them.
        </p>
      </div>

      <LessonNotesManager notes={notes} classNames={classNames} />
    </div>
  );
}