import { tool, type Tool } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export type AiCtx = { role?: Role; userId?: string };

function isStaff(role?: Role) {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "TEACHER";
}

function isAdmin(role?: Role) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Build the subset of tools the current user is allowed to use. */
export function buildTools(ctx: AiCtx) {
  const { role, userId } = ctx;
  const tools: Record<string, Tool> = {};

  // ---------- Public ----------

  tools.upcomingEvents = tool({
    description:
      "List the school's next public events (date, title, location, description). Use for questions like 'what events are coming up?' or 'when is the next event?'",
    inputSchema: z.object({}),
    execute: async () => {
      const events = await prisma.event.findMany({
        where: { isPublic: true, startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: 6,
        select: { title: true, startDate: true, location: true, description: true },
      });
      if (events.length === 0) {
        return "No upcoming events are currently published on the website.";
      }
      return events
        .map(
          (e) =>
            `- ${fmtDate(e.startDate)}: ${e.title}${e.location ? ` (${e.location})` : ""}${
              e.description ? ` — ${e.description}` : ""
            }`,
        )
        .join("\n");
    },
  });

  tools.publicAnnouncements = tool({
    description:
      "Return the latest general announcements that are visible to everyone on the public site.",
    inputSchema: z.object({}),
    execute: async () => {
      const items = await prisma.announcement.findMany({
        where: { audience: "EVERYONE" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, body: true, createdAt: true },
      });
      if (items.length === 0) return "No public announcements are published yet.";
      return items
        .map((a) => `- ${fmtDate(a.createdAt)} — ${a.title}: ${a.body.slice(0, 300)}`)
        .join("\n");
    },
  });

  // ---------- Staff / teachers ----------

  if (isStaff(role)) {
    tools.searchStudents = tool({
      description:
        "Search students by name or admission number. Returns name, admission number, class, gender and date of birth.",
      inputSchema: z.object({
        query: z.string().describe("Full or partial name, or admission number"),
      }),
      execute: async ({ query }) => {
        const q = query.trim();
        if (!q) return "Provide a name or admission number to search.";
        const students = await prisma.student.findMany({
          where: {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { admissionNumber: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 10,
          select: {
            firstName: true,
            lastName: true,
            admissionNumber: true,
            gender: true,
            dateOfBirth: true,
            class: { select: { name: true } },
          },
        });
        if (students.length === 0) return `No students matched "${q}".`;
        return students
          .map(
            (s) =>
              `- ${s.firstName} ${s.lastName} | Adm: ${s.admissionNumber} | Class: ${
                s.class?.name ?? "Not assigned"
              } | Gender: ${s.gender} | DOB: ${s.dateOfBirth ? fmtDate(s.dateOfBirth) : "N/A"}`,
          )
          .join("\n");
      },
    });

    tools.classRoster = tool({
      description:
        "Show the student roster of a class (e.g. 'Grade 5'). Teachers can only view classes they are form teacher of.",
      inputSchema: z.object({
        className: z.string().describe("Class name such as 'Grade 5', 'JSS 1' or 'SSS 1'"),
      }),
      execute: async ({ className }) => {
        const teacherAccess = await allowedClassNamesOrError(userId, role!);
        const klass = await prisma.class.findFirst({
          where: {
            name: className.trim(),
            ...(teacherAccess ? { name: { in: teacherAccess } } : {}),
          },
          select: { id: true, name: true },
        });
        if (!klass) {
          return teacherAccess
            ? `Class "${className}" not found, or you are not the form teacher of that class. Your classes: ${teacherAccess.join(", ")}.`
            : `No class named "${className}" exists.`;
        }
        const students = await prisma.student.findMany({
          where: { classId: klass.id, isArchived: false },
          orderBy: { lastName: "asc" },
          select: { firstName: true, lastName: true, admissionNumber: true, gender: true },
        });
        if (students.length === 0) return `${klass.name} has no students yet.`;
        const lines = students.map(
          (s, i) => `${i + 1}. ${s.lastName} ${s.firstName} (${s.gender}) — Adm ${s.admissionNumber}`,
        );
        return `${klass.name} — ${students.length} students\n${lines.join("\n")}`;
      },
    });

    tools.attendanceSummary = tool({
      description:
        "Return attendance status for a class on a given date (default today): PRESENT, ABSENT, LATE, EXCUSED, or Not recorded.",
      inputSchema: z.object({
        className: z.string().describe("Class name such as 'Grade 5'"),
        date: z
          .string()
          .optional()
          .describe("Date in YYYY-MM-DD format; leave empty for today"),
      }),
      execute: async ({ className, date }) => {
        const teacherAccess = await allowedClassNamesOrError(userId, role!);
        const klass = await prisma.class.findFirst({
          where: {
            name: className.trim(),
            ...(teacherAccess ? { name: { in: teacherAccess } } : {}),
          },
          select: { id: true, name: true },
        });
        if (!klass) return `No class named "${className}" exists.`;
        const day = date ? new Date(`${date}T00:00:00`) : new Date();
        day.setHours(0, 0, 0, 0);
        const next = new Date(day);
        next.setDate(next.getDate() + 1);

        const [students, records] = await Promise.all([
          prisma.student.findMany({
            where: { classId: klass.id, isArchived: false },
            orderBy: { lastName: "asc" },
            select: { id: true, firstName: true, lastName: true },
          }),
          prisma.attendance.findMany({
            where: { classId: klass.id, date: { gte: day, lt: next } },
            select: { studentId: true, status: true },
          }),
        ]);
        const byStudent = new Map(records.map((r) => [r.studentId, r.status]));
        const lines = students.map(
          (s) => `- ${s.lastName} ${s.firstName}: ${byStudent.get(s.id) ?? "Not recorded"}`,
        );
        return `${klass.name} attendance for ${fmtDate(day)}:\n${lines.join("\n")}`;
      },
    });

    tools.announcementsForRole = tool({
      description:
        "Return announcements relevant to the logged-in user's role and class, newest first.",
      inputSchema: z.object({}),
      execute: async () => await announcementsFor(ctx),
    });
  }

  // ---------- Admin / super admin ----------

  if (isAdmin(role)) {
    tools.admissionsQueue = tool({
      description:
        "List admission applications, newest first, optionally filtered by status (SUBMITTED, UNDER_REVIEW, INTERVIEW, ENROLLED, ACCEPTED, WAITLISTED, REJECTED).",
      inputSchema: z.object({
        status: z.string().optional().describe("Optional application status filter"),
      }),
      execute: async ({ status }) => {
        const apps = await prisma.admissionApplication.findMany({
          where: status ? { status: status as never } : {},
          orderBy: { createdAt: "desc" },
          take: 15,
          select: {
            applicationNo: true,
            firstName: true,
            lastName: true,
            classApplying: true,
            parentPhone: true,
            status: true,
            createdAt: true,
          },
        });
        if (apps.length === 0) return `No admission applications${status ? ` with status ${status}` : ""}.`;
        return apps
          .map(
            (a) =>
              `- ${a.applicationNo} | ${a.firstName} ${a.lastName} | Applying: ${a.classApplying} | ${a.status} | Parent: ${a.parentPhone} | Submitted ${fmtDate(a.createdAt)}`,
          )
          .join("\n");
      },
    });

    tools.studentDetails = tool({
      description:
        "Full record for one student (find by name or admission number): profile, class, latest result and payments.",
      inputSchema: z.object({
        query: z.string().describe("Full or partial student name, or admission number"),
      }),
      execute: async ({ query }) => {
        const q = query.trim();
        const student = await prisma.student.findFirst({
          where: {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { admissionNumber: { contains: q, mode: "insensitive" } },
            ],
          },
          include: {
            class: { select: { name: true } },
            results: {
              orderBy: { term: { startDate: "desc" } },
              take: 1,
              include: {
                term: { select: { name: true } },
                items: {
                  include: { subject: { select: { name: true } } },
                },
              },
            },
            payments: { orderBy: { datePaid: "desc" }, take: 5 },
          },
        });
        if (!student) return `No student matched "${q}".`;
        const lines = [
          `${student.firstName} ${student.lastName}`,
          `Admission no: ${student.admissionNumber} | Class: ${student.class?.name ?? "Not assigned"} | Gender: ${student.gender}`,
          `DOB: ${student.dateOfBirth ? fmtDate(student.dateOfBirth) : "N/A"} | Address: ${student.address ?? "N/A"}`,
        ];
        const result = student.results[0];
        lines.push(
          result
            ? `Latest result (${result.term.name}, ${result.status}):\n` +
                result.items
                  .map((i) => `  - ${i.subject.name}: ${i.score} ${i.grade ? `(${i.grade})` : ""}`)
                  .join("\n")
            : "Latest result: none recorded yet.",
        );
        lines.push(
          student.payments.length
            ? `Recent payments:\n` + student.payments.map((p) => `  - ${fmtDate(p.datePaid)}: ${p.amount} ${p.feeType ?? ""}`).join("\n")
            : "Payments: none recorded.",
        );
        return lines.join("\n");
      },
    });

    tools.feeStructure = tool({
      description:
        "Return the currently active fee structure (fee name, amount, class, term/session if set).",
      inputSchema: z.object({}),
      execute: async () => {
        const fees = await prisma.feeStructure.findMany({
          where: { isActive: true },
          orderBy: { amount: "asc" },
          select: { name: true, amount: true, classId: true, termId: true, sessionId: true, description: true },
        });
        if (fees.length === 0) {
          return "No fee schedule has been published yet. Advise the caller to ask the admissions office about current fees.";
        }
        return fees.map((f) => `- ${f.name}: ${f.amount}${f.description ? ` (${f.description})` : ""}`).join("\n");
      },
    });
  }

  // ---------- Parent ----------

  if (role === "PARENT") {
    tools.myChildren = tool({
      description:
        "Return the logged-in parent's children, their class and their most recent attendance.",
      inputSchema: z.object({}),
      execute: async () => await myChildrenInfo(userId),
    });
  }

  return tools;
}

// ---------- Shared helpers ----------

async function allowedClassNamesOrError(userId?: string, role?: Role): Promise<string[] | null> {
  if (role === "TEACHER" && userId) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!teacher) return [];
    const classes = await prisma.class.findMany({
      where: { classTeacherId: teacher.id },
      select: { name: true },
    });
    return classes.map((c) => c.name);
  }
  return null;
}

async function myChildrenInfo(userId?: string) {
  if (!userId) return "You are not signed in.";
  const parent = await prisma.parentProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!parent) return "No parent profile found for your account.";
  const links = await prisma.parentChild.findMany({
    where: { parentId: parent.id },
    select: { student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true, class: { select: { name: true } } } } },
  });
  if (links.length === 0) return "No children are linked to your account yet.";
  const lines = [];
  for (const { student } of links) {
    const last = await prisma.attendance.findFirst({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
      select: { date: true, status: true },
    });
    lines.push(
      `- ${student.firstName} ${student.lastName} (${student.admissionNumber}) — Class: ${student.class?.name ?? "Not assigned"}${
        last ? ` | Last attendance (${fmtDate(last.date)}): ${last.status}` : ""
      }`,
    );
  }
  return lines.join("\n");
}

async function announcementsFor(ctx: AiCtx) {
  const { role, userId } = ctx;
  try {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      const items = await prisma.announcement.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { title: true, body: true, audience: true, createdAt: true },
      });
      return items.map((a) => `- ${fmtDate(a.createdAt)} [${a.audience}] ${a.title}: ${a.body.slice(0, 200)}`).join("\n");
    }

    if (role === "TEACHER" && userId) {
      const teacher = await prisma.teacher.findUnique({ where: { userId }, select: { id: true } });
      const classIds = teacher
        ? (await prisma.class.findMany({ where: { classTeacherId: teacher.id }, select: { id: true } })).map((c) => c.id)
        : [];
      const items = await prisma.announcement.findMany({
        where: {
          OR: [
            { audience: { in: ["EVERYONE", "TEACHERS"] } },
            { audience: "CLASS", classId: { in: classIds.length ? classIds : ["__none__"] } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { title: true, body: true, audience: true, createdAt: true },
      });
      return items.map((a) => `- ${fmtDate(a.createdAt)} [${a.audience}] ${a.title}: ${a.body.slice(0, 200)}`).join("\n");
    }

    if (role === "PARENT" && userId) {
      const parent = await prisma.parentProfile.findUnique({ where: { userId }, select: { id: true } });
      const classIds = parent
        ? (await prisma.parentChild.findMany({
            where: { parentId: parent.id },
            select: { student: { select: { classId: true } } },
          }))
            .map((l) => l.student.classId)
            .filter((v): v is string => Boolean(v))
        : [];
      const items = await prisma.announcement.findMany({
        where: {
          OR: [
            { audience: { in: ["EVERYONE", "PARENTS"] } },
            { audience: "CLASS", classId: { in: classIds.length ? classIds : ["__none__"] } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { title: true, body: true, audience: true, createdAt: true },
      });
      return items.map((a) => `- ${fmtDate(a.createdAt)} [${a.audience}] ${a.title}: ${a.body.slice(0, 200)}`).join("\n");
    }

    if (role === "STUDENT" && userId) {
      const student = await prisma.student.findUnique({ where: { userId }, select: { classId: true } });
      const items = await prisma.announcement.findMany({
        where: {
          OR: [
            { audience: { in: ["EVERYONE", "STUDENTS"] } },
            { audience: "CLASS", classId: student?.classId ?? "__none__" },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { title: true, body: true, audience: true, createdAt: true },
      });
      return items.map((a) => `- ${fmtDate(a.createdAt)} [${a.audience}] ${a.title}: ${a.body.slice(0, 200)}`).join("\n");
    }

    const items = await prisma.announcement.findMany({
      where: { audience: "EVERYONE" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { title: true, body: true, createdAt: true },
    });
    return items.map((a) => `- ${fmtDate(a.createdAt)} ${a.title}: ${a.body.slice(0, 200)}`).join("\n");
  } catch (error) {
    console.error("[ai/announcementsFor]", error);
    return "Sorry, I could not load announcements right now.";
  }
}