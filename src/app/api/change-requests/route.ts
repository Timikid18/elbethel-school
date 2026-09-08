import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function pick<T extends Record<string, unknown>>(payload: T, keys: readonly string[]) {
  const out: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in payload && payload[key] !== undefined) out[key] = payload[key];
  }
  return out;
}

export async function POST(request: Request) {
  const session = await auth();
  const actorId = session?.user?.id;
  if (!actorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { entityType, actionType } = body as { entityType?: string; actionType?: string };
  const summary = String(body.summary ?? "").trim();
  if (!summary) return NextResponse.json({ error: "A summary is required" }, { status: 400 });

  // Currently teachers submit class announcements and profile edits for review.
  if (entityType === "CLASS_ANNOUNCEMENT" && actionType === "CREATE") {
    const payload = pick(body.payload ?? {}, ["title", "body", "classId", "isPinned"]);
    if (!String(payload.title ?? "").trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!String(payload.body ?? "").trim()) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (!payload.classId) return NextResponse.json({ error: "Choose the target class" }, { status: 400 });

    const requestRow = await prisma.changeRequest.create({
      data: {
        entityType: "CLASS_ANNOUNCEMENT",
        actionType: "CREATE",
        summary,
        payload: payload as Prisma.InputJsonValue,
        requesterId: actorId,
      },
    });

    await writeAudit({
      userId: actorId,
      action: "SUBMIT",
      entity: "ChangeRequest",
      entityId: requestRow.id,
      metadata: { entityType, summary },
    });

    return NextResponse.json({ success: true, request: requestRow }, { status: 201 });
  }

  if (entityType === "PROFILE" && actionType === "UPDATE") {
    const payload = pick(body.payload ?? {}, ["fullName", "phone", "avatarUrl"]);
    if (body.entityId !== actorId) {
      return NextResponse.json({ error: "You can only request changes to your own profile" }, { status: 403 });
    }

    const requestRow = await prisma.changeRequest.create({
      data: {
        entityType: "PROFILE",
        actionType: "UPDATE",
        entityId: actorId,
        summary,
        payload: payload as Prisma.InputJsonValue,
        requesterId: actorId,
      },
    });

    await writeAudit({
      userId: actorId,
      action: "SUBMIT",
      entity: "ChangeRequest",
      entityId: requestRow.id,
      metadata: { entityType, summary },
    });

    return NextResponse.json({ success: true, request: requestRow }, { status: 201 });
  }

  return NextResponse.json(
    { error: "This type of change request is not supported yet. Contact an admin." },
    { status: 400 },
  );
}

export async function GET() {
  const session = await auth();
  const actorId = session?.user?.id;
  if (!actorId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.changeRequest.findMany({
    where: { requesterId: actorId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({ requests });
}