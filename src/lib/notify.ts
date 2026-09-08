import { prisma } from "./prisma";
import nodemailer from "nodemailer";

export type NewApplication = {
  applicationNo: string;
  studentName: string;
  classApplying: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
};

export type NewContactMessage = {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
};

/** Insert a notification row for every admin account. */
async function notifyAdmins(type: "ADMISSION" | "SYSTEM", title: string, message: string, link: string) {
  const admins = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN"] }, status: "ACTIVE" },
    select: { id: true },
  });
  if (admins.length === 0) return;

  await prisma.userNotification.createMany({
    data: admins.map((admin) => ({
      userId: admin.id,
      type,
      title,
      message,
      link,
    })),
  });
}

/** Best-effort email via SMTP if configured; no-op otherwise. */
async function sendEmail(to: string, subject: string, text: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? "no-reply@elbethel.edu";

  if (!host || !user || !pass || !to) {
    console.info(`[notify] SMTP not configured; skipping email to ${to} (${subject})`);
    return;
  }

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  await transporter.sendMail({ from, to, subject, text });
}

/**
 * Best-effort WhatsApp message via the Twilio Messaging API (no SDK needed).
 * Expects env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 * (e.g. "whatsapp:+14155238886") and TWILIO_WHATSAPP_TO (e.g. "whatsapp:+234...").
 */
async function sendWhatsApp(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const target = process.env.TWILIO_WHATSAPP_TO ?? to;

  if (!sid || !auth || !from || !target) {
    console.info(`[notify] Twilio WhatsApp not configured; skipping WhatsApp to ${target}`);
    return;
  }

  const params = new URLSearchParams({ From: from, To: target, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + Buffer.from(`${sid}:${auth}`).toString("base64"),
    },
    body: params.toString(),
  });
  if (!res.ok) {
    throw new Error(`Twilio API responded ${res.status}: ${await res.text()}`);
  }
}

const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "";

export async function notifyAdminsOfNewApplication(app: NewApplication) {
  const line = [
    `A new admission application has been submitted.`,
    ``,
    `Application No: ${app.applicationNo}`,
    `Student: ${app.studentName}`,
    `Class applying: ${app.classApplying}`,
    `Parent: ${app.parentName}`,
    `Parent phone: ${app.parentPhone}`,
    `Parent email: ${app.parentEmail ?? "—"}`,
    ``,
    `Review it in the admin portal: /admin/admissions`,
  ].join("\n");

  await notifyAdmins(
    "ADMISSION",
    `New application ${app.applicationNo}`,
    `New admission application from ${app.parentName} for ${app.studentName} (${app.classApplying}).`,
    "/admin/admissions",
  );

  await sendEmail(ADMIN_NOTIFY_EMAIL, `New admission application ${app.applicationNo}`, line);
  await sendWhatsApp(
    app.parentPhone,
    `New admission application ${app.applicationNo}: ${app.studentName} (${app.classApplying}) from ${app.parentName}. Review: /admin/admissions`,
  );
}

export async function notifyAdminsOfContactMessage(message: NewContactMessage) {
  const line = [
    `New contact message from the school website.`,
    ``,
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Phone: ${message.phone ?? "—"}`,
    `Subject: ${message.subject}`,
    ``,
    message.message,
  ].join("\n");

  await notifyAdmins(
    "SYSTEM",
    `New contact message: ${message.subject}`,
    `${message.name} (${message.email}) sent a contact message.`,
    "/admin/contact",
  );

  await sendEmail(ADMIN_NOTIFY_EMAIL, `New contact message from ${message.name}`, line);
  await sendWhatsApp(
    message.phone ?? "",
    `New contact message "${message.subject}" from ${message.name} (${message.email}). Review: /admin/contact`,
  );
}