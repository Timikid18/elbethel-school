import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (typeof body.isPinned !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const announcement = await prisma.announcement.update({
    where: { id },
    data: { isPinned: body.isPinned },
  });

  await writeAudit({
    userId: actorId,
    action: "UPDATE",
    entity: "Announcement",
    entityId: id,
    metadata: { isPinned: body.isPinned },
  });

  return NextResponse.json({ success: true, announcement });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });

  await writeAudit({
    userId: actorId,
    action: "DELETE",
    entity: "Announcement",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}