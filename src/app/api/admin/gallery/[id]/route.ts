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

  const data: { isPublished?: boolean; caption?: string; alt?: string } = {};
  if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;
  if (typeof body.caption === "string" && body.caption.trim()) data.caption = body.caption.trim();
  if (typeof body.alt === "string") data.alt = body.alt.trim() || null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const image = await prisma.galleryImage.update({
    where: { id },
    data,
    select: { id: true, caption: true, isPublished: true },
  });

  await writeAudit({
    userId: actorId,
    action: "UPDATE",
    entity: "GalleryImage",
    entityId: id,
    metadata: data,
  });

  return NextResponse.json({ success: true, image });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });

  await writeAudit({
    userId: actorId,
    action: "DELETE",
    entity: "GalleryImage",
    entityId: id,
  });

  return NextResponse.json({ success: true });
}