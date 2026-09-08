import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const AUDIENCES = ["EVERYONE", "STUDENTS", "PARENTS", "TEACHERS", "CLASS"] as const;

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const text = String(body.body ?? "").trim();

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!text) return NextResponse.json({ error: "Announcement body is required" }, { status: 400 });
  if (!AUDIENCES.includes(body.audience)) {
    return NextResponse.json({ error: "Invalid audience" }, { status: 400 });
  }
  if (body.audience === "CLASS" && !body.classId) {
    return NextResponse.json({ error: "Choose a class for class-targeted announcements" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body: text,
      audience: body.audience,
      classId: body.audience === "CLASS" ? String(body.classId) : null,
      isPinned: Boolean(body.isPinned),
      authorId: actorId,
      createdById: actorId,
    },
  });

  await writeAudit({
    userId: actorId,
    action: "CREATE",
    entity: "Announcement",
    entityId: announcement.id,
    metadata: { title, audience: body.audience },
  });

  return NextResponse.json({ success: true, announcement });
}