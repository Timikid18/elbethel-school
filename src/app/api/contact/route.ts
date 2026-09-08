import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdminsOfContactMessage } from "@/lib/notify";

const contactSchema: Record<string, "string" | "optional"> = {
  name: "string",
  email: "string",
  phone: "optional",
  subject: "string",
  message: "string",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    for (const key of Object.keys(contactSchema)) {
      const value = body[key as keyof typeof contactSchema];
      if (contactSchema[key] === "optional") {
        if (value !== undefined && value !== null && typeof value !== "string") {
          return NextResponse.json(
            { error: "Enter a valid phone number" },
            { status: 400 },
          );
        }
        continue;
      }
      if (typeof value !== "string" || !value.trim()) {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 },
        );
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 },
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: body.name.trim().slice(0, 200),
        email: body.email.trim().slice(0, 254),
        phone: (body.phone ?? "").trim().slice(0, 30) || null,
        subject: body.subject.trim().slice(0, 200),
        message: body.message.trim().slice(0, 5000),
      },
      select: { id: true },
    });

    void notifyAdminsOfContactMessage({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: (body.phone ?? "").trim() || null,
      subject: body.subject.trim(),
      message: body.message.trim(),
    }).catch((error) => {
      console.error("Contact notification failed:", error);
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact message failed:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}