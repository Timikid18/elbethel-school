import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";
import { inferDivision } from "@/lib/lesson-notes";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 25_000_000;

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const className = String(formData.get("className") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A PDF file is required" }, { status: 400 });
  }
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }
  if (!className) return NextResponse.json({ error: "Class is required" }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Subject is required" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ error: "The file is empty" }, { status: 400 });
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "File is too large (max 25 MB)" }, { status: 413 });
  }

  const note = await prisma.lessonNote.create({
    data: {
      className,
      division: inferDivision(className),
      subject,
      title: `${subject} — Lesson Notes`,
      fileName: file.name,
      contentType: "application/pdf",
      fileSize: buffer.length,
      fileData: buffer,
      uploadedById: actorId,
    },
    select: {
      id: true,
      className: true,
      division: true,
      subject: true,
      title: true,
      fileName: true,
      contentType: true,
      fileSize: true,
      isActive: true,
      createdAt: true,
    },
  });

  await writeAudit({
    userId: actorId,
    action: "CREATE",
    entity: "LessonNote",
    entityId: note.id,
    metadata: { className, subject, fileName: file.name, fileSize: buffer.length },
  });

  return NextResponse.json({ success: true, note });
}