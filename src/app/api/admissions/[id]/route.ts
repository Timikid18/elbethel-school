import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "INTERVIEW",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
  "ENROLLED",
] as const;

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;
  if (!userId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  if (!STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const application = await prisma.admissionApplication.findUnique({
    where: { id },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: body.status,
      reviewedBy: userId,
      reviewedAt: new Date(),
    },
    select: { id: true, applicationNo: true, status: true },
  });

  return NextResponse.json({ success: true, application: updated });
}