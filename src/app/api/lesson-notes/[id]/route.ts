import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const note = await prisma.lessonNote.findUnique({ where: { id }, select: { id: true } });
  if (!note) return NextResponse.json({ error: "Lesson note not found" }, { status: 404 });

  await prisma.lessonNote.delete({ where: { id } });

  await writeAudit({
    userId: actorId,
    action: "DELETE",
    entity: "LessonNote",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}