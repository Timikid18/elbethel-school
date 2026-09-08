import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { approveChangeRequest, rejectChangeRequest, writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const reviewerId = session?.user?.id;
  if (!reviewerId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    if (body.action === "approve") {
      const req = await approveChangeRequest(id, reviewerId, body.note);
      await writeAudit({
        userId: reviewerId,
        action: "APPROVE",
        entity: "ChangeRequest",
        entityId: id,
        metadata: { entityType: req.entityType, summary: req.summary },
      });
      return NextResponse.json({ success: true, status: "APPROVED" });
    }

    const req = await rejectChangeRequest(id, reviewerId, String(body.note ?? ""));
    await writeAudit({
      userId: reviewerId,
      action: "REJECT",
      entity: "ChangeRequest",
      entityId: id,
      metadata: { entityType: req.entityType, summary: req.summary },
    });
    return NextResponse.json({ success: true, status: "REJECTED" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not review request";
    if (message === "Change request not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message === "Change request already reviewed") {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error("[api/change-requests] review failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}