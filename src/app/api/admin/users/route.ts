import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createUserAccount, UserError } from "@/lib/users";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;
  if (!userId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    const user = await createUserAccount({
      fullName: String(body.fullName ?? ""),
      email: String(body.email ?? ""),
      password: String(body.password ?? ""),
      role: body.role,
      phone: body.phone ? String(body.phone) : undefined,
    });

    await writeAudit({
      userId,
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/admin/users] create failed", error);
    return NextResponse.json({ error: "Could not create the account" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}