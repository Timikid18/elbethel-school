import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { autoEnrollApplication, UserError } from "@/lib/users";
import { writeAudit } from "@/lib/moderation";

// Ordered workflow: Enrolled precedes Accepted (student must be enrolled first).
const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "INTERVIEW",
  "ENROLLED",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
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

  try {
    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        status: body.status,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
      select: { id: true, applicationNo: true, status: true, studentId: true },
    });

    // Accepting a fully enrolled student promotes them into a login + class roster.
    let credentials: { email: string; password: string } | null = null;
    if (body.status === "ACCEPTED") {
      if (!updated.studentId) {
        const enrolled = await autoEnrollApplication(id);
        credentials = { email: enrolled.email, password: enrolled.password };
      }
      await writeAudit({
        userId,
        action: "UPDATE",
        entity: "AdmissionApplication",
        entityId: id,
        metadata: { status: "ACCEPTED", autoEnrolled: true },
      });
    } else {
      await writeAudit({
        userId,
        action: "UPDATE",
        entity: "AdmissionApplication",
        entityId: id,
        metadata: { status: body.status },
      });
    }

    return NextResponse.json({ success: true, application: updated, credentials });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[api/admissions] status update failed", error);
    return NextResponse.json({ error: "Could not update the application" }, { status: 500 });
  }
}