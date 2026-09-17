import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  if (!userId || !role) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const note = await prisma.lessonNote.findFirst({
    where: { id, isActive: true },
  });
  if (!note) return new Response("Not found", { status: 404 });

  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  if (!isAdmin) {
    if (role !== "TEACHER") return new Response("Forbidden", { status: 403 });

    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      select: { classTeacher: { select: { name: true } } },
    });
    const ownClassNames = (teacher?.classTeacher ?? []).map((c) => c.name);
    if (!ownClassNames.includes(note.className)) {
      return new Response("Forbidden", { status: 403 });
    }
  }

  return new Response(note.fileData, {
    headers: {
      "Content-Type": note.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${note.fileName}"`,
      "Content-Length": String(note.fileSize ?? note.fileData.length),
      "Cache-Control": "private, no-store",
    },
  });
}