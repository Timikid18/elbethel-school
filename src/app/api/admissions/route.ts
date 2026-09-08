import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/admission-schema";
import { notifyAdminsOfNewApplication } from "@/lib/notify";

function emptyToNull(value: string | undefined | null): string | null {
  if (!value || value.trim() === "") return null;
  return value.trim();
}

async function nextApplicationNo(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `EBK-${year}-`;

  const [latest, count] = await Promise.all([
    prisma.admissionApplication.findFirst({
      where: { applicationNo: { startsWith: prefix } },
      orderBy: { createdAt: "desc" },
      select: { applicationNo: true },
    }),
    prisma.admissionApplication.count({
      where: { applicationNo: { startsWith: prefix } },
    }),
  ]);

  // Prefer a strictly increasing sequence based on last issued number.
  let nextNumber = count + 1;
  if (latest) {
    const lastSeq = parseInt(latest.applicationNo.slice(prefix.length), 10);
    if (!Number.isNaN(lastSeq) && lastSeq >= nextNumber) nextNumber = lastSeq + 1;
  }

  for (let attempt = 0; attempt < 25; attempt++) {
    const candidate = `${prefix}${String(nextNumber).padStart(5, "0")}`;
    const exists = await prisma.admissionApplication.findUnique({
      where: { applicationNo: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    nextNumber += 1;
  }

  throw new Error("Could not allocate a unique application number");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const applicationNo = await nextApplicationNo();

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: emptyToNull(data.gender),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        classApplying: data.classApplying,
        previousSchool: emptyToNull(data.previousSchool),
        studentAddress: emptyToNull(data.studentAddress),
        parentFirstName: data.parentFirstName,
        parentLastName: data.parentLastName,
        parentPhone: data.parentPhone,
        parentEmail: emptyToNull(data.parentEmail),
        parentOccupation: emptyToNull(data.parentOccupation),
        emergencyContactName: emptyToNull(data.emergencyContactName),
        emergencyContactPhone: emptyToNull(data.emergencyContactPhone),
      },
      select: { id: true, applicationNo: true, parentPhone: true },
    });

    // Fire-and-forget in-app + email notification to admins.
    void notifyAdminsOfNewApplication({
      applicationNo: application.applicationNo,
      studentName: `${data.firstName} ${data.lastName}`,
      classApplying: data.classApplying,
      parentName: `${data.parentFirstName} ${data.parentLastName}`,
      parentPhone: data.parentPhone,
      parentEmail: data.parentEmail ?? null,
    }).catch((error) => {
      console.error("Admin notification failed:", error);
    });

    return NextResponse.json(
      {
        success: true,
        applicationNo: application.applicationNo,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admission application failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}