import { NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeAudit } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 4_500_000;

export async function POST(request: Request) {
  const session = await auth();
  const role = session?.user?.role;
  const actorId = session?.user?.id;
  if (!actorId || (role !== "SUPER_ADMIN" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const caption = String(body.caption ?? "").trim();
  const dataUrl = String(body.dataUrl ?? "");
  const alt = body.alt ? String(body.alt).trim() : null;

  if (!caption) return NextResponse.json({ error: "Caption is required" }, { status: 400 });
  const match = /^data:(image\/(?:png|jpe?g|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) return NextResponse.json({ error: "Invalid image data" }, { status: 400 });

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large. Compress it and try again." }, { status: 413 });
  }

  let webp: Buffer;
  let meta;
  try {
    webp = await sharp(buffer, { limitInputPixels: 60_000_000 })
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    meta = await sharp(webp).metadata();
  } catch {
    return NextResponse.json({ error: "Could not process the image" }, { status: 400 });
  }

  const stored = `data:image/webp;base64,${webp.toString("base64")}`;

  const image = await prisma.galleryImage.create({
    data: {
      caption,
      alt,
      dataUrl: stored,
      width: meta?.width ?? body.width ?? null,
      height: meta?.height ?? body.height ?? null,
      uploaderId: actorId,
    },
  });

  await writeAudit({
    userId: actorId,
    action: "CREATE",
    entity: "GalleryImage",
    entityId: image.id,
    metadata: { caption },
  });

  return NextResponse.json({ success: true, image });
}