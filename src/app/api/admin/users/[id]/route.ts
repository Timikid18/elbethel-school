import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  UserError,
  resetUserPassword,
  deleteUserAccount,
  isLastSuperAdmin,
  ROLES,
} from "@/lib/users";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  try {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data: Record<string, string | null> = {};

    if (body.fullName !== undefined) data.fullName = String(body.fullName).trim() || target.fullName;
    if (body.phone !== undefined) data.phone = String(body.phone).trim() || null;

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      if (body.status === "SUSPENDED" && id === actorId) {
        return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });
      }
      if (body.status !== "ACTIVE" && id !== actorId && (await isLastSuperAdmin(id))) {
        return NextResponse.json(
          { error: "You cannot deactivate the last active Super Admin" },
          { status: 400 },
        );
      }
      data.status = body.status;
    }

    if (body.role !== undefined) {
      if (!ROLES.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      if (body.role !== target.role && (await isLastSuperAdmin(id)) && body.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "You cannot demote the last active Super Admin" },
          { status: 400 },
        );
      }
      data.role = body.role;
    }

    if (body.password !== undefined) {
      await resetUserPassword(id, String(body.password));
    }

    let updated = target;
    if (Object.keys(data).length > 0) {
      updated = await prisma.user.update({ where: { id }, data });
    }

    await writeAudit({
      userId: actorId,
      action: "UPDATE",
      entity: "User",
      entityId: id,
      metadata: { keys: Object.keys(data), passwordReset: body.password !== undefined },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        phone: updated.phone,
        role: updated.role,
        status: updated.status,
      },
    });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/admin/users] update failed", error);
    return NextResponse.json({ error: "Could not update the account" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (id === actorId) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  try {
    const deleted = await deleteUserAccount(id);
    await writeAudit({
      userId: actorId,
      action: "DELETE",
      entity: "User",
      entityId: id,
      metadata: { email: deleted.email },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/admin/users] delete failed", error);
    return NextResponse.json(
      { error: "Could not delete the account. Check that it has no linked records." },
      { status: 500 },
    );
  }
}